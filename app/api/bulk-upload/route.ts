import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProductData {
  name: string;
  brand: string;
  collection?: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  featured: boolean;
  active: boolean;
  images: string[];
  specifications: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Find CSV file
    let csvContent = '';
    let csvFileName = '';
    
    for (const [filename, zipEntry] of Object.entries(zip.files)) {
      if (filename.endsWith('.csv') && !filename.startsWith('__MACOSX')) {
        csvContent = await zipEntry.async('string');
        csvFileName = filename;
        break;
      }
    }

    if (!csvContent) {
      return NextResponse.json({ error: 'No CSV file found in ZIP' }, { status: 400 });
    }

    // Parse CSV
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    const products: ProductData[] = [];
    const errors: string[] = [];
    const uploadedImages: Map<string, string> = new Map();

    // First pass: upload all images
    for (const [filename, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir || filename.startsWith('__MACOSX')) continue;
      
      const ext = filename.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) continue;

      try {
        const imageBuffer = await zipEntry.async('uint8array');
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const storagePath = `watches/${timestamp}-${randomStr}.${ext}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from('products')
          .upload(storagePath, imageBuffer, {
            contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
            cacheControl: '3600'
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('products')
            .getPublicUrl(storagePath);
          
          // Store with just filename (no path)
          const justFilename = filename.split('/').pop() || filename;
          uploadedImages.set(justFilename.toLowerCase(), publicUrl);
        }
      } catch (err) {
        console.error(`Failed to upload ${filename}:`, err);
      }
    }

    // Second pass: parse products and match images
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const product: Record<string, string> = {};

      headers.forEach((header, index) => {
        product[header] = values[index]?.trim().replace(/^"|"$/g, '') || '';
      });

      // Validate required fields
      if (!product.name || !product.brand || !product.price) {
        errors.push(`Row ${i + 1}: Missing required fields (name, brand, or price)`);
        continue;
      }

      const price = parseFloat(product.price);
      if (isNaN(price)) {
        errors.push(`Row ${i + 1}: Invalid price`);
        continue;
      }

      // Collect images
      const images: string[] = [];
      
      // Check for image_1, image_2, image_3 columns (filenames)
      for (let imgNum = 1; imgNum <= 5; imgNum++) {
        const imgField = product[`image_${imgNum}`] || product[`image${imgNum}`];
        if (imgField) {
          // Check if it's a URL or filename
          if (imgField.startsWith('http')) {
            images.push(imgField);
          } else {
            // Look up uploaded image
            const url = uploadedImages.get(imgField.toLowerCase());
            if (url) {
              images.push(url);
            }
          }
        }
      }

      // Also check image_url_1, image_url_2 for backwards compatibility
      for (let imgNum = 1; imgNum <= 5; imgNum++) {
        const imgField = product[`image_url_${imgNum}`];
        if (imgField && imgField.startsWith('http')) {
          images.push(imgField);
        }
      }

      products.push({
        name: product.name,
        brand: product.brand,
        collection: product.collection || undefined,
        description: product.description || '',
        price: Math.round(price * 100),
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

    // Insert products
    if (products.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('watches')
        .insert(products);

      if (insertError) {
        return NextResponse.json({ 
          error: 'Failed to insert products: ' + insertError.message 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      imported: products.length,
      imagesUploaded: uploadedImages.size,
      errors
    });

  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to process ZIP: ' + error.message 
    }, { status: 500 });
  }
}

function parseCSVLine(line: string): string[] {
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
}
