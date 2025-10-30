
import React, { useState, useRef } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import type { ScannedMeal } from '../types';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Card from './common/Card';
import CameraCapture from './CameraCapture';
// FIX: Import the View type to use it in the onNavigate prop.
import { View } from '../App';

interface FoodScannerProps {
    onScanComplete: (meal: Omit<ScannedMeal, 'id' | 'mealType' | 'date'> & { imagePreview?: string }) => void;
    onBack: () => void;
    // FIX: Add onNavigate prop for navigation.
    onNavigate: (view: View) => void;
}

// FIX: Destructure the new onNavigate prop.
const FoodScanner: React.FC<FoodScannerProps> = ({ onScanComplete, onBack, onNavigate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const processFile = async (file: File) => {
        setError(null);
        setIsLoading(true);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            analyzeAndComplete(file, result);
        };
        reader.readAsDataURL(file);
    };
    
    const analyzeAndComplete = async (file: File, preview: string) => {
         try {
            const result = await analyzeFoodImage(file);
            onScanComplete({ ...result, imagePreview: preview });
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            setIsLoading(false);
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
           await processFile(file);
        }
    };
    
    const handleCaptureComplete = async (imageFile: File) => {
        setShowCamera(false);
        await processFile(imageFile);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    if (showCamera) {
        return <CameraCapture onCapture={handleCaptureComplete} onBack={() => setShowCamera(false)} />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in justify-center">
             <header className="text-center mb-8">
                <h1 className="text-3xl font-bold dark:text-white">Log a Meal</h1>
                 <p className="text-gray-500 dark:text-gray-400">Choose your method</p>
            </header>
            
            <div className="flex-grow flex flex-col justify-center items-center">
                {isLoading ? (
                    <Card className="w-full text-center">
                        <Spinner />
                        <p className="mt-4 font-semibold text-gray-600 dark:text-gray-400">Analyzing your meal...</p>
                        <p className="text-sm text-gray-500">This might take a moment.</p>
                         {imagePreview && <img src={imagePreview} alt="Meal preview" className="max-h-48 w-auto mx-auto rounded-lg mt-4" />}
                    </Card>
                ) : (
                    <div className="w-full space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            aria-label="Upload meal photo"
                        />
                        <Card 
                            onClick={handleUploadClick} 
                            role="button" 
                            tabIndex={0} 
                            onKeyPress={(e) => e.key === 'Enter' && handleUploadClick()} 
                            className="cursor-pointer text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <p className="mt-2 font-semibold text-lg text-gray-800 dark:text-gray-200">Upload Photo</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">from your gallery</p>
                        </Card>
                        
                        <Card
                             onClick={() => setShowCamera(true)}
                             role="button" 
                             tabIndex={0} 
                             onKeyPress={(e) => e.key === 'Enter' && setShowCamera(true)} 
                             className="cursor-pointer text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                            <p className="mt-2 font-semibold text-lg text-gray-800 dark:text-gray-200">Use Camera</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">to take a photo</p>
                        </Card>
                        
                         <Card
                             onClick={() => onNavigate('addFood')}
                             role="button" 
                             tabIndex={0} 
                             onKeyPress={(e) => e.key === 'Enter' && onNavigate('addFood')} 
                             className="cursor-pointer text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                             <p className="mt-2 font-semibold text-lg text-gray-800 dark:text-gray-200">Search Database</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">to add manually</p>
                        </Card>
                    </div>
                )}
                 {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default FoodScanner;
