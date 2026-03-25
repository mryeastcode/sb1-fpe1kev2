import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
}

export function useWater() {
  const { user } = useAuth();
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [todaysIntake, setTodaysIntake] = useState(0);
  const [dailyGoal] = useState(2000); // ml
  const [loading, setLoading] = useState(false);

  // Fetch today's water logs
  const fetchWaterLogs = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', today.toISOString())
        .lt('logged_at', tomorrow.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;
      
      setWaterLogs(data || []);
      
      // Calculate today's total
      const total = (data || []).reduce(
        (sum, log) => sum + (log.amount_ml || 0),
        0
      );
      setTodaysIntake(total);
    } catch (error) {
      console.error('Error fetching water logs:', error);
    }
  }, [user]);

  // Add water intake
  const addWater = async (amountMl: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('water_logs')
        .insert({
          user_id: user.id,
          amount_ml: amountMl,
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      await fetchWaterLogs();
      return { success: true };
    } catch (error) {
      console.error('Error adding water:', error);
      return { success: false, error };
    }
  };

  // Delete water log
  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('water_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      await fetchWaterLogs();
      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return { success: false, error };
    }
  };

  // Quick add amounts
  const quickAdd = async (glasses: number = 1) => {
    const mlPerGlass = 250; // 250ml per glass
    return addWater(glasses * mlPerGlass);
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchWaterLogs();
    }
  }, [user, fetchWaterLogs]);

  return {
    waterLogs,
    todaysIntake,
    dailyGoal,
    glasses: Math.floor(todaysIntake / 250),
    progress: Math.min((todaysIntake / dailyGoal) * 100, 100),
    loading,
    fetchWaterLogs,
    addWater,
    deleteLog,
    quickAdd,
  };
}