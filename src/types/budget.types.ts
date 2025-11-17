import type { Dispatch } from 'react';

export interface BudgetId {
    id: string;
    iconKey?: string;
}

export interface ExpenseItem extends BudgetId {
    name: string;
    amount: number;
    reduction: number;
    isFixed?: boolean; // New property
}

export interface ExpenseCategory extends BudgetId {
    name: string;
    items: ExpenseItem[];
}

export interface IncomeItem extends BudgetId {
    name: string;
    amount: number;
}

export interface State {
    incomes: IncomeItem[];
    expenseCategories: ExpenseCategory[];
}

export type Action =
    | { type: 'ADD_INCOME'; payload: IncomeItem }
    | { type: 'UPDATE_INCOME'; payload: IncomeItem }
    | { type: 'REMOVE_INCOME'; payload: string }
    | { type: 'ADD_CATEGORY'; payload: ExpenseCategory }
    | { type: 'UPDATE_CATEGORY_NAME'; payload: { id: string; name: string } }
    | { type: 'REMOVE_CATEGORY'; payload: string }
    | { type: 'ADD_EXPENSE_ITEM'; payload: { categoryId: string; item: ExpenseItem } }
    | { type: 'UPDATE_EXPENSE_ITEM'; payload: { categoryId: string; item: ExpenseItem } }
    | { type: 'REMOVE_EXPENSE_ITEM'; payload: { categoryId: string; itemId: string } }
    | { type: 'UPDATE_EXPENSE_REDUCTION'; payload: { categoryId: string; itemId: string; reduction: number } };

export interface BudgetDerived {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
    totalOptimizedExpenses: number;
    potentialSavings: number;
    projectedRemaining: number;
}

export interface BudgetPlannerState extends BudgetDerived {
    state: State;
    dispatch: Dispatch<Action>;
}