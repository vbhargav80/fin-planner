import { useState, useEffect, useCallback } from 'react';
import type { SuperResultData, SuperBreakdownRow, CalcMode, SuperCalculatorState, ContributionFrequency } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';

// Define defaults in a single place
const defaultState = {
    myAge: 45,
    wifeAge: 42,
    mySuper: 400000,
    wifeSuper: 110000,
    targetAge: 60,
    targetBalance: 1500000,
    netReturn: 7,
    calcMode: 'contribution' as CalcMode,
    contributionFrequency: 'monthly' as ContributionFrequency,
    makeExtraContribution: false,
    // Monthly defaults
    myMonthlyContribution: 1000,
    myMonthlyContributionPost50: 0,
    wifeMonthlyContribution: 200,
    wifeMonthlyContributionPost50: 0,
    // Yearly defaults
    myYearlyContribution: 1500,
    myYearlyContributionPost50: 0,
    wifeYearlyContribution: 1500,
    wifeYearlyContributionPost50: 0,
    // Extra yearly
    myExtraYearlyContribution: 2000,
    wifeExtraYearlyContribution: 2000,
    myExtraContributionYears: 1,
    wifeExtraContributionYears: 1,
};

export function useSuperCalculator(): SuperCalculatorState {
    // Form state
    const [myAge, setMyAge] = useState(defaultState.myAge);
    const [wifeAge, setWifeAge] = useState(defaultState.wifeAge);
    const [mySuper, setMySuper] = useState(defaultState.mySuper);
    const [wifeSuper, setWifeSuper] = useState(defaultState.wifeSuper);
    const [targetAge, setTargetAge] = useState(defaultState.targetAge);
    const [targetBalance, setTargetBalance] = useState(defaultState.targetBalance);
    const [netReturn, setNetReturn] = useState(defaultState.netReturn);
    const [calcMode, setCalcMode] = useState<CalcMode>(defaultState.calcMode);
    const [contributionFrequency, _setContributionFrequency] = useState<ContributionFrequency>(defaultState.contributionFrequency);
    const [makeExtraContribution, setMakeExtraContribution] = useState(defaultState.makeExtraContribution);

    // State to store user inputs for both frequencies
    const [myMonthlyContributionPre50, setMyMonthlyContributionPre50] = useState(defaultState.myMonthlyContribution);
    const [myMonthlyContributionPost50, setMyMonthlyContributionPost50] = useState(defaultState.myMonthlyContributionPost50);
    const [wifeMonthlyContributionPre50, setWifeMonthlyContributionPre50] = useState(defaultState.wifeMonthlyContribution);
    const [wifeMonthlyContributionPost50, setWifeMonthlyContributionPost50] = useState(defaultState.wifeMonthlyContributionPost50);
    const [myYearlyContributionPre50, setMyYearlyContributionPre50] = useState(defaultState.myYearlyContribution);
    const [myYearlyContributionPost50, setMyYearlyContributionPost50] = useState(defaultState.myYearlyContributionPost50);
    const [wifeYearlyContributionPre50, setWifeYearlyContributionPre50] = useState(defaultState.wifeYearlyContribution);
    const [wifeYearlyContributionPost50, setWifeYearlyContributionPost50] = useState(defaultState.wifeYearlyContributionPost50);

    // Active contribution values based on frequency
    const myContributionPre50 = contributionFrequency === 'monthly' ? myMonthlyContributionPre50 : myYearlyContributionPre50;
    const myContributionPost50 = contributionFrequency === 'monthly' ? myMonthlyContributionPost50 : myYearlyContributionPost50;
    const wifeContributionPre50 = contributionFrequency === 'monthly' ? wifeMonthlyContributionPre50 : wifeYearlyContributionPre50;
    const wifeContributionPost50 = contributionFrequency === 'monthly' ? wifeMonthlyContributionPost50 : wifeYearlyContributionPost50;

    // Setters for active contribution values
    const setMyContributionPre50 = (val: number) => contributionFrequency === 'monthly' ? setMyMonthlyContributionPre50(val) : setMyYearlyContributionPre50(val);
    const setMyContributionPost50 = (val: number) => contributionFrequency === 'monthly' ? setMyMonthlyContributionPost50(val) : setMyYearlyContributionPost50(val);
    const setWifeContributionPre50 = (val: number) => contributionFrequency === 'monthly' ? setWifeMonthlyContributionPre50(val) : setWifeYearlyContributionPre50(val);
    const setWifeContributionPost50 = (val: number) => contributionFrequency === 'monthly' ? setWifeMonthlyContributionPost50(val) : setWifeYearlyContributionPost50(val);

    const [myExtraContributionYears, setMyExtraContributionYears] = useState(defaultState.myExtraContributionYears);
    const [wifeExtraContributionYears, setWifeExtraContributionYears] = useState(defaultState.wifeExtraContributionYears);
    const [myExtraYearlyContribution, setMyExtraYearlyContribution] = useState(defaultState.myExtraYearlyContribution);
    const [wifeExtraYearlyContribution, setWifeExtraYearlyContribution] = useState(defaultState.wifeExtraYearlyContribution);

    // Custom setter for frequency to only toggle the frequency state
    const setContributionFrequency = useCallback((freq: ContributionFrequency) => {
        _setContributionFrequency(freq);
    }, []);

    // Compute initial results synchronously
    const initialComputation = (() => {
        const inputs = {
            ...defaultState,
            myContributionPre50: defaultState.myMonthlyContribution,
            myContributionPost50: defaultState.myMonthlyContributionPost50,
            wifeContributionPre50: defaultState.wifeMonthlyContribution,
            wifeContributionPost50: defaultState.wifeMonthlyContributionPost50,
            contributionFrequency: defaultState.contributionFrequency,
            makeExtraContribution: defaultState.makeExtraContribution,
        };
        return calculateSuper(inputs, defaultState.calcMode);
    })();

    const [results, setResults] = useState<SuperResultData | null>(initialComputation.results);
    const [error, setError] = useState<string>(initialComputation.error || '');
    const [breakdownData, setBreakdownData] = useState<SuperBreakdownRow[]>(initialComputation.breakdown);

    useEffect(() => {
        const inputs = {
            myAge,
            wifeAge,
            mySuper,
            wifeSuper,
            targetAge,
            targetBalance,
            myContributionPre50,
            myContributionPost50,
            wifeContributionPre50,
            wifeContributionPost50,
            myExtraYearlyContribution,
            wifeExtraYearlyContribution,
            myExtraContributionYears,
            wifeExtraContributionYears,
            netReturn,
            contributionFrequency,
            makeExtraContribution,
        };

        const result = calculateSuper(inputs, calcMode);

        setResults(result.results);
        setBreakdownData(result.breakdown);
        setError(result.error || '');

    }, [myAge, wifeAge, mySuper, wifeSuper, targetAge, targetBalance, myContributionPre50, myContributionPost50, wifeContributionPre50, wifeContributionPost50, myExtraYearlyContribution, wifeExtraYearlyContribution, myExtraContributionYears, wifeExtraContributionYears, netReturn, calcMode, contributionFrequency, makeExtraContribution]);

    return {
        myAge, setMyAge,
        wifeAge, setWifeAge,
        mySuper, setMySuper,
        wifeSuper, setWifeSuper,
        targetAge, setTargetAge,
        targetBalance, setTargetBalance,
        netReturn, setNetReturn,
        calcMode, setCalcMode,
        results,
        error,
        breakdownData,
        contributionFrequency, setContributionFrequency,
        makeExtraContribution, setMakeExtraContribution,
        myContributionPre50, setMyContributionPre50,
        myContributionPost50, setMyContributionPost50,
        myExtraYearlyContribution, setMyExtraYearlyContribution,
        myExtraContributionYears, setMyExtraContributionYears,
        wifeContributionPre50, setWifeContributionPre50,
        wifeContributionPost50, setWifeContributionPost50,
        wifeExtraYearlyContribution, setWifeExtraYearlyContribution,
        wifeExtraContributionYears, setWifeExtraContributionYears,
    };
}
