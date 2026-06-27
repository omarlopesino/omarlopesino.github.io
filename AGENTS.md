# Repository Guidelines

## Project Structure & Module Organization

This is an Astro 7 personal site with localized routes and Storybook stories.

- `src/pages/` contains routes. English pages live under `src/pages/en/`, Spanish pages under `src/pages/es/`, and `src/pages/index.astro` is the root route.
- `src/components/` holds shared Astro components; reusable UI primitives are in `src/components/ui/`.
- `src/components/ui/*.stories.ts` contains Storybook examples for component states.
- `src/i18n/` contains route and translation helpers.
- `src/layouts/` contains page layouts, and `src/styles/global.css` contains Tailwind, DaisyUI, and theme setup.
- `public/` stores static assets served as-is. `docs/` stores requirements and design notes.

## Build, Test, and Development Commands

Use Node `>=22.12.0`.

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Astro dev server.
- `npm run build`: build the production site with `BASE_URL=https://omarlopesino.me`.
- `npm run preview`: preview the built site locally.
- `npm run storybook-dev`: run Storybook on port `6006`.
- `npm run storybook-build`: build the static Storybook output.

There is no dedicated test command yet; use `npm run build` and Storybook builds as regression checks.

## Coding Style & Naming Conventions

Use Astro single-file components with TypeScript frontmatter where props are needed. Keep component filenames in PascalCase, such as `PostTeaser.astro`, and keep stories lowercase only when matching existing files. Prefer Tailwind and DaisyUI utilities (`btn`, `badge`, `prose`) before custom CSS. Use two-space indentation in config and TypeScript files where practical.

For i18n work, update `src/i18n/ui.ts`, `src/i18n/routes.ts`, and both locale page trees together when adding user-facing routes or labels.

## Testing Guidelines

Add or update Storybook stories for reusable UI changes, especially new variants, slots, or interactive states. Name stories by visible behavior, for example `WithAction` or `PostTeaser`. Before a pull request, run `npm run build`; for component work also run `npm run storybook-build`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Update packages`, `Post detail`, and `Add typography + custom dark variant`. Follow that style: one concise subject line, capitalized, without a trailing period.

Pull requests should include a brief description, testing performed, and screenshots or Storybook links for visual changes. Link related issues or docs when relevant, and note any i18n impact explicitly.

## Security & Configuration Tips

Do not commit secrets or local environment files. Production site configuration is driven by `BASE_URL` in the build script and `site: process.env.BASE_URL` in `astro.config.mjs`; keep deployment URL changes intentional.
