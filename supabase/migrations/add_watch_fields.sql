-- Add model and sold_out columns to watches table
-- Run this in Supabase SQL Editor

-- Add model column
ALTER TABLE watches ADD COLUMN IF NOT EXISTS model text;

-- Add sold_out column
ALTER TABLE watches ADD COLUMN IF NOT EXISTS sold_out boolean DEFAULT false;

-- Update active column if it doesn't exist
ALTER TABLE watches ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
