import React, { useState, useMemo } from 'react';
import type { LoggedExercise } from '../types';
import { EXERCISE_DATA } from '../constants';
import { calculateCaloriesBurned } from '../utils/nutritionCalculator';
import Button from './common/Button';
import Card from './common/Card';

interface ExerciseTrackerProps {
    userWeight: number; // in kg
    onLogExercise: (exercise: Omit<LoggedExercise, 'id' | 'date'>) => void;
    onBack: () => void;
}

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ userWeight, onLogExercise, onBack }) => {
    const [selectedExerciseName, setSelectedExerciseName] = useState(EXERCISE_DATA[0].name);
    const [duration, setDuration] = useState(''); // in minutes
    const [error, setError] = useState('');

    const selectedExercise = useMemo(() => {
        return EXERCISE_DATA.find(ex => ex.name === selectedExerciseName)!;
    }, [selectedExerciseName]);

    const caloriesBurned = useMemo(() => {
        const durationNum = parseInt(duration, 10);
        if (!selectedExercise || isNaN(durationNum) || durationNum <= 0) {
            return 0;
        }
        return calculateCaloriesBurned(selectedExercise, durationNum, userWeight);
    }, [selectedExercise, duration, userWeight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const durationNum = parseInt(duration, 10);
        if (isNaN(durationNum) || durationNum <= 0) {
            setError('Please enter a valid duration in minutes.');
            return;
        }
        if (caloriesBurned > 0) {
            onLogExercise({
                name: selectedExercise.name,
                caloriesBurned: caloriesBurned,
            });
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <header className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-2xl font-bold">Log Your Exercise</h1>
            </header>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                        <select
                            id="exercise-select"
                            value={selectedExerciseName}
                            onChange={(e) => setSelectedExerciseName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        >
                            {EXERCISE_DATA.map(ex => (
                                <option key={ex.name} value={ex.name}>{ex.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="duration-input" className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input
                            id="duration-input"
                            type="number"
                            value={duration}
                            onChange={(e) => {
                                setDuration(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., 30"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {caloriesBurned > 0 && (
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-sm text-gray-600">Estimated Calories Burned:</p>
                            <p className="text-3xl font-bold text-orange-600">{caloriesBurned} kcal</p>
                        </div>
                    )}
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="pt-4">
                        <Button type="submit" variant="primary" disabled={caloriesBurned <= 0}>
                            Add to Log
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ExerciseTracker;
