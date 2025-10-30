import { Language } from "./i18n";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export enum ActivityLevel {
    SEDENTARY = 'sedentary',
    LIGHT = 'light',
    MODERATE = 'moderate',
    ACTIVE = 'active',
    VERY_ACTIVE = 'veryActive',
}

export enum Goal {
    LOSE = 'lose',
    MAINTAIN = 'maintain',
    GAIN = 'gain'
}

export interface UserProfile {
    age: number;
    gender: Gender;
    height: number; // in cm
    weight: number; // in kg
    activityLevel: ActivityLevel;
    goal: Goal;
    allergies?: string;
}

export interface NutritionGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    bmi: number;
    bmiCategory: string;
    recommendedWater: number; // in ml
}

export interface FoodItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    custom?: boolean; // To identify user-added foods
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface ScannedMeal {
    id: string; 
    mealType: MealType;
    foodItems: FoodItem[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    date: string; // YYYY-MM-DD
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Exercise {
    name: string;
    met: number; // Metabolic Equivalent of Task
}

export interface LoggedExercise {
    id: string;
    name: string;
    caloriesBurned: number;
    date: string; // YYYY-MM-DD
}

// New structure to hold historical data for the progress charts
export interface DailyLog {
    date: string; // YYYY-MM-DD
    food: ScannedMeal[];
    exercise: LoggedExercise[];
    weight: number; // User's weight on that day
}

// New type for Gamification
export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string; // Emoji or SVG path
    condition: (profile: UserProfile | null, history: DailyLog[], streak: number) => boolean;
}

// Types for Meal Planner feature
export interface PlannedMeal {
    mealType: 'Breakfast' | 'Lunch' | 'Dinner';
    dishName: string;
    calories: number;
}

export interface DailyPlan {
    day: string; // e.g., "Day 1"
    totalCalories: number;
    meals: PlannedMeal[];
}

export interface MealPlan {
    id: string;
    planName: string;
    generatedDate: string; // YYYY-MM-DD
    dailyPlans: DailyPlan[];
}

// Types for Shopping List feature
export interface ShoppingListItem {
    name: string;
    quantity: string;
    checked: boolean;
}

export interface ShoppingListCategory {
    category: string;
    items: ShoppingListItem[];
}

// Type for the new Recipe Generation feature
export interface Recipe {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
}

// Type for the new Authentication feature
export interface User {
    id: string;
    email: string;
    // In a real app, you'd have a token, not a password here
}
