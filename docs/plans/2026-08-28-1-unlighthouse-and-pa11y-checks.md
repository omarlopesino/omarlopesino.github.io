# Local and live-site checks for Lighthouse and accessibility, via make

*2026-08-28 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The project had no test command at all — `npm run build` was the only regression check. Wanted
site-wide Lighthouse (performance/SEO/best-practices) and accessibility checks runnable locally on
demand, against both the local build and the live site, without adding a Dockerfile or a compose
file to maintain.

## What this changed

- `Makefile` at the repo root: `test-unlighthouse-local`, `test-unlighthouse-production`,
  `test-pa11y-local`, `test-pa11y-production`, and `clean`. Each runs its tool via `npx` inside the
  official `ghcr.io/puppeteer/puppeteer` image (pinned tag), so no custom Docker image is built.
- `tests/with-preview-server.sh` (local targets only): builds and serves the site fresh on port
  4322 — distinct from `npm run dev`'s 4321, so a running dev server (which has no sitemap) is
  never touched — and tears the preview server down on exit.
- `tests/with-report-server.sh` (all four targets): opens a self-contained HTML report directly,
  or for Unlighthouse's dashboard (a Vite SPA that browsers block from running as a module script
  over `file://`) serves it with `sirv-cli` and blocks in the foreground until Ctrl+C, matching how
  `npm run preview`/`storybook-dev` already behave here.
- `tests/unlighthouse/base.config.ts` (shared Chrome setup and `scanner.ignoreI18nPages: false` —
  Astro's `x-default` hreflang alone trips Unlighthouse's alternate-language skip, in both
  environments) plus `local.config.ts` and `production.config.ts`, the latter also excluding
  `/cdn-cgi/*` (see below).
- `tests/pa11y/local.json` and `tests/pa11y/production.json`: an explicit URL list — homepage,
  blog, archive — rather than a sitemap crawl, so coverage grows deliberately.
- Reports land under `tests/reports/<tool>-<local|production>/` (gitignored), the whole `tests/`
  directory mounted into the container so each config's `../reports/...` path resolves there.

## Decisions and their reasons

- **`npx` inside the official Puppeteer image, not a custom Dockerfile.** Keeps the no-Dockerfile
  constraint while still getting a real, already-present Chrome — `executablePath` in the configs
  points straight at it rather than letting whichever `puppeteer` version each npm package installs
  try to download its own.
- **Local targets fail loudly if their port is already taken**, rather than silently reusing
  whatever's there — the one time this wasn't the rule, `make` silently tested a `dev` server's
  sitemap-less build, which gave a false "0 URLs" pass.
- **Every target captures the test tool's exit status and opens the report before propagating
  it**, instead of letting `set -e` abort the moment errors are found — that is exactly when
  seeing the report matters most.
- **Unlighthouse's production config excludes `/cdn-cgi/*`.** Cloudflare's injected
  email-obfuscation redirect 404s when fetched outside the page context that generated it, and
  following it hung the crawler indefinitely rather than being skipped — found by running the scan
  against the live site.
- **Pa11y checks an explicit URL list, not a sitemap crawl**, so which pages are covered is a
  deliberate, visible decision rather than "everything the sitemap happens to contain".
