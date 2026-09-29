"use client";
import { ArrowUpRight, Play } from "lucide-react";
import { featuredVideos } from "@/data/dino-content";
import { trackAnalytics } from "@/lib/dino-analytics";

export function VideoResources() {
  return <div className="video-grid">{featuredVideos.map((video, index) => <article className="video-resource" key={video.id}>
    <a href={video.href} target="_blank" rel="noreferrer" aria-label={`${video.title}（在新分頁開啟 Instagram）`} onClick={() => trackAnalytics({ type: "resource_opened", label: video.title, href: video.href })}>
      <div className={`video-cover cover-${index + 1}`}><span className="eyebrow">DINO NOTES / 0{index + 1}</span><strong>{video.cover.split("\n").map(line => <span key={line}>{line}</span>)}</strong><div><span>IG REEL · {video.date}</span><Play aria-hidden="true" /></div></div>
      <p className="eyebrow video-category">{video.category}</p><h3>{video.title}<ArrowUpRight aria-hidden="true" /></h3><p>{video.description}</p><span className="text-link">觀看影片 ↗</span>
    </a>
  </article>)}</div>;
}
