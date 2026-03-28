import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Target, TrendingDown, TrendingUp, Minus, Zap } from 'lucide-react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function GoalsScreen() {
  const { data, updateData } = useOnboarding();
  const [activityLevel, setActivityLevel] = useState(data.activityLevel);
  const [goalType, setGoalType] = useState(data.goalType);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Very hard exercise, physical job' },
  ];

  const goalTypes = [
    { 
      value: 'weight_loss', 
      label: 'Lose Weight', 
      icon: TrendingDown, 
      color: '#EF4444',
      description: 'Create a calorie deficit'
    },
    { 
      value: 'weight_gain', 
      label: 'Gain Weight', 
      icon: TrendingUp, 
      color: '#10B981',
      description: 'Build mass and strength'
    },
    { 
      value: 'maintain', 
      label: 'Maintain', 
      icon: Minus, 
      color: '#3B82F6',
      description: 'Stay at current weight'
    },
    { 
      value: 'muscle_gain', 
      label: 'Build Muscle', 
      icon: Zap, 
      color: '#F59E0B',
      description: 'Gain lean muscle mass'
    },
  ];

  const handleContinue = () => {
    if (!activityLevel || !goalType) {
      Alert.alert('Missing Information', 'Please select your activity level and goal');
      return;
    }

    // Save data to context
    updateData({ activityLevel, goalType });
    router.push('/(onboarding)/complete');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Text style={styles.headerTitle}>Your Goals</Text>
        <Text style={styles.headerSubtitle}>Tell us about your fitness goals</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <Text style={styles.sectionDescription}>How active are you currently?</Text>
          
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.optionCard,
                activityLevel === level.value && styles.optionCardActive
              ]}
              onPress={() => setActivityLevel(level.value)}>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  activityLevel === level.value && styles.optionTitleActive
                ]}>
                  {level.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  activityLevel === level.value && styles.optionDescriptionActive
                ]}>
                  {level.description}
                </Text>
              </View>
              {activityLevel === level.value && (
                <View style={styles.checkmark}>
                  <Target color="#8B5CF6" size={20} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Goal</Text>
          <Text style={styles.sectionDescription}>What's your main fitness goal?</Text>
          
          <View style={styles.goalsGrid}>
            {goalTypes.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.goalCard,
                  goalType === goal.value && styles.goalCardActive
                ]}
                onPress={() => setGoalType(goal.value)}>
                <View style={[
                  styles.goalIcon,
                  { backgroundColor: goal.color + '20' },
                  goalType === goal.value && { backgroundColor: goal.color }
                ]}>
                  <goal.icon 
                    color={goalType === goal.value ? '#ffffff' : goal.color} 
                    size={24} 
                  />
                </View>
                <Text style={[
                  styles.goalTitle,
                  goalType === goal.value && styles.goalTitleActive
                ]}>
                  {goal.label}
                </Text>
                <Text style={[
                  styles.goalDescription,
                  goalType === goal.value && styles.goalDescriptionActive
                ]}>
                  {goal.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionCardActive: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionTitleActive: {
    color: '#8B5CF6',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  optionDescriptionActive: {
    color: '#7C3AED',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalCardActive: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  goalTitleActive: {
    color: '#8B5CF6',
  },
  goalDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalDescriptionActive: {
    color: '#7C3AED',
  },
  footer: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});