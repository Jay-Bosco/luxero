'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      // Sign up the user with email confirmation
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation required
        setVerificationSent(true);
      } else if (data.user && data.session) {
        // No email confirmation required (auto-confirmed)
        // Create profile
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: name,
            email: email
          });
        
        router.push('/account');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setError('');

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      // Show success briefly
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  // Verification Sent State
  if (verificationSent) {
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
              We've sent a verification link to:
            </p>
            <p className="text-gold-500 font-sans font-medium mb-6">
              {email}
            </p>
            
            <p className="text-luxury-muted font-sans text-sm mb-8">
              Click the link in the email to verify your account and complete registration.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400 font-sans text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
            >
              {resending ? (
                <div className="w-5 h-5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Resend Verification Email
                </>
              )}
            </button>

            <p className="text-luxury-muted font-sans text-sm">
              Wrong email?{' '}
              <button
                onClick={() => {
                  setVerificationSent(false);
                  setEmail('');
                }}
                className="text-gold-500 hover:underline"
              >
                Try again
              </button>
            </p>
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
          <h1 className="text-3xl font-serif font-light mb-4">Create Account</h1>
          <p className="text-luxury-muted font-sans">
            Join Luxero for an exclusive experience
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSignup}
          className="card-luxury p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 font-sans text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="label-luxury">Your Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-luxury pl-12"
                placeholder="John"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
            </div>
          </div>

          <div className="mb-6">
            <label className="label-luxury">Email</label>
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

          <div className="mb-8">
            <label className="label-luxury">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pl-12"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
            </div>
            <p className="text-luxury-muted font-sans text-xs mt-2">
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full flex items-center justify-center mb-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-luxury-muted font-sans text-sm">
            Already have an account?{' '}
            <Link href="/account/login" className="text-gold-500 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
