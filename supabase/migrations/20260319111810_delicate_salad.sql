/*
  # Create Food Database Tables

  1. New Tables
    - `foods`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `brand` (text, optional)
      - `barcode` (text, optional, unique)
      - `serving_size` (text) - e.g., "100g", "1 cup"
      - `calories_per_serving` (decimal)
      - `protein_g` (decimal)
      - `carbs_g` (decimal)
      - `fat_g` (decimal)
      - `fiber_g` (decimal)
      - `sugar_g` (decimal)
      - `sodium_mg` (decimal)
      - `category` (text)
      - `is_verified` (boolean) - admin verified foods
      - `created_by` (uuid, optional, references user_profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `foods` table
    - Add policies for reading all foods and creating custom foods
*/

CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text DEFAULT '',
  barcode text UNIQUE,
  serving_size text NOT NULL DEFAULT '100g',
  calories_per_serving decimal(8,2) NOT NULL CHECK (calories_per_serving >= 0),
  protein_g decimal(6,2) DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g decimal(6,2) DEFAULT 0 CHECK (carbs_g >= 0),
  fat_g decimal(6,2) DEFAULT 0 CHECK (fat_g >= 0),
  fiber_g decimal(6,2) DEFAULT 0 CHECK (fiber_g >= 0),
  sugar_g decimal(6,2) DEFAULT 0 CHECK (sugar_g >= 0),
  sodium_mg decimal(8,2) DEFAULT 0 CHECK (sodium_mg >= 0),
  category text DEFAULT 'other' CHECK (category IN (
    'fruits', 'vegetables', 'grains', 'protein', 'dairy', 
    'nuts_seeds', 'beverages', 'snacks', 'condiments', 'other'
  )),
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read foods"
  ON foods
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create custom foods"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their custom foods"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Indexes for better search performance
CREATE INDEX IF NOT EXISTS foods_name_idx ON foods USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS foods_brand_idx ON foods USING gin(to_tsvector('english', brand));
CREATE INDEX IF NOT EXISTS foods_category_idx ON foods(category);
CREATE INDEX IF NOT EXISTS foods_barcode_idx ON foods(barcode) WHERE barcode IS NOT NULL;