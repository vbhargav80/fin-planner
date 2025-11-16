
export type CalcMode = 'contribution' | 'balance';
export type ContributionFrequency = 'monthly' | 'yearly';

export interface SuperInputs {
    myAge: number;
    wifeAge: number;
    mySuper: number;
    wifeSuper: number;
    targetAge: number;
    netReturn: number;
    contributionFrequency: ContributionFrequency;
    makeExtraContribution: boolean;

    // For 'contribution' mode
    targetBalance?: number;

    // For 'balance' mode
    myContributionPre50?: number;
    myContributionPost50?: number;
    wifeContributionPre50?: number;
    wifeContributionPost50?: number;

    // Extra yearly contributions
    myExtraYearlyContribution?: number;
    wifeExtraYearlyContribution?: number;
    myExtraContributionYears?: number;
    wifeExtraContributionYears?: number;
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
    myAge: number;
    setMyAge: (value: number) => void;
    wifeAge: number;
    setWifeAge: (value: number) => void;
    mySuper: number;
    setMySuper: (value: number) => void;
    wifeSuper: number;
    setWifeSuper: (value: number) => void;
    targetAge: number;
    setTargetAge: (value: number) => void;
    targetBalance: number;
    setTargetBalance: (value: number) => void;
    netReturn: number;
    setNetReturn: (value: number) => void;
    calcMode: CalcMode;
    setCalcMode: (mode: CalcMode) => void;
    results: SuperResultData | null;
    error: string;
    breakdownData: SuperBreakdownRow[];

    contributionFrequency: ContributionFrequency;
    setContributionFrequency: (freq: ContributionFrequency) => void;

    makeExtraContribution: boolean;
    setMakeExtraContribution: (value: boolean) => void;

    // Contributions for self
    myContributionPre50: number;
    setMyContributionPre50: (value: number) => void;
    myContributionPost50: number;
    setMyContributionPost50: (value: number) => void;
    myExtraYearlyContribution: number;
    setMyExtraYearlyContribution: (value: number) => void;
    myExtraContributionYears: number;
    setMyExtraContributionYears: (value: number) => void;

    // Contributions for spouse
    wifeContributionPre50: number;
    setWifeContributionPre50: (value: number) => void;
    wifeContributionPost50: number;
    setWifeContributionPost50: (value: number) => void;
    wifeExtraYearlyContribution: number;
    setWifeExtraYearlyContribution: (value: number) => void;
    wifeExtraContributionYears: number;
    setWifeExtraContributionYears: (value: number) => void;
}
