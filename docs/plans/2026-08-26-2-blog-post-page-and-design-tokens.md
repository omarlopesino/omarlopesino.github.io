# The post page as an editorial column, on a real palette

*2026-08-26 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

The post page was the last template still on placeholder theming: everything centred, the
description indistinguishable from the body, tags a bare badge row, and the category a dead
`<span>` hardcoded to `text-purple-500`. It also threw away data the content model already carried
— `recommended` was in the schema and never read, `render()` returned `headings` nothing consumed,
and there was no reading time or breadcrumb. Underneath, `src/styles/global.css` was eleven lines
leaning on DaisyUI's stock themes, so per-component colour hacks were the only way anything got a
colour.

## What this changed

- `1661833` — the design tokens: colour roles, a type scale, radius and border, plus `.prose`
  overrides bound to them, with `docs/design/Theme.md` in the same commit.
- `e6acf87` `getRecommendedPosts`, `e6f0709` `readingTime` in `src/lib/utils.ts`.
- `885cef2` — `PostLayout` takes the entry and calls `render()` itself, so it has `headings`.
- `ef97a4e` `Breadcrumb`, `4ab907e` `PostMeta`, `2bb36c8` `PostTags`, `e6d1d54` `Toc`,
  `207706d` `PostCategory` as a real link, `912c427` `Share` with an optional label.
- `11f079c` — `Post.astro` rebuilt as the editorial column.
- `7912894` … `2c010cc` — related posts, ending on the standard grid rather than a bespoke list.
- `983894f` — the author block gains a call to action.
- `3805dd2` — the sample posts given enough body to show a table of contents and a related strip.

## Decisions and their reasons

- **The tokens and `docs/design/Theme.md` are one commit.** They are a single decision, and
  splitting the stylesheet from the document explaining it leaves either half meaningless.
- **Direction A, the single editorial column.** Three directions were drawn: A a centred measure
  with no sidebar, B an article-plus-sticky-aside grid, C a cover paired with a full-width "spec
  rail" of labelled metadata cells. A was chosen for the reading rhythm and the least chrome,
  accepting that its metadata is split between the top and the bottom of the page.
- **`readingTime` is words divided by 200, computed on the body.** No new dependency, no remark
  plugin, for a number nobody checks to the minute.
- **`recommended` re-appends the language before `getEntry`.** It holds bare `cid`s, so this is the
  *inverse* of how a tag or category reference is matched — those compare bare. Both live in
  `src/lib/blog.ts`; neither is obvious from the call site.
- **`.prose` overrides are bound to the tokens.** Otherwise dark mode follows Tailwind's defaults
  instead of the theme.
- **The colour hacks are deleted by the commit that rewrites their own component,** not by the
  token commit — they belong to the components, and the token commit still has to build.

## What this removed

- **`text-purple-500` in `PostCategory` and `badge-accent dark:badge-secondary` in `Post`** — the
  two hardcoded colours the tokens replaced.
- **The dead `<span>` category** — it became a real link to the category's page.
- **Direction B (the sidebar) and direction C (the spec rail)**, with reasons that still hold: B
  costs measure width and looks thin on a short post; C front-loads everything and is heaviest
  above the fold. `notas.txt` had asked for B's aside, and it was not built.

## What outlived it

The token layer is the palette the whole site now inherits, and the four components built for the
column — `Breadcrumb`, `PostMeta`, `PostTags`, `Toc` — were deliberately made direction-neutral so
they would survive whichever was picked.
