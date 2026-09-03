# The home page grows a topics/tags browser and an RSS call to action

*2026-08-31 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`HomeLayout` only ever pointed at the six most recent posts, with categories and tags reachable
solely through the nav — a visitor landing on `/` had no sense of what else the blog covered. The
site also builds a per-language RSS feed but never linked to it anywhere besides the footer icon,
so subscribing meant recognizing that icon rather than being invited to.

## What this changed

- `src/components/ui/CategoryCard.astro` (new, with `CategoryCard.stories.ts`) — a square link
  showing a category's name, description, cover image and post count, reusing the term's own
  `image` field so the card isn't text-only.
- `src/layouts/HomeLayout.astro` — after the intro, renders categories (`getCollection('category',
  ...)`, sorted by localized name) as a `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` grid, or a
  `carousel carousel-center` past three categories so the grid doesn't grow unbounded; tags
  (`getCollection('tag', ...)`) render through the existing `BubbleList` component, the same one
  the blog listing already uses for its tag row. A post count per category comes from
  `getTermPosts('category', { cid, language })`.
  A subscribe row was added right after the recent-posts teaser: `t('home.subscribeText')` plus a
  `Button` linking to `t('feed.path')`, with an `mdi:rss` icon.
- `src/i18n/ui.ts` — new keys `category.title`, `category.postCount`, `home.subscribeText`,
  `home.subscribe`, in both `en` and `es`.
- `src/components/ui/PostCategory.astro` — dropped `text-primary` from the tag's class list, so a
  post's category renders as normal text instead of the accent colour (credited to a tip from
  Alejandro Cabarcos; no further reasoning recorded).

## Decisions and their reasons

- **The category grid becomes a carousel past three items**, so a site with many categories doesn't
  push the rest of the home page down indefinitely — the threshold is a fixed `categories.length >
  3` check in `HomeLayout.astro`, not a configurable value.
- **`CategoryCard` reuses the category's own cover `image`** rather than a dedicated
  home-page-only asset, keeping one image per category instead of adding a second image field.
- **Tags reuse `BubbleList`** instead of a new component, since the blog listing's tag row already
  needed the same rendering.

## What this removed

Nothing pre-existing. `PostCategory`'s `text-primary` class was dropped in favour of the
surrounding text colour; the component itself is unchanged otherwise.
