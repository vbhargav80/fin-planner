import { useEffect, useReducer, useState } from 'react';
import type { SuperResultData, SuperBreakdownRow, SuperCalculatorState, State, Action } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';

// Define defaults in a single place
const initialState: State = {
    myAge: 45,
    wifeAge: 42,
    mySuper: 400000,
    wifeSuper: 110000,
    targetAge: 60,
    targetBalance: 1500000,
    netReturn: 7,
    calcMode: 'contribution',
    contributionFrequency: 'monthly',
    makeExtraContribution: false,
    // Monthly defaults
    myMonthlyContributionPre50: 1000,
    myMonthlyContributionPost50: 0,
    wifeMonthlyContributionPre50: 200,
    wifeMonthlyContributionPost50: 0,
    // Yearly defaults
    myYearlyContributionPre50: 1500,
    myYearlyContributionPost50: 0,
    wifeYearlyContributionPre50: 1500,
    wifeYearlyContributionPost50: 0,
    // Extra yearly
    myExtraYearlyContribution: 2000,
    wifeExtraYearlyContribution: 2000,
    myExtraContributionYears: 1,
    wifeExtraContributionYears: 1,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_MY_AGE': return { ...state, myAge: action.payload };
        case 'SET_WIFE_AGE': return { ...state, wifeAge: action.payload };
        case 'SET_MY_SUPER': return { ...state, mySuper: action.payload };
        case 'SET_WIFE_SUPER': return { ...state, wifeSuper: action.payload };
        case 'SET_TARGET_AGE': return { ...state, targetAge: action.payload };
        case 'SET_TARGET_BALANCE': return { ...state, targetBalance: action.payload };
        case 'SET_NET_RETURN': return { ...state, netReturn: action.payload };
        case 'SET_CALC_MODE': return { ...state, calcMode: action.payload };
        case 'SET_CONTRIBUTION_FREQUENCY': return { ...state, contributionFrequency: action.payload };
        case 'SET_MAKE_EXTRA_CONTRIBUTION': return { ...state, makeExtraContribution: action.payload };
        case 'SET_MY_EXTRA_YEARLY_CONTRIBUTION': return { ...state, myExtraYearlyContribution: action.payload };
        case 'SET_MY_EXTRA_CONTRIBUTION_YEARS': return { ...state, myExtraContributionYears: action.payload };
        case 'SET_WIFE_EXTRA_YEARLY_CONTRIBUTION': return { ...state, wifeExtraYearlyContribution: action.payload };
        case 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS': return { ...state, wifeExtraContributionYears: action.payload };
        case 'SET_MY_CONTRIBUTION_PRE_50':
            return state.contributionFrequency === 'monthly'
                ? { ...state, myMonthlyContributionPre50: action.payload }
                : { ...state, myYearlyContributionPre50: action.payload };
        case 'SET_MY_CONTRIBUTION_POST_50':
            return state.contributionFrequency === 'monthly'
                ? { ...state, myMonthlyContributionPost50: action.payload }
                : { ...state, myYearlyContributionPost50: action.payload };
        case 'SET_WIFE_CONTRIBUTION_PRE_50':
            return state.contributionFrequency === 'monthly'
                ? { ...state, wifeMonthlyContributionPre50: action.payload }
                : { ...state, wifeYearlyContributionPre50: action.payload };
        case 'SET_WIFE_CONTRIBUTION_POST_50':
            return state.contributionFrequency === 'monthly'
                ? { ...state, wifeMonthlyContributionPost50: action.payload }
                : { ...state, wifeYearlyContributionPost50: action.payload };
        default: return state;
    }
}

export function useSuperCalculator(): SuperCalculatorState {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Compute initial results synchronously
    const initialComputation = (() => {
        const inputs = {
            ...initialState,
            myContributionPre50: initialState.myMonthlyContributionPre50,
            myContributionPost50: initialState.myMonthlyContributionPost50,
            wifeContributionPre50: initialState.wifeMonthlyContributionPre50,
            wifeContributionPost50: initialState.wifeMonthlyContributionPost50,
        };
        return calculateSuper(inputs, initialState.calcMode);
    })();

    const [results, setResults] = useState<SuperResultData | null>(initialComputation.results);
    const [error, setError] = useState<string>(initialComputation.error || '');
    const [breakdownData, setBreakdownData] = useState<SuperBreakdownRow[]>(initialComputation.breakdown);

    useEffect(() => {
        const myContributionPre50 = state.contributionFrequency === 'monthly' ? state.myMonthlyContributionPre50 : state.myYearlyContributionPre50;
        const myContributionPost50 = state.contributionFrequency === 'monthly' ? state.myMonthlyContributionPost50 : state.myYearlyContributionPost50;
        const wifeContributionPre50 = state.contributionFrequency === 'monthly' ? state.wifeMonthlyContributionPre50 : state.wifeYearlyContributionPre50;
        const wifeContributionPost50 = state.contributionFrequency === 'monthly' ? state.wifeMonthlyContributionPost50 : state.wifeYearlyContributionPost50;

        const inputs = {
            ...state,
            myContributionPre50,
            myContributionPost50,
            wifeContributionPre50,
            wifeContributionPost50,
        };

        const result = calculateSuper(inputs, state.calcMode);

        setResults(result.results);
        setBreakdownData(result.breakdown);
        setError(result.error || '');

    }, [state]);

    return {
        state,
        dispatch,
        results,
        error,
        breakdownData,
        myContributionPre50: state.contributionFrequency === 'monthly' ? state.myMonthlyContributionPre50 : state.myYearlyContributionPre50,
        myContributionPost50: state.contributionFrequency === 'monthly' ? state.myMonthlyContributionPost50 : state.myYearlyContributionPost50,
        wifeContributionPre50: state.contributionFrequency === 'monthly' ? state.wifeMonthlyContributionPre50 : state.wifeYearlyContributionPre50,
        wifeContributionPost50: state.contributionFrequency === 'monthly' ? state.wifeMonthlyContributionPost50 : state.wifeYearlyContributionPost50,
    };
}
