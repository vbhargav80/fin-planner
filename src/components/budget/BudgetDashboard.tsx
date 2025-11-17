import React from 'react';
import { DollarSign } from 'lucide-react';
import { SummaryCards } from './SummaryCards';
import { SpendingBreakdown } from './SpendingBreakdown';
import type { ExpenseCategory } from '../../types/budget.types';

interface Props {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
    expenseCategories: ExpenseCategory[];
}

export const BudgetDashboard: React.FC<Props> = ({ totalIncome, totalExpenses, remaining, expenseCategories }) => {
    return (
        // THEME: Indigo-700 (Matches Drawdown Simulator Results)
        <div className="md:w-[55%] bg-indigo-700 text-white flex flex-col h-full overflow-y-auto">
            <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                    <DollarSign className="text-indigo-300" size={28} />
                    Monthly Summary
                </h3>

                <SummaryCards
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                    remaining={remaining}
                />

                <SpendingBreakdown
                    categories={expenseCategories}
                    totalExpenses={totalExpenses}
                />
            </div>
        </div>
    );
};