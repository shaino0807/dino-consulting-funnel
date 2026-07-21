"use client";

import Image from "next/image";
import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  LockKeyhole,
  Menu,
  Play,
  Send,
  X
} from "lucide-react";

import {
  courseCategories,
  courseResources,
  consultationOutputs,
  consultationScenarios,
  credibilityProofs,
  dinoProfile,
  dinoServices,
  footerLinks,
  heroStats,
  igPosts,
  navItems,
  philosophyPoints,
  serviceBoundaries,
  serviceProblemTypes,
  type CourseCategory
} from "@/data/dino-site";

type TrackPayload = {
  type: "page_view" | "link_click" | "lead_submit";
  label?: string;
  href?: string;
  lead?: {
    name: string;
    contact: string;
    topic: string;
    message: string;
    consent: boolean;
    website: string;
    startedAt: number;
  };
};

function getSessionId() {
  const key = "dino-analytics-session";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    content: params.get("utm_content") || undefined
  };
}

function trackAnalytics(payload: TrackPayload) {
  const body = JSON.stringify({
    ...payload,
    path: window.location.pathname,
    sessionId: getSessionId(),
    attribution: getAttribution()
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  });
}

function trackClick(label: string, href: string) {
  trackAnalytics({ type: "link_click", label, href });
}

export function DinoLandingPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const formStartedAt = useRef(0);
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const filteredResources = useMemo(() => {
    if (activeCategory === "all") return courseResources;
    return courseResources.filter((resource) => resource.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    formStartedAt.current = Date.now();
    trackAnalytics({ type: "page_view", label: "home-v2" });

    const onScroll = () => setIsScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const lead = {
      name: String(formData.get("name") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      topic: String(formData.get("topic") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      consent: formData.get("consent") === "on",
      website: String(formData.get("website") || "").trim(),
      startedAt: formStartedAt.current
    };

    setFormState("sending");

    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "lead_submit",
          label: "lead-form-v2",
          path: window.location.pathname,
          sessionId: getSessionId(),
          attribution: getAttribution(),
          lead
        })
      });
      if (!response.ok) throw new Error("Unable to submit lead");

      form.reset();
      formStartedAt.current = Date.now();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] text-[#111111]">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#f5f2eb]/90 backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? "py-3 shadow-lg shadow-[#04342c]/8" : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 lg:px-8">
          <a
            href="#top"
            className="group flex items-center gap-3 text-[#04342c]"
            onClick={() => trackClick("nav-logo", "#top")}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#04342c] text-sm font-semibold text-[#9fe1cb]">
              Do
            </span>
            <span className="font-['DM_Serif_Display'] text-xl">
              Dino080077
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#555555] transition hover:text-[#04342c]"
                onClick={() => trackClick(`nav-${item.label}`, item.href)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={dinoProfile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#04342c] px-5 py-2 text-sm font-semibold text-[#e1f5ee] transition hover:bg-[#085041]"
              onClick={() => trackClick("nav-cta", dinoProfile.instagramUrl)}
            >
              {dinoProfile.primaryCta}
            </a>
          </nav>

          <button
            type="button"
            aria-label="開啟選單"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#c8ad91] bg-[#fffaf3] text-[#04342c] md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-black/5 bg-[#f5f2eb] px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-[#4a3324] hover:bg-white"
                  onClick={() => {
                    trackClick(`mobile-${item.label}`, item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-full bg-[#04342c] px-4 py-3 text-center font-semibold text-[#e1f5ee]"
                onClick={() => {
                  trackClick("mobile-cta", dinoProfile.instagramUrl);
                  setIsMenuOpen(false);
                }}
              >
                {dinoProfile.primaryCta}
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <section
        id="top"
        className="relative min-h-screen overflow-hidden bg-[#f5f2eb] px-5 pb-20 pt-32 lg:px-8"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(29,158,117,0.08)_42%,transparent_72%)]"
          animate={{ opacity: [0.35, 0.7, 0.35], x: [-24, 24, -24] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9fe1cb] bg-[#e1f5ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#085041]">
              <span className="h-2 w-2 rounded-full bg-[#1d9e75] motion-safe:animate-pulse" />
              {dinoProfile.eyebrow}
            </div>

            <h1 className="mt-7 max-w-3xl font-['DM_Serif_Display'] text-5xl leading-[1.05] text-[#04342c] sm:text-6xl lg:text-7xl">
              {dinoProfile.heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-9 text-[#4a3324]">
              {dinoProfile.headline}
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#66605a]">
              {dinoProfile.intro}
            </p>

            <p className="mt-4 max-w-xl rounded-lg border border-[#d7c2aa] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-7 text-[#5b3b27]">
              {dinoProfile.promise}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick("hero-primary", dinoProfile.instagramUrl)}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#04342c] px-7 py-4 text-base font-semibold text-[#e1f5ee] shadow-lg shadow-[#04342c]/15 transition hover:-translate-y-0.5 hover:bg-[#085041]"
              >
                {dinoProfile.primaryCta}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick("hero-instagram", dinoProfile.instagramUrl)}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-4 py-4 text-base font-semibold text-[#04342c] transition hover:gap-3"
              >
                {dinoProfile.secondaryCta}
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
            className="grid gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#04342c]/10"
                    whileHover={{ y: -4 }}
                  >
                    <Icon className="h-6 w-6 text-[#1d6d58]" />
                    <p className="mt-5 font-['DM_Serif_Display'] text-4xl text-[#04342c]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-[#77716a]">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="rounded-2xl bg-[#04342c] p-7 text-[#e1f5ee] shadow-2xl shadow-[#04342c]/20"
              whileHover={{ y: -4 }}
            >
              <p className="font-['DM_Serif_Display'] text-2xl leading-10">
                「買了一堆投資產品，卻說不清楚自己在做什麼？」
              </p>
              <p className="mt-4 text-sm leading-7 text-white/55">
                這是很多小資族最常遇到的卡點。先把帳戶和現金流看懂，再談配置。
              </p>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-black/5 bg-[#fffaf3] p-5 shadow-sm"
              whileHover={{ y: -4 }}
            >
              <div className="grid gap-4 sm:grid-cols-[104px_1fr] sm:items-center">
                <Image
                  src={dinoProfile.avatarUrl}
                  alt={`${dinoProfile.name} 本人照片`}
                  width={100}
                  height={100}
                  priority
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#e1f5ee]"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1d6d58]">
                    Dino 是誰
                  </p>
                  <p className="mt-2 font-['DM_Serif_Display'] text-2xl text-[#04342c]">
                    半導體工程師 × 接地氣財務顧問
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5b5148]">
                    {dinoProfile.positioning}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-[#77716a]">
                    {dinoProfile.background}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 border-t border-black/5 pt-5 sm:grid-cols-2">
                {credibilityProofs.map((proof) => (
                  <div key={proof} className="flex items-start gap-2 text-xs leading-5 text-[#5b5148]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d9e75]" />
                    <span>{proof}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {serviceBoundaries.map((boundary) => (
                  <span
                    key={boundary}
                    className="rounded-full border border-[#c8ad91] bg-white px-3 py-1 text-[11px] font-semibold text-[#5b3b27]"
                  >
                    {boundary}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionShell id="services" label="服務項目" title="四種方式，找到你的財務方向" bg="white">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {dinoServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-black/5 bg-[#f5f2eb] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-[#04342c]/10"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.07, duration: 0.55 }}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#1d9e75] transition group-hover:scale-x-100" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1f5ee] text-[#1d6d58]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-['DM_Serif_Display'] text-2xl text-[#04342c]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#66605a]">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex rounded-full bg-[#e1f5ee] px-3 py-1 text-xs font-semibold text-[#085041]">
                  {service.tag}
                </span>
              </motion.article>
            );
          })}
        </div>
      </SectionShell>

      <section className="bg-[#f1e3d2] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="免費 30 分鐘健診"
            title="這次通話，你會帶走三項具體產出"
            description="不是泛泛聊天，也不會在通話中要求購買商品。先把問題整理清楚，再決定是否需要後續服務。"
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {consultationOutputs.map((output, index) => (
              <motion.article
                key={output.number}
                className="border-t-2 border-[#1d9e75] bg-[#fffaf3] p-6 shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <p className="font-['DM_Serif_Display'] text-4xl text-[#1d9e75]">
                  {output.number}
                </p>
                <h3 className="mt-5 font-['DM_Serif_Display'] text-2xl text-[#04342c]">
                  {output.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#66605a]">
                  {output.description}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 border-t border-[#c9ad8e] pt-6">
            <p className="text-sm font-semibold text-[#4a3324]">常見可整理的問題</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceProblemTypes.map((problem) => (
                <span
                  key={problem}
                  className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#5b5148]"
                >
                  {problem}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="bg-[#04342c] px-5 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="我的出發點"
            title="為什麼我不急著給你標準答案"
            inverted
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <blockquote className="border-l-2 border-[#1d9e75] pl-7 font-['DM_Serif_Display'] text-3xl leading-[1.55] text-[#9fe1cb]">
              「產品不是起點，你自己的現金流和生活選擇才是。」
            </blockquote>
            <div className="grid gap-5">
              {philosophyPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:grid-cols-[52px_1fr]"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-90px" }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#9fe1cb]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{point.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/55">
                        {point.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        id="resources"
        label="課程與資源"
        title="從這裡開始，搞懂財務邏輯"
        bg="#f5f2eb"
        description="內容資產負責建立信任，諮詢服務負責把你的狀況整理成可執行步驟。"
      >
        <div className="mb-7 flex flex-wrap gap-2">
          {courseCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setActiveCategory(category.id);
                trackClick(`resource-filter-${category.label}`, "#resources");
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category.id
                  ? "border-[#04342c] bg-[#04342c] text-white"
                  : "border-black/15 bg-transparent text-[#66605a] hover:border-[#04342c] hover:text-[#04342c]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filteredResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.article
                key={resource.title}
                className="group relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#04342c]/10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1f5ee] text-[#1d6d58]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-[#f1e3d2] px-3 py-1 text-xs font-semibold text-[#6b3f24]">
                    {resource.badge}
                  </span>
                </div>
                <h3 className="mt-6 font-['DM_Serif_Display'] text-2xl text-[#04342c]">
                  {resource.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#66605a]">
                  {resource.description}
                </p>
                <div className="mt-5 space-y-2 border-t border-black/5 pt-5">
                  {resource.topics.map((topic) => (
                    <div key={topic} className="flex items-center gap-2 text-sm text-[#555555]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1d9e75]" />
                      {topic}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#e1f5ee] text-[#1d6d58] transition group-hover:translate-x-1 group-hover:bg-[#04342c] group-hover:text-[#9fe1cb]">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell
        id="feedback"
        label="常見諮詢情境"
        title="你不需要先懂很多，帶著現在的問題就可以開始"
        bg="white"
        description="以下是經常被提出的財務問題類型，用來協助你判斷這次健診是否適合自己，並非客戶證言。"
      >
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr_1fr]">
          {consultationScenarios.map((item, index) => (
            <motion.article
              key={item.title}
              className={`rounded-2xl border border-black/5 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#04342c]/8 ${
                index === 0 ? "bg-[#04342c] text-white" : "bg-[#f5f2eb] text-[#111111]"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0 ? "text-[#9fe1cb]" : "text-[#1d6d58]"
              }`}>
                {item.tag}
              </p>
              <h3 className={`mt-5 font-['DM_Serif_Display'] text-2xl leading-9 ${
                index === 0 ? "text-[#e1f5ee]" : "text-[#04342c]"
              }`}>
                {item.title}
              </h3>
              <p className={`mt-4 text-sm leading-7 ${
                index === 0 ? "text-white/65" : "text-[#66605a]"
              }`}>
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="instagram"
        label="IG 精選內容"
        title="用短內容，陪你建立投資判斷力"
        bg="#f5f2eb"
        description="這裡整理 Dino 的代表性觀點；更多內容與實際發布時間，請以 Instagram 頁面為準。"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {igPosts.map((post, index) => (
            <motion.a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick(`ig-${post.title}`, post.href)}
              className="group block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
            >
              <div
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${post.colors} shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-[#04342c]/18`}
              >
                <div className="absolute inset-0 bg-black/8" />
                <div className="absolute inset-0 flex items-center justify-center text-white/75 transition group-hover:text-white">
                  <Play className="h-10 w-10 fill-current" />
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur">
                  {post.label}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#4a3324]">
                {post.title}
              </p>
            </motion.a>
          ))}
        </div>
      </SectionShell>

      <section id="cta" className="bg-[#1d9e75] px-5 py-20 text-white lg:px-8">
        <motion.div
          className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
              本週接案限定 10 名
            </p>
            <h2 className="mt-3 font-['DM_Serif_Display'] text-4xl leading-tight sm:text-5xl">
              先免費健診 30 分鐘
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              帶著目前最困擾你的財務問題來，整理卡點、1–2 個優先項目與適合的規劃方向。通話不會要求購買商品。
            </p>
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick("cta-instagram", dinoProfile.instagramUrl)}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-[#04342c] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15"
              >
                私訊「健診」預約
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#lead-form"
                onClick={() => trackClick("cta-lead-form", "#lead-form")}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                不方便私訊，也可以留下需求
                <Send className="h-5 w-5 shrink-0" />
              </a>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-white/70 lg:text-left">
              最快回覆請走 IG 私訊
            </p>
          </div>
        </motion.div>
      </section>

      <section id="lead-form" className="bg-[#f1e3d2] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              label="備用聯絡方式"
              title="不方便私訊，也可以留下需求"
              description="你只需要留下稱呼、可聯絡方式與目前最困擾的主題；最快回覆仍建議使用 IG 私訊。"
            />
          </div>
          <form
            onSubmit={handleLeadSubmit}
            className="rounded-2xl border border-[#c9ad8e] bg-[#fffaf3] p-6 shadow-2xl shadow-[#6b3f24]/10"
          >
            <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              網站
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="稱呼" name="name" required />
              <Field label="Email 或 LINE" name="contact" required />
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#4a3324]">
                想先整理的主題
              </span>
              <select
                name="topic"
                className="mt-2 h-12 w-full rounded-xl border border-[#d7c2aa] bg-white px-3 text-[#241812] outline-none transition focus:border-[#1d6d58] focus:ring-2 focus:ring-[#9fe1cb]"
                defaultValue="ETF 與存股"
              >
                <option>ETF 與存股</option>
                <option>退休現金流</option>
                <option>每月存不下錢</option>
                <option>投資焦慮</option>
                <option>個股問題</option>
                <option>總體經濟原理</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#4a3324]">
                目前狀況
              </span>
              <textarea
                name="message"
                rows={4}
                className="mt-2 w-full rounded-xl border border-[#d7c2aa] bg-white px-3 py-3 text-[#241812] outline-none transition focus:border-[#1d6d58] focus:ring-2 focus:ring-[#9fe1cb]"
              />
            </label>

            <div className="mt-5 flex gap-3 border-t border-[#d7c2aa] pt-5 text-xs leading-6 text-[#6b5d52]">
              <LockKeyhole className="mt-1 h-4 w-4 shrink-0 text-[#1d6d58]" />
              <div>
                <p>
                  資料只用於回覆本次需求與服務聯繫，不公開、不轉售。請勿提供帳號密碼、完整帳戶資料或金融憑證。
                </p>
                <label className="mt-3 flex cursor-pointer items-start gap-2 font-semibold text-[#4a3324]">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 accent-[#1d6d58]"
                  />
                  <span>我同意 Dino 使用上述資料與我聯絡本次諮詢。</span>
                </label>
              </div>
            </div>

            {formState === "error" ? (
              <p className="mt-4 border border-[#d7a48b] bg-[#fff0e7] px-4 py-3 text-sm text-[#8c3f24]">
                目前無法送出，請稍後再試，或直接使用 IG 私訊「健診」。
              </p>
            ) : null}

            <button
              type="submit"
              disabled={formState === "sending"}
              className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#04342c] px-6 py-4 font-semibold text-[#e1f5ee] transition hover:bg-[#085041] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {formState === "sent" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  已收到，我會再整理回覆
                </>
              ) : formState === "sending" ? (
                <>正在安全送出…</>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  送出需求
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <footer id="footer" className="bg-[#04342c] px-5 py-10 text-white/55 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-['DM_Serif_Display'] text-2xl text-white">
              {dinoProfile.name}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-7">
              本站提供財務整理、金融知識與顧問服務，不提供代操、報明牌、投資群組或短期獲利保證。個股與總經內容為教育說明，不構成買賣建議。
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                onClick={() => trackClick(`footer-${link.label}`, link.href)}
                className="inline-flex items-center gap-1 transition hover:text-[#9fe1cb]"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 text-sm">
            <LockKeyhole className="h-4 w-4" />
            追蹤資料存於專案後臺
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionShell({
  id,
  label,
  title,
  description,
  bg,
  children
}: {
  id: string;
  label: string;
  title: string;
  description?: string;
  bg: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="px-5 py-24 lg:px-8" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading label={label} title={title} description={description} />
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function SectionHeading({
  label,
  title,
  description,
  inverted
}: {
  label: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] ${
          inverted ? "text-[#9fe1cb]" : "text-[#1d6d58]"
        }`}
      >
        <span
          className={`h-px w-7 ${inverted ? "bg-[#9fe1cb]" : "bg-[#1d9e75]"}`}
        />
        {label}
      </p>
      <h2
        className={`mt-3 font-['DM_Serif_Display'] text-4xl leading-tight sm:text-5xl ${
          inverted ? "text-white" : "text-[#04342c]"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-8 ${
            inverted ? "text-white/60" : "text-[#66605a]"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  required
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#4a3324]">{label}</span>
      <input
        name={name}
        required={required}
        className="mt-2 h-12 w-full rounded-xl border border-[#d7c2aa] bg-white px-3 text-[#241812] outline-none transition focus:border-[#1d6d58] focus:ring-2 focus:ring-[#9fe1cb]"
      />
    </label>
  );
}
