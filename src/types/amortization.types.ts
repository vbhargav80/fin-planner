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
    isRetirementRow?: boolean;
}

export interface State {
    // Loan
    interestRate: number;
    principal: number;
    monthlyRepayment: number;
    initialOffsetBalance: number;
    isRefinanced: boolean;

    // Income
    initialRentalIncome: number;
    monthlySalary: number;        // Income Phase 1 (Career)
    transitionalSalary: number;   // Income Phase 2 (Extended Work)

    // Expenses
    currentLivingExpenses: number;    // Expenses Phase 1 & 2 (Working)
    retirementLivingExpenses: number; // Expenses Phase 3 (Retired)

    // Assumptions
    rentalGrowthRate: number;
    considerOffsetIncome: boolean;
    offsetIncomeRate: number;

    // Timeline
    retirementDate: string;       // YYYY-MM
    continueWorking: boolean;     // Toggle for Phase 2
    yearsWorking: number;         // Duration of Phase 2
}

export type Action =
    | { type: 'SET_INTEREST_RATE'; payload: number }
    | { type: 'SET_PRINCIPAL'; payload: number }
    | { type: 'SET_MONTHLY_REPAYMENT'; payload: number }
    | { type: 'SET_INITIAL_RENTAL_INCOME'; payload: number }
    | { type: 'SET_INITIAL_OFFSET_BALANCE'; payload: number }
    | { type: 'SET_MONTHLY_SALARY'; payload: number }
    | { type: 'SET_TRANSITIONAL_SALARY'; payload: number }
    | { type: 'SET_CURRENT_LIVING_EXPENSES'; payload: number }
    | { type: 'SET_RETIREMENT_LIVING_EXPENSES'; payload: number }
    | { type: 'SET_RENTAL_GROWTH_RATE'; payload: number }
    | { type: 'SET_IS_REFINANCED'; payload: boolean }
    | { type: 'SET_CONSIDER_OFFSET_INCOME'; payload: boolean }
    | { type: 'SET_OFFSET_INCOME_RATE'; payload: number }
    | { type: 'SET_RETIREMENT_DATE'; payload: string }
    | { type: 'SET_CONTINUE_WORKING'; payload: boolean }
    | { type: 'SET_YEARS_WORKING'; payload: number }
    | { type: 'RESET'; payload: State };

export interface AmortizationCalculatorState {
    state: State;
    dispatch: Dispatch<Action>;
    amortizationData: AmortizationRow[];
    actualMonthlyRepayment: number;
    calculateOptimalExpenditure: () => number;
    calculateOptimalOffsetBalance: () => number;
    calculateOptimalWorkingYears: () => { years: number; income: number };
    hasDepletedOffsetRows: boolean;
}