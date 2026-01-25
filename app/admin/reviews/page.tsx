'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, Star, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Review {
  id: string;
  watch_id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  approved: boolean;
  verified_purchase: boolean;
  created_at: string;
  watches?: { name: string };
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      router.push('/admin/login');
      return;
    }

    await loadReviews();
    setLoading(false);
  };

  const loadReviews = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*, watches(name)')
      .order('created_at', { ascending: false });
    
    setReviews(data || []);
  };

  const handleApprove = async (reviewId: string) => {
    const supabase = createClient();
    await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', reviewId);
    await loadReviews();
  };

  const handleReject = async (reviewId: string) => {
    const supabase = createClient();
    await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    await loadReviews();
  };

  const handleToggleVerified = async (reviewId: string, currentValue: boolean) => {
    const supabase = createClient();
    await supabase
      .from('reviews')
      .update({ verified_purchase: !currentValue })
      .eq('id', reviewId);
    await loadReviews();
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'pending') return !review.approved;
    if (filter === 'approved') return review.approved;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header */}
      <header className="bg-luxury-dark border-b border-luxury-gray/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-luxury-muted hover:text-gold-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-serif">Manage Reviews</h1>
          </div>
          
          {/* Filter tabs */}
          <div className="flex gap-2">
            {['pending', 'approved', 'all'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 font-sans text-sm capitalize transition-colors ${
                  filter === f
                    ? 'bg-gold-500 text-luxury-black'
                    : 'bg-luxury-gray/30 text-luxury-muted hover:text-white'
                }`}
              >
                {f}
                {f === 'pending' && (
                  <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {reviews.filter(r => !r.approved).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredReviews.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <p className="text-luxury-muted font-sans">
              {filter === 'pending' ? 'No pending reviews' : 'No reviews found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-luxury p-6"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <p className="font-sans font-medium">{review.name}</p>
                        <p className="text-luxury-muted font-sans text-sm">{review.email}</p>
                      </div>
                      {review.verified_purchase && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-sans uppercase tracking-wide">
                          Verified Purchase
                        </span>
                      )}
                      {!review.approved && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-sans uppercase tracking-wide">
                          Pending
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= review.rating ? 'fill-gold-500 text-gold-500' : 'text-luxury-gray'}
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-luxury-light font-sans text-sm leading-relaxed mb-3">
                      {review.review}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-luxury-muted font-sans text-xs">
                      <span>
                        Product: <span className="text-gold-500">{review.watches?.name || 'Unknown'}</span>
                      </span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-sans text-sm"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleVerified(review.id, review.verified_purchase)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-sans text-sm"
                    >
                      {review.verified_purchase ? 'Remove Verified' : 'Mark Verified'}
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-sans text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
