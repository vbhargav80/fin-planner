import { useState, useEffect } from 'react';
import type { SuperResultData, SuperBreakdownRow, CalcMode, SuperCalculatorState } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';

export function useSuperCalculator(): SuperCalculatorState {
    // Default values
    const defaultState = {
        myAge: '45',
        wifeAge: '42',
        mySuper: '400000',
        wifeSuper: '110000',
        targetAge: '60',
        targetBalance: '1500000',
        myMonthlyContribution: '500',
        myMonthlyContributionPost50: '0',
        wifeMonthlyContribution: '200',
        wifeMonthlyContributionPost50: '0',
        netReturn: '7',
        calcMode: 'contribution' as CalcMode,
    };

    // Form state
    const [myAge, setMyAge] = useState(defaultState.myAge);
    const [wifeAge, setWifeAge] = useState(defaultState.wifeAge);
    const [mySuper, setMySuper] = useState(defaultState.mySuper);
    const [wifeSuper, setWifeSuper] = useState(defaultState.wifeSuper);
    const [targetAge, setTargetAge] = useState(defaultState.targetAge);
    const [targetBalance, setTargetBalance] = useState(defaultState.targetBalance);
    const [myMonthlyContribution, setMyMonthlyContribution] = useState(defaultState.myMonthlyContribution);
    const [myMonthlyContributionPost50, setMyMonthlyContributionPost50] = useState(defaultState.myMonthlyContributionPost50);
    const [wifeMonthlyContribution, setWifeMonthlyContribution] = useState(defaultState.wifeMonthlyContribution);
    const [wifeMonthlyContributionPost50, setWifeMonthlyContributionPost50] = useState(defaultState.wifeMonthlyContributionPost50);
    const [netReturn, setNetReturn] = useState(defaultState.netReturn);
    const [calcMode, setCalcMode] = useState<CalcMode>(defaultState.calcMode);

    // Compute initial results synchronously
    const initialComputation = (() => {
        const inputs = {
            myAge: parseFloat(defaultState.myAge),
            wifeAge: parseFloat(defaultState.wifeAge),
            mySuper: parseFloat(defaultState.mySuper),
            wifeSuper: parseFloat(defaultState.wifeSuper),
            targetAge: parseFloat(defaultState.targetAge),
            targetBalance: parseFloat(defaultState.targetBalance),
            myMonthlyContribution: parseFloat(defaultState.myMonthlyContribution),
            myMonthlyContributionPost50: parseFloat(defaultState.myMonthlyContributionPost50),
            wifeMonthlyContribution: parseFloat(defaultState.wifeMonthlyContribution),
            wifeMonthlyContributionPost50: parseFloat(defaultState.wifeMonthlyContributionPost50),
            netReturn: parseFloat(defaultState.netReturn),
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
            myMonthlyContribution: parseFloat(myMonthlyContribution),
            myMonthlyContributionPost50: parseFloat(myMonthlyContributionPost50),
            wifeMonthlyContribution: parseFloat(wifeMonthlyContribution),
            wifeMonthlyContributionPost50: parseFloat(wifeMonthlyContributionPost50),
            netReturn: parseFloat(netReturn),
        };

        const result = calculateSuper(inputs, calcMode);

        setResults(result.results);
        setBreakdownData(result.breakdown);
        setError(result.error || '');

    }, [myAge, wifeAge, mySuper, wifeSuper, targetAge, targetBalance, myMonthlyContribution, myMonthlyContributionPost50, wifeMonthlyContribution, wifeMonthlyContributionPost50, netReturn, calcMode]);

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
        myMonthlyContribution, setMyMonthlyContribution,
        myMonthlyContributionPost50, setMyMonthlyContributionPost50,
        wifeMonthlyContribution, setWifeMonthlyContribution,
        wifeMonthlyContributionPost50, setWifeMonthlyContributionPost50,
        // Legacy - can be removed later
        monthlyContribution: myMonthlyContribution,
        setMonthlyContribution: setMyMonthlyContribution,
        monthlyContributionPost50: myMonthlyContributionPost50,
        setMonthlyContributionPost50: setMyMonthlyContributionPost50,
    };
}
