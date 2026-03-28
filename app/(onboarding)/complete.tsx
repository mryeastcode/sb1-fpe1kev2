import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function CompleteScreen() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { data: onboardingData, reset } = useOnboarding();

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    // Validate onboarding data
    if (!onboardingData.dateOfBirth || !onboardingData.gender || 
        !onboardingData.height || !onboardingData.weight ||
        !onboardingData.activityLevel || !onboardingData.goalType) {
      Alert.alert('Error', 'Missing onboarding data. Please go back and complete all fields.');
      return;
    }

    setLoading(true);
    try {
      // Calculate age from date of birth
      const birthDate = new Date(onboardingData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      // Parse height and weight to numbers
      const heightCm = parseFloat(onboardingData.height);
      const weightKg = parseFloat(onboardingData.weight);

      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr: number;
      if (onboardingData.gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
      }

      // Activity level multipliers
      const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };

      const tdee = Math.round(bmr * (activityMultipliers[onboardingData.activityLevel] || 1.55));

      // Calculate macros based on goal
      let calorieGoal = tdee;
      let proteinGoal: number, carbGoal: number, fatGoal: number;

      switch (onboardingData.goalType) {
        case 'weight_loss':
          calorieGoal = tdee - 500; // 500 calorie deficit
          proteinGoal = Math.round(weightKg * 2.2); // 2.2g per kg
          fatGoal = Math.round((calorieGoal * 0.25) / 9);
          carbGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);
          break;
        case 'weight_gain':
        case 'muscle_gain':
          calorieGoal = tdee + 300; // 300 calorie surplus
          proteinGoal = Math.round(weightKg * 2.0);
          fatGoal = Math.round((calorieGoal * 0.25) / 9);
          carbGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);
          break;
        default: // maintain
          calorieGoal = tdee;
          proteinGoal = Math.round(weightKg * 1.6);
          fatGoal = Math.round((calorieGoal * 0.25) / 9);
          carbGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4);
      }

      // Update user profile with onboarding data
      const { error } = await supabase
        .from('user_profiles')
        .update({
          date_of_birth: onboardingData.dateOfBirth,
          gender: onboardingData.gender,
          height_cm: heightCm,
          activity_level: onboardingData.activityLevel,
          goal_type: onboardingData.goalType,
          daily_calorie_goal: calorieGoal,
          daily_protein_goal: proteinGoal,
          daily_carb_goal: carbGoal,
          daily_fat_goal: fatGoal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        Alert.alert('Error', 'Failed to save your profile. Please try again.');
        return;
      }

      // Log initial weight
      await supabase.from('weight_logs').insert({
        user_id: user.id,
        weight_kg: weightKg,
        notes: 'Initial weight from onboarding',
        logged_at: new Date().toISOString(),
      });

      // Reset onboarding context
      reset();

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Complete onboarding error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <CheckCircle color="#ffffff" size={80} />
            <View style={styles.sparkle1}>
              <Sparkles color="#ffffff" size={24} />
            </View>
            <View style={styles.sparkle2}>
              <Sparkles color="#ffffff" size={16} />
            </View>
          </View>
          
          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.subtitle}>
            Your profile has been created successfully. Let's start your fitness journey!
          </Text>
          
          <View style={styles.features}>
            <Text style={styles.featureTitle}>What's Next:</Text>
            <Text style={styles.feature}>📊 Track your daily nutrition</Text>
            <Text style={styles.feature}>💪 Log your workouts</Text>
            <Text style={styles.feature}>📈 Monitor your progress</Text>
            <Text style={styles.feature}>🏆 Earn achievements</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.completeButton, loading && styles.completeButtonDisabled]}
            onPress={handleComplete}
            disabled={loading}>
            <Text style={styles.completeButtonText}>
              {loading ? 'Setting up...' : 'Start My Journey'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -5,
    left: -15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 48,
  },
  features: {
    alignItems: 'flex-start',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  feature: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  footer: {
    paddingBottom: 40,
  },
  completeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonDisabled: {
    opacity: 0.7,
  },
  completeButtonText: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '600',
  },
});