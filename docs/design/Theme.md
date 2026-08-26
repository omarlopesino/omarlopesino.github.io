# Theme

The design vocabulary every page is built from. It lives in `src/styles/global.css` as two DaisyUI
themes plus a small set of Tailwind display sizes. Components should reach for these tokens and
never for a literal colour — a `text-purple-500` in a component is a bug, not a style.

## Themes

Two themes, `light` (default) and `dark`, selected by `data-theme` on `<html>`. The attribute is
the only switch: `Layout.astro` writes it from `localStorage.theme` before paint, and the
`dark:` variant in `global.css` matches on it. `prefersdark` is deliberately off on both — letting
`prefers-color-scheme` also decide would give the page two disagreeing sources of truth.

Colours are authored in `oklch` so light and dark can share a hue and differ only in lightness,
which keeps the two themes recognisably the same design.

## Colour roles

| Role | What it is for |
| --- | --- |
| `base-100` | The page. Cards and article surfaces sit on it. |
| `base-200` | Recessed surfaces: code blocks, spec rails, aside panels. |
| `base-300` | Hairlines. Borders, rules, dividers, table cell edges. |
| `base-content` | Body text, headings, icons. |
| `primary` | Violet. Links, the active nav item, the primary action. One per screen. |
| `secondary` | Steel blue. Supporting actions and non-primary emphasis. |
| `accent` | Amber. Highlights that must not read as clickable: tag chips, blockquote rules. |
| `neutral` | Solid dark chrome that stays dark in both themes. |
| `info` / `success` / `warning` / `error` | State only. Never decoration. |

Every colour has a `-content` pair; use it for anything drawn on top of that colour so contrast
survives the theme switch.

Hues: violet `285`, steel `220`, amber `65`–`70`. The bases carry a trace of the violet hue (chroma
0.002–0.016) so neutrals feel related to the primary rather than plain grey.

## Shape

`--radius-box` `0.75rem` for cards, images and panels. `--radius-field` `0.375rem` for inputs and
inline chips. `--radius-selector` is fully round, for badges and toggles. `--border` is `1px`
everywhere; `--depth` and `--noise` are off, so separation comes from a hairline and a change of
base surface, not from a gradient or a heavy shadow.

## Type

Geist Variable throughout. Tailwind's own scale is untouched; these sit above it:

| Utility | Use |
| --- | --- |
| `text-display` | 2.75rem/1.1, tight tracking. A post title. One per page. |
| `text-title` | 2rem/1.2. Section and term headings. |
| `text-lede` | 1.1875rem/1.65. A standfirst or term description — larger than body, still calm. |
| `text-meta` | 0.8125rem/1.45, slightly open tracking. Dates, bylines, rails, counts. |

## Prose

`.prose` maps the typography plugin's variables onto the theme tokens, so an article follows
`data-theme` with no `prose-invert` and no second palette. Its measure is capped at `68ch`. Code
sits on `base-200` inside a `base-300` hairline; blockquotes take their rule from `accent`.
