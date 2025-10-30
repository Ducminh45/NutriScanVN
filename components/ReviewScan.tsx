import React, { useState } from 'react';
import type { ScannedMeal, MealType } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface ReviewScanProps {
    scanData: Omit<ScannedMeal, 'id' | 'mealType' | 'date' | 'image'> & { imagePreview?: string };
    onConfirm: (mealType: MealType) => void;
    onCancel: () => void;
}

const StatCard: React.FC<{label: string, value: string, icon: string}> = ({label, value, icon}) => (
    <div className="flex-1 text-center bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
        <div className="text-2xl">{icon}</div>
        <div className="font-bold text-lg text-gray-900 dark:text-white">{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
);


const ReviewScan: React.FC<ReviewScanProps> = ({ scanData, onConfirm, onCancel }) => {
    const [mealType, setMealType] = useState<MealType>('Lunch');

    const handleConfirm = () => {
        onConfirm(mealType);
    };

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-4">
             <header className="flex items-center justify-between">
                 <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold">Nutrition</h1>
                <div className="w-10 h-10"></div>
            </header>

            {scanData.imagePreview && (
                <div className="h-48 w-full rounded-2xl overflow-hidden">
                    <img src={scanData.imagePreview} alt="Scanned Meal" className="w-full h-full object-cover" />
                </div>
            )}
            
            <div>
                <h2 className="text-2xl font-bold dark:text-white">{scanData.foodItems.map(i => i.name).join(', ')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI Analysis Results</p>
            </div>

            <Card className="flex items-center justify-between">
                <span className="font-bold text-gray-500 dark:text-gray-400">Calories</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{scanData.totalCalories}</span>
            </Card>

            <div className="flex gap-4">
                <StatCard label="Protein" value={`${scanData.totalProtein}g`} icon="🥩" />
                <StatCard label="Carbs" value={`${scanData.totalCarbs}g`} icon="🍞" />
                <StatCard label="Fats" value={`${scanData.totalFat}g`} icon="🥑" />
            </div>

            <Card>
                <h2 className="text-lg font-semibold mb-2">Log as...</h2>
                 <select 
                    value={mealType} 
                    onChange={(e) => setMealType(e.target.value as MealType)} 
                    className="w-full p-3 border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700 rounded-lg mb-4 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                </select>
            </Card>
            
            <div className="mt-auto grid grid-cols-2 gap-4">
                 <Button onClick={onCancel} variant="secondary">
                    Fix Results
                </Button>
                 <Button onClick={handleConfirm}>
                    Done
                </Button>
            </div>
        </div>
    );
};

export default ReviewScan;