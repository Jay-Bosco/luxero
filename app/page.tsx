import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import WatchCard from '@/components/watches/WatchCard';
import HeroSection from '@/components/layout/HeroSection';

export default async function HomePage() {
  const supabase = createServerSupabaseClient();
  
  // Fetch featured watches
  const { data: featuredWatches } = await supabase
    .from('watches')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .limit(3);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Collection */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Featured Watches
            </p>
            <h2 className="text-4xl lg:text-5xl font-serif font-light tracking-wide">
              Just Listed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWatches?.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>

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
                title: 'Global Marketplace',
                description: 'Shop watches from trusted sellers worldwide with insured shipping.'
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
