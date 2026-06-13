import {
  BarChart3,
  ExternalLink,
  MousePointerClick,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { readAnalyticsEvents } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdminPageProps = {
  searchParams?: Promise<{
    key?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function metricLabel(type: string) {
  if (type === "page_view") return "頁面瀏覽";
  if (type === "link_click") return "連結點擊";
  if (type === "lead_submit") return "名單送出";
  return type;
}

export default async function AdminAnalyticsPage({
  searchParams
}: AdminPageProps) {
  const params = searchParams ? await searchParams : {};
  const adminKey = process.env.ANALYTICS_ADMIN_KEY;
  const isProduction = process.env.NODE_ENV === "production";
  const isMissingProductionKey = isProduction && !adminKey;
  const isLocked = isMissingProductionKey || Boolean(adminKey && params.key !== adminKey);

  if (isLocked) {
    return (
      <main className="min-h-screen bg-[#f7f0e6] px-5 py-16 text-[#241812]">
        <div className="mx-auto max-w-xl rounded-lg border border-[#d7c2aa] bg-[#fffaf3] p-6">
          <h1 className="text-2xl font-semibold">後臺需要驗證</h1>
          <p className="mt-3 leading-7 text-[#72543f]">
            {isMissingProductionKey
              ? "正式環境必須先設定 ANALYTICS_ADMIN_KEY，避免客戶資料被公開。"
              : "請在網址加入正確的 key，或到部署環境設定 ANALYTICS_ADMIN_KEY。"}
          </p>
        </div>
      </main>
    );
  }

  const events = await readAnalyticsEvents();
  const pageViews = events.filter((event) => event.type === "page_view");
  const linkClicks = events.filter((event) => event.type === "link_click");
  const leads = events.filter((event) => event.type === "lead_submit");
  const uniqueSessions = new Set(
    events.map((event) => event.sessionId).filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-[#f7f0e6] px-5 py-10 text-[#241812]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-[#d7c2aa] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#8a5f3d]">
              Dino080077-Do理in財
            </p>
            <h1 className="mt-2 text-3xl font-semibold">後臺數據資料</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#72543f]">
              這裡整理網站瀏覽、導流點擊與表單名單，方便追蹤哪些客戶使用過網站。
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#b99979] bg-[#fffaf3] px-4 font-semibold text-[#4a3324] hover:bg-white"
          >
            回到網站
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {!adminKey ? (
          <div className="mt-5 rounded-lg border border-[#c9ad8e] bg-[#fff4df] p-4 text-sm leading-7 text-[#5b3b27]">
            目前是本機開發模式，尚未設定後臺 key。正式部署前請設定
            `ANALYTICS_ADMIN_KEY`。
          </div>
        ) : null}

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricCard
            label="頁面瀏覽"
            value={pageViews.length}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <MetricCard
            label="連結點擊"
            value={linkClicks.length}
            icon={<MousePointerClick className="h-6 w-6" />}
          />
          <MetricCard
            label="表單名單"
            value={leads.length}
            icon={<UsersRound className="h-6 w-6" />}
          />
          <MetricCard
            label="訪客工作階段"
            value={uniqueSessions}
            icon={<BarChart3 className="h-6 w-6" />}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg border border-[#d7c2aa] bg-[#fffaf3] p-5">
            <h2 className="text-xl font-semibold">最近名單</h2>
            <div className="mt-4 space-y-3">
              {leads.length === 0 ? (
                <p className="text-sm leading-7 text-[#72543f]">
                  目前還沒有客戶送出表單。
                </p>
              ) : (
                leads.slice(0, 8).map((event) => (
                  <article
                    key={event.id}
                    className="rounded-lg border border-[#e2ceb8] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {event.lead?.name || "未填稱呼"}
                        </p>
                        <p className="mt-1 text-sm text-[#72543f]">
                          {event.lead?.contact || "未填聯絡方式"}
                        </p>
                      </div>
                      <span className="text-xs text-[#8a5f3d]">
                        {formatDate(event.createdAt)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#4a3324]">
                      {event.lead?.topic || "未選主題"}
                    </p>
                    {event.lead?.message ? (
                      <p className="mt-2 text-sm leading-7 text-[#72543f]">
                        {event.lead.message}
                      </p>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-[#d7c2aa] bg-[#fffaf3] p-5">
            <h2 className="text-xl font-semibold">最近事件</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#d7c2aa] text-[#72543f]">
                    <th className="py-3 pr-4 font-semibold">時間</th>
                    <th className="py-3 pr-4 font-semibold">類型</th>
                    <th className="py-3 pr-4 font-semibold">標籤</th>
                    <th className="py-3 pr-4 font-semibold">來源</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 18).map((event) => (
                    <tr key={event.id} className="border-b border-[#ead8c4]">
                      <td className="py-3 pr-4 text-[#4a3324]">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="py-3 pr-4">{metricLabel(event.type)}</td>
                      <td className="py-3 pr-4">{event.label || "-"}</td>
                      <td className="py-3 pr-4 text-[#72543f]">
                        {event.referer || event.path || "-"}
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 ? (
                    <tr>
                      <td className="py-5 text-[#72543f]" colSpan={4}>
                        目前還沒有追蹤資料。
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#d7c2aa] bg-[#fffaf3] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-[#72543f]">{label}</p>
        <span className="text-[#7b4e2f]">{icon}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-[#241812]">{value}</p>
    </div>
  );
}
