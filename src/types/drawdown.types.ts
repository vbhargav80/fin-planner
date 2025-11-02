// File: 'src/types/drawdown.types.ts'
export interface SaleCalculationInputs {
    salePrice: number;
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
    netRentGrowthRate: number; // added
}

// Permissive schedule item shape without using `any`
export type DrawdownScheduleItem = Record<string, number | string | boolean | null>;

export interface SaleDrawdownDerived {
    taxableGain: number;
    person1Tax: number;
    person2Tax: number;
    totalTax: number;
    netProceeds: number;
    schedule: DrawdownScheduleItem[];
    monthsToDeplete: number;
    depletionDateLabel: string;
    durationLabel: string;
}

export interface SaleDrawdownState {
    // sale inputs
    salePrice: number;
    costBase: number;
    depreciationClaimed: number;
    sellingCosts: number;
    person1TaxRate: number;
    person2TaxRate: number;
    cgtDiscountRate: number;

    // drawdown plan inputs
    annualInterestRate: number;
    monthlyDrawdown: number;
    startMonth: string;
    netMonthlyRent: number;
    netRentGrowthRate: number; // added

    // setters
    setSalePrice: (value: number) => void;
    setCostBase: (value: number) => void;
    setDepreciationClaimed: (value: number) => void;
    setSellingCosts: (value: number) => void;
    setPerson1TaxRate: (value: number) => void;
    setPerson2TaxRate: (value: number) => void;
    setCgtDiscountRate: (value: number) => void;

    setAnnualInterestRate: (value: number) => void;
    setMonthlyDrawdown: (value: number) => void;
    setStartMonth: (value: string) => void;
    setNetMonthlyRent: (value: number) => void;
    setNetRentGrowthRate: (value: number) => void; // added

    // derived outputs
    taxableGain: number;
    person1Tax: number;
    person2Tax: number;
    totalTax: number;
    netProceeds: number;
    schedule: DrawdownScheduleItem[];
    monthsToDeplete: number;
    depletionDateLabel: string;
    durationLabel: string;
}
