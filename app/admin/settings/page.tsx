'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-light mb-6">Account Settings</h2>

      {/* Password Change */}
      <div className="card-luxury p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-serif">Change Password</h3>
        </div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <p className={`font-sans text-sm ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {message.text}
            </p>
          </motion.div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label-luxury">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-luxury"
              required
            />
          </div>
          <div>
            <label className="label-luxury">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-luxury"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="label-luxury">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-luxury"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-solid flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Email Preferences */}
      <div className="card-luxury p-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-serif">Email Preferences</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.orderUpdates}
              onChange={(e) => setPreferences({ ...preferences, orderUpdates: e.target.checked })}
              className="w-5 h-5 accent-gold-500"
            />
            <div>
              <p className="font-sans text-sm">Order Updates</p>
              <p className="text-luxury-muted font-sans text-xs">Get notified about order status changes</p>
            </div>
          </label>

          <label className="flex items-center gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.newArrivals}
              onChange={(e) => setPreferences({ ...preferences, newArrivals: e.target.checked })}
              className="w-5 h-5 accent-gold-500"
            />
            <div>
              <p className="font-sans text-sm">New Arrivals</p>
              <p className="text-luxury-muted font-sans text-xs">Be the first to know about new watches</p>
            </div>
          </label>

          <label className="flex items-center gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.promotions}
              onChange={(e) => setPreferences({ ...preferences, promotions: e.target.checked })}
              className="w-5 h-5 accent-gold-500"
            />
            <div>
              <p className="font-sans text-sm">Promotions & Offers</p>
              <p className="text-luxury-muted font-sans text-xs">Receive exclusive deals and discounts</p>
            </div>
          </label>
        </div>
      </div>


    </div>
  );
}
