import React from 'react';
import type { MealPlan } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface MealPlannerProps {
    currentPlan: Omit<MealPlan, 'id' | 'generatedDate'> | null;
    savedPlans: MealPlan[];
    onGeneratePlan: () => void;
    onSavePlan: () => void;
    onGenerateList: (plan: MealPlan) => void;
    isLoading: boolean;
    error: string | null;
    t: (key: any) => string;
}

const PlanViewer: React.FC<{ plan: Omit<MealPlan, 'id' | 'generatedDate'> }> = ({ plan }) => (
    <Card>
        <h2 className="text-2xl font-bold mb-4">{plan.planName}</h2>
        <div className="space-y-4">
            {plan.dailyPlans.map(day => (
                <div key={day.day}>
                    <h3 className="text-lg font-semibold border-b pb-1 mb-2 flex justify-between dark:border-gray-600">
                        <span>{day.day}</span>
                        <span className="font-normal text-gray-600 dark:text-gray-400">~{day.totalCalories} kcal</span>
                    </h3>
                    <ul className="space-y-1 pl-2">
                        {day.meals.map(meal => (
                            <li key={meal.dishName} className="flex justify-between text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">{meal.mealType}:</span>
                                <span>{meal.dishName} ({meal.calories} kcal)</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </Card>
);


const MealPlanner: React.FC<MealPlannerProps> = ({ currentPlan, savedPlans, onGeneratePlan, onSavePlan, onGenerateList, isLoading, error, t }) => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold">{t('meal_planner.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('meal_planner.description_7day')}</p>
            </header>

            {error && <Card className="bg-red-50 text-red-700">{error}</Card>}

            {isLoading && (
                <Card className="flex flex-col items-center justify-center py-10">
                    <Spinner />
                    <p className="mt-4 font-semibold">{t('meal_planner.generating')}</p>
                </Card>
            )}

            {!isLoading && currentPlan && (
                <div className="space-y-4">
                    <PlanViewer plan={currentPlan} />
                    <Button onClick={onSavePlan}>{t('meal_planner.save_plan')}</Button>
                </div>
            )}
            
            {!isLoading && !currentPlan && (
                 <Button onClick={onGeneratePlan} disabled={isLoading}>
                    {isLoading ? t('meal_planner.generating') : t('meal_planner.generate_button')}
                </Button>
            )}

            <div className="space-y-4">
                <h2 className="text-2xl font-bold border-b pb-2 dark:border-gray-600">{t('meal_planner.saved_plans')}</h2>
                {savedPlans.length > 0 ? (
                    savedPlans.map(plan => (
                        <Card key={plan.id}>
                            <h3 className="font-bold">{plan.planName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('save')} on: {plan.generatedDate}</p>
                            <Button onClick={() => onGenerateList(plan)} variant="secondary">
                                {t('meal_planner.generate_list')}
                            </Button>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 pt-4">{t('meal_planner.no_saved_plans')}</p>
                )}
            </div>
        </div>
    );
};

export default MealPlanner;