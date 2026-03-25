-- Meal Photos table for storing uploaded meal images
CREATE TABLE IF NOT EXISTS meal_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  calories INTEGER,
  protein_g DECIMAL(5,1),
  carbs_g DECIMAL(5,1),
  fat_g DECIMAL(5,1),
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE meal_photos ENABLE ROW LEVEL SECURITY;

-- Users can view their own meal photos
CREATE POLICY "Users can view own meal photos" ON meal_photos
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own meal photos
CREATE POLICY "Users can insert own meal photos" ON meal_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own meal photos
CREATE POLICY "Users can delete own meal photos" ON meal_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_meal_photos_user_date ON meal_photos(user_id, logged_at DESC);