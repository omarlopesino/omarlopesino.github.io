# The rail and the taxonomy indexes come out; the archive stays

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Hours after the rail and the three index pages shipped (see
[the listings entry](2026-08-27-2-blog-listings-pagination-and-archives.md)), they turned out to be
answering a question nobody asks. A tag is reached from the list on the blog page; a category from
the post carrying it. That leaves an index of every value as a page nobody lands on, and a rail of
five-of-each beside every listing that exists to link to those pages. The rail was also the only
reason `Layout` split its body in two.

## What this changed

- `a520563`, `a147401`, `6fa52c0` — `src/components/Sidebar.astro` deleted, and `Layout` back to a
  single column with no `lede` slot.
- `4492b27` — `getTopTerms` dropped from `src/lib/blog.ts`.
- `2e25c8e` — the four tag and category index pages removed; both keep their detail pages.
- `1a7d0f3` — `Facet` becomes a plain list of links with an optional heading.
- `9c1d32d` — the blog page lists every tag under its intro, hash included.
- `1713c74`, `699236e` — a listing leads with its newest post across the whole row, cover uncropped.
- `286eb0a` — the year pages move from `/blog/years` · `/blog/años` to `/blog/archive` ·
  `/blog/archivo`; directory names, `routes.ts` and `year.path` move together.
- `4fbc2b1` — `TermsLayout` replaced by `YearsLayout`, the archive index.
- `1f942bf`, `ab2c86c`, `834c06f` — the strings the rail and the indexes used, dropped; the archive
  named and linked in the menu.
- `3e59998` — `AGENTS.md` updated to describe the blog without the rail.

## Decisions and their reasons

- **A taxonomy needs no index page when every value is already reachable.** "A tag is reached from
  the list on the blog page and a category from the post carrying it, which leaves an index of
  every value a page nobody lands on" (`2e25c8e`). The tags moved onto the blog page itself
  (`9c1d32d`), "right where a reader who came for one of them arrives".
- **The archive is the one index that survives**, because years have nowhere else to be listed.
  It is called *archive* rather than *years* because "archive is what the menu calls them and it
  reads as a place rather than as a taxonomy" (`286eb0a`).
- **`YearsLayout` does not branch on a type.** With years the only taxonomy left with an index, the
  layout reads them off the posts instead of taking a collection (`4fbc2b1`).
- **A listing leads with its newest post at full width**, so the cover shows at its own aspect ratio
  rather than cropped into a third of the row (`1713c74`).
- **`Facet` loses its "view more" link.** There is nowhere for it to point now that every value
  fits on the page (`1a7d0f3`).

## What this removed

- **`Sidebar.astro`, the rail**, and with it `Layout`'s two-column body and its `lede` slot.
- **`getTopTerms`** — "counting the posts of every term was there to rank the rail's five; nothing
  ranks terms now" (`4492b27`).
- **The tag and category index pages** at `/blog/tags`, `/blog/etiquetas`, `/blog/categories` and
  `/blog/categorías`, and **`TermsLayout`**. The detail pages under those prefixes are unaffected.
- **The `/blog/years` and `/blog/años` URLs** — the same pages now live under `archive` / `archivo`.

## A note on the rail

The rail is out, not forbidden. `futuro.txt` asks for exactly this — three blocks listing
categories, tags and years, five each, sorted by content, each ending in a link to a page holding
the rest. Rebuilding it means rebuilding the index pages it links to and the counting helper it
sorts on, all of which this entry removed. Read this entry as the record of why it came out on this
date, not as a ban on the idea.
