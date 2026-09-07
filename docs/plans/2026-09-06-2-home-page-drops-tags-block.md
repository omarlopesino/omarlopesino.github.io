# The home page drops its tags block

*2026-09-06 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

[The home page's topics/tags browser](2026-08-31-4-home-page-topics-tags-and-rss.md) put a
`BubbleList` of every tag above the categories grid. With real content behind it, the tag bubble row
"added clutter without much value on the frontpage" (commit body), and the categories grid read
better placed right after the recent-posts teaser than above it.

## What this changed

- `src/layouts/HomeLayout.astro` — the `tags` query (`getCollection('tag', ...)`, mapped to
  `BubbleList` items) and its `<BubbleList ... />` render were removed. The categories grid/carousel
  block moved from before the recent-posts `GridList` to after it, so the page now reads: intro,
  recent posts, topics, subscribe row.

## Decisions and their reasons

- **The tags browser was cut rather than restyled** — no reason beyond the commit body's "added
  clutter without much value" is recorded.
- **Categories now follow recent posts instead of leading them** — "topics read better as a
  follow-up to the recent posts list than sitting above the categories grid" (commit body).

## What this removed

The home page's tag bubble list (`BubbleList` fed from the `tag` collection) is gone from
`HomeLayout.astro`. `BubbleList` itself is untouched and still renders elsewhere — the blog listing's
tag row (`BlogLayout.astro`) and `PostTags.astro`.
