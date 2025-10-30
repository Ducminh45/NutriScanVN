// FIX: Changed import for ActivityLevel from type-only to a value import to allow its use in the ACTIVITY_LEVEL_MULTIPLIERS object.
import { ActivityLevel } from './types';
import type { Exercise, FoodItem, Badge } from './types';

export const ACTIVITY_LEVEL_MULTIPLIERS: Record<ActivityLevel, number> = {
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHT]: 1.375,
    [ActivityLevel.MODERATE]: 1.55,
    [ActivityLevel.ACTIVE]: 1.725,
    [ActivityLevel.VERY_ACTIVE]: 1.9,
};

export const GOAL_CALORIE_MODIFIERS: Record<string, number> = {
    lose: -500,
    maintain: 0,
    gain: 500,
};

export const EXERCISE_DATA: Exercise[] = [
    { name: 'Walking (casual)', met: 3.5 },
    { name: 'Running (jogging)', met: 7.0 },
    { name: 'Cycling (leisurely)', met: 4.0 },
    { name: 'Swimming (freestyle)', met: 7.0 },
    { name: 'Weight lifting (general)', met: 3.5 },
    { name: 'Yoga', met: 2.5 },
    { name: 'Aerobics (general)', met: 6.5 },
];

export const LOCAL_FOOD_DATABASE: FoodItem[] = [
    { name: "Phở Bò", calories: 450, protein: 25, carbs: 50, fat: 15, servingSize: "1 bowl" },
    { name: "Bún Chả", calories: 550, protein: 20, carbs: 60, fat: 25, servingSize: "1 plate" },
    { name: "Cơm Tấm Sườn Bì Chả", calories: 650, protein: 30, carbs: 70, fat: 28, servingSize: "1 plate" },
    { name: "Bánh Mì Thịt Nướng", calories: 400, protein: 18, carbs: 45, fat: 18, servingSize: "1 sandwich" },
    { name: "Gỏi Cuốn", calories: 80, protein: 5, carbs: 10, fat: 2, servingSize: "1 roll" },
    { name: "Bún Bò Huế", calories: 500, protein: 28, carbs: 55, fat: 18, servingSize: "1 bowl" },
    { name: "Cao Lầu", calories: 420, protein: 22, carbs: 58, fat: 12, servingSize: "1 bowl" },
    { name: "Mì Quảng", calories: 480, protein: 24, carbs: 62, fat: 15, servingSize: "1 bowl" },
    { name: "Hủ Tiếu Nam Vang", calories: 460, protein: 26, carbs: 50, fat: 16, servingSize: "1 bowl" },
    { name: "Chả Cá Lã Vọng", calories: 380, protein: 30, carbs: 10, fat: 25, servingSize: "1 serving" },
    { name: "Bánh Xèo", calories: 350, protein: 15, carbs: 30, fat: 20, servingSize: "1 pancake" },
    { name: "Nem Rán (Chả Giò)", calories: 120, protein: 6, carbs: 12, fat: 5, servingSize: "1 roll" },
    { name: "Thịt Kho Tộ", calories: 400, protein: 25, carbs: 5, fat: 30, servingSize: "1 serving with rice" },
    { name: "Canh Chua Cá", calories: 250, protein: 20, carbs: 15, fat: 12, servingSize: "1 bowl" },
    { name: "Rau Muống Xào Tỏi", calories: 150, protein: 5, carbs: 10, fat: 10, servingSize: "1 plate" },
];

export const BADGE_DATA: Badge[] = [
    { id: 'profile_complete', title: 'Ready to Go!', description: 'You completed your profile.', icon: '🎉', condition: (profile) => !!profile },
    { id: 'first_scan', title: 'First Scan', description: 'You scanned your first meal.', icon: '📸', condition: (profile, history) => history.some(log => log.food.length > 0) },
    { id: 'streak_3', title: 'On a Roll', description: 'Logged in for 3 days in a row.', icon: '🔥', condition: (profile, history, streak) => streak >= 3 },
    { id: 'log_10_meals', title: 'Food Explorer', description: 'You logged 10 different meals.', icon: '🍲', condition: (profile, history) => history.reduce((sum, log) => sum + log.food.length, 0) >= 10 },
    { id: 'first_exercise', title: 'Getting Active', description: 'You logged your first exercise.', icon: '🏃‍♂️', condition: (profile, history) => history.some(log => log.exercise.length > 0) },
    { id: 'goal_hit_1', title: 'Goal Getter', description: 'You met your calorie goal for one day.', icon: '🎯', condition: (profile, history) => {
        if (!profile) return false;
        const goals = { calories: 2000 }; // Dummy goals, real goals needed from profile.
        return history.some(log => {
            const totalCals = log.food.reduce((sum, meal) => sum + meal.totalCalories, 0);
            return totalCals >= goals.calories * 0.9 && totalCals <= goals.calories * 1.1;
        });
    }},
];
