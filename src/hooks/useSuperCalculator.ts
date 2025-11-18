import { useMemo } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import { useConfig } from '../contexts/ConfigContext';
import type { SuperCalculatorState, State, Action } from '../types/super.types';
import { calculateSuper } from '../utils/calculations/superCalculations';
import { LIFESTYLE_AMOUNTS } from '../constants/super';
import { STORAGE_KEYS } from "../constants/storageKeys.ts";

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

        // RENAMED REDUCERS
        case 'SET_MY_CONTRIBUTION_CURRENT':
            return state.contributionFrequency === 'monthly'
                ? { ...state, myMonthlyContributionCurrent: action.payload }
                : { ...state, myYearlyContributionCurrent: action.payload };
        case 'SET_MY_CONTRIBUTION_FUTURE':
            return state.contributionFrequency === 'monthly'
                ? { ...state, myMonthlyContributionFuture: action.payload }
                : { ...state, myYearlyContributionFuture: action.payload };

        case 'SET_WIFE_CONTRIBUTION_CURRENT':
            return state.contributionFrequency === 'monthly'
                ? { ...state, wifeMonthlyContributionCurrent: action.payload }
                : { ...state, wifeYearlyContributionCurrent: action.payload };
        case 'SET_WIFE_CONTRIBUTION_FUTURE':
            return state.contributionFrequency === 'monthly'
                ? { ...state, wifeMonthlyContributionFuture: action.payload }
                : { ...state, wifeYearlyContributionFuture: action.payload };

        case 'SET_MY_CONTRIBUTION_CHANGE_AGE': return { ...state, myContributionChangeAge: action.payload };
        case 'SET_WIFE_CONTRIBUTION_CHANGE_AGE': return { ...state, wifeContributionChangeAge: action.payload };

        case 'SET_MY_EXTRA_YEARLY_CONTRIBUTION': return { ...state, myExtraYearlyContribution: action.payload };
        case 'SET_MY_EXTRA_CONTRIBUTION_YEARS': return { ...state, myExtraContributionYears: action.payload };
        case 'SET_WIFE_EXTRA_YEARLY_CONTRIBUTION': return { ...state, wifeExtraYearlyContribution: action.payload };
        case 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS': return { ...state, wifeExtraContributionYears: action.payload };

        case 'SET_DRAWDOWN_LIFESTYLE': {
            const lifestyle = action.payload;
            const newAmount = lifestyle !== 'custom' ? LIFESTYLE_AMOUNTS[lifestyle] : state.drawdownAnnualAmount;
            return { ...state, drawdownLifestyle: lifestyle, drawdownAnnualAmount: newAmount };
        }
        case 'SET_DRAWDOWN_ANNUAL_AMOUNT': return { ...state, drawdownAnnualAmount: action.payload, drawdownLifestyle: 'custom' };
        case 'SET_DRAWDOWN_RETURN': return { ...state, drawdownReturn: action.payload };
        case 'RESET': return action.payload;
        default: return state;
    }
}

export function useSuperCalculator(): SuperCalculatorState {
    const { config } = useConfig();
    // Use new key v5 because we changed state schema
    const [state, dispatch] = usePersistentReducer(reducer, config.super, STORAGE_KEYS.SUPER);

    const myContributionCurrent = state.contributionFrequency === 'monthly' ? state.myMonthlyContributionCurrent : state.myYearlyContributionCurrent;
    const myContributionFuture = state.contributionFrequency === 'monthly' ? state.myMonthlyContributionFuture : state.myYearlyContributionFuture;
    const wifeContributionCurrent = state.contributionFrequency === 'monthly' ? state.wifeMonthlyContributionCurrent : state.wifeYearlyContributionCurrent;
    const wifeContributionFuture = state.contributionFrequency === 'monthly' ? state.wifeMonthlyContributionFuture : state.wifeYearlyContributionFuture;

    const { results, breakdownData, drawdownSchedule, error } = useMemo(() => {
        const inputs = {
            ...state,
            myContributionCurrent,
            myContributionFuture,
            wifeContributionCurrent,
            wifeContributionFuture,
        };
        const result = calculateSuper(inputs, state.calcMode);
        return {
            results: result.results,
            breakdownData: result.breakdown,
            drawdownSchedule: result.drawdownSchedule,
            error: result.error || '',
        };
    }, [state, myContributionCurrent, myContributionFuture, wifeContributionCurrent, wifeContributionFuture]);

    return {
        state,
        dispatch,
        results,
        error,
        breakdownData,
        drawdownSchedule,
        // Exposed values
        myContributionCurrent,
        myContributionFuture,
        wifeContributionCurrent,
        wifeContributionFuture,
    };
}