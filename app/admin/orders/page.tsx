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
  XCircle,
  Truck,
  Eye,
  X,
  Copy,
  Check,
  DollarSign,
  User,
  MapPin,
  Wallet,
  Plus,
  Plane,
  Building2,
  PackageCheck,
  Home
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
  user_email: string;
  items: Array<{
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  shipping_info: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  usdt_amount: string;
  tracking_number: string;
  tracking_history: TrackingEvent[];
  notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  awaiting_payment: 'bg-yellow-500/20 text-yellow-400',
  payment_received: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-green-500/20 text-green-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400'
};

const statusLabels: Record<string, string> = {
  awaiting_payment: 'Awaiting Payment',
  payment_received: 'Payment Received',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

// Predefined tracking statuses
const trackingStatuses = [
  { value: 'order_confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { value: 'preparing', label: 'Preparing Order', icon: Package },
  { value: 'quality_check', label: 'Quality Check', icon: PackageCheck },
  { value: 'dispatched', label: 'Dispatched from Warehouse', icon: Building2 },
  { value: 'in_transit', label: 'In Transit', icon: Truck },
  { value: 'arrived_country', label: 'Arrived in Destination Country', icon: Plane },
  { value: 'customs', label: 'Customs Clearance', icon: Building2 },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: Home },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Tracking modal state
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    status: 'in_transit',
    location: '',
    description: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    checkAuthAndLoadOrders();
  }, []);

  const checkAuthAndLoadOrders = async () => {
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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    
    const updateData: any = { 
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (newStatus === 'payment_received' || newStatus === 'processing') {
      updateData.payment_status = 'confirmed';
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, updates: updateData })
      });
      
      if (!res.ok) {
        showToast('Failed to update order', 'error');
      } else {
        const messages: Record<string, string> = {
          'payment_received': '✅ Payment confirmed successfully!',
          'processing': '📦 Order is now processing',
          'shipped': '🚚 Order marked as shipped',
          'completed': '✅ Order completed!'
        };
        showToast(messages[newStatus] || 'Order updated successfully');
      }
    } catch (err) {
      showToast('Failed to update order', 'error');
    }

    await loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    setUpdating(false);
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          updates: { 
            tracking_number: trackingNumber,
            updated_at: new Date().toISOString()
          }
        })
      });
      showToast('Tracking number updated');
    } catch (err) {
      showToast('Failed to update tracking', 'error');
    }
    await loadOrders();
  };

  const addTrackingEvent = async () => {
    if (!selectedOrder || !trackingForm.location || !trackingForm.description) {
      showToast('Please fill in location and description', 'error');
      return;
    }

    const newEvent: TrackingEvent = {
      status: trackingForm.status,
      location: trackingForm.location,
      description: trackingForm.description,
      timestamp: new Date().toISOString()
    };

    const existingHistory = selectedOrder.tracking_history || [];
    const updatedHistory = [...existingHistory, newEvent];

    // If status is delivered, also update order status
    const updates: any = {
      tracking_history: updatedHistory,
      updated_at: new Date().toISOString()
    };

    if (trackingForm.status === 'delivered') {
      updates.status = 'completed';
    } else if (trackingForm.status === 'dispatched' || trackingForm.status === 'in_transit') {
      updates.status = 'shipped';
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder.id, updates })
      });
      
      if (res.ok) {
        showToast('📍 Tracking update added!');
        setShowTrackingModal(false);
        setTrackingForm({ status: 'in_transit', location: '', description: '' });
        await loadOrders();
        // Update selected order
        setSelectedOrder({ ...selectedOrder, tracking_history: updatedHistory, ...updates });
      } else {
        showToast('Failed to add tracking update', 'error');
      }
    } catch (err) {
      showToast('Failed to add tracking update', 'error');
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(cents / 100);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const orderCounts = {
    all: orders.length,
    awaiting_payment: orders.filter(o => o.status === 'awaiting_payment').length,
    payment_received: orders.filter(o => o.status === 'payment_received').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'awaiting_payment':
        return { label: 'Confirm Payment', action: 'payment_received' };
      case 'payment_received':
        return { label: 'Start Processing', action: 'processing' };
      case 'processing':
        return { label: 'Mark as Shipped', action: 'shipped' };
      case 'shipped':
        return { label: 'Mark Completed', action: 'completed' };
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-luxury-muted hover:text-gold-500 transition-colors font-sans text-sm mb-4">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-serif font-light">Order Management</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'awaiting_payment', label: 'Awaiting Payment' },
            { key: 'payment_received', label: 'Payment Received' },
            { key: 'processing', label: 'Processing' },
            { key: 'shipped', label: 'Shipped' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-3 font-sans text-sm whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-gold-500 text-luxury-black'
                  : 'bg-luxury-gray/20 text-luxury-muted hover:bg-luxury-gray/30'
              }`}
            >
              <span>{orderCounts[tab.key as keyof typeof orderCounts] || 0}</span>
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <Package className="w-16 h-16 text-luxury-gray mx-auto mb-4" />
            <h2 className="text-xl font-serif mb-2">No orders found</h2>
            <p className="text-luxury-muted font-sans">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const nextAction = getNextAction(order.status);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-luxury p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-mono text-gold-500">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <span className={`px-2 py-1 font-sans text-xs uppercase ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-luxury-muted font-sans text-sm">
                        {order.shipping_info?.fullName || 'Guest'} · {order.user_email}
                      </p>
                      <p className="text-luxury-muted font-sans text-xs">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-serif text-gold-500">{formatPrice(order.total)}</p>
                      <p className="text-luxury-muted font-sans text-xs">{order.usdt_amount} USDT</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex gap-2 mb-4">
                    {order.items?.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="w-12 h-12 bg-luxury-gray/20">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-12 h-12 bg-luxury-gray/20 flex items-center justify-center">
                        <span className="text-luxury-muted font-sans text-xs">+{order.items.length - 4}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    
                    {nextAction && (
                      <button
                        onClick={() => updateOrderStatus(order.id, nextAction.action)}
                        disabled={updating}
                        className="btn-solid"
                      >
                        {nextAction.label}
                      </button>
                    )}

                    {(order.status === 'shipped' || order.status === 'processing') && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowTrackingModal(true);
                        }}
                        className="btn-primary flex items-center gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Plus size={16} />
                        Add Tracking Update
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && !showTrackingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-start justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card-luxury p-6 max-w-2xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="font-mono text-gold-500 text-xl">#{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                  <span className={`inline-block px-2 py-1 font-sans text-xs uppercase mt-2 ${statusColors[selectedOrder.status]}`}>
                    {statusLabels[selectedOrder.status] || selectedOrder.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-luxury-gray/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-serif text-lg mb-3 flex items-center gap-2">
                    <User size={18} className="text-gold-500" />
                    Customer
                  </h3>
                  <div className="bg-luxury-dark/50 p-4 space-y-1 font-sans text-sm">
                    <p>{selectedOrder.shipping_info?.fullName}</p>
                    <p className="text-luxury-muted">{selectedOrder.user_email}</p>
                    <p className="text-luxury-muted">{selectedOrder.shipping_info?.phone}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-serif text-lg mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-gold-500" />
                    Shipping Address
                  </h3>
                  <div className="bg-luxury-dark/50 p-4 font-sans text-sm">
                    <p>{selectedOrder.shipping_info?.address}</p>
                    <p>{selectedOrder.shipping_info?.city}, {selectedOrder.shipping_info?.state} {selectedOrder.shipping_info?.zipCode}</p>
                    <p>{selectedOrder.shipping_info?.country}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="font-serif text-lg mb-3 flex items-center gap-2">
                    <Wallet size={18} className="text-gold-500" />
                    Payment
                  </h3>
                  <div className="bg-luxury-dark/50 p-4 space-y-2 font-sans text-sm">
                    <p><span className="text-luxury-muted">Method:</span> {selectedOrder.payment_method?.toUpperCase()}</p>
                    <p><span className="text-luxury-muted">Amount:</span> {selectedOrder.usdt_amount} USDT</p>
                    <p><span className="text-luxury-muted">Status:</span> {selectedOrder.payment_status}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-serif text-lg mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 bg-luxury-dark/50 p-3">
                        <div className="w-16 h-16 bg-luxury-gray/20 flex-shrink-0">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-serif">{item.name}</p>
                          <p className="text-luxury-muted font-sans text-xs">{item.brand}</p>
                          <p className="text-gold-500 font-sans text-sm">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Number Input */}
                {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'completed') && (
                  <div>
                    <h3 className="font-serif text-lg mb-3 flex items-center gap-2">
                      <Truck size={18} className="text-gold-500" />
                      Tracking Number
                    </h3>
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      defaultValue={selectedOrder.tracking_number || ''}
                      onBlur={(e) => updateTrackingNumber(selectedOrder.id, e.target.value)}
                      className="input-luxury"
                    />
                  </div>
                )}

                {/* Tracking History */}
                {selectedOrder.tracking_history && selectedOrder.tracking_history.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg mb-3 flex items-center gap-2">
                      <MapPin size={18} className="text-gold-500" />
                      Tracking History
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.tracking_history.slice().reverse().map((event, idx) => {
                        const statusInfo = trackingStatuses.find(s => s.value === event.status);
                        const Icon = statusInfo?.icon || Package;
                        return (
                          <div key={idx} className="flex gap-3 bg-luxury-dark/50 p-3">
                            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon size={14} className="text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-sans text-sm font-medium">{statusInfo?.label || event.status}</p>
                              <p className="text-luxury-muted font-sans text-xs">{event.location}</p>
                              <p className="text-luxury-muted font-sans text-xs">{event.description}</p>
                              <p className="text-luxury-muted font-sans text-[10px] mt-1">
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add Tracking Button */}
                {(selectedOrder.status === 'shipped' || selectedOrder.status === 'processing') && (
                  <button
                    onClick={() => setShowTrackingModal(true)}
                    className="btn-solid w-full flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Tracking Update
                  </button>
                )}

                {/* Total */}
                <div className="border-t border-luxury-gray/30 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-xl">Total</span>
                    <span className="font-serif text-2xl text-gold-500">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Tracking Modal */}
      <AnimatePresence>
        {showTrackingModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTrackingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-luxury p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl">Add Tracking Update</h3>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="p-2 hover:bg-luxury-gray/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Select */}
                <div>
                  <label className="label-luxury">Status</label>
                  <select
                    value={trackingForm.status}
                    onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                    className="input-luxury"
                  >
                    {trackingStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="label-luxury">Location</label>
                  <input
                    type="text"
                    value={trackingForm.location}
                    onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })}
                    placeholder="e.g., Zurich, Switzerland"
                    className="input-luxury"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="label-luxury">Description</label>
                  <textarea
                    value={trackingForm.description}
                    onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })}
                    placeholder="e.g., Package has left the sorting facility"
                    rows={3}
                    className="input-luxury resize-none"
                  />
                </div>

                <button
                  onClick={addTrackingEvent}
                  className="btn-solid w-full"
                >
                  Add Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3 ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="font-sans font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
