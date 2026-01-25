-- ============================================
-- REVIEWS TABLE
-- ============================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  watch_id uuid references public.watches(id) on delete cascade,
  name text not null,
  email text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text not null,
  verified_purchase boolean default false,
  approved boolean default false, -- Admin must approve before showing
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index reviews_watch_id_idx on public.reviews(watch_id);
create index reviews_approved_idx on public.reviews(approved) where approved = true;

-- RLS for reviews
alter table public.reviews enable row level security;

-- Anyone can read approved reviews
create policy "Approved reviews are viewable by everyone" on public.reviews
  for select using (approved = true);

-- Anyone can submit a review
create policy "Anyone can submit reviews" on public.reviews
  for insert with check (true);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
create table public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for admin_users
alter table public.admin_users enable row level security;

-- Only admins can view admin_users
create policy "Admins can view admin users" on public.admin_users
  for select using (
    auth.uid() in (select user_id from public.admin_users)
  );

-- ============================================
-- ADMIN POLICIES FOR OTHER TABLES
-- ============================================

-- Admins can do everything on watches
create policy "Admins can insert watches" on public.watches
  for insert with check (
    auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admins can update watches" on public.watches
  for update using (
    auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admins can delete watches" on public.watches
  for delete using (
    auth.uid() in (select user_id from public.admin_users)
  );

-- Admins can manage reviews
create policy "Admins can view all reviews" on public.reviews
  for select using (
    auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admins can update reviews" on public.reviews
  for update using (
    auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admins can delete reviews" on public.reviews
  for delete using (
    auth.uid() in (select user_id from public.admin_users)
  );

-- Admins can manage orders
create policy "Admins can view all orders" on public.orders
  for select using (
    auth.uid() in (select user_id from public.admin_users)
  );

create policy "Admins can update orders" on public.orders
  for update using (
    auth.uid() in (select user_id from public.admin_users)
  );

-- ============================================
-- SETUP INITIAL ADMIN USER
-- ============================================
-- After creating the user in Supabase Auth with email: hamzatajibola401@gmail.com
-- Run this to make them an admin (replace USER_ID with the actual user ID from auth.users):
-- 
-- INSERT INTO public.admin_users (user_id, email, role)
-- VALUES ('YOUR-USER-ID-HERE', 'hamzatajibola401@gmail.com', 'admin');
