import React, { useState } from 'react';
import type { MealPlan, Recipe, ShoppingListCategory } from '../types';
import MealPlanner from './MealPlanner';
import Recipes from './Recipes';
import ShoppingList from './ShoppingList';

type PlanningTab = 'planner' | 'recipes' | 'list';

interface PlanningProps {
    t: (key: any) => string;
    // Meal Planner Props
    currentMealPlan: Omit<MealPlan, 'id' | 'generatedDate'> | null;
    savedMealPlans: MealPlan[];
    onGenerateMealPlan: () => Promise<void>;
    onSaveMealPlan: () => void;
    onGenerateShoppingList: (plan: MealPlan) => Promise<boolean>;
    // Recipe Props
    recipes: Recipe[];
    onGenerateRecipe: (dishName: string) => Promise<void>;
    onAddRecipeToLog: (recipe: Recipe) => void;
    // Shopping List Props
    shoppingList: ShoppingListCategory[];
    onUpdateShoppingList: (categoryIndex: number, itemIndex: number, checked: boolean) => void;
    onClearCheckedItems: () => void;
    onClearAllItems: () => void;
    // Common Props
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

const Planning: React.FC<PlanningProps> = (props) => {
    const [activeTab, setActiveTab] = useState<PlanningTab>('planner');

    const handleGenerateList = async (plan: MealPlan) => {
        const success = await props.onGenerateShoppingList(plan);
        if (success) {
            setActiveTab('list');
        }
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'planner':
                return (
                    <MealPlanner
                        t={props.t}
                        currentPlan={props.currentMealPlan}
                        savedPlans={props.savedMealPlans}
                        onGeneratePlan={props.onGenerateMealPlan}
                        onSavePlan={props.onSaveMealPlan}
                        onGenerateList={handleGenerateList}
                        isLoading={props.isLoading}
                        error={props.error}
                    />
                );
            case 'recipes':
                return (
                    <Recipes
                        t={props.t}
                        recipes={props.recipes}
                        onGenerateRecipe={props.onGenerateRecipe}
                        onAddRecipeToLog={props.onAddRecipeToLog}
                        isLoading={props.isLoading}
                        error={props.error}
                        clearError={props.clearError}
                    />
                );
            case 'list':
                return (
                    <ShoppingList
                        t={props.t}
                        list={props.shoppingList}
                        onUpdateItem={props.onUpdateShoppingList}
                        onClearChecked={props.onClearCheckedItems}
                        onClearAll={props.onClearAllItems}
                        onBackToPlanner={() => setActiveTab('planner')}
                    />
                );
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{ tabName: PlanningTab; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 py-2 px-1 text-center font-semibold border-b-4 transition-colors ${
                activeTab === tabName
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="animate-fade-in space-y-4">
            <div className="sticky top-0 bg-slate-100 dark:bg-gray-900 z-10 -mx-4 px-4 pt-2">
                 <div className="flex justify-around border-b dark:border-gray-700">
                    <TabButton tabName="planner" label={props.t('planning.tabs.planner')} />
                    <TabButton tabName="recipes" label={props.t('planning.tabs.recipes')} />
                    <TabButton tabName="list" label={props.t('planning.tabs.list')} />
                </div>
            </div>
            
            <div className="mt-4">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default Planning;