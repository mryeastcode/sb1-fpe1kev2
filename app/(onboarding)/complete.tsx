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

export default function CompleteScreen() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please try logging in again.');
      return;
    }

    setLoading(true);
    try {
      // Update user profile with onboarding completion
      const { error } = await supabase
        .from('user_profiles')
        .update({
          // You would normally get these from previous screens or context
          date_of_birth: '1990-01-01', // Replace with actual data
          gender: 'male', // Replace with actual data
          height_cm: 170, // Replace with actual data
          activity_level: 'moderate', // Replace with actual data
          goal_type: 'maintain', // Replace with actual data
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        Alert.alert('Error', 'Failed to save your profile. Please try again.');
        return;
      }

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