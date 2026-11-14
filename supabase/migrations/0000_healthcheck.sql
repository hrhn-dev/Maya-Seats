-- Pre-flight table only. Proves read/write works from the deployed app.
-- Run this in the Supabase SQL editor (or `supabase db push`) before interview day.
create table if not exists public.healthcheck (
  id          bigint generated always as identity primary key,
  note        text not null,
  created_at  timestamptz not null default now()
);

-- RLS on with no policies: the public/anon key can't touch it.
-- Our server routes use the secret key, which bypasses RLS.
alter table public.healthcheck enable row level security;
