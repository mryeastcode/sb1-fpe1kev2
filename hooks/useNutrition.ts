import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

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
  category: string;
  is_verified: boolean;
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
  food_name?: string;
}

export function useNutrition() {
  const { user } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [todaysTotals, setTodaysTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Fetch foods from database
  const fetchFoods = useCallback(async (search = '') => {
    try {
      let query = supabase
        .from('foods')
        .select('*')
        .order('name');

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      setFoods(data || []);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  }, []);

  // Fetch today's nutrition logs
  const fetchTodaysLogs = useCallback(async () => {
    if (!user) return;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', today.toISOString())
        .lt('logged_at', tomorrow.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;
      
      setNutritionLogs(data || []);
      
      // Calculate totals
      const totals = (data || []).reduce(
        (acc, log) => ({
          calories: acc.calories + (log.calories || 0),
          protein: acc.protein + (log.protein_g || 0),
          carbs: acc.carbs + (log.carbs_g || 0),
          fat: acc.fat + (log.fat_g || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      setTodaysTotals(totals);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    }
  }, [user]);

  // Log a food
  const logFood = async (
    food: Food | { name: string; calories_per_serving: number; protein_g: number; carbs_g: number; fat_g: number },
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    quantity: number,
    unit: string = 'serving'
  ) => {
    if (!user) return;

    try {
      const calories = Math.round(food.calories_per_serving * quantity);
      const protein = Math.round((food.protein_g || 0) * quantity * 10) / 10;
      const carbs = Math.round((food.carbs_g || 0) * quantity * 10) / 10;
      const fat = Math.round((food.fat_g || 0) * quantity * 10) / 10;

      const { error } = await supabase
        .from('nutrition_logs')
        .insert({
          user_id: user.id,
          food_id: 'id' in food ? food.id : null,
          food_name: food.name,
          meal_type: mealType,
          quantity,
          unit,
          calories,
          protein_g: protein,
          carbs_g: carbs,
          fat_g: fat,
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Refresh logs
      await fetchTodaysLogs();
      return { success: true };
    } catch (error) {
      console.error('Error logging food:', error);
      return { success: false, error };
    }
  };

  // Delete a nutrition log
  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      await fetchTodaysLogs();
      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return { success: false, error };
    }
  };

  // Add custom food
  const addCustomFood = async (foodData: Omit<Food, 'id' | 'created_at' | 'is_verified'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('foods')
        .insert({
          ...foodData,
          created_by: user.id,
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchFoods();
      return { success: true, food: data };
    } catch (error) {
      console.error('Error adding custom food:', error);
      return { success: false, error };
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchFoods();
      fetchTodaysLogs();
    }
  }, [user, fetchFoods, fetchTodaysLogs]);

  return {
    foods,
    nutritionLogs,
    loading,
    todaysTotals,
    fetchFoods,
    fetchTodaysLogs,
    logFood,
    deleteLog,
    addCustomFood,
  };
}