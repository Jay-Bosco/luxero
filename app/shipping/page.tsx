'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Building2,
  Plane,
  PackageCheck,
  Home
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface TrackingEvent {
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface Order {
  id: string;
  status: string;
  tracking_number: string;
  tracking_history: TrackingEvent[];
  created_at: string;
}

const trackingIcons: Record<string, any> = {
  'order_confirmed': CheckCircle,
  'preparing': Package,
  'quality_check': PackageCheck,
  'dispatched': Building2,
  'in_transit': Truck,
  'arrived_country': Plane,
  'customs': Building2,
  'out_for_delivery': Truck,
  'delivered': Home,
};

const trackingLabels: Record<string, string> = {
  'order_confirmed': 'Order Confirmed',
  'preparing': 'Preparing Order',
  'quality_check': 'Quality Check',
  'dispatched': 'Dispatched from Warehouse',
  'in_transit': 'In Transit',
  'arrived_country': 'Arrived in Destination Country',
  'customs': 'Customs Clearance',
  'out_for_delivery': 'Out for Delivery',
  'delivered': 'Delivered',
};

const statusLabels: Record<string, string> = {
  'awaiting_payment': 'Awaiting Payment',
  'payment_received': 'Payment Received',
  'processing': 'Processing',
  'shipped': 'Shipped',
  'completed': 'Delivered'
};

export default function ShippingPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    const supabase = createClient();
    
    // Search by partial ID (first 8 characters)
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, tracking_number, tracking_history, created_at')
      .ilike('id', `${orderId.trim()}%`)
      .single();

    if (fetchError || !data) {
      setError('Order not found. Please check your order ID.');
      setLoading(false);
      return;
    }

    setOrder(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-serif font-light mb-4">Track Your Order</h1>
          <p className="text-luxury-muted font-sans max-w-2xl mx-auto">
            Enter your order ID to track your shipment in real-time.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-luxury p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label-luxury">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g., A1B2C3D4"
                className="input-luxury uppercase"
                onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
              />
              <p className="text-luxury-muted font-sans text-xs mt-2">
                Find your order ID in your confirmation email or account orders page
              </p>
            </div>
            <div className="flex items-end">
              <button
                onClick={trackOrder}
                disabled={loading}
                className="btn-solid w-full md:w-auto flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    Track Order
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 font-sans text-sm mt-4">{error}</p>
          )}
        </motion.div>

        {/* Order Result */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-luxury overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-luxury-gray/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide mb-1">Order ID</p>
                  <p className="font-mono text-gold-500 text-xl">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide mb-1">Status</p>
                  <p className="text-gold-500 font-sans font-medium">
                    {statusLabels[order.status] || order.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Number */}
            {order.tracking_number && (
              <div className="p-6 bg-cyan-500/10 border-b border-cyan-500/30">
                <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide mb-1">Tracking Number</p>
                <p className="font-mono text-cyan-400 text-lg">{order.tracking_number}</p>
              </div>
            )}

            {/* Tracking Timeline */}
            {order.tracking_history && order.tracking_history.length > 0 ? (
              <div className="p-6">
                <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
                  <MapPin size={18} className="text-gold-500" />
                  Shipping Updates
                </h3>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-cyan-500/30" />
                  
                  <div className="space-y-6">
                    {order.tracking_history.slice().reverse().map((event, idx) => {
                      const Icon = trackingIcons[event.status] || Package;
                      const isLatest = idx === 0;
                      
                      return (
                        <div key={idx} className="relative flex gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                            isLatest 
                              ? 'bg-cyan-500 text-luxury-black' 
                              : 'bg-luxury-dark border-2 border-cyan-500/30 text-cyan-400'
                          }`}>
                            <Icon size={18} />
                          </div>
                          
                          <div className={`flex-1 ${isLatest ? 'bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg' : 'pb-2'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <p className={`font-sans font-medium ${isLatest ? 'text-cyan-400' : 'text-luxury-light'}`}>
                                {trackingLabels[event.status] || event.status}
                              </p>
                              {isLatest && (
                                <span className="px-2 py-0.5 bg-cyan-500 text-luxury-black font-sans text-[10px] uppercase">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-luxury-muted font-sans text-sm flex items-center gap-1 mt-1">
                              <MapPin size={12} />
                              {event.location}
                            </p>
                            <p className="text-luxury-muted font-sans text-sm mt-1">
                              {event.description}
                            </p>
                            <p className="text-luxury-muted/60 font-sans text-xs mt-2">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Truck className="w-12 h-12 text-luxury-gray mx-auto mb-4" />
                <p className="text-luxury-muted font-sans">
                  {order.status === 'awaiting_payment' 
                    ? 'Tracking will be available after payment is confirmed.'
                    : 'Tracking updates will appear here once your order ships.'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-luxury-muted font-sans text-sm mb-4">
            Have questions about your order?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/account/orders" className="btn-primary">
              View My Orders
            </Link>
            <Link href="/contact" className="btn-primary">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}