import React from 'react';
import { DollarSign, ArrowRight, PieChart } from 'lucide-react';
import { SummaryCards } from './SummaryCards';
import { SpendingBreakdown } from './SpendingBreakdown';
import { ExpenseDoughnut } from './ExpenseDoughnut';
import { BudgetInsights } from './BudgetInsights';
import type { ExpenseCategory } from '../../types/budget.types';
import { formatCurrency } from '../../utils/formatters';
import type { CalculatorId } from '../../types/common.types';

interface Props {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
    expenseCategories: ExpenseCategory[];
    isOptimizing: boolean;
    totalOptimizedExpenses: number;
    potentialSavings: number;
    onNavigate: (id: CalculatorId) => void; // NEW PROP
}

export const BudgetDashboard: React.FC<Props> = ({
                                                     totalIncome, totalExpenses, remaining, expenseCategories,
                                                     isOptimizing, totalOptimizedExpenses, potentialSavings, onNavigate
                                                 }) => {
    return (
        <div className="md:w-[55%] bg-indigo-700 text-white flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                    <DollarSign className="text-indigo-300" size={28} />
                    {isOptimizing ? 'Projected Savings' : 'Monthly Summary'}
                </h3>

                {isOptimizing ? (
                    <div className="animate-fade-in">
                        <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-6 text-center mb-8 shadow-lg backdrop-blur-sm">
                            <span className="text-emerald-200 text-sm font-bold uppercase tracking-wider">Potential Monthly Savings</span>
                            <div className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-1">
                                {formatCurrency(potentialSavings)}
                            </div>
                            <p className="text-emerald-100/80 text-sm">
                                Annual savings: {formatCurrency(potentialSavings * 12)}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 items-center">
                            <div className="bg-indigo-800/50 p-4 rounded-xl border border-indigo-600/30 text-center">
                                <span className="text-indigo-300 text-xs uppercase">Current</span>
                                <div className="text-lg font-bold text-white mt-1 font-mono">{formatCurrency(totalExpenses)}</div>
                            </div>
                            <div className="flex justify-center text-indigo-400 py-2 lg:py-0">
                                <ArrowRight size={24} className="rotate-90 lg:rotate-0" />
                            </div>
                            <div className="bg-indigo-600 p-4 rounded-xl border border-indigo-500 shadow-lg text-center">
                                <span className="text-indigo-100 text-xs uppercase">Optimized</span>
                                <div className="text-lg font-bold text-white mt-1 font-mono">{formatCurrency(totalOptimizedExpenses)}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <SummaryCards
                            totalIncome={totalIncome}
                            totalExpenses={totalExpenses}
                            remaining={remaining}
                            onNavigate={onNavigate}
                        />

                        <BudgetInsights
                            totalIncome={totalIncome}
                            // Removed totalExpenses
                            surplus={remaining}
                            categories={expenseCategories}
                        />

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="bg-indigo-800 rounded-2xl p-6 shadow-inner border border-indigo-700 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 text-indigo-200">
                                    <PieChart size={18} />
                                    <h4 className="text-sm font-bold uppercase tracking-wider">Composition</h4>
                                </div>
                                <div className="flex-1 min-h-[250px] flex items-center justify-center">
                                    <ExpenseDoughnut categories={expenseCategories} />
                                </div>
                            </div>

                            <SpendingBreakdown
                                categories={expenseCategories}
                                totalExpenses={totalExpenses}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};