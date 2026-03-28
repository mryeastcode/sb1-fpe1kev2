-- Fix: Add missing tables/policies (run in Supabase SQL Editor)

-- Check if user_profiles exists, if not create it
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

-- Enable RLS and add policies for user_profiles (drop first if exists)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ language 'plpgsql';
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, brand text DEFAULT '', barcode text UNIQUE,
  serving_size text NOT NULL DEFAULT '100g',
  calories_per_serving decimal(8,2) NOT NULL CHECK (calories_per_serving >= 0),
  protein_g decimal(6,2) DEFAULT 0, carbs_g decimal(6,2) DEFAULT 0, fat_g decimal(6,2) DEFAULT 0,
  fiber_g decimal(6,2) DEFAULT 0, sugar_g decimal(6,2) DEFAULT 0, sodium_mg decimal(8,2) DEFAULT 0,
  category text DEFAULT 'other',
  is_verified boolean DEFAULT false, created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read foods" ON foods;
DROP POLICY IF EXISTS "Users can create custom foods" ON foods;
DROP POLICY IF EXISTS "Users can update their custom foods" ON foods;
CREATE POLICY "Anyone can read foods" ON foods FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create custom foods" ON foods FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update their custom foods" ON foods FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Nutrition Logs
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  quantity decimal(8,2) NOT NULL CHECK (quantity > 0), unit text NOT NULL DEFAULT 'g',
  calories decimal(8,2) NOT NULL CHECK (calories >= 0),
  protein_g decimal(6,2) DEFAULT 0, carbs_g decimal(6,2) DEFAULT 0, fat_g decimal(6,2) DEFAULT 0,
  food_name text DEFAULT '',
  logged_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now()
);
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can insert own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can update own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can delete own nutrition logs" ON nutrition_logs;
CREATE POLICY "Users can read own nutrition logs" ON nutrition_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own nutrition logs" ON nutrition_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Weight Logs
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  weight_kg decimal(5,2) NOT NULL CHECK (weight_kg > 0),
  body_fat_percentage decimal(4,2), muscle_mass_percentage decimal(4,2),
  notes text DEFAULT '', logged_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now()
);
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own weight logs" ON weight_logs;
DROP POLICY IF EXISTS "Users can insert own weight logs" ON weight_logs;
DROP POLICY IF EXISTS "Users can update own weight logs" ON weight_logs;
DROP POLICY IF EXISTS "Users can delete own weight logs" ON weight_logs;
CREATE POLICY "Users can read own weight logs" ON weight_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own weight logs" ON weight_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own weight logs" ON weight_logs FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own weight logs" ON weight_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Water Logs
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount_ml integer NOT NULL CHECK (amount_ml > 0),
  logged_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now()
);
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own water logs" ON water_logs;
DROP POLICY IF EXISTS "Users can insert own water logs" ON water_logs;
DROP POLICY IF EXISTS "Users can delete own water logs" ON water_logs;
CREATE POLICY "Users can read own water logs" ON water_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own water logs" ON water_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own water logs" ON water_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Exercise Logs
CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  exercise_name text NOT NULL, duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  calories_burned integer DEFAULT 0, notes text DEFAULT '',
  logged_at timestamptz DEFAULT now(), created_at timestamptz DEFAULT now()
);
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can insert own exercise logs" ON exercise_logs;
DROP POLICY IF EXISTS "Users can delete own exercise logs" ON exercise_logs;
CREATE POLICY "Users can read own exercise logs" ON exercise_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own exercise logs" ON exercise_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own exercise logs" ON exercise_logs FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();