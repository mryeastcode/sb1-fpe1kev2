import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height_cm?: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal_type: 'weight_loss' | 'weight_gain' | 'maintain' | 'muscle_gain';
  target_weight_kg?: number;
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_carb_goal: number;
  daily_fat_goal: number;
  daily_water_goal: number;
  weekly_exercise_goal: number;
  created_at: string;
  updated_at: string;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  serving_size: string;
  calories_per_serving: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  category: 'fruits' | 'vegetables' | 'grains' | 'protein' | 'dairy' | 'nuts_seeds' | 'beverages' | 'snacks' | 'condiments' | 'other';
  is_verified: boolean;
  created_by?: string;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  food_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  logged_at: string;
  created_at: string;
  foods?: Food;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  muscle_groups: string[];
  equipment_needed: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  calories_per_minute: number;
  instructions: string;
  is_verified: boolean;
  created_by?: string;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_id: string;
  duration_minutes: number;
  calories_burned: number;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  distance_km?: number;
  notes: string;
  logged_at: string;
  created_at: string;
  exercises?: Exercise;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_percentage?: number;
  notes: string;
  logged_at: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'nutrition' | 'exercise' | 'weight' | 'streak' | 'general';
  criteria: Record<string, any>;
  points: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
  achievements?: Achievement;
}