import React, { useState } from 'react';
import { login } from '../services/authService';
import type { User } from '../types';
import type { View } from '../App';
import Button from './common/Button';
import Spinner from './common/Spinner';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onNavigate: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const user = await login(email, password);
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message || 'Failed to log in.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-green-700">NutriScan<span className="text-green-500">VN</span></h1>
                    <p className="text-gray-600 mt-2">Welcome back! Please sign in.</p>
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
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Log In'}
                    </Button>
                </form>
                <div className="text-center text-sm text-gray-600">
                    <button onClick={() => onNavigate('forgotPassword')} className="font-medium text-green-600 hover:underline">
                        Forgot password?
                    </button>
                </div>
                <div className="text-center text-sm text-gray-600">
                    <p>
                        Don't have an account?{' '}
                        <button onClick={() => onNavigate('signup')} className="font-medium text-green-600 hover:underline">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;