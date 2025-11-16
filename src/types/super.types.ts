
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
    myMakeExtraContribution: boolean;
    wifeMakeExtraContribution: boolean;

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
    netReturn: string;
    setNetReturn: (value: string) => void;
    calcMode: CalcMode;
    setCalcMode: (mode: CalcMode) => void;
    results: SuperResultData | null;
    error: string;
    breakdownData: SuperBreakdownRow[];

    contributionFrequency: ContributionFrequency;
    setContributionFrequency: (freq: ContributionFrequency) => void;

    // Toggles for extra contributions
    myMakeExtraContribution: boolean;
    setMyMakeExtraContribution: (value: boolean) => void;
    wifeMakeExtraContribution: boolean;
    setWifeMakeExtraContribution: (value: boolean) => void;

    // Contributions for self
    myContributionPre50: string;
    setMyContributionPre50: (value: string) => void;
    myContributionPost50: string;
    setMyContributionPost50: (value: string) => void;
    myExtraYearlyContribution: string;
    setMyExtraYearlyContribution: (value: string) => void;

    // Contributions for spouse
    wifeContributionPre50: string;
    setWifeContributionPre50: (value: string) => void;
    wifeContributionPost50: string;
    setWifeContributionPost50: (value: string) => void;
    wifeExtraYearlyContribution: string;
    setWifeExtraYearlyContribution: (value: string) => void;
}
