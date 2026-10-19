---
name: post-outline
description: Draft and refine the outline of a new blog post in English and Spanish — frontmatter, taxonomy terms, and a body of headings with a fill-in summary and short bullets. Use when the user gives an idea for an article and wants a template to write it from ("empieza un artículo", "hazme la plantilla de un post", "prepara la estructura de un artículo").
---

# Post outline

The user writes every post themselves. This skill only builds the scaffold they write into, and
refines it with them until they are happy with it. Never write the article's prose.

## 1. Gather

From the user's message, take:

- **The idea**: what the post should explain and the angle (practical, opinion, tutorial…).
- **What it must contain**: topics, examples, or sections they named.
- **Category and tags** they asked for.
- **Sources**, if any: files, docs, URLs, or a past Claude Code session id. A session transcript
  lives at `~/.claude/projects/*/<session-id>.jsonl`; extract only the user/assistant text parts.
  Also look at related material in that project (docs, API collections) when the user points at it.

Ask only when the idea itself is unclear. Missing details (slug, title, description) are yours to
propose.

## 2. Taxonomy

Read `src/data/categories/<lang>/` and `src/data/tags/<lang>/` first and reuse existing terms. For
each missing one, create the `en` and `es` JSON files sharing a `cid` (kebab-case, English), with a
translated `name`, `description` and `slug` (the Spanish slug is Spanish and unaccented). A category
needs an `image`; point it at `/960x540/<cid>.avif` with `alt: "TODO"`. Tags have no image. If the
user gives what an acronym means, put the full name in the tag's description.

## 3. The post files

Create `src/blog/en/<cid>.mdx` and `src/blog/es/<cid>.mdx` with the schema in
`src/content.config.ts`:

- `cid`, `language`, `category` and `tags` as bare cids, `recommended: []`.
- `draft: true`: an outline must never ship. The user removes it once the post is written.
- `slug` translated per language; `title` and `description` written in each language (a
  description is one or two sentences saying what the reader gets).
- `pubDate` today, `author: "Omar Lopesino"`.
- `image.src: "/960x540/<cid>.avif"`, `image.alt: "TODO"`.

Keep the frontmatter in sync with the body: if a refinement drops what the title or description
promised, rewrite them too.

## 4. The body — structure only

Nothing but headings, each followed by a summary and bullets:

```mdx
## <Heading>

<Summary: what the user should write here, 10–15 words.>

- <bullet, at most 5 words>
- <at most 5 bullets>
```

- **At most 6 headings** (`##`). No intro paragraph, no conclusion unless asked, no prose.
- **Summary**: an instruction to the author ("Explica…", "Explain…"), 10–15 words. Count them.
- **Bullets**: at most 5 words each, at most 5 per heading. Count them.
- Order headings as a reader needs them: what it is → why it matters → how it works → how to
  apply it → real uses. Put generic advice where the user asks; by default it ends the post.
- Bullets in one heading must not repeat another heading's bullets.
- Spanish wraps English terms that are not code in `<span lang="en">…</span>`; inline code stays
  as backticks.
- Both languages carry the same structure, translated rather than literally mirrored.

## 5. Check and report

Run `npm run build`; it validates every entry against its schema. Report the outline as a short
list of headings, the files created, and what is pending (cover and category images, `alt` texts,
anything the sources did not cover). Do not commit.

## 6. Refine

Iterate with the user until they say the template is right. Each change request usually means
one of: add, remove, merge or reorder headings; move a heading's content into another as a bullet;
make a heading generic instead of tied to an example. Apply it to **both** languages, keep the
limits above (making room by moving or dropping a bullet, and saying which), rebuild, and report
the new order in a few lines.
