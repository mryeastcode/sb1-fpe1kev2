/*
  # Create Exercise Tracking Tables

  1. New Tables
    - `exercise_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `exercise_id` (uuid, foreign key to exercises)
      - `duration_minutes` (integer)
      - `calories_burned` (decimal)
      - `sets` (integer, optional for strength training)
      - `reps` (integer, optional for strength training)
      - `weight_kg` (decimal, optional for strength training)
      - `distance_km` (decimal, optional for cardio)
      - `notes` (text, optional)
      - `logged_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `exercise_logs` table
    - Add policies for users to manage their own exercise logs
*/

CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  calories_burned decimal(8,2) NOT NULL CHECK (calories_burned >= 0),
  sets integer CHECK (sets > 0),
  reps integer CHECK (reps > 0),
  weight_kg decimal(6,2) CHECK (weight_kg > 0),
  distance_km decimal(8,2) CHECK (distance_km > 0),
  notes text DEFAULT '',
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own exercise logs"
  ON exercise_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own exercise logs"
  ON exercise_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own exercise logs"
  ON exercise_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own exercise logs"
  ON exercise_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS exercise_logs_user_id_logged_at_idx 
  ON exercise_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS exercise_logs_user_id_exercise_id_idx 
  ON exercise_logs(user_id, exercise_id, logged_at DESC);