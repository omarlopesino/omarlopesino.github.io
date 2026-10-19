# Posts can be drafts, outlined by a skill, and every commit request logs itself

*2026-10-19 · this repo · a log entry, true as of its date — see [the index](README.md) for
what is current.*

## Why

Posts are written by hand, and starting one meant building its frontmatter, taxonomy terms and
section skeleton from scratch each time. Once a skeleton was committed there was no way to keep it
off the site: the `blog` schema had no draft state and Astro offers none for content collections,
so the next push to `main` would have deployed a post made of headings only.

## What this changed

- `src/content.config.ts`: an optional `draft` boolean on the `blog` schema.
- `src/lib/blog.ts`: `isPublished()`, true for every entry under `astro dev` and false for a
  draft in a production build. `staticPaths`, `getContentAlternates`, `getTermPosts`,
  `getRecommendedPosts`, `getLangPosts`, `getYears` and `getYearPosts` all filter through it.
- `.claude/skills/post-outline/SKILL.md`: a project skill that turns an idea into a bilingual
  outline — frontmatter, any missing category or tag, and up to six headings, each with a 10–15
  word summary of what to write and at most five bullets of at most five words — then refines it
  with the author. Every outline starts as `draft: true`.
- `AGENTS.md`: the draft field under **Content model**, and a rule under **Commit & Pull Request
  Guidelines** that every commit request ends with a `/log-entry` entry committed last.

## Decisions and their reasons

- **One predicate in `src/lib/blog.ts`, not a filter per page.** Every post query already lives
  there, so a draft has no page, listing, feed, `llms.txt` line or sitemap entry once built, and a
  new query cannot forget the rule by being written elsewhere.
- **Drafts still render under `astro dev`.** The point of committing one is to review it in place
  before it ships.
- **A draft keeps its source in the public repository.** The requirement was that the post not be
  reachable by URL on the site; its MDX on GitHub was accepted.
- **Terms whose only posts are drafts still get their (empty) pages and list entries.** A term with
  no published post was judged normal, so `termPaths` and the tag and category lists were left as
  they were.
- **The skill writes structure, never prose.** The author writes every post; the skill only builds
  the scaffold and keeps both languages and the frontmatter in step through each refinement.
- **The plans entry is written after the commits, not before.** It cites them, so they must exist;
  `/log-entry`'s scope still decides whether a commit request is due one.

## What this removed

Nothing. Holding back every push until a post was finished was rejected, because it would block
unrelated changes from deploying in the meantime.
