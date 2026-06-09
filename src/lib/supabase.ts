import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabaseSchemaSql = `
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  channel_name text,
  prompt text not null,
  thumbnails jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists generation_usage (
  user_id uuid primary key,
  month text not null,
  free_count int not null default 0,
  plan text not null default 'free',
  updated_at timestamptz not null default now()
);
`;
