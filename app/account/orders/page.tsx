'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/cart';
import Link from 'next/link';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: string;
  escrow_status: string;
  tracking_number: string;
  created_at: string;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending Payment' },
  paid: { icon: CheckCircle, color: 'text-blue-500', label: 'Payment Received' },
  processing: { icon: Package, color: 'text-blue-500', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', label: 'Shipped' },
  delivered: { icon: Package, color: 'text-green-500', label: 'Delivered' },
  completed: { icon: CheckCircle, color: 'text-green-500', label: 'Completed' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
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
      <h2 className="text-2xl font-serif font-light mb-6">Your Orders</h2>

      {orders.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <Package className="w-16 h-16 text-luxury-gray mx-auto mb-6" />
          <h3 className="text-xl font-serif font-light mb-4">No Orders Yet</h3>
          <p className="text-luxury-muted font-sans mb-8">
            Your order history will appear here once you make a purchase.
          </p>
          <Link href="/watches" className="btn-solid">
            Browse Watches
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-luxury overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-luxury-dark/30 transition-colors"
                >
                  <div className="flex items-center gap-6 text-left">
                    <div>
                      <p className="font-mono text-sm text-luxury-muted mb-1">
                        {order.id.slice(0, 8)}...
                      </p>
                      <p className="text-gold-500 font-serif text-lg">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${status.color}`}>
                      <StatusIcon size={18} />
                      <span className="font-sans text-sm">{status.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-luxury-muted transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-luxury-gray/30"
                    >
                      <div className="p-6">
                        {/* Items */}
                        <div className="mb-6">
                          <h4 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-4">
                            Items
                          </h4>
                          <div className="space-y-3">
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-luxury-gray/30">
                                  {item.watch_image && (
                                    <img src={item.watch_image} alt="" className="w-full h-full object-contain p-1" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-sans text-sm">{item.watch_name}</p>
                                  <p className="text-luxury-muted font-sans text-xs">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="text-gold-500 font-serif">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking */}
                        {order.tracking_number && (
                          <div className="mb-6">
                            <h4 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-2">
                              Tracking Number
                            </h4>
                            <p className="font-mono text-luxury-light">{order.tracking_number}</p>
                          </div>
                        )}

                        {/* Order Date */}
                        <div>
                          <h4 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-2">
                            Order Date
                          </h4>
                          <p className="font-sans text-sm text-luxury-light">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
