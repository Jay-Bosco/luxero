'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Zap, 
  Save, 
  Plus,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { brandTemplates, quickTemplates, watchBrands, caseSizes, dialColors } from '@/lib/watch-templates';
import ImageUpload from '@/components/admin/ImageUpload';

export default function QuickAddPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    model: '',
    collection: '',
    price: '',
    images: [''],
    case_size: '41mm',
    dial_color: 'Black',
    case_material: '',
    movement: '',
    water_resistance: '',
    strap_material: '',
    description: '',
    reference_number: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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

    setLoading(false);
  };

  // Apply brand template
  const applyBrandTemplate = (brand: string) => {
    const template = brandTemplates[brand];
    if (template) {
      setFormData(prev => ({
        ...prev,
        brand,
        case_material: template.case_material,
        movement: template.movement,
        water_resistance: template.water_resistance,
        strap_material: template.strap_material,
        description: template.description
      }));
    } else {
      setFormData(prev => ({ ...prev, brand }));
    }
  };

  // Apply quick template
  const applyQuickTemplate = (template: typeof quickTemplates[0]) => {
    const brandTemplate = brandTemplates[template.brand];
    setFormData({
      brand: template.brand,
      name: template.name,
      model: template.model,
      collection: template.collection,
      price: String(template.suggestedPrice),
      images: [''],
      case_size: template.case_size,
      dial_color: template.dial_color,
      case_material: brandTemplate?.case_material || '',
      movement: brandTemplate?.movement || '',
      water_resistance: brandTemplate?.water_resistance || '',
      strap_material: brandTemplate?.strap_material || '',
      description: brandTemplate?.description || '',
      reference_number: ''
    });
  };

  // Save watch
  const handleSave = async () => {
    if (!formData.brand || !formData.name || !formData.price) {
      alert('Please fill in Brand, Name and Price');
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const watchData = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model || null,
      collection: formData.collection || null,
      description: formData.description,
      price: Math.round(parseFloat(formData.price) * 100),
      currency: 'USD',
      images: formData.images.filter(img => img.trim() !== ''),
      stock: 1,
      featured: false,
      sold_out: false,
      active: true,
      specifications: {
        case_size: formData.case_size,
        case_material: formData.case_material,
        movement: formData.movement,
        water_resistance: formData.water_resistance,
        dial_color: formData.dial_color,
        strap_material: formData.strap_material,
        reference_number: formData.reference_number
      }
    };

    try {
      const { error } = await supabase.from('watches').insert(watchData);
      
      if (error) throw error;

      setSavedCount(prev => prev + 1);
      setSaved(true);
      
      // Reset form but keep brand selected
      const currentBrand = formData.brand;
      setFormData({
        brand: currentBrand,
        name: '',
        model: '',
        collection: '',
        price: '',
        images: [''],
        case_size: '41mm',
        dial_color: 'Black',
        case_material: brandTemplates[currentBrand]?.case_material || '',
        movement: brandTemplates[currentBrand]?.movement || '',
        water_resistance: brandTemplates[currentBrand]?.water_resistance || '',
        strap_material: brandTemplates[currentBrand]?.strap_material || '',
        description: brandTemplates[currentBrand]?.description || '',
        reference_number: ''
      });

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save watch');
    } finally {
      setSaving(false);
    }
  };

  // Save and add another
  const handleSaveAndContinue = async () => {
    await handleSave();
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
      <header className="bg-luxury-dark border-b border-luxury-gray/30 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-luxury-muted hover:text-gold-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-serif flex items-center gap-2">
                <Zap className="text-gold-500" size={20} />
                Quick Add Watch
              </h1>
              {savedCount > 0 && (
                <p className="text-green-500 text-xs font-sans">{savedCount} watches added this session</p>
              )}
            </div>
          </div>
          <button
            onClick={handleSaveAndContinue}
            disabled={saving}
            className="btn-solid flex items-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
            ) : saved ? (
              <>
                <CheckCircle size={18} />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} />
                Save & Add Another
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Templates */}
        <div className="card-luxury p-6 mb-8">
          <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
            <Zap className="text-gold-500" size={18} />
            Quick Templates (Click to auto-fill)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickTemplates.map((template, i) => (
              <button
                key={i}
                onClick={() => applyQuickTemplate(template)}
                className="p-3 border border-luxury-gray/30 hover:border-gold-500 transition-all text-left"
              >
                <p className="text-gold-500 font-sans text-xs">{template.brand}</p>
                <p className="font-serif text-sm truncate">{template.name}</p>
                <p className="text-luxury-muted font-sans text-xs">${template.suggestedPrice.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Form */}
          <div className="card-luxury p-6">
            <h2 className="text-lg font-serif mb-6">Watch Details</h2>
            
            {/* Brand */}
            <div className="mb-4">
              <label className="label-luxury">Brand *</label>
              <select
                value={formData.brand}
                onChange={(e) => applyBrandTemplate(e.target.value)}
                className="input-luxury"
              >
                <option value="">Select brand...</option>
                {watchBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="label-luxury">Watch Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-luxury"
                placeholder="e.g. Submariner Date 126610LN"
              />
            </div>

            {/* Model & Collection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-luxury">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="input-luxury"
                  placeholder="e.g. Submariner"
                />
              </div>
              <div>
                <label className="label-luxury">Collection</label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="input-luxury"
                  placeholder="e.g. Professional"
                />
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="label-luxury">Price (USD) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-luxury"
                placeholder="e.g. 14500"
              />
            </div>

            {/* Case Size & Dial Color */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label-luxury">Case Size</label>
                <select
                  value={formData.case_size}
                  onChange={(e) => setFormData({ ...formData, case_size: e.target.value })}
                  className="input-luxury"
                >
                  {caseSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-luxury">Dial Color</label>
                <select
                  value={formData.dial_color}
                  onChange={(e) => setFormData({ ...formData, dial_color: e.target.value })}
                  className="input-luxury"
                >
                  {dialColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reference Number */}
            <div className="mb-4">
              <label className="label-luxury">Reference Number</label>
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                className="input-luxury"
                placeholder="e.g. 126610LN"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="label-luxury">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-luxury min-h-[100px] resize-none"
                placeholder="Watch description..."
              />
            </div>
          </div>

          {/* Right Column - Specs & Images */}
          <div className="space-y-6">
            {/* Auto-filled Specs */}
            <div className="card-luxury p-6">
              <h2 className="text-lg font-serif mb-4">Specifications (Auto-filled)</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Case Material</label>
                  <input
                    type="text"
                    value={formData.case_material}
                    onChange={(e) => setFormData({ ...formData, case_material: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">Movement</label>
                  <input
                    type="text"
                    value={formData.movement}
                    onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">Water Resistance</label>
                  <input
                    type="text"
                    value={formData.water_resistance}
                    onChange={(e) => setFormData({ ...formData, water_resistance: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="label-luxury">Strap/Bracelet</label>
                  <input
                    type="text"
                    value={formData.strap_material}
                    onChange={(e) => setFormData({ ...formData, strap_material: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card-luxury p-6">
              <h2 className="text-lg font-serif mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-gold-500" />
                Images
              </h2>
              
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
              />
            </div>

            {/* Save Button (Mobile) */}
            <button
              onClick={handleSaveAndContinue}
              disabled={saving}
              className="btn-solid w-full flex items-center justify-center gap-2 lg:hidden"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <CheckCircle size={18} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save & Add Another
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}