# Dino080077-Do理in財 導流網站

這是一個給小資族與投資理財陌生客戶使用的個人宣傳導流網站。首頁用溫暖、專業、木質咖啡米色系設計，集中呈現服務項目、Instagram 入口、預約整理 CTA 與客戶需求表單。

## 主要功能

- 個人品牌首頁：`Dino080077-Do理in財`
- 宣傳文案與服務項目
- Framer Motion 互動動畫
- CTA 點擊追蹤
- 客戶需求表單
- 後臺數據頁：`/admin/analytics`
- 後端追蹤 API：`/api/analytics`

## 本機開發

```powershell
npm.cmd install
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

或使用專案腳本：

```powershell
.\scripts\start-dev-server.ps1
```

`start-dev-server.ps1` 適合開發與即時修改，但它仍是暫時程序。Codex session 關閉、Windows 登出或重新開機後，需要重新啟動。

## 長時間本機展示

要讓網站在背景持續運作，請使用 production watchdog：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File .\scripts\start-persistent-site.ps1
```

它會先執行 production build，再啟動 `next start`。如果 Next 程序意外退出，watchdog 會在五秒後重新啟動。

停止背景網站：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\stop-persistent-site.ps1
```

建立 Windows 登入後自動啟動捷徑：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\install-local-site-startup.ps1
```

執行紀錄位於：

```text
.logs/dino-local-site.log
```

本機網址：

```text
http://127.0.0.1:3000
```

後臺數據：

```text
http://127.0.0.1:3000/admin/analytics
```

## 驗證

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

## 修改內容

- 首頁 UI：`src/components/dino/DinoLandingPage.tsx`
- 品牌與服務資料：`src/data/dino-site.ts`
- 追蹤 API：`src/app/api/analytics/route.ts`
- 後臺頁：`src/app/admin/analytics/page.tsx`
- 事件儲存：`src/lib/analytics-store.ts`

## 後臺與資料

追蹤資料預設寫入：

```text
.data/analytics-events.jsonl
```

`.data/` 已被 `.gitignore` 忽略，避免客戶資料進入版本控制。

可用環境變數指定持久化路徑：

```text
ANALYTICS_DATA_DIR=D:\dino-analytics-data
```

正式部署時請設定後臺 key：

```text
ANALYTICS_ADMIN_KEY=your-private-key
```

設定後，後臺網址格式為：

```text
https://your-domain.example/admin/analytics?key=your-private-key
```

Production 環境若沒有設定 `ANALYTICS_ADMIN_KEY`，後臺不會顯示資料。

## 對外部署注意

這個專案需要 Next.js Node runtime，因為 `/api/analytics` 與 `/admin/analytics` 會在伺服器端處理資料。

若部署到有持久磁碟的主機，請設定 `ANALYTICS_DATA_DIR` 到可持久保存的資料夾。

若部署到 serverless 平台，檔案系統可能不保證持久保存。正式收集客戶名單前，應改接資料庫、表單服務或 webhook 儲存。

## 安全原則

- 不提交 `.env`
- 不提交 `.data/`
- 不提交 API key、token、密碼
- 不修改 Instagram、雲端硬碟或其他外部資料庫
- 表單資料只用於服務回覆與使用追蹤

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
