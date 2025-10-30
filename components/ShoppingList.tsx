import React from 'react';
import type { ShoppingListCategory } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface ShoppingListProps {
    list: ShoppingListCategory[];
    onUpdateItem: (categoryIndex: number, itemIndex: number, checked: boolean) => void;
    onClearChecked: () => void;
    onClearAll: () => void;
    onBackToPlanner: () => void;
    t: (key: any) => string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ list, onUpdateItem, onClearChecked, onClearAll, onBackToPlanner, t }) => {
    const hasItems = list.length > 0;
    const hasCheckedItems = list.some(cat => cat.items.some(item => item.checked));

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold">{t('shopping_list.title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('shopping_list.description')}</p>
            </header>
            
            {hasItems ? (
                <>
                    <div className="flex gap-2">
                        <Button onClick={onClearChecked} variant="secondary" disabled={!hasCheckedItems}>
                            {t('shopping_list.clear_checked')}
                        </Button>
                        <Button onClick={onClearAll} variant="secondary">
                            {t('shopping_list.clear_all')}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {list.map((category, catIndex) => (
                            <Card key={category.category}>
                                <h2 className="text-xl font-semibold mb-3 border-b pb-2 dark:border-gray-600">{category.category}</h2>
                                <ul className="space-y-2">
                                    {category.items.map((item, itemIndex) => (
                                        <li key={`${item.name}-${itemIndex}`} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`item-${catIndex}-${itemIndex}`}
                                                checked={item.checked}
                                                onChange={(e) => onUpdateItem(catIndex, itemIndex, e.target.checked)}
                                                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor={`item-${catIndex}-${itemIndex}`} className={`ml-3 block text-sm ${item.checked ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-gray-600 dark:text-gray-300"> - {item.quantity}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="text-center py-10">
                    <p className="text-gray-600 dark:text-gray-400">{t('shopping_list.empty')}</p>
                    <p className="text-sm text-gray-500 mt-2">{t('shopping_list.empty_prompt')}</p>
                     <Button onClick={onBackToPlanner} variant="secondary" className="mt-4 w-auto px-6">
                        {t('back')} to Planner
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default ShoppingList;