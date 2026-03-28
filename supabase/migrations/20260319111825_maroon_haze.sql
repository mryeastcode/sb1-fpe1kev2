/*
  # Create Exercise Database Tables

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text) - cardio, strength, flexibility, sports
      - `muscle_groups` (text array) - chest, back, legs, etc.
      - `equipment_needed` (text array) - dumbbells, barbell, none, etc.
      - `difficulty_level` (text) - beginner, intermediate, advanced
      - `calories_per_minute` (decimal) - average calories burned per minute
      - `instructions` (text)
      - `is_verified` (boolean)
      - `created_by` (uuid, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `exercises` table
    - Add policies for reading all exercises and creating custom exercises
*/

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('cardio', 'strength', 'flexibility', 'sports', 'other')),
  muscle_groups text[] DEFAULT '{}',
  equipment_needed text[] DEFAULT '{}',
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  calories_per_minute decimal(5,2) DEFAULT 5.0 CHECK (calories_per_minute >= 0),
  instructions text DEFAULT '',
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create custom exercises"
  ON exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their custom exercises"
  ON exercises
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Indexes for better search performance
CREATE INDEX IF NOT EXISTS exercises_name_idx ON exercises USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS exercises_category_idx ON exercises(category);
CREATE INDEX IF NOT EXISTS exercises_muscle_groups_idx ON exercises USING gin(muscle_groups);