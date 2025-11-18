import { useState, useEffect, useCallback } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import { useConfig } from '../contexts/ConfigContext'; // NEW
import type { AmortizationRow, AmortizationCalculatorState, State, Action } from '../types/amortization.types';
import { calculateAmortizationSchedule } from '../utils/calculations/amortizationCalculations';
import * as AmortizationConstants from '../constants/amortization';

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_INTEREST_RATE': {
            const { MIN, MAX, STEP } = AmortizationConstants.INTEREST_RATE;
            const value = action.payload;
            const snapped = Math.min(MAX, Math.max(MIN, Math.round(value / STEP) * STEP));
            return { ...state, interestRate: Number(snapped.toFixed(2)) };
        }
        case 'SET_PRINCIPAL': return { ...state, principal: action.payload };
        case 'SET_MONTHLY_REPAYMENT': return { ...state, monthlyRepayment: action.payload };
        case 'SET_INITIAL_RENTAL_INCOME': return { ...state, initialRentalIncome: action.payload };
        case 'SET_INITIAL_OFFSET_BALANCE': return { ...state, initialOffsetBalance: action.payload };
        case 'SET_MONTHLY_EXPENDITURE': return { ...state, monthlyExpenditure: action.payload };
        case 'SET_MONTHLY_EXPENDITURE_PRE_2031': return { ...state, monthlyExpenditurePre2031: action.payload };
        case 'SET_RENTAL_GROWTH_RATE': return { ...state, rentalGrowthRate: action.payload };
        case 'SET_IS_REFINANCED': return { ...state, isRefinanced: action.payload };
        case 'SET_CONSIDER_OFFSET_INCOME': return { ...state, considerOffsetIncome: action.payload };
        case 'SET_OFFSET_INCOME_RATE': return { ...state, offsetIncomeRate: action.payload };
        case 'SET_CONTINUE_WORKING': return { ...state, continueWorking: action.payload };
        case 'SET_YEARS_WORKING': return { ...state, yearsWorking: action.payload };
        case 'SET_NET_INCOME': return { ...state, netIncome: action.payload };
        case 'RESET': return action.payload as State; // NEW
        default: return state;
    }
}

export function useAmortizationCalculator(): AmortizationCalculatorState {
    const { config } = useConfig(); // NEW
    const [state, dispatch] = usePersistentReducer(reducer, config.amortization, 'amortization-v1');

    const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
    const [scrollTo2031, setScrollTo2031] = useState(0);
    const [actualMonthlyRepayment, setActualMonthlyRepayment] = useState(config.amortization.monthlyRepayment);
    const [scrollToFirstDepletedOffset, setScrollToFirstDepletedOffset] = useState(0);
    const [hasDepletedOffsetRows, setHasDepletedOffsetRows] = useState(false);

    // ... (scroll handlers remain same) ...
    const triggerScrollTo2031 = () => setScrollTo2031(c => c + 1);
    const clearScrollTo2031 = useCallback(() => setScrollTo2031(0), []);
    const triggerScrollToFirstDepletedOffset = () => setScrollToFirstDepletedOffset(c => c + 1);
    const clearScrollToFirstDepletedOffset = useCallback(() => setScrollToFirstDepletedOffset(0), []);

    const calculateOptimalExpenditure = () => {
        // ... (logic remains same)
        const inputs = { ...state };
        let low = 0, high = 50000, optimalExpenditure = state.monthlyExpenditure;
        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;
            const { schedule } = calculateAmortizationSchedule({ ...inputs, monthlyExpenditure: mid });
            const finalOffsetBalance = schedule.length > 0 ? schedule[schedule.length - 1].offsetBalance : 0;
            if (finalOffsetBalance < 0) high = mid; else { optimalExpenditure = mid; low = mid; }
        }
        dispatch({ type: 'SET_MONTHLY_EXPENDITURE', payload: optimalExpenditure });
        return optimalExpenditure;
    };

    const calculateOptimalWorkingYears = () => {
        // ... (logic remains same)
        dispatch({ type: 'SET_CONTINUE_WORKING', payload: true });
        const inputs = { ...state, continueWorking: true };
        let optimalYears = -1;
        for (let years = 0; years <= 10; years++) {
            const { schedule } = calculateAmortizationSchedule({ ...inputs, yearsWorking: years });
            if (schedule.length > 0 && schedule[schedule.length - 1].offsetBalance >= 0) { optimalYears = years; break; }
        }
        const finalYears = optimalYears === -1 ? 10 : optimalYears;
        let low = 0, high = 50000, optimalIncome = state.netIncome;
        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;
            const { schedule } = calculateAmortizationSchedule({ ...inputs, yearsWorking: finalYears, netIncome: mid });
            if (schedule.length > 0 && schedule[schedule.length - 1].offsetBalance < 0) low = mid; else { optimalIncome = mid; high = mid; }
        }
        dispatch({ type: 'SET_YEARS_WORKING', payload: finalYears });
        dispatch({ type: 'SET_NET_INCOME', payload: optimalIncome });
        return { years: finalYears, income: optimalIncome };
    };

    useEffect(() => {
        const { schedule, actualMonthlyRepayment: calculatedRepayment } = calculateAmortizationSchedule(state);
        setAmortizationData(schedule);
        setActualMonthlyRepayment(calculatedRepayment);
        setHasDepletedOffsetRows(schedule.some(row => row.offsetBalance <= 0));
    }, [state]);

    return {
        state,
        dispatch,
        amortizationData,
        actualMonthlyRepayment,
        scrollTo2031,
        triggerScrollTo2031,
        clearScrollTo2031,
        scrollToFirstDepletedOffset,
        triggerScrollToFirstDepletedOffset,
        clearScrollToFirstDepletedOffset,
        calculateOptimalExpenditure,
        calculateOptimalWorkingYears,
        hasDepletedOffsetRows,
    };
}