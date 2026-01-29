'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle,
  Truck,
  Copy,
  Check,
  Wallet,
  MapPin,
  Plane,
  Building2,
  PackageCheck,
  Home,
  ChevronRight,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TrackingEvent {
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface Order {
  id: string;
  items: Array<{
    name: string;
    brand: string;
    price: number;
    image: string;
  }>;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  usdt_amount: string;
  tracking_number: string;
  tracking_history: TrackingEvent[];
  created_at: string;
}

const statusSteps = [
  { key: 'awaiting_payment', label: 'Awaiting Payment', icon: Clock },
  { key: 'payment_received', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'completed', label: 'Delivered', icon: CheckCircle },
];

const statusMessages: Record<string, string> = {
  'awaiting_payment': 'Please complete your payment to proceed.',
  'payment_received': 'Payment confirmed! We are preparing your order.',
  'processing': 'Your order is being processed and authenticated.',
  'shipped': 'Your order is on its way!',
  'completed': 'Order delivered. Thank you for shopping with us!'
};

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

const USDT_ADDRESS = 'TLGj9ieQF1stTGLrv51reb9wwSFLLTBtuEZ';

export default function MyOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [copied, setCopied] = useState(false);
  const [trackingModal, setTrackingModal] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(USDT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(cents / 100);
  };

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex(s => s.key === status);
    return index >= 0 ? index : 0;
  };

  const getLatestTracking = (history: TrackingEvent[] | undefined) => {
    if (!history || history.length === 0) return null;
    return history[history.length - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <Package className="w-16 h-16 text-luxury-gray mx-auto mb-4" />
            <h2 className="text-xl font-serif mb-2">No orders yet</h2>
            <p className="text-luxury-muted font-sans mb-6">Start shopping to see your orders here</p>
            <Link href="/watches" className="btn-solid">
              Browse Watches
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStatusIndex(order.status);
              const latestTracking = getLatestTracking(order.tracking_history);
              const hasTracking = order.tracking_history && order.tracking_history.length > 0;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-luxury overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 md:p-6 border-b border-luxury-gray/20">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-gold-500 text-lg">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-luxury-muted font-sans text-sm">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-serif text-gold-500">{formatPrice(order.total)}</p>
                        <p className="text-luxury-muted font-sans text-xs">{order.usdt_amount} USDT</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="px-4 md:px-6 py-3 bg-gold-500/10 border-b border-gold-500/20">
                    <p className="text-gold-500 font-sans text-sm">
                      {statusMessages[order.status] || 'Order in progress'}
                    </p>
                  </div>

                  {/* Status Progress - Simplified on Mobile */}
                  <div className="p-4 md:p-6 bg-luxury-dark/30">
                    {/* Mobile: Show current status only */}
                    <div className="md:hidden mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500 text-luxury-black flex items-center justify-center">
                          {(() => {
                            const CurrentIcon = statusSteps[currentStep]?.icon || Package;
                            return <CurrentIcon size={20} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-gold-500 font-sans text-sm font-medium">
                            {statusSteps[currentStep]?.label}
                          </p>
                          <p className="text-luxury-muted font-sans text-xs">
                            Step {currentStep + 1} of 5
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Full progress */}
                    <div className="hidden md:block">
                      <div className="flex items-center justify-between mb-2">
                        {statusSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStep;
                          const isCurrent = idx === currentStep;
                          
                          return (
                            <div key={step.key} className="flex flex-col items-center flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                isCompleted 
                                  ? 'bg-gold-500 text-luxury-black' 
                                  : 'bg-luxury-gray/30 text-luxury-muted'
                              }`}>
                                <step.icon size={16} />
                              </div>
                              <span className={`text-[10px] font-sans text-center ${
                                isCurrent ? 'text-gold-500' : 'text-luxury-muted'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-1 bg-luxury-gray/30 rounded-full mt-2 md:mt-4">
                      <div 
                        className="h-full bg-gold-500 rounded-full transition-all"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Payment Info (if awaiting payment) */}
                  {order.status === 'awaiting_payment' && (
                    <div className="p-4 md:p-6 bg-yellow-500/10 border-t border-yellow-500/30">
                      <div className="flex items-start gap-3">
                        <Wallet className="text-yellow-500 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="text-yellow-500 font-sans text-sm font-medium mb-2">
                            Complete your payment
                          </p>
                          <p className="text-luxury-muted font-sans text-xs mb-3">
                            Send exactly <span className="text-gold-500 font-bold">{order.usdt_amount} USDT</span> (TRC20) to:
                          </p>
                          <div className="flex items-center gap-2 bg-luxury-black/50 p-3 rounded">
                            <code className="text-gold-500 text-xs flex-1 break-all">{USDT_ADDRESS}</code>
                            <button onClick={copyAddress} className="p-2 hover:bg-luxury-gray/30 rounded transition-colors">
                              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-luxury-muted" />}
                            </button>
                          </div>
                          <p className="text-luxury-muted font-sans text-xs mt-3">
                            ⚠️ Only send USDT on TRC20 (Tron) network
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping & Tracking Section - Clickable Card */}
                  {(order.status === 'shipped' || order.status === 'completed' || order.status === 'processing') && (
                    <div className="border-t border-luxury-gray/20">
                      {/* Tracking Number */}
                      {order.tracking_number && (
                        <div className="p-4 md:p-6 bg-cyan-500/10 border-b border-cyan-500/20">
                          <div className="flex items-center gap-3">
                            <Truck className="text-cyan-400" size={20} />
                            <div>
                              <p className="text-cyan-400 font-sans text-xs uppercase tracking-wide">Tracking Number</p>
                              <p className="text-luxury-light font-mono text-sm md:text-base">{order.tracking_number}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Clickable Tracking Card */}
                      {hasTracking && latestTracking ? (
                        <button
                          onClick={() => setTrackingModal(order)}
                          className="w-full p-4 md:p-6 bg-luxury-dark/50 hover:bg-luxury-dark/70 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-sans text-xs uppercase tracking-wide text-luxury-muted flex items-center gap-2">
                              <MapPin size={14} />
                              Shipping Updates
                            </h4>
                            <div className="flex items-center gap-2 text-cyan-400">
                              <span className="font-sans text-xs">View History</span>
                              <ChevronRight size={16} />
                            </div>
                          </div>

                          {/* Latest Status Preview */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                              {(() => {
                                const Icon = trackingIcons[latestTracking.status] || Package;
                                return <Icon size={18} className="text-luxury-black" />;
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-cyan-400 font-sans font-medium text-sm">
                                {trackingLabels[latestTracking.status] || latestTracking.status}
                              </p>
                              <p className="text-luxury-muted font-sans text-xs truncate">
                                {latestTracking.location} · {new Date(latestTracking.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="p-4 md:p-6 text-center">
                          <Truck className="w-8 h-8 text-luxury-gray mx-auto mb-2" />
                          <p className="text-luxury-muted font-sans text-sm">
                            Tracking updates will appear here soon
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items */}
                  <div className="p-4 md:p-6 border-t border-luxury-gray/20">
                    <p className="text-luxury-muted font-sans text-xs uppercase tracking-wide mb-3">Items</p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-luxury-gray/20">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <p className="text-[10px] md:text-xs font-sans text-luxury-muted mt-1 truncate w-16 md:w-20">{item.brand}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Need Help */}
                  <div className="px-4 md:px-6 py-3 border-t border-luxury-gray/20 flex justify-between items-center bg-luxury-dark/30">
                    <p className="text-luxury-muted font-sans text-xs">Need help?</p>
                    <Link href="/contact" className="text-gold-500 font-sans text-xs hover:underline">
                      Contact Support
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tracking History Modal */}
      <AnimatePresence>
        {trackingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setTrackingModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-luxury-dark border border-luxury-gray/30 w-full max-w-lg rounded-lg max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 md:p-6 border-b border-luxury-gray/30 flex items-center justify-between sticky top-0 bg-luxury-dark z-10">
                <div>
                  <h3 className="font-serif text-lg">Shipping History</h3>
                  <p className="text-luxury-muted font-sans text-xs">
                    Order #{trackingModal.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setTrackingModal(null)}
                  className="p-2 hover:bg-luxury-gray/30 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tracking Number */}
              {trackingModal.tracking_number && (
                <div className="px-4 md:px-6 py-3 bg-cyan-500/10 border-b border-cyan-500/20">
                  <p className="text-cyan-400 font-sans text-xs uppercase tracking-wide">Tracking Number</p>
                  <p className="text-luxury-light font-mono">{trackingModal.tracking_number}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-cyan-500/30" />
                  
                  <div className="space-y-6">
                    {trackingModal.tracking_history?.slice().reverse().map((event, idx) => {
                      const Icon = trackingIcons[event.status] || Package;
                      const isLatest = idx === 0;
                      
                      return (
                        <div key={idx} className="relative flex gap-4">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                            isLatest 
                              ? 'bg-cyan-500 text-luxury-black' 
                              : 'bg-luxury-dark border-2 border-cyan-500/30 text-cyan-400'
                          }`}>
                            <Icon size={18} />
                          </div>
                          
                          {/* Content */}
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

              {/* Close Button */}
              <div className="p-4 border-t border-luxury-gray/30">
                <button
                  onClick={() => setTrackingModal(null)}
                  className="btn-solid w-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
