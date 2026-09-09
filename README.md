This is my personal website. It contains my blog posts and a little bit about me.

---

## Architecture
The site is made with [Astro](https://astro.build), bilingual (English default, Spanish), built to static
HTML and deployed to GitHub Pages.

Most important coding evolutions are maintenance are documented at [`docs/plans/`](docs/plans/README.md).**. 
[`AGENTS.md`](AGENTS.md) is the document used by AIs to understand the system, and `docs/Requirements.md` with `docs/design/` hold the product initial specifications.

### Usage

Node version must be 22.12.0 or higher.

These are the available comands:

| | |
| --- | --- |
| `npm install` | install from `package-lock.json` |
| `npm run dev` | dev server. `BASE_URL` is unset here, so canonical and hreflang URLs fall back to the dev origin |
| `npm run build` | production build, with `BASE_URL=https://omarlopesino.me`. **This is the regression check** — it type-checks `.astro` frontmatter and validates every content entry against its schema. Do not run `astro check` |
| `npm run preview` | serve the built site |
| `npm run storybook-dev` | Storybook on port 6006 |
| `npm run storybook-build` | currently broken — see `AGENTS.md`, Current state |

### Routes

Every page lives under `/en/` or `/es/`; `/` is a meta-refresh to `/en/`.

| | English | Spanish |
| --- | --- | --- |
| blog listing (paginated, 15/page) | `/en/` | `/es/` |
| post | `/en/blog/<slug>` | `/es/blog/<slug>` |
| tag | `/en/blog/tags/<slug>` | `/es/blog/etiquetas/<slug>` |
| category | `/en/blog/categories/<slug>` | `/es/blog/categorías/<slug>` |
| archive index | `/en/blog/archive` | `/es/blog/archivo` |
| one year | `/en/blog/archive/<year>` | `/es/blog/archivo/<year>` |
| about me | `/en/about-me` | `/es/sobre-mi` |

### Content

- **Interface string** — `src/i18n/ui.ts`..
- **Route paths** — the `*.path` keys in the same file. Changing one means renaming the matching
  directory under `src/pages/<lang>/` and updating `src/i18n/routes.ts` in the same move.
- **Posts** — `src/blog/<lang>/*.mdx`, one file per language, tied together by the `cid` in their
  frontmatter.
- **Tags, categories and abilities** — `src/data/<collection>/<lang>/*.json`, same `cid` rule.
