
export type CalcMode = 'contribution' | 'balance';

export interface SuperInputs {
    myAge: number;
    wifeAge: number;
    mySuper: number;
    wifeSuper: number;
    targetAge: number;
    targetBalance?: number;
    monthlyContribution?: number;
    monthlyContributionPost50?: number;
    netReturn: number;
}

export interface SuperResultData {
    pmt: number;
    pmtPost50?: number;
    target?: number;
    projectedBalance?: number;
    calcMode: CalcMode;
    years: number;
    start: number;
    rate: number;
    fvStart: number;
    finalBalance: number;
}

export interface SuperBreakdownRow {
    month: number;
    age: number;
    balance: number;
}

export interface SuperCalculatorState {
    myAge: string;
    setMyAge: (value: string) => void;
    wifeAge: string;
    setWifeAge: (value: string) => void;
    mySuper: string;
    setMySuper: (value: string) => void;
    wifeSuper: string;
    setWifeSuper: (value: string) => void;
    targetAge: string;
    setTargetAge: (value: string) => void;
    targetBalance: string;
    setTargetBalance: (value: string) => void;
    monthlyContribution: string;
    setMonthlyContribution: (value: string) => void;
    monthlyContributionPost50: string;
    setMonthlyContributionPost50: (value: string) => void;
    netReturn: string;
    setNetReturn: (value: string) => void;
    calcMode: CalcMode;
    setCalcMode: (mode: CalcMode) => void;
    results: SuperResultData | null;
    error: string;
    breakdownData: SuperBreakdownRow[];
}