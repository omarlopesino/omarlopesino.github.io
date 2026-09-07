# The mobile menu becomes a hamburger and a lateral drawer

*2026-09-07 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Below `md`, `Menu.astro` stacked the logo, nav links and the language/theme switchers directly under
each other (`navbar max-md:flex-col`), so a visitor saw the whole header chrome before any page
content — working against making mobile content easier to see. Desktop's horizontal nav was fine and
stayed untouched.

## What this changed

- `src/components/ui/Menu.astro` — rebuilt around a DaisyUI checkbox-driven `drawer`: a hidden
  `input#mobile-nav.drawer-toggle`, a `.drawer-content` holding a `md:hidden` hamburger button (left
  of the `start` slot/logo) plus the unchanged desktop row (`hidden md:flex`), and a `.drawer-side
  md:hidden` panel holding the nav links, a close button, and the language/theme switchers, that
  slides in from the left over a dimmed backdrop. This follows the same no-JS toggle pattern as
  `Modal.astro` and `LanguageSwitcher.astro`'s `<details>`.
- `src/i18n/ui.ts`, `en`/`es` — new `nav.openMenu` / `nav.closeMenu` keys for the hamburger and close
  button `aria-label`s.
- `src/layouts/Layout.astro` — the theme-toggle script used `document.querySelector('.theme-controller')`,
  wiring only the first checkbox with that class. Since the drawer now renders a second
  `.theme-controller` (duplicated from the desktop row), the script was changed to
  `querySelectorAll`, syncing every instance's `checked` state on load and on any one's `change`.
- `src/components/ui/menu.stories.ts` — its `slots.logo` key never matched a real slot (`Menu`'s slot
  is named `start`); fixed to `slots.start` so the stories actually render a logo.

## Decisions and their reasons

- **A DaisyUI `drawer`, not custom JS** — matches the repo's settled decision that interactive UI
  stays JavaScript-free (radio tabs, `<details>`, checkbox modals); the drawer's slide animation is
  pure CSS (`translate` transition on `.drawer-side`).
- **Nav links and both switchers are duplicated into the drawer rather than referenced once** — Astro
  renders slotted content wherever a `<slot>` appears, so the same `start`/default/`end` slots feed
  both the desktop row and the mobile panel without a second component.
- **The theme-toggle script moved to `querySelectorAll` instead of giving the drawer's checkbox a
  different class** — duplicate `.theme-controller`s are now a real possibility on this page, and the
  fix keeps every instance correct rather than special-casing one.

## What this removed

The mobile-stacked navbar layout (`max-md:flex-col`, `max-md:pl-0 max-md:w-full max-md:text-center`)
is gone from `Menu.astro`; nothing a visitor could reach through it was dropped, all links and
controls are still reachable, now behind the hamburger.
