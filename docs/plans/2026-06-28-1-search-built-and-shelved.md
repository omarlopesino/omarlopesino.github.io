# A search bar and a tags selector, built and left unwired

*2026-06-28 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`docs/Requirements.md` asks the site to let a reader find things. Two components were built to
answer that — a search bar and a multi-select tags filter — before deciding where they would go.
By the time the blog listing existed, the answer to "how does a reader find a post" had become
browsing by category and tag, and neither component was ever placed on a page.

## What this changed

- `f0ebfea` + `a61a808` — `src/components/ui/SearchBar.astro` and `searchbar.stories.ts`.
- `3dccd13` … `e8d7b1c`, `a96c9ee`, `fc6fb63` — `src/components/ui/TagsSelector.astro` and
  `tagselector.stories.ts`, with `47bffff` making its clear button translatable.
- `de1d9e4` — a fix to the tag name property it reads.
- Neither is imported by any layout or page. Both render in Storybook.

## Decisions and their reasons

- **Browsing replaces searching, for now.** `docs/Requirements.md` records the conclusion reached
  once the site had content in it: "After developing, It has been noted that being able to explore
  by categories and tags may be enough for a personal blog." Full-text search over a static site
  means shipping an index and a client-side runtime, which is a large cost for a blog with two
  posts.
- **The components stay in the tree.** They work, they have stories, and the same document says
  search may be wanted later — "if we see it necessary in a future, we may provide need some tools
  to let users find specific content". Deleting them buys nothing back.

## What this removed

Nothing was removed. This entry exists to record a *non*-removal: `SearchBar.astro` and
`TagsSelector.astro` have no caller **by decision**, not by oversight.

A later session finding two unused components has two wrong moves available — deleting them as
dead code, or assuming the site has search and linking to a page that does not exist. Neither is
right. If search is wanted, these are the starting point and `docs/Requirements.md` holds the
scope: "By body content. By tags. It does not need to be complex for an MVP."
