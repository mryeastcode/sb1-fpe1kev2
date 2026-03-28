/*
  # Create Water Intake Tracking Table

  1. New Tables
    - `water_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `amount_ml` (integer) - amount in milliliters
      - `logged_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `water_logs` table
    - Add policies for users to manage their own water logs
*/

CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount_ml integer NOT NULL CHECK (amount_ml > 0),
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own water logs"
  ON water_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own water logs"
  ON water_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own water logs"
  ON water_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own water logs"
  ON water_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Index for faster queries
CREATE INDEX IF NOT EXISTS water_logs_user_id_logged_at_idx 
  ON water_logs(user_id, logged_at DESC);