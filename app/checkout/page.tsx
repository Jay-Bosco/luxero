'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  Wallet,
  Copy,
  Check,
  AlertCircle,
  Shield,
  Clock,
  ChevronRight,
  X,
  Truck
} from 'lucide-react';
import { useCartStore, formatPrice } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';

// USDT TRC20 Wallet Address
const USDT_ADDRESS = 'TLGj9ieQF1stTGLrv51reb9wwSFLLTBtuEZ';
const USDT_NETWORK = 'TRC20 (Tron)';

// Shipping rates by region (HQ: Switzerland, Branch: Hong Kong)
const SHIPPING_RATES: Record<string, number> = {
  // Europe (from Switzerland)
  'Switzerland': 1500, // $15 domestic
  'Germany': 2000, // $20
  'France': 2000, // $20
  'Austria': 2000, // $20
  'Italy': 2000, // $20
  'United Kingdom': 2500, // $25
  'Netherlands': 2000, // $20
  'Belgium': 2000, // $20
  'Spain': 2500, // $25
  'Portugal': 2500, // $25
  // Asia Pacific (from Hong Kong - discounted)
  'Hong Kong': 1500, // $15 local
  'Singapore': 2000, // $20
  'Japan': 2500, // $25
  'China': 2000, // $20
  'South Korea': 2500, // $25
  'Taiwan': 2000, // $20
  'Malaysia': 2500, // $25
  'Thailand': 2500, // $25
  'Indonesia': 3000, // $30
  'Philippines': 3000, // $30
  'Vietnam': 3000, // $30
  'India': 3500, // $35
  'Australia': 3500, // $35
  'New Zealand': 4000, // $40
  // Middle East
  'United Arab Emirates': 3500, // $35
  'Saudi Arabia': 3500, // $35
  'Qatar': 3500, // $35
  'Kuwait': 3500, // $35
  // Americas
  'United States': 4500, // $45
  'Canada': 4500, // $45
  // Africa
  'Nigeria': 5000, // $50
  'South Africa': 4500, // $45
  'Ghana': 5000, // $50
  'Kenya': 5000, // $50
  'Default': 5000, // $50 for other countries
};

type PaymentMethod = 'usdt' | 'bank' | 'card' | null;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clearCart);
  const [user, setUser] = useState<any>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [savedUsdtAmount, setSavedUsdtAmount] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState<'bank' | 'card' | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    setUser(session.user);
    setShippingInfo(prev => ({
      ...prev,
      email: session.user.email || '',
      fullName: session.user.user_metadata?.full_name || ''
    }));

    // Get user's order count for free shipping check
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);
    
    setOrderCount(count || 0);
    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(USDT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate shipping based on country
  const getShippingFee = () => {
    // Free shipping for first 2 orders
    if (orderCount < 2) return 0;
    
    const country = shippingInfo.country.trim();
    if (!country) return 0;
    
    return SHIPPING_RATES[country] || SHIPPING_RATES['Default'];
  };

  const shippingFee = getShippingFee();
  const grandTotal = total + shippingFee;
  const usdtAmount = (grandTotal / 100).toFixed(2);

  const handlePaymentSelect = (method: PaymentMethod) => {
    if (method === 'bank' || method === 'card') {
      setShowUnavailableModal(method);
    } else {
      setSelectedPayment(method);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment || selectedPayment === 'bank' || selectedPayment === 'card') return;
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.country) {
      alert('Please fill in all required shipping fields');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    // Create order - matching existing table schema
    const orderData = {
      user_id: user.id,
      user_email: shippingInfo.email,
      items: items.map(item => ({
        watch_id: item.watch_id,
        name: item.watch.name,
        brand: item.watch.brand,
        price: item.watch.price,
        quantity: item.quantity,
        image: item.watch.images?.[0] || ''
      })),
      subtotal: total,
      shipping_fee: shippingFee,
      shipping: shippingFee,
      tax: 0,
      total: grandTotal,
      currency: 'USD',
      payment_method: 'usdt',
      payment_status: 'pending',
      status: 'awaiting_payment',
      escrow_status: 'pending',
      shipping_info: shippingInfo,
      shipping_address: shippingInfo,
      billing_address: shippingInfo,
      usdt_address: USDT_ADDRESS,
      usdt_amount: usdtAmount,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
      setSubmitting(false);
      return;
    }

    // Save the USDT amount before clearing cart
    setSavedUsdtAmount(usdtAmount);
    setOrderId(data.id);
    setOrderPlaced(true);
    clearCart();
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
          <p className="text-luxury-muted font-sans mb-8">Add some watches to checkout</p>
          <Link href="/watches" className="btn-solid">
            Browse Watches
          </Link>
        </div>
      </div>
    );
  }

  // Order Confirmation Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-luxury p-8 text-center"
          >
            <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-luxury-black" />
            </div>
            
            <h1 className="text-3xl font-serif mb-4">Order Placed!</h1>
            <p className="text-luxury-muted font-sans mb-6">
              Order ID: <span className="text-gold-500">{orderId?.slice(0, 8).toUpperCase()}</span>
            </p>

            <div className="bg-luxury-dark/50 p-6 text-left mb-8">
              <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
                <Wallet className="text-gold-500" size={20} />
                Complete Your Payment
              </h3>
              
              <p className="text-luxury-muted font-sans text-sm mb-4">
                Send exactly <span className="text-gold-500 font-bold">{savedUsdtAmount || usdtAmount} USDT</span> to:
              </p>

              <div className="bg-luxury-black p-4 mb-4">
                <p className="text-luxury-muted font-sans text-xs mb-2">{USDT_NETWORK}</p>
                <div className="flex items-center gap-2">
                  <code className="text-gold-500 text-sm flex-1 break-all">{USDT_ADDRESS}</code>
                  <button
                    onClick={copyAddress}
                    className="p-2 hover:bg-luxury-gray/30 transition-colors"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 text-yellow-500 text-xs font-sans">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>Only send USDT on TRC20 (Tron) network. Other tokens or networks will be lost.</span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <Clock className="text-blue-400 flex-shrink-0" size={20} />
                <div>
                  <p className="text-blue-400 font-sans text-sm font-medium">What happens next?</p>
                  <p className="text-luxury-muted font-sans text-xs mt-1">
                    Once we confirm your payment, we'll prepare your order for shipping. 
                    You'll receive email updates at each step.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/watches" className="btn-primary">
                Continue Shopping
              </Link>
              <Link href="/account/orders" className="btn-solid">
                View My Orders
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/cart" className="inline-flex items-center gap-2 text-luxury-muted hover:text-gold-500 transition-colors font-sans text-sm mb-4">
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-3xl lg:text-4xl font-serif font-light">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="card-luxury p-6">
              <h2 className="text-xl font-serif mb-6">Shipping Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Full Name *</label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Email *</label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Phone *</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="input-luxury"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Country *</label>
                  <select
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    className="input-luxury"
                    required
                  >
                    <option value="">Select country...</option>
                    <optgroup label="Europe">
                      <option value="Switzerland">Switzerland</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Austria">Austria</option>
                      <option value="Italy">Italy</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Spain">Spain</option>
                      <option value="Portugal">Portugal</option>
                    </optgroup>
                    <optgroup label="Asia Pacific (Ships from Hong Kong)">
                      <option value="Hong Kong">Hong Kong</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Taiwan">Taiwan</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                    </optgroup>
                    <optgroup label="Middle East">
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Kuwait">Kuwait</option>
                    </optgroup>
                    <optgroup label="Americas">
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                    </optgroup>
                    <optgroup label="Africa">
                      <option value="Nigeria">Nigeria</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                    </optgroup>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label-luxury">Address *</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="input-luxury"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">City *</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">State / Province</label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">ZIP / Postal Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>

              {/* Free shipping notice */}
              {orderCount < 2 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                  <Truck className="text-green-500" size={18} />
                  <span className="text-green-500 font-sans text-sm">
                    🎉 Free shipping on your {orderCount === 0 ? 'first' : 'second'} order!
                  </span>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card-luxury p-6">
              <h2 className="text-xl font-serif mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* USDT Option */}
                <button
                  onClick={() => handlePaymentSelect('usdt')}
                  className={`w-full p-4 border text-left transition-all ${
                    selectedPayment === 'usdt'
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-luxury-gray/30 hover:border-gold-500/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedPayment === 'usdt' ? 'bg-gold-500' : 'bg-luxury-gray/30'
                    }`}>
                      <Wallet className={selectedPayment === 'usdt' ? 'text-luxury-black' : 'text-gold-500'} size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg">USDT (Tether)</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 font-sans text-[10px] uppercase tracking-wide">
                          Available
                        </span>
                      </div>
                      <p className="text-luxury-muted font-sans text-sm">Pay with USDT on TRC20 network</p>
                    </div>
                    <ChevronRight className={`transition-transform ${selectedPayment === 'usdt' ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* USDT Details */}
                <AnimatePresence>
                  {selectedPayment === 'usdt' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-luxury-dark/50 border border-luxury-gray/20">
                        <p className="text-luxury-muted font-sans text-sm mb-4">
                          Send exactly <span className="text-gold-500 font-bold text-lg">{usdtAmount} USDT</span> to complete your order
                        </p>

                        <div className="bg-luxury-black p-4 mb-4">
                          <p className="text-luxury-muted font-sans text-xs mb-2">Network: {USDT_NETWORK}</p>
                          <div className="flex items-center gap-2">
                            <code className="text-gold-500 text-sm flex-1 break-all">{USDT_ADDRESS}</code>
                            <button
                              onClick={copyAddress}
                              className="p-2 hover:bg-luxury-gray/30 transition-colors"
                            >
                              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-yellow-500 text-xs font-sans">
                          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                          <span>Only send USDT on TRC20 (Tron) network. Other tokens or networks will be lost forever.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bank Transfer Option */}
                <button
                  onClick={() => handlePaymentSelect('bank')}
                  className="w-full p-4 border border-luxury-gray/30 hover:border-gold-500/50 text-left transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-luxury-gray/30 flex items-center justify-center">
                      <Building2 className="text-gold-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <span className="font-serif text-lg">Bank Transfer</span>
                      <p className="text-luxury-muted font-sans text-sm">Direct bank transfer</p>
                    </div>
                    <ChevronRight />
                  </div>
                </button>

                {/* Card Payment Option */}
                <button
                  onClick={() => handlePaymentSelect('card')}
                  className="w-full p-4 border border-luxury-gray/30 hover:border-gold-500/50 text-left transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-luxury-gray/30 flex items-center justify-center">
                      <CreditCard className="text-gold-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <span className="font-serif text-lg">Credit/Debit Card</span>
                      <p className="text-luxury-muted font-sans text-sm">Visa, Mastercard, Amex</p>
                    </div>
                    <ChevronRight />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-luxury p-6 sticky top-32">
              <h2 className="text-xl font-serif mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.watch_id} className="flex gap-4">
                    <div className="w-16 h-16 bg-luxury-gray/20 flex-shrink-0">
                      {item.watch.images?.[0] && (
                        <img
                          src={item.watch.images[0]}
                          alt={item.watch.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm truncate">{item.watch.name}</p>
                      <p className="text-luxury-muted font-sans text-xs">{item.watch.brand}</p>
                      <p className="text-gold-500 font-sans text-sm">{formatPrice(item.watch.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-luxury-gray/20 pt-4 space-y-2">
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-luxury-muted">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-luxury-muted">Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    <span>{formatPrice(shippingFee)}</span>
                  )}
                </div>
                {shippingFee === 0 && orderCount < 2 && (
                  <p className="text-green-500 font-sans text-xs">
                    🎉 Free shipping applied!
                  </p>
                )}
                <div className="flex justify-between font-serif text-xl pt-4 border-t border-luxury-gray/20">
                  <span>Total</span>
                  <span className="text-gold-500">{formatPrice(grandTotal)}</span>
                </div>
                {selectedPayment === 'usdt' && (
                  <div className="flex justify-between font-sans text-sm text-gold-500">
                    <span>USDT Amount</span>
                    <span>{usdtAmount} USDT</span>
                  </div>
                )}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedPayment || submitting}
                className="btn-solid w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-luxury-gray/20">
                <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs mb-3">
                  <Shield size={14} className="text-gold-500" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs">
                  <Check size={14} className="text-gold-500" />
                  <span>Escrow protection on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unavailable Payment Modal */}
      <AnimatePresence>
        {showUnavailableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowUnavailableModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-luxury p-6 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-serif mb-2">Payment Unavailable</h3>
              <p className="text-luxury-muted font-sans text-sm mb-6">
                {showUnavailableModal === 'bank' 
                  ? 'Bank transfer is currently unavailable. Please use USDT to complete your purchase.'
                  : 'Card payments are currently unavailable. Please use USDT to complete your purchase.'
                }
              </p>
              <button
                onClick={() => {
                  setShowUnavailableModal(null);
                  setSelectedPayment('usdt');
                }}
                className="btn-solid"
              >
                Pay with USDT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}