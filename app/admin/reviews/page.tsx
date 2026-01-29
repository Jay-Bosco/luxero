'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Star, 
  Check, 
  X,
  MessageSquare,
  User
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Review {
  id: string;
  watch_id: string;
  watch_name: string;
  author_name: string;
  rating: number;
  title: string;
  content: string;
  approved: boolean;
  created_at: string;
}

interface Watch {
  id: string;
  name: string;
  brand: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [watches, setWatches] = useState<Watch[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  const [formData, setFormData] = useState({
    watch_id: '',
    author_name: '',
    rating: 5,
    title: '',
    content: ''
  });

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

    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const supabase = createClient();
    
    const [reviewsRes, watchesRes] = await Promise.all([
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('watches').select('id, name, brand').eq('active', true)
    ]);

    setReviews(reviewsRes.data || []);
    setWatches(watchesRes.data || []);
  };

  const handleAddReview = async () => {
    if (!formData.watch_id || !formData.author_name || !formData.content) return;
    
    setSaving(true);
    const supabase = createClient();

    const selectedWatch = watches.find(w => w.id === formData.watch_id);

    const { error } = await supabase.from('reviews').insert({
      watch_id: formData.watch_id,
      watch_name: selectedWatch?.name || '',
      author_name: formData.author_name,
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      approved: true // Admin reviews are auto-approved
    });

    if (!error) {
      await loadData();
      setShowAddModal(false);
      setFormData({ watch_id: '', author_name: '', rating: 5, title: '', content: '' });
    }
    
    setSaving(false);
  };

  const handleApprove = async (reviewId: string) => {
    const supabase = createClient();
    await supabase.from('reviews').update({ approved: true }).eq('id', reviewId);
    await loadData();
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    const supabase = createClient();
    await supabase.from('reviews').delete().eq('id', reviewId);
    await loadData();
  };

  const filteredReviews = activeTab === 'pending' 
    ? reviews.filter(r => !r.approved)
    : reviews;

  const pendingCount = reviews.filter(r => !r.approved).length;

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
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-solid flex items-center gap-2"
          >
            <Plus size={18} />
            Add Review
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info */}
        <div className="bg-gold-500/10 border border-gold-500/30 p-4 mb-8">
          <p className="text-gold-500 font-sans text-sm">
            💡 Add reviews to build social proof. Reviews you add will appear as regular customer reviews.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-sans text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-gold-500 text-luxury-black'
                : 'border border-luxury-gray/30 text-luxury-muted hover:border-gold-500/50'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-sans text-sm transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-gold-500 text-luxury-black'
                : 'border border-luxury-gray/30 text-luxury-muted hover:border-gold-500/50'
            }`}
          >
            Pending Approval
            {pendingCount > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="card-luxury p-12 text-center">
              <MessageSquare className="w-12 h-12 text-luxury-gray mx-auto mb-4" />
              <p className="text-luxury-muted font-sans">
                {activeTab === 'pending' ? 'No pending reviews' : 'No reviews yet. Add some to get started!'}
              </p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className="card-luxury p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= review.rating ? 'text-gold-500 fill-gold-500' : 'text-luxury-gray'}
                          />
                        ))}
                      </div>
                      <span className="text-luxury-muted font-sans text-xs">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      {!review.approved && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 font-sans text-[10px] uppercase tracking-wide">
                          Pending
                        </span>
                      )}
                    </div>

                    {review.title && (
                      <h3 className="font-serif text-lg mb-1">{review.title}</h3>
                    )}
                    
                    <p className="text-luxury-light font-sans text-sm mb-3">
                      {review.content}
                    </p>

                    <div className="flex items-center gap-4 text-luxury-muted font-sans text-xs">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {review.author_name}
                      </span>
                      <span>on {review.watch_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="p-2 text-green-500 hover:bg-green-500/10 transition-colors"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card-luxury w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-6 border-b border-luxury-gray/30">
                <div>
                  <h2 className="text-xl font-serif">Add Review</h2>
                  <p className="text-luxury-muted font-sans text-xs mt-1">
                    This will appear as a customer review
                  </p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-luxury-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Select Watch */}
                <div>
                  <label className="label-luxury">Product *</label>
                  <select
                    value={formData.watch_id}
                    onChange={(e) => setFormData({ ...formData, watch_id: e.target.value })}
                    className="input-luxury"
                  >
                    <option value="">Select a watch...</option>
                    {watches.map(watch => (
                      <option key={watch.id} value={watch.id}>
                        {watch.brand} - {watch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reviewer Name */}
                <div>
                  <label className="label-luxury">Reviewer Name *</label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="input-luxury"
                    placeholder="e.g., John D., Sarah M., Michael T."
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="label-luxury">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1"
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${
                            star <= formData.rating
                              ? 'text-gold-500 fill-gold-500'
                              : 'text-luxury-gray hover:text-gold-500/50'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="label-luxury">Review Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-luxury"
                    placeholder="e.g., Exceptional quality and service!"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="label-luxury">Review *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input-luxury min-h-[100px] resize-none"
                    placeholder="Write the review content..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 border-t border-luxury-gray/30">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  disabled={saving || !formData.watch_id || !formData.author_name || !formData.content}
                  className="btn-solid flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Review
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
