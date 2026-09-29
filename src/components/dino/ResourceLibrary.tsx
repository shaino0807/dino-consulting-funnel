"use client";
import { useState } from "react";
import { AnimatedSwap } from "./MotionExperience";
import { courseCategories, courseResources } from "@/data/dino-site";
import { VideoResources } from "./VideoResources";
import { trackAnalytics } from "@/lib/dino-analytics";
export function ResourceLibrary() {
  const [category, setCategory] = useState("all");
  return <><VideoResources /><section className="resource-library"><h2>文章與整理工具</h2><p>尚未發布的內容會明確標示，不會連到無關頁面。</p><div className="filter-list" role="group" aria-label="篩選財務資源">{courseCategories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); trackAnalytics({ type: "resource_expanded", label: item.label }); }}>{item.label}</button>)}</div><AnimatedSwap stateKey={category}><div className="library-grid">{courseResources.filter(item => category === "all" || item.category === category).map(item => <article key={item.title}><span className="eyebrow">{item.status === "draft" ? "內容整理中" : item.badge}</span><h3>{item.title}</h3><p>{item.description}</p>{item.status === "published" && item.href ? <a href={item.href} className="text-link" onClick={() => trackAnalytics({ type: "resource_opened", label: item.title, href: item.href })}>閱讀內容 →</a> : <p className="small-copy">發布後會在這裡開放閱讀</p>}</article>)}</div></AnimatedSwap></section></>;
}
