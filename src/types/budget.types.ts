import type { Dispatch } from 'react';

export interface BudgetId {
    id: string;
}

// A single line item (e.g., "Netflix", "Rent")
export interface ExpenseItem extends BudgetId {
    name: string;
    amount: number;
}

// A group of items (e.g., "Entertainment", "Housing")
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
// Income Actions (Simple list)
    | { type: 'ADD_INCOME'; payload: IncomeItem }
    | { type: 'UPDATE_INCOME'; payload: IncomeItem }
    | { type: 'REMOVE_INCOME'; payload: string }

    // Category Actions
    | { type: 'ADD_CATEGORY'; payload: ExpenseCategory }
    | { type: 'UPDATE_CATEGORY_NAME'; payload: { id: string; name: string } }
    | { type: 'REMOVE_CATEGORY'; payload: string }

    // Item Actions (Need categoryId to know where to put them)
    | { type: 'ADD_EXPENSE_ITEM'; payload: { categoryId: string; item: ExpenseItem } }
    | { type: 'UPDATE_EXPENSE_ITEM'; payload: { categoryId: string; item: ExpenseItem } }
    | { type: 'REMOVE_EXPENSE_ITEM'; payload: { categoryId: string; itemId: string } };

export interface BudgetDerived {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
}

export interface BudgetPlannerState extends BudgetDerived {
    state: State;
    dispatch: Dispatch<Action>;
}