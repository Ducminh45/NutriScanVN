import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface RecipesProps {
    recipes: Recipe[];
    onGenerateRecipe: (dishName: string) => Promise<void>;
    onAddRecipeToLog: (recipe: Recipe) => void;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    t: (key: any) => string;
}

const RecipeDisplay: React.FC<{ recipe: Recipe, onAdd: (recipe: Recipe) => void }> = ({ recipe, onAdd }) => (
    <Card className="space-y-4">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">{recipe.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 italic">{recipe.description}</p>
        
        <div>
            <h3 className="text-lg font-semibold border-b pb-1 mb-2 dark:border-gray-600">Nutrition (per serving)</h3>
            <div className="flex justify-around text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span><span className="font-bold">{recipe.nutrition.calories}</span> kcal</span>
                <span><span className="font-bold">{recipe.nutrition.protein}</span>g Protein</span>
                <span><span className="font-bold">{recipe.nutrition.carbs}</span>g Carbs</span>
                <span><span className="font-bold">{recipe.nutrition.fat}</span>g Fat</span>
            </div>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold border-b pb-1 mb-2 dark:border-gray-600">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>

        <div>
            <h3 className="text-lg font-semibold border-b pb-1 mb-2 dark:border-gray-600">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                 {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
        </div>

        <Button onClick={() => onAdd(recipe)}>Add Nutrition to Log</Button>
    </Card>
);

const Recipes: React.FC<RecipesProps> = ({ recipes, onGenerateRecipe, onAddRecipeToLog, isLoading, error, clearError, t }) => {
    const [dishName, setDishName] = useState('');

    useEffect(() => {
        // Clear error when component unmounts or dishName changes
        return () => {
            clearError();
        };
    }, [dishName, clearError]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!dishName.trim()) return;
        onGenerateRecipe(dishName);
        setDishName('');
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold">{t('recipes.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('recipes.description')}</p>
            </header>
            
            <Card>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="e.g., Bún Bò Huế, Chả Cá Lã Vọng"
                        className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !dishName.trim()}>
                        {isLoading ? <Spinner /> : t('recipes.generate')}
                    </Button>
                </form>
            </Card>

            {error && <Card className="bg-red-50 text-red-700">{error}</Card>}
            
            <div className="space-y-4">
                {recipes.map((recipe, index) => (
                    <RecipeDisplay key={`${recipe.title}-${index}`} recipe={recipe} onAdd={onAddRecipeToLog} />
                ))}
            </div>

        </div>
    );
};

export default Recipes;