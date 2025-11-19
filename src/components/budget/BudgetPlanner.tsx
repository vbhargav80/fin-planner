import React, { useState } from 'react';
import { useBudgetPlanner } from '../../hooks/useBudgetPlanner';
import { BudgetForm } from './BudgetForm';
import { BudgetDashboard } from './BudgetDashboard';
import type { CalculatorId } from '../../types/common.types';

// New: Accept onNavigate prop
interface Props {
    onNavigate: (id: CalculatorId) => void;
}

export const BudgetPlanner: React.FC<Props> = ({ onNavigate }) => {
    const model = useBudgetPlanner();
    const [currentView, setCurrentView] = useState<'income' | 'expenses' | 'optimize'>('expenses');

    return (
        <div className="bg-gray-100 shadow-xl overflow-hidden md:flex w-full h-full">
            <BudgetForm model={model} onViewChange={setCurrentView} />
            <BudgetDashboard
                totalIncome={model.totalIncome}
                totalExpenses={model.totalExpenses}
                remaining={model.remaining}
                expenseCategories={model.state.expenseCategories}
                isOptimizing={currentView === 'optimize'}
                totalOptimizedExpenses={model.totalOptimizedExpenses}
                potentialSavings={model.potentialSavings}
                onNavigate={onNavigate} // Pass it down
            />
        </div>
    );
}