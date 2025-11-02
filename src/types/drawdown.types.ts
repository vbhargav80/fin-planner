export interface SaleCalculationInputs {
    salePrice: number;
    costBase: number;
    depreciationClaimed: number;
    sellingCosts: number;
    person1TaxRate: number;
    person2TaxRate: number;
    cgtDiscountRate: number;
}

export type SaleInputs = SaleCalculationInputs; // alias for consumers expecting `SaleInputs`

export interface DrawdownPlanInputs {
    annualInterestRate: number;
    monthlyDrawdown: number;
    startMonth: string; // YYYY-MM
    netMonthlyRent: number;
    netRentGrowthRate: number;
}

// Row shape rendered by DrawdownResults
export interface DrawdownRow {
    dateLabel: string;
    startBalance: number;
    interestEarned: number;
    drawdown: number;
    endBalance: number;
    rentLost: number;
}

export interface SaleDrawdownDerived {
    taxableGain: number;
    person1Tax: number;
    person2Tax: number;
    totalTax: number;
    netProceeds: number;
    schedule: DrawdownRow[];
    monthsToDeplete: number | null;       // allow null when it does not deplete
    depletionDateLabel: string | null;    // allow null when it does not deplete
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
    netRentGrowthRate: number;

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
    setNetRentGrowthRate: (value: number) => void;

    // derived outputs
    taxableGain: number;
    person1Tax: number;
    person2Tax: number;
    totalTax: number;
    netProceeds: number;
    schedule: DrawdownRow[];
    monthsToDeplete: number | null;       // match calculation nullability
    depletionDateLabel: string | null;    // match calculation nullability
    durationLabel: string;
}