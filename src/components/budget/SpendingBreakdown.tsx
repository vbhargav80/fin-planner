import React, { memo, useMemo } from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { ExpenseCategory } from '../../types/budget.types';
import { CategoryIcon } from './CategoryIcon';

interface Props {
    categories: ExpenseCategory[];
    totalExpenses: number;
}

export const SpendingBreakdown: React.FC<Props> = memo(({ categories, totalExpenses }) => {

    const sortedCategories = useMemo(() => {
        // Filter items first, then sort categories
        return [...categories]
            .map(cat => ({
                ...cat,
                // Create a "clean" version of items for display logic
                items: cat.items.filter(i => !i.isHidden)
            }))
            .sort((a, b) => {
                const totalA = a.items.reduce((sum, item) => sum + item.amount, 0);
                const totalB = b.items.reduce((sum, item) => sum + item.amount, 0);
                return totalB - totalA;
            });
    }, [categories]);

    return (
        <div className="bg-indigo-800 rounded-2xl p-6 shadow-inner border border-indigo-700">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-indigo-700">
                <PieChart className="text-indigo-300" size={20} />
                <h4 className="text-indigo-100 text-sm font-bold uppercase tracking-wider">
                    Where is your money going?
                </h4>
            </div>

            <div className="space-y-5">
                {sortedCategories.map(cat => {
                    // Sum only visible items (filtered above)
                    const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);

                    // If category is empty or has $0 total after filtering, skip it
                    if (catTotal === 0) return null;

                    const percentage = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;

                    return (
                        <div key={cat.id} className="group">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-indigo-100 font-medium group-hover:text-white transition-colors flex items-center gap-2">
                                    <CategoryIcon iconKey={cat.iconKey} size={16} className="text-indigo-300 group-hover:text-indigo-200" />
                                    {cat.name}
                                </span>
                                <div className="text-right">
                                    <span className="text-white font-mono mr-3 font-medium">
                                        {formatCurrency(catTotal)}
                                    </span>
                                    <span className="text-indigo-300 text-xs w-8 inline-block text-right">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-indigo-900/50 rounded-full h-2 overflow-hidden shadow-inner">
                                <div
                                    className="bg-indigo-400 h-full rounded-full transition-all duration-500 ease-out group-hover:bg-indigo-300"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
});