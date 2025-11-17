import React from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';
import { SummaryCards } from './SummaryCards';
import { SpendingBreakdown } from './SpendingBreakdown';
import type { ExpenseCategory } from '../../types/budget.types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
    expenseCategories: ExpenseCategory[];
    // New Props
    isOptimizing: boolean;
    totalOptimizedExpenses: number;
    potentialSavings: number;
}

export const BudgetDashboard: React.FC<Props> = ({
                                                     totalIncome, totalExpenses, remaining, expenseCategories,
                                                     isOptimizing, totalOptimizedExpenses, potentialSavings
                                                 }) => {
    return (
        <div className="md:w-[55%] bg-indigo-700 text-white flex flex-col h-full overflow-y-auto">
            <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                    <DollarSign className="text-indigo-300" size={28} />
                    {isOptimizing ? 'Projected Savings' : 'Monthly Summary'}
                </h3>

                {isOptimizing ? (
                    // --- OPTIMIZATION MODE VIEW ---
                    <div className="animate-fade-in">
                        {/* Savings Hero Card */}
                        <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-6 text-center mb-8 shadow-lg backdrop-blur-sm">
                            <span className="text-emerald-200 text-sm font-bold uppercase tracking-wider">Potential Monthly Savings</span>
                            <div className="text-5xl font-bold text-white mt-2 mb-1">
                                {formatCurrency(potentialSavings)}
                            </div>
                            <p className="text-emerald-100/80 text-sm">
                                Annual savings: {formatCurrency(potentialSavings * 12)}
                            </p>
                        </div>

                        {/* Before / After Comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-center">
                            <div className="bg-indigo-800/50 p-4 rounded-xl border border-indigo-600/30 text-center">
                                <span className="text-indigo-300 text-xs uppercase">Current Expenses</span>
                                <div className="text-xl font-bold text-white mt-1">{formatCurrency(totalExpenses)}</div>
                            </div>

                            <div className="flex justify-center text-indigo-400">
                                <ArrowRight size={24} />
                            </div>

                            <div className="bg-indigo-600 p-4 rounded-xl border border-indigo-500 shadow-lg text-center">
                                <span className="text-indigo-100 text-xs uppercase">Optimized Expenses</span>
                                <div className="text-xl font-bold text-white mt-1">{formatCurrency(totalOptimizedExpenses)}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- STANDARD VIEW ---
                    <SummaryCards
                        totalIncome={totalIncome}
                        totalExpenses={totalExpenses}
                        remaining={remaining}
                    />
                )}

                <SpendingBreakdown
                    categories={expenseCategories}
                    totalExpenses={isOptimizing ? totalOptimizedExpenses : totalExpenses}
                />
            </div>
        </div>
    );
};