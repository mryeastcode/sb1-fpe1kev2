const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load root .env

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TEST_USER_ID = process.env.TEST_USER_ID || null;

if (!SUPABASE_URL || (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_KEY)) {
  console.error('Error: SUPABASE_URL and either SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY must be set in .env.');
  process.exit(1);
}

const clientAnon = SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const clientAdmin = SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null;

async function ensureTestUserId() {
  if (TEST_USER_ID) return TEST_USER_ID;
  if (!clientAdmin) return null;
  try {
    const { data, error } = await clientAdmin.from('auth.users').select('id').limit(1);
    if (error) {
      console.error('Error fetching a test user via service key:', error.message);
      return null;
    }
    if (data && data.length > 0) return data[0].id;
  } catch (e) {
    console.error('Exception while fetching test user:', e?.message ?? e);
  }
  return null;
}

async function test_meal_photos_harness() {
  console.log('Starting Meal Photos Harness...');

  const testUserId = await ensureTestUserId();
  if (!testUserId) {
    console.warn('No test user available. The harness will run read-only tests using anon key if any data exists.');
  }

  const testImageUrl = 'https://example.com/meal_photos/test_image_1.jpg';
  const testMealType = 'lunch';
  const testCalories = 550;
  const testProtein = 30.5;
  const testCarbs = 60.2;
  const testFat = 18.0;
  const testNotes = 'Harness test entry.';

  // If we have a test user with admin access, run insert+fetch+verify+cleanup
  if (testUserId && clientAdmin) {
    const mealDataToInsert = {
      user_id: testUserId,
      image_url: testImageUrl,
      meal_type: testMealType,
      calories: testCalories,
      protein_g: testProtein,
      carbs_g: testCarbs,
      fat_g: testFat,
      notes: testNotes
    };

    try {
      // Insert
      const { data: inserted, error: insertError } = await clientAdmin.from('meal_photos').insert([mealDataToInsert]);
      if (insertError) {
        console.error('Insert error:', insertError.message);
      } else {
        const insertedMealId = inserted?.[0]?.id;
        console.log('Inserted meal id:', insertedMealId);
        // Fetch
        const { data: fetched, error: fetchError } = await clientAdmin.from('meal_photos').select('*').eq('id', insertedMealId).single();
        if (fetchError) {
          console.error('Fetch error:', fetchError.message);
        } else {
          console.log('Fetched meal:', fetched);
          // Verify
          const ok = fetched && fetched.image_url === testImageUrl && fetched.meal_type === testMealType && fetched.calories === testCalories && fetched.protein_g === testProtein && fetched.carbs_g === testCarbs && fetched.fat_g === testFat;
          console.log('Data verification:', ok ? 'PASSED' : 'FAILED');
          // Cleanup
          const { error: delError } = await clientAdmin.from('meal_photos').delete().eq('id', insertedMealId);
          if (delError) console.error('Cleanup delete error:', delError.message);
          else console.log('Cleanup successful for meal id', insertedMealId);
        }
      }
    } catch (e) {
      console.error('Harness exception:', e?.message ?? e);
    }
  } else {
    // Read-only path using anon
    try {
      const { data: readAll } = await clientAnon.from('meal_photos').select('*').limit(5);
      console.log('Anon read (limit 5) results:', readAll);
    } catch (e) {
      console.error('Anon read error:', e?.message ?? e);
    }
  }

  console.log('Harness finished.');
}

test_meal_photos_harness().catch(err => {
  console.error('Harness failed:', err?.message ?? err);
  process.exit(1);
});
