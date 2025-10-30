import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'normal' | 'small';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'normal', className = '', ...props }) => {
    const baseClasses = "w-full text-center font-bold rounded-full shadow-sm transition-all transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
    
    const sizeClasses = {
      normal: 'py-3 px-6 text-base',
      small: 'py-2 px-4 text-sm'
    }

    const variantClasses = {
        primary: 'bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-white',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600 dark:focus:ring-slate-500',
    };

    return (
        <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;