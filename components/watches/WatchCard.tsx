'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Watch } from '@/types';
import { formatPrice } from '@/lib/cart';

interface WatchCardProps {
  watch: Watch;
  index?: number;
}

export default function WatchCard({ watch, index = 0 }: WatchCardProps) {
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
              className="relative w-full h-full"
            >
              <img
                src={watch.images?.[0] || '/placeholder-watch.jpg'}
                alt={watch.name}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </motion.div>

            {/* Featured badge */}
            {watch.featured && (
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

            <p className="text-gold-500 text-xl font-serif font-light">
              {formatPrice(watch.price, watch.currency)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
