import React, { useState } from 'react';
import Card from './common/Card';

interface WaterTrackerProps {
    goal: number; // in ml
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ goal }) => {
    const [currentIntake, setCurrentIntake] = useState(0);

    const addWater = (amount: number) => {
        setCurrentIntake(prev => prev + amount);
    };

    const subtractWater = (amount: number) => {
        setCurrentIntake(prev => Math.max(0, prev - amount));
    }

    const percentage = goal > 0 ? Math.round((currentIntake / goal) * 100) : 0;

    return (
        <Card className="flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-gray-500 dark:text-gray-400">Water</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{currentIntake} <span className="text-base font-medium text-gray-400">ml</span></p>
              <p className="text-sm text-gray-400">{Math.round(currentIntake / 250)} of {Math.round(goal / 250)} cups</p>
            </div>
            
            <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                    <button onClick={() => subtractWater(250)} className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-slate-700 rounded-full font-bold text-lg">-</button>
                    <span className="font-semibold text-sm text-gray-500">{percentage}%</span>
                    <button onClick={() => addWater(250)} className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-slate-700 rounded-full font-bold text-lg">+</button>
                </div>
            </div>
        </Card>
    );
};

export default WaterTracker;