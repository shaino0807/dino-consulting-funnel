import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AnalyticsEventType = "page_view" | "link_click" | "lead_submit";
export type LeadStatus = "new" | "contacted" | "booked" | "completed" | "closed";

export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

export type LeadPayload = {
  name?: string;
  contact?: string;
  topic?: string;
  message?: string;
  consent?: boolean;
  website?: string;
  startedAt?: number;
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
  attribution?: Attribution;
  leadId?: string;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  contact: string;
  topic: string;
  message?: string;
  status: LeadStatus;
  internalNotes?: string;
  sessionId?: string;
  userAgent?: string;
  referer?: string;
  attribution?: Attribution;
  consentAt: string;
};

export type AnalyticsInput = {
  type?: string;
  label?: string;
  href?: string;
  path?: string;
  sessionId?: string;
  attribution?: Attribution;
  lead?: LeadPayload;
};

const DATA_DIR = process.env.ANALYTICS_DATA_DIR
  ? path.resolve(process.env.ANALYTICS_DATA_DIR)
  : path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "analytics-events.jsonl");
const LEADS_FILE = path.join(DATA_DIR, "analytics-leads.json");

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function cleanAttribution(value: unknown): Attribution | undefined {
  if (!value || typeof value !== "object") return undefined;
  const input = value as Attribution;
  const attribution = {
    source: cleanText(input.source, 120),
    medium: cleanText(input.medium, 120),
    campaign: cleanText(input.campaign, 180),
    content: cleanText(input.content, 180)
  };
  return Object.values(attribution).some(Boolean) ? attribution : undefined;
}

function cleanLead(lead: unknown) {
  if (!lead || typeof lead !== "object") return undefined;
  const value = lead as LeadPayload;
  return {
    name: cleanText(value.name, 80),
    contact: cleanText(value.contact, 120),
    topic: cleanText(value.topic, 80),
    message: cleanText(value.message, 800),
    consent: value.consent === true,
    website: cleanText(value.website, 200),
    startedAt: typeof value.startedAt === "number" ? value.startedAt : undefined
  };
}

function isAnalyticsType(value: unknown): value is AnalyticsEventType {
  return value === "page_view" || value === "link_click" || value === "lead_submit";
}

function isLeadStatus(value: unknown): value is LeadStatus {
  return ["new", "contacted", "booked", "completed", "closed"].includes(String(value));
}

function assertProductionStorage() {
  if (process.env.NODE_ENV === "production" && !isSupabaseConfigured) {
    throw new Error("Supabase production storage is not configured");
  }
}

async function supabaseRequest(endpoint: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      ...init.headers
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async function appendLocalEvent(event: AnalyticsEvent) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(EVENTS_FILE, `${JSON.stringify(event)}\n`, {
    flag: "a",
    encoding: "utf8"
  });
}

async function readLocalEvents() {
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

async function readLocalLeads() {
  try {
    return JSON.parse(await readFile(LEADS_FILE, "utf8")) as LeadRecord[];
  } catch (error) {
    const maybeNodeError = error as NodeJS.ErrnoException;
    if (maybeNodeError.code === "ENOENT") return [];
    throw error;
  }
}

async function writeLocalLeads(leads: LeadRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf8");
}

function mapEventRow(row: Record<string, unknown>): AnalyticsEvent {
  const attribution = cleanAttribution({
    source: row.utm_source,
    medium: row.utm_medium,
    campaign: row.utm_campaign,
    content: row.utm_content
  });
  return {
    id: String(row.id),
    type: row.type as AnalyticsEventType,
    createdAt: String(row.created_at),
    label: cleanText(row.label, 120),
    href: cleanText(row.href, 500),
    path: cleanText(row.path, 300),
    sessionId: cleanText(row.session_id, 120),
    userAgent: cleanText(row.user_agent, 500),
    referer: cleanText(row.referer, 500),
    attribution,
    leadId: cleanText(row.lead_id, 80)
  };
}

function mapLeadRow(row: Record<string, unknown>): LeadRecord {
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    name: String(row.name || ""),
    contact: String(row.contact || ""),
    topic: String(row.topic || ""),
    message: cleanText(row.message, 800),
    status: isLeadStatus(row.status) ? row.status : "new",
    internalNotes: cleanText(row.internal_notes, 1200),
    sessionId: cleanText(row.session_id, 120),
    userAgent: cleanText(row.user_agent, 500),
    referer: cleanText(row.referer, 500),
    attribution: cleanAttribution({
      source: row.utm_source,
      medium: row.utm_medium,
      campaign: row.utm_campaign,
      content: row.utm_content
    }),
    consentAt: String(row.consent_at)
  };
}

export function getAnalyticsBackend() {
  return isSupabaseConfigured ? "supabase" : "local";
}

export async function appendAnalyticsEvent(input: AnalyticsInput, headers: Headers) {
  if (!isAnalyticsType(input.type)) {
    throw new Error("Unsupported analytics event type");
  }
  assertProductionStorage();

  const createdAt = new Date().toISOString();
  const attribution = cleanAttribution(input.attribution);
  const userAgent = cleanText(headers.get("user-agent"), 500);
  const referer = cleanText(headers.get("referer"), 500);
  let leadId: string | undefined;

  if (input.type === "lead_submit") {
    const lead = cleanLead(input.lead);
    if (!lead?.name || !lead.contact || !lead.topic || !lead.consent) {
      throw new Error("Lead fields or consent are missing");
    }
    if (lead.website) {
      return { id: randomUUID(), ignored: true };
    }
    const elapsed = Date.now() - (lead.startedAt || 0);
    if (elapsed < 1500 || elapsed > 24 * 60 * 60 * 1000) {
      throw new Error("Invalid form timing");
    }

    leadId = randomUUID();
    const leadRecord: LeadRecord = {
      id: leadId,
      createdAt,
      updatedAt: createdAt,
      name: lead.name,
      contact: lead.contact,
      topic: lead.topic,
      message: lead.message,
      status: "new",
      sessionId: cleanText(input.sessionId, 120),
      userAgent,
      referer,
      attribution,
      consentAt: createdAt
    };

    if (isSupabaseConfigured) {
      await supabaseRequest("leads", {
        method: "POST",
        headers: { prefer: "return=minimal" },
        body: JSON.stringify({
          id: leadRecord.id,
          created_at: leadRecord.createdAt,
          updated_at: leadRecord.updatedAt,
          name: leadRecord.name,
          contact: leadRecord.contact,
          topic: leadRecord.topic,
          message: leadRecord.message,
          status: leadRecord.status,
          session_id: leadRecord.sessionId,
          user_agent: leadRecord.userAgent,
          referer: leadRecord.referer,
          utm_source: attribution?.source,
          utm_medium: attribution?.medium,
          utm_campaign: attribution?.campaign,
          utm_content: attribution?.content,
          consent_at: leadRecord.consentAt
        })
      });
    } else {
      const leads = await readLocalLeads();
      await writeLocalLeads([leadRecord, ...leads]);
    }
  }

  const event: AnalyticsEvent = {
    id: randomUUID(),
    type: input.type,
    createdAt,
    label: cleanText(input.label, 120),
    href: cleanText(input.href, 500),
    path: cleanText(input.path, 300),
    sessionId: cleanText(input.sessionId, 120),
    userAgent,
    referer,
    attribution,
    leadId
  };

  if (isSupabaseConfigured) {
    await supabaseRequest("analytics_events", {
      method: "POST",
      headers: { prefer: "return=minimal" },
      body: JSON.stringify({
        id: event.id,
        type: event.type,
        created_at: event.createdAt,
        label: event.label,
        href: event.href,
        path: event.path,
        session_id: event.sessionId,
        user_agent: event.userAgent,
        referer: event.referer,
        utm_source: attribution?.source,
        utm_medium: attribution?.medium,
        utm_campaign: attribution?.campaign,
        utm_content: attribution?.content,
        lead_id: event.leadId
      })
    });
  } else {
    await appendLocalEvent(event);
  }

  return event;
}

export async function readAnalyticsEvents() {
  assertProductionStorage();
  if (!isSupabaseConfigured) return readLocalEvents();
  const rows = (await supabaseRequest(
    "analytics_events?select=*&order=created_at.desc&limit=1000"
  )) as Array<Record<string, unknown>>;
  return rows.map(mapEventRow);
}

export async function readLeads() {
  assertProductionStorage();
  if (!isSupabaseConfigured) {
    return (await readLocalLeads()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const rows = (await supabaseRequest("leads?select=*&order=created_at.desc&limit=1000")) as Array<
    Record<string, unknown>
  >;
  return rows.map(mapLeadRow);
}

export async function updateLead(id: string, status: LeadStatus, internalNotes?: string) {
  assertProductionStorage();
  if (!isLeadStatus(status)) throw new Error("Unsupported lead status");
  const updatedAt = new Date().toISOString();
  const notes = cleanText(internalNotes, 1200);

  if (isSupabaseConfigured) {
    await supabaseRequest(`leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { prefer: "return=minimal" },
      body: JSON.stringify({ status, internal_notes: notes || null, updated_at: updatedAt })
    });
    return;
  }

  const leads = await readLocalLeads();
  const next = leads.map((lead) =>
    lead.id === id ? { ...lead, status, internalNotes: notes, updatedAt } : lead
  );
  await writeLocalLeads(next);
}
