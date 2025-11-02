// File: 'src/types/drawdown.types.ts'
export interface SaleInputs {
    salePrice: number;
    costBase: number;
    depreciationClaimed: number;
    sellingCosts: number;
    person1TaxRate: number; // %
    person2TaxRate: number; // %
    cgtDiscountRate: number; // % (disabled in UI, defaults to 50)
}

export interface DrawdownPlanInputs {
    annualInterestRate: number; // %
    monthlyDrawdown: number;
    startMonth: string; // 'YYYY-MM'
    netMonthlyRent: number; // NEW: base net monthly rent at sale
}

export interface DrawdownRow {
    index: number;
    dateLabel: string; // 'MMM yyyy'
    startBalance: number;
    interestEarned: number;
    drawdown: number;
    endBalance: number;
    rentLost: number; // NEW
}

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

export interface SaleDrawdownState extends SaleInputs, DrawdownPlanInputs, SaleDrawdownDerived {
    setSalePrice: (v: number) => void;
    setCostBase: (v: number) => void;
    setDepreciationClaimed: (v: number) => void;
    setSellingCosts: (v: number) => void;
    setPerson1TaxRate: (v: number) => void;
    setPerson2TaxRate: (v: number) => void;
    setCgtDiscountRate: (v: number) => void;
    setAnnualInterestRate: (v: number) => void;
    setMonthlyDrawdown: (v: number) => void;
    setStartMonth: (v: string) => void;
    setNetMonthlyRent: (v: number) => void; // NEW
}
