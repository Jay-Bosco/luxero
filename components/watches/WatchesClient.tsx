'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import { Watch } from '@/types';
import WatchCard from './WatchCard';

interface WatchesClientProps {
  watches: Watch[];
  brands: string[];
  initialBrand?: string | null;
}

// Popular luxury watch brands (show 6)
const popularBrands = [
  'Rolex',
  'Patek Philippe', 
  'Audemars Piguet',
  'Omega',
  'Cartier',
  'Richard Mille',
];

export default function WatchesClient({ watches, brands, initialBrand }: WatchesClientProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialBrand || null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'popular' | 'new'>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under50k' | '50kto100k' | 'over100k'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get all brands (6 popular + from products, excluding Luxero)
  const allBrands = useMemo(() => {
    const productBrands = brands.filter(b => b.toLowerCase() !== 'luxero');
    const merged = [...popularBrands];
    
    // Add product brands that aren't in popular list
    productBrands.forEach(brand => {
      if (!merged.some(b => b.toLowerCase() === brand.toLowerCase())) {
        merged.push(brand);
      }
    });
    return merged;
  }, [brands]);

  // Filter watches
  const filteredWatches = useMemo(() => {
    let result = [...watches];

    // Brand filter (case-insensitive)
    if (selectedBrand) {
      result = result.filter(w => w.brand?.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Category filter
    if (selectedCategory === 'popular') {
      result = result.filter(w => w.featured);
    } else if (selectedCategory === 'new') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(w => new Date(w.created_at) > thirtyDaysAgo);
    }

    // Price filter
    if (priceRange === 'under50k') {
      result = result.filter(w => w.price < 5000000);
    } else if (priceRange === '50kto100k') {
      result = result.filter(w => w.price >= 5000000 && w.price <= 10000000);
    } else if (priceRange === 'over100k') {
      result = result.filter(w => w.price > 10000000);
    }

    return result;
  }, [watches, selectedBrand, selectedCategory, priceRange]);

  // Group by brand for display (excluding "Luxero")
  const watchesByBrand = useMemo(() => {
    if (selectedBrand) return null;
    
    return filteredWatches.reduce((acc, watch) => {
      let brand = watch.brand || 'Other';
      if (brand.toLowerCase() === 'luxero') brand = 'Other';
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(watch);
      return acc;
    }, {} as Record<string, Watch[]>);
  }, [filteredWatches, selectedBrand]);

  // Featured watches
  const featuredWatches = useMemo(() => {
    return watches.filter(w => w.featured).slice(0, 4);
  }, [watches]);

  const clearFilters = () => {
    setSelectedBrand(null);
    setSelectedCategory('all');
    setPriceRange('all');
  };

  const hasActiveFilters = selectedBrand || selectedCategory !== 'all' || priceRange !== 'all';

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4"
          >
            Our Timepieces
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-6"
          >
            The Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-luxury-light font-sans text-lg max-w-2xl mx-auto"
          >
            Each watch in our collection represents the pinnacle of horological excellence.
          </motion.p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 font-sans text-sm tracking-wide uppercase transition-all ${
              selectedCategory === 'all'
                ? 'bg-gold-500 text-luxury-black'
                : 'border border-luxury-gray/50 text-luxury-light hover:border-gold-500/50'
            }`}
          >
            All Watches
          </button>
          <button
            onClick={() => setSelectedCategory('popular')}
            className={`px-6 py-3 font-sans text-sm tracking-wide uppercase transition-all flex items-center gap-2 ${
              selectedCategory === 'popular'
                ? 'bg-gold-500 text-luxury-black'
                : 'border border-luxury-gray/50 text-luxury-light hover:border-gold-500/50'
            }`}
          >
            <TrendingUp size={16} />
            Popular
          </button>
          <button
            onClick={() => setSelectedCategory('new')}
            className={`px-6 py-3 font-sans text-sm tracking-wide uppercase transition-all flex items-center gap-2 ${
              selectedCategory === 'new'
                ? 'bg-gold-500 text-luxury-black'
                : 'border border-luxury-gray/50 text-luxury-light hover:border-gold-500/50'
            }`}
          >
            <Sparkles size={16} />
            New Arrivals
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        <div className="flex items-center justify-between border-y border-luxury-gray/20 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 font-sans text-sm transition-colors ${
                showFilters ? 'text-gold-500' : 'text-luxury-light hover:text-gold-500'
              }`}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-gold-500 font-sans text-xs hover:text-gold-400"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          <p className="text-luxury-muted font-sans text-sm">
            {filteredWatches.length} {filteredWatches.length === 1 ? 'watch' : 'watches'}
          </p>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="py-6 border-b border-luxury-gray/20">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Brands */}
                  <div>
                    <label className="block text-luxury-muted font-sans text-xs tracking-wide uppercase mb-3">
                      Brand
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className={`px-3 py-1.5 font-sans text-xs transition-all ${
                          !selectedBrand
                            ? 'bg-gold-500 text-luxury-black'
                            : 'border border-luxury-gray/30 text-luxury-muted hover:border-gold-500/50'
                        }`}
                      >
                        All
                      </button>
                      {allBrands.map(brand => {
                        const hasProducts = brands.some(b => b.toLowerCase() === brand.toLowerCase());
                        return (
                          <button
                            key={brand}
                            onClick={() => setSelectedBrand(brand === selectedBrand ? null : brand)}
                            className={`px-3 py-1.5 font-sans text-xs transition-all ${
                              selectedBrand === brand
                                ? 'bg-gold-500 text-luxury-black'
                                : hasProducts
                                ? 'border border-luxury-gray/30 text-luxury-muted hover:border-gold-500/50'
                                : 'border border-luxury-gray/20 text-luxury-muted/40 hover:border-gold-500/30'
                            }`}
                          >
                            {brand}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-luxury-muted font-sans text-xs tracking-wide uppercase mb-3">
                      Price Range
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'all', label: 'All Prices' },
                        { value: 'under50k', label: 'Under $50K' },
                        { value: '50kto100k', label: '$50K - $100K' },
                        { value: 'over100k', label: 'Over $100K' },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setPriceRange(option.value as typeof priceRange)}
                          className={`px-3 py-1.5 font-sans text-xs transition-all ${
                            priceRange === option.value
                              ? 'bg-gold-500 text-luxury-black'
                              : 'border border-luxury-gray/30 text-luxury-muted hover:border-gold-500/50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-luxury-muted font-sans text-xs">Active:</span>
            {selectedBrand && (
              <span className="px-2 py-1 bg-gold-500/20 text-gold-500 font-sans text-xs flex items-center gap-1">
                {selectedBrand}
                <button onClick={() => setSelectedBrand(null)}><X size={12} /></button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="px-2 py-1 bg-gold-500/20 text-gold-500 font-sans text-xs flex items-center gap-1">
                {priceRange === 'under50k' ? 'Under $50K' : priceRange === '50kto100k' ? '$50K-$100K' : 'Over $100K'}
                <button onClick={() => setPriceRange('all')}><X size={12} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Featured Section (only show when no filters) */}
      {!hasActiveFilters && featuredWatches.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          <div className="flex items-center gap-8 mb-10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h2 className="text-2xl font-serif font-light">Popular Picks</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWatches.map((watch, index) => (
              <WatchCard key={watch.id} watch={watch} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Single Brand View */}
        {selectedBrand && (
          <section>
            <div className="flex items-center gap-8 mb-10">
              <h2 className="text-3xl font-serif font-light">{selectedBrand}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
              <span className="text-luxury-muted font-sans text-sm">
                {filteredWatches.length} {filteredWatches.length === 1 ? 'model' : 'models'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWatches.map((watch, index) => (
                <WatchCard key={watch.id} watch={watch} index={index} />
              ))}
            </div>

            {filteredWatches.length === 0 && (
              <div className="text-center py-20">
                <p className="text-luxury-muted font-sans">
                  No watches found for {selectedBrand}.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-gold-500 font-sans text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* All Brands View */}
        {!selectedBrand && watchesByBrand && (
          <>
            {Object.entries(watchesByBrand).map(([brand, brandWatches]) => (
              <section key={brand} className="mb-20">
                <div className="flex items-center gap-8 mb-10">
                  <h2 className="text-2xl font-serif font-light">{brand}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className="text-gold-500 font-sans text-sm hover:underline"
                  >
                    View all {brandWatches.length} →
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {brandWatches.slice(0, 3).map((watch, index) => (
                    <WatchCard key={watch.id} watch={watch} index={index} />
                  ))}
                </div>
              </section>
            ))}

            {Object.keys(watchesByBrand).length === 0 && (
              <div className="text-center py-20">
                <p className="text-luxury-muted font-sans">
                  No watches found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-gold-500 font-sans text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
