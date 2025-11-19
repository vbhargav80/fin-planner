// File: src/hooks/useBudgetPlanner.ts
import { useMemo } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import { useConfig } from '../contexts/ConfigContext'; // 1. Import Context
import type { State, Action, BudgetPlannerState } from '../types/budget.types';
import { STORAGE_KEYS } from "../constants/storageKeys";

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_INCOME': return { ...state, incomes: [...state.incomes, action.payload] };
        case 'UPDATE_INCOME': return { ...state, incomes: state.incomes.map(i => i.id === action.payload.id ? action.payload : i) };
        case 'REMOVE_INCOME': return { ...state, incomes: state.incomes.filter(i => i.id !== action.payload) };
        case 'ADD_CATEGORY': return { ...state, expenseCategories: [...state.expenseCategories, action.payload] };
        case 'UPDATE_CATEGORY_NAME': return { ...state, expenseCategories: state.expenseCategories.map(cat => cat.id === action.payload.id ? { ...cat, name: action.payload.name } : cat) };
        case 'REMOVE_CATEGORY': return { ...state, expenseCategories: state.expenseCategories.filter(c => c.id !== action.payload) };
        case 'ADD_EXPENSE_ITEM': return { ...state, expenseCategories: state.expenseCategories.map(cat => cat.id !== action.payload.categoryId ? cat : { ...cat, items: [...cat.items, action.payload.item] }) };
        case 'UPDATE_EXPENSE_ITEM': return { ...state, expenseCategories: state.expenseCategories.map(cat => cat.id !== action.payload.categoryId ? cat : { ...cat, items: cat.items.map(item => item.id === action.payload.item.id ? action.payload.item : item) }) };
        case 'REMOVE_EXPENSE_ITEM': return { ...state, expenseCategories: state.expenseCategories.map(cat => cat.id !== action.payload.categoryId ? cat : { ...cat, items: cat.items.filter(item => item.id !== action.payload.itemId) }) };
        case 'UPDATE_EXPENSE_REDUCTION': return { ...state, expenseCategories: state.expenseCategories.map(cat => cat.id !== action.payload.categoryId ? cat : { ...cat, items: cat.items.map(item => item.id === action.payload.itemId ? { ...item, reduction: action.payload.reduction } : item) }) };
        case 'TOGGLE_EXPENSE_FIXED': return { ...state, expenseCategories: state.expenseCategories.map(cat => cat.id !== action.payload.categoryId ? cat : { ...cat, items: cat.items.map(item => item.id === action.payload.itemId ? { ...item, isFixed: !item.isFixed, reduction: 0 } : item) }) };
        case 'TOGGLE_ADMIN_MODE': return { ...state, isAdminMode: !state.isAdminMode };

        // 3. FIXED: Use the payload (from config) instead of hardcoded state
        case 'RESET_BUDGET': return action.payload as State;

        default: return state;
    }
}

export function useBudgetPlanner(): BudgetPlannerState {
    const { config } = useConfig(); // 2. Get config from context

    // Pass config.budget as the initial state
    const [state, dispatch] = usePersistentReducer(reducer, config.budget, STORAGE_KEYS.BUDGET);

    const derived = useMemo(() => {
        const totalIncome = state.incomes.reduce((sum, item) => {
            if (item.isHidden && !state.isAdminMode) return sum;
            return sum + item.amount;
        }, 0);

        let totalExpenses = 0;
        let totalOptimizedExpenses = 0;

        state.expenseCategories.forEach(cat => {
            cat.items.forEach(item => {
                if (item.isHidden && !state.isAdminMode) return;

                totalExpenses += item.amount;
                const savings = item.amount * (item.reduction / 100);
                totalOptimizedExpenses += (item.amount - savings);
            });
        });

        const remaining = totalIncome - totalExpenses;
        const projectedRemaining = totalIncome - totalOptimizedExpenses;
        const potentialSavings = totalExpenses - totalOptimizedExpenses;

        return {
            totalIncome, totalExpenses, remaining,
            totalOptimizedExpenses, potentialSavings, projectedRemaining
        };
    }, [state]);

    return { state, dispatch, isAdminMode: state.isAdminMode, ...derived };
}