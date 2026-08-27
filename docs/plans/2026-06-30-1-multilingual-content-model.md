# One entry per language, tied together by a cid

*2026-06-30 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

A bilingual blog has to answer one awkward question: a post and its translation are two documents,
but they are also the same post. Astro's collections key an entry by its file path, which makes
`hello-world` in English and `hello-world` in Spanish collide, or forces the slug to differ and
lose the link between them. Tags and categories had the same problem and were not collections at
all yet.

## What this changed

- `574070b` — content moved out of `src/content` to `src/blog/` and `src/data/`, so the loader
  glob decides the shape rather than the framework's default directory.
- `8325bd7` — tags and categories redefined as content collections.
- `9d47c97` — the collections declared multilingual: each entry carries `language` and `cid`, and
  `generateId` builds the composite id `` `${cid}/${language}` `` (posts key on `slug` instead).
- `5db0fb4`, `a5c6c72`, `7d74b48` — one field name for the slug and one for the id, across every
  collection.
- `d6aa460` — one data type for `pubDate` everywhere.
- `9241c23` — `url` becomes a computed field on the schema rather than a string built per call site.
- `3837c98` — terms gain a description and an image, so a term page has something to show.
- `5525ae9`, `1e99211`, `62105aa` — the blog collection's shape settled, including the rename to
  `pubDate`.

## Decisions and their reasons

- **`cid` is a language-independent content id, and it is what ties translations together.** It is
  how a page finds its own translations for hreflang, and it is why a post can reference a tag
  without knowing which language it will be rendered in.
- **Entry ids are composite, `cid/language`.** Two translations of one thing are two entries, and
  the id says which is which without a separate lookup table.
- **A reference in frontmatter holds a bare `cid`, not a full entry id.** A post says
  `category: "test"`; resolving it means re-appending the post's own language. This is the single
  sharpest edge in the content model and it has cut twice since.
- **`url` is computed by the schema.** Building a post's URL at each call site is how two of them
  end up disagreeing.
- **Content lives outside `src/content`.** The glob loader takes an explicit `base` and `pattern`,
  so the directory layout is a decision the repo makes rather than one the framework imposes.

## What this removed

- **Tags and categories as loose data** — they became collections, validated by a Zod schema at
  build time.
- **Per-call-site URL building** — replaced by the computed `url` field.
- **Three spellings of the same field.** The slug, the id and the publication date each had more
  than one name or type across collections; `5db0fb4`, `a5c6c72`, `7d74b48` and `d6aa460` settle
  on one of each.
