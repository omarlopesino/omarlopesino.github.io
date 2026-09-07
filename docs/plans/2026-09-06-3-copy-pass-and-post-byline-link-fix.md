# A copy pass, and the post byline's About-me link fixed

*2026-09-06 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

A post's byline linked its author name with `authorLink = { href: localizedUrl(), text:
t('nav.about') }` — `localizedUrl()` with no argument points at the home page, not the about-me page,
which is where the label "About me" implies it goes. This has been stale since
[about-me split back out of the home page](2026-08-31-1-about-me-splits-from-the-home-page.md).
Separately, a handful of UI strings no longer matched what they described: `archive.title` still read
"Years" and `archive.description` "The blog by year..." even though the route, nav label and page
heading all say "Archive".

## What this changed

- `src/components/ui/Post.astro` — `authorLink.href` changed from `localizedUrl()` to
  `localizedUrl(t('about.path'))`.
- `src/i18n/ui.ts`, both `en` and `es` — `archive.title` ("Years"/"Años" → "Archive"/"Archivo") and
  `archive.description` reworded to match; `home.subscribeText` reworded; `post.authorBio` now uses
  the full name "Omar Mohamad El Hassan Lopesino" instead of "Omar Lopesino".

## Decisions and their reasons

Neither commit records a reason beyond its subject line (`Improve texts`, `Link about me link to
about me page`); the `archive.title` change is inferred here from the mismatch it fixes, not from a
stated reason.

## What this removed

Nothing; the byline's link target and the reworded strings both replace prior values rather than
removing a capability.
