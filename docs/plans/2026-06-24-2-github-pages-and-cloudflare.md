# Deployed to GitHub Pages, with the CDN purged behind it

*2026-06-24 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The site builds to static HTML and had nowhere to go. It needed a deploy that runs itself on a
push, costs nothing, and does not become a second thing to maintain. It also sits behind
Cloudflare, which will happily keep serving the previous build after a successful deploy.

## What this changed

- `a7b4f25` — `.github/workflows/deploy.yml`: `withastro/action` builds and
  `actions/deploy-pages` publishes, on every push to `main` and on manual dispatch.
- `b32b808` — a third job purges the Cloudflare cache after the deploy job, calling the zone's
  `purge_cache` endpoint with `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` from repository
  secrets.
- `2e04d86` — `<meta name="robots" content="noindex">` while the site is unfinished.

## Decisions and their reasons

- **GitHub Pages, built by `withastro/action`.** The action already knows how to build an Astro
  site, so the workflow carries no build steps of its own to keep in step with `package.json`.
- **`main` is the deploy trigger.** There is no staging environment and no release branch; the
  branch is the site.
- **Purge everything rather than purge by URL.** A build changes hashed asset names, the pages
  that link them, and the sitemap; enumerating what moved is more fragile than dropping the lot.
- **The purge is its own job, needing `deploy`.** Purging before the new build is live would just
  cache the old one again.
- **The site ships `noindex` until launch.** A half-built site indexed early is worse than one
  indexed late, and the site's whole point is being found.

## What this removed

Nothing — this was the first deployment path the repository had.

## Notes for whoever runs this next

- `BASE_URL` is the sole source of `site` in `astro.config.mjs`, and therefore of every canonical
  and hreflang URL. `npm run dev` leaves it unset on purpose, so those URLs fall back to the dev
  origin.
- The `noindex` metatag is still in `src/layouts/Layout.astro` behind a `@todo`. Removing it is
  the last step before the site goes live.
