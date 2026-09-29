# 本機改版驗證與交接（2026-09-28）

## 範圍與狀態

承接「確認執行本機改版，並移除季度研討副標」。只有本機修改與驗證；沒有 Git push、部署、Figma 上傳、登入授權或正式資料庫寫入。既有 AGENTS.md、docs/agents/ 變更保留。

本機預覽：http://localhost:3010/ 。這不是客戶公開網址；開發服務停止後便無法使用。

## 已實作

- 暖白／深綠版面，首頁、方法、服務流程、方案、介紹、適合對象、影片、FAQ、申請表單及內容頁。
- 免費 CTA「申請免費健診」、首次 30 分鐘、3 個工作天內回覆；付費服務分開走 LINE 洽詢，不假裝線上付款。
- 課程 NT$3,800／6,800／9,800；一對一 NT$6,500／次、120 分鐘與 30 天內一次追蹤。宏觀課程只保留「12 小時線上課程」，季度研討副標與福利均移除。
- 三支使用者確認的 IG 影片使用各自 permalink；新增 /resources 篩選頁，未發布文章顯示「內容整理中」。影片使用文字設計封面，非影片縮圖。
- 主題初始空值；選問題 → 看產出 → 留需求；手機固定 CTA 與桌面主題確認列；手機卡片改垂直排列，不再需要橫向滑動提示。
- 表單驗證、同意、蜜罐、時間檢查、失敗保留內容、成功後日期／時段偏好；切換日期清空原時段。
- 台灣日期規則：平日 20:00–22:00、週六 10:00–20:00；週日可提出申請，但不能選作諮詢日。時段是偏好，仍需人工確認，未串即時空檔系統。
- 保留分析事件與管理後台資料格式；偏好聯絡方式存入既有 message 欄位，無資料庫 migration。

## 驗證證據

### 自動檢查

- TypeScript、ESLint、Next production build 通過。
- `node --test scripts/test-dino-booking.mjs`：6 組測試通過，涵蓋台灣跨日、週六、排除週日、非法日期、過去／太遠日期、時段不匹配。
- `git diff --check` 通過（只有 Windows CRLF 提示，沒有空白錯誤）。

### 瀏覽器（Codex in-app Chromium）

- 375、390、430、768、1024、1280、1440 px：頁面無水平溢位。這是尺寸／DOM 回歸，不代表七種實機全數視覺驗收。
- 手機 Hero CTA 可見時無固定 CTA；選退休主題後固定列顯示相同主題。
- 手機 dialog 內保留品牌；開啟焦點在關閉按鈕；Escape 關閉（上次也確認焦點回到開啟按鈕）。
- 空表單送出：四項錯誤顯示，第一個錯誤欄位取得焦點，穩定後欄位頂部約 425 px，固定導覽列底部 77 px，沒有遮住欄位。
- API 離線：顯示無法送出，當下保留資料與可重試按鈕，不顯示成功。
- 開發伺服器重啟觸發整頁重載，會清空表單；重新填寫後成功送出。沒有宣稱支援跨重新整理草稿保存。
- 2026-09-28 成功回執提供 9/29 起的日期，含 10/3 週六、不含 10/4 週日；週六日間切回週五時清空時段，僅提供晚間。
- 送出 10/2 20:00–22:00 偏好成功，回執明示非即時預約確認。
- FAQ 一次只展開一題；resources 退休篩選只顯示退休文章草稿。
- 價格畫面 3,800／6,800／9,800／6,500 正確，沒有季度研討。
- 首頁 DOM 標記檢查：未發現遺失的 aria-labelledby / aria-describedby 目標或缺少 alt 的圖片。搭配 accessibility-compliance-accessibility-audit Skill 修正標題層級、焦點與減少動態設定；不宣稱完整 WCAG 認證。

## 測試隔離與重新啟動

本機測試只使用虛構 QA 名稱與 example.com 信箱，資料存於被 Git 忽略的 `.data/local-redesign-qa`。

```powershell
$env:ANALYTICS_LOCAL_ONLY='1'
$env:ANALYTICS_DATA_DIR='.data/local-redesign-qa'
npm run dev -- --port 3010 --hostname 127.0.0.1
```

ANALYTICS_LOCAL_ONLY 僅在 NODE_ENV=development 生效；production 仍須正式 Supabase 設定，不允許以此開關繞過。

## 踩坑與後續注意

1. 中斷後預覽分頁可能還在，但 server 已停止；先檢查監聽再恢復，不將舊畫面當即時證據。
2. `.env.local` 可能含正式 DB 設定，dev 模式本身不代表測試隔離；須明確啟用本機儲存。
3. CSS smooth scroll 尚在動畫時，立即取座標／截圖可能是假性的遮擋；等待畫面穩定再驗證。已補 Next 的 data-scroll-behavior 宣告及 reduced-motion 規則。
4. 選擇日期後必須清掉不相容時段；只驗前端不夠，伺服器也驗證日期／時段。
5. Next 內頁返回首頁應使用 Link；最初 lint 提示已修正。
6. 表單成功後原標題節點消失，外層不可繼續依賴該 ID 命名；已改穩定 aria-label。
7. Native Node 測試 TypeScript 會出現 MODULE_TYPELESS_PACKAGE_JSON 效能提示，但測試通過；不為了消掉提示更動整個專案 module 類型。
8. 全頁／大 viewport 截圖偶爾有黑色區域或過渡畫面；以穩定後的 tab screenshot 與 DOM 交叉檢查。

未在本次驗證：Safari／Firefox／實機螢幕閱讀器、完整 axe／對比掃描、真實 LINE App 開啟、正式 Supabase、正式網站部署與分析後台回歸。付款、開課、取消／退款細節仍須服務方確認。Figma seat、GitHub 權限未在本機改版範圍內變更。
