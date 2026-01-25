'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.itemCount());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/watches', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-luxury-black/95 backdrop-blur-md py-2'
          : 'bg-gradient-to-b from-luxury-black/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Animated Logo */}
        <Link href="/" className="relative group">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gold-500 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
            
            {/* Logo with hover effect */}
            <motion.img
              src="/logo.png"
              alt="Luxero"
              className="h-12 w-auto relative z-10"
              whileHover={{ 
                scale: 1.08,
                filter: 'brightness(1.3)'
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 15 
              }}
            />
            
            {/* Continuous shine effect */}
            <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                initial={{ x: '-150%' }}
                animate={{ x: '350%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (0.1 * index) }}
            >
              <Link
                href={link.href}
                className="text-luxury-light font-sans text-xs tracking-extra-wide uppercase 
                           hover:text-gold-500 transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right side icons */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SearchBar />

          <Link
            href="/account"
            className="text-luxury-light hover:text-gold-500 transition-all duration-300 hover:scale-110"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>

          <Link
            href="/cart"
            className="text-luxury-light hover:text-gold-500 transition-all duration-300 relative hover:scale-110"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 text-luxury-black 
                           text-xs font-sans flex items-center justify-center rounded-full"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-luxury-light hover:text-gold-500 transition-colors duration-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden absolute top-full left-0 right-0 bg-luxury-black/98 backdrop-blur-md border-t border-gold-500/10"
        >
          <nav className="flex flex-col py-8 px-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-luxury-light font-sans text-sm tracking-extra-wide uppercase 
                             py-4 border-b border-luxury-gray/30
                             hover:text-gold-500 transition-colors duration-300 block"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
