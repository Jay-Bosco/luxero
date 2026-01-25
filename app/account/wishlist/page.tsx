'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, useCartStore } from '@/lib/cart';

interface WishlistItem {
  id: string;
  watch_id: string;
  watches: {
    id: string;
    name: string;
    brand: string;
    price: number;
    currency: string;
    images: string[];
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { data } = await supabase
      .from('wishlists')
      .select('*, watches(*)')
      .eq('user_id', session.user.id);

    setItems(data || []);
    setLoading(false);
  };

  const removeFromWishlist = async (wishlistId: string) => {
    const supabase = createClient();
    await supabase
      .from('wishlists')
      .delete()
      .eq('id', wishlistId);
    
    setItems(items.filter(item => item.id !== wishlistId));
  };

  const handleAddToCart = (item: WishlistItem) => {
  addToCart({
    id: item.watches.id,
    name: item.watches.name,
    brand: item.watches.brand,
    price: item.watches.price,
    currency: item.watches.currency,
    images: item.watches.images,
  } as any);
};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-light mb-6">Your Wishlist</h2>

      {items.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <Heart className="w-16 h-16 text-luxury-gray mx-auto mb-6" />
          <h3 className="text-xl font-serif font-light mb-4">Your Wishlist is Empty</h3>
          <p className="text-luxury-muted font-sans mb-8">
            Save your favorite timepieces here for later.
          </p>
          <Link href="/watches" className="btn-solid">
            Browse Watches
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-luxury p-6"
            >
              <div className="flex items-center gap-6">
                {/* Image */}
                <Link href={`/watches/${item.watch_id}`} className="w-24 h-24 bg-luxury-gray/30 flex-shrink-0">
                  {item.watches.images?.[0] && (
                    <img 
                      src={item.watches.images[0]} 
                      alt={item.watches.name}
                      className="w-full h-full object-contain p-2"
                    />
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1">
                  <Link href={`/watches/${item.watch_id}`} className="hover:text-gold-500 transition-colors">
                    <p className="text-luxury-muted font-sans text-xs tracking-wide uppercase mb-1">
                      {item.watches.brand}
                    </p>
                    <h3 className="font-serif text-lg mb-2">{item.watches.name}</h3>
                  </Link>
                  <p className="text-gold-500 font-serif text-lg">
                    {formatPrice(item.watches.price, item.watches.currency)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-3 text-luxury-muted hover:text-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
