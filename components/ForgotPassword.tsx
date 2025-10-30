import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';
import type { View } from '../App';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface ForgotPasswordProps {
    onNavigate: (view: View) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);
        try {
            const response = await forgotPassword(email);
            setMessage(response.message);
        } catch (err: any) {
             // In this mock, we always show the same message for security
            setMessage("If an account exists for this email, a password reset link has been sent.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-700">Reset Password</h1>
                    <p className="text-gray-600 mt-2">Enter your email to receive a reset link.</p>
                </div>
                
                {message ? (
                    <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
                        <p>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner /> : 'Send Reset Link'}
                        </Button>
                    </form>
                )}
                
                <div className="text-center text-sm text-gray-600">
                    <button onClick={() => onNavigate('login')} className="font-medium text-green-600 hover:underline">
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;