
import React from 'react';
import type { UserProfile, NutritionGoals, ScannedMeal, LoggedExercise } from '../types';
import Card from './common/Card';
import WaterTracker from './WaterTracker';
import { View } from '../App';
import DateNavigator from './DateNavigator';


interface DashboardProps {
    userProfile: UserProfile;
    nutritionGoals: NutritionGoals;
    dailyLog: ScannedMeal[];
    exerciseLog: LoggedExercise[];
    dailyStreak: number;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    onDeleteMeal: (mealId: string) => void;
    onNavigate: (view: View) => void;
    t: (key: any) => string;
}

const BMIDisplay: React.FC<{ bmi: number; category: string }> = ({ bmi, category }) => {
    const getBmiColor = (cat: string) => {
        if (cat === 'Underweight') return 'text-blue-500';
        if (cat === 'Normal weight') return 'text-green-500';
        if (cat === 'Overweight') return 'text-yellow-600';
        if (cat === 'Obesity') return 'text-red-500';
        return 'text-gray-800 dark:text-gray-200';
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold mb-2">Body Mass Index (BMI)</h2>
            <div className="text-center">
                <p className={`text-4xl font-bold ${getBmiColor(category)}`}>{bmi}</p>
                <p className={`font-semibold ${getBmiColor(category)}`}>{category}</p>
            </div>
        </Card>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ userProfile, nutritionGoals, dailyLog, exerciseLog, onDeleteMeal, onNavigate, dailyStreak, selectedDate, setSelectedDate, t }) => {
    
    const totalConsumedCalories = dailyLog.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalBurnedCalories = exerciseLog.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
    const netCalories = totalConsumedCalories - totalBurnedCalories;
    
    const remainingCalories = nutritionGoals.calories - netCalories;
    
    const percentageOfDailyGoal = nutritionGoals.calories > 0 ? Math.round((netCalories / nutritionGoals.calories) * 100) : 0;
    
    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your daily progress overview.</p>
                </div>
                <div className="text-center">
                     <span className="text-4xl">🔥</span>
                     <p className="font-bold text-orange-500">{dailyStreak} <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">day streak</span></p>
                </div>
            </header>

            <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <Card>
                <h2 className="text-xl font-semibold mb-4">Calorie Goal</h2>
                 <div className="flex justify-between items-baseline mb-2">
                    <div>
                        <span className="font-bold text-2xl text-green-600">{netCalories.toLocaleString()}</span>
                        <span className="text-gray-500 dark:text-gray-400"> / {nutritionGoals.calories.toLocaleString()} kcal</span>
                    </div>
                    <span className="font-semibold">{remainingCalories.toLocaleString()} left</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${Math.min(percentageOfDailyGoal, 100)}%` }}></div>
                </div>
                <div className="flex justify-around pt-4 text-xs text-center">
                    <div><span className="font-semibold">{totalConsumedCalories.toLocaleString()}</span> Food</div>
                    <div>-</div>
                    <div><span className="font-semibold">{totalBurnedCalories.toLocaleString()}</span> Exercise</div>
                    <div>=</div>
                    <div><span className="font-semibold">{netCalories.toLocaleString()}</span> Net</div>
                </div>
            </Card>

            <Card>
                 <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => onNavigate('scanner')} className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/50 dark:hover:bg-green-900/80 rounded-xl transition">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                         <span className="font-semibold text-green-800 dark:text-green-300">Scan with AI</span>
                     </button>
                      <button onClick={() => onNavigate('addFood')} className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:hover:bg-blue-900/80 rounded-xl transition">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                         <span className="font-semibold text-blue-800 dark:text-blue-300">Add Manually</span>
                     </button>
                 </div>
            </Card>
            
            <Card>
                <h2 className="text-xl font-semibold mb-4">Food Log for {selectedDate}</h2>
                {dailyLog.length > 0 ? (
                    <ul className="space-y-3">
                        {dailyLog.map((meal) => (
                            <li key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <p className="font-bold">{meal.mealType}: <span className="font-normal">{meal.foodItems[0].name}{meal.foodItems.length > 1 ? ` & more` : ''}</span></p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">P:{meal.totalProtein}g C:{meal.totalCarbs}g F:{meal.totalFat}g</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold text-green-700 dark:text-green-400">{meal.totalCalories} kcal</p>
                                    <button onClick={() => onDeleteMeal(meal.id)} className="text-gray-400 hover:text-red-500" aria-label={`Delete ${meal.foodItems[0].name}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-500 dark:text-gray-400">You haven't logged any meals for this day.</p>
                    </div>
                )}
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-4">Exercise Log for {selectedDate}</h2>
                {exerciseLog.length > 0 ? (
                     <ul className="space-y-3">
                        {exerciseLog.map((ex) => (
                             <li key={ex.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="font-semibold">{ex.name}</p>
                                <p className="font-semibold text-orange-600 dark:text-orange-400">{ex.caloriesBurned} kcal</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                     <div className="text-center py-6">
                        <p className="text-gray-500 dark:text-gray-400">No exercise logged for this day.</p>
                         <button onClick={() => onNavigate('exercise')} className="mt-2 text-sm font-semibold text-green-600 hover:underline">Log a workout</button>
                    </div>
                )}
            </Card>

            <Card>
                <button onClick={() => onNavigate('chatbot')} className="w-full text-left p-2 -m-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{t('dashboard.ai_assistant_title')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.ai_assistant_description')}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <BMIDisplay bmi={nutritionGoals.bmi} category={nutritionGoals.bmiCategory} />
                <WaterTracker goal={nutritionGoals.recommendedWater} />
            </div>

        </div>
    );
};

export default Dashboard;
