# Repository Guidelines

Omar Lopesino's personal website: an Astro 7 static site with a blog browsable by tags and
categories, plus an about-me / contact page. Fully bilingual (English default, Spanish), built to
static HTML and deployed to GitHub Pages. `docs/Requirements.md` and `docs/design/` hold the
product intent (SEO-first, no user data, no analytics, no cookies, no forms).

`docs/plans/` is the decision log: why the code is shaped the way it is, and which alternatives were
measured and rejected. It is **append-only** — entries are dated and immutable, and
`docs/plans/README.md` is the one maintained page saying what is current. Record a decision by
adding an entry (`/log-entry` drafts one from a commit range); never rewrite an older one.

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

`/<lang>/` **is** the blog listing — there is no separate `/en/blog` page. Note that `blog.path` is
therefore not the listing URL but the post URL prefix: `getContentAlternateUrls('blog', …)` and the
`url` transform in `src/content.config.ts` both build `/<lang>/blog/<slug>` from it.

**Route segments are translated, and the page directory names match them literally**:
`src/pages/es/blog/categorías/[id]/[...page].astro`, `src/pages/es/blog/archivo/[year]/[...page].astro`
(accented/Spanish directory names are intentional). Three things must agree when adding or changing
a user-facing route or label:

1. the directory under `src/pages/<lang>/`,
2. `src/i18n/routes.ts` — the `routes` map, whose keys feed `getAlternates()` for hreflang,
3. `src/i18n/ui.ts` — the `*.path` keys (`blog.path`, `tag.path`, `category.path`, `year.path`,
   `about.path`), which components use at runtime to build links via `useUrl(lang)` + `t('tag.path')`.
   A taxonomy's key is the whole prefix, `blog/tags` and not `tags`, so every link to a term follows
   the routes below by changing one string.

Everything about the blog lives under `/<lang>/blog/`. Posts can be browsed three ways, each with a
detail page per value holding that value's posts:

| | detail | reached from |
| --- | --- | --- |
| tag | `…/tags/<slug>` · `…/etiquetas/<slug>` | the tag list on the blog page, and a post's own tags |
| category | `…/categories/<slug>` · `…/categorías/<slug>` | a post's byline and breadcrumb |
| year | `…/archive/<year>` · `…/archivo/<year>` | the archive |

The archive — `/en/blog/archive` · `/es/blog/archivo`, the `index.astro` of the directory its year
pages live in — is the only index page: tags and categories have none, so nothing but a term's own
detail page is built from those collections.

Years are a taxonomy with no collection behind it: `getYears(lang)` reads them off the posts, in UTC
to match `useFormatDate`, and `getYearAlternateUrls()` builds their hreflang from `year.path` rather
than looking a `cid` up.

`src/i18n/utils.ts` exposes the runtime helpers: `getLangFromUrl(Astro.url)` (parses the first path
segment), `useTranslations`, `useUrl`, `useFormatDate` (formats in UTC on purpose — the ISO dates in
frontmatter parse as UTC midnight and would otherwise shift a day in negative offsets).

Dynamic pages get their paths from `src/lib/blog.ts`: `staticPaths(collection, lang)` filters a
collection by `data.language` and keys params on `slug`, and it is what the post route uses.

**Every post listing is paginated at `POSTS_PER_PAGE` (15)**, so each one is a `[...page]` route
fed by `blogPaths(lang)`, `termPaths(type, lang)` or `yearPaths(lang)` — page one keeps the bare URL
and the rest get `/2`, `/3`. A paginated route must map its alternates through `pageAlternates()`
before handing them to the layout: `Layout` builds the canonical URL from the alternate matching the
page's own language, so without it page two would canonicalise to page one.

## Layout stack

`Layout.astro` is the only place that emits `<html>`. It keeps charset, viewport, favicons, the
meta-refresh, the `<title>` and the inline pre-hydration script that reads `localStorage.theme` onto
`data-theme`; everything about discovery it hands to `components/Seo.astro` — see **Discovery**
below.

Everything else composes downward:

```
Layout            html/head/header/footer, theme boot; Seo for discovery
├─ PostLayout         single post → ui/Post.astro
├─ PostsListLayout    header slot + ui/PostsRows + ui/Pagination, over one Page of posts
│  ├─ BlogLayout          a page of every post in a language
│  ├─ TermPostsLayout     a page of one tag's or category's posts, ui/TermHero in the header slot
│  └─ (year routes)       a page of one year's posts, used directly
└─ YearsLayout        the archive: every year with a post → ui/Facet
```

`PostsListLayout` takes Astro's `Page` object, not an array: it owns the empty state and the
pagination for every listing on the site. Its `header` slot falls back to `ui/PageTitle` with the
`heading` prop, which is how a term page swaps in its hero instead, and its `intro` slot is where
`BlogLayout` puts the byline and the tag list. It passes `lead` to `ui/PostsRows`, so every listing
leads with its newest post on a wider cover than the rows below it.

`ui/PostsRows` and `ui/GridList` are both thin wrappers over `ui/PostsList`, and they are not
interchangeable: rows are every paginated listing, the 3-up grid is only the post page's "Keep
reading" strip. The row layout itself — the alternating cover, its 16:9 floor, the lead — is
`.posts-rows` in `src/styles/global.css`, because nth-child alternation and logical corner radii
read worse as arbitrary Tailwind variants than as a dozen lines of CSS.

A card with a `url` gets `.card-highlight`: one hover-and-focus treatment for the whole card. It
has to be CSS too — `ui/Card` lays the link *over* the card, so the card itself never matches
daisyUI's `.card:focus-visible` and needs `:has(a:focus-visible)` instead.

Layouts do the content fetching (`getCollection` + mapping to the plain `PostInterface` shape from
`src/types.ts`); `src/components/ui/` components stay presentational and are driven only by props, so
they render standalone in Storybook.

## Discovery

The site is `noindex, nofollow` on every page. The value is `SITE.robots` in `src/lib/seo.ts`,
carrying the `@todo`; **it is a single-word change and not one to make in passing** — flipping it
publishes the site.

`src/components/Seo.astro` owns the whole discovery block of the head: canonical, `hreflang` plus
`x-default`, every metatag, the JSON-LD, and the feed link. `Layout` renders it and forwards one
`meta` prop.

`src/lib/seo.ts` is where a metatag is added — `buildMeta()` returns the whole head surface as one
array, so a new tag is a line there and a field on `Meta` in `src/types.ts`, and no layout or page
changes. `Meta.extra` takes tags the builder does not know about. The structured data is separate
builders (`articleLd`, `personLd`, `collectionLd`, `breadcrumbLd`) rather than a switch on
`Meta.type`, because the two do not line up: a listing is `og:type` `website` but schema.org `Blog`,
and a post emits a `BlogPosting` and a `BreadcrumbList` at once. All nodes go out in one
`@graph`.

**A page says what it is; it is not told.** Every layout composes its own `Meta` — `PostLayout` from
`postMeta(entry, category, tags)`, the rest from `collectionLd`/`personLd`. Only `Layout` and
`PostsListLayout` take a `meta` prop, the latter because the year routes use it directly. Use
`pageContext(Astro, …)` to build the URL, so a paginated listing describes the page being viewed
rather than page one.

A post's metatags are derived from its frontmatter. The optional `seo` block in the `blog` schema
only overrides one of them — a title tuned for a search result, a social card that crops better at
1.91:1, a canonical pointing where the post appeared first. `updatedDate` and `author` sit at the
top level, being facts about the post rather than overrides.

`@astrojs/sitemap` runs with **no `i18n` option, deliberately**: it derives alternates by swapping
the locale prefix, and slugs are translated, so it would declare `/es/blog/hello-world` as the twin
of the English post when the page is `/es/blog/hola-mundo`. Every URL is listed either way; the
pairing lives in each page's head, built from the `cid`. Its `filter` drops the redirect root and
the non-HTML endpoints.

`/en/rss.xml` and `/es/rss.xml` are summary-only feeds built by `src/lib/feed.ts` from
`getLangPosts()`; `/robots.txt` and `/llms.txt` are generated endpoints, not files in `public/`,
because `BASE_URL` is the sole source of the site URL. All four fall back to the request origin,
since `Astro.site` is unset under `astro dev` and `rss()` throws without it.

## Styling

Tailwind 4 via `@tailwindcss/vite` (no config file — everything lives in `src/styles/global.css`),
with DaisyUI and `@tailwindcss/typography`. Prefer DaisyUI and Tailwind utilities (`btn`, `badge`,
`prose`) before custom CSS. Dark mode is a DaisyUI theme selected by `data-theme` on `<html>`, wired
to a custom variant: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` — so
`dark:` classes work off the attribute, not `prefers-color-scheme`.

Nothing outside `.prose` styles headings, so a page heading is `ui/PageTitle` — `text-title`, centred
— rather than a bare `<h1>`. A post title is the exception `ui/Post.astro` sets itself, `text-display`
and ranged left in the prose column. The about-me page has no title of its own and instead promotes
the site name in the header, by passing `logoTag="h1"` down to `ui/Logo`.

Icons come from `astro-icon` with the `mdi` and `simple-icons` icon sets.

## Coding Style & Naming Conventions

Use Astro single-file components with TypeScript frontmatter where props are needed. Keep component
filenames in PascalCase, such as `PostTeaser.astro`, and keep stories lowercase only when matching
existing files. Use two-space indentation in config and TypeScript files where practical.

Wrapper components destructure explicit named props — do not forward `{...Astro.props}` wholesale.

Components in `src/components/ui/` are reusable primitives, never a single page's furniture. Name
and shape them for what they *are*, not for where they first appeared — `Section`, not
`AboutSection`. Page-specific assembly belongs in the layout, which is also what keeps a component
renderable standalone in Storybook. Before adding one, check whether an existing component does the
job with a class or slot override; widening that one is usually the better change.

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

## Do not reintroduce

Each of these was removed deliberately. The link goes to the entry in `docs/plans/` holding the
reason — read it before undoing any of them.

- **shadcn/ui, or a React runtime** — the stack is daisyUI classes and Astro components
  ([2026-06-23](docs/plans/2026-06-23-1-astro-daisyui-stack.md)).
- **A custom asset-compression script** — the build and the CDN do it
  ([2026-06-23](docs/plans/2026-06-23-1-astro-daisyui-stack.md)).
- **Language redirection inside the app** — it causes SEO problems; the root page is a plain
  meta-refresh ([2026-06-24](docs/plans/2026-06-24-1-i18n-and-translated-routes.md)).
- **`/en/blog` and `/es/blog` as listing URLs** — `/<lang>/` is the listing
  ([2026-08-26](docs/plans/2026-08-26-3-blog-as-front-page.md)).
- **A sidebar or spec-rail layout for the post page** — both were drawn and rejected in favour of
  the single editorial column
  ([2026-08-26](docs/plans/2026-08-26-2-blog-post-page-and-design-tokens.md)).
- **The `experience` and `skill` collections, `Skills.astro`, the skills popup and the Work
  section** — the page was a second CV that drifted from LinkedIn
  ([2026-08-27](docs/plans/2026-08-27-3-about-me-cut-to-linkedin.md)).
- **The `Sidebar.astro` rail, `getTopTerms`, `TermsLayout` and the tag/category index pages** —
  every value is reachable without them
  ([2026-08-27](docs/plans/2026-08-27-4-archive-as-the-only-index.md)).
- **A `metatags` slot on `Layout`** — a page describes itself with the `meta` prop, and `Meta.extra`
  takes what the builder does not cover
  ([2026-08-27](docs/plans/2026-08-27-5-sitemap-feeds-and-one-place-for-metatags.md)).
- **The `i18n` option on `@astrojs/sitemap`** — translated slugs make its prefix-swap alternates
  point at pages that do not exist
  ([2026-08-27](docs/plans/2026-08-27-5-sitemap-feeds-and-one-place-for-metatags.md)).
- **Geist, or a webfont loaded from Google** — the type is Karla and IBM Plex Mono, self-hosted
  through fontsource so the site makes no third-party request
  ([2026-08-27](docs/plans/2026-08-27-6-type-and-paper-in-karla.md)).

**Easily mistaken for removals, but current:** the `ability` collection and the "My abilities"
section on the about page; `Modal.astro` and `RecordCard.astro`, kept as reusable primitives;
`cvCollection()` in `src/content.config.ts`, which `education` still uses; `SearchBar.astro` and
`TagsSelector.astro`, unwired **by decision** rather than by oversight; and the archive at
`/en/blog/archive`. The rail is *deferred*, not forbidden — `futuro.txt` asks for it.

## Current state

The site is mid-build; `notas.txt` (Spanish) is the working TODO list. What follows is known to need
work rather than being a convention to imitate:

- `PostTeaser` forwards leftover props to `Card`, so anything beyond the `PostInterface` fields it
  destructures would land in the DOM as an attribute.
- `npm run storybook-build` fails at the prerender step with `Cannot find module
  'virtual:astro-icon'`; `npm run storybook-dev` works.
- The contact page doesn't exist yet — its `MenuLink` stays commented out in `Header.astro`.
- `education` and `spokenLanguage` are declared in `src/content.config.ts` but have no data behind
  them — `src/data/education/` and `src/data/spoken-languages/` were deleted and the collections
  were not. Both resolve to zero entries.
- The LinkedIn URL is written out twice, in `src/layouts/AboutLayout.astro` and in
  `src/components/Footer.astro`. `src/lib/profile.ts` is where a single copy would go.
- These `src/components/ui/` components currently have no caller: `Button`, `Details`,
  `IconCardLink`, `Modal`, `RecommendedPosts`, `RecordCard`, `SearchBar`, `Submenu`, `Tab`,
  `Table`, `Tabs`, `TagsSelector`. They are primitives with stories, not dead code — check
  `docs/plans/` before deleting one.
