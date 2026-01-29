'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Star, Users, ShoppingBag, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface StoreSettings {
  store_rating: number;
  total_reviews: number;
  total_customers: number;
  years_in_business: number;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState<StoreSettings>({
    store_rating: 4.9,
    total_reviews: 1250,
    total_customers: 850,
    years_in_business: 5
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      router.push('/admin/login');
      return;
    }

    // Load store settings
    const { data: storeData } = await supabase
      .from('store_settings')
      .select('*')
      .single();

    if (storeData) {
      setSettings({
        store_rating: storeData.store_rating || 4.9,
        total_reviews: storeData.total_reviews || 1250,
        total_customers: storeData.total_customers || 850,
        years_in_business: storeData.years_in_business || 5
      });
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    // Upsert store settings
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        id: 1, // Single row for store settings
        store_rating: settings.store_rating,
        total_reviews: settings.total_reviews,
        total_customers: settings.total_customers,
        years_in_business: settings.years_in_business,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Header */}
      <header className="bg-luxury-dark border-b border-luxury-gray/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-luxury-muted hover:text-gold-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-serif">Store Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-solid flex items-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : saved ? (
              <>
                <Star size={18} className="fill-luxury-black" />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Store Rating Section */}
        <div className="card-luxury p-6 mb-6">
          <h2 className="text-lg font-serif mb-6 flex items-center gap-3">
            <Star className="text-gold-500" size={20} />
            Store Rating & Statistics
          </h2>
          <p className="text-luxury-muted font-sans text-sm mb-6">
            These numbers appear on your homepage to build trust with customers.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Store Rating */}
            <div>
              <label className="label-luxury flex items-center gap-2">
                <Star size={14} className="text-gold-500" />
                Overall Store Rating
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={settings.store_rating}
                  onChange={(e) => setSettings({ ...settings, store_rating: parseFloat(e.target.value) || 0 })}
                  className="input-luxury w-24"
                  min="1"
                  max="5"
                  step="0.1"
                />
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= Math.round(settings.store_rating) ? 'text-gold-500 fill-gold-500' : 'text-luxury-gray'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-luxury-muted font-sans text-xs mt-1">Recommended: 4.8 - 4.9</p>
            </div>

            {/* Total Reviews */}
            <div>
              <label className="label-luxury flex items-center gap-2">
                <Users size={14} className="text-gold-500" />
                Total Reviews Count
              </label>
              <input
                type="number"
                value={settings.total_reviews}
                onChange={(e) => setSettings({ ...settings, total_reviews: parseInt(e.target.value) || 0 })}
                className="input-luxury"
                min="0"
              />
              <p className="text-luxury-muted font-sans text-xs mt-1">Displayed as "X+ Reviews"</p>
            </div>

            {/* Total Customers */}
            <div>
              <label className="label-luxury flex items-center gap-2">
                <ShoppingBag size={14} className="text-gold-500" />
                Happy Customers
              </label>
              <input
                type="number"
                value={settings.total_customers}
                onChange={(e) => setSettings({ ...settings, total_customers: parseInt(e.target.value) || 0 })}
                className="input-luxury"
                min="0"
              />
              <p className="text-luxury-muted font-sans text-xs mt-1">Displayed as "X+ Happy Customers"</p>
            </div>

            {/* Years in Business */}
            <div>
              <label className="label-luxury flex items-center gap-2">
                <Award size={14} className="text-gold-500" />
                Years in Business
              </label>
              <input
                type="number"
                value={settings.years_in_business}
                onChange={(e) => setSettings({ ...settings, years_in_business: parseInt(e.target.value) || 0 })}
                className="input-luxury"
                min="1"
              />
              <p className="text-luxury-muted font-sans text-xs mt-1">Displayed as "X+ Years Experience"</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card-luxury p-6">
          <h3 className="text-lg font-serif mb-4">Preview (Homepage)</h3>
          <div className="bg-luxury-dark/50 p-6 rounded">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={24}
                    className={star <= Math.round(settings.store_rating) ? 'text-gold-500 fill-gold-500' : 'text-luxury-gray'}
                  />
                ))}
              </div>
              <p className="text-2xl font-serif text-gold-500 mb-1">{settings.store_rating}</p>
              <p className="text-luxury-muted font-sans text-sm">
                Based on {settings.total_reviews.toLocaleString()}+ reviews
              </p>
              <div className="flex gap-6 mt-4 text-luxury-muted font-sans text-xs">
                <span>{settings.total_customers.toLocaleString()}+ Customers</span>
                <span>{settings.years_in_business}+ Years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
