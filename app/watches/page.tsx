import { createServerSupabaseClient } from '@/lib/supabase/server';
import WatchCard from '@/components/watches/WatchCard';

export const metadata = {
  title: 'Collections | Luxero',
  description: 'Explore our curated collection of luxury timepieces.',
};

export default async function WatchesPage() {
  const supabase = createServerSupabaseClient();
  
  const { data: watches } = await supabase
    .from('watches')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  // Group by collection
  const collections = watches?.reduce((acc, watch) => {
    const collection = watch.collection || 'Other';
    if (!acc[collection]) acc[collection] = [];
    acc[collection].push(watch);
    return acc;
  }, {} as Record<string, typeof watches>);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
            Our Timepieces
          </p>
          <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-6">
            The Collection
          </h1>
          <p className="text-luxury-light font-sans text-lg max-w-2xl mx-auto">
            Each watch in our collection represents the pinnacle of horological excellence, 
            crafted with precision and passion.
          </p>
        </div>

        {/* Collections */}
        {collections && Object.entries(collections).map(([collectionName, collectionWatches]) => (
          <section key={collectionName} className="mb-20">
            <div className="flex items-center gap-8 mb-10">
              <h2 className="text-2xl font-serif font-light">{collectionName}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectionWatches?.map((watch, index) => (
                <WatchCard key={watch.id} watch={watch} index={index} />
              ))}
            </div>
          </section>
        ))}

        {/* Empty state */}
        {(!watches || watches.length === 0) && (
          <div className="text-center py-20">
            <p className="text-luxury-muted font-sans">
              No watches available at the moment. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
