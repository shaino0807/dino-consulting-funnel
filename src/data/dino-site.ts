import {
  AlertTriangle,
  ArrowUpRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  Compass,
  GraduationCap,
  HeartHandshake,
  Instagram,
  LineChart,
  MessageCircle,
  PieChart,
  Play,
  ShieldCheck,
  Sprout,
  Target,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type DinoService = {
  title: string;
  description: string;
  tag: string;
  icon: LucideIcon;
};

export type CourseCategory = "all" | "beginner" | "etf" | "retirement" | "risk";

export type CourseResource = {
  title: string;
  description: string;
  category: Exclude<CourseCategory, "all">;
  badge: string;
  topics: string[];
  icon: LucideIcon;
};

export type ConsultationScenario = {
  title: string;
  description: string;
  tag: string;
};

export type IgPost = {
  title: string;
  label: string;
  href: string;
  colors: string;
};

export const dinoProfile = {
  name: "Dino080077-Do理in財",
  handle: "chendino080077",
  eyebrow: "小資族財務健診",
  positioning: "專注協助小資族配置財務規劃、股票、ETF 與金融知識的財務顧問",
  background: "半導體工程師背景，副業擔任接地氣的財務顧問，累積 12 年實務經驗。",
  heroTitle: "買了 ETF，卻說不清楚自己在投資什麼？",
  headline: "幫小資族把看不懂的投資理財，變成聽得懂、做得到的現金流計畫。",
  intro:
    "這裡專門陪你拆解 ETF、存股、退休現金流與投資焦慮，讓理財不再只是看報酬率，而是看懂自己的生活選擇。",
  promise: "先免費整理 30 分鐘，帶走財務卡點與下一步；通話不會要求購買商品。",
  instagramUrl: "https://www.instagram.com/chendino080077/",
  avatarUrl: "/dino-profile.jpg",
  primaryCta: "私訊「健診」預約",
  secondaryCta: "看 IG 觀點內容"
};

export const navItems: NavItem[] = [
  { label: "服務", href: "#services" },
  { label: "理念", href: "#philosophy" },
  { label: "資源", href: "#resources" },
  { label: "情境", href: "#feedback" },
  { label: "IG", href: "#instagram" }
];

export const heroStats = [
  { label: "財務實務經驗", value: "12 年", icon: BriefcaseBusiness },
  { label: "累積授課學員", value: "50+", icon: GraduationCap },
  { label: "免費財務健診", value: "30 分", icon: CalendarCheck }
];

export const credibilityProofs = [
  "讀想時光小聚講師",
  "超過 50 名學員授課紀錄",
  "外部與斜槓公司金融講座講師",
  "具 IG 經營與券商合作經驗"
];

export const serviceBoundaries = [
  "不提供代操",
  "不提供報明牌",
  "沒有投資群組",
  "不保證短期獲利",
  "僅銷售服務型商品"
];

export const consultationOutputs = [
  {
    number: "01",
    title: "一張財務卡點整理",
    description: "把目前最困擾你的現金流、投資配置與目標放在同一張地圖上。"
  },
  {
    number: "02",
    title: "1–2 個優先處理項目",
    description: "先找出現在最值得處理的問題，避免同時追著太多理財目標跑。"
  },
  {
    number: "03",
    title: "目前適合的規劃方向",
    description: "一起判斷你現在較適合 ETF、存股、退休規劃，還是先整理現金流。"
  }
];

export const serviceProblemTypes = [
  "ETF 分散配置",
  "存股配置",
  "退休現金流",
  "每月存不下錢",
  "投資焦慮",
  "個股問題解答",
  "總體經濟原理解答"
];

export const dinoServices: DinoService[] = [
  {
    title: "免費 30 分鐘健診",
    description:
      "整理目前財務卡點，找出 1–2 個優先項目，再判斷現階段適合的規劃方向。",
    tag: "本週接案限定 10 名",
    icon: CalendarCheck
  },
  {
    title: "一對一財務諮詢",
    description:
      "從收入、支出、資產和目標開始，建立屬於你的財務地圖，不只是複製別人的配置。",
    tag: "預約制",
    icon: Compass
  },
  {
    title: "ETF 與存股配置",
    description:
      "拆解持股重疊、波動承受度和投入節奏，讓每一筆錢知道自己正在做什麼。",
    tag: "策略整理",
    icon: PieChart
  },
  {
    title: "IG 觀點影片",
    description:
      "持續用短內容拆解投資觀念，讓你先建立判斷力，再決定要不要諮詢。",
    tag: "觀點持續整理",
    icon: Play
  }
];

export const philosophyPoints = [
  {
    title: "邏輯優先，不盲從主流",
    description:
      "熱門標的不是答案，適合你的現金流、年齡、風險和生活節奏才是判斷起點。",
    icon: Target
  },
  {
    title: "你的狀況不同，配置也不同",
    description:
      "同樣是 ETF，有人需要穩定累積，有人需要先補緊急預備金。諮詢會先看你自己的條件。",
    icon: WalletCards
  },
  {
    title: "先說清楚，再談行動",
    description:
      "你不需要先懂所有專有名詞。先把問題講清楚，才知道下一步該做什麼。",
    icon: MessageCircle
  }
];

export const courseCategories: Array<{ id: CourseCategory; label: string }> = [
  { id: "all", label: "全部" },
  { id: "beginner", label: "入門" },
  { id: "etf", label: "ETF 策略" },
  { id: "retirement", label: "退休規劃" },
  { id: "risk", label: "危機應對" }
];

export const courseResources: CourseResource[] = [
  {
    title: "ETF 不是買越多越分散",
    description:
      "從持股重疊、產業集中和費用率開始，看懂你手上的 ETF 到底有沒有幫你分散。",
    category: "etf",
    badge: "觀點型",
    topics: ["重疊持股檢查", "核心與衛星配置", "定期投入節奏"],
    icon: LineChart
  },
  {
    title: "退休現金流缺口整理",
    description:
      "把退休生活費、保守報酬和投入年限排成表，知道現在每個月該準備多少。",
    category: "retirement",
    badge: "最多人問",
    topics: ["退休支出估算", "本金需求回推", "年齡層配置方向"],
    icon: BookOpenCheck
  },
  {
    title: "小資族第一張財務地圖",
    description:
      "先整理緊急預備金、固定支出、保險和投資比例，避免一開始就被商品牽著走。",
    category: "beginner",
    badge: "入門推薦",
    topics: ["每月現金流", "資產負債表", "投入順序"],
    icon: Sprout
  },
  {
    title: "市場大跌時的決策清單",
    description:
      "先確認資金水位，再決定停看盤、再平衡或分批加碼，避免情緒直接接管帳戶。",
    category: "risk",
    badge: "實戰工具",
    topics: ["緊急預備金", "波動承受度", "加碼規則"],
    icon: AlertTriangle
  }
];

export const consultationScenarios: ConsultationScenario[] = [
  {
    title: "ETF 買了很多，卻不知道是否真的分散",
    description:
      "一起檢查持股重疊、產業集中與投入節奏，找出配置中真正需要調整的位置。",
    tag: "ETF 分散配置"
  },
  {
    title: "收入不低，但每個月總是存不下錢",
    description:
      "從固定支出、現金流缺口與投入順序開始，先讓每一筆錢有清楚的任務。",
    tag: "現金流整理"
  },
  {
    title: "擔心退休準備不足，也害怕現在選錯標的",
    description:
      "把退休目標、可投入金額與風險承受度放在一起，建立看得懂的準備方向。",
    tag: "退休與投資焦慮"
  }
];

export const igPosts: IgPost[] = [
  {
    title: "買越多 ETF，真的越分散嗎？",
    label: "Reels",
    href: dinoProfile.instagramUrl,
    colors: "from-[#04342c] via-[#0f5a48] to-[#d6b086]"
  },
  {
    title: "長期存股和 ETF 配置差在哪裡？",
    label: "觀點",
    href: dinoProfile.instagramUrl,
    colors: "from-[#6b3f24] via-[#8a6746] to-[#f1e3d2]"
  },
  {
    title: "退休現金流缺口怎麼算？",
    label: "教學",
    href: dinoProfile.instagramUrl,
    colors: "from-[#0f3f34] via-[#1d6d58] to-[#9fe1cb]"
  },
  {
    title: "市場下跌時，先做這三件事",
    label: "SOP",
    href: dinoProfile.instagramUrl,
    colors: "from-[#241812] via-[#6b3f24] to-[#d9b88e]"
  }
];

export const footerLinks = [
  { label: "Instagram", href: dinoProfile.instagramUrl, icon: Instagram },
  { label: "服務", href: "#services", icon: ClipboardList },
  { label: "資源", href: "#resources", icon: ArrowUpRight },
  { label: "預約", href: "#cta", icon: HeartHandshake },
  { label: "風險說明", href: "#footer", icon: ShieldCheck }
];
