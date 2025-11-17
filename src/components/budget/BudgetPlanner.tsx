import { useBudgetPlanner } from '../../hooks/useBudgetPlanner';
import { BudgetForm } from './BudgetForm';
import { BudgetDashboard } from './BudgetDashboard';

export function BudgetPlanner() {
    const model = useBudgetPlanner();

    return (
        <div className="bg-gray-100 shadow-xl overflow-hidden md:flex w-full h-full">
            <BudgetForm model={model} />
            <BudgetDashboard
                totalIncome={model.totalIncome}
                totalExpenses={model.totalExpenses}
                remaining={model.remaining}
                expenseCategories={model.state.expenseCategories}
            />
        </div>
    );
}