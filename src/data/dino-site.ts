import {
  BarChart3,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  Coffee,
  Instagram,
  LineChart,
  Mail,
  PiggyBank,
  ShieldCheck,
  Sprout,
  WalletCards
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DinoLink = {
  label: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  primary?: boolean;
};

export type DinoService = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const dinoProfile = {
  name: "Dino080077-Do理in財",
  handle: "chendino080077",
  headline: "幫小資族把看不懂的投資理財，變成聽得懂、做得到的現金流計畫。",
  intro:
    "這裡專門陪你拆解 ETF、存股、退休現金流與投資焦慮，讓理財不再只是看報酬率，而是看懂自己的生活選擇。",
  tone: "專業、溫暖、穩定陪伴",
  instagramUrl: "https://www.instagram.com/chendino080077/",
  avatarUrl: "/avatar-placeholder.png",
  email: "hello@example.com"
};

export const dinoLinks: DinoLink[] = [
  {
    label: "預約整理",
    title: "預約 20 分鐘現金流整理",
    description: "先看收入、支出、投資部位與焦慮來源，再決定下一步要不要深入規劃。",
    href: "#lead-form",
    icon: CalendarCheck,
    primary: true
  },
  {
    label: "Instagram",
    title: "看 Dino 的理財短內容",
    description: "用生活語言拆解 ETF、存股與現金流，適合剛開始整理財務的小資族。",
    href: dinoProfile.instagramUrl,
    icon: Instagram
  },
  {
    label: "服務項目",
    title: "查看可以從哪裡開始",
    description: "從一對一盤點、ETF 配置到退休現金流，選一個最符合你現在狀態的入口。",
    href: "#services",
    icon: ClipboardList
  },
  {
    label: "留下需求",
    title: "告訴我你卡在哪裡",
    description: "不需要先懂專有名詞，只要寫下你想解決的錢與生活問題。",
    href: "#lead-form",
    icon: Mail
  }
];

export const dinoServices: DinoService[] = [
  {
    title: "小資現金流健檢",
    description: "把每月收入、固定支出、緊急預備金與投資金流排開，找出真正需要先處理的地方。",
    icon: WalletCards
  },
  {
    title: "ETF 與存股配置",
    description: "用你能承受的波動和時間長度，整理出不用天天盯盤的配置方向。",
    icon: PiggyBank
  },
  {
    title: "退休現金流規劃",
    description: "把退休目標拆成每年需要的現金流，回推現在該準備的本金、投入節奏與風險範圍。",
    icon: LineChart
  },
  {
    title: "投資焦慮整理",
    description: "釐清焦慮來自市場、資訊量、資金壓力，還是缺少一套能反覆執行的判斷流程。",
    icon: ShieldCheck
  }
];

export const dinoStats = [
  { label: "服務方向", value: "ETF", icon: BarChart3 },
  { label: "規劃核心", value: "現金流", icon: CircleDollarSign },
  { label: "陪伴方式", value: "1:1", icon: Coffee }
];

export const dinoProcess = [
  {
    title: "先把問題說清楚",
    description: "不急著推薦商品，先整理你現在最想解決的是存不下錢、看不懂 ETF，還是怕退休準備不夠。"
  },
  {
    title: "再把數字排成表",
    description: "用收入、支出、資產與負債建立現金流視角，讓每個選擇都有依據。"
  },
  {
    title: "最後留下可執行步驟",
    description: "把下一週可以完成的事寫清楚，讓理財回到生活裡，而不是停在焦慮裡。"
  }
];

export const warmKeywords = [
  { label: "小資族", icon: Sprout },
  { label: "ETF", icon: BarChart3 },
  { label: "存股", icon: PiggyBank },
  { label: "退休現金流", icon: LineChart }
];
