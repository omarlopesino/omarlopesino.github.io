# Tag and category pages that show the right posts

*2026-08-26 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The term pages were the weakest on the site and three separate things were wrong. The layout read
`term.data.title`, a field the schema does not have — the heading rendered empty. It never filtered
by the term at all, so every tag page showed every post in the language. And the English tag route
passed `type="category"`, so it emitted category hreflang URLs while looking correct on screen.

## What this changed

- `ac07220`, `1fb0617` — `toPostInterface(post)` and `getTermPosts(type, term)` in
  `src/lib/blog.ts`; `BlogLayout` repointed at the shared mapping.
- `f50a880` — `ImageText`, an image-and-text block.
- `ec8ce29` — `src/components/ui/TermHero.astro` and its story.
- `3dfa300` — `TermPostsLayout` rebuilt on `TermHero` + `GridList`.
- `620a6ff` — the English tag pages marked as tags.
- `f194eb3` — `tag.postsTitle`, `category.postsTitle` and `term.empty` in both languages.
- `2c4af4e` — `AGENTS.md` gains the rule that every `src/components/ui/` component ships its
  `*.stories.ts` in the same commit.

## Decisions and their reasons

- **Filter on `term.cid` directly, without appending the language.** A post's `category` and `tags`
  frontmatter holds bare `cid`s, not composite entry ids. The language is filtered separately, off
  `data.language`. Getting this backwards is the recurring trap of the content model — and the
  `recommended` field, added the same day, needs the *opposite* handling.
- **The hero is the existing `Card` in `card-side`, not a new flex row.** The horizontal card was
  already in the codebase and already exercised by a story; widening it beat writing a second one.
  `Card`'s `title` became optional so the card body would not repeat the `<h1>` above it, and
  `figureClass` was modelled on the `actionClass` prop already there.
- **`TermHero` destructures explicit named props.** Spreading `{...Astro.props}` would leak `slug`,
  `cid` and `language` onto the DOM as attributes.
- **No new component for the list heading.** `GridList` already renders a centred `<h2>` from its
  `title` prop.
- **The mapping from a collection entry to `PostInterface` lives in one function.** Two layouts
  were each carrying their own copy of it.

## What this removed

- **`PostsListLayout` as the rendering path for term pages** — its `language`/`lang` prop mismatch
  and its plain `<h1>` did not fit. (This was reversed a day later, once that layout was rebuilt to
  own the empty state and pagination for every listing.)
- **The duplicated post-mapping blocks** in `BlogLayout` and `TermPostsLayout`.
- **The `type="category"` bug on English tag pages** — it silently emitted the wrong alternates.
