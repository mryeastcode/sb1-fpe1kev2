import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Award,
  Target,
  Zap,
  Scale,
  Activity,
  Plus,
  X,
  ChevronRight,
} from 'lucide-react-native';
import { useProfile, WeightLog } from '@/hooks/useProfile';
import { useNutrition } from '@/hooks/useNutrition';
import { useExercise } from '@/hooks/useExercise';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#10B981',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  purple: '#8B5CF6',
  danger: '#EF4444',
  cyan: '#06B6D4',
  dark: '#1F2937',
  gray: '#6B7280',
  light: '#F3F4F6',
  white: '#FFFFFF',
  background: '#F8FAFC',
};

export default function ProgressScreen() {
  const { weightLogs, logWeight } = useProfile();
  const { todaysTotals, nutritionLogs } = useNutrition();
  const { weeklyStats: exerciseStats } = useExercise();
  
  // Calculate weekly nutrition stats from today's totals
  const nutritionStats = {
    totalCalories: todaysTotals.calories,
    totalProtein: todaysTotals.protein,
    totalCarbs: todaysTotals.carbs,
    totalFat: todaysTotals.fat,
  };
  
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const periods = ['Week', 'Month', 'Year'];

  // Mock achievements - would come from database
  const achievements = [
    { icon: Award, title: '7-Day Streak', desc: 'Logged meals 7 days', color: colors.accent, unlocked: true },
    { icon: Target, title: 'Calorie Goal', desc: 'Hit target 5x this week', color: colors.primary, unlocked: true },
    { icon: Zap, title: 'Workout Warrior', desc: 'Complete 10 workouts', color: colors.secondary, unlocked: false },
    { icon: Scale, title: 'Weight Loss', desc: 'Lost 5 lbs this month', color: colors.purple, unlocked: true },
  ];

  // Weekly calorie data
  const weeklyData = [
    { day: 'Mon', calories: 1850 },
    { day: 'Tue', calories: 2100 },
    { day: 'Wed', calories: exerciseStats.totalMinutes > 0 ? todaysTotals.calories : 1950 },
    { day: 'Thu', calories: 1800 },
    { day: 'Fri', calories: 2050 },
    { day: 'Sat', calories: 2200 },
    { day: 'Sun', calories: 1900 },
  ];

  const calorieGoal = 2000;
  const maxCalories = Math.max(...weeklyData.map(d => d.calories), calorieGoal);

  const handleLogWeight = async () => {
    if (!newWeight) {
      Alert.alert('⚠️ Error', 'Please enter your weight');
      return;
    }

    const result = await logWeight(
      parseFloat(newWeight),
      bodyFat ? parseFloat(bodyFat) : undefined
    );

    if (result.success) {
      setShowWeightModal(false);
      setNewWeight('');
      setBodyFat('');
      Alert.alert('✅ Done!', 'Weight logged successfully');
    }
  };

  // Get latest weight
  const latestWeight = weightLogs[0]?.weight_kg;
  const weightInLbs = latestWeight ? Math.round(latestWeight * 2.205) : '--';
  const previousWeight = weightLogs[1]?.weight_kg;
  const weightChange = latestWeight && previousWeight 
    ? (latestWeight - previousWeight).toFixed(1) 
    : '--';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.purple, '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Progress</Text>
            <Text style={styles.headerSubtitle}>Track your journey</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}>
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive
              ]}>
                {period.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Card */}
        <View style={styles.weightCard}>
          <View style={styles.weightHeader}>
            <View>
              <Text style={styles.weightLabel}>Current Weight</Text>
              <Text style={styles.weightValue}>{weightInLbs} lbs</Text>
            </View>
            <TouchableOpacity 
              style={styles.logWeightButton}
              onPress={() => setShowWeightModal(true)}>
              <Plus color={colors.primary} size={18} />
              <Text style={styles.logWeightText}>Log</Text>
            </TouchableOpacity>
          </View>
          
          {weightChange !== '--' && (
            <View style={styles.weightChange}>
              {parseFloat(weightChange) < 0 ? (
                <TrendingDown color={colors.primary} size={16} />
              ) : (
                <TrendingUp color={colors.danger} size={16} />
              )}
              <Text style={[
                styles.weightChangeText,
                { color: parseFloat(weightChange) < 0 ? colors.primary : colors.danger }
              ]}>
                {Math.abs(parseFloat(weightChange))} lbs from last entry
              </Text>
            </View>
          )}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.accent + '15' }]}>
                <Activity color={colors.accent} size={20} />
              </View>
              <Text style={styles.statValue}>{todaysTotals.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
                <Target color={colors.primary} size={20} />
              </View>
              <Text style={styles.statValue}>{Math.round(todaysTotals.protein)}g</Text>
              <Text style={styles.statLabel}>Protein</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.secondary + '15' }]}>
                <Zap color={colors.secondary} size={20} />
              </View>
              <Text style={styles.statValue}>{exerciseStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Exercise min</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.purple + '15' }]}>
                <Scale color={colors.purple} size={20} />
              </View>
              <Text style={styles.statValue}>{exerciseStats.totalCalories}</Text>
              <Text style={styles.statLabel}>Cal Burned</Text>
            </View>
          </View>
        </View>

        {/* Calorie Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Calorie Intake</Text>
            <Calendar color={colors.gray} size={20} />
          </View>
          
          <View style={styles.chart}>
            {weeklyData.map((day, index) => {
              const percentage = (day.calories / maxCalories) * 100;
              const height = Math.max((percentage / 100) * 100, 15);
              const isOver = day.calories > calorieGoal;
              
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View style={[styles.targetLine, { backgroundColor: colors.light }]} />
                    <LinearGradient
                      colors={isOver ? [colors.danger, '#DC2626'] : [colors.primary, '#34D399']}
                      style={[styles.bar, { height }]}
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day.day}</Text>
                </View>
              );
            })}
          </View>
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Under Goal</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.legendText}>Over Goal</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.light }]} />
              <Text style={styles.legendText}>Goal: {calorieGoal}</Text>
            </View>
          </View>
        </View>

        {/* Weight History */}
        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>Weight History</Text>
          
          {weightLogs.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Scale color={colors.light} size={32} />
              <Text style={styles.emptyText}>No weight logged yet</Text>
              <Text style={styles.emptySubtext}>Tap "Log" to add your weight</Text>
            </View>
          ) : (
            weightLogs.slice(0, 7).map((log, index) => (
              <View key={log.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>
                    {new Date(log.logged_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                  {log.body_fat_percentage && (
                    <Text style={styles.historyFat}>{log.body_fat_percentage}% body fat</Text>
                  )}
                </View>
                <Text style={styles.historyWeight}>{Math.round(log.weight_kg * 2.205)} lbs</Text>
              </View>
            ))
          )}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View 
                key={index} 
                style={[
                  styles.achievementItem,
                  !achievement.unlocked && styles.achievementLocked
                ]}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.color + (achievement.unlocked ? '20' : '10') }
                ]}>
                  <achievement.icon 
                    color={achievement.unlocked ? achievement.color : colors.gray} 
                    size={22} 
                  />
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDesc,
                  !achievement.unlocked && styles.achievementDescLocked
                ]}>
                  {achievement.desc}
                </Text>
                {achievement.unlocked && (
                  <View style={[styles.unlockedBadge, { backgroundColor: achievement.color }]}>
                    <Text style={styles.unlockedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Log Weight Modal */}
      <Modal
        visible={showWeightModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWeightModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Weight</Text>
              <TouchableOpacity onPress={() => setShowWeightModal(false)}>
                <X color={colors.gray} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="150"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Body Fat % (optional)</Text>
              <TextInput
                style={styles.input}
                value={bodyFat}
                onChangeText={setBodyFat}
                placeholder="18"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogWeight}>
              <Text style={styles.submitButtonText}>Save Weight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -16,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: colors.purple,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
  },
  periodTextActive: {
    color: colors.white,
  },
  weightCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  weightValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 4,
  },
  logWeightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logWeightText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  weightChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  weightChangeText: {
    fontSize: 13,
    marginLeft: 6,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  targetLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    top: '50%',
  },
  bar: {
    width: 24,
    borderRadius: 6,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '500',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.gray,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  historyLeft: {},
  historyDate: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  historyFat: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.purple,
  },
  achievementsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  achievementTitleLocked: {
    color: colors.gray,
  },
  achievementDesc: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
  },
  achievementDescLocked: {
    color: colors.gray,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});