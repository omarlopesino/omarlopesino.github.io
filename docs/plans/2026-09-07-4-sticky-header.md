# The header stays pinned while scrolling

*2026-09-07 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`Layout.astro`'s `<header>` scrolled away with the rest of the page, so the nav links, language
switcher and theme toggle were only reachable by scrolling back to the top — working against keeping
navigation reachable on longer pages (a post, the archive).

## What this changed

- `src/layouts/Layout.astro` — `<header class="lg:px-4">` became `<header class="sticky top-0 z-20
  bg-base-100 lg:px-4">`.

## Decisions and their reasons

- **`bg-base-100` was added alongside `sticky`** — without an opaque background, page content
  scrolling underneath a pinned header would show through it.
- **`z-20`** — keeps the header, and the [mobile drawer](2026-09-07-1-mobile-hamburger-drawer-menu.md)
  nested inside it, painting above the page's own content once pinned; nothing else on the page sets
  a competing `z-index`, so the exact value isn't load-bearing beyond being positive.

## What this removed

Nothing; the header's own layout and content are unchanged, only its positioning.
