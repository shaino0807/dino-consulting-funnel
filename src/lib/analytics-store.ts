import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AnalyticsEventType = "page_view" | "link_click" | "lead_submit";

export type LeadPayload = {
  name?: string;
  contact?: string;
  topic?: string;
  message?: string;
};

export type AnalyticsEvent = {
  id: string;
  type: AnalyticsEventType;
  createdAt: string;
  label?: string;
  href?: string;
  path?: string;
  sessionId?: string;
  userAgent?: string;
  referer?: string;
  lead?: LeadPayload;
};

export type AnalyticsInput = {
  type?: string;
  label?: string;
  href?: string;
  path?: string;
  sessionId?: string;
  lead?: LeadPayload;
};

const DATA_DIR = process.env.ANALYTICS_DATA_DIR
  ? path.resolve(process.env.ANALYTICS_DATA_DIR)
  : path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "analytics-events.jsonl");

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function cleanLead(lead: unknown): LeadPayload | undefined {
  if (!lead || typeof lead !== "object") return undefined;
  const value = lead as LeadPayload;
  return {
    name: cleanText(value.name, 80),
    contact: cleanText(value.contact, 120),
    topic: cleanText(value.topic, 80),
    message: cleanText(value.message, 800)
  };
}

function isAnalyticsType(value: unknown): value is AnalyticsEventType {
  return value === "page_view" || value === "link_click" || value === "lead_submit";
}

export async function appendAnalyticsEvent(
  input: AnalyticsInput,
  headers: Headers
) {
  if (!isAnalyticsType(input.type)) {
    throw new Error("Unsupported analytics event type");
  }

  const event: AnalyticsEvent = {
    id: randomUUID(),
    type: input.type,
    createdAt: new Date().toISOString(),
    label: cleanText(input.label, 120),
    href: cleanText(input.href, 500),
    path: cleanText(input.path, 300),
    sessionId: cleanText(input.sessionId, 120),
    userAgent: cleanText(headers.get("user-agent"), 500),
    referer: cleanText(headers.get("referer"), 500),
    lead: cleanLead(input.lead)
  };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(EVENTS_FILE, `${JSON.stringify(event)}\n`, {
    flag: "a",
    encoding: "utf8"
  });

  return event;
}

export async function readAnalyticsEvents() {
  try {
    const content = await readFile(EVENTS_FILE, "utf8");
    return content
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AnalyticsEvent)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    const maybeNodeError = error as NodeJS.ErrnoException;
    if (maybeNodeError.code === "ENOENT") return [];
    throw error;
  }
}
