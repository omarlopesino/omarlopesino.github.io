# Post and term pages, driven by shared query helpers

*2026-07-04 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

With the content model settled (see
[the content model entry](2026-06-30-1-multilingual-content-model.md)) the collections had no
pages over them. The first attempts wrote the same thing several times: each route built its own
static paths, each layout fetched its own collection and mapped entries to markup its own way, and
posts and terms — which differ only in what selects the list — had two of everything.

## What this changed

- `8575b5d`, `962740c` — dynamic paths for posts, then a generalised path builder any collection
  can use, filtered by language.
- `ce721f0`, `c5cf376` — the post layout and a date-formatting utility.
- `c12b888`, `6270e64` — a template for term pages.
- `d8cbb25`, `45e3489` — the logic posts and terms share pulled into one place, and the post
  layout moved onto it.
- `6cde52b`, `aad87d8` — post lists split into `RecommendedPosts` and `GridList`, and the term
  layout moved onto `GridList`.
- `441cbb6` — alternate links rendered in the post layout.
- `d038f3a` — the tags data type tightened.
- `3426fd5`, `3a3dcf7`, `f119f35` — the blog, tag and category pages, and the routing over them.
- `f40105b` Astro 7, `b8a999c` Tailwind 4 — the upgrade reverted back in June, done properly.

## Decisions and their reasons

- **Query helpers live in `src/lib/blog.ts`; pages stay thin.** A route's job is to name its paths
  and hand props to a layout. Everything that reads a collection is one import away, which is what
  makes it possible to fix a query once.
- **One path builder for every collection.** `962740c` generalised what `8575b5d` had written for
  posts alone, because a term page needs the identical thing with a different collection name.
- **Layouts fetch, components render.** The split that keeps `src/components/ui/` renderable in
  Storybook, first applied here at scale.
- **Two list components, not one with a mode flag.** `RecommendedPosts` and `GridList` show posts
  in genuinely different shapes; `6cde52b` separates them rather than growing a variant prop.
- **Upgrades land on their own.** Astro 7 and Tailwind 4 are each a single commit doing nothing
  else, which is why the June attempt that bundled an upgrade into a working branch was reverted.

## What this removed

- **Per-route static path building** — replaced by the shared builder.
- **The duplicated post-mapping and fetching in each layout** — unified by `d8cbb25`.
- **The single combined post list** — split into `RecommendedPosts` and `GridList`.
