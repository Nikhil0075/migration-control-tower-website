# assets-src

Media sourced **outside** the shipped artifact archive — for example videos
generated later in OpenArt.

`../shareed-artifacts-for -website/` is treated as read-only: it is the original
export and nothing should be written back into it. Anything new lands here
instead, and `scripts/prepare-assets.mjs` reads from both.

Drop a `.mp4` in `film/` and register it in the `EXTRA_FILMS` table in
`scripts/prepare-assets.mjs`, then run `npm run assets`.
