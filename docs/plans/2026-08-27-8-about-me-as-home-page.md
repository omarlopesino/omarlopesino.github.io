# The about-me page becomes the home page; the blog moves to /blog

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`/<lang>/` was the blog listing and the about-me page lived at its own `/en/about-me` /
`/es/sobre-mi` URLs ([2026-08-26](2026-08-26-3-blog-as-front-page.md)). For a personal site meant to
introduce Omar first, opening on a wall of posts buried the pitch; the about page also still carried
an abilities table and a LinkedIn paragraph that had drifted from the linked profile
([2026-08-27](2026-08-27-3-about-me-cut-to-linkedin.md) already cut the CV sections on the same
reasoning), and nothing on the site linked out to the professional profiles its own structured data
claimed.

## What this changed

- `src/pages/en/index.astro` and `src/pages/es/index.astro` now render `AboutLayout`; the former
  `about-me.astro` / `sobre-mi.astro` pages are gone.
- The blog listing moved to `src/pages/<lang>/blog/[...page].astro` (renamed from
  `src/pages/<lang>/[...page].astro`).
- `src/i18n/routes.ts` — the `about` route key replaced by `blog: { en: '/en/blog', es: '/es/blog' }`.
- `src/i18n/ui.ts` — `about.path` dropped; `blog.path` (`'blog'`, already used as the post URL
  prefix) now doubles as the listing path too. `about.linkedin` dropped. `about.workAt`,
  `about.recentPosts` and `about.viewAllPosts` added.
- `Header.astro` gains a `nav.home` link ahead of `nav.blog`; the `nav.about` link is gone.
- `Post.astro`'s author byline now points at `localizedUrl()` (the home page) instead of
  `t('about.path')`.
- `lib/blog.ts`'s `postTrail()` breadcrumb now starts at `localizedUrl(t('blog.path'))`.
- `AboutLayout.astro` — the abilities section, its content collection (`src/data/abilities/`,
  `content.config.ts`'s `ability` entry) and the LinkedIn paragraph are gone. In their place: a row
  of LinkedIn/GitHub/Drupal.org icon bubbles under the pitch (`Bubble.astro`, outlined and
  transparent), and a three-up `GridList` of the three most recent posts with a "view all" link to
  `blog.path`.
- `Footer.astro` and `lib/seo.ts`'s `personLd()` gain a Drupal.org link/claim; `lib/profile.ts`
  gains `social.drupal`.

## Decisions and their reasons

- **The home page is the pitch, the blog is one click away.** `nav.home` leads the header, `nav.blog`
  follows; the byline on every post also comes home rather than to a separate about URL.
- **`blog.path` now serves both jobs it used to split.** It was deliberately *only* the post prefix
  before, precisely because the listing lived at the bare `/<lang>/`; now that the listing has its
  own URL, reusing the same key for both keeps `useUrl(lang) + t('blog.path')` as the one pattern for
  every blog link instead of adding a second key that has to be kept in step with it.
- **The abilities table and the LinkedIn paragraph both go, not just LinkedIn.** Both restated
  content that lives, and is kept current, on the actual LinkedIn profile; the bubble row links out
  to it instead of copying it.
- **Drupal.org joins GitHub and LinkedIn as a claimed profile**, since it is the platform most of the
  cited work is built on — added to the footer, `personLd()`'s `sameAs`, and the home page bubbles
  together so the three stay in sync.
- **The blog page's own intro (an avatar-and-byline strip, plus the tag list) got simplified down to
  just the tag list**, centered in a `max-w-prose` box. With the pitch and the avatar now owning the
  home page, repeating them at the top of `/blog` read as redundant.

## What this removed

- **`/en/about-me` and `/es/sobre-mi` as the about page's URLs**, replaced by `/<lang>/` — see
  [2026-08-26](2026-08-26-3-blog-as-front-page.md) for why the about page had a separate URL in the
  first place.
- **The `ability` content collection**, `src/data/abilities/{en,es}/*.json`, and the "My abilities"
  section — superseded by the profile bubble linking to LinkedIn.
- **The about page's own LinkedIn paragraph** (`about.linkedin` in both languages) — the footer and
  the new bubble row carry that link now.
- **The blog listing's avatar-and-intro strip** (`WebIntro` on `BlogLayout`) — the tag list is what
  remains of the intro slot.
