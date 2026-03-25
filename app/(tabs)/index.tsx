import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Droplets, 
  Flame, 
  Target, 
  Calendar,
  Plus,
  Clock,
  TrendingUp 
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNutrition } from '@/hooks/useNutrition';
import { useWater } from '@/hooks/useWater';
import { useExercise } from '@/hooks/useExercise';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { todaysTotals: nutritionTotals } = useNutrition();
  const { todaysIntake: waterIntake, glasses, progress: waterProgress, quickAdd } = useWater();
  const { weeklyStats: exerciseStats } = useExercise();

  // Default goals (these would come from user profile)
  const calorieGoal = 2000;
  const stepsGoal = 10000;

  const calorieProgress = Math.round((nutritionTotals.calories / calorieGoal) * 100);
  const stepsProgress = 85; // Mock for now - would come from device

  const quickActions = [
    { id: 'food', icon: Plus, label: 'Log Food', color: '#10B981', action: 'nutrition' },
    { id: 'water', icon: Droplets, label: 'Add Water', color: '#06B6D4', action: 'addWater' },
    { id: 'exercise', icon: Target, label: 'Workout', color: '#3B82F6', action: 'exercise' },
    { id: 'sleep', icon: Clock, label: 'Sleep', color: '#8B5CF6', action: 'sleep' },
  ];

  const handleQuickAction = async (action: string) => {
    if (action === 'addWater') {
      await quickAdd(1);
    }
    // Other actions would navigate to respective screens
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Welcome'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Flame color="#F59E0B" size={24} />
              <Text style={styles.summaryNumber}>{nutritionTotals.calories}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
              <Text style={styles.summarySubtext}>of {calorieGoal}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Target color="#3B82F6" size={24} />
              <Text style={styles.summaryNumber}>{Math.round(nutritionTotals.protein)}g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
              <Text style={styles.summarySubtext}>goal: 120g</Text>
            </View>
            <View style={styles.summaryItem}>
              <Droplets color="#06B6D4" size={24} />
              <Text style={styles.summaryNumber}>{glasses}</Text>
              <Text style={styles.summaryLabel}>Glasses</Text>
              <Text style={styles.summarySubtext}>{Math.round(waterProgress)}% of 8</Text>
            </View>
          </View>
        </View>

        {/* Progress Rings */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Daily Goals</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <View style={[styles.progressRing, { 
                borderColor: calorieProgress >= 100 ? '#10B981' : '#F59E0B' 
              }]}>
                <Text style={styles.progressPercent}>{calorieProgress}%</Text>
              </View>
              <Text style={styles.progressLabel}>Calories</Text>
            </View>
            <View style={styles.progressItem}>
              <View style={[styles.progressRing, { borderColor: '#3B82F6' }]}>
                <Text style={styles.progressPercent}>{stepsProgress}%</Text>
              </View>
              <Text style={styles.progressLabel}>Steps</Text>
            </View>
            <View style={styles.progressItem}>
              <View style={[styles.progressRing, { borderColor: '#06B6D4' }]}>
                <Text style={styles.progressPercent}>{Math.round(waterProgress)}%</Text>
              </View>
              <Text style={styles.progressLabel}>Water</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.actionButton}
                onPress={() => handleQuickAction(action.action)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <action.icon color={action.color} size={24} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Exercise Summary */}
        <View style={styles.activitiesCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>This Week</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Clock color="#3B82F6" size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Exercise Time</Text>
              <Text style={styles.activityTime}>This week</Text>
            </View>
            <Text style={styles.activityValue}>{exerciseStats.totalMinutes} min</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Flame color="#EF4444" size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Calories Burned</Text>
              <Text style={styles.activityTime}>This week</Text>
            </View>
            <Text style={styles.activityValue}>{exerciseStats.totalCalories} cal</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Target color="#10B981" size={20} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Workouts</Text>
              <Text style={styles.activityTime}>This week</Text>
            </View>
            <Text style={styles.activityValue}>{exerciseStats.workoutCount}</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 80) / 4,
    marginBottom: 16,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  activitiesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  activityValue: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});