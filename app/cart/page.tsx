'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, Shield } from 'lucide-react';
import { useCartStore, formatPrice } from '@/lib/cart';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-luxury-gray rounded w-48 mb-8" />
            <div className="h-64 bg-luxury-gray rounded" />
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total();
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping for luxury items
  const tax = Math.round(subtotal * 0.08); // Example 8% tax
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-light mb-4">Shopping Cart</h1>
          {items.length > 0 && (
            <p className="text-luxury-muted font-sans text-sm">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty cart */
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-luxury-gray mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-light mb-4">Your cart is empty</h2>
            <p className="text-luxury-muted font-sans mb-8">
              Discover our exceptional collection of luxury timepieces.
            </p>
            <Link href="/watches" className="btn-solid">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.watch_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-6 py-8 border-b border-luxury-gray/30"
                  >
                    {/* Image */}
                    <Link href={`/watches/${item.watch_id}`}>
                      <div className="w-32 h-32 bg-luxury-gray/30 flex-shrink-0">
                        <img
                          src={item.watch.images?.[0] || '/placeholder-watch.jpg'}
                          alt={item.watch.name}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1">
                      <Link href={`/watches/${item.watch_id}`}>
                        <p className="text-luxury-muted font-sans text-[10px] tracking-extra-wide uppercase mb-1">
                          {item.watch.collection || item.watch.brand}
                        </p>
                        <h3 className="text-xl font-serif font-light mb-2 hover:text-gold-500 transition-colors">
                          {item.watch.name}
                        </h3>
                      </Link>
                      
                      <p className="text-gold-500 text-lg font-serif mb-4">
                        {formatPrice(item.watch.price, item.watch.currency)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-luxury-gray/50">
                          <button
                            onClick={() => updateQuantity(item.watch_id, item.quantity - 1)}
                            className="p-2 hover:bg-luxury-gray/30 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 font-sans text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.watch_id, item.quantity + 1)}
                            className="p-2 hover:bg-luxury-gray/30 transition-colors"
                            disabled={item.quantity >= item.watch.stock}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.watch_id)}
                          className="text-luxury-muted hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <p className="text-luxury-white font-serif text-lg">
                        {formatPrice(item.watch.price * item.quantity, item.watch.currency)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={clearCart}
                className="mt-6 text-luxury-muted font-sans text-sm hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-8 sticky top-32">
                <h3 className="text-xl font-serif font-light mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-luxury-light font-sans text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-light font-sans text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-light font-sans text-sm">
                    <span>Estimated Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4 border-t border-luxury-gray/30 mb-6">
                  <span className="text-lg font-serif">Total</span>
                  <span className="text-xl font-serif text-gold-500">
                    {formatPrice(orderTotal)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-gold-500 text-luxury-black font-sans text-sm tracking-extra-wide uppercase text-center hover:bg-gold-400 transition-colors mb-6"
                >
                  Proceed to Checkout
                </Link>

                {/* Escrow notice */}
                <div className="flex items-start gap-3 p-4 bg-luxury-dark/50 border border-gold-500/20">
                  <Shield className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-luxury-white font-sans text-sm mb-1">
                      Escrow Protected
                    </p>
                    <p className="text-luxury-muted font-sans text-xs leading-relaxed">
                      Your payment is held securely until you confirm receipt and satisfaction with your purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
