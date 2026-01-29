'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-serif font-light mb-4">Welcome Back</h1>
          <p className="text-luxury-muted font-sans">
            Sign in to access your account
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="card-luxury p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 font-sans text-sm">{error}</p>
            </div>
          )}

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
            <div className="flex items-center justify-between mb-2">
              <label className="label-luxury mb-0">Password</label>
              <Link 
                href="/account/forgot-password" 
                className="text-gold-500 font-sans text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pl-12 pr-12"
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-solid w-full flex items-center justify-center mb-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-luxury-muted font-sans text-sm">
            Don't have an account?{' '}
            <Link href="/account/signup" className="text-gold-500 hover:underline">
              Create one
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
