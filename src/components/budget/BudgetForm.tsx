// File: src/components/budget/BudgetForm.tsx
import React, { useState, useRef } from 'react';
import { Wallet, Lock } from 'lucide-react'; // Added Lock icon to indicate mode
import { Tabs } from '../common/Tabs';
import type { BudgetPlannerState } from '../../types/budget.types';
import { IncomeList } from './IncomeList';
import { ExpensesManager } from './ExpensesManager';
import { OptimizerList } from './OptimizerList';

interface Props {
    model: BudgetPlannerState;
    onViewChange: (view: 'income' | 'expenses' | 'optimize') => void;
}

export const BudgetForm: React.FC<Props> = ({ model, onViewChange }) => {
    const [viewMode, setViewMode] = useState<'income' | 'expenses' | 'optimize'>('income');
    const { state, dispatch, totalIncome, isAdminMode } = model;

    const VIEW_TABS = [
        { id: 'income', label: 'Income' },
        { id: 'expenses', label: 'Expenses' },
        { id: 'optimize', label: 'Optimize' },
    ];

    const handleTabClick = (id: string) => {
        const mode = id as 'income' | 'expenses' | 'optimize';
        setViewMode(mode);
        onViewChange(mode);
    };

    // --- SECRET GESTURE LOGIC ---
    const clickCountRef = useRef(0);
    const timeoutRef = useRef<number | null>(null);

    const handleSecretClick = () => {
        clickCountRef.current += 1;

        // Reset count if user stops clicking for 1 second
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            clickCountRef.current = 0;
        }, 1000);

        // Trigger on 5th click
        if (clickCountRef.current === 5) {
            dispatch({ type: 'TOGGLE_ADMIN_MODE' });
            clickCountRef.current = 0;
        }
    };

    return (
        <div className="md:w-[45%] flex flex-col bg-white border-r border-gray-200 h-full z-10">
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="flex items-center gap-2 cursor-default select-none"
                        onClick={handleSecretClick} // THE SECRET TRIGGER
                    >
                        <div className={`p-2 rounded-lg transition-colors ${isAdminMode ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <Wallet size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Budget Planner</h2>
                    </div>

                    {/* Optional: Small indicator so YOU know it's on */}
                    {isAdminMode && (
                        <div className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                            <Lock size={10} />
                            ADMIN
                        </div>
                    )}
                </div>

                <Tabs
                    tabs={VIEW_TABS}
                    activeTab={viewMode}
                    onTabClick={handleTabClick}
                    variant="segmented-indigo"
                />
            </div>

            {/* Pass isAdminMode to children */}
            {viewMode === 'expenses' && (
                <ExpensesManager
                    categories={state.expenseCategories}
                    dispatch={dispatch}
                    isAdminMode={isAdminMode}
                />
            )}

            {viewMode === 'income' && (
                <IncomeList items={state.incomes} totalIncome={totalIncome} dispatch={dispatch} />
            )}

            {viewMode === 'optimize' && (
                <OptimizerList
                    categories={state.expenseCategories}
                    dispatch={dispatch}
                    isAdminMode={isAdminMode}
                />
            )}
        </div>
    );
};