'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, FileCheck, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthenticityPage() {
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
              Trust & Verification
            </p>
            <h1 className="text-4xl lg:text-6xl font-serif font-light tracking-wide mb-8">
              100% Authenticated
            </h1>
            <p className="text-luxury-light font-sans text-lg leading-relaxed">
              Every watch on Luxero goes through a rigorous authentication process. 
              We work with certified experts to ensure you receive exactly what you're paying for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Authentication Process */}
      <section className="px-6 lg:px-12 mb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Our Process
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light">
              How We Verify Every Watch
            </h2>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                icon: FileCheck,
                step: '01',
                title: 'Seller Verification',
                description: 'Before any seller can list on Luxero, they go through our vetting process. We verify identity, check history, and ensure they meet our standards.',
                checks: ['Identity verification', 'Business documentation', 'Sales history review', 'Reference checks']
              },
              {
                icon: Eye,
                step: '02',
                title: 'Watch Inspection',
                description: 'Every watch listing is reviewed by our team. We examine photos, documentation, and details to spot any red flags before it goes live.',
                checks: ['High-resolution photo review', 'Serial number verification', 'Documentation check', 'Condition assessment']
              },
              {
                icon: Shield,
                step: '03',
                title: 'Expert Authentication',
                description: 'For high-value pieces, we work with certified watchmakers and authentication experts who physically inspect the watch before shipping.',
                checks: ['Movement inspection', 'Case & dial verification', 'Parts authenticity check', 'Service history review']
              },
              {
                icon: Award,
                step: '04',
                title: 'Certificate of Authenticity',
                description: 'Authenticated watches come with a Luxero certificate confirming the watch is genuine, along with the original documentation when available.',
                checks: ['Luxero authenticity certificate', 'Original box & papers (when available)', 'Detailed condition report', 'Photo documentation']
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 border border-gold-500/30 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-gold-500" />
                    </div>
                    <span className="text-gold-500 font-sans text-xs tracking-extra-wide uppercase">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-light mb-4">{item.title}</h3>
                  <p className="text-luxury-light font-sans leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.checks.map((check) => (
                      <li key={check} className="flex items-center gap-3 text-luxury-muted font-sans text-sm">
                        <CheckCircle className="w-4 h-4 text-gold-500" />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-luxury-gray/50 to-luxury-dark/50 flex items-center justify-center">
                    <item.icon className="w-24 h-24 text-gold-500/20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section className="px-6 lg:px-12 py-24 bg-luxury-dark/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-4">
              Detailed Inspection
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-light">
              What We Look For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Movement',
                items: ['Caliber verification', 'Serial number matching', 'Correct finishing', 'Proper function']
              },
              {
                title: 'Case & Dial',
                items: ['Material authenticity', 'Correct proportions', 'Genuine dial markers', 'Lume quality']
              },
              {
                title: 'Documentation',
                items: ['Original warranty card', 'Service records', 'Box & accessories', 'Purchase history']
              },
              {
                title: 'Bracelet/Strap',
                items: ['Original vs aftermarket', 'Clasp verification', 'Link authenticity', 'Proper fit']
              },
              {
                title: 'Crystal',
                items: ['Sapphire vs mineral', 'AR coating check', 'Correct profile', 'Logo etching']
              },
              {
                title: 'Overall Condition',
                items: ['Polish assessment', 'Scratch documentation', 'Water resistance', 'Timekeeping accuracy']
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-luxury p-8"
              >
                <h3 className="text-lg font-serif font-light mb-4 text-gold-500">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-luxury-muted font-sans text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-gold-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-luxury p-12 border-red-500/20"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-light mb-4">
                  Red Flags We Watch For
                </h3>
                <p className="text-luxury-light font-sans leading-relaxed mb-6">
                  Our experts are trained to spot counterfeits and misrepresentations. Here's what automatically disqualifies a listing:
                </p>
                <ul className="space-y-3 text-luxury-muted font-sans">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">✕</span>
                    <span>Mismatched serial numbers between case and papers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">✕</span>
                    <span>Aftermarket parts sold as original</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">✕</span>
                    <span>Incorrect movement for the reference</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">✕</span>
                    <span>Refinished dials not disclosed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500">✕</span>
                    <span>Franken-watches (mixed parts from different models)</span>
                  </li>
                </ul>
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
            <Shield className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-serif font-light mb-6">
              Shop With Confidence
            </h2>
            <p className="text-luxury-muted font-sans mb-8">
              Every watch is authenticated. Every purchase is protected by escrow. 
              You only pay when you're satisfied.
            </p>
            <Link href="/watches" className="btn-solid">
              Browse Authenticated Watches
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
