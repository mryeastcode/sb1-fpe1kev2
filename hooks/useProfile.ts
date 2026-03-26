import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  body_fat_percentage?: number;
  muscle_mass_percentage?: number;
  notes: string;
  logged_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  activity_level?: string;
  goal_type?: string;
  target_weight_kg?: number;
  daily_calorie_goal?: number;
  daily_protein_goal?: number;
  daily_carb_goal?: number;
  daily_fat_goal?: number;
  daily_water_goal?: number;
  weekly_exercise_goal?: number;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  // Fetch weight logs
  const fetchWeightLogs = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setWeightLogs(data || []);
    } catch (error) {
      console.error('Error fetching weight logs:', error);
    }
  }, [user]);

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchProfile();
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  };

  // Log weight
  const logWeight = async (
    weightKg: number,
    bodyFatPercentage?: number,
    notes: string = ''
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: user.id,
          weight_kg: weightKg,
          body_fat_percentage: bodyFatPercentage,
          notes,
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      await fetchWeightLogs();
      return { success: true };
    } catch (error: any) {
      console.error('Error logging weight:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete weight log
  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('weight_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      await fetchWeightLogs();
      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return { success: false, error };
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchWeightLogs();
    }
  }, [user, fetchProfile, fetchWeightLogs]);

  return {
    profile,
    weightLogs,
    loading,
    fetchProfile,
    fetchWeightLogs,
    updateProfile,
    logWeight,
    deleteLog,
  };
}