# English moves to the site root; Spanish keeps `/es/`

*2026-09-17 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Since [2026-06-24](2026-06-24-1-i18n-and-translated-routes.md) every page lived under `/en/` or
`/es/`, and `/` was only a meta-refresh stub sending visitors to `/en/`. English is the default
language, so its pages now own the root, which broke the assumption baked into every URL builder
that all languages carry the same kind of prefix.

## What this changed

- `adf7a16` — `langPrefix(lang)` in `src/i18n/ui.ts` returns `''` for the default language and
  `/<lang>` otherwise, and `useUrl` builds through it. The `routes` map in `src/i18n/routes.ts`
  lists English paths without `/en`.
- `1018e0a` — the `blog` schema's `url` transform is `langPrefix(language) + '/blog/' + slug`, which
  fixes the RSS feed, `llms.txt` and the JSON-LD at once, since all of them read that field.
- `2c1887b` — `getContentAlternateUrls`, `getYearAlternateUrls` and `person()` in `src/lib/` use it.
- `9679933` — the RSS alternate link in `Seo.astro`, `LanguageSwitcher`'s no-match fallback and the
  `llms.txt` feed line use it.
- `da7519f` — `src/pages/en/**` moved up to `src/pages/**`; the English homepage replaced the old
  root `index.astro`.
- `6aae1ca` — the sitemap filter no longer excludes `/`.
- `c20f094` — `Layout`'s `refresh` prop, its `<meta http-equiv="refresh">` and `Seo`'s canonical
  flag for the stub are gone.
- `b13b00c` — `AGENTS.md` describes the site-root model.

## Decisions and their reasons

- **One function decides a language's prefix.** Every URL builder goes through `langPrefix`
  instead of its own ternary, so the rule cannot drift between the feed, hreflang and links.
- **The prefix goes by moving directories, not by configuration.** Astro's file-based routing is
  what produced `/en/`, so moving the pages is what removes it; Spanish is untouched.
- **Still no language redirection.** `/` is the English homepage itself, not a guess at the
  visitor's language.

## What this removed

The `/en/` prefix and `src/pages/en/`; the meta-refresh root page with its `refresh` prop and
canonical flag; the sitemap filter's exclusion of `/`.
