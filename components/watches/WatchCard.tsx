'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    checkWishlistStatus();
  }, [watch.id]);

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
    >
      <Link href={`/watches/${watch.id}`}>
        <div className="card-luxury group cursor-pointer overflow-hidden">
          {/* Image container */}
          <div className="relative aspect-square p-8 bg-gradient-to-b from-luxury-gray/50 to-transparent">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className={`relative w-full h-full ${isSoldOut ? 'opacity-60' : ''}`}
            >
              <img
                src={watch.images?.[0] || '/placeholder-watch.jpg'}
                alt={watch.name}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </motion.div>

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

          {/* Content */}
          <div className="p-6">
            <p className="text-luxury-muted font-sans text-[10px] tracking-extra-wide uppercase mb-2">
              {watch.collection || watch.brand}
            </p>
            
            <h3 className="text-xl font-serif font-light mb-3 group-hover:text-gold-500 transition-colors duration-300">
              {watch.name}
            </h3>

            {/* Specs preview */}
            <div className="flex gap-4 mb-4">
              {watch.specifications?.case_size && (
                <span className="text-luxury-muted font-sans text-xs">
                  {watch.specifications.case_size}
                </span>
              )}
              {watch.specifications?.case_material && (
                <span className="text-luxury-muted font-sans text-xs border-l border-luxury-gray pl-4">
                  {watch.specifications.case_material}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
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
