// File: src/hooks/useBudgetPlanner.ts
import { useReducer, useMemo } from 'react';
import type { State, Action, BudgetPlannerState, ExpenseItem } from '../types/budget.types';

const uuid = () => crypto.randomUUID();

// Helper to easily create items with the new structure
const mkItem = (
    name: string,
    amount: number,
    iconKey?: string,
    isFixed: boolean = false,
    subGroup?: string
): ExpenseItem => ({
    id: uuid(),
    name,
    amount,
    iconKey,
    reduction: 0, // Default: Keep 100% of the cost
    isFixed,
    subGroup
});

const initialState: State = {
    incomes: [
        { id: uuid(), name: 'Salary', amount: 5000, iconKey: 'work' },
        // Added new income source
        { id: uuid(), name: 'Investment Property Rent', amount: 2050, iconKey: 'housing' },
    ],
    expenseCategories: [
        {
            id: uuid(),
            name: 'Housing',
            iconKey: 'housing',
            items: [
                mkItem('Rates', 200, 'rates', true),
                mkItem('Body Corporate', 50, 'housing', true),
                mkItem('Insurance', 150, 'rates'),
                mkItem('Maintenance', 300, 'service'),
            ]
        },
        {
            id: uuid(),
            name: 'Utilities',
            iconKey: 'utilities',
            items: [
                mkItem('Electricity', 150, 'electricity'),
                mkItem('Gas', 150, 'gas'),
                mkItem('Water', 150, 'water', true),
                mkItem('Internet', 120, 'internet'),
                mkItem('Mobile', 250, 'mobile'),
            ]
        },
        {
            id: uuid(),
            name: 'Transport',
            iconKey: 'transport',
            items: [
                // NISSAN GROUP
                mkItem('Fuel', 250, 'transport', false, 'Nissan'),
                mkItem('Rego', 100, 'rates', true, 'Nissan'),
                mkItem('Insurance', 100, 'rates', false, 'Nissan'),
                mkItem('Servicing', 70, 'service', false, 'Nissan'),
                mkItem('Roadside Assist', 10, 'alert', false, 'Nissan'),

                // KIA GROUP
                mkItem('Fuel', 250, 'transport', false, 'Kia'),
                mkItem('Rego', 100, 'rates', true, 'Kia'),
                mkItem('Insurance', 100, 'rates', false, 'Kia'),
                mkItem('Servicing', 70, 'service', false, 'Kia'),
                mkItem('Roadside Assist', 10, 'alert', false, 'Kia'),

                // GENERAL
                mkItem('Train', 120, 'train'),
            ]
        },
        {
            id: uuid(),
            name: 'Groceries & Essential',
            iconKey: 'groceries',
            items: [
                mkItem('Groceries', 1000, 'groceries'),
            ]
        },
        {
            id: uuid(),
            name: 'Health & Insurance',
            iconKey: 'health',
            items: [
                mkItem('Private Health', 350, 'health', true),
                mkItem('Dental', 150, 'health'),
                mkItem('Prescriptions', 150, 'health'),
            ]
        },
        {
            id: uuid(),
            name: 'Childcare & Education',
            iconKey: 'childcare',
            items: [
                mkItem('Radhika Fees', 500, 'education', true),
                mkItem('Nabhi Swimming', 120, 'childcare'),
                mkItem('Radhika Swimming', 120, 'childcare'),
                mkItem('Tuition - Karen', 350, 'education'),
                mkItem('Tuition - Bright Minds', 150, 'education'),
            ]
        },
        {
            id: uuid(),
            name: 'Debt & Savings',
            iconKey: 'debt',
            items: [
                mkItem('Package Fee', 50, 'debt', true),
            ]
        },
        {
            id: uuid(),
            name: 'Lifestyle & Recreation',
            iconKey: 'lifestyle',
            items: [
                mkItem('Coffee', 300, 'lifestyle'),
                mkItem('Dining Out', 400, 'dining'),
                mkItem('Misc', 300, 'entertainment'),
            ]
        },
        {
            id: uuid(),
            name: 'Personal & Clothing',
            iconKey: 'personal',
            items: [
                mkItem('Haircuts', 100, 'hair'),
                mkItem('Clothing', 400, 'clothing'),
                mkItem('Cosmetics', 100, 'personal'),
            ]
        },
        {
            id: uuid(),
            name: 'Misc',
            iconKey: 'misc',
            items: [
                mkItem('Gifts', 200, 'gift'),
                mkItem('Donations', 100, 'gift'),
                mkItem('Unexpected Costs', 200, 'alert'),
                mkItem('Software Subscriptions', 150, 'internet'),
            ]
        },
    ]
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_INCOME':
            return { ...state, incomes: [...state.incomes, action.payload] };
        case 'UPDATE_INCOME':
            return { ...state, incomes: state.incomes.map(i => i.id === action.payload.id ? action.payload : i) };
        case 'REMOVE_INCOME':
            return { ...state, incomes: state.incomes.filter(i => i.id !== action.payload) };
        case 'ADD_CATEGORY':
            return { ...state, expenseCategories: [...state.expenseCategories, action.payload] };
        case 'UPDATE_CATEGORY_NAME':
            return {
                ...state,
                expenseCategories: state.expenseCategories.map(cat =>
                    cat.id === action.payload.id ? { ...cat, name: action.payload.name } : cat
                )
            };
        case 'REMOVE_CATEGORY':
            return { ...state, expenseCategories: state.expenseCategories.filter(c => c.id !== action.payload) };
        case 'ADD_EXPENSE_ITEM':
            return {
                ...state,
                expenseCategories: state.expenseCategories.map(cat => {
                    if (cat.id !== action.payload.categoryId) return cat;
                    return { ...cat, items: [...cat.items, action.payload.item] };
                })
            };
        case 'UPDATE_EXPENSE_ITEM':
            return {
                ...state,
                expenseCategories: state.expenseCategories.map(cat => {
                    if (cat.id !== action.payload.categoryId) return cat;
                    return {
                        ...cat,
                        items: cat.items.map(item =>
                            item.id === action.payload.item.id ? action.payload.item : item
                        )
                    };
                })
            };
        case 'REMOVE_EXPENSE_ITEM':
            return {
                ...state,
                expenseCategories: state.expenseCategories.map(cat => {
                    if (cat.id !== action.payload.categoryId) return cat;
                    return {
                        ...cat,
                        items: cat.items.filter(item => item.id !== action.payload.itemId)
                    };
                })
            };
        case 'UPDATE_EXPENSE_REDUCTION':
            return {
                ...state,
                expenseCategories: state.expenseCategories.map(cat => {
                    if (cat.id !== action.payload.categoryId) return cat;
                    return {
                        ...cat,
                        items: cat.items.map(item =>
                            item.id === action.payload.itemId
                                ? { ...item, reduction: action.payload.reduction }
                                : item
                        )
                    };
                })
            };
        case 'TOGGLE_EXPENSE_FIXED':
            return {
                ...state,
                expenseCategories: state.expenseCategories.map(cat => {
                    if (cat.id !== action.payload.categoryId) return cat;
                    return {
                        ...cat,
                        items: cat.items.map(item =>
                            item.id === action.payload.itemId
                                ? {
                                    ...item,
                                    isFixed: !item.isFixed,
                                    reduction: 0 // Reset reduction to 0 if locking
                                }
                                : item
                        )
                    };
                })
            };
        default:
            return state;
    }
}

export function useBudgetPlanner(): BudgetPlannerState {
    const [state, dispatch] = useReducer(reducer, initialState);

    const derived = useMemo(() => {
        const totalIncome = state.incomes.reduce((sum, item) => sum + item.amount, 0);

        let totalExpenses = 0;
        let totalOptimizedExpenses = 0;

        state.expenseCategories.forEach(cat => {
            cat.items.forEach(item => {
                totalExpenses += item.amount;
                const savings = item.amount * (item.reduction / 100);
                totalOptimizedExpenses += (item.amount - savings);
            });
        });

        const remaining = totalIncome - totalExpenses;
        const projectedRemaining = totalIncome - totalOptimizedExpenses;
        const potentialSavings = totalExpenses - totalOptimizedExpenses;

        return {
            totalIncome,
            totalExpenses,
            remaining,
            totalOptimizedExpenses,
            potentialSavings,
            projectedRemaining
        };
    }, [state]);

    return { state, dispatch, ...derived };
}