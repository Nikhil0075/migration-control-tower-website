"use client";

import Image from "next/image";
import { team } from "@/data/team";
import { media } from "@/data/media";
import { Arrow } from "@/components/ui/AnimatedLink";
import { useRevealImage } from "@/hooks/useRevealImage";

/**
 * Two editorial portrait slots.
 *
 * Everything here is driven by src/data/team.ts. A member with no portrait gets
 * a composed placeholder frame rather than a broken image, and a member with no
 * LinkedIn renders as plain text rather than a dead link — so the layout is
 * complete and presentable before the real details arrive.
 */
export function Team() {
  return (
    <ul className="grid gap-x-[clamp(20px,3vw,64px)] gap-y-[var(--space-xl)] sm:grid-cols-2">
      {team.map((m, i) => (
        <li key={m.id}>
          <Member member={m} index={String(i + 1).padStart(2, "0")} />
        </li>
      ))}
    </ul>
  );
}

function Member({
  member,
  index,
}: {
  member: (typeof team)[number];
  index: string;
}) {
  const ref = useRevealImage<HTMLDivElement>();

  // Driven by the generated manifest rather than a hand-written path, so a
  // member whose photo has not been added yet renders the placeholder without
  // ever requesting a file that does not exist.
  const portrait = (media.team as Record<string, { w: number; h: number }>)[member.id];
  const hasPortrait = Boolean(portrait);
  const hasLink = Boolean(member.linkedin);

  const name = (
    <span className="h-sub !text-[clamp(1.5rem,2.6vw,2.5rem)]">{member.name}</span>
  );

  return (
    <article>
      <div ref={ref} data-reveal-image>
        <div
          className="media-frame border"
          style={{ borderColor: "var(--line)", aspectRatio: "4 / 5" }}
        >
          {hasPortrait ? (
            <Image
              src={`/media/team/${member.id}.webp`}
              alt={`${member.name}, ${member.role}`}
              width={portrait!.w}
              height={portrait!.h}
              sizes="(max-width: 640px) 100vw, 44vw"
              className="h-full w-full object-cover"
            />
          ) : (
            /* Placeholder: a composed frame, not a broken image. Colours come
               from the surface-aware frame tokens so it reads correctly on both
               the light and dark grounds. */
            <div
              className="flex h-full w-full flex-col justify-between p-[clamp(16px,1.6vw,28px)]"
              style={{ background: "var(--frame-bg)", color: "var(--frame-fg)" }}
            >
              <span className="micro !text-[color:var(--frame-fg)]">Portrait</span>
              <svg
                aria-hidden
                viewBox="0 0 100 125"
                className="mx-auto h-1/2 w-auto opacity-40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <circle cx="50" cy="44" r="19" />
                <path d="M16 116c0-20 15-33 34-33s34 13 34 33" />
              </svg>
              <span className="micro !text-[color:var(--frame-fg)]">Awaiting image</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-[var(--space-sm)] border-t pt-[var(--space-sm)]" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-baseline gap-4">
          <span className="micro" style={{ color: "var(--accent)" }}>{index}</span>
          {hasLink ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-baseline gap-3"
            >
              <span className="transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]">
                {name}
              </span>
              <Arrow className="h-4 w-4 transition-transform duration-[--dur-med] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
            </a>
          ) : (
            name
          )}
        </div>

        <p className="micro mt-2">{member.role}</p>
        <p className="body mt-[var(--space-sm)] max-w-[46ch] !text-[var(--t-small)]">{member.bio}</p>

        {!hasLink && <p className="micro mt-[var(--space-sm)] opacity-45">LinkedIn — to be added</p>}
      </div>
    </article>
  );
}
