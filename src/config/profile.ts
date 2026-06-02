import {
  BookOpen,
  BriefcaseBusiness,
  CalendarCheck,
  Camera,
  Gift,
  Globe2,
  GraduationCap,
  Instagram,
  Mail,
  MessageCircle,
  Mic2,
  Palette,
  PenTool,
  Send,
  ShoppingBag,
  Sparkles,
  UsersRound,
  Youtube
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type LinkCategory = "featured" | "content" | "services" | "community";

export type BioLink = {
  title: string;
  description: string;
  href: string;
  cta: string;
  category: LinkCategory;
  icon: LucideIcon;
  badge?: string;
  highlighted?: boolean;
};

export type ServiceItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const profile = {
  name: "Mira Studio",
  handle: "@mira.notes",
  role: "個人品牌顧問 / 內容產品設計",
  location: "Taipei, Remote-friendly",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  heroImageUrl:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  intro:
    "把你的專業整理成可被理解、信任與購買的內容入口。這裡收錄合作方式、最新資源與社群連結。",
  trustSignals: ["3,200+ 讀者", "48h 內回覆", "品牌策略 / Landing Page"],
  primaryCta: {
    label: "預約 20 分鐘諮詢",
    href: "https://cal.com/"
  }
};

export const categories: Array<{ id: "all" | LinkCategory; label: string }> = [
  { id: "all", label: "全部" },
  { id: "featured", label: "主打" },
  { id: "content", label: "內容" },
  { id: "services", label: "服務" },
  { id: "community", label: "社群" }
];

export const featuredOffer = {
  eyebrow: "本月開放",
  title: "個人品牌微型首頁健檢",
  description: "用 30 分鐘找出你的首頁斷點，整理出可以立刻調整的 CTA、文案與連結排序。",
  href: "https://cal.com/",
  cta: "查看名額",
  icon: Sparkles
};

export const bioLinks: BioLink[] = [
  {
    title: "下載免費品牌頁檢核表",
    description: "15 個問題檢查你的 Link-in-bio 是否能有效導流。",
    href: "https://example.com/checklist",
    cta: "免費下載",
    category: "featured",
    icon: Gift,
    badge: "Free",
    highlighted: true
  },
  {
    title: "預約合作諮詢",
    description: "適合想整理服務包裝、內容漏斗或高轉換微型首頁的人。",
    href: "https://cal.com/",
    cta: "預約時間",
    category: "services",
    icon: CalendarCheck,
    badge: "熱門"
  },
  {
    title: "最新 YouTube 影片",
    description: "拆解一個高信任感個人品牌頁該具備的 5 個區塊。",
    href: "https://youtube.com/",
    cta: "觀看影片",
    category: "content",
    icon: Youtube
  },
  {
    title: "訂閱週報",
    description: "每週一封關於個人品牌、轉換文案與數位產品的筆記。",
    href: "https://example.com/newsletter",
    cta: "加入名單",
    category: "community",
    icon: Mail
  },
  {
    title: "模板商店",
    description: "Notion、Canva 與 Landing Page 文案模板，一次整理好。",
    href: "https://example.com/shop",
    cta: "逛逛模板",
    category: "featured",
    icon: ShoppingBag
  },
  {
    title: "品牌案例集",
    description: "看我如何替創作者、顧問與小型工作室重整入口頁。",
    href: "https://example.com/cases",
    cta: "查看案例",
    category: "services",
    icon: BriefcaseBusiness
  },
  {
    title: "加入私密社群",
    description: "和其他創作者一起檢視內容、交換資源與固定衝刺。",
    href: "https://example.com/community",
    cta: "申請加入",
    category: "community",
    icon: UsersRound
  }
];

export const services: ServiceItem[] = [
  {
    title: "首頁文案整理",
    description: "將定位、受眾、CTA 與信任證明整理成清楚的頁面訊息。",
    href: "https://example.com/copy",
    icon: PenTool
  },
  {
    title: "內容產品規劃",
    description: "協助把知識、經驗與方法論包裝成可銷售的微型產品。",
    href: "https://example.com/product",
    icon: BookOpen
  },
  {
    title: "視覺入口設計",
    description: "為 Instagram、Threads、電子報讀者設計一致的品牌入口。",
    href: "https://example.com/visual",
    icon: Palette
  }
];

export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/", icon: Instagram },
  { label: "Threads", href: "https://threads.net/", icon: MessageCircle },
  { label: "Email", href: "mailto:hello@example.com", icon: Send },
  { label: "Website", href: "https://example.com", icon: Globe2 }
];

export const quickStats = [
  { label: "課程學員", value: "1.8k", icon: GraduationCap },
  { label: "演講場次", value: "36", icon: Mic2 },
  { label: "品牌拍攝", value: "92", icon: Camera }
];
