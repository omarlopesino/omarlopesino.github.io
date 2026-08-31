# The `year.*` i18n keys are renamed to `archive.*`

*2026-08-31 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The year pages had already moved to `/blog/archive` · `/blog/archivo` on 2026-08-27, and the nav
label had already become "Archive", but the `ui.ts` keys backing them still said `year.*` — out of
step with both the URLs and the label.

## What this changed

- `src/i18n/ui.ts` — `year.title` / `year.description` / `year.postsTitle` / `year.path` renamed to
  `archive.title` / `archive.description` / `archive.postsTitle` / `archive.path`, in both `en` and
  `es`.
- Every call site updated to match: `src/layouts/YearsLayout.astro`, `src/lib/blog.ts`,
  `src/components/Header.astro`, `src/pages/en/blog/archive/[year]/[...page].astro`,
  `src/pages/es/blog/archivo/[year]/[...page].astro`.
- The two `AGENTS.md` mentions of `year.path` updated to `archive.*`.

## Decisions and their reasons

- **Rename only, no behavior change** — the commit records no other reasoning; it exists purely to
  stop the key names from lying about what they back.

## What this removed

- The `year.title` / `year.description` / `year.postsTitle` / `year.path` keys — renamed to
  `archive.*`; no call site references `year.*` any more.
