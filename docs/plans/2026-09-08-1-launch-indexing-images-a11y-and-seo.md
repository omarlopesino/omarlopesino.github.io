# The site opens to search engines, with lighter images, cleaner a11y and sharper titles

*2026-09-08 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The first post was ready in both languages and the site was still `noindex, nofollow` behind a
`@todo`. Lighthouse and axe runs before opening it up flagged JPEG covers heavier than needed,
images shipped at their largest size into small slots, a lazy-loaded LCP image, render-blocking
font discovery, low-contrast text and ARIA misuse on the checkbox-driven toggles. Home and about
shared one bare title, and the sitemap was served under the integration's own file name.

## What this changed

- `0cc81df` — `SITE.robots` removed from `src/lib/seo.ts`; `buildMeta()` emits a `robots` tag only
  when a page's `meta.robots` sets one, and `robots.txt.ts` lost the noindex comment.
- `b3f7295` — `npm run build` renames `sitemap-index.xml` to `sitemap.xml`, and `robots.txt` points
  at it.
- `9ae166b`, `3466067`, `bf458da` — `scripts/generate-image-variants.mjs` writes AVIF only, with
  `@1x` companions `480x270` for covers and `200x200` for the avatar; `coverSrcSet()` in
  `src/lib/images.ts` builds `srcset`/`sizes` for `PostTeaser`, `CategoryCard`, `Post`, `ImageText` and `ProfilePicture`,
  which use a plain `<img>` instead of `astro:assets`' `<Image>`.
- `027fc8d` — the home page passes `priority` to its first recent post's image.
- `fdb1d36` — `Layout.astro` preloads the three self-hosted webfonts through `?url` imports.
- `5bb2f14` then `8d6f553` — `role="button"` added to the label toggles in `Menu`, `Modal` and
  `ThemeSwitcher`, then removed. `eab8f37` — `CategoryCard`'s post count at `/70` opacity.
- `b5fe7ff`, `d4fb98d`, `5250cc4` — `jobTitle`, `worksFor` and alternate names on the Person
  JSON-LD; role-qualified home title and description; an about title distinct from the home one.
- `d2b7833`, `c28cff6` — one `favicon.png`, cache-busted with `?ol1`; `SITE.image` is the avatar.
- `6aeb4f4` — `category.path` in `src/i18n/ui.ts` is `blog/categorias`, matching the directory.
- `69758e1` — post teasers no longer show the category badge.
- `1f95b38` — `Share.astro` returns early when its button or modal is not in the DOM yet.
- `a709bed` — the unlighthouse `make` targets only write the report; `view-unlighthouse-*` serve it.
- `00701fa` — `docs/post-template.mdx`, a frontmatter template for new posts.

## Decisions and their reasons

- **No site-wide `robots` default.** A page that needs one sets it through its `seo` block.
- **AVIF at quality 50**, sharp's default and the usual choice for photographs; it roughly halved
  both existing covers.
- **A plain `<img>` with `srcset`, not `<Image>`.** `astro:assets` was passing the `public/` paths
  through without optimising them, so it only hid that every slot got the 960px file.
- **No ARIA role on a label toggle.** A `<label>` tied to a form control permits none, and the role
  added no keyboard behaviour, so removing it was the fix the first commit only moved.
- **Fonts preloaded via `?url`** so the `href` matches Vite's hashed build path.
- **Distinct, role-qualified titles and Person details**, so a name search can tell this site from
  other profiles sharing the name and home and about do not read as duplicate titles.
- **No category badge on teasers**: it duplicated the one on the post page.
- **The share guard**: a botched view transition can fire `astro:page-load` before the button is
  placed, and throwing there broke the rest of the page-load work.
- `d2b7833`, `c28cff6`, `a709bed` and `00701fa` record no reason.

## What this removed

`SITE.robots` and the site-wide `noindex, nofollow`; `favicon.svg` and `favicon.ico`; the JPEG
covers and `public/omarlopesino.jpg`; the accented `categorías` route segment; the category badge
on post teasers.
