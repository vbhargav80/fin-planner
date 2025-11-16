
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

    // For 'contribution' mode, this is required.
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

export interface State {
    myAge: number;
    wifeAge: number;
    mySuper: number;
    wifeSuper: number;
    targetAge: number;
    targetBalance: number;
    netReturn: number;
    calcMode: CalcMode;
    contributionFrequency: ContributionFrequency;
    makeExtraContribution: boolean;
    // Separate states for monthly and yearly contributions
    myMonthlyContributionPre50: number;
    myMonthlyContributionPost50: number;
    wifeMonthlyContributionPre50: number;
    wifeMonthlyContributionPost50: number;
    myYearlyContributionPre50: number;
    myYearlyContributionPost50: number;
    wifeYearlyContributionPre50: number;
    wifeYearlyContributionPost50: number;
    // Extra contributions
    myExtraYearlyContribution: number;
    myExtraContributionYears: number;
    wifeExtraYearlyContribution: number;
    wifeExtraContributionYears: number;
}

export type Action =
    | { type: 'SET_MY_AGE'; payload: number }
    | { type: 'SET_WIFE_AGE'; payload: number }
    | { type: 'SET_MY_SUPER'; payload: number }
    | { type: 'SET_WIFE_SUPER'; payload: number }
    | { type: 'SET_TARGET_AGE'; payload: number }
    | { type: 'SET_TARGET_BALANCE'; payload: number }
    | { type: 'SET_NET_RETURN'; payload: number }
    | { type: 'SET_CALC_MODE'; payload: CalcMode }
    | { type: 'SET_CONTRIBUTION_FREQUENCY'; payload: ContributionFrequency }
    | { type: 'SET_MAKE_EXTRA_CONTRIBUTION'; payload: boolean }
    | { type: 'SET_MY_CONTRIBUTION_PRE_50'; payload: number }
    | { type: 'SET_MY_CONTRIBUTION_POST_50'; payload: number }
    | { type: 'SET_WIFE_CONTRIBUTION_PRE_50'; payload: number }
    | { type: 'SET_WIFE_CONTRIBUTION_POST_50'; payload: number }
    | { type: 'SET_MY_EXTRA_YEARLY_CONTRIBUTION'; payload: number }
    | { type: 'SET_MY_EXTRA_CONTRIBUTION_YEARS'; payload: number }
    | { type: 'SET_WIFE_EXTRA_YEARLY_CONTRIBUTION'; payload: number }
    | { type: 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS'; payload: number };

export interface SuperBreakdownRow {
    month: number;
    age: number;
    balance: number;
}

export interface SuperCalculatorState {
    state: State;
    dispatch: React.Dispatch<Action>;
    results: SuperResultData | null;
    error: string;
    breakdownData: SuperBreakdownRow[];
    // Derived values
    myContributionPre50: number;
    myContributionPost50: number;
    wifeContributionPre50: number;
    wifeContributionPost50: number;
}
