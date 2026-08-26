# Repository Guidelines

Omar Lopesino's personal website: an Astro 7 static site with a blog browsable by tags and
categories, plus an about-me / contact page. Fully bilingual (English default, Spanish), built to
static HTML and deployed to GitHub Pages. `docs/Requirements.md` and `docs/design/` hold the
product intent (SEO-first, no user data, no analytics, no cookies, no forms).

## Project Structure & Module Organization

- `src/pages/` contains routes. English pages live under `src/pages/en/`, Spanish pages under
  `src/pages/es/`, and `src/pages/index.astro` is the root route.
- `src/components/` holds shared Astro components; reusable UI primitives are in
  `src/components/ui/`.
- `src/components/ui/*.stories.ts` contains Storybook examples for component states.
- `src/i18n/` contains route and translation helpers.
- `src/layouts/` contains page layouts, and `src/styles/global.css` contains Tailwind, DaisyUI, and
  theme setup.
- `src/lib/blog.ts` holds the collection-query helpers; `src/types.ts` the shared prop shapes.
- `public/` stores static assets served as-is. `docs/` stores requirements and design notes.

## Build, Test, and Development Commands

Use Node `>=22.12.0`.

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Astro dev server. Note `BASE_URL` is unset here, so `Astro.site` is
  `undefined` and canonical/hreflang URLs fall back to `Astro.url.origin`.
- `npm run build`: build the production site with `BASE_URL=https://omarlopesino.me`.
- `npm run preview`: preview the built site locally.
- `npm run storybook-dev`: run Storybook on port `6006`.
- `npm run storybook-build`: build the static Storybook output.

There is no dedicated test command. `npm run build` is the regression check — it type-checks
`.astro` frontmatter and validates every content collection entry against its Zod schema.

Do not run `astro check`.

## Content model

Three collections in `src/content.config.ts`, all glob loaders. The crucial detail is that **entry
IDs are composite**, because each piece of content exists once per language:

- `blog` — `src/blog/<lang>/*.mdx`, ID is `` `${slug}/${language}` ``. The schema `.transform()`
  adds a derived `url` field: `/<language>/blog/<slug>`.
- `category` / `tag` — `src/data/{categories,tags}/<lang>/*.json`, ID is `` `${cid}/${language}` ``.

`cid` is the **language-independent content id** that ties translations together. A post's
`category` / `tags` frontmatter references a bare `cid` (e.g. `"test"`), *not* a full entry ID, so
resolving a reference means re-appending the post's language — that is exactly what
`getPostCategory()` and `getPostTags()` in `src/lib/blog.ts` do. Never call `getEntry()` on a raw
reference id.

`cid` is also how `getContentAlternates()` finds an entry's translations for hreflang links.

## Routing and i18n

Astro i18n config (`astro.config.mjs`) declares locales `["en", "es"]`, default `en`, with no prefix
stripping — every real page lives under `/en/` or `/es/`. `src/pages/index.astro` is a meta-refresh
redirect to `/en/` (GitHub Pages can't do server redirects).

**Route segments are translated, and the page directory names match them literally**:
`src/pages/es/categorías/[id].astro`, `src/pages/es/etiquetas/[id].astro` (accented/Spanish
directory names are intentional). Three things must agree when adding or changing a user-facing
route or label:

1. the directory under `src/pages/<lang>/`,
2. `src/i18n/routes.ts` — the `routes` map, whose keys feed `getAlternates()` for hreflang,
3. `src/i18n/ui.ts` — the `*.path` keys (`blog.path`, `tag.path`, `category.path`), which components
   use at runtime to build links via `useUrl(lang)` + `t('tag.path')`.

`src/i18n/utils.ts` exposes the runtime helpers: `getLangFromUrl(Astro.url)` (parses the first path
segment), `useTranslations`, `useUrl`, `useFormatDate` (formats in UTC on purpose — the ISO dates in
frontmatter parse as UTC midnight and would otherwise shift a day in negative offsets).

Dynamic pages get their paths from `staticPaths(collection, lang)` in `src/lib/blog.ts`, which
filters a collection by `data.language` and keys params on `slug`.

## Layout stack

`Layout.astro` is the only place that emits `<html>`. It owns head metadata — canonical URL,
`hreflang` alternates plus `x-default`, and the inline pre-hydration script that reads
`localStorage.theme` onto `data-theme`. It currently emits `<meta name="robots" content="noindex">`
behind a `@todo`; remove that when the site goes live.

Everything else composes downward:

```
Layout            html/head/header/footer, SEO, theme boot
├─ PostLayout         single post → ui/Post.astro
├─ PostsListLayout    title + description + ui/GridList
│  ├─ BlogLayout          all posts for a language
│  └─ TermPostsLayout     posts for one tag/category
└─ TermsLayout        list of all tags or all categories
```

Layouts do the content fetching (`getCollection` + mapping to the plain `PostInterface` shape from
`src/types.ts`); `src/components/ui/` components stay presentational and are driven only by props, so
they render standalone in Storybook.

## Styling

Tailwind 4 via `@tailwindcss/vite` (no config file — everything lives in `src/styles/global.css`),
with DaisyUI and `@tailwindcss/typography`. Prefer DaisyUI and Tailwind utilities (`btn`, `badge`,
`prose`) before custom CSS. Dark mode is a DaisyUI theme selected by `data-theme` on `<html>`, wired
to a custom variant: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` — so
`dark:` classes work off the attribute, not `prefers-color-scheme`.

Icons come from `astro-icon` with the `mdi` and `simple-icons` icon sets.

## Coding Style & Naming Conventions

Use Astro single-file components with TypeScript frontmatter where props are needed. Keep component
filenames in PascalCase, such as `PostTeaser.astro`, and keep stories lowercase only when matching
existing files. Use two-space indentation in config and TypeScript files where practical.

Wrapper components destructure explicit named props — do not forward `{...Astro.props}` wholesale.

Comments say what the thing does and why it exists, in as few words as it takes: no restating the
code, no narrating alternatives that were weighed, no history. One line wherever one line does it.

## Testing Guidelines

Every new component in `src/components/ui/` ships with a `*.stories.ts` beside it, in the same
commit — no exceptions. Update the stories of existing components too, especially for new variants,
slots, or interactive states. Name stories by visible behavior, for example `WithAction` or `PostTeaser`.
Stories are plain CSF objects (`args`, plus a `slots` arg for named slots) — see
`src/components/ui/post.stories.ts`.

Before a pull request run `npm run build`; for component work check the stories in
`npm run storybook-dev` (`npm run storybook-build` is broken — see Current state).

`.storybook/main.ts` contains a deliberate workaround: astro-icon ships its Vite plugin inside an
Astro *integration*, and Storybook runs its own Vite without executing integrations, so the
integration's `astro:config:setup` hook is invoked manually to extract the plugin. Without it
`virtual:astro-icon` fails to resolve and any story rendering `<Icon />` breaks.

## Commit & Pull Request Guidelines

Commit only when asked, on the current branch — never create a branch unasked, and never push.

Don't bundle unrelated changes, and don't put a big feature in a single commit either: break it up
folder by folder, and file by file when a folder is still too big. Every piece has a purpose of its
own, and the message says what that purpose is.

Subject: conventional commit — `type(scope): description`, description imperative and lowercase, no
trailing period, whole line under ~70 chars. Body: a few sentences on why the change is the way it
is, prose wrapped at 97 chars, no bullet lists — and no body at all when the subject is the whole
story.

Pull requests should include a brief description, testing performed, and screenshots or Storybook
links for visual changes. Link related issues or docs when relevant, and note any i18n impact
explicitly.

## Deployment, Security & Configuration

`.github/workflows/deploy.yml` builds with `withastro/action` and deploys to GitHub Pages on every
push to `main`, then purges the Cloudflare cache (`CLOUDFLARE_ZONE_ID` / `CLOUDFLARE_API_TOKEN`
secrets).

Do not commit secrets or local environment files. Keep `BASE_URL` changes intentional — it is the
sole source of `site` in `astro.config.mjs`, and therefore of every canonical and hreflang URL.

## Current state

The site is mid-build; `notas.txt` (Spanish) is the working TODO list. Several term pages are still
wired up incorrectly and are known to need work rather than being conventions to imitate:

- `src/pages/en/blog/tags.astro` passes `type="category"`.
- `TermsLayout` maps every term field from `post.data.name`, and builds links from
  `cid.toLowerCase()` rather than the term slug.
- `PostTeaser` forwards leftover props to `Card`, so post `tags` land in the DOM as
  `<article tags="[object Object]">`.
- `npm run storybook-build` fails at the prerender step with `Cannot find module
  'virtual:astro-icon'`; `npm run storybook-dev` works.
- `PostsListLayout` destructures `language` while its callers pass `lang`.
- `src/pages/en/index.astro` is a `@TODO` placeholder; the about-me and contact pages don't exist yet
  (their `MenuLink`s are commented out in `Header.astro`).
