
import React from 'react';

// FIX: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

// FIX: Destructure ...props and spread them onto the div element.
const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
