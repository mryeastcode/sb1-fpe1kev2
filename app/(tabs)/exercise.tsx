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
  Calendar,
} from 'lucide-react-native';
import { useExercise, ExerciseLog } from '@/hooks/useExercise';

export default function ExerciseScreen() {
  const { exerciseLogs, weeklyStats, logExercise, deleteLog } = useExercise();
  const [showAddModal, setShowAddModal] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  // Common exercises for quick selection
  const quickExercises = [
    { name: 'Running', caloriesPerMin: 10 },
    { name: 'Walking', caloriesPerMin: 4 },
    { name: 'Cycling', caloriesPerMin: 8 },
    { name: 'Swimming', caloriesPerMin: 9 },
    { name: 'Weight Training', caloriesPerMin: 6 },
    { name: 'Yoga', caloriesPerMin: 3 },
    { name: 'HIIT', caloriesPerMin: 12 },
    { name: 'Jump Rope', caloriesPerMin: 11 },
  ];

  const handleQuickSelect = (exercise: typeof quickExercises[0]) => {
    setExerciseName(exercise.name);
    // Auto-calculate calories based on duration if entered
    const dur = parseFloat(duration) || 0;
    if (dur > 0) {
      setCalories(String(Math.round(dur * exercise.caloriesPerMin)));
    }
  };

  const handleDurationChange = (text: string) => {
    setDuration(text);
    // Auto-calculate calories for selected exercise
    const selected = quickExercises.find(e => e.name === exerciseName);
    if (selected && text) {
      setCalories(String(Math.round(parseFloat(text) * selected.caloriesPerMin)));
    }
  };

  const handleAddExercise = async () => {
    if (!exerciseName || !duration) {
      Alert.alert('Error', 'Please enter exercise name and duration');
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
      Alert.alert('Success', 'Exercise logged!');
    }
  };

  const handleDeleteLog = async (logId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteLog(logId) },
      ]
    );
  };

  // Group logs by date
  const groupedLogs = exerciseLogs.reduce((groups, log) => {
    const date = new Date(log.logged_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, ExerciseLog[]>);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Exercise Tracker</Text>
          <Text style={styles.headerSubtitle}>Log your workouts</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock color="#3B82F6" size={24} />
              <Text style={styles.statValue}>{weeklyStats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Flame color="#EF4444" size={24} />
              <Text style={styles.statValue}>{weeklyStats.totalCalories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Target color="#10B981" size={24} />
              <Text style={styles.statValue}>{weeklyStats.workoutCount}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        {/* Add Exercise Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Plus color="#ffffff" size={24} />
          <Text style={styles.addButtonText}>Log Exercise</Text>
        </TouchableOpacity>

        {/* Quick Add Section */}
        <View style={styles.quickCard}>
          <Text style={styles.cardTitle}>Quick Add</Text>
          <View style={styles.quickGrid}>
            {quickExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.name}
                style={[
                  styles.quickButton,
                  exerciseName === exercise.name && styles.quickButtonActive
                ]}
                onPress={() => handleQuickSelect(exercise)}>
                <Text style={[
                  styles.quickButtonText,
                  exerciseName === exercise.name && styles.quickButtonTextActive
                ]}>
                  {exercise.name}
                </Text>
                <Text style={styles.quickButtonSubtext}>
                  ~{exercise.caloriesPerMin} cal/min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Exercise Logs */}
        <View style={styles.recentCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          
          {Object.keys(groupedLogs).length === 0 ? (
            <View style={styles.emptyState}>
              <Target color="#9CA3AF" size={48} />
              <Text style={styles.emptyText}>No exercises logged yet</Text>
              <Text style={styles.emptySubtext}>
                Tap "Log Exercise" to get started
              </Text>
            </View>
          ) : (
            Object.entries(groupedLogs).map(([date, logs]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {logs.map((log) => (
                  <TouchableOpacity 
                    key={log.id} 
                    style={styles.exerciseItem}
                    onLongPress={() => handleDeleteLog(log.id)}>
                    <View style={styles.exerciseIcon}>
                      <Target color="#3B82F6" size={20} />
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{log.exercise_name}</Text>
                      <Text style={styles.exerciseDuration}>
                        {log.duration_minutes} minutes
                      </Text>
                    </View>
                    <View style={styles.exerciseCalories}>
                      <Flame color="#EF4444" size={16} />
                      <Text style={styles.caloriesText}>{log.calories_burned}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
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
              <Text style={styles.modalTitle}>Log Exercise</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Exercise Name</Text>
              <TextInput
                style={styles.input}
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="e.g., Running, Cycling..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={handleDurationChange}
                placeholder="30"
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddExercise}>
              <Check color="#ffffff" size={20} />
              <Text style={styles.submitButtonText}>Log Exercise</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  statValue: {
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickCard: {
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
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickButton: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  quickButtonActive: {
    backgroundColor: '#3B82F6',
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  quickButtonTextActive: {
    color: '#ffffff',
  },
  quickButtonSubtext: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  recentCard: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  exerciseCalories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});