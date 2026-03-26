import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_name: string;
  duration_minutes: number;
  calories_burned: number;
  notes: string;
  logged_at: string;
}

export function useExercise() {
  const { user } = useAuth();
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    totalMinutes: 0,
    totalCalories: 0,
    workoutCount: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch exercise logs
  const fetchExerciseLogs = useCallback(async () => {
    if (!user) return;

    try {
      // Get logs for last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', weekAgo.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;
      
      setExerciseLogs(data || []);

      // Calculate weekly stats
      const stats = (data || []).reduce(
        (acc, log) => ({
          totalMinutes: acc.totalMinutes + (log.duration_minutes || 0),
          totalCalories: acc.totalCalories + (log.calories_burned || 0),
          workoutCount: acc.workoutCount + 1,
        }),
        { totalMinutes: 0, totalCalories: 0, workoutCount: 0 }
      );
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error fetching exercise logs:', error);
    }
  }, [user]);

  // Log an exercise
  const logExercise = async (
    exerciseName: string,
    durationMinutes: number,
    caloriesBurned: number,
    notes: string = ''
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('exercise_logs')
        .insert({
          user_id: user.id,
          exercise_name: exerciseName,
          duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          notes,
          logged_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      await fetchExerciseLogs();
      return { success: true };
    } catch (error: any) {
      console.error('Error logging exercise:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete exercise log
  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('exercise_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;
      
      await fetchExerciseLogs();
      return { success: true };
    } catch (error) {
      console.error('Error deleting log:', error);
      return { success: false, error };
    }
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchExerciseLogs();
    }
  }, [user, fetchExerciseLogs]);

  return {
    exerciseLogs,
    weeklyStats,
    loading,
    fetchExerciseLogs,
    logExercise,
    deleteLog,
  };
}