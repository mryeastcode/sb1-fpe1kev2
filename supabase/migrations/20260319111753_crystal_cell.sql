/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `height_cm` (integer)
      - `activity_level` (text)
      - `goal_type` (text) - weight_loss, weight_gain, maintain, muscle_gain
      - `target_weight_kg` (decimal)
      - `daily_calorie_goal` (integer)
      - `daily_protein_goal` (integer)
      - `daily_carb_goal` (integer)
      - `daily_fat_goal` (integer)
      - `daily_water_goal` (integer) - in ml
      - `weekly_exercise_goal` (integer) - minutes per week
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  height_cm integer CHECK (height_cm > 0 AND height_cm < 300),
  activity_level text DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal_type text DEFAULT 'maintain' CHECK (goal_type IN ('weight_loss', 'weight_gain', 'maintain', 'muscle_gain')),
  target_weight_kg decimal(5,2) CHECK (target_weight_kg > 0),
  daily_calorie_goal integer DEFAULT 2000 CHECK (daily_calorie_goal > 0),
  daily_protein_goal integer DEFAULT 120 CHECK (daily_protein_goal > 0),
  daily_carb_goal integer DEFAULT 250 CHECK (daily_carb_goal > 0),
  daily_fat_goal integer DEFAULT 85 CHECK (daily_fat_goal > 0),
  daily_water_goal integer DEFAULT 2000 CHECK (daily_water_goal > 0),
  weekly_exercise_goal integer DEFAULT 150 CHECK (weekly_exercise_goal > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();