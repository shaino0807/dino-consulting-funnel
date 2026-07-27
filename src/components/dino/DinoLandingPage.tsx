"use client";

import Image from "next/image";
import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ChevronsRight,
  Clock3,
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
  consultationPaths,
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

type FormErrors = Partial<Record<"name" | "contact" | "topic" | "consent", string>>;
type FormState = "idle" | "sending" | "sent" | "error";
type BookingState = "idle" | "sending" | "sent" | "error";

type TrackPayload = {
  type:
    | "page_view"
    | "link_click"
    | "lead_submit"
    | "hero_cta_click"
    | "topic_selected"
    | "consultation_cta_click"
    | "form_started"
    | "form_validation_error"
    | "lead_submit_success"
    | "lead_submit_failed"
    | "resource_expanded"
    | "resource_opened"
    | "booking_requested";
  label?: string;
  href?: string;
  leadId?: string;
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
  const [formState, setFormState] = useState<FormState>("idle");
  const formStartedAt = useRef(0);
  const hasTrackedFormStart = useRef(false);
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showAllResources, setShowAllResources] = useState(false);
  const [isFormInView, setIsFormInView] = useState(false);
  const [isHeroCtaInView, setIsHeroCtaInView] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string>();

  const filteredResources = useMemo(() => {
    if (activeCategory === "all") return courseResources;
    return courseResources.filter((resource) => resource.category === activeCategory);
  }, [activeCategory]);

  const displayedResources = useMemo(() => {
    if (showAllResources || activeCategory !== "all") return filteredResources;
    return filteredResources.slice(0, 2);
  }, [activeCategory, filteredResources, showAllResources]);

  useEffect(() => {
    formStartedAt.current = Date.now();
    trackAnalytics({ type: "page_view", label: "home-v2" });

    const onScroll = () => setIsScrolled(window.scrollY > 60);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const leadForm = document.getElementById("lead-form");
    const heroCta = document.getElementById("hero-primary-cta");
    const formObserver = leadForm
      ? new IntersectionObserver(
          ([entry]) => setIsFormInView(entry.isIntersecting),
          { threshold: 0.15 }
        )
      : null;
    const heroCtaObserver = heroCta
      ? new IntersectionObserver(
          ([entry]) => setIsHeroCtaInView(entry.isIntersecting),
          { threshold: 0.25 }
        )
      : null;

    if (leadForm && formObserver) formObserver.observe(leadForm);
    if (heroCta && heroCtaObserver) heroCtaObserver.observe(heroCta);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      formObserver?.disconnect();
      heroCtaObserver?.disconnect();
    };
  }, []);

  function chooseTopic(topic: string) {
    setSelectedTopic(topic);
    setFormErrors((current) => ({ ...current, topic: undefined }));
    trackAnalytics({
      type: "topic_selected",
      label: topic,
      href: "#consultation-value"
    });
    document.getElementById("consultation-value")?.scrollIntoView({ block: "start" });
  }

  function trackFormStart() {
    if (hasTrackedFormStart.current) return;
    hasTrackedFormStart.current = true;
    trackAnalytics({ type: "form_started", label: selectedTopic || "尚未選擇主題" });
  }

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

    const nextErrors: FormErrors = {};
    if (!lead.name) nextErrors.name = "請留下方便稱呼你的名字。";
    if (!lead.contact) {
      nextErrors.contact = "請填寫 Email 或 LINE ID，讓 Dino 可以回覆你。";
    }
    if (!lead.topic) nextErrors.topic = "請選擇最想整理的問題。";
    if (!lead.consent) nextErrors.consent = "請勾選同意後再送出需求。";

    if (Object.keys(nextErrors).length > 0) {
      trackAnalytics({
        type: "form_validation_error",
        label: Object.keys(nextErrors).join(",")
      });
      setFormErrors(nextErrors);
      setFormState("idle");
      const firstError = Object.keys(nextErrors)[0];
      const field = form.elements.namedItem(firstError);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setFormErrors({});
    setFormState("sending");

    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "lead_submit_success",
          label: "lead-form-v2",
          path: window.location.pathname,
          sessionId: getSessionId(),
          attribution: getAttribution(),
          lead
        })
      });
      if (!response.ok) throw new Error("Unable to submit lead");
      const result = (await response.json()) as { leadId?: string };

      form.reset();
      formStartedAt.current = Date.now();
      hasTrackedFormStart.current = false;
      setSubmittedLeadId(result.leadId);
      setFormState("sent");
    } catch {
      trackAnalytics({
        type: "lead_submit_failed",
        label: "lead-form-v2"
      });
      setFormState("error");
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-[#f5f2eb] pb-32 text-[#111111] md:pb-0">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-[#f5f2eb]/90 backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? "py-3 shadow-lg shadow-[#04342c]/8" : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 lg:px-8">
          <a
            href="#top"
            className="focus-ring relative z-10 flex items-center gap-3 rounded-lg text-[#04342c]"
            onClick={() => trackClick("nav-logo", "#top")}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#04342c] text-sm font-semibold text-[#9fe1cb]">
              Do
            </span>
            <span className="font-serif text-xl">
              Dino080077
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="focus-ring rounded-md px-1 py-2 text-sm font-medium text-[#555555] transition hover:text-[#04342c]"
                onClick={() => trackClick(`nav-${item.label}`, item.href)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#lead-form"
              className="focus-ring rounded-full bg-[#04342c] px-5 py-2 text-sm font-semibold text-[#e1f5ee] transition hover:bg-[#085041]"
              onClick={() => trackClick("nav-cta", "#lead-form")}
            >
              {dinoProfile.primaryCta}
            </a>
          </nav>

          <button
            type="button"
            aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg border border-[#c8ad91] bg-[#fffaf3] text-[#04342c] md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen ? (
          <div
            id="mobile-navigation"
            className="border-t border-black/5 bg-[#f5f2eb] px-5 py-4 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="focus-ring min-h-11 rounded-lg px-3 py-3 text-base font-medium text-[#4a3324] hover:bg-white"
                  onClick={() => {
                    trackClick(`mobile-${item.label}`, item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#lead-form"
                className="focus-ring mt-2 min-h-11 rounded-full bg-[#04342c] px-4 py-3 text-center font-semibold text-[#e1f5ee]"
                onClick={() => {
                  trackClick("mobile-cta", "#lead-form");
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
        className="relative overflow-hidden bg-[#f5f2eb] px-5 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:px-8"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(29,158,117,0.08)_42%,transparent_72%)]"
          animate={{ opacity: [0.35, 0.7, 0.35], x: [-24, 24, -24] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1fr_0.95fr]">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9fe1cb] bg-[#e1f5ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#085041]">
              <span className="h-2 w-2 rounded-full bg-[#1d9e75] motion-safe:animate-pulse" />
              {dinoProfile.eyebrow}
            </div>

            <h1 className="mt-7 max-w-3xl font-serif text-5xl leading-[1.12] text-[#04342c] sm:text-6xl lg:text-7xl">
              {dinoProfile.heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-9 text-[#4a3324]">
              {dinoProfile.headline}
            </p>

            <p className="mt-4 max-w-xl rounded-lg border border-[#d7c2aa] bg-[#fffaf3] px-4 py-3 text-sm font-semibold leading-7 text-[#5b3b27]">
              {dinoProfile.promise}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                id="hero-primary-cta"
                href="#start-here"
                onClick={() =>
                  trackAnalytics({
                    type: "hero_cta_click",
                    label: "hero-primary",
                    href: "#start-here"
                  })
                }
                className="focus-ring inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#04342c] px-7 py-4 text-base font-semibold text-[#e1f5ee] shadow-lg shadow-[#04342c]/15 transition hover:-translate-y-0.5 hover:bg-[#085041]"
              >
                {dinoProfile.primaryCta}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick("hero-instagram", dinoProfile.instagramUrl)}
                className="focus-ring inline-flex h-14 items-center justify-center gap-2 rounded-full px-4 py-4 text-base font-semibold text-[#04342c] transition hover:gap-3"
              >
                {dinoProfile.secondaryCta}
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: "easeOut" }}
            className="grid gap-4"
          >
            <div className="grid grid-cols-3 gap-3">
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#04342c]/10"
                    whileHover={{ y: -4 }}
                  >
                    <Icon className="h-5 w-5 text-[#1d6d58]" />
                    <p className="mt-3 font-serif text-2xl text-[#04342c] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#66605a]">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

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
                  <p className="mt-2 font-serif text-2xl text-[#04342c]">
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
                {credibilityProofs.slice(0, 3).map((proof) => (
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

      <section
        id="start-here"
        className="scroll-mt-24 bg-white px-5 py-16 lg:px-8"
        aria-labelledby="start-here-title"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="先選你的起點"
            title="你現在最想先解決哪一題？"
            description="選一個最接近目前狀況的題目，我會先帶你看這次健診能得到什麼，並替表單預填主題。"
            titleId="start-here-title"
          />
          <MobileSwipeHint />
          <div
            className="mt-8 grid auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto pb-3 md:grid-flow-row md:grid-cols-3 md:overflow-visible"
            aria-label="選擇目前最想處理的財務問題"
          >
            {consultationPaths.map((path) => {
              const Icon = path.icon;
              const isSelected = selectedTopic === path.topic;
              return (
                <button
                  key={path.topic}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => chooseTopic(path.topic)}
                  className={`focus-ring snap-start rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-[#04342c] bg-[#e1f5ee] shadow-lg shadow-[#04342c]/10"
                      : "border-[#d7c2aa] bg-[#fffaf3] hover:border-[#1d6d58] hover:bg-white"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#04342c] text-[#e1f5ee]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-4 block font-serif text-xl leading-8 text-[#04342c]">
                    {path.title}
                  </span>
                  <span className="mt-2 block text-sm leading-7 text-[#5b5148]">
                    {path.description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#085041]">
                    以這個主題開始
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <SectionShell id="services" label="服務項目" title="四種方式，找到你的財務方向" bg="white">
        <MobileSwipeHint />
        <div className="grid auto-cols-[84%] grid-flow-col gap-5 overflow-x-auto pb-3 md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {dinoServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                className="group relative snap-start overflow-hidden rounded-2xl border border-black/5 bg-[#f5f2eb] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-[#04342c]/10"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.07, duration: 0.55 }}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#1d9e75] transition group-hover:scale-x-100" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1f5ee] text-[#1d6d58]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-[#04342c]">
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

      <section
        id="consultation-value"
        className="scroll-mt-24 bg-[#f1e3d2] px-5 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="免費 30 分鐘健診"
            title="這次通話，你會帶走 3 項成果"
            description="不是泛泛聊天，也不會在通話中要求購買商品。先把問題整理清楚，再決定是否需要後續服務。"
          />
          <ConsultationProgress selectedTopic={selectedTopic} currentStep={2} />

          <MobileSwipeHint className="lg:hidden" />
          <div className="mt-10 grid auto-cols-[86%] grid-flow-col gap-5 overflow-x-auto pb-3 lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">
            {consultationOutputs.map((output, index) => (
              <motion.article
                key={output.number}
                className="snap-start border-t-2 border-[#1d9e75] bg-[#fffaf3] p-6 shadow-sm"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <p className="font-serif text-4xl text-[#1d9e75]">
                  {output.number}
                </p>
                <h3 className="mt-5 font-serif text-2xl text-[#04342c]">
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
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-[#5b5148]">
              目前已選擇：
              <strong className="text-[#04342c]">{selectedTopic || "尚未選擇主題"}</strong>
            </p>
            <a
              href={selectedTopic ? "#lead-form" : "#start-here"}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#04342c] px-6 py-3 font-semibold text-[#e1f5ee] transition hover:bg-[#085041]"
              onClick={() =>
                selectedTopic
                  ? trackAnalytics({
                      type: "consultation_cta_click",
                      label: selectedTopic,
                      href: "#lead-form"
                    })
                  : trackClick("consultation-select-topic", "#start-here")
              }
            >
              {selectedTopic ? "帶著這個主題申請健診" : "先選擇最想整理的問題"}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <LeadFormSection
        formErrors={formErrors}
        formState={formState}
        submittedLeadId={submittedLeadId}
        selectedTopic={selectedTopic}
        onTopicChange={(topic) => {
          setSelectedTopic(topic);
          setFormErrors((current) => ({ ...current, topic: undefined }));
        }}
        onFormStarted={trackFormStart}
        onSubmit={handleLeadSubmit}
        onClearError={(field) =>
          setFormErrors((current) => ({ ...current, [field]: undefined }))
        }
      />

      <section id="philosophy" className="scroll-mt-24 bg-[#04342c] px-5 py-16 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="我的出發點"
            title="為什麼我不急著給你標準答案"
            inverted
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <blockquote className="border-l-2 border-[#1d9e75] pl-7 font-serif text-3xl leading-[1.55] text-[#9fe1cb]">
              「產品不是起點，你自己的現金流和生活選擇才是。」
            </blockquote>
            <div className="grid gap-5">
              {philosophyPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:grid-cols-[52px_1fr]"
                    initial={false}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-90px" }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#9fe1cb]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{point.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#d7f2e8]">
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
        <div className="mb-7 flex flex-wrap gap-2" aria-label="篩選財務資源">
          {courseCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeCategory === category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setShowAllResources(false);
                trackClick(`resource-filter-${category.label}`, "#resources");
              }}
              className={`focus-ring min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category.id
                  ? "border-[#04342c] bg-[#04342c] text-white"
                  : "border-black/15 bg-transparent text-[#66605a] hover:border-[#04342c] hover:text-[#04342c]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          目前顯示 {filteredResources.length} 筆資源。
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {displayedResources.map((resource, index) => {
            const Icon = resource.icon;
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1f5ee] text-[#1d6d58]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-[#f1e3d2] px-3 py-1 text-xs font-semibold text-[#6b3f24]">
                    {resource.badge}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-[#04342c]">
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
                {resource.status === "published" ? (
                  <div className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#e1f5ee] text-[#1d6d58] transition group-hover:translate-x-1 group-hover:bg-[#04342c] group-hover:text-[#9fe1cb]">
                    <ChevronRight aria-hidden className="h-5 w-5" />
                  </div>
                ) : (
                  <p className="mt-5 text-xs font-semibold text-[#8a6746]">
                    發布後會在這裡開放閱讀
                  </p>
                )}
              </>
            );

            return resource.status === "published" && resource.href ? (
              <motion.a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`閱讀資源：${resource.title}`}
                onClick={() =>
                  trackAnalytics({
                    type: "resource_opened",
                    label: resource.title,
                    href: resource.href
                  })
                }
                className="focus-ring group relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#04342c]/10"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                {cardContent}
              </motion.a>
            ) : (
              <motion.article
                key={resource.title}
                aria-label={`${resource.title}，內容整理中`}
                className="relative rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                {cardContent}
              </motion.article>
            );
          })}
        </div>
        {activeCategory === "all" && filteredResources.length > 2 ? (
          <div className="mt-6 text-center">
            <button
              type="button"
              aria-expanded={showAllResources}
              onClick={() =>
                setShowAllResources((current) => {
                  trackAnalytics({
                    type: "resource_expanded",
                    label: current ? "collapsed" : "expanded",
                    href: "#resources"
                  });
                  return !current;
                })
              }
              className="focus-ring min-h-11 rounded-full border border-[#04342c] px-5 py-2 text-sm font-semibold text-[#04342c] transition hover:bg-[#e1f5ee]"
            >
              {showAllResources ? "收合資源" : `查看更多資源（${filteredResources.length - 2}）`}
            </button>
          </div>
        ) : null}
      </SectionShell>

      <SectionShell
        id="feedback"
        label="常見諮詢情境"
        title="你不需要先懂很多，帶著現在的問題就可以開始"
        bg="white"
        description="以下是經常被提出的財務問題類型，用來協助你判斷這次健診是否適合自己，並非客戶證言。"
      >
        <MobileSwipeHint className="lg:hidden" />
        <div className="grid auto-cols-[86%] grid-flow-col gap-5 overflow-x-auto pb-3 lg:grid-flow-row lg:grid-cols-[1.25fr_1fr_1fr] lg:overflow-visible">
          {consultationScenarios.map((item, index) => (
            <motion.article
              key={item.title}
              className={`snap-start rounded-2xl border border-black/5 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#04342c]/8 ${
                index === 0 ? "bg-[#04342c] text-white" : "bg-[#f5f2eb] text-[#111111]"
              }`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0 ? "text-[#9fe1cb]" : "text-[#1d6d58]"
              }`}>
                {item.tag}
              </p>
              <h3 className={`mt-5 font-serif text-2xl leading-9 ${
                index === 0 ? "text-[#e1f5ee]" : "text-[#04342c]"
              }`}>
                {item.title}
              </h3>
              <p className={`mt-4 text-sm leading-7 ${
                index === 0 ? "text-[#d7f2e8]" : "text-[#66605a]"
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
        <MobileSwipeHint className="sm:hidden" />
        <div className="grid auto-cols-[72%] grid-flow-col gap-4 overflow-x-auto pb-3 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {igPosts.map((post, index) => {
            const postContent = (
              <>
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
              </>
            );

            return post.status === "published" && post.href ? (
              <motion.a
                key={post.title}
                href={post.href}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackAnalytics({
                    type: "resource_opened",
                    label: `instagram-${post.title}`,
                    href: post.href
                  })
                }
                className="focus-ring group block snap-start rounded-2xl"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                {postContent}
              </motion.a>
            ) : (
              <motion.article
                key={post.title}
                aria-label={`${post.title}，內容整理中`}
                className="group block snap-start rounded-2xl"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                {postContent}
              </motion.article>
            );
          })}
        </div>
      </SectionShell>

      <section id="cta" className="bg-[#0f5a48] px-5 py-16 text-white lg:px-8">
        <motion.div
          className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d7f2e8]">
              每週依可預約時段安排
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              先免費健診 30 分鐘
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[#e1f5ee]">
              先留下目前最困擾你的財務問題；申請送出後，可直接選擇希望的日期與時段。通話不會要求購買商品。
            </p>
          </div>
          <div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="#lead-form"
                onClick={() =>
                  trackAnalytics({
                    type: "consultation_cta_click",
                    label: "final-cta",
                    href: "#lead-form"
                  })
                }
                className="focus-ring inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-[#04342c] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15"
              >
                申請免費健診
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackClick("cta-instagram", dinoProfile.instagramUrl)}
                className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/70 px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                先看 IG 觀點內容
                <ExternalLink className="h-5 w-5 shrink-0" />
              </a>
            </div>
            <p className="mt-3 text-center text-sm font-medium text-[#d7f2e8] lg:text-left">
              站內申請或 IG 私訊都可以；完成申請後再選擇希望時段。
            </p>
          </div>
        </motion.div>
      </section>

      <footer id="footer" className="bg-[#04342c] px-5 py-10 text-white/55 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-serif text-2xl text-white">
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
                className="focus-ring inline-flex min-h-11 items-center gap-1 rounded-md px-1 transition hover:text-[#9fe1cb]"
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
      {!isHeroCtaInView && !isFormInView && formState !== "sent" ? (
        <div
          className="fixed inset-x-4 bottom-4 z-40 flex min-h-16 items-center gap-3 rounded-2xl bg-[#04342c] p-3 text-[#e1f5ee] shadow-2xl shadow-black/25 md:hidden"
          aria-live="polite"
        >
          <p className="min-w-0 flex-1 truncate px-1 text-xs font-semibold">
            {selectedTopic ? `目前選擇：${selectedTopic}` : "先選問題，再申請免費健診"}
          </p>
          <a
            href={selectedTopic ? "#lead-form" : "#start-here"}
            className="focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-full bg-[#e1f5ee] px-4 text-sm font-semibold text-[#04342c]"
            onClick={() =>
              trackAnalytics({
                type: selectedTopic ? "consultation_cta_click" : "hero_cta_click",
                label: "mobile-sticky-cta",
                href: selectedTopic ? "#lead-form" : "#start-here"
              })
            }
          >
            {selectedTopic ? "留需求" : "開始"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      ) : null}
      </main>
    </MotionConfig>
  );
}

function LeadFormSection({
  formErrors,
  formState,
  submittedLeadId,
  selectedTopic,
  onTopicChange,
  onFormStarted,
  onSubmit,
  onClearError
}: {
  formErrors: FormErrors;
  formState: FormState;
  submittedLeadId?: string;
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  onFormStarted: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onClearError: (field: keyof FormErrors) => void;
}) {
  return (
    <section
      id="lead-form"
      className="scroll-mt-24 bg-white px-5 py-16 lg:px-8"
      aria-labelledby="lead-form-title"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <SectionHeading
            label="免費健診申請"
            title="留下需求，開始整理你的下一步"
            titleId="lead-form-title"
            description="填寫稱呼、聯絡方式和最想處理的主題即可。送出後可選擇希望日期與時段，再由 Dino 回覆確認。"
          />
          <ConsultationProgress selectedTopic={selectedTopic} currentStep={3} />
          <div className="mt-6 rounded-2xl border border-[#d7c2aa] bg-[#f5f2eb] p-5">
            <p className="font-semibold text-[#04342c]">這次不需要先準備完整資料</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-[#5b5148]">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1d6d58]" />
                先說明最卡住的問題即可
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1d6d58]" />
                通話不會要求購買商品
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1d6d58]" />
                請勿提供帳號密碼或金融憑證
              </li>
            </ul>
          </div>
        </div>

        {formState === "sent" ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-[#9fcbbd] bg-[#e1f5ee] p-7 shadow-xl shadow-[#04342c]/10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#04342c] text-[#e1f5ee]">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-serif text-3xl text-[#04342c]">
              申請已收到，接著選擇希望時段
            </h3>
            <p className="mt-3 leading-8 text-[#4a3324]">
              日期與時段是預約偏好，不代表立即確認。Dino 會在 2 個工作天內，
              依你留下的 Email 或 LINE ID 回覆最終時間。
            </p>
            <BookingCalendar leadId={submittedLeadId} topic={selectedTopic} />
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            onFocusCapture={onFormStarted}
            noValidate
            aria-describedby="form-reply-note form-privacy-note"
            className="rounded-2xl border border-[#c9ad8e] bg-[#fffaf3] p-6 shadow-2xl shadow-[#6b3f24]/10"
          >
            <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              網站
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="稱呼"
                name="name"
                required
                autoComplete="name"
                placeholder="例如：冠儒"
                error={formErrors.name}
                onChange={() => onClearError("name")}
              />
              <Field
                label="Email 或 LINE ID"
                name="contact"
                required
                placeholder="email@example.com 或 LINE ID"
                help="請填寫你平常會查看的聯絡方式。"
                error={formErrors.contact}
                onChange={() => onClearError("contact")}
              />
            </div>
            <label className="mt-4 block" htmlFor="lead-topic">
              <span className="text-sm font-semibold text-[#4a3324]">
                想先整理的主題
              </span>
              <select
                id="lead-topic"
                name="topic"
                value={selectedTopic}
                required
                aria-invalid={Boolean(formErrors.topic)}
                aria-describedby={formErrors.topic ? "lead-topic-error" : undefined}
                onChange={(event) => {
                  onTopicChange(event.target.value);
                  onClearError("topic");
                }}
                className="focus-ring mt-2 h-12 w-full scroll-mt-32 rounded-xl border border-[#d7c2aa] bg-white px-3 text-[#241812] transition focus:border-[#1d6d58]"
              >
                <option value="" disabled>請選擇最想整理的問題</option>
                <option value="ETF 與存股">ETF 與存股</option>
                <option value="退休現金流">退休現金流</option>
                <option value="每月存不下錢">每月存不下錢</option>
                <option value="投資焦慮">投資焦慮</option>
                <option value="個股問題">個股問題</option>
                <option value="總體經濟原理">總體經濟原理</option>
              </select>
              {formErrors.topic ? (
                <span
                  id="lead-topic-error"
                  role="alert"
                  className="mt-1 block text-sm font-semibold text-[#a23e24]"
                >
                  {formErrors.topic}
                </span>
              ) : null}
            </label>
            <label className="mt-4 block" htmlFor="lead-message">
              <span className="text-sm font-semibold text-[#4a3324]">
                目前狀況
              </span>
              <textarea
                id="lead-message"
                name="message"
                rows={4}
                placeholder="簡單描述目前最困擾你的狀況即可，不需要提供帳戶或金融資料。"
                className="focus-ring mt-2 w-full scroll-mt-32 rounded-xl border border-[#d7c2aa] bg-white px-3 py-3 text-[#241812] transition focus:border-[#1d6d58]"
              />
            </label>

            <div
              id="form-privacy-note"
              className="mt-5 flex gap-3 border-t border-[#d7c2aa] pt-5 text-sm leading-7 text-[#5b5148]"
            >
              <LockKeyhole className="mt-1 h-4 w-4 shrink-0 text-[#1d6d58]" />
              <div>
                <p>
                  資料只用於回覆本次需求與服務聯繫，不公開、不轉售。
                </p>
                <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3 font-semibold text-[#4a3324]">
                  <input
                    type="checkbox"
                    name="consent"
                    aria-invalid={Boolean(formErrors.consent)}
                    aria-describedby={formErrors.consent ? "consent-error" : undefined}
                    onChange={() => onClearError("consent")}
                    className="mt-1 h-5 w-5 shrink-0 scroll-mt-32 accent-[#1d6d58]"
                  />
                  <span>我同意 Dino 使用上述資料與我聯絡本次諮詢。</span>
                </label>
                {formErrors.consent ? (
                  <p id="consent-error" role="alert" className="mt-1 font-semibold text-[#a23e24]">
                    {formErrors.consent}
                  </p>
                ) : null}
              </div>
            </div>

            <p id="form-reply-note" className="mt-4 text-sm font-medium text-[#4a3324]">
              送出後可選擇希望日期與時段；若送出失敗，可改用 IG 私訊「健診」。
            </p>

            {formState === "error" ? (
              <p
                role="alert"
                className="mt-4 border border-[#d7a48b] bg-[#fff0e7] px-4 py-3 text-sm text-[#8c3f24]"
              >
                目前無法送出，請稍後再試，或直接使用 IG 私訊「健診」。
              </p>
            ) : null}

            <button
              type="submit"
              disabled={formState === "sending"}
              className="focus-ring mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#04342c] px-6 py-4 font-semibold text-[#e1f5ee] transition hover:bg-[#085041] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {formState === "sending" ? (
                <>正在安全送出…</>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  送出申請
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function BookingCalendar({ leadId, topic }: { leadId?: string; topic: string }) {
  const dateOptions = useMemo(() => {
    const dates: Array<{ value: string; weekday: string; label: string }> = [];
    const taipeiDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Taipei"
    });
    const cursor = new Date(`${taipeiDate}T12:00:00+08:00`);

    while (dates.length < 8) {
      cursor.setDate(cursor.getDate() + 1);
      const weekdayKey = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "Asia/Taipei"
      }).format(cursor);
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
        weekdayKey
      );
      if (day === 0 || day === 6) continue;
      dates.push({
        value: new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "Asia/Taipei"
        }).format(cursor),
        weekday: new Intl.DateTimeFormat("zh-TW", {
          weekday: "short",
          timeZone: "Asia/Taipei"
        }).format(cursor),
        label: new Intl.DateTimeFormat("zh-TW", {
          month: "numeric",
          day: "numeric",
          timeZone: "Asia/Taipei"
        }).format(cursor)
      });
    }

    return dates;
  }, []);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const [bookingState, setBookingState] = useState<BookingState>("idle");

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDate || !selectedWindow) {
      setBookingState("error");
      return;
    }

    setBookingState("sending");
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "booking_requested",
          label: `${selectedDate}|${selectedWindow}|${topic}`,
          path: window.location.pathname,
          sessionId: getSessionId(),
          attribution: getAttribution(),
          leadId
        })
      });
      if (!response.ok) throw new Error("Unable to record booking preference");
      setBookingState("sent");
    } catch {
      setBookingState("error");
    }
  }

  if (bookingState === "sent") {
    return (
      <div
        role="status"
        className="mt-6 rounded-2xl border border-[#9fcbbd] bg-white/70 p-5"
      >
        <p className="font-semibold text-[#04342c]">時段偏好已送出</p>
        <p className="mt-2 text-sm leading-7 text-[#4a3324]">
          你選擇了 {selectedDate}、{selectedWindow}。Dino 回覆確認後，才算完成預約。
        </p>
        <a
          href={dinoProfile.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#04342c] px-4 text-sm font-semibold text-[#04342c]"
          onClick={() => trackClick("success-instagram", dinoProfile.instagramUrl)}
        >
          等待期間先看 IG
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    );
  }

  const timeWindows = ["平日上午", "平日下午", "平日晚間"];

  return (
    <form
      onSubmit={handleBookingSubmit}
      className="mt-6 rounded-2xl border border-[#9fcbbd] bg-white/70 p-5"
      aria-labelledby="booking-calendar-title"
    >
      <div className="flex items-start gap-3">
        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#1d6d58]" />
        <div>
          <h4 id="booking-calendar-title" className="font-semibold text-[#04342c]">
            選擇希望日期
          </h4>
          <p className="mt-1 text-xs leading-6 text-[#5b5148]">
            此處提交的是時段偏好，Dino 回覆確認後才完成預約。
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2" role="group" aria-label="希望日期">
        {dateOptions.length > 0 ? (
          dateOptions.map((date) => (
            <button
              key={date.value}
              type="button"
              aria-pressed={selectedDate === date.value}
              onClick={() => {
                setSelectedDate(date.value);
                if (bookingState === "error") setBookingState("idle");
              }}
              className={`focus-ring min-h-14 rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${
                selectedDate === date.value
                  ? "border-[#04342c] bg-[#04342c] text-[#e1f5ee]"
                  : "border-[#b9cfc7] bg-white text-[#4a3324] hover:border-[#1d6d58]"
              }`}
            >
              <span className="block">{date.weekday}</span>
              <span className="mt-1 block">{date.label}</span>
            </button>
          ))
        ) : (
          <p className="col-span-4 py-3 text-sm text-[#5b5148]">正在載入可選日期…</p>
        )}
      </div>

      <div className="mt-4" role="group" aria-label="希望時段">
        <p className="flex items-center gap-2 text-sm font-semibold text-[#4a3324]">
          <Clock3 className="h-4 w-4 text-[#1d6d58]" />
          選擇希望時段
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {timeWindows.map((window) => (
            <button
              key={window}
              type="button"
              aria-pressed={selectedWindow === window}
              onClick={() => {
                setSelectedWindow(window);
                if (bookingState === "error") setBookingState("idle");
              }}
              className={`focus-ring min-h-11 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                selectedWindow === window
                  ? "border-[#04342c] bg-[#04342c] text-[#e1f5ee]"
                  : "border-[#b9cfc7] bg-white text-[#4a3324] hover:border-[#1d6d58]"
              }`}
            >
              {window}
            </button>
          ))}
        </div>
      </div>

      {bookingState === "error" ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-[#a23e24]">
          請選擇日期與時段；若已選擇仍無法送出，請改用 IG 私訊。
        </p>
      ) : null}

      <button
        type="submit"
        disabled={bookingState === "sending" || dateOptions.length === 0}
        className="focus-ring mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#04342c] px-5 py-3 font-semibold text-[#e1f5ee] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CalendarDays className="h-5 w-5" />
        {bookingState === "sending" ? "正在送出時段…" : "送出時段偏好"}
      </button>
    </form>
  );
}

function ConsultationProgress({
  selectedTopic,
  currentStep
}: {
  selectedTopic: string;
  currentStep: 1 | 2 | 3;
}) {
  const effectiveStep = selectedTopic ? currentStep : 1;
  const steps = ["選問題", "看產出", "留需求"].map((label, index) => {
    const number = index + 1;
    return {
      number,
      label,
      state:
        number < effectiveStep ? "complete" : number === effectiveStep ? "current" : "upcoming"
    };
  });

  return (
    <nav className="mt-7" aria-label="免費健診申請進度">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((step) => (
          <li
            key={step.number}
            aria-current={step.state === "current" ? "step" : undefined}
            className={`rounded-xl border px-3 py-3 text-center text-xs font-semibold ${
              step.state === "complete"
                ? "border-[#1d6d58] bg-[#e1f5ee] text-[#04342c]"
                : step.state === "current"
                  ? "border-[#04342c] bg-[#04342c] text-[#e1f5ee]"
                  : "border-[#c9ad8e] bg-white/60 text-[#786c61]"
            }`}
          >
            <span className="block text-[11px] opacity-80">步驟 {step.number}</span>
            <span className="mt-1 block">{step.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MobileSwipeHint({ className = "md:hidden" }: { className?: string }) {
  return (
    <p
      className={`mt-5 flex items-center gap-2 text-xs font-semibold text-[#1d6d58] ${className}`}
    >
      <ChevronsRight aria-hidden className="h-4 w-4" />
      左右滑動查看更多
    </p>
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
    <section
      id={id}
      className="scroll-mt-24 px-5 py-16 sm:py-20 lg:px-8"
      style={{ background: bg }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading label={label} title={title} description={description} />
        <div className="mt-9">{children}</div>
      </div>
    </section>
  );
}

function SectionHeading({
  label,
  title,
  description,
  inverted,
  titleId
}: {
  label: string;
  title: string;
  description?: string;
  inverted?: boolean;
  titleId?: string;
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
        id={titleId}
        className={`mt-3 font-serif text-4xl leading-tight sm:text-5xl ${
          inverted ? "text-white" : "text-[#04342c]"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-8 ${
            inverted ? "text-[#d7f2e8]" : "text-[#66605a]"
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
  required,
  placeholder,
  help,
  error,
  autoComplete,
  onChange
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  error?: string;
  autoComplete?: string;
  onChange?: () => void;
}) {
  const helpId = `${name}-help`;
  const errorId = `${name}-error`;

  return (
    <label className="block" htmlFor={name}>
      <span className="text-sm font-semibold text-[#4a3324]">{label}</span>
      <input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [help ? helpId : null, error ? errorId : null].filter(Boolean).join(" ") ||
          undefined
        }
        onChange={onChange}
        className="focus-ring mt-2 h-12 w-full scroll-mt-32 rounded-xl border border-[#d7c2aa] bg-white px-3 text-[#241812] transition focus:border-[#1d6d58]"
      />
      {help ? (
        <span id={helpId} className="mt-1 block text-xs leading-5 text-[#66605a]">
          {help}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} role="alert" className="mt-1 block text-sm font-semibold text-[#a23e24]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
