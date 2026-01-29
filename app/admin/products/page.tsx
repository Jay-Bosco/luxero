'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  X, 
  Upload,
  Save,
  Image as ImageIcon,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  Archive,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Watch } from '@/types';
import { formatPrice } from '@/lib/cart';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminProductsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [watches, setWatches] = useState<Watch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);
  const [saving, setSaving] = useState(false);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const [zipUploading, setZipUploading] = useState(false);
  const [zipResult, setZipResult] = useState<{ imported: number; imagesUploaded: number; errors: string[] } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    collection: '',
    description: '',
    price: '',
    currency: 'USD',
    images: [''],
    stock: '1',
    featured: false,
    sold_out: false,
    active: true,
    specifications: {
      case_size: '',
      case_material: '',
      movement: '',
      water_resistance: '',
      power_reserve: '',
      dial_color: '',
      strap_material: '',
      reference_number: ''
    }
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

    await loadWatches();
    setLoading(false);
  };

  const loadWatches = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('watches')
      .select('*')
      .order('created_at', { ascending: false });
    
    setWatches(data || []);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      collection: '',
      description: '',
      price: '',
      currency: 'USD',
      images: [''],
      stock: '1',
      featured: false,
      sold_out: false,
      active: true,
      specifications: {
        case_size: '',
        case_material: '',
        movement: '',
        water_resistance: '',
        power_reserve: '',
        dial_color: '',
        strap_material: '',
        reference_number: ''
      }
    });
    setEditingWatch(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (watch: Watch) => {
    setEditingWatch(watch);
    setFormData({
      name: watch.name,
      brand: watch.brand,
      model: watch.model || '',
      collection: watch.collection || '',
      description: watch.description || '',
      price: String(watch.price / 100),
      currency: watch.currency || 'USD',
      images: watch.images?.length ? watch.images : [''],
      stock: String(watch.stock),
      featured: watch.featured,
      sold_out: watch.sold_out || false,
      active: watch.active !== false,
      specifications: watch.specifications || {
        case_size: '',
        case_material: '',
        movement: '',
        water_resistance: '',
        power_reserve: '',
        dial_color: '',
        strap_material: '',
        reference_number: ''
      }
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const watchData = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model || null,
      collection: formData.collection || null,
      description: formData.description,
      price: Math.round(parseFloat(formData.price) * 100),
      currency: formData.currency,
      images: formData.images.filter(img => img.trim() !== ''),
      stock: parseInt(formData.stock) || 0,
      featured: formData.featured,
      sold_out: formData.sold_out,
      active: formData.active,
      specifications: formData.specifications
    };

    try {
      if (editingWatch) {
        await supabase
          .from('watches')
          .update(watchData)
          .eq('id', editingWatch.id);
      } else {
        await supabase
          .from('watches')
          .insert(watchData);
      }

      await loadWatches();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving watch:', error);
      alert('Failed to save watch');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (watchId: string) => {
    if (!confirm('Are you sure you want to delete this watch?')) return;

    const supabase = createClient();
    await supabase.from('watches').delete().eq('id', watchId);
    await loadWatches();
  };

  const handleToggleSoldOut = async (watchId: string, soldOut: boolean) => {
    const supabase = createClient();
    
    // Optimistically update the UI
    setWatches(watches.map(w => 
      w.id === watchId ? { ...w, sold_out: soldOut } : w
    ));

    // Update in database
    const { error } = await supabase
      .from('watches')
      .update({ sold_out: soldOut })
      .eq('id', watchId);

    if (error) {
      console.error('Error updating sold out status:', error);
      // Revert on error
      await loadWatches();
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [''] });
  };

  // CSV Template download
  const downloadTemplate = () => {
    const headers = [
      'name',
      'brand',
      'collection',
      'description',
      'price',
      'stock',
      'featured',
      'image_1',
      'image_2',
      'image_3',
      'case_size',
      'case_material',
      'movement',
      'water_resistance',
      'power_reserve',
      'dial_color',
      'strap_material',
      'reference_number'
    ];
    
    const exampleRow1 = [
      'Submariner Date',
      'Rolex',
      'Submariner',
      'The Oyster Perpetual Submariner Date in Oystersteel...',
      '15000',
      '1',
      'true',
      'submariner.jpg',
      'submariner-2.jpg',
      '',
      '41mm',
      'Oystersteel',
      'Automatic',
      '300m',
      '70 hours',
      'Black',
      'Oystersteel Bracelet',
      '126610LN'
    ];

    const exampleRow2 = [
      'Speedmaster Moonwatch',
      'Omega',
      'Speedmaster',
      'The iconic chronograph worn on the moon...',
      '7500',
      '2',
      'true',
      'speedmaster.jpg',
      '',
      '',
      '42mm',
      'Stainless Steel',
      'Manual',
      '50m',
      '48 hours',
      'Black',
      'Leather',
      '310.30.42.50.01.001'
    ];

    const csv = [headers.join(','), exampleRow1.join(','), exampleRow2.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luxero_products_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const products: any[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const product: any = {};
          
          headers.forEach((header, index) => {
            product[header] = values[index]?.trim() || '';
          });

          // Validate required fields
          if (!product.name || !product.brand || !product.price) {
            errors.push(`Row ${i + 1}: Missing required fields (name, brand, or price)`);
            continue;
          }

          // Parse price
          const price = parseFloat(product.price);
          if (isNaN(price)) {
            errors.push(`Row ${i + 1}: Invalid price`);
            continue;
          }

          // Build product object
          const images: string[] = [];
          if (product.image_url_1) images.push(product.image_url_1);
          if (product.image_url_2) images.push(product.image_url_2);
          if (product.image_url_3) images.push(product.image_url_3);

          products.push({
            name: product.name,
            brand: product.brand,
            collection: product.collection || null,
            description: product.description || '',
            price: Math.round(price * 100), // Convert to cents
            currency: 'USD',
            stock: parseInt(product.stock) || 1,
            featured: product.featured?.toLowerCase() === 'true',
            active: true,
            images,
            specifications: {
              case_size: product.case_size || '',
              case_material: product.case_material || '',
              movement: product.movement || '',
              water_resistance: product.water_resistance || '',
              power_reserve: product.power_reserve || '',
              dial_color: product.dial_color || '',
              strap_material: product.strap_material || '',
              reference_number: product.reference_number || ''
            }
          });
        }

        setBulkData(products);
        setBulkErrors(errors);
        setBulkSuccess(false);
        setShowBulkModal(true);
      } catch (err) {
        alert('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to parse CSV lines with quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  // ZIP Bulk Upload with Images
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setZipUploading(true);
    setZipResult(null);
    setBulkErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setZipResult({
        imported: data.imported,
        imagesUploaded: data.imagesUploaded,
        errors: data.errors || []
      });

      await loadWatches();

      // Close modal after showing results
      setTimeout(() => {
        setShowBulkModal(false);
        setZipResult(null);
      }, 3000);
    } catch (error: any) {
      setBulkErrors([error.message || 'Failed to upload ZIP']);
    } finally {
      setZipUploading(false);
      if (zipInputRef.current) {
        zipInputRef.current.value = '';
      }
    }
  };

  // Bulk import
  const handleBulkImport = async () => {
    if (bulkData.length === 0) return;
    
    setSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('watches')
        .insert(bulkData);

      if (error) throw error;

      setBulkSuccess(true);
      await loadWatches();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowBulkModal(false);
        setBulkData([]);
        setBulkErrors([]);
        setBulkSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Bulk import error:', error);
      setBulkErrors([...bulkErrors, 'Failed to import products. Please try again.']);
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-xl font-serif">Manage Products</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* CSV Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            {/* ZIP Upload */}
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip"
              onChange={handleZipUpload}
              className="hidden"
            />
            <button
              onClick={downloadTemplate}
              className="btn-primary flex items-center gap-2"
              title="Download CSV template"
            >
              <Download size={18} />
              Template
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FileSpreadsheet size={18} />
              Bulk Upload
            </button>
            <button onClick={openAddModal} className="btn-solid flex items-center gap-2">
              <Plus size={18} />
              Add Watch
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Products Table */}
        <div className="card-luxury overflow-hidden">
          <table className="w-full">
            <thead className="bg-luxury-dark/50">
              <tr>
                <th className="text-left px-6 py-4 font-sans text-xs tracking-wide uppercase text-luxury-muted">Product</th>
                <th className="text-left px-6 py-4 font-sans text-xs tracking-wide uppercase text-luxury-muted">Price</th>
                <th className="text-left px-6 py-4 font-sans text-xs tracking-wide uppercase text-luxury-muted">Stock</th>
                <th className="text-left px-6 py-4 font-sans text-xs tracking-wide uppercase text-luxury-muted">Status</th>
                <th className="text-center px-6 py-4 font-sans text-xs tracking-wide uppercase text-luxury-muted">Sold Out</th>
                <th className="text-right px-6 py-4 font-sans text-xs tracking-wide uppercase text-luxury-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watches.map((watch) => (
                <tr key={watch.id} className={`border-t border-luxury-gray/20 ${watch.sold_out ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-luxury-gray/30 flex-shrink-0 relative">
                        {watch.images?.[0] ? (
                          <img src={watch.images[0]} alt="" className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-luxury-muted" />
                          </div>
                        )}
                        {watch.sold_out && (
                          <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                            <span className="text-[8px] font-sans uppercase text-red-400 font-bold">Sold</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-serif">{watch.name}</p>
                        <p className="text-luxury-muted font-sans text-sm">{watch.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gold-500 font-serif">
                    {formatPrice(watch.price, watch.currency)}
                  </td>
                  <td className="px-6 py-4 font-sans text-sm">
                    {watch.stock}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-sans uppercase tracking-wide px-2 py-1 ${
                      watch.sold_out ? 'bg-red-500/20 text-red-400' :
                      watch.featured ? 'bg-gold-500/20 text-gold-500' : 'bg-luxury-gray/30 text-luxury-muted'
                    }`}>
                      {watch.sold_out ? 'Sold Out' : watch.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watch.sold_out || false}
                        onChange={(e) => handleToggleSoldOut(watch.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-luxury-gray/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(watch)}
                        className="p-2 text-luxury-muted hover:text-gold-500 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(watch.id)}
                        className="p-2 text-luxury-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {watches.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-luxury-muted font-sans">
                    No products yet. Click "Add Watch" to create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card-luxury w-full max-w-3xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-luxury-gray/30">
                <h2 className="text-xl font-serif">
                  {editingWatch ? 'Edit Watch' : 'Add New Watch'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-luxury-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-luxury">Watch Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div>
                      <label className="label-luxury">Brand *</label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="input-luxury"
                        placeholder="e.g., Rolex, Omega"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="label-luxury">Model</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="input-luxury"
                        placeholder="e.g., 126610LN"
                      />
                    </div>
                    <div>
                      <label className="label-luxury">Collection</label>
                      <input
                        type="text"
                        value={formData.collection}
                        onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                        className="input-luxury"
                        placeholder="e.g., Submariner, Speedmaster"
                      />
                    </div>
                    <div>
                      <label className="label-luxury">Price (USD) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="input-luxury"
                        placeholder="e.g., 15000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-luxury">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-luxury min-h-[100px] resize-none"
                      placeholder="Describe the watch..."
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label className="label-luxury">Product Images</label>
                    <ImageUpload
                      images={formData.images}
                      onImagesChange={(images) => setFormData({ ...formData, images })}
                    />
                  </div>

                  {/* Stock & Status */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="label-luxury">Stock Quantity</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="input-luxury"
                        min="0"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <label htmlFor="featured" className="font-sans text-sm">Featured</label>
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="sold_out"
                        checked={formData.sold_out}
                        onChange={(e) => setFormData({ ...formData, sold_out: e.target.checked })}
                        className="w-5 h-5 accent-red-500"
                      />
                      <label htmlFor="sold_out" className="font-sans text-sm text-red-400">Sold Out</label>
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <label htmlFor="active" className="font-sans text-sm">Active (Visible)</label>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="font-sans text-sm tracking-wide uppercase text-luxury-muted mb-4">Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key}>
                          <label className="label-luxury">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setFormData({
                              ...formData,
                              specifications: { ...formData.specifications, [key]: e.target.value }
                            })}
                            className="input-luxury"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 border-t border-luxury-gray/30">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name || !formData.brand || !formData.price}
                  className="btn-solid flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {editingWatch ? 'Update' : 'Add'} Watch
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card-luxury w-full max-w-3xl my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-luxury-gray/30">
                <h2 className="text-xl font-serif">Bulk Import Products</h2>
                <button onClick={() => {
                  setShowBulkModal(false);
                  setBulkData([]);
                  setBulkErrors([]);
                  setZipResult(null);
                }} className="text-luxury-muted hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Success States */}
                {(bulkSuccess || zipResult) ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif mb-2">Import Successful!</h3>
                    <p className="text-luxury-muted font-sans">
                      {zipResult ? (
                        <>
                          {zipResult.imported} products imported
                          {zipResult.imagesUploaded > 0 && `, ${zipResult.imagesUploaded} images uploaded`}
                        </>
                      ) : (
                        <>{bulkData.length} products have been added.</>
                      )}
                    </p>
                    {zipResult?.errors && zipResult.errors.length > 0 && (
                      <div className="mt-4 text-left max-w-md mx-auto">
                        <p className="text-yellow-500 font-sans text-sm mb-2">Warnings:</p>
                        <ul className="text-yellow-400/70 font-sans text-xs space-y-1">
                          {zipResult.errors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : zipUploading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-serif mb-2">Uploading...</h3>
                    <p className="text-luxury-muted font-sans">
                      Processing ZIP file and uploading images
                    </p>
                  </div>
                ) : bulkData.length > 0 ? (
                  <>
                    {/* CSV Preview */}
                    {bulkErrors.length > 0 && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="text-red-400 font-sans font-medium">Errors Found</span>
                        </div>
                        <ul className="text-red-300 font-sans text-sm space-y-1">
                          {bulkErrors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-luxury-light font-sans mb-4">
                      <span className="text-gold-500 font-medium">{bulkData.length}</span> products ready to import:
                    </p>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                      {bulkData.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-luxury-dark/50">
                          <div>
                            <p className="font-sans text-sm">{product.name}</p>
                            <p className="text-luxury-muted font-sans text-xs">{product.brand}</p>
                          </div>
                          <p className="text-gold-500 font-serif">{formatPrice(product.price)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setBulkData([]);
                          setBulkErrors([]);
                        }}
                        className="btn-primary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkImport}
                        disabled={saving}
                        className="btn-solid flex items-center gap-2"
                      >
                        {saving ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Upload size={18} />
                        )}
                        Import {bulkData.length} Products
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Upload Options */}
                    {bulkErrors.length > 0 && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="text-red-400 font-sans font-medium">Error</span>
                        </div>
                        <ul className="text-red-300 font-sans text-sm space-y-1">
                          {bulkErrors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* ZIP Upload - With Images */}
                      <div
                        onClick={() => zipInputRef.current?.click()}
                        className="border-2 border-dashed border-gold-500/50 hover:border-gold-500 transition-colors p-8 text-center cursor-pointer group"
                      >
                        <Archive className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                        <h3 className="font-serif text-lg mb-2 group-hover:text-gold-500 transition-colors">
                          ZIP with Images
                        </h3>
                        <p className="text-luxury-muted font-sans text-sm mb-4">
                          Upload a ZIP containing your CSV and product images
                        </p>
                        <span className="text-gold-500 font-sans text-xs uppercase tracking-wide">
                          Recommended
                        </span>
                      </div>

                      {/* CSV Only */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-luxury-gray/50 hover:border-gold-500/50 transition-colors p-8 text-center cursor-pointer group"
                      >
                        <FileSpreadsheet className="w-12 h-12 text-luxury-muted group-hover:text-gold-500 transition-colors mx-auto mb-4" />
                        <h3 className="font-serif text-lg mb-2 group-hover:text-gold-500 transition-colors">
                          CSV Only
                        </h3>
                        <p className="text-luxury-muted font-sans text-sm mb-4">
                          Upload CSV with image URLs (no image upload)
                        </p>
                        <span className="text-luxury-muted font-sans text-xs uppercase tracking-wide">
                          URLs Required
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 p-6 bg-luxury-dark/50">
                      <h4 className="font-sans text-sm font-medium mb-4">ZIP File Structure:</h4>
                      <pre className="text-luxury-muted font-mono text-xs leading-relaxed">
{`your-products.zip
├── products.csv
├── watch1.jpg
├── watch2.png
├── watch3.jpg
└── ...`}
                      </pre>
                      <p className="text-luxury-muted font-sans text-xs mt-4">
                        In your CSV, use <code className="text-gold-500">image_1</code>, <code className="text-gold-500">image_2</code> columns with just the filename (e.g., <code className="text-gold-500">watch1.jpg</code>)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
