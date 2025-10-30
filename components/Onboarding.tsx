import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Gender, ActivityLevel, Goal } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface OnboardingProps {
    onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        gender: Gender.FEMALE,
        activityLevel: ActivityLevel.LIGHT,
        goal: Goal.MAINTAIN,
    });
    
    const [error, setError] = useState('');

    const handleNext = () => {
        setError('');
        switch(step) {
            case 1:
                if (!profile.age || !profile.gender) {
                    setError('Please fill in all fields.');
                    return;
                }
                break;
            case 2:
                if (!profile.height || !profile.weight) {
                    setError('Please fill in all fields.');
                    return;
                }
                break;
            case 3:
                if (!profile.activityLevel || !profile.goal) {
                    setError('Please make a selection.');
                    return;
                }
                break;
            default:
                break;
        }
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };
    
    const handleSubmit = () => {
         if (profile.age && profile.gender && profile.height && profile.weight && profile.activityLevel && profile.goal) {
            onComplete(profile as UserProfile);
        } else {
             setError('Something went wrong. Please restart the onboarding process.');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value }));
    };
    
    const inputClasses = "w-full p-3 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white";

    return (
        <div className="flex flex-col min-h-[calc(100vh-2rem)] justify-center text-center">
            
            <div className="flex-grow flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome to<br/>NutriScan<span className="text-green-500">VN</span></h1>
                
                <Card className="mt-8 text-left">
                    {step === 1 && (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-xl font-semibold mb-4 text-center">Tell us about yourself</h2>
                            <input type="number" name="age" placeholder="Age" onChange={handleChange} className={inputClasses} />
                            <select name="gender" value={profile.gender} onChange={handleChange} className={inputClasses}>
                                <option value={Gender.FEMALE}>Female</option>
                                <option value={Gender.MALE}>Male</option>
                            </select>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-xl font-semibold mb-4 text-center">Your measurements</h2>
                            <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} className={inputClasses} />
                            <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} className={inputClasses} />
                        </div>
                    )}
                    
                    {step === 3 && (
                         <div className="animate-fade-in space-y-4">
                            <h2 className="text-xl font-semibold text-center">Goals & Lifestyle</h2>
                            <select name="activityLevel" value={profile.activityLevel} onChange={handleChange} className={inputClasses}>
                                <option value="" disabled>Activity Level</option>
                                <option value={ActivityLevel.SEDENTARY}>Sedentary</option>
                                <option value={ActivityLevel.LIGHT}>Lightly active</option>
                                <option value={ActivityLevel.MODERATE}>Moderately active</option>
                                <option value={ActivityLevel.ACTIVE}>Very active</option>
                                <option value={ActivityLevel.VERY_ACTIVE}>Extra active</option>
                            </select>
                             <select name="goal" value={profile.goal} onChange={handleChange} className={inputClasses}>
                                <option value="" disabled>Your Goal</option>
                                <option value={Goal.LOSE}>Lose Weight</option>
                                <option value={Goal.MAINTAIN}>Maintain Weight</option>
                                <option value={Goal.GAIN}>Gain Weight</option>
                            </select>
                            <textarea 
                                name="allergies" 
                                placeholder="Allergies (Optional)" 
                                onChange={handleChange} 
                                className={inputClasses}
                                rows={2}
                            />
                        </div>
                    )}
                </Card>
            </div>
            
            <div className="mt-8">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-center space-x-2 my-4">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`w-2 h-2 rounded-full ${step >= s ? 'bg-gray-800 dark:bg-white' : 'bg-gray-300 dark:bg-slate-700'}`}></div>
                    ))}
                </div>
                <Button onClick={handleNext}>{step === 3 ? "Let's Go!" : "Continue"}</Button>
            </div>
        </div>
    );
};

export default Onboarding;