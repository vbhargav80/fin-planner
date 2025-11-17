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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Income: Indigo-600 (Standard "Pill" style) */}
            <div className="bg-indigo-600 rounded-xl p-4 border border-indigo-500 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-100 mb-2">
                    <TrendingUp size={18} />
                    <span className="text-sm font-medium">Income</span>
                </div>
                <div className="text-2xl font-bold text-green-300 font-mono">
                    {formatCurrency(totalIncome)}
                </div>
            </div>

            {/* Expenses: Indigo-600 (Standard "Pill" style) */}
            <div className="bg-indigo-600 rounded-xl p-4 border border-indigo-500 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-100 mb-2">
                    <TrendingDown size={18} />
                    <span className="text-sm font-medium">Expenses</span>
                </div>
                <div className="text-2xl font-bold text-red-300 font-mono">
                    {formatCurrency(totalExpenses)}
                </div>
            </div>

            {/* Net Result: Soft Translucent Backgrounds */}
            <div className={`rounded-xl p-4 border shadow-sm backdrop-blur-sm ${
                remaining >= 0
                    ? 'bg-emerald-900/50 border-emerald-700/50'   // Soft Dark Green
                    : 'bg-rose-900/50 border-rose-700/50'         // Soft Dark Red
            }`}>
                <div className={`flex items-center gap-2 mb-2 ${
                    remaining >= 0 ? 'text-emerald-200' : 'text-rose-200'
                }`}>
                    <Wallet size={18} />
                    <span className="text-sm font-medium">Net Result</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                    {formatCurrency(remaining)}
                </div>
            </div>
        </div>
    );
});