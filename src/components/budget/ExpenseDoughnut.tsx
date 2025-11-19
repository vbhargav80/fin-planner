import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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
                value: cat.items.reduce((sum, item) => sum + item.amount, 0)
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
        <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4338ca', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: '12px', color: '#e0e7ff' }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-24">
                <span className="text-xs text-indigo-300 font-medium uppercase">Total</span>
                <span className="text-lg font-bold text-white">{formatCurrency(total)}</span>
            </div>
        </div>
    );
};