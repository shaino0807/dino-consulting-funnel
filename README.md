# Dino080077-Do理in財 導流網站

這是一個給小資族與投資理財陌生客戶使用的個人宣傳導流網站。首頁用溫暖、專業、木質咖啡米色系設計，集中呈現服務項目、Instagram 入口、預約整理 CTA 與客戶需求表單。

## 正式網址

- 客戶填寫與正式服務：<https://dino-consulting-funnel.vercel.app>
- 管理後臺登入：<https://dino-consulting-funnel.vercel.app/admin/login>
- GitHub repo：<https://github.com/shaino0807/dino-consulting-funnel>
- GitHub Pages：<https://shaino0807.github.io/dino-consulting-funnel/>

GitHub Pages 只提供靜態公開入口，會轉往 Vercel 正式站。表單 API、Supabase 寫入及管理後臺需要 Next.js Node runtime，不能在 GitHub Pages 上執行。

## 主要功能

- 個人品牌首頁：`Dino080077-Do理in財`
- 宣傳文案與服務項目
- Framer Motion 互動動畫
- CTA 點擊追蹤
- 客戶需求表單
- 安全後臺登入：`/admin/login`
- 名單管理、狀態、備註與 CSV 匯出：`/admin/analytics`
- 後端追蹤 API：`/api/analytics`
- 正式資料庫：Supabase Postgres

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
- 後臺登入：`src/lib/admin-auth.ts`
- Supabase migration：`supabase/migrations/`

## 後臺與資料

本機開發且未設定 Supabase 時，追蹤資料寫入：

```text
.data/analytics-events.jsonl
```

`.data/` 已被 `.gitignore` 忽略，避免客戶資料進入版本控制。

正式環境強制使用 Supabase，缺少資料庫設定時不會把客戶名單寫入暫存磁碟。必要環境變數請參考 `.env.example`：

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-service-role-key
ADMIN_PASSWORD=strong-admin-password
ADMIN_SESSION_SECRET=at-least-32-random-characters
```

`SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_PASSWORD` 與 `ADMIN_SESSION_SECRET` 都只能存在伺服器端，不可使用 `NEXT_PUBLIC_` 前綴。

後臺登入網址：

```text
https://your-domain.example/admin/login
```

登入使用 HTTP-only、SameSite=Strict Cookie，八小時後自動失效。後臺功能包含：

- 全部諮詢名單
- 新名單／已聯絡／已預約／已完成／已結案狀態
- 內部備註
- 搜尋與狀態篩選
- CSV 匯出
- 瀏覽、點擊、送出與 UTM 來源

## Supabase 資料表

正式資料表由 migration 建立：

```text
supabase/migrations/202607180001_create_dino_leads.sql
```

`leads` 保存客戶主動填寫的聯絡資料；`analytics_events` 只保存事件與來源，不混入姓名、聯絡方式或留言。兩張表都啟用 Row Level Security，瀏覽器不可直接讀取，只有伺服器端 service role 能存取。

## 對外部署注意

這個專案需要 Next.js Node runtime，因為 `/api/analytics`、`/api/admin/*` 與 `/admin/analytics` 會在伺服器端處理資料。正式部署目標為 Vercel，客戶資料保存於 Supabase，不依賴 Vercel 暫存檔案系統。

部署後必須實際驗證：首頁 HTTP 200、表單成功送出、Supabase 出現測試名單、後臺未登入會被導向登入頁、登入後可查看／更新／匯出該名單。

## 安全原則

- 不提交 `.env`
- 不提交 `.data/`
- 不提交 API key、token、密碼
- 不把 service role key 放進 `NEXT_PUBLIC_*`
- 不把客戶個資寫入一般分析事件
- 後臺不使用網址 query key 傳遞密碼
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
- Obsidian cockpit: `G:\我的雲端硬碟\oB\互動式網頁工程師Agent\專案工作流程.md`.
- GitHub repo and Pages publish from `main` through `.github/workflows/deploy-pages.yml`.
- GitHub Pages is a static redirect entry; Vercel remains the customer-facing production runtime.
- Firebase MCP is skipped unless explicitly requested.

Local work folder:

```text
C:\Users\shaino\Documents\互動式網頁工程師Agent
```
