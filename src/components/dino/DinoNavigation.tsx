"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { dinoProfile, navItems } from "@/data/dino-site";
import { trackAnalytics } from "@/lib/dino-analytics";

export function DinoNavigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => () => animation.current?.cancel(), []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActive(`#${visible.target.id}`);
    }, { rootMargin: "-15% 0px -60% 0px" });
    navItems.forEach(item => { const section = document.querySelector(item.href); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  async function close() {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    animation.current?.cancel();
    if (!reduced) {
      animation.current = dialog.current.animate([{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: "translateX(28px)" }], { duration: 180, easing: "ease-in", fill: "forwards" });
      await animation.current.finished.catch(() => {});
    }
    dialog.current?.close();
    animation.current?.cancel();
    closing.current = false;
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  function show() {
    dialog.current?.showModal(); setOpen(true);
    if (!reduced && dialog.current) animation.current = dialog.current.animate([{ opacity: 0, transform: "translateX(32px)" }, { opacity: 1, transform: "translateX(0)" }], { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" });
  }
  const links = navItems.map(item => <a key={item.href} href={item.href} aria-current={active === item.href ? "location" : undefined} onClick={() => { trackAnalytics({ type: "link_click", label: `nav-${item.label}`, href: item.href }); if (open) close(); }}>{item.label}</a>);
  return <>
    <a className="skip-link" href="#main-content">跳至主要內容</a>
    <header className="dino-nav"><div className="dino-container nav-inner">
      <a className="brand" href="#top" aria-label="Do理in財首頁"><span className="brand-mark">Do</span><span>Do理in財<small>DINO CONSULTING</small></span></a>
      <nav className="desktop-nav" aria-label="主要導覽">{links}<a className="dino-button small" href="#lead-form" onClick={() => trackAnalytics({ type: "consultation_cta_click", label: "nav-cta", href: "#lead-form" })}>{dinoProfile.primaryCta}</a></nav>
      <button ref={trigger} className="menu-trigger" type="button" aria-label="開啟選單" aria-expanded={open} aria-controls="mobile-navigation" onClick={show}><Menu aria-hidden="true" /></button>
    </div></header>
    <dialog ref={dialog} id="mobile-navigation" className="mobile-menu" aria-label="手機導覽" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="mobile-menu-panel"><div className="mobile-menu-top"><span className="brand"><span className="brand-mark">Do</span>Do理in財</span><button type="button" aria-label="關閉選單" onClick={close}><X aria-hidden="true" /></button></div><nav aria-label="手機主要導覽">{links}<a className="dino-button" href="#lead-form" onClick={() => { close(); trackAnalytics({ type: "consultation_cta_click", label: "mobile-nav-cta", href: "#lead-form" }); }}>{dinoProfile.primaryCta}</a></nav><p className="small-copy">首次 30 分鐘免費 · 不報明牌，不帶操作</p></div>
    </dialog>
  </>;
}
