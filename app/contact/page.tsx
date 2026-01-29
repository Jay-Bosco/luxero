'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
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
              Get In Touch
            </p>
            <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-8">
              Contact Us
            </h1>
            <p className="text-luxury-light font-sans text-lg leading-relaxed">
              Have a question about a watch or your order? We're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: 'Email',
                description: 'We respond within 24 hours',
                action: 'luxerowatches01@gmail.com',
                link: 'mailto:luxerowatches01@gmail.com'
              },
              {
                icon: Phone,
                title: 'Phone',
                description: 'Mon-Fri, 9am-6pm',
                action: '+234 800 000 0000',
                link: 'tel:+2348000000000'
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                description: 'Quick responses',
                action: 'Chat with us',
                link: 'https://wa.me/2348000000000'
              }
            ].map((option, index) => (
              <motion.a
                key={option.title}
                href={option.link}
                target={option.title === 'WhatsApp' ? '_blank' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury p-8 text-center hover:border-gold-500/30 transition-all group"
              >
                <div className="w-14 h-14 border border-gold-500/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500/10 transition-colors">
                  <option.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-xl font-serif font-light mb-2">{option.title}</h3>
                <p className="text-luxury-muted font-sans text-sm mb-4">{option.description}</p>
                <span className="text-gold-500 font-sans text-sm">{option.action}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Send a Message
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light">
              How Can We Help?
            </h2>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-luxury p-12 text-center"
            >
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-luxury-black" />
              </div>
              <h3 className="text-2xl font-serif font-light mb-4">Message Sent!</h3>
              <p className="text-luxury-muted font-sans">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
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
                  <label className="label-luxury">Name *</label>
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
                  <label className="label-luxury">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-luxury"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Question</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="label-luxury">Order Number (if applicable)</label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="input-luxury"
                  placeholder="ORD-XXXX-XXX"
                />
              </div>

              <div className="mb-8">
                <label className="label-luxury">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-luxury min-h-[150px] resize-none"
                  required
                />
              </div>

              <button type="submit" className="btn-solid w-full md:w-auto">
                Send Message
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-serif font-light">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: 'Are all your watches authentic?',
                a: 'Yes, every watch we sell is 100% authenticated by experts before listing. We guarantee authenticity on all our timepieces.'
              },
              {
                q: 'How does escrow protection work?',
                a: 'When you order, your payment is held securely until you receive your watch and confirm satisfaction. You\'re protected until you have the watch in hand.'
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 14-day return policy. If you\'re not completely satisfied with your purchase, return it for a full refund — no questions asked.'
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes, we ship worldwide with full insurance and tracking included on all orders.'
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury p-6"
              >
                <h3 className="font-serif text-lg mb-2">{faq.q}</h3>
                <p className="text-luxury-muted font-sans text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-luxury-muted font-sans text-sm">
            <Clock className="w-4 h-4 text-gold-500" />
            <span>We typically respond within <strong className="text-luxury-light">a few hours</strong></span>
          </div>
        </div>
      </section>
    </div>
  );
}
