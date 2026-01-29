'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
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
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('You do not have admin access');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          {/* Animated Logo */}
          <Link href="/" className="inline-block mb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gold-500 rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
              <motion.img
                src="/logo.png"
                alt="Luxero"
                className="h-16 w-auto relative z-10 mx-auto"
                whileHover={{ scale: 1.08, filter: 'brightness(1.3)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              />
              <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  initial={{ x: '-150%' }}
                  animate={{ x: '350%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </Link>
          <h1 className="text-3xl font-serif font-light mb-2">Admin Login</h1>
          <p className="text-luxury-muted font-sans text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="card-luxury p-8">
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
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
            </div>
          </div>

          <div className="mb-8">
            <label className="label-luxury">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury pl-12 pr-12"
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
            className="btn-solid w-full flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
