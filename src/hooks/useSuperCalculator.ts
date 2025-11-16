import { useState, useEffect, useCallback } from 'react';
import type { SuperResultData, SuperBreakdownRow, CalcMode, SuperCalculatorState } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';

export function useSuperCalculator(): SuperCalculatorState {
    const [myAge, setMyAge] = useState('45');
    const [wifeAge, setWifeAge] = useState('42');
    const [mySuper, setMySuper] = useState('400000');
    const [wifeSuper, setWifeSuper] = useState('110000');
    const [targetAge, setTargetAge] = useState('60');
    const [targetBalance, setTargetBalance] = useState('1500000');
    const [monthlyContribution, setMonthlyContribution] = useState('500');
    const [monthlyContributionPost50, setMonthlyContributionPost50] = useState('0');
    const [netReturn, setNetReturn] = useState('7');
    const [calcMode, setCalcMode] = useState<CalcMode>('contribution');
    const [results, setResults] = useState<SuperResultData | null>(null);
    const [error, setError] = useState<string>('');
    const [breakdownData, setBreakdownData] = useState<SuperBreakdownRow[]>([]);

    const calculate = useCallback(() => {
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

        // Use the 'calcMode' from state directly in the callback
        const result = calculateSuper(inputs, calcMode);

        setResults(result.results);
        setBreakdownData(result.breakdown);
        setError(result.error || '');
    }, [myAge, wifeAge, mySuper, wifeSuper, targetAge, targetBalance,
        monthlyContribution, monthlyContributionPost50, netReturn, calcMode]); // Add calcMode to the dependency array

    useEffect(() => {
        // This effect now correctly re-runs whenever the 'calculate' function is recreated
        calculate();
    }, [calculate]);

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
        setCalcMode, // Return the standard state setter
        results,
        error,
        breakdownData,
    };
}
