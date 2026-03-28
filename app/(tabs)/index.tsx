import React from 'react';
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
  Plus,
  Clock,
  TrendingUp,
  Moon,
  Sun,
  Footprints,
  Activity,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNutrition } from '@/hooks/useNutrition';
import { useWater } from '@/hooks/useWater';
import { useExercise } from '@/hooks/useExercise';

const { width } = Dimensions.get('window');

// Modern color palette
const colors = {
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  dark: '#1F2937',
  gray: '#6B7280',
  light: '#F3F4F6',
  white: '#FFFFFF',
  background: '#F8FAFC',
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { todaysTotals: nutritionTotals } = useNutrition();
  const { todaysIntake: waterIntake, glasses, progress: waterProgress, quickAdd } = useWater();
  const { weeklyStats: exerciseStats } = useExercise();

  const calorieGoal = 2000;
  const proteinGoal = 120;
  const carbsGoal = 250;
  const fatGoal = 65;
  
  const calorieProgress = Math.min((nutritionTotals.calories / calorieGoal) * 100, 100);
  const proteinProgress = Math.min((nutritionTotals.protein / proteinGoal) * 100, 100);
  const carbsProgress = Math.min((nutritionTotals.carbs / carbsGoal) * 100, 100);
  const fatProgress = Math.min((nutritionTotals.fat / fatGoal) * 100, 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDayName = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.dayName}>{getDayName()}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileInitial}>
                {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Main Stats Card - Glassmorphism */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.cardTitle}>Today's Progress</Text>
            <View style={styles.caloriesRemaining}>
              <Text style={styles.caloriesNumber}>
                {calorieGoal - nutritionTotals.calories}
              </Text>
              <Text style={styles.caloriesLabel}>cal left</Text>
            </View>
          </View>
          
          {/* Circular Progress */}
          <View style={styles.mainProgressContainer}>
            <View style={styles.progressCircle}>
              <LinearGradient
                colors={[colors.accent, '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressRing}>
                <View style={styles.progressInner}>
                  <Text style={styles.progressPercent}>{Math.round(calorieProgress)}%</Text>
                  <Text style={styles.progressLabel}>of {calorieGoal} cal</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Macro Pills */}
          <View style={styles.macrosRow}>
            <View style={[styles.macroPill, { backgroundColor: colors.primary + '15' }]}>
              <View style={[styles.macroDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.macroValue}>{Math.round(nutritionTotals.protein)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={[styles.macroPill, { backgroundColor: colors.accent + '15' }]}>
              <View style={[styles.macroDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.macroValue}>{Math.round(nutritionTotals.carbs)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={[styles.macroPill, { backgroundColor: colors.purple + '15' }]}>
              <View style={[styles.macroDot, { backgroundColor: colors.purple }]} />
              <Text style={styles.macroValue}>{Math.round(nutritionTotals.fat)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions - Modern Cards */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => quickAdd(1)}>
            <View style={[styles.quickIcon, { backgroundColor: colors.cyan + '20' }]}>
              <Droplets color={colors.cyan} size={24} />
            </View>
            <Text style={styles.quickActionLabel}>Water</Text>
            <Text style={styles.quickActionSubtext}>+250ml</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickIcon, { backgroundColor: colors.accent + '20' }]}>
              <Flame color={colors.accent} size={24} />
            </View>
            <Text style={styles.quickActionLabel}>Food</Text>
            <Text style={styles.quickActionSubtext}>Log meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Target color={colors.secondary} size={24} />
            </View>
            <Text style={styles.quickActionLabel}>Workout</Text>
            <Text style={styles.quickActionSubtext}>Start</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={[styles.quickIcon, { backgroundColor: colors.purple + '20' }]}>
              <Moon color={colors.purple} size={24} />
            </View>
            <Text style={styles.quickActionLabel}>Sleep</Text>
            <Text style={styles.quickActionSubtext}>Log</Text>
          </TouchableOpacity>
        </View>

        {/* Water Progress Card */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <View style={styles.waterTitleRow}>
              <Droplets color={colors.cyan} size={20} />
              <Text style={styles.waterTitle}>Hydration</Text>
            </View>
            <Text style={styles.waterSubtitle}>{waterIntake}ml / 2000ml</Text>
          </View>
          
          <View style={styles.waterProgressBar}>
            <LinearGradient
              colors={[colors.cyan, '#0891B2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.waterFill, { width: `${waterProgress}%` }]}
            />
          </View>
          
          <View style={styles.waterGlasses}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
              <TouchableOpacity
                key={glass}
                style={[
                  styles.glassIcon,
                  glass <= glasses && styles.glassIconFilled
                ]}
                onPress={() => quickAdd(glass - glasses)}>
                <Droplets 
                  color={glass <= glasses ? colors.white : colors.gray} 
                  size={14} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weekly Activity Card */}
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.cardTitle}>Weekly Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityStats}>
            <View style={styles.activityStat}>
              <Clock color={colors.secondary} size={20} />
              <Text style={styles.activityValue}>{exerciseStats.totalMinutes}</Text>
              <Text style={styles.activityLabel}>min</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityStat}>
              <Flame color={colors.danger} size={20} />
              <Text style={styles.activityValue}>{exerciseStats.totalCalories}</Text>
              <Text style={styles.activityLabel}>cal</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityStat}>
              <Target color={colors.primary} size={20} />
              <Text style={styles.activityValue}>{exerciseStats.workoutCount}</Text>
              <Text style={styles.activityLabel}>workouts</Text>
            </View>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressOverviewCard}>
          <Text style={styles.cardTitle}>Macro Breakdown</Text>
          <View style={styles.progressBars}>
            <View style={styles.progressBarItem}>
              <View style={styles.progressBarHeader}>
                <Text style={styles.progressBarLabel}>Protein</Text>
                <Text style={styles.progressBarValue}>{Math.round(nutritionTotals.protein)}/{proteinGoal}g</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <LinearGradient
                  colors={[colors.primary, '#34D399']}
                  style={[styles.progressBarFill, { width: `${proteinProgress}%` }]}
                />
              </View>
            </View>
            
            <View style={styles.progressBarItem}>
              <View style={styles.progressBarHeader}>
                <Text style={styles.progressBarLabel}>Carbs</Text>
                <Text style={styles.progressBarValue}>{Math.round(nutritionTotals.carbs)}/{carbsGoal}g</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <LinearGradient
                  colors={[colors.accent, '#FBBF24']}
                  style={[styles.progressBarFill, { width: `${carbsProgress}%` }]}
                />
              </View>
            </View>
            
            <View style={styles.progressBarItem}>
              <View style={styles.progressBarHeader}>
                <Text style={styles.progressBarLabel}>Fat</Text>
                <Text style={styles.progressBarValue}>{Math.round(nutritionTotals.fat)}/{fatGoal}g</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <LinearGradient
                  colors={[colors.purple, '#A78BFA']}
                  style={[styles.progressBarFill, { width: `${fatProgress}%` }]}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  dayName: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  caloriesRemaining: {
    alignItems: 'flex-end',
  },
  caloriesNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  caloriesLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  mainProgressContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInner: {
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  macroPill: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  macroLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 24,
    marginBottom: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 56) / 4,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
  },
  quickActionSubtext: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 2,
  },
  waterCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  waterHeader: {
    marginBottom: 16,
  },
  waterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 8,
  },
  waterSubtitle: {
    fontSize: 13,
    color: colors.gray,
    marginLeft: 28,
  },
  waterProgressBar: {
    height: 8,
    backgroundColor: colors.light,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  waterFill: {
    height: '100%',
    borderRadius: 4,
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  glassIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassIconFilled: {
    backgroundColor: colors.cyan,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  activityStat: {
    alignItems: 'center',
  },
  activityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.light,
  },
  activityValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  progressOverviewCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  progressBars: {
    marginTop: 8,
  },
  progressBarItem: {
    marginBottom: 16,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  progressBarValue: {
    fontSize: 13,
    color: colors.gray,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});