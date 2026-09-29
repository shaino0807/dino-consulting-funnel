"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqCategories, faqs } from "@/data/dino-content";
import { SectionHeading } from "./DesignPrimitives";
import { AccordionPanel, AnimatedSwap } from "./MotionExperience";

export function FAQSection() {
  const [category, setCategory] = useState("全部");
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = faqs.filter(item => category === "全部" || item.category === category);
  return <section id="faq" className="dino-section"><div className="dino-container faq-layout"><SectionHeading eyebrow="FAQ · 常見問題" title="在開始之前，你可能還想知道" /><div>
    <div className="filter-list" role="group" aria-label="篩選常見問題">{faqCategories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setExpanded(null); }}>{item}</button>)}</div>
    <AnimatedSwap stateKey={category}><div className="faq-list">{filtered.map(item => <div className="faq-item" key={item.id}><h3><button id={`faq-trigger-${item.id}`} type="button" aria-expanded={expanded === item.id} aria-controls={`faq-answer-${item.id}`} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>{item.question}<ChevronDown aria-hidden="true" /></button></h3><AccordionPanel id={`faq-answer-${item.id}`} labelledBy={`faq-trigger-${item.id}`} open={expanded === item.id}><p>{item.answer}</p>{item.id === "privacy" && <a className="text-link" href="#data-notice">資料與服務說明 →</a>}</AccordionPanel></div>)}</div></AnimatedSwap>
  </div></div></section>;
}
