'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Watch } from '@/types';
import { formatPrice } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';

interface WatchCardProps {
  watch: Watch;
  index?: number;
}

export default function WatchCard({ watch, index = 0 }: WatchCardProps) {
  const isSoldOut = watch.sold_out || watch.stock === 0;
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = watch.images?.length ? watch.images : ['/placeholder-watch.jpg'];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    checkWishlistStatus();
  }, [watch.id]);

  // Image cycling on hover
  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, hasMultipleImages, images.length]);

  const checkWishlistStatus = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setIsLoggedIn(false);
      return;
    }
    
    setIsLoggedIn(true);
    
    const { data } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('watch_id', watch.id)
      .single();
    
    setIsInWishlist(!!data);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      window.location.href = '/account/login?redirect=/watches';
      return;
    }
    
    if (isInWishlist) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', session.user.id)
        .eq('watch_id', watch.id);
      setIsInWishlist(false);
    } else {
      await supabase
        .from('wishlists')
        .insert({
          user_id: session.user.id,
          watch_id: watch.id
        });
      setIsInWishlist(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={`/watches/${watch.id}`} className="block h-full">
        <div 
          className="card-luxury group cursor-pointer overflow-hidden h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image container - fixed aspect ratio */}
          <div className="relative aspect-square p-8 bg-gradient-to-b from-luxury-gray/50 to-transparent flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className={`relative w-full h-full ${isSoldOut ? 'opacity-60' : ''}`}
            >
              {/* Image with crossfade animation */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={watch.name}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Image indicators - only show if multiple images */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'bg-gold-500 w-3' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Wishlist Heart - Top Right */}
            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-luxury-black/50 text-white opacity-0 group-hover:opacity-100'
              } ${isInWishlist ? 'opacity-100' : ''}`}
            >
              <Heart 
                size={16} 
                className={isInWishlist ? 'fill-white' : ''} 
              />
            </button>

            {/* Sold Out badge */}
            {isSoldOut && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white font-sans text-[10px] tracking-wider uppercase z-10">
                Sold Out
              </div>
            )}

            {/* Featured badge */}
            {watch.featured && !isSoldOut && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-luxury-black font-sans text-[10px] tracking-wider uppercase">
                Featured
              </div>
            )}
          </div>

          {/* Content - flex grow to fill remaining space */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Brand/Collection - fixed height */}
            <p className="text-luxury-muted font-sans text-[10px] tracking-extra-wide uppercase mb-2 h-4 truncate">
              {watch.collection || watch.brand}
            </p>
            
            {/* Title - fixed height for 2 lines max */}
            <h3 className="text-xl font-serif font-light mb-3 group-hover:text-gold-500 transition-colors duration-300 line-clamp-2 h-14">
              {watch.name}
            </h3>

            {/* Specs preview - fixed height */}
            <div className="flex gap-4 mb-4 h-5">
              {watch.specifications?.case_size && (
                <span className="text-luxury-muted font-sans text-xs">
                  {watch.specifications.case_size}
                </span>
              )}
              {watch.specifications?.case_material && (
                <span className="text-luxury-muted font-sans text-xs border-l border-luxury-gray pl-4 truncate">
                  {watch.specifications.case_material}
                </span>
              )}
            </div>

            {/* Price - pushed to bottom */}
            <div className="flex items-center justify-between mt-auto">
              <p className="text-gold-500 text-xl font-serif font-light">
                {formatPrice(watch.price, watch.currency)}
              </p>
              {isSoldOut && (
                <span className="text-red-500 font-sans text-xs uppercase tracking-wide">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}