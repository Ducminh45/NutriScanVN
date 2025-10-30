
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { UserProfile, NutritionGoals, ScannedMeal, MealType, LoggedExercise, DailyLog, FoodItem, MealPlan, ShoppingListCategory, User, Recipe } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import FoodScanner from './components/FoodScanner';
import Chatbot from './components/Chatbot';
import ReviewScan from './components/ReviewScan';
import ExerciseTracker from './components/ExerciseTracker';
import Progress from './components/Progress';
import Settings from './components/Settings';
import AddFood from './components/AddFood';
import BottomNav from './components/common/BottomNav';
import Planning from './components/Planning';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import { calculateAllGoals } from './utils/nutritionCalculator';
import { BADGE_DATA } from './constants';
import { generateMealPlan, generateShoppingList, generateRecipe } from './services/geminiService';
import * as authService from './services/authService';
import { getTranslator, Language } from './i18n';

export type View = 'onboarding' | 'dashboard' | 'scanner' | 'chatbot' | 'reviewScan' | 'exercise' | 'progress' | 'settings' | 'addFood' | 'planning' | 'login' | 'signup' | 'forgotPassword';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const App: React.FC = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isLoggedIn());
    const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
    
    // App State
    const [view, setView] = useState<View>(isAuthenticated ? 'dashboard' : 'login');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals | null>(null);
    const [history, setHistory] = useState<DailyLog[]>([]);
    const [pendingScan, setPendingScan] = useState<Omit<ScannedMeal, 'id' | 'mealType' | 'date'> | null>(null);
    const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());
    
    // Advanced features State
    const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [language, setLanguage] = useState<Language>('en');
    const [customFoods, setCustomFoods] = useState<FoodItem[]>([]);
    const [currentMealPlan, setCurrentMealPlan] = useState<Omit<MealPlan, 'id' | 'generatedDate'> | null>(null);
    const [savedMealPlans, setSavedMealPlans] = useState<MealPlan[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingListCategory[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = useMemo(() => getTranslator(language), [language]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const selectedDayLog = useMemo(() => {
        return history.find(log => log.date === selectedDate);
    }, [history, selectedDate]);

    const dailyStreak = useMemo(() => {
        if (history.length === 0) return 0;
        let streak = 0;
        const datesWithFood = new Set(history.filter(d => (d.food.length > 0 || d.exercise.length > 0)).map(d => d.date));
        if (datesWithFood.size === 0) return 0;
        let currentStreak = 0;
        const todayStr = getTodayDateString();
        let dateToCheck = new Date();
        if (datesWithFood.has(todayStr)) {
            currentStreak = 1;
            dateToCheck.setDate(dateToCheck.getDate() - 1);
            while (datesWithFood.has(dateToCheck.toISOString().split('T')[0])) {
                currentStreak++;
                dateToCheck.setDate(dateToCheck.getDate() - 1);
            }
        }
        return currentStreak;
    }, [history]);

    useEffect(() => {
        const newBadges = new Set(unlockedBadges);
        BADGE_DATA.forEach(badge => {
            if (!newBadges.has(badge.id) && badge.condition(userProfile, history, dailyStreak)) {
                newBadges.add(badge.id);
            }
        });
        setUnlockedBadges(newBadges);
    }, [userProfile, history, dailyStreak]);

    // --- AUTH HANDLERS ---
    const handleLoginSuccess = (user: User) => {
        setIsAuthenticated(true);
        setCurrentUser(user);
        // Here you would fetch user data from a backend. For now, we go to onboarding if no profile.
        // In a real app, you'd load the profile associated with the user.
        setView('dashboard'); // Or 'onboarding' if profile is null
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
        setView('login');
        // Reset all app state
        setUserProfile(null);
        setHistory([]);
    };
    
    const handleSignupSuccess = () => {
        // After signup, direct user to onboarding to create their profile
        setView('onboarding');
    };

    // --- APP LOGIC HANDLERS ---
    const handleOnboardingComplete = useCallback((profile: UserProfile) => {
        const goals = calculateAllGoals(profile);
        setUserProfile(profile);
        setNutritionGoals(goals);
        const todayDate = getTodayDateString();
        setHistory([{ date: todayDate, food: [], exercise: [], weight: profile.weight }]);
        // Mock "logging in" the user after they complete their profile
        const user = authService.getCurrentUser();
        if(user) {
            handleLoginSuccess(user);
        } else {
             // This case is for when onboarding is the very first step
             // A proper backend flow would have already created the user.
            const mockUser = { id: 'user123', email: 'user@example.com' };
            authService.mockLogin(mockUser);
            handleLoginSuccess(mockUser);
        }
    }, []);

    const handleProfileUpdate = useCallback((newProfile: UserProfile) => {
        const newGoals = calculateAllGoals(newProfile);
        setUserProfile(newProfile);
        setNutritionGoals(newGoals);
        const todayDate = getTodayDateString();
        setHistory(prev => {
            const historyExists = prev.some(h => h.date === todayDate);
            if (historyExists) {
                return prev.map(log => log.date === todayDate ? { ...log, weight: newProfile.weight } : log);
            } else {
                return [...prev, { date: todayDate, food: [], exercise: [], weight: newProfile.weight }];
            }
        });
        setView('dashboard');
    }, []);

    const handleScanComplete = useCallback((mealData: Omit<ScannedMeal, 'id' | 'mealType' | 'date'>) => {
        setPendingScan(mealData);
        setView('reviewScan');
    }, []);
    
    const upsertDailyLog = (date: string, updater: (log: DailyLog) => DailyLog) => {
        setHistory(prev => {
            const dayIndex = prev.findIndex(log => log.date === date);
            let newHistory = [...prev];
            if (dayIndex > -1) {
                newHistory[dayIndex] = updater(newHistory[dayIndex]);
            } else {
                const newLog = updater({ date: date, food: [], exercise: [], weight: userProfile!.weight });
                newHistory.push(newLog);
            }
            return newHistory.sort((a, b) => a.date.localeCompare(b.date));
        });
    };

    const handleConfirmScan = useCallback((mealType: MealType) => {
        if (!pendingScan) return;
        const newMeal: ScannedMeal = {
            ...pendingScan,
            id: new Date().toISOString(),
            mealType: mealType,
            date: selectedDate,
        };
        upsertDailyLog(selectedDate, log => ({ ...log, food: [...log.food, newMeal] }));
        setPendingScan(null);
        setView('dashboard');
    }, [pendingScan, userProfile, selectedDate]);

    const handleCancelScan = useCallback(() => {
        setPendingScan(null);
        setView('scanner');
    }, []);

    const handleDeleteMeal = useCallback((mealId: string) => {
        upsertDailyLog(selectedDate, log => ({ ...log, food: log.food.filter(meal => meal.id !== mealId) }));
    }, [selectedDate]);

     const handleAddManualFood = useCallback((foodItem: FoodItem, mealType: MealType) => {
        const newMeal: ScannedMeal = {
            id: new Date().toISOString(),
            mealType: mealType,
            foodItems: [foodItem],
            totalCalories: foodItem.calories,
            totalProtein: foodItem.protein,
            totalCarbs: foodItem.carbs,
            totalFat: foodItem.fat,
            date: selectedDate,
        };
        upsertDailyLog(selectedDate, log => ({ ...log, food: [...log.food, newMeal] }));
        setView('dashboard');
    }, [userProfile, selectedDate]);
    
    const handleAddCustomFood = (foodItem: FoodItem) => {
        setCustomFoods(prev => [...prev, { ...foodItem, custom: true }]);
    };

    const handleLogExercise = useCallback((exercise: Omit<LoggedExercise, 'id' | 'date'>) => {
        const newExercise: LoggedExercise = { ...exercise, id: new Date().toISOString(), date: selectedDate };
        upsertDailyLog(selectedDate, log => ({ ...log, exercise: [...log.exercise, newExercise] }));
        setView('dashboard');
    }, [userProfile, selectedDate]);

    // --- NEW FEATURE HANDLERS ---
    const handleGenerateMealPlan = async () => {
        if (!userProfile || !nutritionGoals) return;
        setIsLoading(true);
        setError(null);
        setCurrentMealPlan(null);
        try {
            const plan = await generateMealPlan(userProfile, nutritionGoals, language);
            setCurrentMealPlan(plan);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveMealPlan = () => {
        if (!currentMealPlan) return;
        const newPlan: MealPlan = {
            ...currentMealPlan,
            id: new Date().toISOString(),
            generatedDate: getTodayDateString(),
        };
        setSavedMealPlans(prev => [newPlan, ...prev]);
        setCurrentMealPlan(null);
    };

    const handleGenerateShoppingList = async (plan: MealPlan): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        setShoppingList([]);
        try {
            const list = await generateShoppingList(plan, language);
            setShoppingList(list);
            return true;
        } catch (e: any) {
            setError(e.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateShoppingList = (categoryIndex: number, itemIndex: number, checked: boolean) => {
        setShoppingList(prevList => {
            const newList = [...prevList];
            newList[categoryIndex].items[itemIndex].checked = checked;
            return newList;
        });
    };

    const handleClearCheckedItems = () => {
        setShoppingList(prevList => prevList.map(cat => ({
            ...cat,
            items: cat.items.filter(item => !item.checked)
        })).filter(cat => cat.items.length > 0));
    };

    const handleClearAllItems = () => {
        setShoppingList([]);
    };
    
    const handleGenerateRecipe = async (dishName: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const recipe = await generateRecipe(dishName, language);
            setRecipes(prev => [recipe, ...prev.filter(r => r.title.toLowerCase() !== recipe.title.toLowerCase())]);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRecipeToLog = (recipe: Recipe) => {
        const foodItem: FoodItem = {
            name: recipe.title,
            calories: recipe.nutrition.calories,
            protein: recipe.nutrition.protein,
            carbs: recipe.nutrition.carbs,
            fat: recipe.nutrition.fat,
            servingSize: '1 serving'
        };
        // For simplicity, adding as 'Lunch'. In a real app, you might ask the user.
        handleAddManualFood(foodItem, 'Lunch'); 
        setView('dashboard');
    };
    
    const renderView = () => {
        if (!isAuthenticated) {
            switch(view) {
                case 'login':
                    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setView} />;
                case 'signup':
                    return <Signup onSignupSuccess={handleSignupSuccess} onNavigate={setView} />;
                case 'forgotPassword':
                    return <ForgotPassword onNavigate={setView} />;
                default:
                    return <Login onLoginSuccess={handleLoginSuccess} onNavigate={setView} />;
            }
        }
        
        // After authentication, if there's no profile, force onboarding
        if (view !== 'onboarding' && !userProfile) {
            setView('onboarding');
            return <Onboarding onComplete={handleOnboardingComplete} />;
        }

        switch (view) {
            case 'onboarding':
                return <Onboarding onComplete={handleOnboardingComplete} />;
            case 'dashboard':
                return <Dashboard 
                            userProfile={userProfile!}
                            nutritionGoals={nutritionGoals!}
                            dailyLog={selectedDayLog?.food ?? []}
                            exerciseLog={selectedDayLog?.exercise ?? []}
                            onDeleteMeal={handleDeleteMeal}
                            onNavigate={setView}
                            dailyStreak={dailyStreak}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            t={t}
                        />;
            case 'scanner':
                // FIX: Pass the onNavigate prop to FoodScanner.
                return <FoodScanner onScanComplete={handleScanComplete} onBack={() => setView('dashboard')} onNavigate={setView} />;
            case 'reviewScan':
                if (pendingScan) {
                    return <ReviewScan scanData={pendingScan} onConfirm={handleConfirmScan} onCancel={handleCancelScan} />;
                }
                setView('scanner');
                return null;
             case 'addFood':
                return <AddFood 
                            onAddFood={handleAddManualFood} 
                            onBack={() => setView('dashboard')} 
                            customFoods={customFoods}
                            onAddCustomFood={handleAddCustomFood}
                        />;
            case 'exercise':
                return <ExerciseTracker userWeight={userProfile!.weight} onLogExercise={handleLogExercise} onBack={() => setView('dashboard')} />;
            case 'progress':
                return <Progress history={history} goals={nutritionGoals!} unlockedBadges={unlockedBadges} onBack={() => setView('dashboard')} />;
            case 'settings':
                return <Settings 
                            userProfile={userProfile!} 
                            onSave={handleProfileUpdate} 
                            onBack={() => setView('dashboard')}
                            isDarkMode={isDarkMode}
                            setIsDarkMode={setIsDarkMode}
                            onLogout={handleLogout}
                            language={language}
                            setLanguage={setLanguage}
                            t={t}
                        />;
            case 'chatbot':
               return <Chatbot userProfile={userProfile!} nutritionGoals={nutritionGoals!} onBack={() => setView('dashboard')} t={t} />;
            case 'planning':
                return <Planning
                            t={t}
                            // Meal Planner Props
                            currentMealPlan={currentMealPlan}
                            savedMealPlans={savedMealPlans}
                            onGenerateMealPlan={handleGenerateMealPlan}
                            onSaveMealPlan={handleSaveMealPlan}
                            onGenerateShoppingList={handleGenerateShoppingList}
                            // Recipe Props
                            recipes={recipes}
                            onGenerateRecipe={handleGenerateRecipe}
                            onAddRecipeToLog={handleAddRecipeToLog}
                            // Shopping List Props
                            shoppingList={shoppingList}
                            onUpdateShoppingList={handleUpdateShoppingList}
                            onClearCheckedItems={handleClearCheckedItems}
                            onClearAllItems={handleClearAllItems}
                            // Common Props
                            isLoading={isLoading}
                            error={error}
                            clearError={() => setError(null)}
                        />;
            default:
                // Fallback for authenticated users
                return <Dashboard 
                            userProfile={userProfile!}
                            nutritionGoals={nutritionGoals!}
                            dailyLog={selectedDayLog?.food ?? []}
                            exerciseLog={selectedDayLog?.exercise ?? []}
                            onDeleteMeal={handleDeleteMeal}
                            onNavigate={setView}
                            dailyStreak={dailyStreak}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            t={t}
                        />;
        }
    };

    const isNavVisible = isAuthenticated && view !== 'onboarding' && view !== 'reviewScan';

    return (
        <div className={`min-h-screen bg-transparent text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300`}>
             <div className={`container mx-auto max-w-lg p-2 sm:p-4 transition-all duration-300 ${isNavVisible ? 'pb-24' : ''}`}>
               <div key={view} className="view-animate">
                    {renderView()}
                </div>
            </div>
            {isNavVisible && <BottomNav activeView={view} onNavigate={setView} t={t} />}
        </div>
    );
};

export default App;
