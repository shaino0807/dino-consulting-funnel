"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  LockKeyhole,
  Send,
  Sparkles
} from "lucide-react";

import {
  dinoLinks,
  dinoProcess,
  dinoProfile,
  dinoServices,
  dinoStats,
  warmKeywords
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

function trackAnalytics(payload: TrackPayload) {
  const body = JSON.stringify({
    ...payload,
    path: window.location.pathname,
    sessionId: getSessionId()
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

export function DinoLandingPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">(
    "idle"
  );

  useEffect(() => {
    trackAnalytics({ type: "page_view", label: "home" });
  }, []);

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const lead = {
      name: String(formData.get("name") || "").trim(),
      contact: String(formData.get("contact") || "").trim(),
      topic: String(formData.get("topic") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };

    setFormState("sending");

    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "lead_submit",
        label: "lead-form",
        path: window.location.pathname,
        sessionId: getSessionId(),
        lead
      })
    });

    form.reset();
    setFormState("sent");
  }

  return (
    <main className="min-h-screen bg-[#f7f0e6] text-[#241812]">
      <section className="relative overflow-hidden border-b border-[#d7c2aa] bg-[#f8efe2]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(117,83,55,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(117,83,55,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto grid min-h-[92svh] max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-lg border border-[#c8ad91] bg-[#fff9f1]/85 px-3 py-2 text-sm font-semibold text-[#6b472d] shadow-sm">
              <Sparkles className="h-4 w-4" />
              小資族現金流整理
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[#241812] sm:text-5xl lg:text-6xl">
              {dinoProfile.name}
            </h1>

            <p className="mt-5 max-w-2xl text-xl font-medium leading-9 text-[#4a3324]">
              {dinoProfile.headline}
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#72543f] sm:text-lg">
              {dinoProfile.intro}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#lead-form"
                onClick={() =>
                  trackAnalytics({
                    type: "link_click",
                    label: "hero-primary",
                    href: "#lead-form"
                  })
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#6b3f24] px-5 text-base font-semibold text-white shadow-lg shadow-[#6b3f24]/18 transition hover:-translate-y-0.5 hover:bg-[#56311b]"
              >
                預約現金流整理
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={dinoProfile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackAnalytics({
                    type: "link_click",
                    label: "hero-instagram",
                    href: dinoProfile.instagramUrl
                  })
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#b99979] bg-[#fffaf3]/80 px-5 text-base font-semibold text-[#4a3324] transition hover:-translate-y-0.5 hover:bg-white"
              >
                看 Instagram 內容
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {dinoStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[#d8c4ad] bg-[#fffaf3]/75 p-3"
                  >
                    <Icon className="h-5 w-5 text-[#7b4e2f]" />
                    <p className="mt-3 text-lg font-semibold text-[#241812]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#72543f]">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <div className="rounded-lg border border-[#c8ad91] bg-[#fffaf3] p-4 shadow-2xl shadow-[#6b3f24]/16">
              <div className="relative overflow-hidden rounded-lg bg-[#2f231c]">
                <Image
                  src={dinoProfile.avatarUrl}
                  alt={`${dinoProfile.name} profile`}
                  width={720}
                  height={720}
                  priority
                  className="h-[420px] w-full object-cover opacity-85"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#201712] to-transparent p-5">
                  <p className="text-sm font-semibold text-[#ead9c6]">
                    專注 ETF、存股、退休現金流
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    把理財變成一張能執行的生活地圖
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#decab3] bg-[#fff9f1] px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          {warmKeywords.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d7c2aa] bg-white px-3 py-2 text-sm font-semibold text-[#5b3b27]"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f7f0e6] px-5 py-16" id="services">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#8a5f3d]">服務項目</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#241812] sm:text-4xl">
              從你現在最卡的地方開始
            </h2>
            <p className="mt-4 text-base leading-8 text-[#72543f]">
              不先追求複雜模型，先把金流、目標和可承受風險整理到同一張表裡。
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dinoServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  className="rounded-lg border border-[#d7c2aa] bg-[#fffaf3] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6b3f24]/10"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon className="h-7 w-7 text-[#7b4e2f]" />
                  <h3 className="mt-5 text-lg font-semibold text-[#241812]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#72543f]">
                    {service.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#2c211b] px-5 py-16 text-[#fff7ec]">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-[#d9b88e]">整理流程</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              用三步驟把焦慮變成下一個動作
            </h2>
          </div>
          <div className="grid gap-4">
            {dinoProcess.map((item, index) => (
              <motion.div
                key={item.title}
                className="grid gap-4 rounded-lg border border-white/12 bg-white/[0.06] p-5 sm:grid-cols-[56px_1fr]"
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d6b086] text-lg font-semibold text-[#2c211b]">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 leading-7 text-[#e7d5c1]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff9f1] px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-[#8a5f3d]">導流入口</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#241812] sm:text-4xl">
              選一個最符合你現在狀態的入口
            </h2>
          </div>
          <div className="grid gap-3">
            {dinoLinks.map((link) => {
              const Icon = link.icon;
              const isExternal = link.href.startsWith("http");
              return (
                <motion.a
                  key={link.title}
                  href={link.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  onClick={() =>
                    trackAnalytics({
                      type: "link_click",
                      label: link.label,
                      href: link.href
                    })
                  }
                  className={`group grid gap-4 rounded-lg border p-4 transition hover:-translate-y-0.5 sm:grid-cols-[56px_1fr_24px] sm:items-center ${
                    link.primary
                      ? "border-[#6b3f24] bg-[#6b3f24] text-white shadow-lg shadow-[#6b3f24]/15"
                      : "border-[#d7c2aa] bg-white text-[#241812] hover:border-[#b99979]"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      link.primary
                        ? "bg-white/15 text-white"
                        : "bg-[#f0e2d1] text-[#7b4e2f]"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold">
                      {link.title}
                    </span>
                    <span
                      className={`mt-1 block text-sm leading-7 ${
                        link.primary ? "text-[#f5e5d4]" : "text-[#72543f]"
                      }`}
                    >
                      {link.description}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7c2aa] bg-[#f1e3d2] px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-[#8a5f3d]">留下需求</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#241812] sm:text-4xl">
              先把你想解決的問題寫下來
            </h2>
            <p className="mt-4 leading-8 text-[#72543f]">
              你可以只留下稱呼、聯絡方式和目前最困擾的主題。資料只用於後續回覆與服務追蹤。
            </p>
          </div>

          <form
            id="lead-form"
            onSubmit={handleLeadSubmit}
            className="rounded-lg border border-[#c9ad8e] bg-[#fffaf3] p-5 shadow-lg shadow-[#6b3f24]/10"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-[#4a3324]">
                  稱呼
                </span>
                <input
                  name="name"
                  required
                  className="mt-2 h-12 w-full rounded-lg border border-[#d7c2aa] bg-white px-3 text-[#241812] outline-none transition focus:border-[#7b4e2f] focus:ring-2 focus:ring-[#d8b789]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[#4a3324]">
                  Email 或 LINE
                </span>
                <input
                  name="contact"
                  required
                  className="mt-2 h-12 w-full rounded-lg border border-[#d7c2aa] bg-white px-3 text-[#241812] outline-none transition focus:border-[#7b4e2f] focus:ring-2 focus:ring-[#d8b789]"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#4a3324]">
                想先整理的主題
              </span>
              <select
                name="topic"
                className="mt-2 h-12 w-full rounded-lg border border-[#d7c2aa] bg-white px-3 text-[#241812] outline-none transition focus:border-[#7b4e2f] focus:ring-2 focus:ring-[#d8b789]"
                defaultValue="ETF 與存股"
              >
                <option>ETF 與存股</option>
                <option>退休現金流</option>
                <option>每月存不下錢</option>
                <option>投資焦慮</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#4a3324]">
                目前狀況
              </span>
              <textarea
                name="message"
                rows={4}
                className="mt-2 w-full rounded-lg border border-[#d7c2aa] bg-white px-3 py-3 text-[#241812] outline-none transition focus:border-[#7b4e2f] focus:ring-2 focus:ring-[#d8b789]"
              />
            </label>

            <button
              type="submit"
              disabled={formState === "sending"}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#6b3f24] px-5 font-semibold text-white transition hover:bg-[#56311b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {formState === "sent" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  已收到，我會再整理回覆
                </>
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

      <footer className="bg-[#241812] px-5 py-8 text-[#ead9c6]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">{dinoProfile.name}</p>
            <p className="mt-1 text-sm text-[#c9b59f]">
              投資有風險，所有內容皆為教育與規劃討論，不構成個別投資建議。
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-[#c9b59f]">
            <LockKeyhole className="h-4 w-4" />
            追蹤資料存於專案後臺
          </div>
        </div>
      </footer>
    </main>
  );
}
