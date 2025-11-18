import { useMemo } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import { useConfig } from '../contexts/ConfigContext';
import type { SaleDrawdownState, State, Action } from '../types/drawdown.types';
import { computeSaleDrawdownDerived } from '../utils/calculations/drawdownCalculations';
import { STORAGE_KEYS } from "../constants/storageKeys.ts";

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
        case 'SET_CAPITAL_GROWTH_RATE': return { ...state, capitalGrowthRate: action.payload };
        case 'RESET': return action.payload as State; // NEW
        default: return state;
    }
}

export function useSaleDrawdownCalculator(): SaleDrawdownState {
    const { config } = useConfig();
    const [state, dispatch] = usePersistentReducer(reducer, config.drawdown, STORAGE_KEYS.DRAWDOWN);

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
                    capitalGrowthRate: state.capitalGrowthRate
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