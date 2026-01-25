'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/cart';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  images: string[];
}

export default function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('luxero_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      
      const supabase = createClient();
      const searchTerm = query.toLowerCase();

      const { data, error } = await supabase
        .from('watches')
        .select('id, name, brand, price, currency, images')
        .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,collection.ilike.%${searchTerm}%`)
        .limit(6);

      if (!error && data) {
        setResults(data);
      }
      
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('luxero_recent_searches', JSON.stringify(updated));

    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('luxero_recent_searches');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-luxury-light hover:text-gold-500 transition-colors"
        aria-label="Search"
      >
        <Search size={20} />
      </button>

      {/* Search Modal/Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 bg-luxury-dark border-b border-luxury-gray/30 z-50 p-6"
            >
              <div className="max-w-3xl mx-auto">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search watches, brands, collections..."
                    className="w-full bg-luxury-black border border-luxury-gray/30 pl-12 pr-12 py-4 text-luxury-white font-sans focus:outline-none focus:border-gold-500/50"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-14 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Results */}
                <div className="mt-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
                    </div>
                  ) : query && results.length > 0 ? (
                    <div>
                      <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide mb-4">
                        Results
                      </p>
                      <div className="space-y-2">
                        {results.map((watch) => (
                          <Link
                            key={watch.id}
                            href={`/watches/${watch.id}`}
                            onClick={() => {
                              setIsOpen(false);
                              setQuery('');
                            }}
                            className="flex items-center gap-4 p-3 hover:bg-luxury-gray/20 transition-colors"
                          >
                            <div className="w-14 h-14 bg-luxury-gray/30 flex-shrink-0">
                              {watch.images?.[0] && (
                                <img
                                  src={watch.images[0]}
                                  alt={watch.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-sm truncate">{watch.name}</p>
                              <p className="text-luxury-muted font-sans text-xs">{watch.brand}</p>
                            </div>
                            <p className="text-gold-500 font-serif text-sm">
                              {formatPrice(watch.price, watch.currency)}
                            </p>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full mt-4 py-3 text-center text-gold-500 font-sans text-sm hover:bg-gold-500/10 transition-colors"
                      >
                        View all results for "{query}"
                      </button>
                    </div>
                  ) : query && results.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-luxury-muted font-sans">
                        No results found for "{query}"
                      </p>
                      <p className="text-luxury-muted/60 font-sans text-sm mt-2">
                        Try searching for a different term
                      </p>
                    </div>
                  ) : recentSearches.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide">
                          Recent Searches
                        </p>
                        <button
                          onClick={clearRecentSearches}
                          className="text-luxury-muted font-sans text-xs hover:text-gold-500"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-4 py-2 bg-luxury-gray/30 text-luxury-light font-sans text-sm hover:bg-gold-500/20 hover:text-gold-500 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-luxury-muted font-sans text-sm">
                        Search for watches by name, brand, or collection
                      </p>
                    </div>
                  )}
                </div>

                {/* Popular Brands */}
                {!query && (
                  <div className="mt-6 pt-6 border-t border-luxury-gray/30">
                    <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide mb-4">
                      Popular Brands
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Cartier'].map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleSearch(brand)}
                          className="px-4 py-2 border border-luxury-gray/30 text-luxury-light font-sans text-sm hover:border-gold-500/50 hover:text-gold-500 transition-colors"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
