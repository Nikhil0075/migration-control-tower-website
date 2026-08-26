/**
 * Asset pipeline.
 *
 * Reads the read-only artifact archive that ships with the project and produces
 * web-ready media in public/media, plus a generated manifest at src/data/media.ts
 * carrying intrinsic dimensions so next/image never causes layout shift.
 *
 * Run: npm run assets
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.resolve(ROOT, "..", "shareed-artifacts-for -website");
// Media sourced after the original export (e.g. generated in OpenArt). The
// archive above stays read-only; anything new lives here. See assets-src/README.
const SRC_EXTRA = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "public", "media");

const log = (...a) => console.log("  ", ...a);

async function ensure(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------- images -- */

/** Resize + convert to webp at the given widths. Returns intrinsic size of the largest. */
async function image(from, toBase, widths, quality = 82) {
  const py = `
import sys
from PIL import Image
src, base = sys.argv[1], sys.argv[2]
widths = [int(w) for w in sys.argv[3].split(',')]
q = int(sys.argv[4])
im = Image.open(src)
if im.mode not in ('RGB', 'RGBA'):
    im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
ow, oh = im.size
for w in widths:
    if w >= ow:
        out = im
        tw, th = ow, oh
    else:
        th = round(oh * w / ow)
        tw = w
        out = im.resize((tw, th), Image.LANCZOS)
    suffix = '' if w == widths[0] else f'-{w}'
    out.save(f'{base}{suffix}.webp', 'WEBP', quality=q, method=6)
print(f'{ow},{oh}')
`;
  const { stdout } = await exec("python3", ["-c", py, from, toBase, widths.join(","), String(quality)]);
  const [w, h] = stdout.trim().split(",").map(Number);
  return { w, h };
}

/**
 * Crop to a 4:5 portrait centred on the subject's face.
 *
 * `focus` is where the face sits in the SOURCE, as a fraction from the top.
 * There is no single rule that works for every photo: a tight headshot has the
 * face near the top, while a tall phone snapshot can have the subject low under
 * a lot of sky. So each photo declares its own focal point and the crop is
 * placed so the face lands on the upper third of the final frame, which is
 * where a portrait wants it.
 */
async function portrait(from, toBase, focus = 0.4, widths = [1600, 800], quality = 84) {
  const py = `
import sys
from PIL import Image, ImageOps
src, base = sys.argv[1], sys.argv[2]
focus = float(sys.argv[3])
widths = [int(w) for w in sys.argv[4].split(',')]
q = int(sys.argv[5])

im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
ow, oh = im.size
target = 4 / 5

if ow / oh > target:                 # too wide: trim the sides, keep the centre
    nw = round(oh * target)
    left = (ow - nw) // 2
    im = im.crop((left, 0, left + nw, oh))
else:                                 # too tall: place the crop around the face
    nh = round(ow / target)
    face = focus * oh
    top = round(face - nh * 0.42)    # face on the upper third of the frame
    top = max(0, min(oh - nh, top))  # never run past either edge
    im = im.crop((0, top, ow, top + nh))

cw, ch = im.size
saved = None
for w in widths:
    out = im if w >= cw else im.resize((w, round(ch * w / cw)), Image.LANCZOS)
    suffix = '' if w == widths[0] else f'-{w}'
    out.save(f'{base}{suffix}.webp', 'WEBP', quality=q, method=6)
    if saved is None:
        saved = out.size   # report what was actually written, not the crop
print(f'{saved[0]},{saved[1]}')
`;
  const { stdout } = await exec("python3", [
    "-c", py, from, toBase, String(focus), widths.join(","), String(quality),
  ]);
  const [w, h] = stdout.trim().split(",").map(Number);
  return { w, h };
}

/* ---------------------------------------------------------------- videos -- */

async function probeDuration(file) {
  const { stdout } = await exec("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1", file,
  ]);
  return parseFloat(stdout.trim());
}

/**
 * One source film -> mp4 (H.264, faststart), webm (VP9) and a poster frame.
 *
 * The poster is taken at 55% of the duration by default: these films start dark
 * and light up, so frame 0 would be a black poster. A film with a one-way
 * narrative arc passes `posterAtFraction` near 0 instead, so the poster shows
 * the opening state and the reveal happens on screen rather than being spoiled
 * before playback starts.
 */
async function video(from, toBase, posterAtFraction = 0.55) {
  const duration = await probeDuration(from);
  const posterAt = Math.max(0.1, duration * posterAtFraction);

  await exec("ffmpeg", [
    "-y", "-i", from,
    "-c:v", "libx264", "-profile:v", "high", "-crf", "23", "-preset", "slow",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
    `${toBase}.mp4`,
  ]);

  await exec("ffmpeg", [
    "-y", "-i", from,
    "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0", "-row-mt", "1",
    "-deadline", "good", "-cpu-used", "2", "-an",
    `${toBase}.webm`,
  ]);

  await exec("ffmpeg", [
    "-y", "-ss", String(posterAt), "-i", from,
    "-frames:v", "1", "-q:v", "3", `${toBase}-poster.png`,
  ]);

  const size = await image(`${toBase}-poster.png`, `${toBase}-poster`, [1280], 78);
  await fs.rm(`${toBase}-poster.png`, { force: true });

  return { ...size, duration: Number(duration.toFixed(2)) };
}

/* -------------------------------------------------------------- sequence -- */

/**
 * A scroll-scrubbed film is not played — it is drawn, one frame at a time, onto
 * a canvas as the visitor scrolls.
 *
 * Seeking a normal <video> is unreliable and janky across browsers, and making
 * one seekable enough (all-intra H.264) costs 5.5 MB. A decoded frame sequence
 * costs half that and scrubs with zero seek latency anywhere.
 *
 * The frame rate is deliberately low: when the viewer controls the pace, per
 * frame sharpness matters far more than frames per second.
 */
async function sequence(from, outDir, { frames = 96, width = 1024, quality = 72 } = {}) {
  await ensure(outDir);
  const duration = await probeDuration(from);

  await exec("ffmpeg", [
    "-y", "-i", from,
    "-vf", `fps=${frames}/${duration},scale=${width}:-2`,
    "-q:v", "4",
    path.join(outDir, "f%03d.jpg"),
  ]);

  const py = `
import glob, os, sys
from PIL import Image
d, q = sys.argv[1], int(sys.argv[2])
files = sorted(glob.glob(os.path.join(d, 'f*.jpg')))
w = h = 0
for f in files:
    im = Image.open(f).convert('RGB')
    w, h = im.size
    im.save(f[:-4] + '.webp', 'WEBP', quality=q, method=6)
    os.remove(f)
print(f'{len(files)},{w},{h}')
`;
  const { stdout } = await exec("python3", ["-c", py, outDir, String(quality)]);
  const [count, w, h] = stdout.trim().split(",").map(Number);
  return { frames: count, w, h, duration: Number(duration.toFixed(2)) };
}

/* ------------------------------------------------------------------ main -- */

const manifest = { films: {}, shots: {}, diagrams: {}, agents: {}, empty: {}, brand: {}, sequences: {}, team: {} };

/**
 * Films sourced outside the archive:
 * [slug, filename under assets-src/film, posterAtFraction].
 */
const EXTRA_FILMS = [
  // Poster taken late: this shot ends with all seven modules lit, which is the
  // state worth showing before playback starts.
  ["agent-fleet", "agent-fleet.mp4", 0.9],
];

const FILMS = [
  ["dormant-estate", "Shot 1 — Dormant estate.mp4"],
  ["discovery-sweep", "Shot 2 — Discovery sweep.mp4"],
  ["fleet-activation", "Shot 3 — Fleet activation.mp4"],
  ["flow-and-fracture", "Shot 4 — Flow and fracture.mp4"],
  ["governed-release", "Shot 5 — Governed release.mp4"],
  ["completion", "Shot 6 — Completion.mp4"],
];

/**
 * Where each team member's face sits in their source photo, top to bottom.
 * Tune this rather than the crop maths when a portrait comes out badly framed.
 */
const TEAM_FOCUS = {
  nikhil: 0.40,   // tight headshot, face already high
  mousmi: 0.66,   // tall phone photo, subject low beneath a lot of sky
};

async function run() {
  if (!(await exists(SRC))) throw new Error(`Artifact archive not found at ${SRC}`);

  console.log("\n── films ──");
  await ensure(path.join(OUT, "film"));
  for (const [slug, file] of FILMS) {
    const from = path.join(SRC, "story", file);
    const to = path.join(OUT, "film", slug);
    if (await exists(`${to}.webm`)) {
      log(`${slug} (cached)`);
      manifest.films[slug] = manifest.films[slug] ?? { w: 1280, h: 720, duration: 4 };
      continue;
    }
    manifest.films[slug] = await video(from, to);
    log(slug, manifest.films[slug]);
  }

  for (const [slug, file, posterAt] of EXTRA_FILMS) {
    const from = path.join(SRC_EXTRA, "film", file);
    if (!(await exists(from))) {
      log(`${slug} (source missing, skipped)`);
      continue;
    }
    const to = path.join(OUT, "film", slug);
    if (await exists(`${to}.webm`)) {
      log(`${slug} (cached)`);
      manifest.films[slug] = manifest.films[slug] ?? { w: 1920, h: 1080, duration: 8 };
      continue;
    }
    manifest.films[slug] = await video(from, to, posterAt);
    log(slug, manifest.films[slug]);
  }

  const psFrom = path.join(SRC, "problem-solution-artifact", "Generated Video August 23, 2026 - 3_00PM.mp4");
  if (await exists(psFrom)) {
    const to = path.join(OUT, "film", "problem-solution");
    // 6%: this film opens on the dark, tangled aisle and reveals order as it
    // runs. Its poster must be the "before", not the "after".
    if (!(await exists(`${to}.webm`))) manifest.films["problem-solution"] = await video(psFrom, to, 0.06);
    else manifest.films["problem-solution"] = { w: 1280, h: 720, duration: 10 };
    log("problem-solution");

    // The hero scrubs this film against scroll, so it also ships as a frame
    // sequence. Only desktop loads it; small screens play the video instead.
    const seqDir = path.join(OUT, "sequence", "problem-solution");
    if (await exists(path.join(seqDir, "f001.webp"))) {
      manifest.sequences["problem-solution"] = { frames: 96, w: 1024, h: 576, duration: 10 };
      log("problem-solution sequence (cached)");
    } else {
      manifest.sequences["problem-solution"] = await sequence(psFrom, seqDir);
      log("problem-solution sequence", manifest.sequences["problem-solution"]);
    }
  }

  console.log("\n── console captures ──");
  await ensure(path.join(OUT, "shot"));
  const shotDir = path.join(SRC, "screenshot");
  for (const f of (await fs.readdir(shotDir)).filter((f) => f.endsWith(".png"))) {
    const slug = f.replace(/\.png$/, "").replace(/\./g, "-");
    manifest.shots[slug] = await image(
      path.join(shotDir, f), path.join(OUT, "shot", slug), [1600, 800]
    );
  }
  log(`${Object.keys(manifest.shots).length} captures`);

  console.log("\n── architecture diagrams ──");
  await ensure(path.join(OUT, "diagram"));
  const diagDir = path.join(SRC, "Architecture_diagrams");
  for (const f of (await fs.readdir(diagDir)).filter((f) => f.endsWith(".png"))) {
    const slug = f.replace(/\.png$/, "");
    manifest.diagrams[slug] = await image(
      path.join(diagDir, f), path.join(OUT, "diagram", slug), [2000, 900], 80
    );
    // A full-resolution copy for the zoomable viewer. These are 3840x2160
    // technical drawings whose node labels are unreadable at gallery size, so
    // the lightbox needs the real pixels — loaded only when it opens.
    await image(
      path.join(diagDir, f), path.join(OUT, "diagram", `${slug}-full`), [3840], 82
    );
  }
  log(`${Object.keys(manifest.diagrams).length} diagrams (+ full-resolution copies)`);

  console.log("\n── agent glyphs ──");
  await ensure(path.join(OUT, "agent"));
  const agentDir = path.join(SRC, "agents");
  for (const f of (await fs.readdir(agentDir)).filter((f) => f.endsWith(".png"))) {
    const slug = f.replace(/-agent\.png$/, "").replace(/\.png$/, "");
    manifest.agents[slug] = await image(
      path.join(agentDir, f), path.join(OUT, "agent", slug), [256], 88
    );
  }
  log(`${Object.keys(manifest.agents).length} glyphs`);

  console.log("\n── empty states ──");
  await ensure(path.join(OUT, "empty"));
  const emptyDir = path.join(SRC, "empty");
  for (const f of (await fs.readdir(emptyDir)).filter((f) => f.endsWith(".png"))) {
    const slug = f.replace(/\.png$/, "");
    manifest.empty[slug] = await image(
      path.join(emptyDir, f), path.join(OUT, "empty", slug), [1200, 700]
    );
  }
  log(`${Object.keys(manifest.empty).length} frames`);

  console.log("\n── team portraits ──");
  const teamDir = path.join(SRC_EXTRA, "team");
  if (await exists(teamDir)) {
    await ensure(path.join(OUT, "team"));
    const shots = (await fs.readdir(teamDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    for (const f of shots) {
      const slug = f.replace(/\.[^.]+$/, "");
      manifest.team = manifest.team ?? {};
      manifest.team[slug] = await portrait(
        path.join(teamDir, f), path.join(OUT, "team", slug), TEAM_FOCUS[slug] ?? 0.4
      );
      log(slug, manifest.team[slug]);
    }
    if (!shots.length) log("none yet — drop nikhil.jpg / mousmi.jpg into assets-src/team");
  } else {
    log("assets-src/team missing");
  }

  console.log("\n── brand ──");
  await ensure(path.join(OUT, "brand"));
  manifest.brand.symbol = await image(
    path.join(SRC, "logo-symbol.png"), path.join(OUT, "brand", "symbol"), [512], 92
  );
  manifest.brand.wordmark = await image(
    path.join(SRC, "logo-horizontal.png"), path.join(OUT, "brand", "wordmark"), [1200], 92
  );
  await fs.copyFile(path.join(SRC, "logo-symbol.png"), path.join(ROOT, "src", "app", "icon.png"));
  await fs.copyFile(path.join(SRC, "favicon-180.png"), path.join(ROOT, "src", "app", "apple-icon.png"));
  log("symbol, wordmark, favicons");

  const banner = "// GENERATED by scripts/prepare-assets.mjs — do not edit by hand.\n";
  await fs.writeFile(
    path.join(ROOT, "src", "data", "media.ts"),
    banner +
      "export type MediaSize = { w: number; h: number; duration?: number };\n\n" +
      "export const media = " + JSON.stringify(manifest, null, 2) + " as const;\n\n" +
      "export type ShotKey = keyof typeof media.shots;\n" +
      "export type FilmKey = keyof typeof media.films;\n" +
      "export type SequenceKey = keyof typeof media.sequences;\n"
  );
  console.log("\n✓ manifest → src/data/media.ts\n");
}

run().catch((e) => {
  console.error("\n✗ asset pipeline failed:", e.message);
  process.exit(1);
});
