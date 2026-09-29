// Commercial facts confirmed by Dino; do not infer extra offers or scarcity.
export const paidPlans = [
  { id: "bookkeeping", title: "個人財務盤點與系統化記帳實戰班", english: "Personal Financial Auditing & Smart Bookkeeping", price: 3800, duration: "6 小時線上課程＋實作模板", features: ["建立專屬記帳系統與收支儀表板", "找出「拿鐵因子」以外的隱形支出", "緊急預備金與財務安全網規劃", "30 天記帳習慣養成計畫"] },
  { id: "allocation", title: "資產配置與風險控管全攻略", english: "Asset Allocation & Risk Control", price: 6800, duration: "10 小時線上課程＋案例分析", features: ["股債配置與再平衡實戰策略", "依人生階段打造配置藍圖", "風險承受度評測與部位控管", "通膨與利率環境下的調整邏輯"] },
  { id: "macro", title: "總體經濟與宏觀理財思維課", english: "Macroeconomics & Wealth Architecture", price: 9800, duration: "12 小時線上課程", features: ["利率、通膨與景氣循環判讀", "央行政策與市場連動解析", "建立宏觀視角的決策框架"] },
  { id: "coaching", title: "一對一深度個人財務諮詢", english: "1-on-1 Personal Wealth Coaching", price: 6500, duration: "120 分鐘深度會談＋會後建議書", features: ["完整財務健檢與現況盤點", "量身訂製資產配置建議書", "120 分鐘一對一深度會談", "30 天內一次免費追蹤諮詢"] }
] as const;

export const featuredVideos = [
  { id: "DZhuGCzv9kk", title: "用台股 ETF，理解全球資產配置", category: "資產配置", description: "從市場涵蓋範圍與配置邏輯出發，認識不同 ETF 在投資組合中的角色。", href: "https://www.instagram.com/chendino080077/reel/DZhuGCzv9kk/", cover: "GLOBAL\nALLOCATION", date: "2026.06.13" },
  { id: "DVMBtrFj-4L", title: "2026 年 ETF：認識 009816", category: "ETF 觀念", description: "認識這檔 ETF 的設計思路。理解產品之前，先想想它是否符合自己的目標。", href: "https://www.instagram.com/chendino080077/reel/DVMBtrFj-4L/", cover: "UNDERSTAND\nYOUR ETF", date: "2026.02.25" },
  { id: "DTM3k-AD0te", title: "ETF 買得多，不一定真的分散", category: "風險整理", description: "持有不同代號，不代表持有不同風險。從成分股重疊，重新理解分散配置。", href: "https://www.instagram.com/chendino080077/reel/DTM3k-AD0te/", cover: "MORE ≠\nDIVERSIFIED", date: "2026.01.06" }
] as const;

export const topicOptions = ["現金流", "ETF / 投資配置", "資產整理", "退休規劃", "負債", "財務目標", "其他"];
export const methodSteps = [
  ["財務盤點", "收入、支出、資產、負債。把分散的資訊，放回同一張地圖。"],
  ["現金流", "先知道錢真正流去哪裡，再找到可以調整的空間。"],
  ["資產配置", "看清投資結構，而不是只看單一產品的報酬。"],
  ["風險", "確認集中度、資金需求與你能承受的波動。"],
  ["行動", "不一次做完所有事。找出現在最值得先處理的一步。"]
];
export const faqCategories = ["全部", "服務內容", "費用", "投資問題", "預約流程"];
export const faqs = [
  { id: "difference", category: "服務內容", question: "財務健診跟一般投資諮詢有什麼不同？", answer: "我們不會只從「要買什麼」開始，而是先看現金流、資產、負債與財務目標，找出現在真正值得優先處理的問題。" },
  { id: "free", category: "費用", question: "首次健診免費嗎？之後一定要購買服務嗎？", answer: "首次 30 分鐘財務健診免費，目的是釐清問題與下一步，不需要購買後續服務。若有深入整理的需求，可以另行了解付費課程或一對一諮詢；兩者分開申請。" },
  { id: "paid", category: "費用", question: "付費一對一諮詢包含什麼？", answer: "每次 NT$6,500，包含 120 分鐘深度會談、現況盤點、資產配置建議書，以及 30 天內一次免費追蹤諮詢。先確認需求與安排，再決定是否預約付費服務。" },
  { id: "stock", category: "投資問題", question: "你會推薦股票、帶操作或提供明牌嗎？", answer: "不代操、不帶進出場、不提供明牌或保證收益。可以從教育與財務整理的角度，理解產品在配置中的角色，但不以給你買賣指令為目的。" },
  { id: "prepare", category: "服務內容", question: "資產不多也可以嗎？需要準備哪些資料？", answer: "可以。第一次不必準備完整報表，先知道大概收入、固定支出、投資與負債狀況，就能開始整理。請勿在表單提供帳戶密碼、金融憑證或身分證件。" },
  { id: "outcome", category: "服務內容", question: "30 分鐘能談到什麼程度？", answer: "先整理問題輪廓，找出 1–2 個優先項目與下一步。不是一次解決所有財務問題，也不承諾提升報酬率。" },
  { id: "time", category: "預約流程", question: "什麼時間可以諮詢？週日能預約嗎？", answer: "諮詢時間為台灣時間週一至週五 20:00–22:00、週六 10:00–20:00。週日可以送出申請，但不進行諮詢。送出後 3 個工作天內回覆，時段需由 Dino 確認才成立。" },
  { id: "privacy", category: "預約流程", question: "我的資料會如何使用？", answer: "表單會保存稱呼、聯絡方式、需求與同意紀錄，用於回覆與服務聯繫；網站也會記錄瀏覽與操作事件。請見下方「資料與服務說明」。如有資料查詢或刪除需求，可透過公開 Email 聯絡 Dino。" }
];
