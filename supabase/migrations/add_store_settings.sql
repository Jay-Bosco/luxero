-- Create store_settings table for homepage stats
CREATE TABLE IF NOT EXISTS store_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_rating DECIMAL(2,1) DEFAULT 4.9,
  total_reviews INTEGER DEFAULT 1250,
  total_customers INTEGER DEFAULT 850,
  years_in_business INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default values
INSERT INTO store_settings (id, store_rating, total_reviews, total_customers, years_in_business)
VALUES (1, 4.9, 1250, 850, 5)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read store settings (for homepage)
CREATE POLICY "Anyone can read store settings" ON store_settings
  FOR SELECT USING (true);

-- Only authenticated users can update (will be restricted to admin in app)
CREATE POLICY "Authenticated users can update store settings" ON store_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert store settings" ON store_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
