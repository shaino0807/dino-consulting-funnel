import {
  BarChart3,
  Download,
  ExternalLink,
  LogOut,
  MousePointerClick,
  Search,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAnalyticsBackend,
  readAnalyticsEvents,
  readLeads,
  type LeadStatus
} from "@/lib/analytics-store";
import { updateLeadAction } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type AdminPageProps = {
  searchParams?: Promise<{ q?: string; status?: string }>;
};

const statusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "新名單" },
  { value: "contacted", label: "已聯絡" },
  { value: "booked", label: "已預約" },
  { value: "completed", label: "已完成" },
  { value: "closed", label: "已結案" }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Taipei"
  }).format(new Date(value));
}

function metricLabel(type: string) {
  const labels: Record<string, string> = {
    page_view: "頁面瀏覽",
    link_click: "連結點擊",
    lead_submit: "舊版名單送出",
    hero_cta_click: "Hero CTA",
    topic_selected: "選擇主題",
    consultation_cta_click: "健診內容 CTA",
    form_started: "開始填表",
    form_validation_error: "表單驗證錯誤",
    lead_submit_success: "申請成功",
    lead_submit_failed: "申請失敗",
    resource_expanded: "展開資源",
    resource_opened: "開啟資源",
    booking_requested: "送出時段偏好"
  };
  return labels[type] || type;
}

function formatRate(numerator: number, denominator: number) {
  if (denominator === 0) return "—";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

function statusLabel(value: LeadStatus) {
  return statusOptions.find((option) => option.value === value)?.label || value;
}

export default async function AdminAnalyticsPage({ searchParams }: AdminPageProps) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const params = searchParams ? await searchParams : {};
  const query = String(params.q || "").trim().toLowerCase();
  const status = statusOptions.some((item) => item.value === params.status)
    ? (params.status as LeadStatus)
    : undefined;
  const [events, leads] = await Promise.all([readAnalyticsEvents(), readLeads()]);
  const filteredLeads = leads.filter((lead) => {
    if (status && lead.status !== status) return false;
    if (!query) return true;
    return [lead.name, lead.contact, lead.topic, lead.message, lead.internalNotes]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
  const pageViews = events.filter((event) => event.type === "page_view");
  const linkClicks = events.filter((event) => event.type === "link_click");
  const uniqueSessions = new Set(events.map((event) => event.sessionId).filter(Boolean)).size;
  const sessionsFor = (type: string) =>
    new Set(
      events
        .filter((event) => event.type === type)
        .map((event) => event.sessionId)
        .filter(Boolean)
    ).size;
  const heroCtaSessions = sessionsFor("hero_cta_click");
  const topicSessions = sessionsFor("topic_selected");
  const formStartedSessions = sessionsFor("form_started");
  const leadSuccessSessions = sessionsFor("lead_submit_success");
  const bookingRequestedSessions = sessionsFor("booking_requested");
  const bookedLeads = leads.filter((lead) => lead.status === "booked").length;

  return (
    <main className="min-h-screen bg-[#f7f0e6] px-5 py-10 text-[#241812]">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-[#d7c2aa] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1d6d58]">Dino080077-Do理in財</p>
            <h1 className="mt-2 font-['DM_Serif_Display'] text-4xl text-[#04342c]">諮詢名單後臺</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#72543f]">
              查看網站流量與表單名單，更新聯絡進度並記錄後續諮詢狀態。資料來源：
              {getAnalyticsBackend() === "supabase" ? "Supabase 正式資料庫" : "本機開發資料"}。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/api/admin/leads/export"
              className="inline-flex h-11 items-center justify-center gap-2 border border-[#b99979] bg-[#fffaf3] px-4 text-sm font-semibold hover:bg-white"
            >
              <Download className="h-4 w-4" />
              匯出 CSV
            </a>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 border border-[#b99979] bg-[#fffaf3] px-4 text-sm font-semibold hover:bg-white"
            >
              回到網站
              <ExternalLink className="h-4 w-4" />
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="inline-flex h-11 items-center justify-center gap-2 bg-[#04342c] px-4 text-sm font-semibold text-white">
                <LogOut className="h-4 w-4" />
                登出
              </button>
            </form>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricCard label="頁面瀏覽" value={pageViews.length} icon={<BarChart3 className="h-6 w-6" />} />
          <MetricCard label="連結點擊" value={linkClicks.length} icon={<MousePointerClick className="h-6 w-6" />} />
          <MetricCard label="表單名單" value={leads.length} icon={<UsersRound className="h-6 w-6" />} />
          <MetricCard label="訪客工作階段" value={uniqueSessions} icon={<BarChart3 className="h-6 w-6" />} />
        </section>

        <section className="mt-6 border border-[#d7c2aa] bg-[#fffaf3] p-5">
          <div>
            <p className="text-sm font-semibold text-[#1d6d58]">新版申請漏斗</p>
            <h2 className="mt-1 text-xl font-semibold">從 CTA 到預約偏好</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="點擊申請 CTA"
              value={heroCtaSessions}
              detail={`占工作階段 ${formatRate(heroCtaSessions, uniqueSessions)}`}
              icon={<MousePointerClick className="h-6 w-6" />}
            />
            <MetricCard
              label="選擇主題"
              value={topicSessions}
              detail={`CTA → 主題 ${formatRate(topicSessions, heroCtaSessions)}`}
              icon={<BarChart3 className="h-6 w-6" />}
            />
            <MetricCard
              label="開始填表"
              value={formStartedSessions}
              detail={`主題 → 填表 ${formatRate(formStartedSessions, topicSessions)}`}
              icon={<UsersRound className="h-6 w-6" />}
            />
            <MetricCard
              label="申請成功"
              value={leadSuccessSessions}
              detail={`填表 → 成功 ${formatRate(leadSuccessSessions, formStartedSessions)}`}
              icon={<UsersRound className="h-6 w-6" />}
            />
            <MetricCard
              label="送出時段偏好"
              value={bookingRequestedSessions}
              detail={`成功 → 時段 ${formatRate(bookingRequestedSessions, leadSuccessSessions)}`}
              icon={<BarChart3 className="h-6 w-6" />}
            />
          </div>
          <p className="mt-4 text-sm text-[#72543f]">
            已預約名單率：{formatRate(bookedLeads, leads.length)}（{bookedLeads}／{leads.length}）
          </p>
        </section>

        <section className="mt-8 border border-[#d7c2aa] bg-[#fffaf3] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">諮詢名單</h2>
              <p className="mt-2 text-sm text-[#72543f]">顯示 {filteredLeads.length}／{leads.length} 筆</p>
            </div>
            <form className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_150px_auto]" method="get">
              <label className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#8a6746]" />
                <input
                  name="q"
                  defaultValue={params.q}
                  placeholder="搜尋姓名、聯絡方式或主題"
                  className="h-11 w-full border border-[#d7c2aa] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#1d6d58]"
                />
              </label>
              <select
                name="status"
                defaultValue={params.status || ""}
                className="h-11 border border-[#d7c2aa] bg-white px-3 text-sm outline-none focus:border-[#1d6d58]"
              >
                <option value="">全部狀態</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button className="h-11 bg-[#1d6d58] px-5 text-sm font-semibold text-white">套用</button>
            </form>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {filteredLeads.length === 0 ? (
              <p className="border border-dashed border-[#d7c2aa] p-6 text-sm text-[#72543f] xl:col-span-2">
                目前沒有符合條件的名單。
              </p>
            ) : (
              filteredLeads.map((lead) => (
                <article key={lead.id} className="border border-[#e2ceb8] bg-white p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{lead.name}</h3>
                        <span className="bg-[#e1f5ee] px-2 py-1 text-xs font-semibold text-[#085041]">
                          {statusLabel(lead.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#72543f]">{lead.contact}</p>
                    </div>
                    <time className="text-xs text-[#8a5f3d]">{formatDate(lead.createdAt)}</time>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#4a3324]">{lead.topic}</p>
                  {lead.message ? <p className="mt-2 text-sm leading-7 text-[#72543f]">{lead.message}</p> : null}
                  <p className="mt-3 text-xs text-[#8a6746]">
                    來源：{lead.attribution?.source || lead.referer || "直接造訪"}
                  </p>

                  <form action={updateLeadAction} className="mt-5 grid gap-3 border-t border-[#ead8c4] pt-4 sm:grid-cols-[150px_1fr_auto] sm:items-end">
                    <input type="hidden" name="id" value={lead.id} />
                    <label>
                      <span className="text-xs font-semibold text-[#72543f]">聯絡狀態</span>
                      <select name="status" defaultValue={lead.status} className="mt-1 h-10 w-full border border-[#d7c2aa] bg-white px-2 text-sm">
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="text-xs font-semibold text-[#72543f]">內部備註</span>
                      <input
                        name="internalNotes"
                        defaultValue={lead.internalNotes}
                        placeholder="例如：已私訊，等待確認時間"
                        className="mt-1 h-10 w-full border border-[#d7c2aa] px-3 text-sm"
                      />
                    </label>
                    <button className="h-10 bg-[#04342c] px-4 text-sm font-semibold text-white">儲存</button>
                  </form>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="mt-8 border border-[#d7c2aa] bg-[#fffaf3] p-5">
          <h2 className="text-xl font-semibold">最近事件</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#d7c2aa] text-[#72543f]">
                  <th className="py-3 pr-4">時間</th><th className="py-3 pr-4">類型</th>
                  <th className="py-3 pr-4">標籤</th><th className="py-3 pr-4">流量來源</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 30).map((event) => (
                  <tr key={event.id} className="border-b border-[#ead8c4]">
                    <td className="py-3 pr-4">{formatDate(event.createdAt)}</td>
                    <td className="py-3 pr-4">{metricLabel(event.type)}</td>
                    <td className="py-3 pr-4">{event.label || "-"}</td>
                    <td className="py-3 pr-4 text-[#72543f]">{event.attribution?.source || event.referer || event.path || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
  detail
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  detail?: string;
}) {
  return (
    <div className="border border-[#d7c2aa] bg-[#fffaf3] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[#72543f]">{label}</p>
        <span className="text-[#1d6d58]">{icon}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-[#241812]">{value}</p>
      {detail ? <p className="mt-2 text-xs text-[#72543f]">{detail}</p> : null}
    </div>
  );
}
