import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Tabs } from '../common/Tabs';
import type { BudgetPlannerState } from '../../types/budget.types';
import { IncomeList } from './IncomeList';
import { ExpensesManager } from './ExpensesManager';
import { OptimizerList } from './OptimizerList'; // Import new component

interface Props {
    model: BudgetPlannerState;
    onViewChange: (view: 'income' | 'expenses' | 'optimize') => void; // Callback to tell parent
}

export const BudgetForm: React.FC<Props> = ({ model, onViewChange }) => {
    const [viewMode, setViewMode] = useState<'income' | 'expenses' | 'optimize'>('expenses');
    const { state, dispatch, totalIncome } = model;

    const VIEW_TABS = [
        { id: 'expenses', label: 'Expenses' },
        { id: 'income', label: 'Income' },
        { id: 'optimize', label: 'Optimize' }, // New Tab
    ];

    const handleTabClick = (id: string) => {
        const mode = id as 'income' | 'expenses' | 'optimize';
        setViewMode(mode);
        onViewChange(mode);
    };

    return (
        <div className="md:w-[45%] flex flex-col bg-white border-r border-gray-200 h-full z-10">
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Wallet size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Budget Planner</h2>
                </div>
                <Tabs
                    tabs={VIEW_TABS}
                    activeTab={viewMode}
                    onTabClick={handleTabClick}
                    variant="segmented-indigo"
                />
            </div>

            {viewMode === 'expenses' && (
                <ExpensesManager categories={state.expenseCategories} dispatch={dispatch} />
            )}

            {viewMode === 'income' && (
                <IncomeList items={state.incomes} totalIncome={totalIncome} dispatch={dispatch} />
            )}

            {viewMode === 'optimize' && (
                <OptimizerList categories={state.expenseCategories} dispatch={dispatch} />
            )}
        </div>
    );
};