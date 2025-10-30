import React, { useState, useMemo } from 'react';
import type { FoodItem, MealType } from '../types';
import { LOCAL_FOOD_DATABASE } from '../constants';
import Button from './common/Button';
import Card from './common/Card';

interface AddFoodProps {
    onAddFood: (foodItem: FoodItem, mealType: MealType) => void;
    onBack: () => void;
    customFoods: FoodItem[];
    onAddCustomFood: (foodItem: FoodItem) => void;
}

const AddFood: React.FC<AddFoodProps> = ({ onAddFood, onBack, customFoods, onAddCustomFood }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [mealType, setMealType] = useState<MealType>('Lunch');
    const [isCreating, setIsCreating] = useState(false);
    const [newFood, setNewFood] = useState<Omit<FoodItem, 'custom'>>({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: ''});
    const [activeTab, setActiveTab] = useState<'all' | 'my-foods'>('all');

    const combinedFoodDatabase = useMemo(() => {
        const allFoods = [...customFoods, ...LOCAL_FOOD_DATABASE];
        const uniqueFoods = allFoods.filter((food, index, self) => 
            index === self.findIndex((f) => f.name === food.name)
        );
        return uniqueFoods;
    }, [customFoods]);

    const foodList = useMemo(() => {
        const source = activeTab === 'all' ? combinedFoodDatabase : customFoods;
        if (!searchTerm) {
            return source;
        }
        return source.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, combinedFoodDatabase, customFoods, activeTab]);

    const handleAdd = (food: FoodItem) => {
        // For simplicity, auto-log as Lunch. A real app might have a modal.
        onAddFood(food, 'Lunch');
    };
    
    const handleCreateCustomFood = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (newFood.name && newFood.calories > 0 && newFood.servingSize) {
            onAddCustomFood({ ...newFood, custom: true });
            setIsCreating(false);
            setNewFood({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, servingSize: '' });
        }
    };
    
    const TabButton: React.FC<{tab: 'all' | 'my-foods', label: string}> = ({tab, label}) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
        >
            {label}
        </button>
    );

    if (isCreating) {
        return (
             <div className="animate-fade-in space-y-4">
                <header className="flex items-center">
                    <button onClick={() => setIsCreating(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold">Create Food</h1>
                </header>
                <Card>
                    <form onSubmit={handleCreateCustomFood} className="space-y-4">
                        <input type="text" placeholder="Food Name" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" required />
                        <input type="text" placeholder="Serving Size (e.g., 1 bowl, 100g)" value={newFood.servingSize} onChange={e => setNewFood({...newFood, servingSize: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" required />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" placeholder="Calories" value={newFood.calories || ''} onChange={e => setNewFood({...newFood, calories: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" required />
                            <input type="number" placeholder="Protein (g)" value={newFood.protein || ''} onChange={e => setNewFood({...newFood, protein: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" />
                            <input type="number" placeholder="Carbs (g)" value={newFood.carbs || ''} onChange={e => setNewFood({...newFood, carbs: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" />
                            <input type="number" placeholder="Fat (g)" value={newFood.fat || ''} onChange={e => setNewFood({...newFood, fat: parseInt(e.target.value) || 0})} className="w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" />
                        </div>
                        <Button type="submit">Save Custom Food</Button>
                    </form>
                </Card>
            </div>
        )
    }

    return (
        <div className="animate-fade-in space-y-4">
            <header className="flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700/50 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-2xl font-bold">Food Database</h1>
            </header>

            <div className="sticky top-4 z-10">
                <input
                    type="text"
                    placeholder="Describe what you ate"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
            </div>
            
            <div className="flex items-center">
                <TabButton tab="all" label="All"/>
                <TabButton tab="my-foods" label="My Foods"/>
                <button onClick={() => setIsCreating(true)} className="ml-auto text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white">+ Add Food</button>
            </div>

            <h2 className="text-lg font-semibold dark:text-white">Suggestions</h2>

            <div className="space-y-3">
                {foodList.map(item => (
                    <Card key={item.name} className="p-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg mr-4">
                                    {item.custom ? '🧑‍🍳' : '🍲'}
                                </div>
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.calories} cal • {item.servingSize}</p>
                                </div>
                            </div>
                           <button onClick={() => handleAdd(item)} className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg font-bold text-lg hover:bg-gray-200 dark:hover:bg-slate-600">+</button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AddFood;