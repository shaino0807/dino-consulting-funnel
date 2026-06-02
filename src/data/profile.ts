export type ProfileStat = {
  value: string;
  label: string;
};

export const profile = {
  brandName: "亨尼財商輕聊",
  tagline: "幫小資族把看不懂的投資理財，變成聽得懂、做得到的現金流計畫。",
  description:
    "這裡專門陪你拆解 ETF、存股、退休現金流與投資焦慮，讓理財不再只是看報酬率，而是看懂自己的生活選擇。",
  avatarUrl: "/avatar-placeholder.png",
  primaryCTA: {
    label: "免費領取財務體質檢查表",
    url: "https://example.com"
  },
  secondaryCTA: {
    label: "預約一對一諮詢",
    url: "https://example.com"
  },
  aboutText:
    "我相信理財不是追求最高報酬，而是讓每一筆錢都能服務你的生活目標。透過 ETF 配置、現金流規劃、退休缺口試算與風險檢查，我協助小資族建立看得懂、持續得下去的財務系統。",
  stats: [
    { value: "100+", label: "位個案諮詢經驗" },
    { value: "ETF", label: "專注 ETF 與現金流配置" },
    { value: "1:1", label: "協助建立個人化退休規劃" }
  ] satisfies ProfileStat[],
  disclaimer:
    "本頁內容僅供教育與資訊參考，不構成投資建議。投資前請自行評估風險。"
};
