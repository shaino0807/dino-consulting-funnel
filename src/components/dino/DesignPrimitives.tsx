"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { opacity: [0.3, 1], y: [20, 0] }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <div className="section-intro">{children}</div>}</div>;
}
export function NumberRow({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <div className="number-row"><span className="row-number" aria-hidden="true">{number}</span><div><h3>{title}</h3><p>{children}</p></div></div>;
}
export function ConsultationProgress({ topic, step }: { topic: string; step: number }) {
  return <nav className="consultation-progress" aria-label="免費健診申請進度"><ol>{["選問題", "看產出", "留需求"].map((label, index) => <li key={label} aria-current={(topic ? step : 1) === index + 1 ? "step" : undefined}><span>{index + 1}</span> {label}</li>)}</ol></nav>;
}
