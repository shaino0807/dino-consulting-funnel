# 亨尼財商輕聊｜小資現金流地圖

這是一個可部署到 Vercel 的個人品牌導流頁，適合放在 Instagram、Threads、Facebook、YouTube 等社群個人介紹連結中。

## 技術

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui 風格元件
- lucide-react

## 功能

- Hero 個人品牌區
- 服務項目卡片
- Link in Bio 大型 CTA 連結
- 專業介紹與信任指標
- 互動式「小資現金流地圖」前端 demo
- 社群 icon links
- SEO metadata 與 RWD

## 開發

```bash
npm install
npm run dev
```

## 驗證

```bash
npm run typecheck
npm run lint
npm run build
```

## 修改資料

- 個人品牌資料：`src/data/profile.ts`
- 主要連結按鈕：`src/data/links.ts`
- 服務項目：`src/data/services.ts`

所有外部連結目前都使用 `https://example.com` 或測試信箱，正式發布前請替換成你的實際網址。

## Portable project skills

Portable project-local skills live in:

```text
project-skills/
```

To restore skills on a new computer:

```powershell
.\scripts\restore-skills.ps1
```

The restore script copies missing skills into the user's global Codex skills folder and does not overwrite existing global skills.

## Project work mode

This project uses the #07 / `project-init-sync` work mode:

- Fixed project rules live in `AGENTS.md`.
- Portable project-local skills live in `project-skills/`.
- Missing project skills can be restored with `.\scripts\restore-skills.ps1`.
- Obsidian cockpit setup is pending a vault path and vault-relative note path.
- GitHub repo, push, and GitHub Pages setup are blocked until GitHub CLI is re-authenticated.
- Firebase MCP is skipped unless explicitly requested.

Local work folder:

```text
C:\Users\shaino\Documents\互動式網頁工程師Agent
```
