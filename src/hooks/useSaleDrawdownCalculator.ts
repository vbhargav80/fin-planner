// File: src/hooks/useSaleDrawdownCalculator.ts
import { useMemo } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import type { SaleDrawdownState, State, Action } from '../types/drawdown.types';
import { computeSaleDrawdownDerived } from '../utils/calculations/drawdownCalculations';

const initialState: State = {
    // Sale Calculation
    salePrice: 1_000_000,
    outstandingLoan: 200_000,
    costBase: 600_000,
    depreciationClaimed: 50_000,
    sellingCosts: 25_000,
    person1TaxRate: 45,
    person2TaxRate: 37,
    cgtDiscountRate: 50,
    // Drawdown Plan
    annualInterestRate: 4,
    monthlyDrawdown: 8_000,
    startMonth: '2031-01',
    netMonthlyRent: 3_000,
    netRentGrowthRate: 3,
    capitalGrowthRate: 3, // NEW DEFAULT
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_SALE_PRICE': return { ...state, salePrice: action.payload };
        case 'SET_OUTSTANDING_LOAN': return { ...state, outstandingLoan: action.payload };
        case 'SET_COST_BASE': return { ...state, costBase: action.payload };
        case 'SET_DEPRECIATION_CLAIMED': return { ...state, depreciationClaimed: action.payload };
        case 'SET_SELLING_COSTS': return { ...state, sellingCosts: action.payload };
        case 'SET_PERSON_1_TAX_RATE': return { ...state, person1TaxRate: action.payload };
        case 'SET_PERSON_2_TAX_RATE': return { ...state, person2TaxRate: action.payload };
        case 'SET_CGT_DISCOUNT_RATE': return { ...state, cgtDiscountRate: action.payload };
        case 'SET_ANNUAL_INTEREST_RATE': return { ...state, annualInterestRate: action.payload };
        case 'SET_MONTHLY_DRAWDOWN': return { ...state, monthlyDrawdown: action.payload };
        case 'SET_START_MONTH': return { ...state, startMonth: action.payload };
        case 'SET_NET_MONTHLY_RENT': return { ...state, netMonthlyRent: action.payload };
        case 'SET_NET_RENT_GROWTH_RATE': return { ...state, netRentGrowthRate: action.payload };
        case 'SET_CAPITAL_GROWTH_RATE': return { ...state, capitalGrowthRate: action.payload }; // NEW
        default: return state;
    }
}

export function useSaleDrawdownCalculator(): SaleDrawdownState {
    // Bump version to v3 to reset state and pick up new fields
    const [state, dispatch] = usePersistentReducer(reducer, initialState, 'drawdown-v3');

    const derived = useMemo(
        () =>
            computeSaleDrawdownDerived(
                {
                    salePrice: state.salePrice,
                    outstandingLoan: state.outstandingLoan,
                    costBase: state.costBase,
                    depreciationClaimed: state.depreciationClaimed,
                    sellingCosts: state.sellingCosts,
                    person1TaxRate: state.person1TaxRate,
                    person2TaxRate: state.person2TaxRate,
                    cgtDiscountRate: state.cgtDiscountRate
                },
                {
                    annualInterestRate: state.annualInterestRate,
                    monthlyDrawdown: state.monthlyDrawdown,
                    startMonth: state.startMonth,
                    netMonthlyRent: state.netMonthlyRent,
                    netRentGrowthRate: state.netRentGrowthRate,
                    capitalGrowthRate: state.capitalGrowthRate // PASS NEW FIELD
                }
            ),
        [state]
    );

    return {
        state,
        dispatch,
        ...derived
    };
}