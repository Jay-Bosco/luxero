'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Shield, Truck, Award, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Watch } from '@/types';
import { useCartStore, formatPrice } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';
import WatchCard from './WatchCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';

interface WatchDetailsProps {
  watch: Watch;
  relatedWatches: Watch[];
}

export default function WatchDetails({ watch, relatedWatches }: WatchDetailsProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  
  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const isSoldOut = watch.sold_out || watch.stock === 0;

  useEffect(() => {
    fetch(`/api/reviews?watch_id=${watch.id}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(err => console.error('Failed to load reviews:', err));
    
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

  const toggleWishlist = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/account/login?redirect=/watches/' + watch.id);
      return;
    }
    
    setWishlistLoading(true);
    
    if (isInWishlist) {
      // Remove from wishlist
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', session.user.id)
        .eq('watch_id', watch.id);
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      await supabase
        .from('wishlists')
        .insert({
          user_id: session.user.id,
          watch_id: watch.id
        });
      setIsInWishlist(true);
    }
    
    setWishlistLoading(false);
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addItem(watch);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    addItem(watch);
    router.push('/checkout');
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && watch.images && selectedImage < watch.images.length - 1) {
      setSelectedImage(prev => prev + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(prev => prev - 1);
    }
  };

  const nextImage = () => {
    if (watch.images && selectedImage < watch.images.length - 1) {
      setSelectedImage(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(prev => prev - 1);
    }
  };

  const specs = watch.specifications || {};

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
        <nav className="flex items-center gap-3 text-luxury-muted font-sans text-xs tracking-wide">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/watches" className="hover:text-gold-500 transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-luxury-light">{watch.name}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            {/* Main image with swipe support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-gradient-to-br from-luxury-gray/50 to-luxury-dark/50 mb-6 overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Wishlist Heart Icon - Top Right */}
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isInWishlist
                    ? 'bg-red-500 text-white'
                    : 'bg-luxury-black/50 text-white hover:bg-luxury-black/80'
                }`}
              >
                <Heart 
                  size={20} 
                  className={isInWishlist ? 'fill-white' : ''} 
                />
              </button>

              {/* Sold Out Badge */}
              {isSoldOut && (
                <div className="absolute top-4 left-4 z-30 bg-red-600 text-white px-4 py-2 font-sans text-sm uppercase tracking-wide">
                  Sold Out
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center p-12"
                >
                  <img
                    src={watch.images?.[selectedImage] || '/placeholder-watch.jpg'}
                    alt={watch.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Navigation arrows */}
              {watch.images && watch.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-luxury-black/50 hover:bg-luxury-black/80 flex items-center justify-center transition-all ${
                      selectedImage === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
                    }`}
                    disabled={selectedImage === 0}
                  >
                    <ChevronLeft className="text-white" size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-luxury-black/50 hover:bg-luxury-black/80 flex items-center justify-center transition-all ${
                      selectedImage === watch.images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
                    }`}
                    disabled={selectedImage === watch.images.length - 1}
                  >
                    <ChevronRight className="text-white" size={24} />
                  </button>
                </>
              )}

              {/* Image counter for mobile */}
              {watch.images && watch.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {watch.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === index ? 'bg-gold-500 w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Thumbnail gallery */}
            {watch.images && watch.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {watch.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 flex-shrink-0 border transition-colors ${
                      selectedImage === index
                        ? 'border-gold-500'
                        : 'border-luxury-gray hover:border-gold-500/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${watch.name} view ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
                {watch.collection || watch.brand}
              </p>

              <h1 className="text-4xl lg:text-5xl font-serif font-light mb-4">
                {watch.name}
              </h1>

              {watch.model && (
                <p className="text-luxury-muted font-sans text-sm mb-4">
                  Model: {watch.model}
                </p>
              )}

              <p className="text-gold-500 text-3xl font-serif font-light mb-8">
                {formatPrice(watch.price, watch.currency)}
              </p>

              <p className="text-luxury-light font-sans leading-relaxed mb-10">
                {watch.description}
              </p>

              {/* Add to cart */}
              <div className="flex gap-4 mb-10">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={!isSoldOut ? { scale: 1.02 } : {}}
                  whileTap={!isSoldOut ? { scale: 0.98 } : {}}
                  className={`flex-1 py-4 font-sans text-sm tracking-extra-wide uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                    isSoldOut
                      ? 'bg-luxury-gray/50 text-luxury-muted cursor-not-allowed'
                      : addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-gold-500 text-luxury-black hover:bg-gold-400'
                  }`}
                  disabled={isSoldOut}
                >
                  <ShoppingBag size={18} />
                  {isSoldOut ? 'Sold Out' : addedToCart ? 'Added to Cart' : 'Add to Cart'}
                </motion.button>

                {!isSoldOut && (
                  <button
                    onClick={handleBuyNow}
                    className="px-8 py-4 border border-gold-500 text-gold-500 font-sans text-sm tracking-extra-wide uppercase hover:bg-gold-500 hover:text-luxury-black transition-all duration-300"
                  >
                    Buy Now
                  </button>
                )}
              </div>

              {/* Stock indicator */}
              {!isSoldOut && watch.stock > 0 && watch.stock <= 5 && (
                <p className="text-gold-500 font-sans text-sm mb-8">
                  Only {watch.stock} left in stock
                </p>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 py-8 border-t border-b border-luxury-gray/30 mb-10">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-luxury-muted font-sans text-[10px] tracking-wide uppercase">
                    Escrow Protected
                  </p>
                </div>
                <div className="text-center">
                  <Award className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-luxury-muted font-sans text-[10px] tracking-wide uppercase">
                    Authenticity Cert
                  </p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                  <p className="text-luxury-muted font-sans text-[10px] tracking-wide uppercase">
                    Insured Shipping
                  </p>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-serif font-light mb-6">Specifications</h3>
                <dl className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Case Size', value: specs.case_size },
                    { label: 'Case Material', value: specs.case_material },
                    { label: 'Movement', value: specs.movement },
                    { label: 'Water Resistance', value: specs.water_resistance },
                    { label: 'Power Reserve', value: specs.power_reserve },
                    { label: 'Dial Color', value: specs.dial_color },
                    { label: 'Strap', value: specs.strap_material },
                    { label: 'Reference', value: specs.reference_number },
                  ].filter(spec => spec.value).map((spec) => (
                    <div key={spec.label} className="py-3 border-b border-luxury-gray/20">
                      <dt className="text-luxury-muted font-sans text-xs tracking-wide uppercase mb-1">
                        {spec.label}
                      </dt>
                      <dd className="text-luxury-white font-sans text-sm">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-8">
              <h2 className="text-2xl font-serif font-light">Customer Reviews</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-12">
              <ReviewForm watchId={watch.id} watchName={watch.name} />
            </div>
          )}

          <ReviewList reviews={reviews} />
        </section>

        {/* Related watches */}
        {relatedWatches.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-8 mb-10">
              <h2 className="text-2xl font-serif font-light">From the Same Collection</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedWatches.map((relatedWatch, index) => (
                <WatchCard key={relatedWatch.id} watch={relatedWatch} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
