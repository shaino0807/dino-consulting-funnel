# 擴充動態版：本機驗收紀錄

日期：2026-09-29（台灣時間）

## 授權與邊界

- 接續「確認執行擴充動態版，限本機」。沒有推送、commit、部署、Figma 上傳或正式資料庫操作。
- 保留既有奶油白／深綠視覺、文案、價格、文章、影片連結、區塊順序及業務規則。
- 沿用 Framer Motion，沒有安裝新套件。動畫 Skill 用於節奏與錯開進場；無障礙 Skill 用於暫停、鍵盤、焦點、隱藏內容與減少動態檢查。
- 開工時已有未提交修改；未覆寫 AGENTS.md 或 docs/agents/。

## 已完成

- Hero 逐行遮罩進場、CTA 錯開進場、低密度粒子、卡片浮動與桌機輕量游標傾斜。
- 沿用既有專業領域文字的 48 秒循環跑馬燈。可暫停，hover／鍵盤焦點時暫停；重複副本對輔助技術隱藏。
- 閱讀進度條、統一 hover／active／focus 回饋、卡片柔和陰影。
- FAQ 高度收合、FAQ／資源分類淡入淡出、手機選單進出場、固定 CTA 進出場。
- 申請成功接日期／時段、時段回執的過渡。離場元件使用 inert，避免淡出期間誤觸。
- 連續背景動態在離開視窗、背景分頁、手動暫停或 reduced-motion 時停止。粒子暫停後保留時間位置，恢復時不重置。

## 實際驗證結果

| 檢查 | 結果 |
| --- | --- |
| npm run typecheck | 通過 |
| npm run lint | 通過 |
| npm run build | 通過；首頁與 /resources 正常產出 |
| booking 測試 | 6 項通過 |
| 動態改版內容凍結測試 | 3 項通過 |
| 320 / 390 / 768 / 1440px 寬度 | 沒有 document 水平溢出 |
| 桌機暫停按鈕 | aria-pressed 更新；Hero 浮動與跑馬燈均 paused |
| Hero 離開可視區 | data-ambient-active=false |
| FAQ 分類 | 費用分類完成轉場後只有 2 題 |
| FAQ 高度／焦點隔離 | 關閉時 height=0、inert；展開後 opacity=1、高度大於 0 |
| 手機選單 | 品牌可見、body 滾動鎖定、Escape 關閉、焦點歸還開啟按鈕 |
| 手機選單 FAQ 錨點 | 關閉後 FAQ 抵達導覽列下方 |
| 固定 CTA | Hero CTA 在畫面內時不出現；離開後出現；表單出現時隱藏 |
| 空表單提交 | 4 項錯誤顯示，第一個欄位取得焦點且未被導覽列遮住 |
| 申請成功 | 已收到畫面出現並聚焦；修正後標題 top 約 120px，導覽列 bottom=69px |
| 日期／時段 | 工作日 20:00–22:00 選項正確；本機提交取得時段回執 |
| 資源頁 | ETF 策略篩選後只有相應資源，仍標示內容整理中 |
| 瀏覽器紀錄 | 此次驗收未取得 error / warn 紀錄 |

內容凍結以改動前的本機版本為準，不以較舊 Git HEAD 為準。`src/data/dino-site.ts`、`src/data/dino-content.ts`、`src/lib/booking.ts` 的 SHA-256 全部一致；測試位於 `scripts/test-dino-motion-content.mjs`。此測試是檔案內容保護，不是動畫效能測試。

## 本機隔離

使用上次啟動、且本次確認仍可用的開發服務：

```powershell
$env:ANALYTICS_LOCAL_ONLY='1'
$env:ANALYTICS_DATA_DIR='.data/local-motion-qa'
npm run dev -- --port 3010 --hostname 127.0.0.1
```

- 預覽：http://127.0.0.1:3010/
- 表單使用虛構姓名與 example.com 地址；本機 JSON 已確認有測試資料。
- 測試資料保留在 git 忽略的 `.data/local-motion-qa/`，沒有混入正式名單。
- 開發服務保留供使用者驗收；重開機或服務停止後須用上方隔離命令重啟。

## 本次修正的坑

1. 成功畫面只 focus 且 preventScroll，會讓手機使用者看不到成功標題。已在進場完成後加上 scrollIntoView 與既有 scroll-margin，實測位置正確。
2. 跑馬燈只有兩份內容時，寬視窗可能出現尾段空白。軌道至少為視窗兩倍，兩副本均分寬度；1440px 實測單份寬度等於視窗寬度。
3. 粒子暫停若重設時間，恢復會跳動。已改保存累積時間，並限制單幀時間差。
4. 動畫中的截圖或 DOM 讀值可能仍是 0 高度／舊分類；需等轉場完成再判定結果，不能把中間影格當成失敗或成功。
5. 上次開發服務仍在，重啟遇到 EADDRINUSE。已接回已知隔離的原服務，未終止不明程序。
6. 表單錯誤訊息在 label 內，會改變可存取名稱；錯誤狀態測試改用已知欄位 ID，避免過度精確的名稱匹配失敗。

## 驗證限制

- reduced-motion 分支已做程式／CSS 檢查；此瀏覽器工具未提供媒體偏好模擬，未宣稱完成 OS 設定切換驗證。
- 背景分頁停止有 visibilitychange 清理機制；本次實測的是離開可視區與暫停控制，未做背景分頁效能錄製。
- 未做 iOS Safari／Android 真機、低階裝置 FPS、Lighthouse 效能分數或完整 WCAG 認證。
- 桌機傾斜與 hover 已實作；工具沒有標準 hover／pointer-move 操作，這部分仍需使用者用滑鼠體感驗收。
- Node 測試仍有既有 MODULE_TYPELESS_PACKAGE_JSON 警告，不影響 6 項 booking 測試；未為消除警告而改變整個專案 module 設定。
- 新版只在本機，正式站尚未更新。

## 截圖

- `C:/Users/shaino/.codex/visualizations/2026/07/21/019f853a-8a9d-70a1-ba14-6be4faca7872/dino-motion-desktop.png`
- `C:/Users/shaino/.codex/visualizations/2026/07/21/019f853a-8a9d-70a1-ba14-6be4faca7872/dino-motion-mobile-success.png`
