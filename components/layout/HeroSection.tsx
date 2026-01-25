'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
      
      {/* Rotating decorative ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold-500/10 rounded-full"
        style={{ borderTopColor: 'rgba(212, 175, 55, 0.3)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gold-500 font-sans text-xs tracking-ultra-wide uppercase mb-6"
          >
            Luxury Watch Store
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl lg:text-7xl font-serif font-light leading-tight mb-8"
          >
            Authenticated
            <br />
            <span className="text-gold-gradient">Luxury Watches</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-luxury-light font-sans text-lg leading-relaxed mb-12 max-w-lg"
          >
            Shop premium timepieces from the world's finest brands. 
            Every watch authenticated. Every purchase protected.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-6"
          >
            <Link href="/watches" className="btn-solid">
              Shop Now
            </Link>
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Right - Featured watch image placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-square">
            {/* Glow behind watch */}
            <div className="absolute inset-0 bg-gradient-radial from-gold-500/20 to-transparent rounded-full blur-2xl" />
            
            {/* Watch image placeholder */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
                alt="Featured luxury watch"
                className="w-4/5 h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border border-gold-500/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gold-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
