import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  Moon
} from 'lucide-react-native';

export default function NutritionScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const meals = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, calories: 420 },
    { id: 'lunch', label: 'Lunch', icon: Utensils, calories: 650 },
    { id: 'dinner', label: 'Dinner', icon: Sunset, calories: 480 },
    { id: 'snacks', label: 'Snacks', icon: Moon, calories: 180 },
  ];

  const recentFoods = [
    { name: 'Oatmeal with Berries', calories: 320, brand: 'Homemade' },
    { name: 'Greek Yogurt', calories: 150, brand: 'Chobani' },
    { name: 'Banana', calories: 105, brand: 'Fresh' },
    { name: 'Almonds (28g)', calories: 160, brand: 'Blue Diamond' },
  ];

  const nutritionBreakdown = {
    carbs: { value: 180, target: 250, color: '#F59E0B' },
    protein: { value: 85, target: 120, color: '#EF4444' },
    fat: { value: 65, target: 85, color: '#8B5CF6' },
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
              <Text style={styles.caloriesRemaining}>730</Text>
              <Text style={styles.caloriesLabel}>Calories Remaining</Text>
            </View>
            <View style={styles.caloriesBreakdown}>
              <Text style={styles.breakdownText}>Goal: 2000</Text>
              <Text style={styles.breakdownText}>Food: 1250</Text>
              <Text style={styles.breakdownText}>Exercise: -280</Text>
            </View>
          </View>
        </View>

        {/* Macros Breakdown */}
        <View style={styles.macrosCard}>
          <Text style={styles.cardTitle}>Macronutrients</Text>
          <View style={styles.macrosRow}>
            {Object.entries(nutritionBreakdown).map(([key, macro]) => (
              <View key={key} style={styles.macroItem}>
                <View style={[styles.macroBar, { backgroundColor: macro.color + '20' }]}>
                  <View 
                    style={[
                      styles.macroProgress, 
                      { 
                        backgroundColor: macro.color,
                        width: `${(macro.value / macro.target) * 100}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.macroLabel}>{key.toUpperCase()}</Text>
                <Text style={styles.macroValue}>{macro.value}g/{macro.target}g</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meal Selection */}
        <View style={styles.mealsCard}>
          <Text style={styles.cardTitle}>Meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.mealsRow}>
              {meals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={[
                    styles.mealButton,
                    selectedMeal === meal.id && styles.mealButtonActive
                  ]}
                  onPress={() => setSelectedMeal(meal.id)}>
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
                    {meal.calories} cal
                  </Text>
                </TouchableOpacity>
              ))}
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
              onChangeText={setSearchText}
            />
          </View>

          <View style={styles.addOptions}>
            <TouchableOpacity style={styles.addOptionButton}>
              <Camera color="#10B981" size={24} />
              <Text style={styles.addOptionText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addOptionButton}>
              <Plus color="#10B981" size={24} />
              <Text style={styles.addOptionText}>Quick Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Foods */}
        <View style={styles.recentCard}>
          <Text style={styles.cardTitle}>Recent Foods</Text>
          {recentFoods.map((food, index) => (
            <TouchableOpacity key={index} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodBrand}>{food.brand}</Text>
              </View>
              <View style={styles.foodCalories}>
                <Text style={styles.caloriesText}>{food.calories}</Text>
                <Text style={styles.caloriesUnit}>cal</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Plus color="#10B981" size={16} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
    marginHorizontal: 8,
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
    fontSize: 12,
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
  mealButtonActive: {
    backgroundColor: '#10B981',
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
  addOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addOptionButton: {
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 8,
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
    marginBottom: 20,
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
});