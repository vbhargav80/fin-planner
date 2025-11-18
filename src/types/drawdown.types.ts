import type { Dispatch } from 'react';

export interface DrawdownRow {
    dateLabel: string;
    startBalance: number;
    interestEarned: number;
    drawdown: number;
    endBalance: number;
    rentLost: number;
}

export interface SaleInputs {
    salePrice: number;
    outstandingLoan: number;
    costBase: number;
    depreciationClaimed: number;
    sellingCosts: number;
    person1TaxRate: number;
    person2TaxRate: number;
    cgtDiscountRate: number;
}

export interface DrawdownPlanInputs {
    annualInterestRate: number;
    monthlyDrawdown: number;
    startMonth: string;
    netMonthlyRent: number;
    netRentGrowthRate: number;
}

export type State = SaleInputs & DrawdownPlanInputs;

export type Action =
    | { type: 'SET_SALE_PRICE'; payload: number }
    | { type: 'SET_OUTSTANDING_LOAN'; payload: number }
    | { type: 'SET_COST_BASE'; payload: number }
    | { type: 'SET_DEPRECIATION_CLAIMED'; payload: number }
    | { type: 'SET_SELLING_COSTS'; payload: number }
    | { type: 'SET_PERSON_1_TAX_RATE'; payload: number }
    | { type: 'SET_PERSON_2_TAX_RATE'; payload: number }
    | { type: 'SET_CGT_DISCOUNT_RATE'; payload: number }
    | { type: 'SET_ANNUAL_INTEREST_RATE'; payload: number }
    | { type: 'SET_MONTHLY_DRAWDOWN'; payload: number }
    | { type: 'SET_START_MONTH'; payload: string }
    | { type: 'SET_NET_MONTHLY_RENT'; payload: number }
    | { type: 'SET_NET_RENT_GROWTH_RATE'; payload: number };

export interface SaleDrawdownDerived {
    taxableGain: number;
    person1Tax: number;
    person2Tax: number;
    totalTax: number;
    netProceeds: number;
    schedule: DrawdownRow[];
    monthsToDeplete: number | null;
    depletionDateLabel: string | null;
    durationLabel: string;
}

export interface SaleDrawdownState extends SaleDrawdownDerived {
    state: State;
    dispatch: Dispatch<Action>;
}