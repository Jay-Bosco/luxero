'use client';

import { motion } from 'framer-motion';
import { Shield, Award, Truck, Clock, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
              About Luxero
            </p>
            <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-8">
              Your Destination for Luxury Watches
            </h1>
            <p className="text-luxury-light font-sans text-lg leading-relaxed">
              Luxero is a premium watch store offering authenticated luxury timepieces 
              from the world's most prestigious brands. With headquarters in Switzerland 
              and operations in Hong Kong, we deliver excellence worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Global Presence
            </p>
            <h2 className="text-3xl font-serif font-light">
              Serving Collectors Worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Switzerland HQ */}
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
                  <p className="text-gold-500 font-sans text-sm">Headquarters</p>
                </div>
              </div>
              <p className="text-luxury-muted font-sans leading-relaxed">
                Our headquarters in the heart of Swiss watchmaking country gives us direct 
                access to the finest timepieces. We work closely with authorized dealers 
                and collectors across Europe to source exceptional watches.
              </p>
            </motion.div>

            {/* Hong Kong Branch */}
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
                  <p className="text-gold-500 font-sans text-sm">Asia Pacific Hub</p>
                </div>
              </div>
              <p className="text-luxury-muted font-sans leading-relaxed">
                Our Hong Kong branch serves as our Asia Pacific hub, enabling faster 
                delivery and competitive shipping rates throughout Asia. We maintain 
                strong relationships with collectors and dealers across the region.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-light mb-6">
                Premium Watches, Zero Hassle
              </h2>
              <p className="text-luxury-light font-sans leading-relaxed mb-6">
                We source exceptional timepieces from around the world — Rolex, Patek Philippe, 
                Audemars Piguet, Omega, and more. Every watch we sell is carefully selected 
                and authenticated before it reaches our store.
              </p>
              <p className="text-luxury-muted font-sans leading-relaxed mb-8">
                When you shop with Luxero, you're buying directly from us. No middlemen, 
                no complicated transactions. Just a straightforward purchase with the protection 
                and service you deserve.
              </p>
              <Link href="/watches" className="btn-primary">
                Browse Our Watches
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: '500+', label: 'Watches in Stock' },
                { number: '100%', label: 'Authenticated' },
                { number: '24/7', label: 'Customer Support' },
                { number: '14-Day', label: 'Return Policy' }
              ].map((stat) => (
                <div key={stat.label} className="card-luxury p-6 text-center">
                  <p className="text-3xl font-serif text-gold-500 mb-2">{stat.number}</p>
                  <p className="text-luxury-muted font-sans text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Buy From Us */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Why Luxero
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light">
              Why Buy From Us
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Authenticated Watches',
                description: 'Every watch is verified by experts before we list it. We guarantee authenticity on everything we sell.'
              },
              {
                icon: Shield,
                title: 'Escrow Protection',
                description: 'Your payment is held securely until you receive your watch and confirm you\'re satisfied.'
              },
              {
                icon: Truck,
                title: 'Global Shipping',
                description: 'Fast, insured shipping from Switzerland or Hong Kong — whichever is closer to you.'
              },
              {
                icon: Clock,
                title: '14-Day Returns',
                description: 'Not happy? Return it within 14 days for a full refund. No questions asked.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-lg font-serif font-light mb-3">{item.title}</h3>
                <p className="text-luxury-muted font-sans text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow Explanation */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-luxury p-12"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-gold-500" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-light mb-4">
                  How Our Escrow Protection Works
                </h3>
                <p className="text-luxury-light font-sans leading-relaxed mb-6">
                  We know buying a luxury watch online is a big decision. That's why every purchase 
                  is protected by escrow — your money is safe until you have your watch in hand.
                </p>
                <div className="space-y-4">
                  {[
                    { step: '1', text: 'You place your order and payment is held securely' },
                    { step: '2', text: 'We ship your watch with full insurance and tracking' },
                    { step: '3', text: 'You receive and inspect your watch' },
                    { step: '4', text: 'Confirm you\'re happy, and the transaction is complete' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-gold-500 text-luxury-black font-sans text-sm flex items-center justify-center flex-shrink-0">
                        {item.step}
                      </span>
                      <p className="text-luxury-light font-sans pt-1">{item.text}</p>
                    </div>
                  ))}
                </div>
                <p className="text-luxury-muted font-sans text-sm mt-6">
                  If anything isn't right, we'll make it right — full refund, no hassle.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-serif font-light mb-6">
              Ready to Find Your Watch?
            </h2>
            <p className="text-luxury-muted font-sans mb-8">
              Browse our collection of authenticated luxury timepieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/watches" className="btn-solid">
                Shop Now
              </Link>
              <Link href="/contact" className="btn-primary">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
