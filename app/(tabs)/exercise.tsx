import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Target, 
  Flame, 
  Clock, 
  Plus, 
  X,
  Check,
  TrendingUp,
  Footprints,
  Bike,
  Dumbbell,
  PersonStanding,
  Waves,
  Sparkles,
} from 'lucide-react-native';
import { useExercise, ExerciseLog } from '@/hooks/useExercise';

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

const exerciseIcons: Record<string, any> = {
  'Running': PersonStanding,
  'Walking': Footprints,
  'Cycling': Bike,
  'Swimming': Waves,
  'Weight Training': Dumbbell,
  'Yoga': Sparkles,
  'HIIT': Flame,
  'Jump Rope': PersonStanding,
};

const quickExercises = [
  { name: 'Running', calPerMin: 11, icon: PersonStanding },
  { name: 'Walking', calPerMin: 4, icon: Footprints },
  { name: 'Cycling', calPerMin: 8, icon: Bike },
  { name: 'Swimming', calPerMin: 9, icon: Waves },
  { name: 'Weight Training', calPerMin: 6, icon: Dumbbell },
  { name: 'Yoga', calPerMin: 3, icon: Sparkles },
];

export default function ExerciseScreen() {
  const { exerciseLogs, weeklyStats, logExercise, deleteLog } = useExercise();
  const [showAddModal, setShowAddModal] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const handleQuickSelect = (exercise: typeof quickExercises[0]) => {
    setExerciseName(exercise.name);
    const dur = parseFloat(duration) || 0;
    if (dur > 0) {
      setCalories(String(Math.round(dur * exercise.calPerMin)));
    }
  };

  const handleDurationChange = (text: string) => {
    setDuration(text);
    const selected = quickExercises.find(e => e.name === exerciseName);
    if (selected && text) {
      setCalories(String(Math.round(parseFloat(text) * selected.calPerMin)));
    }
  };

  const handleAddExercise = async () => {
    if (!exerciseName || !duration) {
      Alert.alert('⚠️ Missing Info', 'Please enter exercise name and duration');
      return;
    }

    const result = await logExercise(
      exerciseName,
      parseFloat(duration),
      parseFloat(calories) || 0,
      ''
    );

    if (result.success) {
      setShowAddModal(false);
      setExerciseName('');
      setDuration('');
      setCalories('');
      Alert.alert('✅ Done!', `${exerciseName} logged successfully`);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    Alert.alert(
      'Delete Exercise',
      'Remove this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteLog(logId) },
      ]
    );
  };

  // Group logs by date
  const groupedLogs = exerciseLogs.reduce((groups, log) => {
    const date = new Date(log.logged_at).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {} as Record<string, ExerciseLog[]>);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.secondary, '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Exercise</Text>
            <Text style={styles.headerSubtitle}>Track your workouts</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.secondary + '15' }]}>
                <Clock color={colors.secondary} size={22} />
              </View>
              <Text style={styles.statValue}>{weeklyStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.danger + '15' }]}>
                <Flame color={colors.danger} size={22} />
              </View>
              <Text style={styles.statValue}>{weeklyStats.totalCalories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
                <Target color={colors.primary} size={22} />
              </View>
              <Text style={styles.statValue}>{weeklyStats.workoutCount}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <LinearGradient
            colors={[colors.secondary, '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButtonGradient}>
            <Plus color={colors.white} size={22} />
            <Text style={styles.addButtonText}>Log Workout</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Exercises */}
        <View style={styles.quickCard}>
          <Text style={styles.cardTitle}>Quick Add</Text>
          <View style={styles.quickGrid}>
            {quickExercises.map((exercise) => {
              const IconComponent = exercise.icon;
              return (
                <TouchableOpacity
                  key={exercise.name}
                  style={[
                    styles.quickButton,
                    exerciseName === exercise.name && styles.quickButtonActive
                  ]}
                  onPress={() => handleQuickSelect(exercise)}>
                  <View style={[
                    styles.quickIcon,
                    exerciseName === exercise.name && { backgroundColor: colors.white + '30' }
                  ]}>
                    <IconComponent 
                      color={exerciseName === exercise.name ? colors.white : colors.secondary} 
                      size={22} 
                    />
                  </View>
                  <Text style={[
                    styles.quickText,
                    exerciseName === exercise.name && styles.quickTextActive
                  ]}>
                    {exercise.name}
                  </Text>
                  <Text style={[
                    styles.quickCal,
                    exerciseName === exercise.name && styles.quickCalActive
                  ]}>
                    ~{exercise.calPerMin} cal/min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          
          {Object.keys(groupedLogs).length === 0 ? (
            <View style={styles.emptyState}>
              <Target color={colors.light} size={48} />
              <Text style={styles.emptyText}>No workouts yet</Text>
              <Text style={styles.emptySubtext}>Tap "Log Workout" to start</Text>
            </View>
          ) : (
            Object.entries(groupedLogs).map(([date, logs]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {logs.map((log) => {
                  const IconComponent = exerciseIcons[log.exercise_name] || Target;
                  return (
                    <TouchableOpacity 
                      key={log.id} 
                      style={styles.exerciseItem}
                      onLongPress={() => handleDeleteLog(log.id)}>
                      <View style={styles.exerciseIcon}>
                        <IconComponent color={colors.secondary} size={20} />
                      </View>
                      <View style={styles.exerciseInfo}>
                        <Text style={styles.exerciseName}>{log.exercise_name}</Text>
                        <Text style={styles.exerciseDuration}>
                          {log.duration_minutes} min
                        </Text>
                      </View>
                      <View style={styles.exerciseCal}>
                        <Flame color={colors.danger} size={14} />
                        <Text style={styles.exerciseCalText}>{log.calories_burned}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Workout</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color={colors.gray} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Exercise</Text>
              <TextInput
                style={styles.input}
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="e.g., Running, Cycling..."
                placeholderTextColor={colors.gray}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={handleDurationChange}
                placeholder="30"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Calories Burned</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                placeholder="Auto-calculated"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddExercise}>
              <Check color={colors.white} size={20} />
              <Text style={styles.submitButtonText}>Log Workout</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 4,
  },
  addButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickButton: {
    width: '31%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  quickButtonActive: {
    backgroundColor: colors.secondary,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
  },
  quickTextActive: {
    color: colors.white,
  },
  quickCal: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 2,
  },
  quickCalActive: {
    color: colors.white,
    opacity: 0.8,
  },
  recentCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 4,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  exerciseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
  },
  exerciseDuration: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  exerciseCal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseCalText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});