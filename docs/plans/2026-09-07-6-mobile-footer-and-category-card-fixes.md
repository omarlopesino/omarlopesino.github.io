# The mobile footer stacks again, and category cards keep their image on mobile

*2026-09-07 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Three small follow-ups to [the drawer polish earlier today](2026-09-07-5-mobile-drawer-polish-and-footer-opt-out.md).
The footer's new single left-aligned row on mobile was taken back the same day. At the two-column
mobile grid width, `CategoryCard`'s fixed square shrank until its image collapsed to a sliver
(about 17px tall) once the name, description and post count had taken their space. And the home
page sliced its recent posts with a bare `6`.

## What this changed

- `3c83eed` — `src/components/ui/Menu.astro`'s non-drawer branch is stacked and centred on mobile
  again (`max-md:flex-col max-md:items-center`, the `start` slot full width and centred), and
  `src/components/Footer.astro` dropped `max-md:text-left`.
- `c2fd49b` — `src/components/ui/CategoryCard.astro` uses `aspect-[2/3]` below `sm` and keeps
  `sm:aspect-square` from there up.
- `de83121` — `src/layouts/HomeLayout.astro` names the limit `RECENT_POSTS_COUNT`.

## Decisions and their reasons

- **The footer goes back to two centred lines on mobile.** The commit records no reason.
- **A taller card ratio only below `sm`.** Columns are wide enough from `sm` up for the square to
  leave the image room; only the narrow two-column grid needed the extra height.
- **A named constant for the recent-posts count**, so the limit documents itself at the call site.

## What this removed

The left-aligned single-row mobile footer introduced in
[2026-09-07-5](2026-09-07-5-mobile-drawer-polish-and-footer-opt-out.md); the footer's smaller
icons and tighter link spacing from that entry stayed.
