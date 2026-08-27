# The type set in Karla, on warm paper

*2026-08-27 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The site had been set in Geist on an almost-blue white since the palette was drawn
([2026-08-26](2026-08-26-2-blog-post-page-and-design-tokens.md)). Both were defensible and neither
said anything: Geist is the face half the web ships, and the surfaces were neutral to the point of
being clinical. The brief was a blog that looks like it belongs to one person — elegant, but humble,
and not a template.

## What this changed

- `src/styles/global.css` — `@fontsource-variable/geist` out; `@fontsource-variable/karla` and two
  static weights of `@fontsource/ibm-plex-mono` in.
- The `@theme` block now declares `--font-sans` (Karla), `--font-display` (pointing at
  `--font-sans`) and `--font-mono` (Plex Mono). `--text-display` went 2.75rem at `-0.025em`, and
  `--text-title` took the same tracking.
- `.prose` reads at `1.0625rem` with `line-height: 1.7`, and `.prose :where(h1, h2, h3, h4)` names
  the display face, since the typography plugin would otherwise inherit whatever `body` has.
- Six primitives took `font-display` on their heading: `PageTitle`, `Post`, `Card`, `Logo`,
  `PostsList`, `Section`.
- Ten took `font-mono`: `MenuLink`, `Date`, `Breadcrumb`, `PostMeta`, `PostCategory`, `Bubble`,
  `Small`, `Pagination`, `Share`, `LanguageSwitcher`.
- Both themes moved off hue 285 onto warm hues 68–85: light base-100 `oklch(97% 0.011 80)`, dark
  base-100 `oklch(17.5% 0.012 75)`, with 200, 300 and base-content following.

## Decisions and their reasons

- **Karla, chosen after four rounds against seven other pairings.** The rounds ran elegant to
  informal — Newsreader, Instrument Serif, Space Grotesk, then Newsreader with Lora, then IBM Plex
  Serif, Literata and Vollkorn, then Plex Sans, Bitter with Atkinson Hyperlegible and Space Grotesk
  again. Karla is a grotesque with enough irregularity to have a voice without dressing up; the
  serif rounds read as too formal for the brief and the neutral sans rounds read as no choice at
  all.
- **Mono for the chrome, not a second colour or size.** Navigation, breadcrumb, dates, category,
  tags, pagination, share and the footer are what the page says about itself rather than to the
  reader. The face separates them from the reading column on its own.
- **Nav links dropped to `text-sm`.** A monospace runs wide enough at the base size to crowd the
  header.
- **`--font-display` is its own token although it resolves to `--font-sans` today.** A separate
  title face is then one line in the theme rather than a sweep through twelve components.
- **Headings name their family at the component.** Tailwind's `--text-*` tokens carry size, weight
  and tracking but not a family, so nothing outside `.prose` inherits a heading face.
- **Dark follows light onto the warm hue.** The theme switcher should not change the site's
  temperature.
- **Faces stay self-hosted through fontsource.** A Google Fonts link would put a third-party request
  on a site built with no analytics, no cookies and no forms. The cost is that Plex Mono has no
  variable build, so the two weights the chrome uses are imported one file each.
- **Primary violet and the amber accent were not touched**, so the change stayed type and surfaces
  and nothing else.

## What this removed

- **Geist**, as both the `@fontsource-variable/geist` dependency and the `--font-sans` value it
  held. Nothing else referenced it.

Two things are worth recording as *not* removals: the serif stack tried on this date — Newsreader
titles over Lora with JetBrains Mono chrome — was built, reviewed in the browser and rejected for
being too formal, but it was never committed, so it exists in no tree. And the eleven rejected
pairings were kept as a design canvas outside the repository, not as files here.
