'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  watchId: string;
  watchName: string;
}

export default function ReviewForm({ watchId, watchName }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    review: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watch_id: watchId,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-luxury p-8 text-center"
      >
        <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-luxury-black" />
        </div>
        <h3 className="text-xl font-serif font-light mb-2">Thank You!</h3>
        <p className="text-luxury-muted font-sans text-sm">
          Your review has been submitted and is pending approval.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="card-luxury p-8">
      <h3 className="text-xl font-serif font-light mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="label-luxury">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`${
                    star <= formData.rating
                      ? 'fill-gold-500 text-gold-500'
                      : 'text-luxury-gray'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label-luxury">Your Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-luxury"
              required
            />
          </div>
          <div>
            <label className="label-luxury">Your Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-luxury"
              required
            />
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="label-luxury">Your Review *</label>
          <textarea
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            className="input-luxury min-h-[120px] resize-none"
            placeholder={`Share your experience with the ${watchName}...`}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 font-sans text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-solid flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
          ) : (
            <>
              <Send size={16} />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}
