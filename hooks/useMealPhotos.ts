import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface MealPhoto {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url: string | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  notes: string | null;
  logged_at: string;
}

export interface MealPhotoInput {
  imageUrl: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

// Predefined calorie estimates by meal category
export const mealCalorieEstimates = {
  breakfast: { min: 200, max: 600, avg: 350 },
  lunch: { min: 400, max: 800, avg: 550 },
  dinner: { min: 500, max: 1000, avg: 700 },
  snack: { min: 100, max: 400, avg: 200 },
};

// Common foods for quick estimation (calories per serving)
export const quickFoods = [
  { name: 'Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: 'Toast (2 slices)', calories: 180, protein: 6, carbs: 32, fat: 2 },
  { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: 'Rice (1 cup)', calories: 200, protein: 4, carbs: 44, fat: 0 },
  { name: 'Salad', calories: 50, protein: 2, carbs: 8, fat: 1 },
  { name: 'Pasta', calories: 300, protein: 10, carbs: 60, fat: 2 },
  { name: 'Burger', calories: 500, protein: 25, carbs: 45, fat: 25 },
  { name: 'Pizza (2 slices)', calories: 400, protein: 18, carbs: 48, fat: 16 },
  { name: 'Sandwich', calories: 350, protein: 15, carbs: 40, fat: 12 },
  { name: 'Smoothie', calories: 180, protein: 5, carbs: 35, fat: 2 },
  { name: 'Yogurt', calories: 100, protein: 10, carbs: 15, fat: 0 },
  { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
];

export function useMealPhotos() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<MealPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('meal_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(50);
      
      if (fetchError) throw fetchError;
      setPhotos(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const addPhoto = async (input: MealPhotoInput): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const { error: insertError } = await supabase
        .from('meal_photos')
        .insert({
          user_id: user.id,
          image_url: input.imageUrl,
          meal_type: input.mealType,
          calories: input.calories,
          protein_g: input.protein,
          carbs_g: input.carbs,
          fat_g: input.fat,
          notes: input.notes,
        });
      
      if (insertError) throw insertError;
      
      await fetchPhotos();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deletePhoto = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: deleteError } = await supabase
        .from('meal_photos')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      setPhotos(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Get photos for a specific meal type today
  const getTodaysPhotosByMeal = useCallback((mealType: string) => {
    const today = new Date().toDateString();
    return photos.filter(p => 
      p.meal_type === mealType && 
      new Date(p.logged_at).toDateString() === today
    );
  }, [photos]);

  return {
    photos,
    loading,
    error,
    fetchPhotos,
    addPhoto,
    deletePhoto,
    getTodaysPhotosByMeal,
  };
}