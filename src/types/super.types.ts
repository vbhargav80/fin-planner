import type { Dispatch } from 'react';

export type CalcMode = 'contribution' | 'balance';
export type ContributionFrequency = 'monthly' | 'yearly';
export type Lifestyle = 'modest' | 'comfortable' | 'luxury' | 'custom';

export interface SuperInputs {
    myAge: number;
    wifeAge: number;
    mySuper: number;
    wifeSuper: number;
    targetAge: number;
    netReturn: number;
    contributionFrequency: ContributionFrequency;
    makeExtraContribution: boolean;
    targetBalance?: number;
    myContributionPre50?: number;
    myContributionPost50?: number;
    wifeContributionPre50?: number;
    wifeContributionPost50?: number;
    myExtraYearlyContribution?: number;
    wifeExtraYearlyContribution?: number;
    myExtraContributionYears?: number;
    wifeExtraContributionYears?: number;
    drawdownLifestyle: Lifestyle;
    drawdownAnnualAmount: number;
    drawdownReturn: number;
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
    myMonthlyContributionPre50: number;
    myMonthlyContributionPost50: number;
    wifeMonthlyContributionPre50: number;
    wifeMonthlyContributionPost50: number;
    myYearlyContributionPre50: number;
    myYearlyContributionPost50: number;
    wifeYearlyContributionPre50: number;
    wifeYearlyContributionPost50: number;
    myExtraYearlyContribution: number;
    myExtraContributionYears: number;
    wifeExtraYearlyContribution: number;
    wifeExtraContributionYears: number;
    drawdownLifestyle: Lifestyle;
    drawdownAnnualAmount: number;
    drawdownReturn: number;
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
    | { type: 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS'; payload: number }
    | { type: 'SET_DRAWDOWN_LIFESTYLE'; payload: Lifestyle }
    | { type: 'SET_DRAWDOWN_ANNUAL_AMOUNT'; payload: number }
    | { type: 'SET_DRAWDOWN_RETURN'; payload: number }
    | { type: 'RESET'; payload: State };

export interface SuperBreakdownRow {
    month: number;
    age: number;
    balance: number;
}

export interface DrawdownRow {
    age: number;
    month: number;
    startBalance: number;
    drawdown: number;
    earnings: number;
    endBalance: number;
}

export interface SuperCalculatorState {
    state: State;
    dispatch: Dispatch<Action>;
    results: SuperResultData | null;
    error: string;
    breakdownData: SuperBreakdownRow[];
    drawdownSchedule: DrawdownRow[];
    myContributionPre50: number;
    myContributionPost50: number;
    wifeContributionPre50: number;
    wifeContributionPost50: number;
}