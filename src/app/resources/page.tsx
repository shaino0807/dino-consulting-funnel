import type { Metadata } from "next";
import Link from "next/link";
import { ResourceLibrary } from "@/components/dino/ResourceLibrary";
export const metadata: Metadata = { title: "財務內容與精選影片 | Do理in財" };
export default function ResourcesPage() {
  return <main className="dino-site dino-section"><div className="dino-container"><Link className="text-link" href="/">← 回到 Do理in財</Link><div className="resource-page-heading"><p className="eyebrow">DINO NOTES</p><h1>從觀點，練習自己的判斷。</h1><p>金融知識與財務整理。內容為教育用途，不構成買賣建議。</p></div><h2 className="sr-only">精選影片</h2><ResourceLibrary /></div></main>;
}
