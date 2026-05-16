create table if not exists public.learning_history (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  phrase_id integer not null,
  language text not null check (language in ('english', 'spanish', 'chinese', 'japanese')),
  category text not null check (category in ('daily', 'travel', 'business')),
  level integer not null check (level between 1 and 5),
  phrase_text text not null,
  translation text not null,
  pronunciation text not null,
  last_transcript text not null,
  learned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (device_id, language, phrase_id)
);

create index if not exists learning_history_device_learned_at_idx
  on public.learning_history (device_id, learned_at desc);

alter table public.learning_history enable row level security;

create policy "Allow anonymous learning history reads"
  on public.learning_history
  for select
  to anon
  using (true);

create policy "Allow anonymous learning history inserts"
  on public.learning_history
  for insert
  to anon
  with check (true);

create policy "Allow anonymous learning history updates"
  on public.learning_history
  for update
  to anon
  using (true)
  with check (true);
