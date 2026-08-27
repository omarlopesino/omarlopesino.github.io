# The blog becomes the front page

*2026-08-26 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`docs/Requirements.md` had left the question open in as many words: "It is pending to decide to
show first the about me or the blog entries." Meanwhile `/en/` and `/es/` were `@TODO`
placeholders, the real listing lived at `/en/blog`, and every post's author block pointed at the
front page because there was no about page to point at.

## What this changed

- `e33bb57` — `about.path` (`about-me` / `sobre-mi`) and the `about` route in `src/i18n/routes.ts`.
- `38202b7` — `/en/` and `/es/` become the blog listing; `src/pages/{en,es}/blog.astro` deleted.
- `0f027a0` — `src/pages/en/about-me.astro` and `src/pages/es/sobre-mi.astro`, still `@TODO`.
- `cb883dc` — the header menu links to it; `6ea9b68` repoints the post links.
- `dceefc9` — `PostsListLayout` reads the `lang` prop its callers actually pass.
- `3e2fe3b` — `docs/Requirements.md` records the decision.

## Decisions and their reasons

- **The blog is the front page.** The site's stated purpose is sharing what the author writes; the
  self-presentation is what a visitor looks up afterwards, not what they land on.
- **`/<lang>/` *is* the listing — there is no `/en/blog` page.** Both `blog.astro` files were
  deleted so the post grid lives at exactly one URL rather than two that must agree.
- **`blog.path` stays `'blog'`, and it is not the listing URL.** It is the post URL *prefix*, and
  two independent consumers build from it: `getContentAlternateUrls('blog', …)` for every post's
  hreflang, and the `url` transform in `src/content.config.ts`. Changing it breaks post hreflang
  links silently — nothing errors, the links just point nowhere.
- **The about page shipped empty.** There was no real copy to move, so this change is structural:
  the routing, the menu and every inbound link are wired, and the words come later.
- **`routes.blog` goes.** Only the two deleted files referenced it. `routes.home` was already
  correct once home became the listing.
- **The `language`/`lang` mismatch is fixed here rather than deferred.** It was cosmetic while it
  affected a term page; routing the *front page* through that layout made it an empty `<html lang>`
  and a canonical URL that missed its own alternate.

## What this removed

- **`src/pages/en/blog.astro` and `src/pages/es/blog.astro`** — so the grid has one URL. The bare
  `/en/blog` and `/es/blog` stopped resolving; everything under `blog/` kept its URL.
- **`routes.blog`** — unreferenced once those two files went.
- **The stale comment in `Post.astro`** saying the author block points at the front page "until an
  about page exists".
