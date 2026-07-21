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

GitHub repo: `https://github.com/shaino0807/dino-consulting-funnel`

Vercel production: `https://dino-consulting-funnel.vercel.app`

GitHub Pages: `https://shaino0807.github.io/dino-consulting-funnel/` (static redirect entry to Vercel; it does not host the API or admin backend)

Obsidian vault: `G:\我的雲端硬碟\oB`

Obsidian project cockpit path: `互動式網頁工程師Agent/專案工作流程.md`

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
- `src/components/dino/DinoLandingPage.tsx`
- `src/data/dino-site.ts`
- `src/lib/analytics-store.ts`
- `src/lib/admin-auth.ts`
- `.github/workflows/deploy-pages.yml`
- `scripts/restore-skills.ps1`
