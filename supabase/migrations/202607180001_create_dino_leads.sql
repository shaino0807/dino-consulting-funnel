create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 80),
  contact text not null check (char_length(contact) between 1 and 120),
  topic text not null check (char_length(topic) between 1 and 80),
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'completed', 'closed')),
  internal_notes text,
  session_id text,
  user_agent text,
  referer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  consent_at timestamptz not null
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('page_view', 'link_click', 'lead_submit')),
  created_at timestamptz not null default now(),
  label text,
  href text,
  path text,
  session_id text,
  user_agent text,
  referer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  lead_id uuid references public.leads(id) on delete set null
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_type_idx on public.analytics_events(type);

alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;

revoke all on public.leads from anon, authenticated;
revoke all on public.analytics_events from anon, authenticated;
