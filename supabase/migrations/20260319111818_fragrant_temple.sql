/*
  # Create Nutrition Tracking Tables

  1. New Tables
    - `nutrition_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `food_id` (uuid, foreign key to foods)
      - `meal_type` (text) - breakfast, lunch, dinner, snack
      - `quantity` (decimal) - amount consumed
      - `unit` (text) - g, cups, pieces, etc.
      - `calories` (decimal) - calculated calories
      - `protein_g` (decimal)
      - `carbs_g` (decimal)
      - `fat_g` (decimal)
      - `logged_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `nutrition_logs` table
    - Add policies for users to manage their own nutrition logs
*/

CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  quantity decimal(8,2) NOT NULL CHECK (quantity > 0),
  unit text NOT NULL DEFAULT 'g',
  calories decimal(8,2) NOT NULL CHECK (calories >= 0),
  protein_g decimal(6,2) DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g decimal(6,2) DEFAULT 0 CHECK (carbs_g >= 0),
  fat_g decimal(6,2) DEFAULT 0 CHECK (fat_g >= 0),
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own nutrition logs"
  ON nutrition_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own nutrition logs"
  ON nutrition_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own nutrition logs"
  ON nutrition_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own nutrition logs"
  ON nutrition_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_logged_at_idx 
  ON nutrition_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_meal_type_idx 
  ON nutrition_logs(user_id, meal_type, logged_at DESC);