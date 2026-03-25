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
  Play, 
  Clock, 
  Flame,
  Target,
  Calendar,
  Award,
  Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ExerciseScreen() {
  const [selectedCategory, setSelectedCategory] = useState('cardio');

  const workoutCategories = [
    { id: 'cardio', label: 'Cardio', icon: Zap, color: '#EF4444' },
    { id: 'strength', label: 'Strength', icon: Target, color: '#3B82F6' },
    { id: 'yoga', label: 'Yoga', icon: Award, color: '#8B5CF6' },
    { id: 'hiit', label: 'HIIT', icon: Flame, color: '#F59E0B' },
  ];

  const todayWorkouts = [
    {
      name: 'Morning Run',
      duration: '45 min',
      calories: 312,
      type: 'cardio',
      completed: true,
    },
    {
      name: 'Strength Training',
      duration: '30 min',
      calories: 245,
      type: 'strength',
      completed: false,
    },
    {
      name: 'Evening Yoga',
      duration: '20 min',
      calories: 85,
      type: 'yoga',
      completed: false,
    },
  ];

  const popularWorkouts = [
    {
      name: 'Fat Burning Cardio',
      duration: '30 min',
      difficulty: 'Intermediate',
      calories: '250-300',
      image: 'cardio',
    },
    {
      name: 'Upper Body Strength',
      duration: '45 min',
      difficulty: 'Advanced',
      calories: '300-400',
      image: 'strength',
    },
    {
      name: 'Flexibility Flow',
      duration: '25 min',
      difficulty: 'Beginner',
      calories: '80-120',
      image: 'yoga',
    },
    {
      name: 'Quick HIIT Blast',
      duration: '15 min',
      difficulty: 'Intermediate',
      calories: '200-250',
      image: 'hiit',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Exercise Tracker</Text>
          <Text style={styles.headerSubtitle}>Stay active, stay healthy</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock color="#3B82F6" size={24} />
              <Text style={styles.statNumber}>5h 30m</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statItem}>
              <Flame color="#EF4444" size={24} />
              <Text style={styles.statNumber}>1,245</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Target color="#10B981" size={24} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        {/* Today's Workouts */}
        <View style={styles.todayCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Plan</Text>
            <TouchableOpacity>
              <Calendar color="#6B7280" size={20} />
            </TouchableOpacity>
          </View>

          {todayWorkouts.map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={[
                styles.workoutStatus,
                { backgroundColor: workout.completed ? '#10B981' : '#E5E7EB' }
              ]} />
              <View style={styles.workoutInfo}>
                <Text style={[
                  styles.workoutName,
                  workout.completed && styles.workoutCompleted
                ]}>
                  {workout.name}
                </Text>
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutDuration}>
                    <Clock color="#6B7280" size={14} /> {workout.duration}
                  </Text>
                  <Text style={styles.workoutCalories}>
                    <Flame color="#6B7280" size={14} /> {workout.calories} cal
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[
                styles.playButton,
                workout.completed && styles.playButtonCompleted
              ]}>
                <Play 
                  color={workout.completed ? '#10B981' : '#ffffff'} 
                  size={16} 
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Workout Categories */}
        <View style={styles.categoriesCard}>
          <Text style={styles.cardTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesRow}>
              {workoutCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}>
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                    selectedCategory === category.id && { backgroundColor: category.color }
                  ]}>
                    <category.icon 
                      color={selectedCategory === category.id ? '#ffffff' : category.color} 
                      size={24} 
                    />
                  </View>
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === category.id && styles.categoryLabelActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Popular Workouts */}
        <View style={styles.popularCard}>
          <Text style={styles.cardTitle}>Popular Workouts</Text>
          <View style={styles.workoutsGrid}>
            {popularWorkouts.map((workout, index) => (
              <TouchableOpacity key={index} style={styles.workoutCard}>
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                  style={styles.workoutCardGradient}>
                  <View style={styles.workoutCardHeader}>
                    <Text style={styles.workoutCardName}>{workout.name}</Text>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>{workout.difficulty}</Text>
                    </View>
                  </View>
                  <View style={styles.workoutCardFooter}>
                    <Text style={styles.workoutCardDuration}>
                      <Clock color="#6B7280" size={12} /> {workout.duration}
                    </Text>
                    <Text style={styles.workoutCardCalories}>
                      <Flame color="#6B7280" size={12} /> {workout.calories} cal
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.startButton}>
                    <Play color="#3B82F6" size={16} />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}
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
  statsCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  todayCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  workoutStatus: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  workoutCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  workoutDetails: {
    flexDirection: 'row',
    marginTop: 4,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 16,
  },
  workoutCalories: {
    fontSize: 14,
    color: '#6b7280',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCompleted: {
    backgroundColor: '#f0fdf4',
  },
  categoriesCard: {
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
  categoriesRow: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryButtonActive: {
    // Active styling handled in individual components
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#1f2937',
  },
  popularCard: {
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
  workoutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  workoutCardGradient: {
    padding: 16,
    position: 'relative',
  },
  workoutCardHeader: {
    marginBottom: 12,
  },
  workoutCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  difficultyBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '500',
  },
  workoutCardFooter: {
    marginBottom: 12,
  },
  workoutCardDuration: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  workoutCardCalories: {
    fontSize: 14,
    color: '#6b7280',
  },
  startButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});