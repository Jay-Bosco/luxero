'use client';

import { motion } from 'framer-motion';
import { Star, Users, Clock, Shield } from 'lucide-react';

interface StoreRatingProps {
  settings: {
    store_rating: number;
    total_reviews: number;
    total_customers: number;
    years_in_business: number;
  };
}

export default function StoreRating({ settings }: StoreRatingProps) {
  return (
    <section className="py-16 px-6 lg:px-12 bg-gradient-to-b from-luxury-black to-luxury-dark/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star, index) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Star
                  size={32}
                  className={`${
                    star <= Math.round(settings.store_rating)
                      ? 'text-gold-500 fill-gold-500'
                      : star <= settings.store_rating + 0.5
                      ? 'text-gold-500 fill-gold-500/50'
                      : 'text-luxury-gray'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Rating Number */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-serif text-gold-500 mb-2"
          >
            {settings.store_rating.toFixed(1)}
          </motion.p>

          {/* Reviews Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-luxury-muted font-sans text-sm mb-8"
          >
            Based on {settings.total_reviews.toLocaleString()}+ verified reviews
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            <div className="flex items-center gap-2 text-luxury-light">
              <Users size={18} className="text-gold-500" />
              <span className="font-sans text-sm">
                <span className="font-medium">{settings.total_customers.toLocaleString()}+</span> Happy Customers
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-luxury-light">
              <Clock size={18} className="text-gold-500" />
              <span className="font-sans text-sm">
                <span className="font-medium">{settings.years_in_business}+</span> Years Experience
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-luxury-light">
              <Shield size={18} className="text-gold-500" />
              <span className="font-sans text-sm">
                <span className="font-medium">100%</span> Secure Transactions
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
