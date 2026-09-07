# The post byline's avatar is sized on `ProfilePicture` itself

*2026-09-07 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

`WebIntro.astro` (used by `Post.astro` for the author bio at the bottom of a post) wrapped
`ProfilePicture` in its own sizing `<div class="w-16 h-16 shrink-0">`, with only `rounded-full` passed
to `ProfilePicture` itself. `ProfilePicture` renders `<div class="avatar"><div
class:list={[className]}><Image ... /></div></div>`, and daisyUI's `.avatar > div` rule is what turns
that inner div into the actual clipped, `aspect-ratio: 1` box the image fills — sizing classes on an
outer wrapper never reach it. The avatar went missing on mobile as a result (the commit's subject
line is the only reasoning recorded; it doesn't say why the desktop width was unaffected).

## What this changed

- `src/components/ui/WebIntro.astro` — dropped the outer `<div class="w-16 h-16 shrink-0">` wrapper;
  `<ProfilePicture class="w-16 h-16 shrink-0 rounded-full" image={image} />` now carries the sizing
  classes directly, landing on `ProfilePicture`'s own inner `.avatar > div`.

## Decisions and their reasons

None recorded beyond the commit subject (`BUgfix - Article bottom profile picture not visible on
phone`).

## What this removed

Nothing; the sizing classes moved from a wrapper `<div>` onto `ProfilePicture` itself; no markup or
capability was dropped.
