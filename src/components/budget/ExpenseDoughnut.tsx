import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ExpenseCategory } from '../../types/budget.types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
    categories: ExpenseCategory[];
}

const COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#84cc16', // Lime
];

export const ExpenseDoughnut: React.FC<Props> = ({ categories }) => {
    const data = useMemo(() => {
        return categories
            .map(cat => ({
                name: cat.name,
                // Filter out hidden items before summing
                value: cat.items
                    .filter(i => !i.isHidden)
                    .reduce((sum, item) => sum + item.amount, 0)
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [categories]);

    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-indigo-300 text-sm">
                No expenses to display
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-8 sm:gap-6 py-4">

            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4338ca', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            separator=": "
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-indigo-300 font-medium uppercase tracking-wider">Total</span>
                    <span className="text-sm sm:text-base font-bold text-white">{formatCurrency(total)}</span>
                </div>
            </div>

            <div className="flex flex-col justify-center gap-2 w-full sm:w-auto overflow-y-auto max-h-[200px] sm:max-h-none sm:overflow-visible custom-scrollbar pr-2">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between sm:justify-start gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-indigo-100 truncate max-w-[120px] sm:max-w-[150px]" title={entry.name}>
                                {entry.name}
                            </span>
                        </div>
                        <div className="text-white font-mono font-medium">
                            {Math.round((entry.value / total) * 100)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};