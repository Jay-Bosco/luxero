'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Heart, User, Phone, MapPin, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  shipping_address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        line1: data.shipping_address?.line1 || '',
        line2: data.shipping_address?.line2 || '',
        city: data.shipping_address?.city || '',
        state: data.shipping_address?.state || '',
        postal_code: data.shipping_address?.postal_code || '',
        country: data.shipping_address?.country || ''
      });
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        shipping_address: {
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country
        }
      })
      .eq('id', session.user.id);

    if (error) {
      setMessage('Failed to save profile');
    } else {
      setMessage('Profile updated successfully!');
    }
    
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/account/orders" className="card-luxury p-6 hover:border-gold-500/30 transition-colors group">
          <Package className="w-8 h-8 text-gold-500 mb-4" />
          <h3 className="text-lg font-serif mb-2 group-hover:text-gold-500 transition-colors">Your Orders</h3>
          <p className="text-luxury-muted font-sans text-sm">
            Track orders, view history, and manage returns
          </p>
        </Link>
        
        <Link href="/account/wishlist" className="card-luxury p-6 hover:border-gold-500/30 transition-colors group">
          <Heart className="w-8 h-8 text-gold-500 mb-4" />
          <h3 className="text-lg font-serif mb-2 group-hover:text-gold-500 transition-colors">Wishlist</h3>
          <p className="text-luxury-muted font-sans text-sm">
            Save your favorite timepieces for later
          </p>
        </Link>
      </div>

      {/* Profile Form */}
      <div className="card-luxury p-8">
        <h3 className="text-xl font-serif font-light mb-6">Profile Information</h3>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 ${
              message.includes('success') 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            } font-sans text-sm`}
          >
            {message}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-luxury pl-12"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
              </div>
            </div>
            <div>
              <label className="label-luxury">Phone</label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-luxury pl-12"
                  placeholder="+234..."
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-muted" />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="font-sans text-sm tracking-wide uppercase text-luxury-muted mb-4 flex items-center gap-2">
              <MapPin size={16} />
              Shipping Address
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="label-luxury">Address Line 1</label>
                <input
                  type="text"
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  className="input-luxury"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="label-luxury">Address Line 2</label>
                <input
                  type="text"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  className="input-luxury"
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="input-luxury"
                    placeholder="Nigeria"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-solid flex items-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
