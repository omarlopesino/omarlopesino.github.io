# The about page reordered around what I can be hired to do

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The page built the evening before (see [the about-me entry](2026-08-26-4-about-me-page.md)) led
with three call-to-action cards and gave a technology list the same weight as everything else. A
visitor arriving to work out whether to hire someone does not start from a list of frameworks. The
page needed to open with what the author can be hired *for*, in the visitor's own words, and put
the technology list where reference material belongs.

## What this changed

- `a9cacd7`, `3df2dc1` — the `ability` collection and four entries in both languages: sites, APIs,
  single sign-on integrations, retrieval augmented generation.
- `e13adfb` — `Modal.astro`, a popup with no JavaScript: a checkbox and its label, so any number of
  triggers can open it and the content sits in the HTML whether it is open or not.
- `560469f`, `2b079cc` — `DefinitionTable.astro`, pulled out of the skills panel so a second list
  could use the same table, and the panels rebuilt on it.
- `5ad169e` — the timeline entry became `RecordCard`: a card rather than a collapse, so a section
  of several reads as a grid instead of a stack of closed drawers.
- `8710b42` — a dated record may carry a logo and may drop its bullets; `b5b4ab7` trims the
  Metadrop entry to a short summary.
- `029a188` — `src/lib/profile.ts` holds the avatar once.
- `139eec8` — a `Section`'s outer spacing became a prop that replaces the default.
- `c635202`, `a43e3b3` — the studies and languages sections removed, with their data.
- `c752464` — the page reassembled: abilities first, skills behind a button, work after.

## Decisions and their reasons

- **An ability is not a skill.** "An ability is what a visitor comes looking for — building a site,
  an API, an integration — where a skill is the technology underneath it. Two lists with two
  audiences, so two collections" (`a9cacd7`).
- **The skill list goes behind a button.** "A technology list is reference material rather than
  part of the story" (`c752464`) — present for whoever wants it, not in the way of whoever does not.
- **The modal is a checkbox, not a `<dialog>`.** The content is in the HTML open or closed, "which
  is what a crawler needs" (`e13adfb`), and any label anywhere can open it.
- **A record is a card, not a collapse.** "Nothing about it was ever a timeline" (`5ad169e`), and
  several closed drawers read worse than a grid.
- **The avatar is one export.** The same placeholder was about to sit in three layouts; one export
  means a real photo is one edit and "the blog, the post footer and the about-me page cannot drift
  apart" (`029a188`).
- **Spacing that a caller must be able to replace is a prop, not a class.** A margin in the class
  list argues with the caller's at equal specificity and wins on emission order (`139eec8`).

## What this removed

- **The three call-to-action cards** at the top of the page, and two of their three labels.
- **The studies and languages sections**, and the `src/data/education/` and
  `src/data/spoken-languages/` entries behind them (`c635202`, `a43e3b3`). Neither commit records
  a reason. The `education` and `spokenLanguage` collections stayed declared in
  `src/content.config.ts` with nothing behind them, and still are.
- **The nine-bullet job description** — reduced to twenty-odd words, because a full job description
  in a card grid "turns the section into a page of its own" (`b5b4ab7`).
