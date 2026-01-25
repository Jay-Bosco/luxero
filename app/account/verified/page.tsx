'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/account');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-serif font-light mb-4">Email Verified!</h1>
        
        <p className="text-luxury-muted font-sans mb-8">
          Your email has been verified successfully. Welcome to Luxero — your journey into exceptional timepieces begins now.
        </p>

        <div className="space-y-4">
          <Link 
            href="/account" 
            className="btn-solid w-full flex items-center justify-center gap-2"
          >
            Go to My Account
            <ArrowRight size={18} />
          </Link>
          
          <Link 
            href="/watches" 
            className="btn-primary w-full"
          >
            Explore Collection
          </Link>
        </div>

        <p className="text-luxury-muted/60 font-sans text-sm mt-8">
          Redirecting to your account in 5 seconds...
        </p>
      </motion.div>
    </div>
  );
}
