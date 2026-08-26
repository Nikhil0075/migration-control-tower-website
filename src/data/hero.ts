/**
 * The hero arc.
 *
 * The hero film is one unbroken push down a legacy data-centre aisle: tangled
 * and unlit for five seconds, then the fluorescents switch on in sequence and
 * reveal an ordered estate extending into the distance. Scroll drives that
 * timeline, and these phases are bound to the same progress value — so the
 * words and the picture make the same argument at the same moment.
 *
 * `until` is the upper bound of each phase, as a 0–1 fraction of the shot.
 */

export type HeroPhase = {
  until: number;
  /** Mono state label in the eyebrow and on the timeline rail. */
  state: string;
  headline: string;
  support: string;
};

export const heroArc: HeroPhase[] = [
  {
    until: 0.52,
    state: "Unmapped",
    headline: "You cannot migrate what nobody can see.",
    support:
      "Schemas, procedures, transformations, schedules, ownership and policy live in different systems. The estate is real, and no single account of it is trustworthy.",
  },
  {
    until: 0.78,
    state: "Discovering",
    headline: "Autonomous migration. Deterministic control.",
    support:
      "A governed fleet catalogs the estate, reconstructs lineage and assesses risk — interpreting the evidence without ever being trusted to authorize an action.",
  },
  {
    until: 1,
    state: "Governed",
    headline: "Autonomous migration. Deterministic control.",
    support:
      "The same estate, surfaced, mapped and made accountable. Every action scoped, every transition durable, every result reproducible, and cutover under human authority.",
  },
];

export const heroFilmAlt =
  "A maintenance engineer walks a dark aisle of aged server racks with tangled cabling and faded labels; overhead fluorescents then switch on in sequence, revealing an ordered, labelled estate extending far into the distance.";
