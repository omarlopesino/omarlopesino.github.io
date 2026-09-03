# An interactive script generates content image variants

*2026-09-03 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Content images had no workflow beyond manually resizing a photo by hand: posts, categories and
tags all default to a 960x540 cover (`typeImage` in `src/content.config.ts`), and a page can
override its social card because the cover "crops better at 1.91:1" per `AGENTS.md`, but nothing
produced either file — every entry just pointed at the same shared `public/960x540.jpg`
placeholder.

## What this changed

- `scripts/generate-image-variants.mjs` (new) — takes a source photo path as its sole CLI arg,
  then an interactive `@clack/prompts` flow: a `groupMultiselect` grouped by aspect ratio (group
  `16:9` holds `960x540`, group `1.91:1` holds `1200x630`) offering one option per unique target
  size, then a `select` for fit mode (`cover` center-crops, `contain` letterboxes on white). Each
  chosen size is resized with `sharp` and written to `public/<width>x<height>/<original-basename>`,
  creating the folder if needed and overwriting on rerun.
- `package.json` / `package-lock.json` — added `sharp` and `@clack/prompts` (`^1.7.0`) as
  devDependencies, and a `"image:variants": "node scripts/generate-image-variants.mjs"` script, run
  as `npm run image:variants -- <path-to-photo>`.

## Decisions and their reasons

- **A plain standalone script, not a `tools/<name>` package like `astro-scaffold`** — that
  structure exists to bundle this project's own `content.config.ts` with esbuild for a
  schema-driven CLI; this script only resizes an image and has no config to introspect.
- **One config table (`SIZES` in the script) drives both the prompt and the output paths** — a
  `{width, height, ratio, purposes}` array. Adding a size, whether a new purpose at an existing
  dimension or a new dimension entirely, is one entry; nothing else in the script changes.
- **The multiselect offers one option per unique size, not one per purpose** — post, category and
  tag share the same 960x540 target, so they appear as a single `960x540 — post / category / tag
  cover` option instead of three redundant, identically-sized choices.
- **`sharp` and `@clack/prompts` were added as explicit devDependencies** rather than relied on
  transitively (`sharp` ships as an optional dependency of Astro's own image service and was
  already present in `node_modules`) — depending on hoisting for a script's own direct imports is
  fragile.
- **Output keeps the source's own file extension/format** rather than normalizing to one format,
  since `sharp.toFile()` infers format from the destination path and the existing placeholders are
  already plain `.jpg`.

## What this removed

Nothing; this added a new capability.
