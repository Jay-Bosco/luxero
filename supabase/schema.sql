-- Luxero Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- WATCHES TABLE
-- ============================================
create table public.watches (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text not null,
  collection text,
  description text,
  price bigint not null, -- stored in cents
  currency text default 'USD',
  images text[] default array[]::text[],
  specifications jsonb default '{}'::jsonb,
  stock integer default 0,
  featured boolean default false,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster queries
create index watches_brand_idx on public.watches(brand);
create index watches_featured_idx on public.watches(featured) where featured = true;
create index watches_active_idx on public.watches(active) where active = true;

-- ============================================
-- USER PROFILES TABLE (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  shipping_address jsonb,
  billing_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text, -- for guest checkout
  items jsonb not null default '[]'::jsonb,
  subtotal bigint not null,
  shipping bigint default 0,
  tax bigint default 0,
  total bigint not null,
  currency text default 'USD',
  status text default 'pending',
  escrow_status text default 'pending',
  escrow_id text, -- external escrow reference
  escrow_release_date timestamp with time zone, -- auto-release date
  shipping_address jsonb not null,
  billing_address jsonb not null,
  tracking_number text,
  tracking_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index orders_escrow_status_idx on public.orders(escrow_status);

-- ============================================
-- ESCROW TRANSACTIONS TABLE
-- ============================================
create table public.escrow_transactions (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  type text not null, -- 'fund', 'release', 'refund', 'dispute'
  amount bigint not null,
  currency text default 'USD',
  status text default 'pending', -- 'pending', 'completed', 'failed'
  provider_reference text, -- external payment provider reference
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index escrow_transactions_order_id_idx on public.escrow_transactions(order_id);

-- ============================================
-- ORDER STATUS HISTORY (audit trail)
-- ============================================
create table public.order_status_history (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by uuid references public.profiles(id),
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index order_status_history_order_id_idx on public.order_status_history(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
alter table public.watches enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.escrow_transactions enable row level security;
alter table public.order_status_history enable row level security;

-- Watches: Anyone can read active watches
create policy "Watches are viewable by everyone" on public.watches
  for select using (active = true);

-- Profiles: Users can only view/edit their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Orders: Users can view their own orders
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can create orders" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

-- Escrow: Users can view escrow for their orders
create policy "Users can view own escrow transactions" on public.escrow_transactions
  for select using (
    exists (
      select 1 from public.orders 
      where orders.id = escrow_transactions.order_id 
      and orders.user_id = auth.uid()
    )
  );

-- Order history: Users can view history for their orders
create policy "Users can view own order history" on public.order_status_history
  for select using (
    exists (
      select 1 from public.orders 
      where orders.id = order_status_history.order_id 
      and orders.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger watches_updated_at
  before update on public.watches
  for each row execute function public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Record order status changes
create or replace function public.record_order_status_change()
returns trigger as $$
begin
  if old.status is distinct from new.status then
    insert into public.order_status_history (order_id, previous_status, new_status)
    values (new.id, old.status, new.status);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger order_status_changed
  after update on public.orders
  for each row execute function public.record_order_status_change();

-- ============================================
-- SAMPLE DATA (optional - remove in production)
-- ============================================

-- Insert sample watches
insert into public.watches (name, brand, collection, description, price, images, specifications, stock, featured) values
(
  'Celestial Tourbillon',
  'Luxero',
  'Haute Horlogerie',
  'A masterpiece of mechanical artistry featuring a flying tourbillon and hand-engraved movement.',
  12450000, -- $124,500
  array['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  '{"case_size": "42mm", "case_material": "18K Rose Gold", "movement": "Manual", "water_resistance": "30m", "power_reserve": "72h", "dial_color": "Silver", "strap_material": "Alligator Leather", "reference_number": "LX-CT-001"}'::jsonb,
  3,
  true
),
(
  'Midnight Perpetual',
  'Luxero',
  'Grand Complications',
  'Perpetual calendar with moon phase indicator, crafted for the discerning collector.',
  8900000, -- $89,000
  array['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
  '{"case_size": "40mm", "case_material": "Platinum", "movement": "Automatic", "water_resistance": "50m", "power_reserve": "48h", "dial_color": "Blue", "strap_material": "Alligator Leather", "reference_number": "LX-MP-001"}'::jsonb,
  5,
  true
),
(
  'Sovereign Chronograph',
  'Luxero',
  'Sport Elegance',
  'Where performance meets refinement. A chronograph for the modern connoisseur.',
  4580000, -- $45,800
  array['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800'],
  '{"case_size": "44mm", "case_material": "Titanium", "movement": "Automatic", "water_resistance": "100m", "power_reserve": "60h", "dial_color": "Black", "strap_material": "Titanium Bracelet", "reference_number": "LX-SC-001"}'::jsonb,
  8,
  true
);
