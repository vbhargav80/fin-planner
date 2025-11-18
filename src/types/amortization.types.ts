import type { Dispatch } from 'react';

export interface AmortizationRow {
    date: string;
    beginningBalance: number;
    repayment: number;
    rentalIncome: number;
    offsetIncome: number;
    totalIncoming: number;
    totalOutgoing: number;
    totalShortfall: number;
    endingBalance: number;
    offsetBalance: number;
}

export interface State {
    interestRate: number;
    principal: number;
    monthlyRepayment: number;
    initialRentalIncome: number;
    initialOffsetBalance: number;
    monthlyExpenditure: number;
    monthlyExpenditurePre2031: number;
    rentalGrowthRate: number;
    isRefinanced: boolean;
    considerOffsetIncome: boolean;
    offsetIncomeRate: number;
    continueWorking: boolean;
    yearsWorking: number;
    netIncome: number;
}

export type Action =
    | { type: 'SET_INTEREST_RATE'; payload: number }
    | { type: 'SET_PRINCIPAL'; payload: number }
    | { type: 'SET_MONTHLY_REPAYMENT'; payload: number }
    | { type: 'SET_INITIAL_RENTAL_INCOME'; payload: number }
    | { type: 'SET_INITIAL_OFFSET_BALANCE'; payload: number }
    | { type: 'SET_MONTHLY_EXPENDITURE'; payload: number }
    | { type: 'SET_MONTHLY_EXPENDITURE_PRE_2031'; payload: number }
    | { type: 'SET_RENTAL_GROWTH_RATE'; payload: number }
    | { type: 'SET_IS_REFINANCED'; payload: boolean }
    | { type: 'SET_CONSIDER_OFFSET_INCOME'; payload: boolean }
    | { type: 'SET_OFFSET_INCOME_RATE'; payload: number }
    | { type: 'SET_CONTINUE_WORKING'; payload: boolean }
    | { type: 'SET_YEARS_WORKING'; payload: number }
    | { type: 'SET_NET_INCOME'; payload: number }
    | { type: 'RESET'; payload: State };

export interface AmortizationCalculatorState {
    state: State;
    dispatch: Dispatch<Action>;
    amortizationData: AmortizationRow[];
    actualMonthlyRepayment: number;
    calculateOptimalExpenditure: () => number;
    calculateOptimalWorkingYears: () => { years: number; income: number };
    hasDepletedOffsetRows: boolean;
}