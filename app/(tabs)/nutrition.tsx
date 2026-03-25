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
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Plus, 
  Utensils,
  Coffee,
  Sunset,
  Moon,
  X,
  Check,
  Flame,
  Target,
  Wheat,
  Camera,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react-native';
import { useNutrition, Food, NutritionLog } from '@/hooks/useNutrition';
import { useMealPhotos, quickFoods, mealCalorieEstimates, MealPhoto } from '@/hooks/useMealPhotos';
import { useImageUpload } from '@/hooks/useImageUpload';

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

export default function NutritionScreen() {
  const { 
    foods, 
    nutritionLogs, 
    todaysTotals, 
    fetchFoods, 
    logFood, 
    deleteLog 
  } = useNutrition();

  const { photos, addPhoto, deletePhoto } = useMealPhotos();
  const { pickImage, takePhoto, uploadImage, uploading } = useImageUpload();

  const [searchText, setSearchText] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('1');
  
  // Photo modal states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCaloriesModal, setShowCaloriesModal] = useState(false);
  const [calorieInput, setCalorieInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [mealNotes, setMealNotes] = useState('');

  const meals = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: colors.accent },
    { id: 'lunch', label: 'Lunch', icon: Utensils, color: colors.primary },
    { id: 'dinner', label: 'Dinner', icon: Sunset, color: colors.secondary },
    { id: 'snack', label: 'Snacks', icon: Moon, color: colors.purple },
  ];

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const mealLogs = nutritionLogs.filter(log => log.meal_type === selectedMeal);
  const caloriesRemaining = calorieGoal - todaysTotals.calories;
  
  // Get today's meal photos for selected meal
  const todaysMealPhotos = photos.filter(p => {
    const photoDate = new Date(p.logged_at).toDateString();
    const today = new Date().toDateString();
    return p.meal_type === selectedMeal && photoDate === today;
  });

  const calorieGoal = 2000;
  const proteinGoal = 120;
  const carbsGoal = 250;
  const fatGoal = 65;

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
      Alert.alert('✅ Added!', `${selectedFood.name} logged to ${selectedMeal}`);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    Alert.alert(
      'Delete Entry',
      'Remove this food?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteLog(logId) },
      ]
    );
  };

  // Photo handling
  const handleAddPhoto = () => {
    Alert.alert(
      'Add Meal Photo',
      'Choose how to add a photo',
      [
        { text: '📷 Take Photo', onPress: handleTakePhoto },
        { text: '🖼️ Choose from Gallery', onPress: handlePickPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setPhotoUri(uri);
      // Pre-fill with average calories for this meal type
      setCalorieInput(String(mealCalorieEstimates[selectedMeal].avg));
      setShowPhotoModal(true);
    }
  };

  const handlePickPhoto = async () => {
    const uri = await pickImage();
    if (uri) {
      setPhotoUri(uri);
      setCalorieInput(String(mealCalorieEstimates[selectedMeal].avg));
      setShowPhotoModal(true);
    }
  };

  const handleQuickSelectFood = (food: typeof quickFoods[0]) => {
    setCalorieInput(String(food.calories));
    setProteinInput(String(food.protein));
    setCarbsInput(String(food.carbs));
    setFatInput(String(food.fat));
  };

  const handleSavePhotoMeal = async () => {
    if (!photoUri) return;

    setShowPhotoModal(false);

    // Upload image first
    const uploadResult = await uploadImage(photoUri);
    
    if (!uploadResult.success || !uploadResult.url) {
      Alert.alert('❌ Error', uploadResult.error || 'Failed to upload photo');
      return;
    }

    // Save to database
    const result = await addPhoto({
      imageUrl: uploadResult.url,
      mealType: selectedMeal,
      calories: parseInt(calorieInput) || undefined,
      protein: parseFloat(proteinInput) || undefined,
      carbs: parseFloat(carbsInput) || undefined,
      fat: parseFloat(fatInput) || undefined,
      notes: mealNotes || undefined,
    });

    if (result.success) {
      Alert.alert('✅ Meal Photo Saved!', `Calories: ${calorieInput || 0}`);
    } else {
      Alert.alert('❌ Error', result.error);
    }

    // Reset
    setPhotoUri(null);
    setCalorieInput('');
    setProteinInput('');
    setCarbsInput('');
    setFatInput('');
    setMealNotes('');
  };

  const handleDeletePhoto = async (photoId: string, imageUrl: string) => {
    Alert.alert(
      'Delete Photo',
      'Remove this meal photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            await deletePhoto(photoId);
          } 
        },
      ]
    );
  };

  const totalPhotoCalories = todaysMealPhotos.reduce((sum, p) => sum + (p.calories || 0), 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.accent, '#D97706']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Nutrition</Text>
            <Text style={styles.headerSubtitle}>Track your meals</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calorie Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Calories Remaining</Text>
              <Text style={[
                styles.summaryValue,
                caloriesRemaining < 0 && { color: colors.danger }
              ]}>
                {Math.abs(caloriesRemaining)}
              </Text>
              <Text style={styles.summarySubtext}>
                {caloriesRemaining < 0 ? 'over goal' : `of ${calorieGoal} daily`}
              </Text>
            </View>
            <View style={styles.calorieRing}>
              <LinearGradient
                colors={[colors.primary, '#34D399']}
                style={styles.calorieRingInner}>
                <Text style={styles.caloriePercent}>
                  {Math.round((todaysTotals.calories / calorieGoal) * 100)}%
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Quick Macros */}
          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: colors.primary + '15' }]}>
                <Target color={colors.primary} size={16} />
              </View>
              <Text style={styles.macroValue}>{Math.round(todaysTotals.protein)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroGoal}>of {proteinGoal}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: colors.accent + '15' }]}>
                <Wheat color={colors.accent} size={16} />
              </View>
              <Text style={styles.macroValue}>{Math.round(todaysTotals.carbs)}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroGoal}>of {carbsGoal}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroIcon, { backgroundColor: colors.purple + '15' }]}>
                <Flame color={colors.purple} size={16} />
              </View>
              <Text style={styles.macroValue}>{Math.round(todaysTotals.fat)}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroGoal}>of {fatGoal}g</Text>
            </View>
          </View>
        </View>

        {/* 📸 Meal Photo Button */}
        <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
          <LinearGradient
            colors={[colors.purple, '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.photoButtonGradient}>
            <Camera color={colors.white} size={22} />
            <Text style={styles.photoButtonText}>📸 Snap Meal Photo</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Meal Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mealTabsContainer}>
          <View style={styles.mealTabs}>
            {meals.map((meal) => {
              const mealCalories = nutritionLogs
                .filter(l => l.meal_type === meal.id)
                .reduce((sum, l) => sum + l.calories, 0);
              const photoCount = photos.filter(p => {
                const photoDate = new Date(p.logged_at).toDateString();
                const today = new Date().toDateString();
                return p.meal_type === meal.id && photoDate === today;
              }).length;
              
              return (
                <TouchableOpacity
                  key={meal.id}
                  style={[
                    styles.mealTab,
                    selectedMeal === meal.id && { backgroundColor: meal.color }
                  ]}
                  onPress={() => setSelectedMeal(meal.id as any)}>
                  <meal.icon 
                    color={selectedMeal === meal.id ? colors.white : colors.gray} 
                    size={18} 
                  />
                  <Text style={[
                    styles.mealTabLabel,
                    selectedMeal === meal.id && { color: colors.white }
                  ]}>
                    {meal.label}
                  </Text>
                  <Text style={[
                    styles.mealTabCalories,
                    selectedMeal === meal.id && { color: colors.white, opacity: 0.8 }
                  ]}>
                    {mealCalories + (photoCount > 0 ? photos.filter(p => p.meal_type === meal.id && new Date(p.logged_at).toDateString() === new Date().toDateString()).reduce((s, p) => s + (p.calories || 0), 0) : 0)} cal
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Meal Photos Display */}
        {todaysMealPhotos.length > 0 && (
          <View style={styles.photosCard}>
            <Text style={styles.photosTitle}>📸 Today's Photos ({todaysMealPhotos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todaysMealPhotos.map((photo) => (
                <TouchableOpacity 
                  key={photo.id} 
                  style={styles.photoThumbnail}
                  onLongPress={() => handleDeletePhoto(photo.id, photo.image_url)}>
                  <Image 
                    source={{ uri: photo.image_url }} 
                    style={styles.photoImage}
                  />
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoCal}>{photo.calories || 0} cal</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.photosTotal}>From photos: {totalPhotoCalories} cal</Text>
          </View>
        )}

        {/* Search Food */}
        <View style={styles.searchCard}>
          <View style={styles.searchHeader}>
            <Search color={colors.gray} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              placeholderTextColor={colors.gray}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                fetchFoods(text);
              }}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchText('');
                fetchFoods('');
              }}>
                <X color={colors.gray} size={18} />
              </TouchableOpacity>
            )}
          </View>

          {searchText.length > 0 && filteredFoods.length > 0 && (
            <View style={styles.searchResults}>
              {filteredFoods.slice(0, 6).map((food) => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.foodResultItem}
                  onPress={() => handleFoodSelect(food)}>
                  <View style={styles.foodResultInfo}>
                    <Text style={styles.foodResultName}>{food.name}</Text>
                    <Text style={styles.foodResultDetail}>
                      {food.serving_size} • P: {food.protein_g}g C: {food.carbs_g}g F: {food.fat_g}g
                    </Text>
                  </View>
                  <View style={styles.foodResultCal}>
                    <Flame color={colors.accent} size={14} />
                    <Text style={styles.foodResultCalories}>{food.calories_per_serving}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Meal Food List */}
        <View style={styles.mealListCard}>
          <Text style={styles.mealListTitle}>
            {meals.find(m => m.id === selectedMeal)?.label} Today
          </Text>
          
          {mealLogs.length === 0 && todaysMealPhotos.length === 0 ? (
            <View style={styles.emptyMeal}>
              <Utensils color={colors.light} size={32} />
              <Text style={styles.emptyText}>No foods logged yet</Text>
              <Text style={styles.emptySubtext}>Search and add foods or snap a photo</Text>
            </View>
          ) : (
            <>
              {mealLogs.map((log) => (
                <TouchableOpacity 
                  key={log.id} 
                  style={styles.foodItem}
                  onLongPress={() => handleDeleteLog(log.id)}>
                  <View style={styles.foodItemLeft}>
                    <Text style={styles.foodItemName}>{log.food_name || 'Custom Food'}</Text>
                    <Text style={styles.foodItemQuantity}>
                      {log.quantity} {log.unit}
                    </Text>
                  </View>
                  <View style={styles.foodItemRight}>
                    <Text style={styles.foodItemCalories}>{Math.round(log.calories)}</Text>
                    <Text style={styles.foodItemCalLabel}>cal</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Food Quantity Modal */}
      <Modal
        visible={showFoodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFoodModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowFoodModal(false)}>
              <X color={colors.gray} size={24} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>{selectedFood?.name}</Text>
            <Text style={styles.modalSubtitle}>
              {selectedFood?.serving_size} • {selectedFood?.calories_per_serving} cal per serving
            </Text>

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Number of servings</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(String(Math.max(0.5, parseFloat(quantity) - 0.5)))}>
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(String(parseFloat(quantity) + 0.5))}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalNutrition}>
              <View style={styles.modalNutritionItem}>
                <Text style={styles.modalNutritionValue}>
                  {Math.round((selectedFood?.calories_per_serving || 0) * parseFloat(quantity || '0'))}
                </Text>
                <Text style={styles.modalNutritionLabel}>Calories</Text>
              </View>
              <View style={styles.modalNutritionItem}>
                <Text style={styles.modalNutritionValue}>
                  {Math.round((selectedFood?.protein_g || 0) * parseFloat(quantity || '0'))}g
                </Text>
                <Text style={styles.modalNutritionLabel}>Protein</Text>
              </View>
              <View style={styles.modalNutritionItem}>
                <Text style={styles.modalNutritionValue}>
                  {Math.round((selectedFood?.carbs_g || 0) * parseFloat(quantity || '0'))}g
                </Text>
                <Text style={styles.modalNutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.modalNutritionItem}>
                <Text style={styles.modalNutritionValue}>
                  {Math.round((selectedFood?.fat_g || 0) * parseFloat(quantity || '0'))}g
                </Text>
                <Text style={styles.modalNutritionLabel}>Fat</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addModalButton}
              onPress={handleLogFood}>
              <Check color={colors.white} size={20} />
              <Text style={styles.addModalButtonText}>
                Add to {meals.find(m => m.id === selectedMeal)?.label}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Meal Photo Modal with Calorie Input */}
      <Modal
        visible={showPhotoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPhotoModal(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.photoModalContent}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setShowPhotoModal(false)}>
              <X color={colors.gray} size={24} />
            </TouchableOpacity>
            
            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            )}

            <Text style={styles.modalTitle}>📸 Meal Nutrition</Text>
            <Text style={styles.modalSubtitle}>
              Estimate calories from your meal photo
            </Text>

            {/* Quick Food Select */}
            <Text style={styles.quickSelectLabel}>Quick Add (tap to fill):</Text>
            <View style={styles.quickFoodGrid}>
              {quickFoods.slice(0, 6).map((food, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickFoodChip}
                  onPress={() => handleQuickSelectFood(food)}>
                  <Text style={styles.quickFoodText}>{food.name}</Text>
                  <Text style={styles.quickFoodCal}>{food.calories} cal</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Manual Input */}
            <View style={styles.nutritionInputGroup}>
              <Text style={styles.inputLabel}>Calories *</Text>
              <TextInput
                style={styles.nutritionInput}
                value={calorieInput}
                onChangeText={setCalorieInput}
                placeholder="350"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.nutritionRow}>
              <View style={[styles.nutritionInputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.nutritionInput}
                  value={proteinInput}
                  onChangeText={setProteinInput}
                  placeholder="20"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.nutritionInputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.nutritionInput}
                  value={carbsInput}
                  onChangeText={setCarbsInput}
                  placeholder="40"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.nutritionInputGroup}>
              <Text style={styles.inputLabel}>Fat (g)</Text>
              <TextInput
                style={styles.nutritionInput}
                value={fatInput}
                onChangeText={setFatInput}
                placeholder="15"
                placeholderTextColor={colors.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.nutritionInputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.nutritionInput, { height: 60, textAlignVertical: 'top' }]}
                value={mealNotes}
                onChangeText={setMealNotes}
                placeholder="e.g., Lunch with friends..."
                placeholderTextColor={colors.gray}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[styles.addModalButton, uploading && { opacity: 0.6 }]}
              onPress={handleSavePhotoMeal}
              disabled={uploading}>
              <Camera color={colors.white} size={20} />
              <Text style={styles.addModalButtonText}>
                {uploading ? 'Uploading...' : 'Save Meal Photo'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary,
  },
  summarySubtext: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  calorieRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calorieRingInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriePercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.dark,
    marginTop: 2,
  },
  macroGoal: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 2,
  },
  // Photo button
  photoButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  photoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  photoButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Photos card
  photosCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  photosTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 10,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
  },
  photoCal: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  photosTotal: {
    fontSize: 13,
    color: colors.purple,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'right',
  },
  // Meal tabs
  mealTabsContainer: {
    marginTop: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  mealTabs: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  mealTab: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 10,
    minWidth: 85,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mealTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    marginTop: 6,
  },
  mealTabCalories: {
    fontSize: 10,
    color: colors.gray,
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.dark,
    marginLeft: 10,
    marginRight: 10,
  },
  searchResults: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    paddingTop: 12,
  },
  foodResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  foodResultInfo: {
    flex: 1,
  },
  foodResultName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  foodResultDetail: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  foodResultCal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  foodResultCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 4,
  },
  mealListCard: {
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
  mealListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  emptyMeal: {
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
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  foodItemLeft: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  foodItemQuantity: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  foodItemRight: {
    alignItems: 'flex-end',
  },
  foodItemCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  foodItemCalLabel: {
    fontSize: 11,
    color: colors.gray,
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
    paddingTop: 16,
  },
  photoModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '90%',
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  quickSelectLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 10,
  },
  quickFoodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  quickFoodChip: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  quickFoodText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.dark,
  },
  quickFoodCal: {
    fontSize: 10,
    color: colors.gray,
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.dark,
  },
  quantityInput: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'center',
    width: 80,
    marginHorizontal: 20,
  },
  modalNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderRadius: 16,
  },
  modalNutritionItem: {
    alignItems: 'center',
  },
  modalNutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  modalNutritionLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  addModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  addModalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Nutrition input
  nutritionInputGroup: {
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 8,
  },
  nutritionInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark,
  },
});