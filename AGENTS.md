# 互動式網頁工程師Agent Agent Rules

## Project Boundary

Primary project folder:

`	ext
C:\Users\shaino\Documents\互動式網頁工程師Agent
`


## Project-local Skill Portability

project-skills/ is the portable source of truth for project-local skills.

Do not delete, overwrite, or regenerate an existing SKILL.md without first reporting:

- the existing path
- what would change
- whether the change is required

When restoring this project on a new machine, run:

`powershell
.\scripts\restore-skills.ps1
`

The restore script copies missing project skills into:

`	ext
C:\Users\<user>\.codex\skills
`

Existing global skills are not overwritten.

If project initialization is requested later:

- first report existing/missing files
- only add missing items
- do not overwrite AGENTS.md, README.md, .gitignore, project-skills/, generated-skills/, .codex/skills/, or .agents/skills/
- preserve existing project rules and only make small additive improvements

## Project Init Sync Status

Project name: 互動式網頁工程師Agent

Purpose: Interactive web engineer / link-in-bio style Next.js project.

Primary work folder:

```text
C:\Users\shaino\Documents\互動式網頁工程師Agent
```

Default branch: `main`

GitHub repo: pending confirmation. GitHub CLI currently needs re-authentication before repo creation, push, or GitHub Pages setup.

Obsidian vault: pending confirmation.

Obsidian project cockpit path: pending confirmation. It must be a vault-relative path, not a path inside this work folder unless this work folder is explicitly the vault.

Firebase MCP: not used by default.

## Work Mode

- 開工: read this `AGENTS.md`, check Git status, then inspect the current task context before editing.
- 收工: summarize the work, update the Obsidian cockpit when configured, check Git status, and commit meaningful local work when appropriate.
- project-init-sync: inspect first, report existing and missing files, then only add missing project-mode assets.

## Main Files

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/data/profile.ts`
- `src/data/links.ts`
- `src/data/services.ts`
- `scripts/restore-skills.ps1`
