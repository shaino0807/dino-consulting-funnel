import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readLeads } from "@/lib/analytics-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const leads = await readLeads();
  const rows = [
    ["建立時間", "稱呼", "聯絡方式", "主題", "需求", "狀態", "內部備註", "來源", "媒介", "活動"],
    ...leads.map((lead) => [
      lead.createdAt,
      lead.name,
      lead.contact,
      lead.topic,
      lead.message,
      lead.status,
      lead.internalNotes,
      lead.attribution?.source,
      lead.attribution?.medium,
      lead.attribution?.campaign
    ])
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="dino-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store"
    }
  });
}
