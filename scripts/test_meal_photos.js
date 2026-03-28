const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Load environment variables from the repo root .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_KEY is not set in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMealPhotosFeature() {
  console.log('Starting Supabase meal_photos integration test...');

  // Step 1: Determine a valid test user_id from auth.users using service key
  const { data: users, error: userError } = await supabase.from('auth.users').select('id').limit(1);
  if (userError) {
    console.error('Error fetching a test user:', userError.message);
    process.exit(1);
  }
  const testUserId = users && users.length > 0 ? users[0].id : null;
  if (!testUserId) {
    console.error('No test user found in auth.users; cannot proceed with test.');
    process.exit(1);
  }

  const testImageUrl = 'https://example.com/meal_photos/test_image_1.jpg';
  const testMealType = 'lunch';
  const testCalories = 550;
  const testProtein = 30.5;
  const testCarbs = 60.2;
  const testFat = 18.0;
  const testNotes = 'Test entry for integration testing.';

  const mealDataToInsert = {
    user_id: testUserId,
    image_url: testImageUrl,
    meal_type: testMealType,
    calories: testCalories,
    protein_g: testProtein,
    carbs_g: testCarbs,
    fat_g: testFat,
    notes: testNotes,
  };

  // Step 2: Insert Test Data
  console.log('Inserting test meal photo data...');
  const { data: insertedData, error: insertError } = await supabase
    .from('meal_photos')
    .insert([mealDataToInsert]);

  if (insertError) {
    console.error('Error inserting meal photo:', insertError.message);
    await cleanupTestData(testUserId);
    process.exit(1);
  }

  console.log('Test data inserted successfully.');
  const insertedMealId = insertedData[0]?.id;
  console.log('Inserted meal ID:', insertedMealId);

  // Step 3: Fetch Test Data
  console.log('Fetching inserted meal photo data...');
  const { data: fetchedData, error: fetchError } = await supabase
    .from('meal_photos')
    .select('*')
    .eq('id', insertedMealId)
    .eq('user_id', testUserId);

  if (fetchError) {
    console.error('Error fetching meal photo:', fetchError.message);
    await cleanupTestData(testUserId);
    process.exit(1);
  }

  if (fetchedData && fetchedData.length > 0) {
    console.log('Successfully fetched inserted meal photo.');
    const fetchedMeal = fetchedData[0];
    console.log('Fetched Meal:', {
      id: fetchedMeal.id,
      user_id: fetchedMeal.user_id,
      image_url: fetchedMeal.image_url,
      meal_type: fetchedMeal.meal_type,
      calories: fetchedMeal.calories,
      protein_g: fetchedMeal.protein_g,
      carbs_g: fetchedMeal.carbs_g,
      fat_g: fetchedMeal.fat_g,
      notes: fetchedMeal.notes,
    });

    // Step 4: Verify Data
    if (fetchedMeal.image_url === testImageUrl &&
        fetchedMeal.meal_type === testMealType &&
        fetchedMeal.calories === testCalories &&
        fetchedMeal.protein_g === testProtein &&
        fetchedMeal.carbs_g === testCarbs &&
        fetchedMeal.fat_g === testFat) {
      console.log('Data verification successful!');
    } else {
      console.error('Data verification failed: Fetched data does not match inserted data.');
      process.exit(1);
    }
  } else {
    console.error('Failed to fetch the inserted meal photo. It might not have been inserted correctly or the fetch query is wrong.');
    process.exit(1);
  }

  // Step 5: Clean up Test Data
  console.log('Cleaning up test data...');
  await cleanupTestData(testUserId, insertedMealId);
  console.log('Test completed successfully and data cleaned up.');
}

async function cleanupTestData(userId, mealId = null) {
  try {
    if (mealId) {
      const { error } = await supabase
        .from('meal_photos')
        .delete()
        .eq('id', mealId)
        .eq('user_id', userId);
      if (error) console.error(`Error cleaning up meal ID ${mealId}:`, error.message);
      else console.log(`Cleaned up meal ID ${mealId}.`);
    } else {
      console.log('No specific meal ID provided for cleanup, skipping broader cleanup by user_id for safety.');
    }
  } catch (e) {
    console.error('An unexpected error occurred during cleanup:', e);
  }
}

testMealPhotosFeature().catch(err => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
