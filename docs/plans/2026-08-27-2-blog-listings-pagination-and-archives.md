# One paginated layout behind every post listing

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The blog listing still led with the pitch that had moved to the about-me page, and its `<h1>`
rendered at body size because nothing outside `.prose` styles headings. Every listing dumped all
posts at once with no pagination, `BlogLayout` never sorted them, and the taxonomy index pages were
miswired — the English tags page rendered categories, and the layout behind them read every field
of a term off `data.name` while linking to a lowercased `cid`, so not one link reached a page.
There was also no way to browse by year, which `docs/design/Features.md` calls for.

## What this changed

- `2c61229` — the labels and route segments; a taxonomy's path key becomes the whole prefix
  (`blog/tags`, not `tags`), and `term.empty` becomes `posts.empty`.
- `79bf42e` — `POSTS_PER_PAGE = 15`, `getLangPosts`, `getYears`, `getYearPosts`, `blogPaths`,
  `termPaths`, `yearPaths`, `getYearAlternateUrls` and `pageAlternates` in `src/lib/blog.ts`.
- `66cb8db` `PageTitle`, `99465da` `Pagination`, `7296062` `BubbleList`, `c74067c` `Facet` gaining
  a link on to a full index.
- `b516c29` — `PostsListLayout` takes Astro's `Page` and owns the empty state and the pagination
  for every listing; `BlogLayout` stops fetching.
- `b232ab9`, `0f40656`, `7daa988`, `1decc58`, `3c7c75e` — the index pages, the paginated language
  root, the tag and category pages moved under `/blog`, and the year archive.
- `5d1b3ac` — the about-me page's `<h1>` becomes the site name in the header, via a `logoTag` prop.
- `409a9f5`, `c3f38f7` — a rail of five categories, five tags and five years beside the content,
  and a full-width `lede` slot above it.

## Decisions and their reasons

- **Every listing paginates at fifteen, through one layout.** `PostsListLayout` takes the `Page`
  object rather than an array, "so the blog, a term and a year all read the same way" (`b516c29`).
  Its `header` slot falls back to the page title, which is how a term page swaps its hero in.
- **`pageAlternates()` is not optional on a paginated route.** `Layout` builds the canonical URL
  from the alternate matching the page's own language, so without it page two canonicalises to page
  one. This is the most fragile thing in the routing.
- **The heading size lives in `PageTitle`, once.** An `<h1>` was reaching the page at body size
  because nothing outside `.prose` styles headings. A post title stays the exception, ranged left
  in its prose column.
- **The about page's `h1` is the site name, passed down as a prop — no URL sniffing.** The page
  leads with a pitch rather than a title, and only `AboutLayout` passes `logoTag="h1"`.
- **A taxonomy's path key is the whole prefix.** `blog/tags` rather than `tags` means the pages
  under it and every link built from it move together by changing one string.
- **Years are a taxonomy with no collection behind them**, read off the posts in UTC to match
  `useFormatDate`, with their hreflang built from `year.path` rather than a `cid` lookup.
- **`Pagination` takes plain props, and renders nothing when everything fits on one page.**

## What this removed

- **`TermsLayout` as it stood** — rewritten rather than edited, because it read `image`, `slug`,
  `language` and `cid` all off `data.name`.
- **The unpaginated routes**, replaced by `[...page]` rest-param equivalents; `staticPaths()` was
  kept, since the post route still uses it.
- **The pitch from the blog listing** — it lives on the about-me page.
- **A per-term query for post counts** — replaced by a single pass over the posts.
- **A hero on year pages** — listing only, deliberately.
