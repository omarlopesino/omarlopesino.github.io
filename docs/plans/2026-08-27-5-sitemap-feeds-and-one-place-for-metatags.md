# A sitemap, a feed per language, and one place metatags come from

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`docs/Requirements.md` had asked from the start for the site to be findable — "URL structure,
content, metatags, sitemap, robots and llms txt" — and for a way to follow it that stores nothing
about the reader. None of it existed. `Layout.astro` emitted a description, a canonical and the
hreflang set and nothing else: no Open Graph, no structured data, no sitemap, no feed. `Share.astro`
had been offering links to networks that scrape Open Graph since the post page shipped, so every
share produced a preview with no image and no title beyond `<title>`.

## What this changed

- `4f71593`, `2879d5f` — `@astrojs/sitemap` and `@astrojs/rss` added; the sitemap generated on build.
- `a4feff1`, `46316de` — `Meta` and `MetaTag` in `src/types.ts`; `src/lib/seo.ts` with `SITE`,
  `buildMeta`, `pageContext`, `postMeta` and the `articleLd` / `personLd` / `collectionLd` /
  `breadcrumbLd` builders.
- `9096fc5`, `b3e9e5c` — `src/components/Seo.astro` takes over canonical, hreflang, every metatag,
  the JSON-LD and the feed link; `Layout` keeps charset, viewport, favicons, refresh, title and the
  theme boot, and gains one `meta` prop.
- `4e32ae0` — `typeSeo`, `updatedDate` and `author` on the `blog` schema, all optional.
- `cb9a4eb`, `919b241` — `name` and `social` join `avatar` in `src/lib/profile.ts`; `postTrail`
  moves into `src/lib/blog.ts`.
- `a843cbf`, `b7f4daf`, `906bafe` — every layout composes its own `Meta`; only `Layout` and
  `PostsListLayout` take one as a prop.
- `c18bee3`, `21802fa`, `c4d6f08` — `feed.path` / `feed.title` / `feed.description` per locale;
  `src/lib/feed.ts` and `/en/rss.xml` · `/es/rss.xml`; an `mdi:rss` link in the footer.
- `a64ac5c`, `7385413` — `/robots.txt` and `/llms.txt` as generated endpoints.
- `af8a5a4` — `AGENTS.md` gains a Discovery section.

## Decisions and their reasons

- **The site stayed `noindex, nofollow`.** The value moved from a literal in `Layout` to
  `SITE.robots`, carrying its `@todo`, and the emitted HTML did not change on any of the 17 pages.
  Publishing is a decision to take on its own day, not a side effect of building the plumbing.
- **The sitemap runs with no `i18n` option.** That option derives alternates by swapping the locale
  prefix, and slugs here are translated, so it would have declared `/es/blog/hello-world` the twin of
  the English post when the page that exists is `/es/blog/hola-mundo`. Every URL is listed either
  way; only the pairing is dropped, and that is in each page's head already, built from the `cid`
  (`2879d5f`). Reconstructing the real pairs in `astro.config.mjs` was rejected: `serialize()` is
  synchronous and the config cannot import `astro:content`, so it would have meant a second copy of
  the composite-id rule, the `cid` join and the `url` transform, free to drift.
- **A metatag is added in one file.** `buildMeta` returns the whole head surface as one array, so a
  new tag is a line there and a field on `Meta` — no component, layout or page changes (`46316de`).
- **Structured data is separate builders, not a switch on `Meta.type`.** The two do not line up: a
  listing is `og:type` `website` but schema.org `Blog`, and a post needs a `BlogPosting` and a
  `BreadcrumbList` at once (`46316de`).
- **A page says what it is rather than being told.** Each layout already had the data, so it composes
  its own `Meta`; `PostsListLayout` takes one only because the year routes use it directly and have
  no layout to speak for them (`b7f4daf`, `906bafe`).
- **`Seo.astro` took the canonical and hreflang links with the metatags**, because `og:url` has to
  equal the canonical and both come from the same origin, language and alternates (`9096fc5`).
- **A post's metatags derive from its frontmatter**; the `seo` block only overrides one of them, so
  no existing post changed (`4e32ae0`).
- **Feeds carry the summary only**, which kept `sanitize-html` and `markdown-it` out of the
  dependency list; one feed per language so a reader subscribes in the language they read
  (`21802fa`).
- **`robots.txt` and `llms.txt` are generated, not files in `public/`**, because `BASE_URL` is the
  sole source of the site URL and a static file would write the domain out twice (`a64ac5c`).
- **`feed.path` stayed out of `routes.ts`.** Those keys feed `getAlternates()` for hreflang and a
  feed has none; the segment is untranslated, so the three-place route rule did not apply
  (`c18bee3`).

## What this removed

- **`<slot name="metatags" />` in `Layout.astro`.** It had never had a consumer. As an extension
  point it cannot be typed, deduplicated or reordered, and would need forwarding at every level of
  the stack to reach a term page; `Meta.extra` does the same job and travels for free (`b3e9e5c`).
- **The literal `<meta name="robots">` in `Layout.astro`** — the same value now comes from
  `SITE.robots`.
- **The LinkedIn URL written out twice**, in `Footer.astro` and `AboutLayout.astro`, and the
  duplicated `aria-label` on each footer link (`cb9a4eb`).
