# Render-blocking CSS, lazy-loaded LCP images, and unlabelled nav landmarks fixed

*2026-08-28 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Running the Unlighthouse setup from the previous entry against the local build showed the
Tailwind/DaisyUI stylesheet — one bundle per page, well over Astro's 4kB auto-inline threshold —
shipping as a render-blocking `<link>` on every page, costing Lighthouse's `render-blocking-insight`
audit roughly 600ms of FCP/LCP. The same run's `lcp-discovery-insight` flagged the lead post image,
the single-post cover, and the tag/category/about-page hero image as `loading="lazy"` with no fetch
priority, even though each is the actual LCP element on its page. Verifying the fixes with axe-core
against the pages `tests/pa11y/*.json` cover also turned up a pre-existing, unrelated bug: the header
and footer both render `<nav role="navigation">` with no accessible name, which is a landmark-unique
violation once both are on the page.

## What this changed

- `astro.config.mjs`: added `build.inlineStylesheets: 'always'`, so the whole CSS bundle is inlined
  into every page's `<head>` instead of linked.
- `src/components/ui/PostTeaser.astro`, `PostsList.astro`, `PostsRows.astro`, `src/types.ts`: a new
  `priority` prop threads `PostsRows` → `PostsList` → `PostTeaser`, applying `loading="eager"` and
  `fetchpriority="high"` to only the first teaser image when the listing has `lead` set.
- `src/components/ui/Post.astro`: the single-post cover image is now always `loading="eager"` /
  `fetchpriority="high"`.
- `src/components/ui/ImageText.astro`: same, unconditionally — both its callers (`AboutLayout`'s
  avatar, `TermHero`'s hero image) sit at the top of their page.
- `src/i18n/ui.ts`: added `nav.main` / `nav.footer` keys, in both languages.
- `src/components/Header.astro`, `Footer.astro`: their `<Menu>` (a `<nav>`) now carries
  `aria-label={t('nav.main')}` / `aria-label={t('nav.footer')}` respectively.

## Decisions and their reasons

- **Inline always, not Astro's default 4kB `auto` threshold.** The bundle is one file shared by
  every page and always exceeds it, so `auto` never inlined it; forcing `always` trades cross-page
  CSS caching for removing a render-blocking request on every page — a fair trade for a small static
  site where the cached-CSS benefit was small anyway.
- **`priority` only reaches the first teaser, and only when `lead` is set.** `GridList` (the
  below-the-fold "Keep reading" strip) never sets `lead`, so it never gets a priority image — eager-
  loading everything would fight the real LCP candidate for bandwidth instead of helping it.
- **`ImageText` is unconditionally eager rather than taking its own `priority` prop.** Both current
  callers are always-above-the-fold hero placements; a prop would imply a below-the-fold use that
  does not exist yet.
- **The nav labels were fixed here rather than filed separately.** They were found while verifying
  this session's other changes didn't regress accessibility, and are a one-line fix in files this
  session was already touching.
