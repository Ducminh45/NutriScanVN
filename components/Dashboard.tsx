import React from 'react';
import type { UserProfile, NutritionGoals, ScannedMeal, LoggedExercise } from '../types';
import Card from './common/Card';
import WaterTracker from './WaterTracker';
import { View } from '../App';
import DateNavigator from './DateNavigator';
import CircularProgress from './common/CircularProgress';

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

const CircularProgressCard: React.FC<{ consumed: number, goal: number, burned: number }> = ({ consumed, goal, burned }) => {
    const net = consumed - burned;
    const progress = goal > 0 ? (net / goal) * 100 : 0;

    return (
        <Card className="flex flex-col items-center">
            <h2 className="font-semibold text-gray-500 dark:text-gray-400">Calories</h2>
            <div className="my-4">
                <CircularProgress progress={progress} size={120} strokeWidth={10}>
                    <div className="text-center">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{goal - net}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 block">Remaining</span>
                    </div>
                </CircularProgress>
            </div>
            <div className="w-full flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <div><span className="font-bold">{consumed}</span> Consumed</div>
                <div><span className="font-bold">{burned}</span> Burned</div>
            </div>
        </Card>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ userProfile, nutritionGoals, dailyLog, exerciseLog, onDeleteMeal, onNavigate, dailyStreak, selectedDate, setSelectedDate, t }) => {
    
    const totalConsumedCalories = dailyLog.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalBurnedCalories = exerciseLog.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);

    const recentlyLogged = [
        ...dailyLog.map(item => ({...item, type: 'food' as const})),
        ...exerciseLog.map(item => ({...item, type: 'exercise' as const}))
    ].sort((a, b) => (a.id < b.id ? 1 : -1)); // Simple sort by timestamp ID for now

    return (
        <div className="space-y-4 animate-fade-in">
            <header className="flex justify-between items-center pt-2">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Today</h1>
                    <p className="text-gray-500 dark:text-gray-400">Hello, let's track your progress!</p>
                </div>
                <div className="text-center flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                     <span className="text-xl">🔥</span>
                     <span className="font-bold text-orange-500">{dailyStreak}</span>
                </div>
            </header>

            <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <div className="grid grid-cols-2 gap-4">
                <CircularProgressCard consumed={totalConsumedCalories} goal={nutritionGoals.calories} burned={totalBurnedCalories} />
                <WaterTracker goal={nutritionGoals.recommendedWater} />
            </div>

            <Card>
                <button onClick={() => onNavigate('chatbot')} className="w-full text-left p-2 -m-2 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.897 5.515 5 6.934V22l5.34-4.005C17.697 17.852 22 14.481 22 10c0-4.411-4.486-8-10-8zm-2.5 9.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5S11 8.672 11 9.5s-.672 1.5-1.5 1.5zm5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"></path></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">{t('dashboard.ai_assistant_title')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.ai_assistant_description')}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </Card>

            <div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">Recently Logged</h2>
                {recentlyLogged.length > 0 ? (
                    <div className="space-y-3">
                        {recentlyLogged.map((item) => (
                           <Card key={item.id} className="p-3">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg mr-4">
                                        {item.type === 'food' ? '🍲' : '🏋️'}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold">{item.type === 'food' ? item.foodItems[0].name : item.name}{item.type === 'food' && item.foodItems.length > 1 ? ' &...' : ''}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.type === 'food' ? `${item.mealType} • P:${item.totalProtein}g C:${item.totalCarbs}g F:${item.totalFat}g` : `Exercise`}</p>
                                    </div>
                                    <div className="text-right">
                                         <p className="font-bold">{item.type === 'food' ? item.totalCalories : item.caloriesBurned} kcal</p>
                                         <p className="text-xs text-gray-400">{new Date(item.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Nothing logged for this day yet.</p>
                        <p className="text-sm mt-1">Tap the '+' button to add a meal or workout.</p>
                    </Card>
                )}
            </div>

        </div>
    );
};

export default Dashboard;