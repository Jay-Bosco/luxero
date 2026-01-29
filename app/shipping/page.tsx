'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Globe, 
  Shield, 
  Clock, 
  Package,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const shippingRates = [
  { region: 'Switzerland', fee: '$15', time: '1-2 days', hub: 'Switzerland' },
  { region: 'Germany, France, Austria, Italy', fee: '$20', time: '2-4 days', hub: 'Switzerland' },
  { region: 'Netherlands, Belgium', fee: '$20', time: '2-4 days', hub: 'Switzerland' },
  { region: 'UK, Spain, Portugal', fee: '$25', time: '3-5 days', hub: 'Switzerland' },
  { region: 'Hong Kong', fee: '$15', time: '1-2 days', hub: 'Hong Kong' },
  { region: 'Singapore, China, Taiwan', fee: '$20', time: '2-4 days', hub: 'Hong Kong' },
  { region: 'Japan, South Korea', fee: '$25', time: '3-5 days', hub: 'Hong Kong' },
  { region: 'Malaysia, Thailand, Indonesia', fee: '$25-30', time: '3-5 days', hub: 'Hong Kong' },
  { region: 'Australia, New Zealand', fee: '$35-40', time: '5-7 days', hub: 'Hong Kong' },
  { region: 'India', fee: '$35', time: '5-7 days', hub: 'Hong Kong' },
  { region: 'UAE, Saudi Arabia, Qatar', fee: '$35', time: '4-6 days', hub: 'Switzerland' },
  { region: 'United States, Canada', fee: '$45', time: '5-7 days', hub: 'Switzerland' },
  { region: 'Nigeria, Ghana, Kenya', fee: '$50', time: '7-10 days', hub: 'Switzerland' },
  { region: 'South Africa', fee: '$45', time: '6-8 days', hub: 'Switzerland' },
];

const statusLabels: Record<string, { label: string; color: string; description: string }> = {
  awaiting_payment: { 
    label: 'Awaiting Payment', 
    color: 'text-yellow-500',
    description: 'We\'re waiting for your payment to be confirmed.'
  },
  payment_received: { 
    label: 'Payment Confirmed', 
    color: 'text-blue-400',
    description: 'Payment received! We\'re preparing your order.'
  },
  processing: { 
    label: 'Processing', 
    color: 'text-purple-400',
    description: 'Your watch is being authenticated and prepared for shipping.'
  },
  shipped: { 
    label: 'Shipped', 
    color: 'text-cyan-400',
    description: 'Your order is on its way!'
  },
  completed: { 
    label: 'Delivered', 
    color: 'text-green-500',
    description: 'Your order has been delivered. Enjoy your timepiece!'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'text-red-500',
    description: 'This order has been cancelled.'
  },
};

export default function ShippingPage() {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setSearching(true);
    setError('');
    setOrderStatus(null);

    const supabase = createClient();
    
    // Search by partial ID (first 8 characters) or full ID
    const searchTerm = orderId.trim().toLowerCase();
    
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('id, status, tracking_number, shipping_info, created_at, items')
      .or(`id.ilike.${searchTerm}%,id.eq.${searchTerm}`)
      .limit(1)
      .single();

    if (fetchError || !data) {
      setError('Order not found. Please check your order ID and try again.');
      setSearching(false);
      return;
    }

    setOrderStatus(data);
    setSearching(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Shipping & Tracking
            </p>
            <h1 className="text-4xl lg:text-5xl font-serif font-light mb-6">
              Global Delivery, Local Care
            </h1>
            <p className="text-luxury-muted font-sans text-lg">
              With fulfillment centers in Switzerland and Hong Kong, we deliver 
              your timepiece quickly and safely, wherever you are in the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Track Order */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-luxury p-8"
          >
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
              <Search className="text-gold-500" size={24} />
              Track Your Order
            </h2>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="Enter Order ID (e.g., A1B2C3D4)"
                className="input-luxury flex-1 uppercase"
                onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
              />
              <button
                onClick={trackOrder}
                disabled={searching}
                className="btn-solid px-6"
              >
                {searching ? 'Searching...' : 'Track'}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 font-sans text-sm mb-4">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {orderStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-luxury-dark/50 p-6 border border-luxury-gray/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-luxury-muted font-sans text-xs">Order ID</p>
                    <p className="text-gold-500 font-mono text-lg">
                      #{orderStatus.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 font-sans text-sm ${statusLabels[orderStatus.status]?.color || 'text-luxury-muted'}`}>
                    {statusLabels[orderStatus.status]?.label || orderStatus.status}
                  </div>
                </div>

                <p className="text-luxury-muted font-sans text-sm mb-4">
                  {statusLabels[orderStatus.status]?.description}
                </p>

                {orderStatus.tracking_number && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="text-cyan-400" size={18} />
                      <span className="text-cyan-400 font-sans text-sm font-medium">Tracking Number</span>
                    </div>
                    <p className="text-luxury-light font-mono text-lg">{orderStatus.tracking_number}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs">
                  <Clock size={14} />
                  Ordered on {new Date(orderStatus.created_at).toLocaleDateString()}
                </div>

                <div className="mt-4 pt-4 border-t border-luxury-gray/30">
                  <Link href="/account/orders" className="text-gold-500 font-sans text-sm hover:underline">
                    View full order details →
                  </Link>
                </div>
              </motion.div>
            )}

            <p className="text-luxury-muted font-sans text-xs mt-4">
              Your Order ID was sent to your email after placing your order.
              You can also find it in your <Link href="/account/orders" className="text-gold-500 hover:underline">account</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Hubs */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-light mb-4">Our Shipping Hubs</h2>
            <p className="text-luxury-muted font-sans">
              Orders are fulfilled from the hub closest to you for faster delivery.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-luxury p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-xl font-serif">Switzerland</h3>
                  <p className="text-gold-500 font-sans text-sm">Europe, Middle East, Americas, Africa</p>
                </div>
              </div>
              <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                Our Swiss headquarters handles orders for Europe, the Middle East, 
                Americas, and Africa. Every watch is authenticated and insured 
                before shipping.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-luxury p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gold-500/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-xl font-serif">Hong Kong</h3>
                  <p className="text-gold-500 font-sans text-sm">Asia Pacific Region</p>
                </div>
              </div>
              <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                Our Hong Kong branch serves the entire Asia Pacific region, 
                providing faster delivery times and competitive shipping rates 
                throughout Asia.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shipping Rates */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-light mb-4">Shipping Rates</h2>
            <p className="text-luxury-muted font-sans">
              All shipments are fully insured. <span className="text-gold-500">First 2 orders ship FREE!</span>
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-luxury-gray/30">
                  <th className="text-left py-4 px-4 font-sans text-xs uppercase tracking-wide text-luxury-muted">Region</th>
                  <th className="text-left py-4 px-4 font-sans text-xs uppercase tracking-wide text-luxury-muted">Shipping Fee</th>
                  <th className="text-left py-4 px-4 font-sans text-xs uppercase tracking-wide text-luxury-muted">Est. Delivery</th>
                  <th className="text-left py-4 px-4 font-sans text-xs uppercase tracking-wide text-luxury-muted">Ships From</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate, index) => (
                  <motion.tr
                    key={rate.region}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    viewport={{ once: true }}
                    className="border-b border-luxury-gray/20 hover:bg-luxury-gray/10 transition-colors"
                  >
                    <td className="py-4 px-4 font-sans text-sm">{rate.region}</td>
                    <td className="py-4 px-4 font-sans text-sm text-gold-500">{rate.fee}</td>
                    <td className="py-4 px-4 font-sans text-sm text-luxury-muted">{rate.time}</td>
                    <td className="py-4 px-4 font-sans text-sm">
                      <span className={`px-2 py-1 text-xs ${rate.hub === 'Hong Kong' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                        {rate.hub}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Shipping Features */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fully Insured',
                description: 'Every shipment is fully insured against loss, theft, or damage during transit.'
              },
              {
                icon: Package,
                title: 'Discreet Packaging',
                description: 'Plain packaging with no indication of contents for security and privacy.'
              },
              {
                icon: CheckCircle,
                title: 'Signature Required',
                description: 'All deliveries require a signature to ensure your watch reaches you safely.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-lg font-serif font-light mb-3">{feature.title}</h3>
                <p className="text-luxury-muted font-sans text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-luxury-muted font-sans mb-6">
            Have questions about shipping? We're here to help.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
