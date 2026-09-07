---
description: Draft a docs/plans entry from a range of commits
---

Write a new entry in `docs/plans/` for the work in `$ARGUMENTS`, a git range such as
`abc1234..def5678`. With no argument, use everything since the last commit already covered by the
newest entry in `docs/plans/`.

Read `docs/plans/README.md` first — its contract and its "How to add an entry" steps govern this,
and this command is only the mechanical part of them.

## Scope

This log records decisions about the codebase, never the content published through it. A commit
that only adds, edits, or removes a blog post, its prose, or a category/tag data file (anything
under `src/blog/`, `src/data/categories/`, `src/data/tags/`, or similar content-collection entries)
is content authoring, not a decision — leave it out entirely, with no entry and no README row, no
matter how many such commits are in range.

If a range mixes content CRUD with a real code change (a schema field, a component, a layout, an
i18n key used by the UI chrome), write the entry for the code change only. Don't narrate which posts
or terms prompted it beyond what's needed to state the change's reason; the content itself stays out
of "What this changed".

If an entire range turns out to be content-only, produce no entry and say so — do not stretch a
content change into a code decision to justify writing one.

## Gather

```bash
git log --reverse --pretty='=== %h %ad %s%n%b' --date=short <range>
git log --reverse --name-status --pretty='=== %h %s' <range>
```

The commit bodies are the reasoning. The tree is the fact.

## Verify before writing

- Grep every symbol, file, route, env var and i18n key the commits introduced. Anything no longer
  in the tree goes in a removal section, never in a description of the present.
- Grep each removal to confirm it is genuinely gone. A thing you list as removed but which is still
  alive is the single worst error this log can contain — it invites the next session to delete it.
- Check whether a later commit in the range reversed an earlier one. Only the last state is real.

## Write

Copy `TEMPLATE.md` to `docs/plans/YYYY-MM-DD-N-<what-was-done>.md`:

- The date is the **first** commit of the range.
- `N` orders entries sharing that date; look at the directory to pick it.
- Past tense throughout, about that date. The removal section is "what this removed" — a fact of
  the day — never "not in the app", which is a claim about now and goes stale.
- 40–70 lines, hard cap 90. Summarise hard: drop the narration, keep the decisions and their
  reasons. A decision without its reason is the next person's regression.
- Link only to entries dated no later than this one. Never write "superseded by".
- If a commit gives no reason, say the commit records none. Do not invent one.
- If the work in the range was later undone, keep the reasons, cut the detail to a couple of lines,
  and add a short "what outlived it" section.

## Then

- Append one row to the table in `docs/plans/README.md`, newest first.
- Only if this entry reverses a decision in "Settled decisions — do not undo", update that one
  line. Open no older entry.
- Removals live in this entry's "What this removed" section; `AGENTS.md`'s **Do not reintroduce**
  section points here rather than listing them, so it needs no edit.

Report the path written and the index row added. Do not commit.
