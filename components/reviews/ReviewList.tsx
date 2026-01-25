'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  verified_purchase: boolean;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 text-luxury-muted font-sans">
        <p>No reviews yet. Be the first to review this watch!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-luxury-gray/30">
        <div className="text-center">
          <p className="text-4xl font-serif text-gold-500">{averageRating.toFixed(1)}</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  star <= Math.round(averageRating)
                    ? 'fill-gold-500 text-gold-500'
                    : 'text-luxury-gray'
                }`}
              />
            ))}
          </div>
          <p className="text-luxury-muted font-sans text-sm mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="pb-6 border-b border-luxury-gray/20 last:border-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-sans font-medium">{review.name}</p>
                  {review.verified_purchase && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-sans uppercase tracking-wide">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={`${
                        star <= review.rating
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-luxury-gray'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-luxury-muted font-sans text-xs">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <p className="text-luxury-light font-sans text-sm leading-relaxed">
              {review.review}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
