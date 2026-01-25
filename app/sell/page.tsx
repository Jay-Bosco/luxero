'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Shield, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SellPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    watchCount: '',
    brands: '',
    website: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              For Sellers
            </p>
            <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-8">
              Sell With Luxero
            </h1>
            <p className="text-luxury-light font-sans text-lg leading-relaxed">
              Join our network of trusted watch sellers. Access serious buyers, 
              enjoy secure payments, and grow your business with Luxero.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: 'Serious Buyers',
                description: 'Access to qualified collectors actively looking for luxury timepieces.'
              },
              {
                icon: Shield,
                title: 'Guaranteed Payment',
                description: 'Funds are secured in escrow before you ship. No chargebacks, no risk.'
              },
              {
                icon: Zap,
                title: 'Fast Payouts',
                description: 'Receive payment within 24 hours of buyer confirmation.'
              },
              {
                icon: DollarSign,
                title: 'Competitive Fees',
                description: 'Low commission rates. Keep more of your sale price.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury p-8 text-center"
              >
                <div className="w-14 h-14 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-lg font-serif font-light mb-3">{benefit.title}</h3>
                <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Simple Process
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light">
              How Selling Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'List Your Watch',
                description: 'Upload photos, add details, and set your price. Our team reviews every listing for quality.'
              },
              {
                step: '02',
                title: 'Buyer Pays',
                description: 'When someone buys, we secure their payment in escrow. You\'ll be notified to ship.'
              },
              {
                step: '03',
                title: 'Ship & Get Paid',
                description: 'Ship the watch with tracking. Once buyer confirms, funds are released to you within 24 hours.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-serif text-gold-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-serif font-light mb-4">{item.title}</h3>
                <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                  {item.description}
                </p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gold-500/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-light mb-4">Seller Requirements</h2>
            <p className="text-luxury-muted font-sans">
              We maintain high standards to ensure trust on our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-luxury p-8"
            >
              <h3 className="text-lg font-serif font-light mb-6 text-gold-500">What We Accept</h3>
              <ul className="space-y-3">
                {[
                  'Genuine luxury watches only',
                  'Complete documentation preferred',
                  'Accurate descriptions and photos',
                  'Watches in working condition',
                  'Transparent about service history'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-luxury-light font-sans text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-luxury p-8"
            >
              <h3 className="text-lg font-serif font-light mb-6 text-gold-500">Seller Verification</h3>
              <ul className="space-y-3">
                {[
                  'Valid government ID',
                  'Business registration (for dealers)',
                  'Bank account verification',
                  'Address confirmation',
                  'Sales history review (if applicable)'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-luxury-light font-sans text-sm">
                    <CheckCircle className="w-5 h-5 text-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Get Started
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light mb-4">
              Apply to Sell
            </h2>
            <p className="text-luxury-muted font-sans">
              Fill out the form below and our team will review your application within 48 hours.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-luxury p-12 text-center"
            >
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-luxury-black" />
              </div>
              <h3 className="text-2xl font-serif font-light mb-4">Application Submitted!</h3>
              <p className="text-luxury-muted font-sans mb-6">
                Thank you for your interest in selling with Luxero. 
                We'll review your application and get back to you within 48 hours.
              </p>
              <Link href="/watches" className="btn-primary">
                Browse Watches
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="card-luxury p-8 lg:p-12"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="label-luxury">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="label-luxury">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="label-luxury">Business Name (if applicable)</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="label-luxury">How many watches do you have? *</label>
                  <select
                    value={formData.watchCount}
                    onChange={(e) => setFormData({ ...formData, watchCount: e.target.value })}
                    className="input-luxury"
                    required
                  >
                    <option value="">Select</option>
                    <option value="1-5">1-5 watches</option>
                    <option value="6-20">6-20 watches</option>
                    <option value="21-50">21-50 watches</option>
                    <option value="50+">50+ watches</option>
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Primary Brands *</label>
                  <input
                    type="text"
                    value={formData.brands}
                    onChange={(e) => setFormData({ ...formData, brands: e.target.value })}
                    className="input-luxury"
                    placeholder="e.g., Rolex, Omega, Patek"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="label-luxury">Website or Social Media (optional)</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-luxury"
                  placeholder="https://"
                />
              </div>

              <div className="mb-8">
                <label className="label-luxury">Tell us about your inventory</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-luxury min-h-[120px] resize-none"
                  placeholder="What types of watches do you sell? Any notable pieces?"
                />
              </div>

              <button type="submit" className="btn-solid w-full md:w-auto">
                Submit Application
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
