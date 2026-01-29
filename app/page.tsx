import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import WatchCard from '@/components/watches/WatchCard';
import HeroSection from '@/components/layout/HeroSection';
import StoreRating from '@/components/home/StoreRating';

export default async function HomePage() {
  const supabase = createServerSupabaseClient();
  
  // Fetch featured watches
  const { data: featuredWatches } = await supabase
    .from('watches')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .limit(4);

  // Fetch store settings
  const { data: storeSettings } = await supabase
    .from('store_settings')
    .select('*')
    .single();

  const settings = storeSettings || {
    store_rating: 4.9,
    total_reviews: 1250,
    total_customers: 850,
    years_in_business: 5
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Store Rating Section */}
      <StoreRating settings={settings} />

      {/* Featured Collection */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Popular Picks
            </p>
            <h2 className="text-4xl lg:text-5xl font-serif font-light tracking-wide">
              Featured Watches
            </h2>
          </div>

          {featuredWatches && featuredWatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredWatches.map((watch, index) => (
                <WatchCard key={watch.id} watch={watch} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-luxury-muted font-sans">
                New arrivals coming soon.
              </p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/watches" className="btn-primary">
              Browse All Watches
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-6 lg:px-12 bg-luxury-dark/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '🛡️',
                title: 'Escrow Protected',
                description: 'Your payment is held securely until you receive and approve your watch. Zero risk.'
              },
              {
                icon: '✓',
                title: '100% Authenticated',
                description: 'Every watch is verified by experts before listing. No fakes, guaranteed.'
              },
              {
                icon: '🌍',
                title: 'Worldwide Delivery',
                description: 'We ship globally with full insurance and tracking on every order.'
              }
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-serif font-light mb-4">{item.title}</h3>
                <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-luxury-dark to-luxury-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold-500/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold-500/30" />
        </div>
        
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-6">
            Find Your Timepiece
          </p>
          <h2 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-8">
            Your Next Watch Awaits
          </h2>
          <p className="text-luxury-light font-sans text-lg mb-12 leading-relaxed">
            Browse our collection of authenticated luxury watches. 
            Every purchase protected with escrow — shop with confidence.
          </p>
          <Link href="/watches" className="btn-solid">
            Shop All Watches
          </Link>
        </div>
      </section>
    </>
  );
}
