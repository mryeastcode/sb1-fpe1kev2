/*
  # Remove Unused Indexes to Improve Performance

  1. Performance Optimization
    - Remove indexes that are not being used to reduce storage overhead
    - Keep only essential indexes that improve query performance

  2. Indexes Removed
    - Text search indexes (will be added back when search functionality is implemented)
    - Some composite indexes that may not be needed initially
    - Category and brand indexes (can be added back if filtering becomes common)
*/

-- Remove unused text search indexes (can be added back when search is implemented)
DROP INDEX IF EXISTS foods_name_idx;
DROP INDEX IF EXISTS foods_brand_idx;
DROP INDEX IF EXISTS exercises_name_idx;
DROP INDEX IF EXISTS exercises_muscle_groups_idx;

-- Remove unused category indexes (can be added back if filtering becomes common)
DROP INDEX IF EXISTS foods_category_idx;
DROP INDEX IF EXISTS exercises_category_idx;
DROP INDEX IF EXISTS achievements_category_idx;

-- Remove some composite indexes that may not be needed initially
DROP INDEX IF EXISTS nutrition_logs_user_id_meal_type_idx;
DROP INDEX IF EXISTS exercise_logs_user_id_exercise_id_idx;
DROP INDEX IF EXISTS user_achievements_unlocked_at_idx;

-- Keep essential indexes for performance:
-- - Primary keys (automatic)
-- - Foreign key indexes (added in previous migration)
-- - User-based filtering indexes (these are heavily used)
-- - Time-based sorting indexes (these are heavily used)

-- Note: The following indexes are kept because they're essential:
-- - weight_logs_user_id_logged_at_idx (for user timeline queries)
-- - nutrition_logs_user_id_logged_at_idx (for user timeline queries)  
-- - exercise_logs_user_id_logged_at_idx (for user timeline queries)
-- - water_logs_user_id_logged_at_idx (for user timeline queries)
-- - user_achievements_user_id_idx (for user achievement queries)
-- - foods_barcode_idx (for barcode scanning functionality)