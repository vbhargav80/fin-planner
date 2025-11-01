// File: `src/types/amortization.types.ts`
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

export interface AmortizationInputs {
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

export interface AmortizationCalculatorState {
    amortizationData: AmortizationRow[];
    interestRate: number;
    setInterestRate: (value: number) => void;
    principal: number;
    setPrincipal: (value: number) => void;
    monthlyRepayment: number;
    setMonthlyRepayment: (value: number) => void;
    initialRentalIncome: number;
    setInitialRentalIncome: (value: number) => void;
    initialOffsetBalance: number;
    setInitialOffsetBalance: (value: number) => void;
    monthlyExpenditure: number;
    setMonthlyExpenditure: (value: number) => void;
    monthlyExpenditurePre2031: number;
    setMonthlyExpenditurePre2031: (value: number) => void;
    rentalGrowthRate: number;
    setRentalGrowthRate: (value: number) => void;
    isRefinanced: boolean;
    setIsRefinanced: (value: boolean) => void;
    considerOffsetIncome: boolean;
    setConsiderOffsetIncome: (value: boolean) => void;
    offsetIncomeRate: number;
    setOffsetIncomeRate: (value: number) => void;
    continueWorking: boolean;
    setContinueWorking: (value: boolean) => void;
    yearsWorking: number;
    setYearsWorking: (value: number) => void;
    netIncome: number;
    setNetIncome: (value: number) => void;
    actualMonthlyRepayment: number;
}
