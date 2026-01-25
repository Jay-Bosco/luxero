'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        uploadedUrls.push(data.url);
      } catch (err: any) {
        setError(err.message || 'Failed to upload image');
        console.error('Upload error:', err);
      }
    }

    if (uploadedUrls.length > 0) {
      // Filter out empty strings and add new URLs
      const currentImages = images.filter(img => img.trim() !== '');
      onImagesChange([...currentImages, ...uploadedUrls]);
    }

    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages.length > 0 ? newImages : ['']);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    onImagesChange(newImages);
  };

  const addUrlField = () => {
    onImagesChange([...images, '']);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-luxury-gray/50 hover:border-gold-500/50 transition-colors p-8 text-center cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            <p className="text-luxury-muted font-sans text-sm">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-luxury-muted" />
            <p className="text-luxury-light font-sans text-sm">
              Click to upload images
            </p>
            <p className="text-luxury-muted font-sans text-xs">
              JPEG, PNG, WebP, GIF (max 5MB each)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 font-sans text-sm">{error}</p>
      )}

      {/* Image Previews */}
      {images.some(img => img.trim() !== '') && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, index) => (
            img.trim() !== '' && (
              <div key={index} className="relative group">
                <div className="aspect-square bg-luxury-gray/30 overflow-hidden">
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            )
          ))}
        </div>
      )}

      {/* URL Input (fallback) */}
      <div className="pt-4 border-t border-luxury-gray/20">
        <p className="text-luxury-muted font-sans text-xs mb-3">
          Or add image URLs manually:
        </p>
        {images.map((img, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="url"
              value={img}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              className="input-luxury flex-1"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-3 text-luxury-muted hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addUrlField}
          className="text-gold-500 font-sans text-sm hover:underline"
        >
          + Add another image URL
        </button>
      </div>
    </div>
  );
}
