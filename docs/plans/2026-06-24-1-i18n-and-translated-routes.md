# Two languages, prefixed URLs, and no redirect in the app

*2026-06-24 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`docs/Requirements.md` asks for a bilingual site: English first, because the blog is meant to be
readable anywhere, and Spanish because it is the author's own. That means two of every page, a way
to move between them, and hreflang links a search engine can follow — none of which existed. A
first attempt sent visitors to a language automatically from inside the app, and it was torn out
within the day.

## What this changed

- `3a96149` — Astro's i18n config in `astro.config.mjs`: locales `["en", "es"]`, default `en`,
  **no prefix stripping**, so every real page lives under `/en/` or `/es/`.
- `dd91972`, `4dbd744` — a language switcher, first inline, then a dropdown.
- `cd99be5` — `<html lang>` set from the URL rather than hardcoded.
- `2cbefd0` then `1871756` — automatic language redirection added, then removed.
- `e0403a2`, `6a17c06` — URL helpers that carry the language prefix, and generated `hreflang`
  alternates rather than a hand-written list; `29764c7` puts the alternate metatags in the head.
- `7d1a35c` — metatags for the root page that does the redirecting.

## Decisions and their reasons

- **Every page is prefixed, including the default language.** No prefix stripping means `/en/` and
  `/es/` are symmetric: one code path, and no page that exists at two URLs.
- **No language redirection inside the app.** "It would give SEO issues" (`1871756`). A crawler
  arriving at a URL must get that URL's content, not a guess based on its `Accept-Language`. What
  replaced it is a plain root page that points at `/en/`.
- **Alternates are generated, not listed.** "Scalable alternate metatag generation + Generated urls
  contains language prefix" (`6a17c06`) — a hand-kept list of translations goes stale the first
  time a page is added.
- **Route segments are translated, and the page directory is named after the segment.** `/es/` URLs
  read as Spanish, accents included; the directory name matching the segment literally is what
  keeps the route, the routes map and the translation string from drifting apart.

## What this removed

- **In-app automatic language redirection** (`2cbefd0`, removed by `1871756`) — an SEO problem.
  Anything that picks a language for the visitor before they have asked belongs at the edge or in
  a plain link, not in the rendered page.
- **Hand-written alternate metatags** — replaced by generation.
