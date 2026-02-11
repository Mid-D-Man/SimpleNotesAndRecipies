-- Create profiles table to store user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  tier text default 'free' check (tier in ('free', 'premium')),
  created_at timestamp with time zone default now()
);

-- Create user usage tracking for rate limiting
create table if not exists public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null,
  requests_used int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, month)
);

-- Create notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create todos table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create subscription purchases table for Stripe integration
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  monthly_requests_limit int default 0,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.user_usage enable row level security;
alter table public.notes enable row level security;
alter table public.todos enable row level security;
alter table public.subscriptions enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- RLS Policies for user_usage
create policy "user_usage_select_own" on public.user_usage for select using (auth.uid() = user_id);
create policy "user_usage_insert_own" on public.user_usage for insert with check (auth.uid() = user_id);
create policy "user_usage_update_own" on public.user_usage for update using (auth.uid() = user_id);

-- RLS Policies for notes
create policy "notes_select_own" on public.notes for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes for update using (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes for delete using (auth.uid() = user_id);

-- RLS Policies for todos
create policy "todos_select_own" on public.todos for select using (auth.uid() = user_id);
create policy "todos_insert_own" on public.todos for insert with check (auth.uid() = user_id);
create policy "todos_update_own" on public.todos for update using (auth.uid() = user_id);
create policy "todos_delete_own" on public.todos for delete using (auth.uid() = user_id);

-- RLS Policies for subscriptions
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "subscriptions_insert_own" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "subscriptions_update_own" on public.subscriptions for update using (auth.uid() = user_id);
