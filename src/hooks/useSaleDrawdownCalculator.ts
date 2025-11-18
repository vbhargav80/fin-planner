import { useMemo } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import type { SaleDrawdownState, State, Action } from '../types/drawdown.types';
import { computeSaleDrawdownDerived } from '../utils/calculations/drawdownCalculations';

const initialState: State = {
    // Sale Calculation
    salePrice: 1_000_000,
    outstandingLoan: 200_000,
    costBase: 350_000,
    depreciationClaimed: 50_000,
    sellingCosts: 50_000,
    person1TaxRate: 45,
    person2TaxRate: 37,
    cgtDiscountRate: 50,
    // Drawdown Plan
    annualInterestRate: 2,
    monthlyDrawdown: 10_000,
    startMonth: '2031-01',
    netMonthlyRent: 1000,
    netRentGrowthRate: 2,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_SALE_PRICE': return { ...state, salePrice: action.payload };
        case 'SET_OUTSTANDING_LOAN': return { ...state, outstandingLoan: action.payload }; // NEW
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
        default: return state;
    }
}

export function useSaleDrawdownCalculator(): SaleDrawdownState {
    // Use 'drawdown-v2' to reset state and pick up the new default
    const [state, dispatch] = usePersistentReducer(reducer, initialState, 'drawdown-v2');

    const derived = useMemo(
        () =>
            computeSaleDrawdownDerived(
                {
                    salePrice: state.salePrice,
                    outstandingLoan: state.outstandingLoan, // PASS NEW FIELD
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
                    netRentGrowthRate: state.netRentGrowthRate
                }
            ),
        [state]
    );

    return {
        state,
        dispatch,
        taxableGain: derived.taxableGain,
        person1Tax: derived.person1Tax,
        person2Tax: derived.person2Tax,
        totalTax: derived.totalTax,
        netProceeds: derived.netProceeds,
        schedule: derived.schedule,
        monthsToDeplete: derived.monthsToDeplete,
        depletionDateLabel: derived.depletionDateLabel,
        durationLabel: derived.durationLabel,
    };
}