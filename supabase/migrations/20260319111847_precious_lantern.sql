/*
  # Seed Sample Data

  1. Sample Foods
    - Add common foods to the database
    
  2. Sample Exercises
    - Add popular exercises
    
  3. Sample Achievements
    - Add achievement system
*/

-- Insert sample foods
INSERT INTO foods (name, brand, serving_size, calories_per_serving, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, category, is_verified) VALUES
('Banana', '', '1 medium (118g)', 105, 1.3, 27, 0.4, 3.1, 14.4, 1, 'fruits', true),
('Chicken Breast', '', '100g', 165, 31, 0, 3.6, 0, 0, 74, 'protein', true),
('Brown Rice', '', '1 cup cooked (195g)', 216, 5, 45, 1.8, 3.5, 0.7, 10, 'grains', true),
('Greek Yogurt', 'Plain', '1 cup (245g)', 130, 23, 9, 0, 0, 9, 68, 'dairy', true),
('Almonds', '', '28g (23 almonds)', 164, 6, 6, 14, 3.5, 1.2, 1, 'nuts_seeds', true),
('Broccoli', '', '1 cup chopped (91g)', 25, 3, 5, 0.3, 2.3, 1.5, 24, 'vegetables', true),
('Oatmeal', '', '1 cup cooked (234g)', 147, 5.9, 25, 2.9, 4, 0.6, 9, 'grains', true),
('Salmon', '', '100g', 208, 25, 0, 12, 0, 0, 59, 'protein', true),
('Sweet Potato', '', '1 medium (128g)', 112, 2, 26, 0.1, 3.9, 5.4, 7, 'vegetables', true),
('Avocado', '', '1 medium (201g)', 322, 4, 17, 29, 13.5, 1.3, 14, 'fruits', true);

-- Insert sample exercises
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_level, calories_per_minute, instructions, is_verified) VALUES
('Running', 'cardio', '{"legs", "core"}', '{"none"}', 'beginner', 12.0, 'Maintain a steady pace and focus on proper form', true),
('Push-ups', 'strength', '{"chest", "shoulders", "triceps", "core"}', '{"none"}', 'beginner', 8.0, 'Keep body straight, lower chest to ground, push back up', true),
('Squats', 'strength', '{"legs", "glutes", "core"}', '{"none"}', 'beginner', 6.0, 'Feet shoulder-width apart, lower hips back and down', true),
('Plank', 'strength', '{"core", "shoulders"}', '{"none"}', 'beginner', 5.0, 'Hold straight body position, engage core muscles', true),
('Cycling', 'cardio', '{"legs", "core"}', '{"bicycle"}', 'beginner', 10.0, 'Maintain steady cadence, adjust resistance as needed', true),
('Deadlift', 'strength', '{"back", "legs", "glutes"}', '{"barbell"}', 'intermediate', 8.0, 'Keep back straight, lift with legs and hips', true),
('Bench Press', 'strength', '{"chest", "shoulders", "triceps"}', '{"barbell", "bench"}', 'intermediate', 7.0, 'Lower bar to chest, press up with control', true),
('Yoga Flow', 'flexibility', '{"full_body"}', '{"yoga_mat"}', 'beginner', 4.0, 'Flow through poses with controlled breathing', true),
('Burpees', 'cardio', '{"full_body"}', '{"none"}', 'intermediate', 15.0, 'Squat, jump back to plank, push-up, jump forward, jump up', true),
('Swimming', 'cardio', '{"full_body"}', '{"pool"}', 'beginner', 11.0, 'Maintain steady stroke rhythm and breathing pattern', true);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, category, criteria, points) VALUES
('First Step', 'Log your first meal', 'utensils', 'nutrition', '{"type": "nutrition_log_count", "target": 1}', 10),
('Week Warrior', 'Log meals for 7 consecutive days', 'calendar', 'streak', '{"type": "nutrition_streak", "target": 7}', 50),
('Calorie Champion', 'Hit your calorie goal 5 times', 'target', 'nutrition', '{"type": "calorie_goal_hits", "target": 5}', 30),
('Exercise Explorer', 'Complete your first workout', 'zap', 'exercise', '{"type": "exercise_log_count", "target": 1}', 10),
('Fitness Fanatic', 'Complete 10 workouts', 'flame', 'exercise', '{"type": "exercise_log_count", "target": 10}', 100),
('Hydration Hero', 'Drink 8 glasses of water in a day', 'droplets', 'nutrition', '{"type": "daily_water_goal", "target": 8}', 20),
('Weight Tracker', 'Log your weight for the first time', 'scale', 'weight', '{"type": "weight_log_count", "target": 1}', 10),
('Progress Pioneer', 'Log weight for 30 consecutive days', 'trending-up', 'streak', '{"type": "weight_streak", "target": 30}', 150),
('Protein Power', 'Hit your protein goal 10 times', 'award', 'nutrition', '{"type": "protein_goal_hits", "target": 10}', 75),
('Cardio King', 'Complete 5 cardio workouts', 'heart', 'exercise', '{"type": "cardio_workout_count", "target": 5}', 60);