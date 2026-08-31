# astro-scaffold: a generic content-entry CLI, added and immediately fixed twice

*2026-08-31 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Writing a new blog post or taxonomy entry meant hand-copying frontmatter shape from a sibling
file — no tool derived it from the schema. `astro-scaffold` fills that gap by introspecting the
project's own `src/content.config.ts` at runtime (collections, loader options, Zod schemas), so it
is not hardcoded to this repo's collections or field names and is meant to be reusable/contributed
elsewhere.

## What this changed

- New package `tools/astro-scaffold/` (`bin/astro-scaffold.mjs`, `src/*.js`, own `package.json`,
  `README.md`), wired into the root via `"astro-scaffold": "file:./tools/astro-scaffold"` in
  `package.json`'s `devDependencies` and a `"scaffold": "astro-scaffold"` script.
- `src/load-config.js` — bundles the target's `content.config.ts` with esbuild, intercepting the
  virtual `astro:content` module (reimplemented `defineCollection`/`reference`) and `astro/loaders`'
  `glob`/`file` calls (tagged with their captured options via a `Symbol.for` global registry key),
  so it runs in plain Node without Astro's Vite pipeline and without bundling Astro's own loader
  internals.
- `src/schema-walker.js` — dispatches on Zod v4's `schema.def.type` to turn any schema into a flat,
  promptable field list: unwraps `.transform()` via its `pipe`/`in` structure, groups an optional
  nested object behind one skip decision, folds a literal-only union into an enum-style select,
  and falls back to free text for anything unrecognized.
- `src/prompts.js` / `src/cli.js` — `@clack/prompts`-driven interactive flow: pick a collection,
  answer each field (skipping optional ones), infer and confirm a destination, then write.
- `src/path-inference.js` — learns a collection's on-disk convention (e.g. `<language>/<slug>.mdx`)
  by diffing existing sibling files' paths against their own frontmatter/JSON field values, rather
  than assuming a layout.
- `src/frontmatter.js`, `src/write-entry.js`, `src/file-loader-write.js` — a narrow hand-rolled
  YAML-frontmatter reader/writer (only the subset the tool itself produces), and the write paths
  for `glob()` collections (frontmatter+body or JSON) versus `file()` collections (one JSON file
  holding many entries, matched/inserted by id).

## Decisions and their reasons

- **esbuild plugins over Node's `module.register()` loader hooks** for intercepting
  `astro:content`/`astro/loaders`, because loader hooks are process-global and risk import
  recursion when the interceptor itself needs to load the real `astro/loaders`; esbuild plugins are
  scoped to one `build()` call.
- **The real `astro/loaders` module is resolved via `createRequire` against the target project's own
  `package.json`, not esbuild's `build.resolve()`**, because calling `build.resolve()` for
  `astro/loaders` from inside that same specifier's own `onResolve` handler recurses back into
  itself.
- **Astro's own loader internals are marked external, not bundled**, so their nested dependencies
  (`tinyglobby`, `picomatch`, …) resolve natively from wherever npm actually placed them, hoisted or
  not — bundling would have required statically resolving those too.
- **The bundled config is written to a temp file inside the target's own `node_modules/`**, not OS
  `/tmp`, so bare specifiers like `astro/zod` resolve against the target's real dependencies via
  Node's normal upward `node_modules` walk.
- **Zod itself is not a dependency of astro-scaffold** — the schema objects it receives already
  exist, built by the target's own Zod; the walker only ever inspects their structure.
- **No support for legacy implicit `src/content/<name>/` collections** — scoped to the modern
  Content Layer API (`defineCollection({ loader, schema })`) only.

## What this removed

Nothing pre-existing; this added a new package. Two of its own bugs were found and fixed the same
day, both from one root cause: clack's `text()` prompt reports the pre-submit value as `undefined`,
not `''`, when Enter is pressed with nothing typed. The validate wrapper in `prompts.js` checked
only for `''`, so an untouched optional number/date field was wrongly rejected, and — the opposite
failure — an untouched *required* field silently passed validation and then resolved to an empty
value that got dropped from the answers entirely (this is how a scaffolded post ended up missing
its required `cid`). `path-inference.js` was additionally hardened so a missing answer for a
templated path segment can never fall back to the whole slash-joined `generateId` string and
silently nest the new entry under a folder instead of writing a single file.
