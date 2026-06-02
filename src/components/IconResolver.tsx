import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarCheck,
  Gift,
  Globe2,
  Instagram,
  Mail,
  MessageCircle,
  MessagesSquare,
  Newspaper,
  PieChart,
  Route,
  WalletCards,
  Youtube
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarCheck,
  Gift,
  Globe2,
  Instagram,
  Mail,
  MessageCircle,
  MessagesSquare,
  Newspaper,
  PieChart,
  Route,
  WalletCards,
  Youtube
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? ArrowUpRight;
}
