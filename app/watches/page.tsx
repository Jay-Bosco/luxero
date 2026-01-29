import { createServerSupabaseClient } from '@/lib/supabase/server';
import WatchesClient from '@/components/watches/WatchesClient';

export const metadata = {
  title: 'Collections | Luxero',
  description: 'Explore our curated collection of luxury timepieces.',
};

interface WatchesPageProps {
  searchParams: { 
    brand?: string;
    filter?: string;
    sort?: string;
  };
}

export default async function WatchesPage({ searchParams }: WatchesPageProps) {
  const supabase = createServerSupabaseClient();
  
  const { data: watches } = await supabase
    .from('watches')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  // Get unique brands
  const brands = Array.from(new Set(watches?.map(w => w.brand).filter(Boolean) || []));

  // Get filters from URL
  const initialBrand = searchParams.brand || null;
  const initialFilter = searchParams.filter || null; // 'featured', 'new'
  const initialSort = searchParams.sort || null; // 'newest', 'price-low', 'price-high'

  return (
    <WatchesClient 
      watches={watches || []} 
      brands={brands} 
      initialBrand={initialBrand}
      initialFilter={initialFilter}
      initialSort={initialSort}
    />
  );
}
