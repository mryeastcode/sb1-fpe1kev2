import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Plus, 
  Camera,
  Utensils,
  Coffee,
  Sunset,
  Moon,
  X,
  Check
} from 'lucide-react-native';
import { useNutrition, Food, NutritionLog } from '@/hooks/useNutrition';

export default function NutritionScreen() {
  const { 
    foods, 
    nutritionLogs, 
    todaysTotals, 
    fetchFoods, 
    logFood, 
    deleteLog,
    addCustomFood 
  } = useNutrition();

  const [searchText, setSearchText] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('1');

  // Goals (these would come from user profile)
  const calorieGoal = 2000;
  const proteinGoal = 120;
  const carbsGoal = 250;
  const fatGoal = 85;

  const meals = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#F59E0B' },
    { id: 'lunch', label: 'Lunch', icon: Utensils, color: '#10B981' },
    { id: 'dinner', label: 'Dinner', icon: Sunset, color: '#3B82F6' },
    { id: 'snacks', label: 'Snacks', icon: Moon, color: '#8B5CF6' },
  ];

  // Filter foods based on search
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get logs for selected meal
  const mealLogs = nutritionLogs.filter(log => log.meal_type === selectedMeal);

  // Calculate calories remaining
  const caloriesRemaining = calorieGoal - todaysTotals.calories;

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    setQuantity('1');
    setShowFoodModal(true);
  };

  const handleLogFood = async () => {
    if (!selectedFood) return;

    const qty = parseFloat(quantity) || 1;
    const result = await logFood(selectedFood, selectedMeal, qty, 'serving');
    
    if (result.success) {
      setShowFoodModal(false);
      setSelectedFood(null);
      setQuantity('1');
      Alert.alert('Success', `${selectedFood.name} added to ${selectedMeal}`);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteLog(logId) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nutrition Tracker</Text>
          <Text style={styles.headerSubtitle}>Track your daily intake</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.caloriesSummary}>
            <View style={styles.caloriesMain}>
              <Text style={[
                styles.caloriesRemaining,
                caloriesRemaining < 0 && { color: '#EF4444' }
              ]}>
                {Math.abs(caloriesRemaining)}
              </Text>
              <Text style={styles.caloriesLabel}>
                {caloriesRemaining >= 0 ? 'Calories Remaining' : 'Calories Over'}
              </Text>
            </View>
            <View style={styles.caloriesBreakdown}>
              <Text style={styles.breakdownText}>Goal: {calorieGoal}</Text>
              <Text style={styles.breakdownText}>Food: {todaysTotals.calories}</Text>
            </View>
          </View>
        </View>

        {/* Macros Breakdown */}
        <View style={styles.macrosCard}>
          <Text style={styles.cardTitle}>Macronutrients</Text>
          <View style={styles.macrosRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: '#F59E0B' + '20' }]}>
                <View 
                  style={[
                    styles.macroProgress, 
                    { 
                      backgroundColor: '#F59E0B',
                      width: `${Math.min((todaysTotals.carbs / carbsGoal) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
              <Text style={styles.macroLabel}>CARBS</Text>
              <Text style={styles.macroValue}>{Math.round(todaysTotals.carbs)}g/{carbsGoal}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: '#EF4444' + '20' }]}>
                <View 
                  style={[
                    styles.macroProgress, 
                    { 
                      backgroundColor: '#EF4444',
                      width: `${Math.min((todaysTotals.protein / proteinGoal) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
              <Text style={styles.macroLabel}>PROTEIN</Text>
              <Text style={styles.macroValue}>{Math.round(todaysTotals.protein)}g/{proteinGoal}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: '#8B5CF6' + '20' }]}>
                <View 
                  style={[
                    styles.macroProgress, 
                    { 
                      backgroundColor: '#8B5CF6',
                      width: `${Math.min((todaysTotals.fat / fatGoal) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
              <Text style={styles.macroLabel}>FAT</Text>
              <Text style={styles.macroValue}>{Math.round(todaysTotals.fat)}g/{fatGoal}g</Text>
            </View>
          </View>
        </View>

        {/* Meal Selection */}
        <View style={styles.mealsCard}>
          <Text style={styles.cardTitle}>Meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.mealsRow}>
              {meals.map((meal) => {
                const mealCalories = nutritionLogs
                  .filter(l => l.meal_type === meal.id)
                  .reduce((sum, l) => sum + l.calories, 0);
                
                return (
                  <TouchableOpacity
                    key={meal.id}
                    style={[
                      styles.mealButton,
                      selectedMeal === meal.id && { backgroundColor: meal.color }
                    ]}
                    onPress={() => setSelectedMeal(meal.id as any)}>
                    <meal.icon 
                      color={selectedMeal === meal.id ? '#ffffff' : '#6B7280'} 
                      size={24} 
                    />
                    <Text style={[
                      styles.mealLabel,
                      selectedMeal === meal.id && styles.mealLabelActive
                    ]}>
                      {meal.label}
                    </Text>
                    <Text style={[
                      styles.mealCalories,
                      selectedMeal === meal.id && styles.mealCaloriesActive
                    ]}>
                      {mealCalories} cal
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Add Food Section */}
        <View style={styles.addFoodCard}>
          <Text style={styles.cardTitle}>Add Food</Text>
          
          <View style={styles.searchContainer}>
            <Search color="#6B7280" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                fetchFoods(text);
              }}
            />
          </View>

          {/* Search Results */}
          {searchText.length > 0 && filteredFoods.length > 0 && (
            <View style={styles.searchResults}>
              {filteredFoods.slice(0, 5).map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.searchResultItem}
                  onPress={() => handleFoodSelect(food)}>
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName}>{food.name}</Text>
                    <Text style={styles.searchResultDetail}>
                      {food.serving_size} • {food.calories_per_serving} cal
                    </Text>
                  </View>
                  <Plus color="#10B981" size={20} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.addOptions}>
            <TouchableOpacity 
              style={styles.addOptionButton}
              onPress={() => setShowAddModal(true)}>
              <Plus color="#10B981" size={24} />
              <Text style={styles.addOptionText}>Quick Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Food Log by Meal */}
        {meals.map((meal) => {
          const logs = nutritionLogs.filter(l => l.meal_type === meal.id);
          if (logs.length === 0) return null;
          
          return (
            <View key={meal.id} style={styles.recentCard}>
              <Text style={styles.cardTitle}>{meal.label}</Text>
              {logs.map((log) => (
                <TouchableOpacity 
                  key={log.id} 
                  style={styles.foodItem}
                  onLongPress={() => handleDeleteLog(log.id)}>
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{log.food_name || 'Custom Food'}</Text>
                    <Text style={styles.foodBrand}>{log.quantity} {log.unit}</Text>
                  </View>
                  <View style={styles.foodCalories}>
                    <Text style={styles.caloriesText}>{Math.round(log.calories)}</Text>
                    <Text style={styles.caloriesUnit}>cal</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Food Quantity Modal */}
      <Modal
        visible={showFoodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFoodModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedFood?.name}</Text>
              <TouchableOpacity onPress={() => setShowFoodModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              {selectedFood?.serving_size} • {selectedFood?.calories_per_serving} calories
            </Text>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Servings:</Text>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>

            <View style={styles.modalMacros}>
              <View style={styles.modalMacroItem}>
                <Text style={styles.modalMacroValue}>
                  {Math.round((selectedFood?.calories_per_serving || 0) * parseFloat(quantity || '0'))}
                </Text>
                <Text style={styles.modalMacroLabel}>Calories</Text>
              </View>
              <View style={styles.modalMacroItem}>
                <Text style={styles.modalMacroValue}>
                  {Math.round((selectedFood?.protein_g || 0) * parseFloat(quantity || '0'))}g
                </Text>
                <Text style={styles.modalMacroLabel}>Protein</Text>
              </View>
              <View style={styles.modalMacroItem}>
                <Text style={styles.modalMacroValue}>
                  {Math.round((selectedFood?.carbs_g || 0) * parseFloat(quantity || '0'))}g
                </Text>
                <Text style={styles.modalMacroLabel}>Carbs</Text>
              </View>
              <View style={styles.modalMacroItem}>
                <Text style={styles.modalMacroValue}>
                  {Math.round((selectedFood?.fat_g || 0) * parseFloat(quantity || '0'))}g
                </Text>
                <Text style={styles.modalMacroLabel}>Fat</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButtonModal}
              onPress={handleLogFood}>
              <Check color="#ffffff" size={20} />
              <Text style={styles.addButtonModalText}>Add to {selectedMeal}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quick Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Add</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.quickAddNote}>
              Quick add a custom food entry without searching.
            </Text>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                setShowAddModal(false);
                // Navigate to food search or show input
              }}>
              <Search color="#10B981" size={20} />
              <Text style={styles.quickAddButtonText}>Search & Add Food</Text>
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
  caloriesSummary: {
    alignItems: 'center',
  },
  caloriesMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesRemaining: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  caloriesBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  breakdownText: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 12,
  },
  macrosCard: {
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
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  macroBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  macroProgress: {
    height: '100%',
    borderRadius: 4,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 11,
    color: '#9ca3af',
  },
  mealsCard: {
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
  mealsRow: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  mealButton: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 80,
  },
  mealLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
  },
  mealLabelActive: {
    color: '#ffffff',
  },
  mealCalories: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  mealCaloriesActive: {
    color: '#ffffff',
    opacity: 0.8,
  },
  addFoodCard: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  searchResults: {
    maxHeight: 200,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  searchResultDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  addOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addOptionButton: {
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addOptionText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 8,
  },
  recentCard: {
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
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  foodBrand: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  foodCalories: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  caloriesUnit: {
    fontSize: 12,
    color: '#6b7280',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 16,
  },
  quantityInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    width: 80,
    textAlign: 'center',
  },
  modalMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  modalMacroItem: {
    alignItems: 'center',
  },
  modalMacroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalMacroLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  addButtonModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addButtonModalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickAddNote: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingVertical: 16,
  },
  quickAddButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});