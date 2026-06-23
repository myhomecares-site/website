-- My Home Cares — lead & application capture
-- Applied to the dedicated Supabase project "my-home-cares" (ref: ybnvqqwzgjfwtxxhucak)
-- as table public.mhc_leads. Kept here for reference / re-creation.

create table if not exists public.mhc_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text,
  best_time text,
  position text,
  source text,
  type text default 'lead',
  created_at timestamptz default now()
);

-- RLS on, insert-only for the public/anon role (the publishable key).
-- No SELECT policy, so submissions can't be read with the public key.
alter table public.mhc_leads enable row level security;

drop policy if exists "anon_insert_mhc_leads" on public.mhc_leads;
create policy "anon_insert_mhc_leads"
  on public.mhc_leads
  for insert
  to anon, authenticated
  with check (true);

create index if not exists mhc_leads_created_at_idx on public.mhc_leads (created_at desc);
