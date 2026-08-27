This is my personal website.

---

## Working on this site

An [Astro](https://astro.build) static site, bilingual (English default, Spanish), built to static
HTML and deployed to GitHub Pages.

**Why the code looks the way it does — and which alternatives were tried and rejected — is in
[`docs/plans/`](docs/plans/README.md).** It is an append-only decision log; start at its index
before changing a subsystem. [`AGENTS.md`](AGENTS.md) is the architecture and conventions document,
and `docs/Requirements.md` with `docs/design/` hold the product intent.

### Running it

Node `>=22.12.0`.

| | |
| --- | --- |
| `npm install` | install from `package-lock.json` |
| `npm run dev` | dev server. `BASE_URL` is unset here, so canonical and hreflang URLs fall back to the dev origin |
| `npm run build` | production build, with `BASE_URL=https://omarlopesino.me`. **This is the regression check** — it type-checks `.astro` frontmatter and validates every content entry against its schema. Do not run `astro check` |
| `npm run preview` | serve the built site |
| `npm run storybook-dev` | Storybook on port 6006 |
| `npm run storybook-build` | currently broken — see `AGENTS.md`, Current state |

### Routes

Every page is under `/en/` or `/es/`; `/` is a meta-refresh to `/en/`.

| | English | Spanish |
| --- | --- | --- |
| blog listing (paginated, 15/page) | `/en/` | `/es/` |
| post | `/en/blog/<slug>` | `/es/blog/<slug>` |
| tag | `/en/blog/tags/<slug>` | `/es/blog/etiquetas/<slug>` |
| category | `/en/blog/categories/<slug>` | `/es/blog/categorías/<slug>` |
| archive index | `/en/blog/archive` | `/es/blog/archivo` |
| one year | `/en/blog/archive/<year>` | `/es/blog/archivo/<year>` |
| about me | `/en/about-me` | `/es/sobre-mi` |

### Where the words live

- **Interface copy** — `src/i18n/ui.ts`. It is `as const` and the type comes off the English keys,
  so **every key must exist in both languages** or the build fails.
- **Route segments** — the `*.path` keys in the same file. Changing one means renaming the matching
  directory under `src/pages/<lang>/` and updating `src/i18n/routes.ts` in the same move.
- **Posts** — `src/blog/<lang>/*.mdx`, one file per language, tied together by the `cid` in their
  frontmatter.
- **Tags, categories and abilities** — `src/data/<collection>/<lang>/*.json`, same `cid` rule.
