# The about-me page, built out of content collections

*2026-08-26 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`/en/about-me` and `/es/sobre-mi` were routed and linked from everywhere (see
[the front page entry](2026-08-26-3-blog-as-front-page.md)) but still said `@TODO`.
`docs/Requirements.md` asks the page to show "what I do, in what projects I collaborate, and my
knowledge", and `docs/design/` fixes its shape. Writing that into two nearly identical `.astro`
files would make every record untranslatable and uneditable on its own.

## What this changed

- `d79f8cf` — four collections in `src/content.config.ts`: `experience`, `education`, `skill` and
  `spokenLanguage`, all on the `cid/language` id the taxonomies already use.
- `986c363`, `c99304c`, `db14abd`, `4e8e846` — the data: the Metadrop entry, the qualification,
  ~30 skills in two languages, and the spoken languages.
- `0f0a4c3` `Section`, `b86fda1` `IconCardLink`, `354c538` `TimelineEntry`, `97287f2` `Tabs` and
  `Tab`, `0672318` `Skills` — each with a story in the same commit.
- `93d3510`, `a84c83a`, `033ac8e` — `Details`, `DateInterval` and `ImageText` widened for the new
  callers, keeping their existing behaviour as the default.
- `a5ec09f` the strings, `760972d` `AboutLayout.astro`, `b70e59c` the two pages.
- `9c0e957` — `AGENTS.md` gains the rule that a `src/components/ui/` component is never a single
  page's furniture.

## Decisions and their reasons

- **Every repeatable record is a collection entry**, so it can be translated and edited on its own
  rather than living inside markup.
- **Work and studies are two collections, not one with a type discriminator.** Decided with the
  author, and made cheap by the record component being domain-neutral: a job, a qualification and a
  certification all fit it, so two collections need only one component.
- **`skill.group` is a stable id typed as a `z.enum`, and the labels come from the translations.**
  Grouping must never depend on translated text, and the enum makes the build reject a typo instead
  of silently rendering a sixth tab.
- **The collection is `spokenLanguage`, not `language`.** An entry's `language` field is the
  language it is *written in*; `name` is the language it *describes*. Naming them apart is the
  whole defence against confusing the two.
- **Skills are zero-JS radio tabs, not hover tooltips.** Descriptions worth writing should not be
  hidden behind an interaction a touch screen does not have, and radio tabs leave every panel in
  the DOM — which matters on a site whose whole point is being crawlable.
- **No `AboutHero`, no `AboutSection`.** "A component that only one page can use is a bug in this
  repo": the hero is `ImageText` with two overrides, and the generic `Section` is what any page
  gets. This is now a convention in `AGENTS.md`.
- **Anchor ids stay English in both languages** (`#work`, `#studies`, `#skills`), so a link to a
  section is a plain fragment needing no translation.

## What this removed

- **The `@TODO` placeholder** the pages had shipped with.
- **A hover-tooltip design for skills** — rejected, reasons above.
- **A single collection with a type discriminator** — rejected in favour of two.
- **Certifications and projects** — considered and left out for now.
- **`DateInterval`'s dead `Date.astro` import.**

## What outlived it

Most of this page was dismantled the next day, and the reasoning that survived it is the part about
components: `Section`, `IconCardLink`, `Tabs`, `Tab` and the record card were all built to be
reusable rather than page-specific, which is why removing the page did not take them with it. The
`education` and `spokenLanguage` collections are still declared.
