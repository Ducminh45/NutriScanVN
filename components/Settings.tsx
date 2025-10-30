import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Gender, ActivityLevel, Goal } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import { Language } from '../i18n';

interface SettingsProps {
    userProfile: UserProfile;
    onSave: (newProfile: UserProfile) => void;
    onBack: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    onLogout: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: any) => string;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, onSave, onBack, isDarkMode, setIsDarkMode, onLogout, language, setLanguage, t }) => {
    const [profile, setProfile] = useState<UserProfile>(userProfile);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value }));
        setHasChanges(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(profile);
        setHasChanges(false);
    };

    return (
        <div className="animate-fade-in space-y-4">
             <header className="text-center pt-2">
                <h1 className="text-3xl font-bold dark:text-white">{t('settings.title')}</h1>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <Card>
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('settings.profile')}</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Age</label>
                                    <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1" />
                                </div>
                                 <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Gender</label>
                                    <select name="gender" value={profile.gender} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1">
                                        <option value={Gender.FEMALE}>Female</option>
                                        <option value={Gender.MALE}>Male</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Height (cm)</label>
                                    <input type="number" name="height" value={profile.height} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1" />
                                </div>
                                 <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Weight (kg)</label>
                                    <input type="number" name="weight" value={profile.weight} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('settings.goals_activity')}</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Activity Level</label>
                                <select name="activityLevel" value={profile.activityLevel} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1">
                                    <option value={ActivityLevel.SEDENTARY}>Sedentary</option>
                                    <option value={ActivityLevel.LIGHT}>Lightly active</option>
                                    <option value={ActivityLevel.MODERATE}>Moderately active</option>
                                    <option value={ActivityLevel.ACTIVE}>Very active</option>
                                    <option value={ActivityLevel.VERY_ACTIVE}>Extra active</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Your Goal</label>
                                 <select name="goal" value={profile.goal} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1">
                                    <option value={Goal.LOSE}>Lose Weight</option>
                                    <option value={Goal.MAINTAIN}>Maintain Weight</option>
                                    <option value={Goal.GAIN}>Gain Weight</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Allergies</label>
                                <textarea 
                                    name="allergies"
                                    value={profile.allergies || ''}
                                    placeholder="e.g., Peanuts, Shellfish" 
                                    onChange={handleChange} 
                                    className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white mt-1"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </Card>
                    
                    {hasChanges && (
                      <div className="pt-2">
                          <Button type="submit">
                              {t('settings.save_changes')}
                          </Button>
                      </div>
                    )}
                </div>
            </form>

            <Card>
                <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('settings.appearance')}</h2>
                <div className="flex justify-between items-center mb-4">
                    <label htmlFor="dark-mode-toggle" className="font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.dark_mode')}
                    </label>
                    <button
                        id="dark-mode-toggle"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                            isDarkMode ? 'bg-gray-900' : 'bg-gray-200'
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isDarkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
                 <div className="flex justify-between items-center">
                    <label htmlFor="language-select" className="font-medium text-gray-700 dark:text-gray-300">
                       {t('settings.language')}
                    </label>
                    <select 
                        id="language-select"
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg border-transparent focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    >
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                    </select>
                </div>
            </Card>
            
            <Card>
                 <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('settings.account')}</h2>
                 <Button onClick={onLogout} variant="secondary">
                    {t('settings.logout')}
                 </Button>
            </Card>
        </div>
    );
};

export default Settings;