'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, Check } from 'lucide-react';
import { useCartStore, formatPrice } from '@/lib/cart';
import { Address } from '@/types';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const { items, total, clearCart } = useCartStore();

  const [shippingAddress, setShippingAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-luxury-gray rounded w-48 mb-8" />
          <div className="h-96 bg-luxury-gray rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = total();
  const shipping = 0;
  const tax = Math.round(subtotal * 0.08);
  const orderTotal = subtotal + shipping + tax;

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    // TODO: Integrate with actual payment/escrow API
    // This would:
    // 1. Create order in Supabase
    // 2. Create escrow payment intent
    // 3. Process payment (held in escrow)
    // 4. Redirect to success page
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    
    clearCart();
    router.push('/account/orders?success=true');
  };

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-light mb-4">Checkout</h1>
          
          {/* Progress steps */}
          <div className="flex items-center gap-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm
                    ${step === s.id
                      ? 'bg-gold-500 text-luxury-black'
                      : steps.findIndex(x => x.id === step) > index
                        ? 'bg-green-600 text-white'
                        : 'bg-luxury-gray text-luxury-muted'
                    }`}
                >
                  {steps.findIndex(x => x.id === step) > index ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 font-sans text-sm ${
                  step === s.id ? 'text-gold-500' : 'text-luxury-muted'
                }`}>
                  {s.label}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-luxury-gray mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-serif font-light mb-8">Shipping Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-luxury">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-luxury">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-luxury"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-luxury">Address Line 1</label>
                    <input
                      type="text"
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                      className="input-luxury"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-luxury">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={shippingAddress.line2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                      className="input-luxury"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-luxury">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-luxury">State / Province</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-luxury">Postal Code</label>
                      <input
                        type="text"
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-luxury">Country</label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    className="btn-solid w-full mt-8"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-serif font-light mb-8">Payment Method</h2>
                
                {/* Escrow explanation */}
                <div className="card-luxury p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-gold-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-serif mb-2">Secure Escrow Payment</h3>
                      <p className="text-luxury-muted font-sans text-sm leading-relaxed mb-4">
                        Your payment will be held securely in escrow until you receive and confirm 
                        satisfaction with your purchase. This protects both buyer and seller.
                      </p>
                      <div className="space-y-2 text-luxury-light font-sans text-sm">
                        <p>✓ Payment held until delivery confirmed</p>
                        <p>✓ 14-day inspection period</p>
                        <p>✓ Full refund if item not as described</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment form placeholder */}
                <div className="space-y-6">
                  <div>
                    <label className="label-luxury">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="input-luxury pr-12"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted" size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-luxury">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input-luxury"
                      />
                    </div>
                    <div>
                      <label className="label-luxury">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  {/* Billing address */}
                  <div className="pt-6 border-t border-luxury-gray/30">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="font-sans text-sm">Billing address same as shipping</span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep('shipping')}
                      className="btn-primary flex-1"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('review')}
                      className="btn-solid flex-1"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-serif font-light mb-8">Review Your Order</h2>

                {/* Order items */}
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.watch_id} className="flex gap-4 py-4 border-b border-luxury-gray/30">
                      <div className="w-20 h-20 bg-luxury-gray/30">
                        <img
                          src={item.watch.images?.[0]}
                          alt={item.watch.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif">{item.watch.name}</p>
                        <p className="text-luxury-muted font-sans text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gold-500 font-serif">
                        {formatPrice(item.watch.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping address summary */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="label-luxury mb-3">Shipping Address</h4>
                    <p className="text-luxury-light font-sans text-sm leading-relaxed">
                      {shippingAddress.line1}<br />
                      {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                      {shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h4 className="label-luxury mb-3">Contact</h4>
                    <p className="text-luxury-light font-sans text-sm leading-relaxed">
                      {email}<br />
                      {phone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('payment')}
                    className="btn-primary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="btn-solid flex-1 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock size={16} />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="card-luxury p-8 sticky top-32">
              <h3 className="text-xl font-serif font-light mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.watch_id} className="flex justify-between text-sm font-sans">
                    <span className="text-luxury-light">
                      {item.watch.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.watch.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t border-luxury-gray/30">
                <div className="flex justify-between text-luxury-light font-sans text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-luxury-light font-sans text-sm">
                  <span>Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-luxury-light font-sans text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-luxury-gray/30">
                <span className="text-lg font-serif">Total</span>
                <span className="text-xl font-serif text-gold-500">
                  {formatPrice(orderTotal)}
                </span>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-luxury-gray/30 space-y-3">
                <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs">
                  <Shield size={14} className="text-gold-500" />
                  <span>Escrow Protected</span>
                </div>
                <div className="flex items-center gap-2 text-luxury-muted font-sans text-xs">
                  <Lock size={14} className="text-gold-500" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
