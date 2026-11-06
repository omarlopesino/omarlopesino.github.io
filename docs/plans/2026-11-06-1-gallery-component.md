# A photo gallery primitive for posts

*2026-11-06 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The site had no way to show several photos together. The only carousels were the card strips in
`ui/RecommendedPosts` and the home page's categories, and `ui/ImageText` shows a single image. A
post wanting a set of photos had nothing to reach for.

## What this changed

- `src/components/ui/Gallery.astro` (13fb2f3): a DaisyUI `carousel` with one `carousel-item`
  `<figure>` per image, ❮ ❯ arrows on each slide that wrap around at both ends, and numbered
  indicator links below. Props: `id`, `images` (the shared `Image` type plus an optional
  `caption`), `previousLabel`, `nextLabel`, and `class` / `imageClass` / `sizes` overrides.
- `src/components/ui/Gallery.stories.ts` (13fb2f3): `Default`, `WithCaptions` and `SingleImage`.
- No caller in the tree. A post uses it by importing it straight into its MDX.

## Decisions and their reasons

- **Anchor-driven carousel, no JavaScript.** It slides with no JavaScript, and swiping still
  scrolls it. This keeps to the settled rule that interactive UI is built without JavaScript.
- **`id` prefixes every slide's anchor**, so two galleries on one page don't collide.
- **Labels arrive as props.** They keep the component language-agnostic, since `ui/` components
  stay presentational and render standalone in Storybook.
- **Images go through `coverSrcSet()`**, like every other cover on the site, so a gallery serves
  the `@1x`/`@2x` pairs from `npm run image:variants`.
- **Images load lazily**, because a gallery usually sits mid-post rather than above the fold. The
  commit records no reason; this one comes from the session that wrote it.
- **A single image renders without arrows or indicators**, since there is nowhere to go.
- **Imported per post, not registered globally** in the MDX components map. The commit records no
  reason beyond the component being "meant to be imported straight into a post's MDX".

## What this removed

Nothing.
