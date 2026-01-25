'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Watch } from '@/types';
import WatchCard from '@/components/watches/WatchCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Available brands from results
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    
    const supabase = createClient();
    const searchTerm = searchQuery.toLowerCase();

    let queryBuilder = supabase
      .from('watches')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,collection.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

    const { data, error } = await queryBuilder;

    if (!error && data) {
      setResults(data);
      
      // Extract unique brands
      const brands = [...new Set(data.map(w => w.brand))].sort();
      setAvailableBrands(brands);
    }
    
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Filter and sort results
  const filteredResults = results
    .filter(watch => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(watch.brand)) {
        return false;
      }
      if (watch.price < priceRange[0] * 100 || watch.price > priceRange[1] * 100) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search watches, brands, collections..."
                className="w-full bg-luxury-dark border border-luxury-gray/30 pl-12 pr-4 py-4 text-luxury-white font-sans focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </form>

          {query && (
            <p className="mt-6 text-luxury-muted font-sans">
              {loading ? (
                'Searching...'
              ) : (
                <>
                  Found <span className="text-gold-500">{filteredResults.length}</span> results for "<span className="text-luxury-light">{query}</span>"
                </>
              )}
            </p>
          )}
        </div>

        {query && !loading && results.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-between p-4 bg-luxury-dark border border-luxury-gray/30 mb-4"
              >
                <span className="flex items-center gap-2 font-sans text-sm">
                  <SlidersHorizontal size={18} />
                  Filters
                </span>
                <span className="text-gold-500 text-sm">
                  {selectedBrands.length > 0 && `(${selectedBrands.length})`}
                </span>
              </button>

              {/* Filters Panel */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
                {/* Sort */}
                <div className="card-luxury p-6">
                  <h3 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-4">
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-gray/30 p-3 text-luxury-light font-sans text-sm focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                {/* Brands */}
                {availableBrands.length > 0 && (
                  <div className="card-luxury p-6">
                    <h3 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-4">
                      Brands
                    </h3>
                    <div className="space-y-2">
                      {availableBrands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 accent-gold-500"
                          />
                          <span className="font-sans text-sm text-luxury-light group-hover:text-gold-500 transition-colors">
                            {brand}
                          </span>
                          <span className="text-luxury-muted font-sans text-xs ml-auto">
                            ({results.filter(w => w.brand === brand).length})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div className="card-luxury p-6">
                  <h3 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-4">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div>
                        <label className="text-luxury-muted font-sans text-xs">Min ($)</label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-full bg-luxury-black border border-luxury-gray/30 p-2 text-luxury-light font-sans text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-luxury-muted font-sans text-xs">Max ($)</label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500000])}
                          className="w-full bg-luxury-black border border-luxury-gray/30 p-2 text-luxury-light font-sans text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 500000) && (
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setPriceRange([0, 500000]);
                    }}
                    className="w-full py-3 text-center text-gold-500 font-sans text-sm hover:bg-gold-500/10 transition-colors border border-gold-500/30"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResults.map((watch, index) => (
                    <WatchCard key={watch.id} watch={watch} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-luxury-muted font-sans">
                    No watches match your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setPriceRange([0, 500000]);
                    }}
                    className="mt-4 text-gold-500 font-sans text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Query State */}
        {!query && !loading && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-luxury-gray mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-light mb-4">Search Our Collection</h2>
            <p className="text-luxury-muted font-sans max-w-md mx-auto">
              Find your perfect timepiece by searching for watch names, brands, or collections.
            </p>
          </div>
        )}

        {/* No Results */}
        {query && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-luxury-gray mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-light mb-4">No Results Found</h2>
            <p className="text-luxury-muted font-sans max-w-md mx-auto mb-8">
              We couldn't find any watches matching "{query}". Try a different search term.
            </p>
            <a href="/watches" className="btn-solid">
              Browse All Watches
            </a>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
