import React, { useState } from 'react';
import { signup } from '../services/authService';
import type { View } from '../App';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface SignupProps {
    onSignupSuccess: () => void;
    onNavigate: (view: View) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await signup(email, password);
            onSignupSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to sign up.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-700">Create Account</h1>
                    <p className="text-gray-600 mt-2">Join NutriScanVN today!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (min. 6 characters)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />
                     <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Create Account'}
                    </Button>
                </form>
                <div className="text-center text-sm text-gray-600">
                    <p>
                        Already have an account?{' '}
                        <button onClick={() => onNavigate('login')} className="font-medium text-green-600 hover:underline">
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;