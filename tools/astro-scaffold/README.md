# astro-scaffold

Interactively scaffold a new Astro content collection entry, driven entirely by introspecting the
project's own `src/content.config.ts` (or `src/content/config.ts`) — no collection or field names
are hardcoded.

```
npx astro-scaffold
```

or, wired into a project's `package.json` as a script:

```
npm run scaffold
```

## What it does

1. Bundles the project's content config with `astro:content` and `astro/loaders` intercepted, so
   it can run in plain Node and capture each collection's loader (`glob()`/`file()`) options and
   Zod schema, without needing Astro's own Vite pipeline.
2. Lets you pick a collection from a list.
3. Walks the collection's Zod schema field by field — dispatching on the schema's type structure,
   not on known field names — prompting for a value per field and letting you skip anything
   optional.
4. For `glob()`-loader collections, infers the project's own on-disk naming convention (e.g.
   `<language>/<slug>.mdx`) by diffing existing sibling files' paths against their own frontmatter,
   then shows you the computed destination — editable — before writing anything.
5. For `file()`-loader collections (one file holding many entries), reads the existing file, adds
   the new entry by id, and rewrites it.

## Requirements

- Astro's modern Content Layer API (`defineCollection({ loader, schema })` with `glob`/`file` from
  `astro/loaders`) — Astro 5+. Legacy implicit `src/content/<name>/` collections aren't supported.
- Zod v4 schemas (what `astro/zod` re-exports on current Astro). A Zod v3 project still gets the
  collection list and the `object`/`optional`/`default` structure walked correctly, but every leaf
  field degrades to a raw text prompt.
- Node >=22.12.0.

## Known v1 limitations

- A schema field using `reference()`, or any other non-literal Zod union, or a `record()`, falls
  back to a single raw-text prompt rather than a fully guided input.
- Arrays of objects with more than one field fall back to a raw comma-separated text prompt instead
  of a structured per-item form.
- `file()`-loader collections only support writing to `.json` targets. `.yaml`/`.toml` targets
  print a message asking you to add the entry by hand, rather than attempting a lossy rewrite.
- Windows path handling hasn't been exercised (developed and tested on Linux).
