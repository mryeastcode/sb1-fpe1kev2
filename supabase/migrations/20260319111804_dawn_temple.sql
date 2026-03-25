/*
  # Create Weight Tracking Table

  1. New Tables
    - `weight_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `weight_kg` (decimal)
      - `body_fat_percentage` (decimal, optional)
      - `muscle_mass_percentage` (decimal, optional)
      - `notes` (text, optional)
      - `logged_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `weight_logs` table
    - Add policies for users to manage their own weight logs
*/

CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  weight_kg decimal(5,2) NOT NULL CHECK (weight_kg > 0),
  body_fat_percentage decimal(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  muscle_mass_percentage decimal(4,2) CHECK (muscle_mass_percentage >= 0 AND muscle_mass_percentage <= 100),
  notes text DEFAULT '',
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own weight logs"
  ON weight_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own weight logs"
  ON weight_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own weight logs"
  ON weight_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own weight logs"
  ON weight_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Index for faster queries
CREATE INDEX IF NOT EXISTS weight_logs_user_id_logged_at_idx 
  ON weight_logs(user_id, logged_at DESC);