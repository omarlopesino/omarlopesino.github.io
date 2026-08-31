# Dark mode persists across view transitions; blog references stop false-failing validation

*2026-08-28 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Two independent bugs surfaced after the previous entry's work. First, Astro's `ClientRouter` swaps
in a freshly-rendered `<html>` on client-side navigation, which carries no `data-theme` attribute;
the theme script only ran once on `DOMContentLoaded`, so a page reached via a view transition lost
dark mode. Second, every post logged a spurious "Invalid content reference" error: blog frontmatter
deliberately stores a bare `cid` for `category`/`tags`/`recommended`, resolved by hand in
`src/lib/blog.ts` by re-appending the post's language, but the schema validated those fields with
Astro's `reference()` helper, which checks against a target collection's full `cid/language` id — a
bare `cid` never matches it.

## What this changed

- `src/layouts/Layout.astro`: the inline theme script now listens for `astro:before-swap` to
  restore the saved theme onto the incoming document before it swaps in (no flash), and
  `astro:page-load` — which fires on the initial load and after every transition, unlike
  `DOMContentLoaded` — to re-wire the toggle each time. The toggle's `change` handler now sets
  `data-theme` directly as well as writing to `localStorage`.
- `src/content.config.ts`: `category`, `tags`, and `recommended` on the `blog` schema switched from
  `reference('category')` / `reference('tag')` / `reference('blog')` to plain `z.string()` /
  `z.array(z.string())`; the now-unused `reference` import was dropped.
- `src/lib/blog.ts`: `getPostCategory`, `getPostTags`, `getTermPosts`, and `getRecommendedPosts`
  updated to read the bare string values directly instead of a reference object's `.id`.

## Decisions and their reasons

- **The bare-cid convention itself didn't change** — only the schema's incorrect validation of it.
  `category`/`tags`/`recommended` were always meant to hold a bare `cid`, resolved by hand; `reference()`
  was simply the wrong tool for a field that isn't a full entry id, so the fix is dropping it, not
  reworking how references are stored.
