export type MainLink = {
  title: string;
  description: string;
  url: string;
  icon: string;
  isPrimary?: boolean;
};

export type SocialLink = {
  label: string;
  url: string;
  icon: string;
};

export const links: MainLink[] = [
  {
    title: "免費領取財務體質檢查表",
    description: "用 5 分鐘看懂你的儲蓄率、現金水位與理財盲點。",
    url: "https://example.com",
    icon: "Gift",
    isPrimary: true
  },
  {
    title: "預約一對一諮詢",
    description: "一起整理你的收入、支出、ETF 配置與退休現金流。",
    url: "https://example.com",
    icon: "CalendarCheck"
  },
  {
    title: "觀看 10 分鐘 ETF 配置教學影片",
    description: "快速理解 ETF 重疊、配息壓力與資產配置風險。",
    url: "https://example.com",
    icon: "Youtube"
  },
  {
    title: "加入 LINE 官方帳號",
    description: "接收最新活動、工具更新與理財提醒。",
    url: "https://example.com",
    icon: "MessageCircle"
  },
  {
    title: "閱讀最新財經週報",
    description: "每週整理小資族看得懂、用得上的財務筆記。",
    url: "https://example.com",
    icon: "Newspaper"
  },
  {
    title: "查看完整服務方案",
    description: "了解財務健檢、ETF 分析與一對一陪跑服務。",
    url: "https://example.com",
    icon: "BriefcaseBusiness"
  }
];

export const socialLinks: SocialLink[] = [
  { label: "Instagram", url: "https://example.com", icon: "Instagram" },
  { label: "Threads", url: "https://example.com", icon: "MessagesSquare" },
  { label: "YouTube", url: "https://example.com", icon: "Youtube" },
  { label: "LINE", url: "https://example.com", icon: "MessageCircle" },
  { label: "官方網站", url: "https://example.com", icon: "Globe2" },
  { label: "Email", url: "mailto:hello@example.com", icon: "Mail" }
];
