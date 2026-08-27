# shadcn dropped for daisyUI, and every component rebuilt in Astro

*2026-06-23 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The site was scaffolded on shadcn/ui, which brought React, `class-variance-authority`, `clsx`,
`tailwind-merge` and a folder of `.tsx` primitives with it. For a static personal blog with a
header, a card and a badge, that is a component framework and a runtime to maintain in exchange
for components the CSS framework already ships. `ec14152` says it plainly: shadcn "is too complex
for what is needed".

## What this changed

- `ec14152` — shadcn removed: `button.tsx`, `link.tsx`, `navigation-menu.tsx` and their stories
  deleted, daisyUI added, `src/styles/global.css` rewritten, ~5000 lines out of `package-lock.json`.
- `6088442` — every remaining component rewritten as an `.astro` single-file component.
- `986ac4f` — React dropped from `package.json`, `astro.config.mjs` and `.storybook/main.ts`.
- `e6aaaca` — Storybook repointed at the Astro renderer.
- `7af3bdb` — `astro-icon` replaces hand-written SVG components; `45c4c0c` adds the
  `simple-icons` set "to support X icon", `mdi` covers the rest.
- `d866303` — the custom compression script deleted.
- `d53a904` — `@tailwindcss/typography` plus a custom `dark` variant; `b7b6b85`, `480e6c0`,
  `1dd7150` move posts and teasers onto daisyUI's own classes.

## Decisions and their reasons

- **daisyUI over shadcn/ui.** "Shadcn is too complex for what is needed" (`ec14152`). daisyUI is
  class-based, so a component is markup plus a class name rather than a file to own.
- **No React.** "As we removed shadcn, react didn't became necessary. With this we unify how to
  make components" (`6088442`). One component language, and no client runtime shipped to a reader.
- **Assets are compressed by the build or the CDN, not by us.** "Discard custom script to compress
  in favour or build or CDN" (`d866303`) — a hand-rolled step that duplicates what two layers
  already do is a step that can rot.
- **Dark mode is driven by `data-theme`, not `prefers-color-scheme`.** The custom variant
  (`d53a904`) is what makes the theme switcher able to override the operating system at all.
- **Icons come from a set, not from files.** Hand-made SVG components were replaced wholesale
  (`7af3bdb`) so adding an icon is a name rather than a commit.

## What this removed

- **shadcn/ui and its dependency set** — too complex for the job.
- **React** — "until is needed again" (`986ac4f`). It was never needed again.
- **The custom asset-compression script** — the build and the CDN already do it.
- **Hand-written SVG icon components** — replaced by `astro-icon`.
- An Astro major upgrade attempted the same week was reverted (`e7d9ad6`, `ebcb435`) and only
  landed on 2026-06-27 (`f40105b`).
