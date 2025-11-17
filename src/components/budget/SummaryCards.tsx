// File: src/components/budget/SummaryCards.tsx
import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface Props {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
}

export const SummaryCards: React.FC<Props> = memo(({ totalIncome, totalExpenses, remaining }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {/* Income */}
            <div className="bg-indigo-600 rounded-xl p-4 border border-indigo-500 shadow-sm min-w-0">
                <div className="flex items-center gap-2 text-indigo-100 mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Income</span>
                </div>
                <div
                    className="text-lg lg:text-xl xl:text-2xl font-bold text-green-300 font-mono truncate"
                    title={formatCurrency(totalIncome)}
                >
                    {formatCurrency(totalIncome)}
                </div>
            </div>

            {/* Expenses */}
            <div className="bg-indigo-600 rounded-xl p-4 border border-indigo-500 shadow-sm min-w-0">
                <div className="flex items-center gap-2 text-indigo-100 mb-1">
                    <TrendingDown size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Expenses</span>
                </div>
                <div
                    className="text-lg lg:text-xl xl:text-2xl font-bold text-red-300 font-mono truncate"
                    title={formatCurrency(totalExpenses)}
                >
                    {formatCurrency(totalExpenses)}
                </div>
            </div>

            {/* Net Result */}
            <div className={`rounded-xl p-4 border shadow-sm backdrop-blur-sm min-w-0 ${
                remaining >= 0
                    ? 'bg-emerald-900/50 border-emerald-700/50'
                    : 'bg-red-900/80 border-red-700/50'
            }`}>
                <div className={`flex items-center gap-2 mb-1 ${
                    remaining >= 0 ? 'text-emerald-200' : 'text-red-200'
                }`}>
                    <Wallet size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Net Result</span>
                </div>
                <div
                    className="text-lg lg:text-xl xl:text-2xl font-bold font-mono text-white truncate"
                    title={formatCurrency(remaining)}
                >
                    {formatCurrency(remaining)}
                </div>
            </div>
        </div>
    );
});