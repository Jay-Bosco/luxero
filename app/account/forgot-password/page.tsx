'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`
      });

      if (error) throw error;

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-luxury p-12 text-center"
          >
            <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-gold-500" />
            </div>
            
            <h2 className="text-2xl font-serif font-light mb-4">Check Your Email</h2>
            
            <p className="text-luxury-muted font-sans mb-2">
              We've sent a password reset link to:
            </p>
            <p className="text-gold-500 font-sans font-medium mb-6">
              {email}
            </p>
            
            <p className="text-luxury-muted font-sans text-sm mb-8">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>

            <Link href="/account/login" className="btn-primary w-full flex items-center justify-center gap-2">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-serif font-light mb-4">Forgot Password</h1>
          <p className="text-luxury-muted font-sans">
            Enter your email and we'll send you a reset link
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card-luxury p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 font-sans text-sm">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <label className="label-luxury">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury pl-12"
                placeholder="you@example.com"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full flex items-center justify-center gap-2 mb-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                Send Reset Link
              </>
            )}
          </button>

          <Link 
            href="/account/login" 
            className="flex items-center justify-center gap-2 text-luxury-muted font-sans text-sm hover:text-gold-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </motion.form>
      </div>
    </div>
  );
}
