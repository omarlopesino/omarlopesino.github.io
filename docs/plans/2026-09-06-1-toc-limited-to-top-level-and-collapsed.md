# The post table of contents drops sub-headings and starts collapsed

*2026-09-06 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`Toc.astro` listed both `h2` and `h3` headings — numbering the `h2`s and indenting the `h3`s under
them — and `Post.astro` rendered it open (`<Toc open .../>`) on every post. Against the first real
post's actual length this made the panel longer and more prominent than intended before a reader
reached any content.

## What this changed

- `src/components/ui/Toc.astro` — the heading filter dropped `heading.depth === 3`, so only `h2`
  entries are collected; every remaining item gets a sequential number (the old `heading.depth === 2
  ? ++section : null` conditional, and the `h3` indentation branch on the `<li>`, are gone).
- `src/components/ui/Post.astro` — `<Toc open headings={headings} />` lost the `open` prop, so the
  `<details>` renders collapsed by default (`Toc`'s own `open = false`).

## Decisions and their reasons

Neither commit records a reason beyond its subject line (`Show only header 2 in TOC`, `Make TOC
collapsed by default in articles`).

## What this removed

`h3`-level entries and their indentation are no longer part of the table of contents — only a post's
top-level (`h2`) sections are listed, and the panel no longer opens itself on page load.
