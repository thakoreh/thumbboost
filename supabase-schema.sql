create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  channel_name text,
  prompt text not null,
  thumbnails jsonb not null default '[]'::jsonb,
  share_token text unique,
  created_at timestamptz not null default now()
);

create table if not exists generation_usage (
  user_id uuid primary key,
  month text not null,
  free_count int not null default 0,
  plan text not null default 'free' check (plan in ('free', 'basic', 'pro')),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;
alter table generation_usage enable row level security;

create policy "users can read own projects" on projects for select using (auth.uid() = user_id);
create policy "users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "users can update own projects" on projects for update using (auth.uid() = user_id);

create policy "users can read own usage" on generation_usage for select using (auth.uid() = user_id);
create policy "users can update own usage" on generation_usage for update using (auth.uid() = user_id);
