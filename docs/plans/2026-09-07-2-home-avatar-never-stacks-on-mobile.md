# The home page keeps avatar and intro side by side on mobile

*2026-09-07 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`HomeLayout`'s avatar-and-tagline intro uses `ImageText` with its default layout — `max-md:flex-col`,
[added](2026-08-31-1-about-me-splits-from-the-home-page.md) as `stacked` for the about page's tall
portrait. On the small 12×12 avatar this meant the one-line tagline dropped below the photo on
mobile even though there was plenty of width for both side by side, working against making mobile
content easier to see at a glance.

## What this changed

- `src/components/ui/ImageText.astro` — the boolean `stacked` prop became `stack: 'mobile' | 'always'
  | 'never'` (default `'mobile'`, the old behaviour). `'always'` keeps the old `stacked` class
  (`flex-col`, no width breakpoint); `'never'` emits no stacking class at all, so the flex row holds
  at every width.
- `src/layouts/HomeLayout.astro` — its `ImageText` call takes `stack="never"`.
- `src/layouts/AboutLayout.astro` — its `ImageText` call takes `stack="always"` in place of the old
  `stacked` boolean prop.
- `src/components/ui/ImageText.stories.ts` — added `AlwaysStacked` and `NeverStacked` stories
  covering the two non-default states.

## Decisions and their reasons

- **A three-way `stack` prop instead of a second boolean** — the component now has three real
  callers wanting three different behaviours (`TermHero.astro` keeps the unset default), and a
  second boolean would only encode two of them.
- **`TermHero.astro` was left on the default** — its term descriptions run long enough that stacking
  below `md` still reads better than forcing them beside a fixed-width image.

## What this removed

Nothing; `stacked` was renamed to `stack` with `'always'` as its direct equivalent, and every caller
was updated in the same change.
