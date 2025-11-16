import { useState, useEffect } from 'react';
import type { SuperResultData, SuperBreakdownRow, CalcMode, SuperCalculatorState } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';

export function useSuperCalculator(): SuperCalculatorState {
    // Default values (single source of truth for initial calculation)
    const defaultState = {
        myAge: '45',
        wifeAge: '42',
        mySuper: '400000',
        wifeSuper: '110000',
        targetAge: '60',
        targetBalance: '1500000',
        monthlyContribution: '500',
        monthlyContributionPost50: '0',
        netReturn: '7' ,
        calcMode: 'contribution' as CalcMode,
    };

    // Form state
    const [myAge, setMyAge] = useState(defaultState.myAge);
    const [wifeAge, setWifeAge] = useState(defaultState.wifeAge);
    const [mySuper, setMySuper] = useState(defaultState.mySuper);
    const [wifeSuper, setWifeSuper] = useState(defaultState.wifeSuper);
    const [targetAge, setTargetAge] = useState(defaultState.targetAge);
    const [targetBalance, setTargetBalance] = useState(defaultState.targetBalance);
    const [monthlyContribution, setMonthlyContribution] = useState(defaultState.monthlyContribution);
    const [monthlyContributionPost50, setMonthlyContributionPost50] = useState(defaultState.monthlyContributionPost50);
    const [netReturn, setNetReturn] = useState(defaultState.netReturn);
    const [calcMode, setCalcMode] = useState<CalcMode>(defaultState.calcMode);

    // Compute initial results synchronously so the UI shows data immediately on first render
    const initialComputation = (() => {
        const inputs = {
            myAge: parseFloat(defaultState.myAge),
            wifeAge: parseFloat(defaultState.wifeAge),
            mySuper: parseFloat(defaultState.mySuper),
            wifeSuper: parseFloat(defaultState.wifeSuper),
            targetAge: parseFloat(defaultState.targetAge),
            targetBalance: parseFloat(defaultState.targetBalance),
            monthlyContribution: parseFloat(defaultState.monthlyContribution),
            monthlyContributionPost50: parseFloat(defaultState.monthlyContributionPost50),
            netReturn: parseFloat(defaultState.netReturn),
        };
        return calculateSuper(inputs, defaultState.calcMode);
    })();

    const [results, setResults] = useState<SuperResultData | null>(initialComputation.results);
    const [error, setError] = useState<string>(initialComputation.error || '');
    const [breakdownData, setBreakdownData] = useState<SuperBreakdownRow[]>(initialComputation.breakdown);

    useEffect(() => {
        // Recalculate whenever any dependency changes (including calcMode)
        const inputs = {
            myAge: parseFloat(myAge),
            wifeAge: parseFloat(wifeAge),
            mySuper: parseFloat(mySuper),
            wifeSuper: parseFloat(wifeSuper),
            targetAge: parseFloat(targetAge),
            targetBalance: parseFloat(targetBalance),
            monthlyContribution: parseFloat(monthlyContribution),
            monthlyContributionPost50: parseFloat(monthlyContributionPost50),
            netReturn: parseFloat(netReturn),
        };

        const result = calculateSuper(inputs, calcMode);

        setResults(result.results);
        setBreakdownData(result.breakdown);
        setError(result.error || '');

    }, [myAge, wifeAge, mySuper, wifeSuper, targetAge, targetBalance, monthlyContribution, monthlyContributionPost50, netReturn, calcMode]);

    return {
        myAge, setMyAge,
        wifeAge, setWifeAge,
        mySuper, setMySuper,
        wifeSuper, setWifeSuper,
        targetAge, setTargetAge,
        targetBalance, setTargetBalance,
        monthlyContribution, setMonthlyContribution,
        monthlyContributionPost50, setMonthlyContributionPost50,
        netReturn, setNetReturn,
        calcMode,
        setCalcMode,
        results,
        error,
        breakdownData,
    };
}
