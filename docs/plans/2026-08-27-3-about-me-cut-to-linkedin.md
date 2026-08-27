# The about page stops keeping a second CV

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The page carried a hand-maintained CV: a work history in cards and thirty-two technologies in two
languages behind a button. All of it duplicated a LinkedIn profile that is already kept current,
and it had already drifted from it. Sixty-four JSON files existed to restate something maintained
elsewhere.

## What this changed

- `1c5c025` — the about page ends at the abilities section and a sentence linking to LinkedIn.
- `1399e8c` — `src/components/ui/Skills.astro` and its story deleted.
- `fba9520` — `about.work`, `about.workIntro`, `about.skills`, `about.skillsIntro`,
  `about.ctaSkills`, `about.close`, `about.present` and every `skill.group.*` key, in both
  languages, replaced by `about.linkedin`.
- `54eb86c` — the `experience` and `skill` collections dropped from `src/content.config.ts`.
- `ed7940a`, `30a82fe` — `src/data/skills/` (32 × 2 files) and `src/data/experience/` deleted.

## Decisions and their reasons

- **The site does not keep a CV.** "The skills modal and the work records were a second CV kept by
  hand, and it drifted from the one already on Linkedin. The page now stops at what I can be hired
  to do and sends anyone who wants the rest to the profile that stays current on its own"
  (`1c5c025`). The cost was never the markup — it was "each one a file to keep in step with a
  profile I already maintain elsewhere" (`ed7940a`).
- **The collections go with the sections.** "Both collections existed only to feed the about page
  sections that are gone, so the schemas and their loaders go with them" (`54eb86c`).
- **"Linkedin" is not translated.** It is the same word in both languages and the one the link
  hangs on, so it stays out of `src/i18n/ui.ts` and sits in the layout.

## What this removed

- **The Work section** and the `experience` collection with its Metadrop entry.
- **The skills popup**, the `Skills` component, the `skill` collection and its 64 data files.
- **Their translation keys**, listed above.

## What was kept, deliberately

This is the half most easily misread, so it is written out. Still current after this change:

- **The "My abilities" section** — `about.abilities`, the `ability` collection and its four
  entries. It was *not* removed; it is what the page now leads with.
- **`Modal.astro` and `RecordCard.astro`** — reusable primitives with their own stories. Kept even
  though nothing renders them today.
- **`cvCollection()` in `src/content.config.ts`** — `education` still uses it.

## Loose end

The LinkedIn URL is written into `src/layouts/AboutLayout.astro` and again into
`src/components/Footer.astro`. Pulling it into `src/lib/profile.ts` was offered and not taken up.
