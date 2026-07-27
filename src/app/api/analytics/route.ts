import { NextRequest, NextResponse } from "next/server";

import { appendAnalyticsEvent } from "@/lib/analytics-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const event = await appendAnalyticsEvent(input, request.headers);
    return NextResponse.json({
      ok: true,
      id: event.id,
      leadId: "leadId" in event ? event.leadId : undefined
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to record analytics event" },
      { status: 400 }
    );
  }
}
