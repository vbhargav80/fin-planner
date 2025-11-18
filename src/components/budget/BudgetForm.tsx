// File: src/components/budget/BudgetForm.tsx
import React, { useState, useRef } from 'react';
import { Wallet, Lock, RotateCcw } from 'lucide-react';
import { Tabs } from '../common/Tabs';
import type { BudgetPlannerState } from '../../types/budget.types';
import { IncomeList } from './IncomeList';
import { ExpensesManager } from './ExpensesManager';
import { OptimizerList } from './OptimizerList';
import { useConfig } from "../../contexts/ConfigContext.tsx";

interface Props {
    model: BudgetPlannerState;
    onViewChange: (view: 'income' | 'expenses' | 'optimize') => void;
}

export const BudgetForm: React.FC<Props> = ({ model, onViewChange }) => {
    const [viewMode, setViewMode] = useState<'income' | 'expenses' | 'optimize'>('income');
    const { state, dispatch, totalIncome, isAdminMode } = model;
    const { config } = useConfig();

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

    const handleSecretClick = (e: React.MouseEvent) => {
        e.preventDefault();
        clickCountRef.current += 1;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            clickCountRef.current = 0;
        }, 1000);

        if (clickCountRef.current === 5) {
            dispatch({ type: 'TOGGLE_ADMIN_MODE' });
            clickCountRef.current = 0;
        }
    };

    // --- RESET LOGIC ---
    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all budget data? This cannot be undone.')) {
            dispatch({ type: 'RESET_BUDGET', payload: config.budget });
        }
    };

    return (
        <div className="md:w-[45%] flex flex-col bg-white border-r border-gray-200 h-full z-10">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`
                                p-2 rounded-lg transition-all duration-200 ease-in-out
                                cursor-pointer hover:scale-110 active:scale-95 hover:bg-indigo-50
                                ${isAdminMode ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}
                            `}
                            onClick={handleSecretClick}
                            title={isAdminMode ? "Admin Mode Active" : undefined}
                        >
                            <Wallet size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Budget Planner
                        </h2>
                    </div>

                    {isAdminMode && (
                        <div className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full border border-red-100 animate-in fade-in zoom-in duration-300">
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-hidden">
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                    onClick={handleReset}
                    className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 px-3 py-2 rounded hover:bg-red-50 transition-colors"
                    title="Reset all values to default"
                >
                    <RotateCcw size={14} />
                    Reset Data
                </button>
            </div>
        </div>
    );
};