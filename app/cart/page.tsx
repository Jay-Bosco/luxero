'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield } from 'lucide-react';
import { useCartStore, formatPrice } from '@/lib/cart';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const total = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag className="w-20 h-20 text-luxury-gray mx-auto mb-6" />
            <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
            <p className="text-luxury-muted font-sans mb-8">
              Discover our exceptional collection of luxury timepieces.
            </p>
            <Link href="/watches" className="btn-solid">
              Browse Watches
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-serif font-light mb-10">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.watch_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card-luxury p-4 lg:p-6"
                  >
                    <div className="flex gap-4 lg:gap-6">
                      {/* Image */}
                      <div className="w-24 h-24 lg:w-32 lg:h-32 bg-luxury-gray/20 flex-shrink-0">
                        {item.watch.images?.[0] && (
                          <img
                            src={item.watch.images[0]}
                            alt={item.watch.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/watches/${item.watch_id}`}
                          className="font-serif text-lg hover:text-gold-500 transition-colors"
                        >
                          {item.watch.name}
                        </Link>
                        <p className="text-luxury-muted font-sans text-sm mb-2">
                          {item.watch.brand}
                        </p>
                        <p className="text-gold-500 font-serif text-xl">
                          {formatPrice(item.watch.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-luxury-gray/30">
                            <button
                              onClick={() => updateQuantity(item.watch_id, item.quantity - 1)}
                              className="p-2 hover:bg-luxury-gray/20 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 font-sans">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.watch_id, item.quantity + 1)}
                              className="p-2 hover:bg-luxury-gray/20 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.watch_id)}
                            className="text-red-500 hover:text-red-400 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Line Total (Desktop) */}
                      <div className="hidden lg:block text-right">
                        <p className="text-luxury-muted font-sans text-sm">Subtotal</p>
                        <p className="text-gold-500 font-serif text-xl">
                          {formatPrice(item.watch.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-luxury-muted font-sans text-sm hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-6 sticky top-32">
                <h2 className="text-xl font-serif mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-luxury-muted">Subtotal ({items.length} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-luxury-muted">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-luxury-muted">Insurance</span>
                    <span className="text-green-500">Included</span>
                  </div>
                </div>

                <div className="border-t border-luxury-gray/20 pt-4 mb-6">
                  <div className="flex justify-between font-serif text-xl">
                    <span>Total</span>
                    <span className="text-gold-500">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-solid w-full flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-luxury-gray/20 space-y-3">
                  <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs">
                    <Shield size={14} className="text-gold-500" />
                    <span>Escrow protection on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs">
                    <Shield size={14} className="text-gold-500" />
                    <span>100% authentic guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
