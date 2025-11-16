import { useState, useEffect, useCallback } from 'react';
import type { SuperResultData, SuperBreakdownRow, CalcMode, SuperCalculatorState, ContributionFrequency } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';

// Define defaults in a single place
const defaultState = {
    myAge: '45',
    wifeAge: '42',
    mySuper: '400000',
    wifeSuper: '110000',
    targetAge: '60',
    targetBalance: '1500000',
    netReturn: '7',
    calcMode: 'contribution' as CalcMode,
    contributionFrequency: 'monthly' as ContributionFrequency,
    // Monthly defaults
    myMonthlyContribution: '500',
    myMonthlyContributionPost50: '0',
    wifeMonthlyContribution: '200',
    wifeMonthlyContributionPost50: '0',
    // Yearly defaults
    myYearlyContribution: '6000',
    myYearlyContributionPost50: '0',
    wifeYearlyContribution: '2500',
    wifeYearlyContributionPost50: '0',
    // Extra yearly
    myExtraYearlyContribution: '0',
    wifeExtraYearlyContribution: '0',
};

export function useSuperCalculator(): SuperCalculatorState {
    // Form state
    const [myAge, setMyAge] = useState(defaultState.myAge);
    const [wifeAge, setWifeAge] = useState(defaultState.wifeAge);
    const [mySuper, setMySuper] = useState(defaultState.mySuper);
    const [wifeSuper, setWifeSuper] = useState(defaultState.wifeSuper);
    const [targetAge, setTargetAge] = useState(defaultState.targetAge);
    const [targetBalance, setTargetBalance] = useState(defaultState.targetBalance);
    const [myContributionPre50, setMyContributionPre50] = useState(defaultState.myMonthlyContribution);
    const [myContributionPost50, setMyContributionPost50] = useState(defaultState.myMonthlyContributionPost50);
    const [wifeContributionPre50, setWifeContributionPre50] = useState(defaultState.wifeMonthlyContribution);
    const [wifeContributionPost50, setWifeContributionPost50] = useState(defaultState.wifeMonthlyContributionPost50);
    const [myExtraYearlyContribution, setMyExtraYearlyContribution] = useState(defaultState.myExtraYearlyContribution);
    const [wifeExtraYearlyContribution, setWifeExtraYearlyContribution] = useState(defaultState.wifeExtraYearlyContribution);
    const [netReturn, setNetReturn] = useState(defaultState.netReturn);
    const [calcMode, setCalcMode] = useState<CalcMode>(defaultState.calcMode);
    const [contributionFrequency, _setContributionFrequency] = useState<ContributionFrequency>(defaultState.contributionFrequency);

    // Custom setter for frequency to adjust contribution values
    const setContributionFrequency = useCallback((freq: ContributionFrequency) => {
        _setContributionFrequency(freq);
        if (freq === 'yearly') {
            setMyContributionPre50(defaultState.myYearlyContribution);
            setMyContributionPost50(defaultState.myYearlyContributionPost50);
            setWifeContributionPre50(defaultState.wifeYearlyContribution);
            setWifeContributionPost50(defaultState.wifeYearlyContributionPost50);
        } else { // monthly
            setMyContributionPre50(defaultState.myMonthlyContribution);
            setMyContributionPost50(defaultState.myMonthlyContributionPost50);
            setWifeContributionPre50(defaultState.wifeMonthlyContribution);
            setWifeContributionPost50(defaultState.wifeMonthlyContributionPost50);
        }
    }, []);

    // Compute initial results synchronously
    const initialComputation = (() => {
        const inputs = {
            myAge: parseFloat(defaultState.myAge),
            wifeAge: parseFloat(defaultState.wifeAge),
            mySuper: parseFloat(defaultState.mySuper),
            wifeSuper: parseFloat(defaultState.wifeSuper),
            targetAge: parseFloat(defaultState.targetAge),
            targetBalance: parseFloat(defaultState.targetBalance),
            myContributionPre50: parseFloat(defaultState.myMonthlyContribution),
            myContributionPost50: parseFloat(defaultState.myMonthlyContributionPost50),
            wifeContributionPre50: parseFloat(defaultState.wifeMonthlyContribution),
            wifeContributionPost50: parseFloat(defaultState.wifeMonthlyContributionPost50),
            myExtraYearlyContribution: parseFloat(defaultState.myExtraYearlyContribution),
            wifeExtraYearlyContribution: parseFloat(defaultState.wifeExtraYearlyContribution),
            netReturn: parseFloat(defaultState.netReturn),
            contributionFrequency: defaultState.contributionFrequency,
        };
        return calculateSuper(inputs, defaultState.calcMode);
    })();

    const [results, setResults] = useState<SuperResultData | null>(initialComputation.results);
    const [error, setError] = useState<string>(initialComputation.error || '');
    const [breakdownData, setBreakdownData] = useState<SuperBreakdownRow[]>(initialComputation.breakdown);

    useEffect(() => {
        const inputs = {
            myAge: parseFloat(myAge),
            wifeAge: parseFloat(wifeAge),
            mySuper: parseFloat(mySuper),
            wifeSuper: parseFloat(wifeSuper),
            targetAge: parseFloat(targetAge),
            targetBalance: parseFloat(targetBalance),
            myContributionPre50: parseFloat(myContributionPre50),
            myContributionPost50: parseFloat(myContributionPost50),
            wifeContributionPre50: parseFloat(wifeContributionPre50),
            wifeContributionPost50: parseFloat(wifeContributionPost50),
            myExtraYearlyContribution: parseFloat(myExtraYearlyContribution),
            wifeExtraYearlyContribution: parseFloat(wifeExtraYearlyContribution),
            netReturn: parseFloat(netReturn),
            contributionFrequency,
        };

        const result = calculateSuper(inputs, calcMode);

        setResults(result.results);
        setBreakdownData(result.breakdown);
        setError(result.error || '');

    }, [myAge, wifeAge, mySuper, wifeSuper, targetAge, targetBalance, myContributionPre50, myContributionPost50, wifeContributionPre50, wifeContributionPost50, myExtraYearlyContribution, wifeExtraYearlyContribution, netReturn, calcMode, contributionFrequency]);

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
        myContributionPre50, setMyContributionPre50,
        myContributionPost50, setMyContributionPost50,
        myExtraYearlyContribution, setMyExtraYearlyContribution,
        wifeContributionPre50, setWifeContributionPre50,
        wifeContributionPost50, setWifeContributionPost50,
        wifeExtraYearlyContribution, setWifeExtraYearlyContribution,
    };
}
