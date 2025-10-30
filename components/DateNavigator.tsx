import React from 'react';

interface DateNavigatorProps {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, setSelectedDate }) => {
    
    const dates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    return (
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
            {dates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = dateStr === selectedDate;
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayOfMonth = date.getDate();

                return (
                    <button 
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex flex-col items-center justify-center w-14 h-20 rounded-full flex-shrink-0 transition-all duration-200
                            ${isSelected 
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg' 
                                : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        <span className="text-xs font-medium uppercase opacity-70">{dayOfWeek}</span>
                        <span className="text-2xl font-bold">{dayOfMonth}</span>
                    </button>
                )
            })}
        </div>
    );
};

export default DateNavigator;