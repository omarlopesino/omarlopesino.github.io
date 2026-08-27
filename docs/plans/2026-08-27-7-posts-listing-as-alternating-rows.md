# The listing becomes alternating rows, and a card shows when it is focused

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Every listing led with its newest post across the whole grid row
([the archive entry](2026-08-27-4-archive-as-the-only-index.md)), and the posts behind it stood in a
three-column grid of vertical cards. Both were too big for what they carried. The lead took most of
a screen on its own, so the second post was rarely above the fold; the three-up grid then spent a
column of width on a cover and a row of height on a card that held two lines of description. A page
of fifteen posts was a lot of scrolling for very little reading.

Focus was a separate fault. daisyUI's `.card` ships a `:focus-visible` outline, but `ui/Card` lays
the title's link *over* the card, so the link takes focus and the card never matches. Tabbing
through a listing highlighted nothing but the title text.

## What this changed

- `src/components/ui/PostsRows.astro` and `PostsRows.stories.ts` added — a listing as rows, a thin
  wrapper over `ui/PostsList` like `ui/GridList` is.
- `src/layouts/PostsListLayout.astro` renders `ui/PostsRows` with `lead` instead of `ui/GridList`
  with `featured`, so the blog page, both term pages and the year pages move together.
- `src/types.ts` — `PostsListProps.featured` replaced by `lead`.
- `src/components/ui/GridList.astro` — the `featured` prop and its `featuredClass` dropped; it is a
  plain three-column grid again, and `ui/Post.astro`'s "Keep reading" strip is its only caller.
- `src/components/ui/GridList.stories.ts` — the `FeaturedFirstPost` story dropped with the prop.
- `src/components/ui/Card.astro` — a card with a `url` now also carries `card-highlight`.
- `src/styles/global.css` — `.posts-rows`, `.posts-rows-lead` and `.card-highlight` added.
- `AGENTS.md` — the layout stack redescribed around `ui/PostsRows`.

## Decisions and their reasons

- **Rows, not a grid, for every paginated listing.** A row gives the description its full measure
  instead of a third of one, and puts the covers on a single vertical rhythm the eye can scan. The
  cover alternates side by row so the page does not read as a column of identical bars.
- **The alternation is `nth-child`, and it stops below `md`.** Side by side at 390px leaves the copy
  about 90px wide, so under the breakpoint every row unflips and the cover goes back on top. Only
  the flex container and the three-line clamp apply at every width.
- **The cover keeps a 16:9 floor.** `min-height: calc(var(--cover) * 9 / 16)` on the row, so a post
  with a one-line description cannot squeeze its cover into a letterbox. It is what makes the lead
  taller than the rest without a second height rule: the lead only widens its cover.
- **The newest post still leads, but as a row.** A wider cover and a 1.5rem title, about 80px taller
  than a normal row rather than a screen of its own. 1.5rem and not `--text-title`, which is the
  page's `<h1>` size and would out-shout the heading above the listing.
- **Two list components, not one with a mode flag** — as when they were first split
  ([the routing entry](2026-07-04-1-blog-routing-and-queries.md)). Rows are every paginated listing;
  the three-up grid is only the post page's related strip, which wants three cards side by side.
- **The row layout is CSS in `global.css`, not utilities on the component.** `nth-child`
  alternation, logical corner radii that swap with the row, and a `calc()` floor read worse as
  arbitrary Tailwind variants than as a dozen commented lines. The rest of the card stays daisyUI.
- **One treatment for hover and for keyboard focus.** `.card-highlight` fires on `:hover` and on
  `:has(a:focus-visible)` alike: a 1px hairline with a 4px accent halo behind it. The `:has()` is
  the whole fix — the overlay link is why the card's own `:focus-visible` never matched. The
  overlay link's UA outline is then suppressed, because it would draw a second box around the title
  alone; the title underlines instead.
- **The hairline is `--color-base-content`, not black.** Asked for as "a tiny black border", but a
  black hairline sinks into `--color-base-100` under the dark theme. The token is a warm near-black
  in light and a warm off-white in dark, which keeps the intent in both.
- **The highlight is on `ui/Card`, not on the teaser.** A card with a `url` *is* a link — that is
  already why it gets `relative` — so every linked card gets it and `RecordCard`, which passes no
  `url`, does not.

## What this removed

- **The full-width featured lead** — `GridList`'s `featured` prop and the
  `md:[&>*:first-child]:col-span-3` class behind it. It was added on
  [2026-08-27](2026-08-27-4-archive-as-the-only-index.md) so the cover would show at its own aspect
  ratio; that is now the lead row's job, at a size that leaves room for the posts under it.
- **The three-column grid on the paginated listings.** `ui/GridList` still renders it for the post
  page's "Keep reading" strip.
