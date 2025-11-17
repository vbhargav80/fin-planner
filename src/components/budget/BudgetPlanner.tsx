import { useState } from 'react';
import { useBudgetPlanner } from '../../hooks/useBudgetPlanner';
import { BudgetForm } from './BudgetForm';
import { BudgetDashboard } from './BudgetDashboard';

export function BudgetPlanner() {
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
                // Pass optimization props
                isOptimizing={currentView === 'optimize'}
                totalOptimizedExpenses={model.totalOptimizedExpenses}
                potentialSavings={model.potentialSavings}
            />
        </div>
    );
}