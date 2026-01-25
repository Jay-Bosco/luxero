# Admin Setup Guide

## Step 1: Run the Schema

First, run the reviews and admin schema in Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Copy and paste the contents of `supabase/reviews-admin-schema.sql`
4. Click **Run**

## Step 2: Create Admin User in Supabase Auth

1. Go to **Authentication** in the left sidebar
2. Click **Users** tab
3. Click **Add user** → **Create new user**
4. Enter:
   - **Email:** `hamzatajibola401@gmail.com`
   - **Password:** `Luxerowatches`
5. Click **Create user**
6. **Important:** Copy the **User UID** (it looks like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

## Step 3: Add User to Admin Table

1. Go to **SQL Editor**
2. Run this query (replace `YOUR-USER-ID-HERE` with the UID you copied):

```sql
INSERT INTO public.admin_users (user_id, email, role)
VALUES ('YOUR-USER-ID-HERE', 'hamzatajibola401@gmail.com', 'admin');
```

For example:
```sql
INSERT INTO public.admin_users (user_id, email, role)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'hamzatajibola401@gmail.com', 'admin');
```

## Step 4: Test Login

1. Go to `http://localhost:3000/admin/login`
2. Enter:
   - Email: `hamzatajibola401@gmail.com`
   - Password: `Luxerowatches`
3. Click **Sign In**

You should be redirected to the admin dashboard!

---

## Admin Features

Once logged in, you can:

### Products (`/admin/products`)
- Add new watches
- Edit existing watches
- Delete watches
- Set featured products
- Manage stock

### Reviews (`/admin/reviews`)
- View pending reviews
- Approve reviews (makes them visible on the site)
- Mark reviews as "Verified Purchase"
- Delete spam/inappropriate reviews

### Orders (`/admin/orders`)
- View all orders
- Update order status
- Add tracking numbers
- Track escrow status

---

## Troubleshooting

### "You do not have admin access" error
- Make sure you ran Step 3 correctly
- Check that the user_id matches exactly
- Go to Table Editor → admin_users to verify the entry exists

### Can't see reviews in admin
- Make sure the reviews table was created (Step 1)
- Check RLS policies are in place

### Products not saving
- Check that admin policies for watches table were created
- Verify you're logged in as admin
