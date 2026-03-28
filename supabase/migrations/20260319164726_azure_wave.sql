/*
  # Add Missing Foreign Key Indexes

  1. Performance Optimization
    - Add indexes for all foreign key columns to improve query performance
    - These indexes will speed up JOIN operations and foreign key constraint checks

  2. Indexes Added
    - exercise_logs.exercise_id
    - exercises.created_by  
    - foods.created_by
    - nutrition_logs.food_id
    - user_achievements.achievement_id
*/

-- Add index for exercise_logs.exercise_id foreign key
CREATE INDEX IF NOT EXISTS exercise_logs_exercise_id_idx 
ON exercise_logs (exercise_id);

-- Add index for exercises.created_by foreign key
CREATE INDEX IF NOT EXISTS exercises_created_by_idx 
ON exercises (created_by) WHERE created_by IS NOT NULL;

-- Add index for foods.created_by foreign key
CREATE INDEX IF NOT EXISTS foods_created_by_idx 
ON foods (created_by) WHERE created_by IS NOT NULL;

-- Add index for nutrition_logs.food_id foreign key
CREATE INDEX IF NOT EXISTS nutrition_logs_food_id_idx 
ON nutrition_logs (food_id);

-- Add index for user_achievements.achievement_id foreign key
CREATE INDEX IF NOT EXISTS user_achievements_achievement_id_idx 
ON user_achievements (achievement_id);