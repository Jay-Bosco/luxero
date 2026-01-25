-- ============================================
-- SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================

-- Create the products storage bucket
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Allow public read access to product images
create policy "Public read access for products" on storage.objects
  for select using (bucket_id = 'products');

-- Allow authenticated admins to upload images
create policy "Admins can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'products' 
    and auth.uid() in (select user_id from public.admin_users)
  );

-- Allow authenticated admins to update images
create policy "Admins can update product images" on storage.objects
  for update using (
    bucket_id = 'products' 
    and auth.uid() in (select user_id from public.admin_users)
  );

-- Allow authenticated admins to delete images
create policy "Admins can delete product images" on storage.objects
  for delete using (
    bucket_id = 'products' 
    and auth.uid() in (select user_id from public.admin_users)
  );
