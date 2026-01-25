'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Truck, Package, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/cart';

interface Order {
  id: string;
  user_id: string;
  guest_email: string;
  items: any[];
  total: number;
  status: string;
  escrow_status: string;
  shipping_address: any;
  tracking_number: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

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

    await loadOrders();
    setLoading(false);
  };

  const loadOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const supabase = createClient();
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    await loadOrders();
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    const supabase = createClient();
    await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber, status: 'shipped' })
      .eq('id', orderId);
    await loadOrders();
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    paid: 'bg-blue-500/20 text-blue-400',
    processing: 'bg-purple-500/20 text-purple-400',
    shipped: 'bg-indigo-500/20 text-indigo-400',
    delivered: 'bg-teal-500/20 text-teal-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

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
            <h1 className="text-xl font-serif">Manage Orders</h1>
          </div>
          
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-luxury w-auto"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredOrders.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <p className="text-luxury-muted font-sans">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-luxury overflow-hidden"
              >
                {/* Order header - clickable */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-luxury-dark/30 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-left">
                      <p className="font-mono text-sm mb-1">{order.id.slice(0, 8)}...</p>
                      <p className="text-luxury-muted font-sans text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-sans uppercase tracking-wide ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="text-gold-500 font-serif text-lg">
                      {formatPrice(order.total)}
                    </p>
                    <ChevronDown 
                      className={`w-5 h-5 text-luxury-muted transition-transform ${
                        expandedOrder === order.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-luxury-gray/30 p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Order items */}
                      <div>
                        <h4 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-4">Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-luxury-gray/30">
                                {item.watch_image && (
                                  <img src={item.watch_image} alt="" className="w-full h-full object-contain p-1" />
                                )}
                              </div>
                              <div>
                                <p className="font-sans text-sm">{item.watch_name}</p>
                                <p className="text-luxury-muted font-sans text-xs">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping address */}
                      <div>
                        <h4 className="font-sans text-xs uppercase tracking-wide text-luxury-muted mb-4">Shipping Address</h4>
                        {order.shipping_address ? (
                          <div className="text-luxury-light font-sans text-sm">
                            <p>{order.shipping_address.line1}</p>
                            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                            <p>
                              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                            </p>
                            <p>{order.shipping_address.country}</p>
                          </div>
                        ) : (
                          <p className="text-luxury-muted font-sans text-sm">No address provided</p>
                        )}

                        {order.guest_email && (
                          <p className="mt-4 text-luxury-muted font-sans text-sm">
                            Email: {order.guest_email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t border-luxury-gray/30">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <label className="label-luxury">Update Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="input-luxury w-auto"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex-1">
                          <label className="label-luxury">Tracking Number</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={order.tracking_number || ''}
                              placeholder="Enter tracking number"
                              className="input-luxury"
                              id={`tracking-${order.id}`}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                if (input.value) {
                                  updateTrackingNumber(order.id, input.value);
                                }
                              }}
                              className="btn-primary flex items-center gap-2"
                            >
                              <Truck size={16} />
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
