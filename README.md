# Luxero - Luxury Watch E-Commerce

A Next.js 14 luxury watch e-commerce platform with Supabase backend and escrow payment protection.

![Luxero](https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=400&fit=crop)

## Features

- 🎨 **Luxury Design** - Dark theme with gold accents, elegant typography
- 🛒 **Full E-Commerce** - Product catalog, cart, checkout flow
- 🔒 **Escrow Payments** - Buyer protection until delivery confirmed
- 🗄️ **Supabase Backend** - PostgreSQL database, auth, storage
- ⚡ **Next.js 14** - App Router, Server Components, TypeScript
- 📱 **Responsive** - Mobile-first design

## Quick Start

### 1. Install Dependencies

```bash
cd luxero
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and keys

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
luxero/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── watches/           # Watch catalog & detail pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   └── account/           # User account & orders
├── components/
│   ├── layout/            # Header, Footer, Hero
│   ├── watches/           # WatchCard, WatchDetails
│   └── ui/                # Reusable UI components
├── lib/
│   ├── supabase/          # Supabase client config
│   ├── cart.ts            # Zustand cart store
│   └── escrow.ts          # Escrow payment logic
├── types/                 # TypeScript types
└── supabase/
    └── schema.sql         # Database schema
```

## Escrow Payment Flow

1. **Buyer places order** → Payment captured but held in escrow
2. **Seller ships item** → Tracking number provided
3. **Buyer receives item** → Confirms delivery
4. **Funds released** → Seller receives payment

Buyers have a 14-day inspection window to raise disputes if the item isn't as described.

## Adding Products

### Via Supabase Dashboard

1. Go to your Supabase project → Table Editor → `watches`
2. Click "Insert row" and fill in:
   - `name`, `brand`, `collection`
   - `price` (in cents, e.g., 12450000 = $124,500)
   - `images` (array of URLs)
   - `specifications` (JSON object)
   - `stock`, `featured`, `active`

### Via SQL

```sql
INSERT INTO watches (name, brand, collection, description, price, images, specifications, stock, featured)
VALUES (
  'Your Watch Name',
  'Luxero',
  'Collection Name',
  'Description here...',
  10000000,  -- $100,000
  ARRAY['https://your-image-url.jpg'],
  '{"case_size": "40mm", "case_material": "Gold"}'::jsonb,
  5,
  true
);
```

## Integrating Real Payments

The escrow logic in `lib/escrow.ts` is ready for integration with:

- **Stripe** - Use `capture_method: 'manual'` for escrow-like behavior
- **Escrow.com API** - Full escrow service
- **Trustap** - Marketplace escrow

See the TODO comments in the escrow service for integration points.

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```ts
colors: {
  gold: {
    500: '#d4af37',  // Primary gold
  },
  luxury: {
    black: '#0a0a0a',
    // ...
  }
}
```

### Fonts

Fonts are loaded via Google Fonts in `app/globals.css`. Change to your preferred fonts.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms

Build the production bundle:

```bash
npm run build
npm start
```

## License

MIT
