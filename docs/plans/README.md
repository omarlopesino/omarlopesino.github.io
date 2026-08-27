# Decision log

**Entries are immutable.** Each one is dated and true as of its date; it is never edited afterwards.

**This page is what is current.** Everything below the contract is maintained; everything in a
dated entry is a record of one day.

**References point backwards only.** A new entry may say what it replaced; an older entry never
says what replaced it, so adding one never means opening another.

## How to add an entry

Two paths in, because most of this repository was written by hand.

**After a planning session** — copy `TEMPLATE.md` to `YYYY-MM-DD-N-<what-was-done>.md`, write it in
the past tense from the plan *and the tree* (a plan is a proposal; the tree is the fact), then
append a row to the table below.

**After a run of hand-made commits** — the same, sourced from
`git log --reverse --pretty='%h %ad %s%n%b' --date=short <since>..<until>`. The commit bodies are
the reasoning; the tree is the fact. Where a commit records no reason, say so — never invent one.
`/log-entry` drafts this for you.

Then, in both cases:

1. The date is the **first** commit of the run. The `-N-` ordinal orders entries that share a date,
   so the directory listing stays the chronology.
2. Grep every symbol, file, route and key you named, and confirm it is in the tree. Anything absent
   belongs in a removal section, not a description.
3. **Only if the entry reverses a settled decision below, update that one line.** No older entry is
   ever opened.

## Settled decisions — do not undo

Read the relevant block before touching a subsystem.

### Stack

- **daisyUI and Tailwind utilities, not a component framework.** shadcn/ui was removed as "too
  complex for what is needed" — [2026-06-23](2026-06-23-1-astro-daisyui-stack.md)
- **No React and no client-side framework.** Astro single-file components only —
  [2026-06-23](2026-06-23-1-astro-daisyui-stack.md)
- **Interactive UI is built without JavaScript** — radio tabs, `<details>`, a checkbox-driven
  modal. Every panel stays in the crawlable DOM —
  [2026-08-26](2026-08-26-4-about-me-page.md), [2026-08-27](2026-08-27-1-about-me-reworked-around-abilities.md)
- **Dark mode is driven by `data-theme`, not `prefers-color-scheme`** —
  [2026-06-23](2026-06-23-1-astro-daisyui-stack.md)
- **Colour comes from the design tokens, never from a component** —
  [2026-08-26](2026-08-26-2-blog-post-page-and-design-tokens.md)

### Routing and i18n

- **No language redirection inside the app** — it causes SEO problems —
  [2026-06-24](2026-06-24-1-i18n-and-translated-routes.md)
- **Every page is prefixed `/en/` or `/es/`; no prefix stripping** —
  [2026-06-24](2026-06-24-1-i18n-and-translated-routes.md)
- **`/<lang>/` *is* the blog listing.** There is no `/en/blog` page —
  [2026-08-26](2026-08-26-3-blog-as-front-page.md)
- **`blog.path` is the post URL *prefix*, not the listing URL.** Changing it breaks every post's
  hreflang silently — [2026-08-26](2026-08-26-3-blog-as-front-page.md)
- **Route directory names match `t('*.path')` literally, accents included** —
  [2026-06-24](2026-06-24-1-i18n-and-translated-routes.md)
- **Every paginated route maps its alternates through `pageAlternates()`**, or page two
  canonicalises to page one — [2026-08-27](2026-08-27-2-blog-listings-pagination-and-archives.md)
- **The archive is the only taxonomy index.** Tags and categories are reached from the blog page
  and from posts — [2026-08-27](2026-08-27-4-archive-as-the-only-index.md)

### Content model

- **`cid` is the language-independent id; entry ids are `cid/language`** —
  [2026-06-30](2026-06-30-1-multilingual-content-model.md)
- **A frontmatter reference holds a bare `cid`.** Tags and categories are matched *bare*;
  `recommended` re-appends the language before `getEntry`. They are opposites —
  [2026-08-26](2026-08-26-1-tag-and-category-detail-pages.md),
  [2026-08-26](2026-08-26-2-blog-post-page-and-design-tokens.md)
- **A post's `url` is computed by the schema**, not built at call sites —
  [2026-06-30](2026-06-30-1-multilingual-content-model.md)
- **The site does not keep a CV.** It links to LinkedIn instead —
  [2026-08-27](2026-08-27-3-about-me-cut-to-linkedin.md)

### Components

- **`src/components/ui/` holds reusable primitives, never one page's furniture** —
  [2026-08-26](2026-08-26-4-about-me-page.md)
- **Every primitive ships its `*.stories.ts` in the same commit** —
  [2026-08-26](2026-08-26-1-tag-and-category-detail-pages.md)
- **Explicit named props; never `{...Astro.props}`** —
  [2026-08-26](2026-08-26-1-tag-and-category-detail-pages.md)
- **Layouts fetch, components render** —
  [2026-07-04](2026-07-04-1-blog-routing-and-queries.md)
- **The post page is a single editorial column.** A sidebar and a spec rail were both drawn and
  rejected — [2026-08-26](2026-08-26-2-blog-post-page-and-design-tokens.md)

### Deployment

- **GitHub Pages on every push to `main`, then a full Cloudflare purge** —
  [2026-06-24](2026-06-24-2-github-pages-and-cloudflare.md)
- **`BASE_URL` is the sole source of every canonical and hreflang URL** —
  [2026-06-24](2026-06-24-2-github-pages-and-cloudflare.md)

### Verification

- **`npm run build` is the regression check. Never `astro check`.**
- **`npm run storybook-build` is broken;** use `npm run storybook-dev`.

## Entries

Newest first.

| Date | Entry |
| --- | --- |
| 2026-08-27 | [The listing becomes alternating rows, and a card shows when it is focused](2026-08-27-7-posts-listing-as-alternating-rows.md) |
| 2026-08-27 | [The type set in Karla, on warm paper](2026-08-27-6-type-and-paper-in-karla.md) |
| 2026-08-27 | [A sitemap, a feed per language, and one place metatags come from](2026-08-27-5-sitemap-feeds-and-one-place-for-metatags.md) |
| 2026-08-27 | [The rail and the taxonomy indexes come out; the archive stays](2026-08-27-4-archive-as-the-only-index.md) |
| 2026-08-27 | [The about page stops keeping a second CV](2026-08-27-3-about-me-cut-to-linkedin.md) |
| 2026-08-27 | [One paginated layout behind every post listing](2026-08-27-2-blog-listings-pagination-and-archives.md) |
| 2026-08-27 | [The about page reordered around what I can be hired to do](2026-08-27-1-about-me-reworked-around-abilities.md) |
| 2026-08-26 | [The about-me page, built out of content collections](2026-08-26-4-about-me-page.md) |
| 2026-08-26 | [The blog becomes the front page](2026-08-26-3-blog-as-front-page.md) |
| 2026-08-26 | [The post page as an editorial column, on a real palette](2026-08-26-2-blog-post-page-and-design-tokens.md) |
| 2026-08-26 | [Tag and category pages that show the right posts](2026-08-26-1-tag-and-category-detail-pages.md) |
| 2026-07-04 | [Post and term pages, driven by shared query helpers](2026-07-04-1-blog-routing-and-queries.md) |
| 2026-06-30 | [One entry per language, tied together by a cid](2026-06-30-1-multilingual-content-model.md) |
| 2026-06-28 | [A search bar and a tags selector, built and left unwired](2026-06-28-1-search-built-and-shelved.md) |
| 2026-06-26 | [A library of primitives, each with a story](2026-06-26-1-storybook-first-components.md) |
| 2026-06-24 | [Deployed to GitHub Pages, with the CDN purged behind it](2026-06-24-2-github-pages-and-cloudflare.md) |
| 2026-06-24 | [Two languages, prefixed URLs, and no redirect in the app](2026-06-24-1-i18n-and-translated-routes.md) |
| 2026-06-23 | [shadcn dropped for daisyUI, and every component rebuilt in Astro](2026-06-23-1-astro-daisyui-stack.md) |

## Coverage

This log is not complete: the scaffolding and design phase of 2026-06-12 to 2026-06-21 — the Astro
and Storybook setup, the initial component inventory and the wireframe — has no entry, and lives in
`docs/design/` and `docs/Requirements.md` instead.
