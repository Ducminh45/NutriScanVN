import type { UserProfile, NutritionGoals, Exercise } from '../types';
import { ACTIVITY_LEVEL_MULTIPLIERS, GOAL_CALORIE_MODIFIERS } from '../constants';
import { Gender } from '../types';

// Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation
export const calculateBMR = (profile: UserProfile): number => {
    const { weight, height, age, gender } = profile;
    if (gender === Gender.MALE) {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

// Calculates Total Daily Energy Expenditure (TDEE) with goal modifier
export const calculateTargetCalories = (profile: UserProfile): number => {
    const bmr = calculateBMR(profile);
    const multiplier = ACTIVITY_LEVEL_MULTIPLIERS[profile.activityLevel];
    const tdeeForMaintenance = bmr * multiplier;
    const goalModifier = GOAL_CALORIE_MODIFIERS[profile.goal] || 0;
    return Math.round(tdeeForMaintenance + goalModifier);
};

// Calculates BMI and determines its category
export const calculateBMI = (height: number, weight: number): { bmi: number, category: string } => {
    if (height <= 0 || weight <= 0) return { bmi: 0, category: 'N/A' };
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    let category = 'Normal weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obesity';
    return { bmi, category };
};

// Calculates recommended daily water intake
export const calculateWaterIntake = (weight: number): number => {
    // A common recommendation is 30-35 ml per kg of body weight
    return Math.round((weight * 35) / 100) * 100; // Round to nearest 100 ml
};

// Calculates calories burned from exercise using the MET formula
export const calculateCaloriesBurned = (exercise: Exercise, durationInMinutes: number, weightInKg: number): number => {
    if (durationInMinutes <= 0 || weightInKg <= 0) return 0;
    // Formula: Calories Burned = Duration (min) * (MET * 3.5 * Weight (kg)) / 200
    const calories = (durationInMinutes * (exercise.met * 3.5 * weightInKg)) / 200;
    return Math.round(calories);
};

// Calculates all nutrition goals based on user profile
export const calculateAllGoals = (profile: UserProfile): NutritionGoals => {
    const totalCalories = calculateTargetCalories(profile);
    const { bmi, category } = calculateBMI(profile.height, profile.weight);
    const recommendedWater = calculateWaterIntake(profile.weight);

    // 40% Carbs, 30% Protein, 30% Fat
    const carbs = Math.round((totalCalories * 0.4) / 4); // 4 kcal per gram
    const protein = Math.round((totalCalories * 0.3) / 4); // 4 kcal per gram
    const fat = Math.round((totalCalories * 0.3) / 9); // 9 kcal per gram

    return {
        calories: totalCalories,
        protein,
        carbs,
        fat,
        bmi,
        bmiCategory: category,
        recommendedWater,
    };
};
