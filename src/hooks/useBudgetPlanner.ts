import { useMemo } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import { useConfig } from '../contexts/ConfigContext';
import { STORAGE_KEYS } from '../constants/storageKeys';
import type { State, Action, BudgetPlannerState } from '../types/budget.types';

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

        // NEW: Toggle isHidden state
        case 'TOGGLE_EXPENSE_HIDDEN': return {
            ...state,
            expenseCategories: state.expenseCategories.map(cat => {
                if (cat.id !== action.payload.categoryId) return cat;
                return {
                    ...cat,
                    items: cat.items.map(item =>
                        item.id === action.payload.itemId
                            ? { ...item, isHidden: !item.isHidden }
                            : item
                    )
                };
            })
        };

        case 'TOGGLE_ADMIN_MODE': return { ...state, isAdminMode: !state.isAdminMode };
        case 'RESET_BUDGET': return action.payload;
        default: return state;
    }
}

export function useBudgetPlanner(): BudgetPlannerState {
    const { config } = useConfig();
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
                // IMPORTANT: If item is hidden, it is NOT counted.
                // To count it, the user must toggle it to Visible (isHidden: false) using the new action.
                if (item.isHidden) return;

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

    const reset = () => dispatch({ type: 'RESET_BUDGET', payload: config.budget });

    return { state, dispatch, isAdminMode: state.isAdminMode, reset, ...derived };
}