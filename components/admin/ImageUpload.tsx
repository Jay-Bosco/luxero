'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, GripVertical, ArrowLeft, ArrowRight } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
      const currentImages = images.filter(img => img.trim() !== '');
      onImagesChange([...currentImages, ...uploadedUrls]);
    }

    setUploading(false);

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

  // --- Reorder helpers ---
  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    const filtered = images.filter(img => img.trim() !== '');
    if (toIndex < 0 || toIndex >= filtered.length) return;
    const newImages = [...filtered];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // --- Drag handlers ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag image semi-transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 60, 60);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toIndex) {
      moveImage(dragIndex, toIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // Filter to only images that have content (for preview grid)
  const filledImages = images
    .map((img, originalIndex) => ({ url: img, originalIndex }))
    .filter(item => item.url.trim() !== '');

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

      {/* Image Previews with Drag & Drop */}
      {filledImages.length > 0 && (
        <div>
          {filledImages.length > 1 && (
            <p className="text-luxury-muted font-sans text-xs mb-2">
              Drag to reorder · First image is the main product photo
            </p>
          )}
          <div className="grid grid-cols-4 gap-4">
            {filledImages.map((item, gridIndex) => (
              <div
                key={`${item.originalIndex}-${item.url}`}
                draggable
                onDragStart={(e) => handleDragStart(e, gridIndex)}
                onDragOver={(e) => handleDragOver(e, gridIndex)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, gridIndex)}
                onDragEnd={handleDragEnd}
                className={`
                  relative group cursor-grab active:cursor-grabbing
                  transition-all duration-200
                  ${dragIndex === gridIndex ? 'opacity-30 scale-95' : ''}
                  ${dragOverIndex === gridIndex && dragIndex !== gridIndex
                    ? 'ring-2 ring-gold-500 ring-offset-2 ring-offset-luxury-dark scale-105'
                    : ''
                  }
                `}
              >
                <div className="aspect-square bg-luxury-gray/30 overflow-hidden relative">
                  <img
                    src={item.url}
                    alt={`Product ${gridIndex + 1}`}
                    className="w-full h-full object-contain p-2 pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

                  {/* Drag handle overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <GripVertical
                      size={24}
                      className="text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg"
                    />
                  </div>

                  {/* Position badge */}
                  <div className="absolute top-1 left-1 w-5 h-5 bg-black/70 text-white text-[10px] font-sans font-bold flex items-center justify-center">
                    {gridIndex + 1}
                  </div>

                  {/* "Main" label on first image */}
                  {gridIndex === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gold-500/90 text-luxury-black text-[9px] font-sans font-bold uppercase tracking-wider text-center py-0.5">
                      Main
                    </div>
                  )}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(item.originalIndex);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X size={14} />
                </button>

                {/* Arrow buttons for non-drag fallback */}
                {filledImages.length > 1 && (
                  <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {gridIndex > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(gridIndex, gridIndex - 1);
                        }}
                        className="w-5 h-5 bg-black/70 hover:bg-black text-white flex items-center justify-center"
                        title="Move left"
                      >
                        <ArrowLeft size={12} />
                      </button>
                    )}
                    {gridIndex < filledImages.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(gridIndex, gridIndex + 1);
                        }}
                        className="w-5 h-5 bg-black/70 hover:bg-black text-white flex items-center justify-center"
                        title="Move right"
                      >
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
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