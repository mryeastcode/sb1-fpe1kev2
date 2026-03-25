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
  TrendingUp, 
  TrendingDown,
  Calendar,
  Award,
  Target,
  Zap,
  Scale,
  Activity
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  const periods = ['week', 'month', 'year'];
  
  const achievements = [
    {
      icon: Award,
      title: '7-Day Streak',
      description: 'Logged meals for 7 days straight',
      color: '#F59E0B',
      unlocked: true,
    },
    {
      icon: Target,
      title: 'Calorie Goal',
      description: 'Hit your calorie target 5 times this week',
      color: '#10B981',
      unlocked: true,
    },
    {
      icon: Zap,
      title: 'Workout Warrior',
      description: 'Complete 10 workouts this month',
      color: '#3B82F6',
      unlocked: false,
    },
    {
      icon: Scale,
      title: 'Weight Loss',
      description: 'Lost 5 lbs this month',
      color: '#8B5CF6',
      unlocked: true,
    },
  ];

  const progressStats = [
    {
      title: 'Weight',
      current: '156.2 lbs',
      change: '-2.3 lbs',
      trend: 'down',
      color: '#10B981',
    },
    {
      title: 'Body Fat',
      current: '18.5%',
      change: '-1.2%',
      trend: 'down',
      color: '#3B82F6',
    },
    {
      title: 'Muscle Mass',
      current: '42.8%',
      change: '+0.5%',
      trend: 'up',
      color: '#F59E0B',
    },
    {
      title: 'BMI',
      current: '22.1',
      change: '-0.4',
      trend: 'down',
      color: '#8B5CF6',
    },
  ];

  const weeklyData = [
    { day: 'Mon', calories: 1850, target: 2000 },
    { day: 'Tue', calories: 2100, target: 2000 },
    { day: 'Wed', calories: 1950, target: 2000 },
    { day: 'Thu', calories: 1800, target: 2000 },
    { day: 'Fri', calories: 2050, target: 2000 },
    { day: 'Sat', calories: 2200, target: 2000 },
    { day: 'Sun', calories: 1900, target: 2000 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Progress Tracker</Text>
          <Text style={styles.headerSubtitle}>See how far you've come</Text>
        </View>
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

        {/* Progress Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>This Week Overview</Text>
          <View style={styles.overviewGrid}>
            {progressStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statCurrent}>{stat.current}</Text>
                <View style={styles.statChange}>
                  {stat.trend === 'up' ? (
                    <TrendingUp color={stat.color} size={16} />
                  ) : (
                    <TrendingDown color={stat.color} size={16} />
                  )}
                  <Text style={[styles.statChangeText, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Calorie Intake Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Calorie Intake</Text>
            <TouchableOpacity>
              <Calendar color="#6B7280" size={20} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chart}>
            {weeklyData.map((day, index) => {
              const percentage = (day.calories / day.target) * 100;
              const height = Math.max((percentage / 100) * 120, 20);
              
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View style={[styles.targetLine, { backgroundColor: '#E5E7EB' }]} />
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: height,
                          backgroundColor: percentage > 100 ? '#EF4444' : '#10B981'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day.day}</Text>
                </View>
              );
            })}
          </View>
          
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Within Target</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Over Target</Text>
            </View>
          </View>
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
                    color={achievement.unlocked ? achievement.color : '#9CA3AF'} 
                    size={24} 
                  />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Award color="#F59E0B" size={16} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Goals */}
        <View style={styles.goalsCard}>
          <Text style={styles.cardTitle}>Weekly Goals</Text>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Calorie Target</Text>
              <Text style={styles.goalProgress}>5/7 days</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '71%' }]} />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Exercise Sessions</Text>
              <Text style={styles.goalProgress}>3/5 sessions</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '60%' }]} />
            </View>
          </View>

          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Water Intake</Text>
              <Text style={styles.goalProgress}>6/7 days</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '86%' }]} />
            </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  overviewCard: {
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statCurrent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  chartCard: {
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
    paddingHorizontal: 10,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  targetLine: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 2,
    borderRadius: 1,
  },
  bar: {
    width: 16,
    borderRadius: 8,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  achievementsCard: {
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
  achievementsGrid: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  achievementTitleLocked: {
    color: '#9ca3af',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  achievementDescriptionLocked: {
    color: '#d1d5db',
  },
  unlockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsCard: {
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
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  goalProgress: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
});