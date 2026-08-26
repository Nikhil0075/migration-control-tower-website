"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { useRevealImage } from "@/hooks/useRevealImage";
import { media } from "@/data/media";

/* ------------------------------------------------------------------ film -- */

/**
 * A cinematic loop. Poster-first, lazily attached, and paused whenever it is
 * off-screen so six 720p films never all decode at once.
 *
 * Under reduced motion the poster image is shown instead of a moving picture.
 */
export function Film({
  name,
  className,
  poster = true,
  active = true,
  priority = false,
  loop = true,
  alt,
}: {
  name: keyof typeof media.films;
  className?: string;
  poster?: boolean;
  /** When false the film is held on its poster frame (used by the sequence). */
  active?: boolean;
  /** Accepted for call-site clarity; loading is intersection-driven either way. */
  priority?: boolean;
  /**
   * Set false for a film with a one-way narrative arc. It plays through once on
   * first entry and holds its final frame, instead of snapping back to the
   * opening state — which would undo the very reveal the shot exists to make.
   */
  loop?: boolean;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let played = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && active) {
          // A one-way film runs exactly once; re-entering the viewport must not
          // rewind it back to its opening state.
          if (!loop && played) return;
          played = true;
          // Sources carry preload="none", so the first play() is also what
          // starts the download. A display:none element never intersects, which
          // is how the responsive hero avoids fetching both of its films.
          el.play().catch(() => {
            /* autoplay refused — the poster stands in */
          });
        } else if (loop) {
          el.pause();
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, loop]);

  const posterSrc = `/media/film/${name}-poster.webp`;

  return (
    <video
      ref={ref}
      className={cx("h-full w-full object-cover", className)}
      poster={poster ? posterSrc : undefined}
      muted
      loop={loop}
      playsInline
      preload="none"
      aria-label={alt}
      tabIndex={-1}
    >
      <source src={`/media/film/${name}.webm`} type="video/webm" />
      <source src={`/media/film/${name}.mp4`} type="video/mp4" />
    </video>
  );
}

/* ----------------------------------------------------------------- image -- */

type Bucket = "shot" | "diagram" | "agent" | "empty" | "brand";

function lookup(bucket: Bucket, key: string): { w: number; h: number } {
  const table = media[bucket === "shot" ? "shots" : bucket === "diagram" ? "diagrams" : bucket === "agent" ? "agents" : bucket === "empty" ? "empty" : "brand"] as Record<
    string,
    { w: number; h: number }
  >;
  return table[key] ?? { w: 1600, h: 900 };
}

/**
 * An image inside a masked frame. The frame owns the aspect ratio and the
 * overflow; the image inside it does the zoom on hover. Reveal is the shared
 * clip-path wipe.
 */
export function RevealImage({
  bucket,
  name,
  alt,
  className,
  frameClassName,
  ratio,
  sizes = "(max-width: 860px) 100vw, 60vw",
  priority = false,
  zoom = true,
  cursor,
}: {
  bucket: Bucket;
  name: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  /** CSS aspect-ratio override, e.g. "16 / 9". Defaults to the intrinsic one. */
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
  /** Custom-cursor label shown while hovering, e.g. "View". */
  cursor?: string;
}) {
  const ref = useRevealImage<HTMLDivElement>();
  const { w, h } = lookup(bucket, name);

  return (
    <div ref={ref} className={className} data-reveal-image>
      <div
        className={cx("media-frame grain", frameClassName)}
        data-hover-zoom={zoom ? "" : undefined}
        data-cursor={cursor}
        style={{ aspectRatio: ratio ?? `${w} / ${h}` }}
      >
        <Image
          src={`/media/${bucket}/${name}.webp`}
          alt={alt}
          width={w}
          height={h}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
