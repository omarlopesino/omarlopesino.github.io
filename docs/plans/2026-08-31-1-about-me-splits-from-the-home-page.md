# The about bio becomes markdown; about-me splits back out of the home page

*2026-08-31 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The about page's pitch was a single plain-text translation string, too short to hold the links
(Metadrop, Drupal.org contributions, conference talks) the bio needed, so it moved into a markdown
`embed` entry instead. That grew the pitch to several paragraphs plus a row of profile-link bubbles,
and all of it still lived on `/<lang>/` — the site's home page since the
[2026-08-27](2026-08-27-8-about-me-as-home-page.md) merge — which buried the recent-posts teaser
under a wall of bio text.

## What this changed

- A new `embed` content collection (`src/content.config.ts`, `getEmbed()` in `src/lib/blog.ts`):
  `cid/language`-keyed entries whose MDX body renders directly, first used by `about-intro`
  (`src/embeds/{en,es}/about-intro.mdx`).
- `ImageText` gained a `stacked` prop (avatar above text at every width instead of beside it from
  `md` up); its text container switched from `<p>` to `<div>` to hold rendered markdown.
- `.text-center .prose :where(ul, ol)` gets `list-style-position: inside`, so a centered prose
  block's list markers sit next to the text instead of in prose's usual left-hand column.
- `src/i18n/routes.ts` — restored `about: { en: '/en/about-me', es: '/es/sobre-mi' }`.
- `src/i18n/ui.ts` — new `home.intro` (the home page's one-line pitch, en/es); `about.recentPosts`
  / `about.viewAllPosts` renamed to `home.recentPosts` / `home.viewAllPosts`; `about.path` restored
  (`about-me` / `sobre-mi`).
- New `src/layouts/HomeLayout.astro`: a small (48px) avatar beside the one-line pitch via
  `ImageText`, plus a six-post `GridList`; keeps `logoTag="h1"` so the site name is the page's
  heading.
- `src/layouts/AboutLayout.astro` trimmed to the avatar, the rendered `about-intro` bio, and the
  LinkedIn/GitHub/Drupal.org bubbles; gained a real `PageTitle` heading (`nav.about`), lost the
  recent-posts grid and `logoTag="h1"`.
- `src/pages/{en,es}/index.astro` now render `HomeLayout`; new `src/pages/en/about-me.astro` and
  `src/pages/es/sobre-mi.astro` render `AboutLayout` at its own route.
- `src/components/Header.astro` — nav gained an "About me" link (`about.path`) after Archive.
- `src/lib/profile.ts`'s `avatar.src` now points at `public/omarlopesino.jpg` (400×400), a real
  photo replacing the `200x200.jpg` placeholder, shared by the home page, post footers, and the
  about page.

## Decisions and their reasons

- **The bio is markdown, not a longer translation string**, because it needed real links; an
  `embed` entry keeps that content keyed by `cid`/`language` like everything else instead of
  hand-rolling HTML inside `ui.ts`.
- **This reverses part of the 2026-08-27 merge.** With the bio now multiple paragraphs plus profile
  links, keeping all of it on `/<lang>/` buried the recent-posts pitch. The home page goes back to
  being a one-line hook plus posts; the fuller self-presentation gets its own URL again, reusing the
  exact `about-me` / `sobre-mi` segments the site used before that merge.
- **The profile bubbles moved to the about page, not the home page** — they're part of the extended
  self-presentation, not the one-line pitch.
- **Recent posts went from 3 to 6** on the home page's grid, now that it's the page's main content
  besides the pitch.
- **`home.recentPosts` / `home.viewAllPosts` are renames, not new keys** — the copy is unchanged;
  only which layout owns it changed.

## What this removed

- `about.recentPosts` / `about.viewAllPosts` translation keys — renamed to `home.*`.
- `AboutLayout`'s recent-posts grid and `logoTag="h1"` — moved to the new `HomeLayout`.
- `public/200x200.jpg` as the real avatar — the file itself is untouched (still used by Storybook
  fixtures), but `src/lib/profile.ts`'s `avatar` no longer points at it.
