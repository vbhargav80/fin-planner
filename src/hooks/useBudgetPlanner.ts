import { useReducer, useMemo } from 'react';
import type { State, Action, BudgetPlannerState } from '../types/budget.types';

const uuid = () => crypto.randomUUID();

const initialState: State = {
    incomes: [
        { id: uuid(), name: 'Salary', amount: 5000, iconKey: 'work' },
    ],
    expenseCategories: [
        {
            id: uuid(),
            name: 'Housing',
            iconKey: 'housing',
            items: [
                { id: uuid(), name: 'Rates', amount: 200, iconKey: 'rates' },
                { id: uuid(), name: 'Body Corporate', amount: 50, iconKey: 'housing' },
                { id: uuid(), name: 'Insurance', amount: 150, iconKey: 'rates' },
                { id: uuid(), name: 'Maintenance', amount: 300, iconKey: 'service' },
            ]
        },
        {
            id: uuid(),
            name: 'Utilities',
            iconKey: 'utilities',
            items: [
                { id: uuid(), name: 'Electricity', amount: 150, iconKey: 'electricity' },
                { id: uuid(), name: 'Gas', amount: 150, iconKey: 'gas' },
                { id: uuid(), name: 'Water', amount: 150, iconKey: 'water' },
                { id: uuid(), name: 'Internet', amount: 120, iconKey: 'internet' },
                { id: uuid(), name: 'Mobile', amount: 250, iconKey: 'mobile' },
            ]
        },
        {
            id: uuid(),
            name: 'Transport',
            iconKey: 'transport',
            items: [
                { id: uuid(), name: 'Nissan Fuel', amount: 250, iconKey: 'transport' },
                { id: uuid(), name: 'Kia Fuel', amount: 250, iconKey: 'transport' },
                { id: uuid(), name: 'Nissan Rego', amount: 100, iconKey: 'rates' },
                { id: uuid(), name: 'Kia Rego', amount: 100, iconKey: 'rates' },
                { id: uuid(), name: 'Nissan Insurance', amount: 100, iconKey: 'rates' },
                { id: uuid(), name: 'Kia Insurance', amount: 100, iconKey: 'rates' },
                { id: uuid(), name: 'Nissan Servicing', amount: 70, iconKey: 'service' },
                { id: uuid(), name: 'Kia Servicing', amount: 70, iconKey: 'service' },
                { id: uuid(), name: 'Train', amount: 120, iconKey: 'train' },
            ]
        },
        {
            id: uuid(),
            name: 'Groceries & Essential',
            iconKey: 'groceries',
            items: [
                { id: uuid(), name: 'Groceries', amount: 1000, iconKey: 'groceries' },
            ]
        },
        {
            id: uuid(),
            name: 'Health & Insurance',
            iconKey: 'health',
            items: [
                { id: uuid(), name: 'Private Health', amount: 350, iconKey: 'health' },
                { id: uuid(), name: 'Dental', amount: 150, iconKey: 'health' },
                { id: uuid(), name: 'Prescriptions', amount: 150, iconKey: 'health' },
            ]
        },
        {
            id: uuid(),
            name: 'Childcare & Education',
            iconKey: 'childcare',
            items: [
                { id: uuid(), name: 'Radhika Fees', amount: 500, iconKey: 'education' },
                { id: uuid(), name: 'Nabhi Swimming', amount: 120, iconKey: 'childcare' },
                { id: uuid(), name: 'Radhika Swimming', amount: 120, iconKey: 'childcare' },
                { id: uuid(), name: 'Tuition - Karen', amount: 350, iconKey: 'education' },
            ]
        },
        {
            id: uuid(),
            name: 'Debt & Savings',
            iconKey: 'debt',
            items: [
                { id: uuid(), name: 'Package Fee', amount: 50, iconKey: 'debt' },
            ]
        },
        {
            id: uuid(),
            name: 'Lifestyle & Recreation',
            iconKey: 'lifestyle',
            items: [
                { id: uuid(), name: 'Coffee', amount: 300, iconKey: 'lifestyle' },
                { id: uuid(), name: 'Dining Out', amount: 400, iconKey: 'dining' },
                { id: uuid(), name: 'Misc', amount: 300, iconKey: 'entertainment' },
            ]
        },
        {
            id: uuid(),
            name: 'Personal & Clothing',
            iconKey: 'personal',
            items: [
                { id: uuid(), name: 'Haircuts', amount: 100, iconKey: 'hair' },
                { id: uuid(), name: 'Clothing', amount: 400, iconKey: 'clothing' },
                { id: uuid(), name: 'Cosmetics', amount: 100, iconKey: 'personal' },
            ]
        },
        {
            id: uuid(),
            name: 'Misc',
            iconKey: 'misc',
            items: [
                { id: uuid(), name: 'Gifts', amount: 200, iconKey: 'gift' },
                { id: uuid(), name: 'Donations', amount: 100, iconKey: 'gift' },
                { id: uuid(), name: 'Unexpected Costs', amount: 200, iconKey: 'alert' },
            ]
        },
    ]
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        // --- INCOME (Flat List) ---
        case 'ADD_INCOME':
            return { ...state, incomes: [...state.incomes, action.payload] };
        case 'UPDATE_INCOME':
            return {
                ...state,
                incomes: state.incomes.map(i => i.id === action.payload.id ? action.payload : i)
            };
        case 'REMOVE_INCOME':
            return { ...state, incomes: state.incomes.filter(i => i.id !== action.payload) };

        // --- CATEGORIES ---
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

        // --- EXPENSE ITEMS (Nested) ---
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

        default:
            return state;
    }
}

export function useBudgetPlanner(): BudgetPlannerState {
    const [state, dispatch] = useReducer(reducer, initialState);

    const derived = useMemo(() => {
        const totalIncome = state.incomes.reduce((sum, item) => sum + item.amount, 0);

        const totalExpenses = state.expenseCategories.reduce((catSum, cat) => {
            const categoryTotal = cat.items.reduce((itemSum, item) => itemSum + item.amount, 0);
            return catSum + categoryTotal;
        }, 0);

        const remaining = totalIncome - totalExpenses;

        return { totalIncome, totalExpenses, remaining };
    }, [state]);

    return { state, dispatch, ...derived };
}