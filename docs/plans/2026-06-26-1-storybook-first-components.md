# A library of primitives, each with a story

*2026-06-26 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

With shadcn gone (see [the stack entry](2026-06-23-1-astro-daisyui-stack.md)) the site had a
header, a footer and nothing else to build pages out of. Rather than write each page's markup and
factor it later, the primitives were built first and on their own, each visible in Storybook
before any page used it.

## What this changed

- `83a1c3a` `Button`, `907bc77` + `cd70d43` `Card` "so it can have multiple variants", `a33bb42`
  `Bubble`, `0ef8053` + `80c679b` `Share`, `e3ebd98` `Small`, `cc67200` `PostTeaser`.
- `a67c482` `Details`, `22ea515` `Table`, `5f13a2d` `Facet`, `97e2a20` `ProfilePicture`,
  `c81925e` `DateInterval`, `257e691` `ImageText`, `1c1a262` `WebIntro`, `4d12d3c`
  `RecommendedPosts`.
- `d53a904` `@tailwindcss/typography` with the custom `dark` variant; `b7b6b85` and `480e6c0`
  move posts and teasers onto daisyUI classes.
- `c700972` — the background noise dropped from badges: "Setting background to the badges was
  triggering accesibility errors".
- `docs/design/Components.md` tracks each one as it lands.

## Decisions and their reasons

- **Every primitive gets a `*.stories.ts` beside it.** A component that only exists inside a page
  can only be looked at by building the page. This later became a hard rule in `AGENTS.md`.
- **Components take props and render; they do not fetch.** Content loading belongs in a layout,
  which is what keeps a component renderable standalone in Storybook.
- **One `Card` with variants rather than a card per use.** `cd70d43` widened the existing component
  instead of adding a second one; the same instinct is now written down as a convention.
- **Theming comes from daisyUI classes, not per-component colour.** `480e6c0` and `b7b6b85` exist
  to undo colours that had been set locally, so the theme switcher can reach everything.
- **Accessibility is a reason to drop a visual effect.** The background noise on badges went
  because it broke contrast (`c700972`), not because it looked wrong.

## What this removed

- **The decorative background on badges** — it triggered accessibility errors.
- **Locally set colours on posts and teasers** — replaced by daisyUI's theme classes, so nothing
  outside the theme decides a colour.
