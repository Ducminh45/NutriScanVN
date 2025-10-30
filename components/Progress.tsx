import React, { useState, useMemo } from 'react';
import type { DailyLog, NutritionGoals, Badge } from '../types';
import Card from './common/Card';
import { BADGE_DATA } from '../constants';
import CircularProgress from './common/CircularProgress';

interface ProgressProps {
    history: DailyLog[];
    goals: NutritionGoals;
    unlockedBadges: Set<string>;
    onBack: () => void;
}

const Chart: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card>
        <h2 className="text-lg font-semibold mb-4 dark:text-white">{title}</h2>
        <div className="h-64">{children}</div>
    </Card>
);

const LineChart: React.FC<{ data: { x: string; y: number }[]; goalLine?: number, color: string }> = ({ data, goalLine, color }) => {
    if (data.length < 2) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Not enough data to display a chart.</div>;
    }

    const PADDING = 20;
    const CHART_WIDTH = 500; // Use a larger fixed width for smoother curves
    const CHART_HEIGHT = 200;
    const VIEW_WIDTH = CHART_WIDTH + PADDING * 2;
    const VIEW_HEIGHT = CHART_HEIGHT + PADDING * 2;
    
    const yValues = data.map(d => d.y).filter(y => y > 0);
    if (goalLine) yValues.push(goalLine);
    const yMin = yValues.length > 0 ? Math.min(...yValues) * 0.95 : 0;
    const yMax = yValues.length > 0 ? Math.max(...yValues) * 1.05 : 100;
    
    const getCoords = (dataPointY: number, index: number) => {
        const x = PADDING + (index / (data.length - 1)) * CHART_WIDTH;
        let y = PADDING + CHART_HEIGHT - ((dataPointY - yMin) / (yMax - yMin)) * CHART_HEIGHT;
        if (isNaN(y) || !isFinite(y)) {
            y = PADDING + CHART_HEIGHT;
        }
        return { x, y };
    };

    const linePoints = data.map((d, i) => getCoords(d.y, i));

    const linePath = linePoints.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const [cpsX, cpsY] = [arr[i-1].x + (point.x - arr[i-1].x)/2, arr[i-1].y];
        const [cpeX, cpeY] = [arr[i-1].x + (point.x - arr[i-1].x)/2, point.y];
        return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
    }, "");

    const areaPath = `${linePath} L ${linePoints[linePoints.length-1].x},${VIEW_HEIGHT - PADDING} L ${linePoints[0].x},${VIEW_HEIGHT - PADDING} Z`;

    const goalLineY = goalLine ? getCoords(goalLine, 0).y : null;

    return (
        <div className="relative w-full h-full">
         <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#gradient-${color})`} />
            {goalLineY && (
                <line x1={PADDING} y1={goalLineY} x2={CHART_WIDTH+PADDING} y2={goalLineY} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="4"/>
            )}
            <path d={linePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        </div>
    );
};


const Achievements: React.FC<{unlockedBadges: Set<string>}> = ({ unlockedBadges }) => {
    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Achievements</h2>
            <div className="grid grid-cols-4 gap-4">
                {BADGE_DATA.map(badge => {
                    const isUnlocked = unlockedBadges.has(badge.id);
                    return (
                        <div key={badge.id} className={`text-center p-2 rounded-lg transition-all duration-300 ${isUnlocked ? '' : 'opacity-40'}`}>
                            <div className={`text-4xl transition-transform transform hover:scale-110`}>{badge.icon}</div>
                            <p className={`font-semibold text-xs mt-1 text-gray-600 dark:text-gray-300`}>{badge.title}</p>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

const Progress: React.FC<ProgressProps> = ({ history, goals, unlockedBadges, onBack }) => {
    const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

    const filteredHistory = useMemo(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (timeRange - 1));
        
        const dateMap = new Map<string, DailyLog>();
        history.forEach(log => dateMap.set(log.date, log));
        
        const result: DailyLog[] = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                result.push(dateMap.get(dateStr)!);
            } else {
                const lastKnownWeight = [...history].reverse().find(h => h.date <= dateStr)?.weight || 0;
                result.push({ date: dateStr, food: [], exercise: [], weight: lastKnownWeight });
            }
        }
        return result;
    }, [history, timeRange]);

    const chartData = useMemo(() => {
        return filteredHistory.map(log => ({
            date: log.date,
            weight: log.weight,
            calories: log.food.reduce((sum, item) => sum + item.totalCalories, 0),
        }));
    }, [filteredHistory]);
    
    const weightData = chartData.map(d => ({ x: d.date, y: d.weight }));
    const calorieData = chartData.map(d => ({ x: d.date, y: d.calories }));
    const lastWeight = history.length > 0 ? history[history.length - 1].weight : 0;
    const daysLogged = new Set(history.map(h => h.date)).size;

    return (
        <div className="animate-fade-in space-y-4">
            <header className="text-center pt-2">
                <h1 className="text-3xl font-bold dark:text-white">Progress</h1>
            </header>
            
            <div className="grid grid-cols-2 gap-4">
                <Card className="flex flex-col items-center justify-center text-center">
                    <CircularProgress progress={100} size={80} strokeWidth={8} color="text-purple-500">
                       <span className="text-xl font-bold">{lastWeight}<span className="text-sm">kg</span></span>
                    </CircularProgress>
                    <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Last Weight</p>
                </Card>
                <Card className="flex flex-col items-center justify-center text-center">
                    <CircularProgress progress={(daysLogged/30)*100} size={80} strokeWidth={8} color="text-blue-500">
                       <span className="text-2xl font-bold">{daysLogged}</span>
                    </CircularProgress>
                     <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Days Logged</p>
                </Card>
            </div>
            
            <Card>
                <div className="flex justify-center bg-gray-100 dark:bg-slate-700 p-1 rounded-full">
                    {[7, 30, 90].map(days => (
                        <button
                            key={days}
                            onClick={() => setTimeRange(days as 7|30|90)}
                            className={`px-4 py-1.5 rounded-full font-semibold transition-colors text-sm w-full ${timeRange === days ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {days} Days
                        </button>
                    ))}
                </div>
            </Card>

            <Chart title={`Goal Progress (Weight)`}>
                <LineChart data={weightData} color="#8B5CF6" />
            </Chart>

            <Chart title={`Calorie Intake`}>
                <LineChart data={calorieData} goalLine={goals.calories} color="#10B981" />
            </Chart>

            <Achievements unlockedBadges={unlockedBadges} />
        </div>
    );
};

export default Progress;