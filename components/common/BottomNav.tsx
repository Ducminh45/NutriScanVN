import React from 'react';
import type { View } from '../../App';

interface BottomNavProps {
    activeView: View;
    onNavigate: (view: View) => void;
    t: (key: any) => string;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
            isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
    >
        {React.cloneElement(icon, { className: 'h-6 w-6 mb-1' })}
        <span className={`text-xs font-medium`}>{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, t }) => {
    const navItems = [
        {
            view: 'dashboard',
            label: t('nav.home'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
        },
        {
            view: 'progress',
            label: t('nav.progress'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
        },
         {
            view: 'settings',
            label: t('nav.settings'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.242 1.411l-1.086.955c-.336.296-.336.835 0 1.13l1.086.955a1.125 1.125 0 01.242 1.411l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.242-1.411l1.086-.955c.336-.296.336-.835 0-1.13l-1.086-.955a1.125 1.125 0 01-.242-1.411l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16">
                 <NavItem
                    label={t('nav.home')}
                    icon={navItems[0].icon}
                    isActive={activeView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                />
                <NavItem
                    label={t('nav.progress')}
                    icon={navItems[1].icon}
                    isActive={activeView === 'progress'}
                    onClick={() => onNavigate('progress')}
                />
               
                <div className="w-20" />

                <NavItem
                    label={t('nav.planning')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>}
                    isActive={activeView === 'planning'}
                    onClick={() => onNavigate('planning')}
                />
                <NavItem
                    label={t('nav.settings')}
                    icon={navItems[2].icon}
                    isActive={activeView === 'settings'}
                    onClick={() => onNavigate('settings')}
                />
            </div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <button 
                    onClick={() => onNavigate('scanner')} 
                    className="w-16 h-16 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-slate-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-all transform duration-200 hover:scale-110"
                    aria-label="Scan Food"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;