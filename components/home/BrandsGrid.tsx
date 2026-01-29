'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface Brand {
  name: string;
  count: number;
}

interface BrandsGridProps {
  brands: Brand[];
}

// Popular luxury watch brands (always shown)
const popularBrands = [
  'Rolex',
  'Patek Philippe', 
  'Audemars Piguet',
  'Omega',
  'Cartier',
  'Richard Mille',
  'Hublot',
  'IWC',
  'Breitling',
  'Tag Heuer',
  'Panerai',
  'Vacheron Constantin',
];

// Brand styling
const getBrandStyle = (name: string) => {
  const styles: Record<string, string> = {
    'Rolex': 'border-green-600/30 hover:border-green-500 hover:bg-green-950/30',
    'Patek Philippe': 'border-amber-600/30 hover:border-amber-500 hover:bg-amber-950/30',
    'Audemars Piguet': 'border-slate-500/30 hover:border-slate-400 hover:bg-slate-900/30',
    'Omega': 'border-red-600/30 hover:border-red-500 hover:bg-red-950/30',
    'Cartier': 'border-rose-600/30 hover:border-rose-500 hover:bg-rose-950/30',
    'Richard Mille': 'border-orange-600/30 hover:border-orange-500 hover:bg-orange-950/30',
    'Hublot': 'border-gray-500/30 hover:border-gray-400 hover:bg-gray-900/30',
    'IWC': 'border-blue-600/30 hover:border-blue-500 hover:bg-blue-950/30',
    'Breitling': 'border-yellow-600/30 hover:border-yellow-500 hover:bg-yellow-950/30',
    'Tag Heuer': 'border-red-500/30 hover:border-red-400 hover:bg-red-950/30',
    'Panerai': 'border-brown-600/30 hover:border-amber-600 hover:bg-amber-950/30',
    'Vacheron Constantin': 'border-blue-400/30 hover:border-blue-300 hover:bg-blue-950/30',
  };
  return styles[name] || 'border-gold-500/30 hover:border-gold-500 hover:bg-gold-950/30';
};

export default function BrandsGrid({ brands }: BrandsGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Merge popular brands with dynamic brands from products
  const allBrands = popularBrands.map(name => {
    const found = brands.find(b => b.name.toLowerCase() === name.toLowerCase());
    return { name, count: found?.count || 0 };
  });

  // Add any brands from products that aren't in popular list
  brands.forEach(brand => {
    if (!popularBrands.some(p => p.toLowerCase() === brand.name.toLowerCase())) {
      allBrands.push(brand);
    }
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-luxury-black/90 border border-luxury-gray/30 flex items-center justify-center hover:border-gold-500/50 transition-colors"
        >
          <ChevronLeft size={20} className="text-luxury-light" />
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-luxury-black/90 border border-luxury-gray/30 flex items-center justify-center hover:border-gold-500/50 transition-colors"
        >
          <ChevronRight size={20} className="text-luxury-light" />
        </button>
      )}

      {/* Gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-luxury-dark/80 to-transparent z-[5] pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-luxury-dark/80 to-transparent z-[5] pointer-events-none" />

      {/* Scrollable Brand List */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allBrands.map((brand, index) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Link
              href={`/watches?brand=${encodeURIComponent(brand.name)}`}
              className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 border rounded-full transition-all duration-300 group ${getBrandStyle(brand.name)}`}
            >
              {/* Brand Initial Circle */}
              <div className="w-8 h-8 rounded-full bg-luxury-black/80 border border-luxury-gray/50 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                <span className="text-sm font-serif text-gold-500">
                  {brand.name.charAt(0)}
                </span>
              </div>
              
              {/* Brand Name & Count */}
              <div className="pr-2">
                <p className="font-sans text-sm text-luxury-light group-hover:text-white whitespace-nowrap transition-colors">
                  {brand.name}
                </p>
                <p className="font-sans text-[10px] text-luxury-muted">
                  {brand.count} {brand.count === 1 ? 'watch' : 'watches'}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
