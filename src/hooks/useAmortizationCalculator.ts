// File: `src/hooks/useAmortizationCalculator.ts`
import { useState, useEffect, useMemo, useReducer } from 'react';
import type { AmortizationRow, AmortizationCalculatorState, State, Action } from '../types/amortization.types';
import { calculateAmortizationSchedule, calculateRefiMonthlyPayment } from '../utils/calculations/amortizationCalculations';
import * as AmortizationConstants from '../constants/amortization';

const initialState: State = {
    interestRate: 6,
    principal: 900000,
    monthlyRepayment: 6800,
    initialRentalIncome: 4300,
    initialOffsetBalance: 1000000,
    monthlyExpenditure: 10000,
    monthlyExpenditurePre2031: 1000,
    rentalGrowthRate: 2.5,
    isRefinanced: false,
    considerOffsetIncome: false,
    offsetIncomeRate: 3,
    continueWorking: false,
    yearsWorking: 3,
    netIncome: 10000,
};

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
        default: return state;
    }
}

export function useAmortizationCalculator(): AmortizationCalculatorState {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
    const [scrollTo2031, setScrollTo2031] = useState(0);
    const [scrollToFirstDepletedOffset, setScrollToFirstDepletedOffset] = useState(0);
    const [hasDepletedOffsetRows, setHasDepletedOffsetRows] = useState(false);

    const triggerScrollTo2031 = () => {
        setScrollTo2031(prev => prev + 1);
    };

    const clearScrollTo2031 = () => {
        setScrollTo2031(0);
    };

    const triggerScrollToFirstDepletedOffset = () => {
        setScrollToFirstDepletedOffset(prev => prev + 1);
    };

    const clearScrollToFirstDepletedOffset = () => {
        setScrollToFirstDepletedOffset(0);
    };

    const calculateOptimalExpenditure = () => {
        const inputs = { ...state };

        let low = 0;
        let high = 50000; // Assume expenditure won't exceed this
        let optimalExpenditure = state.monthlyExpenditure;

        for (let i = 0; i < 30; i++) { // 30 iterations for precision
            const mid = (low + high) / 2;
            const schedule = calculateAmortizationSchedule({ ...inputs, monthlyExpenditure: mid });
            const finalOffsetBalance = schedule[schedule.length - 1].offsetBalance;

            if (finalOffsetBalance < 0) {
                high = mid;
            } else {
                optimalExpenditure = mid;
                low = mid;
            }
        }

        dispatch({ type: 'SET_MONTHLY_EXPENDITURE', payload: optimalExpenditure });
    };

    const calculateOptimalWorkingYears = () => {
        dispatch({ type: 'SET_CONTINUE_WORKING', payload: true });
        const inputs = { ...state, continueWorking: true };

        let optimalYears = -1;
        for (let years = 0; years <= 10; years++) {
            const schedule = calculateAmortizationSchedule({ ...inputs, yearsWorking: years });
            const finalOffsetBalance = schedule[schedule.length - 1].offsetBalance;
            if (finalOffsetBalance >= 0) {
                optimalYears = years;
                break;
            }
        }

        const finalYears = optimalYears === -1 ? 10 : optimalYears;

        let low = 0;
        let high = 50000; // Assume income won't exceed this
        let optimalIncome = state.netIncome;

        for (let i = 0; i < 30; i++) { // 30 iterations for precision
            const mid = (low + high) / 2;
            const schedule = calculateAmortizationSchedule({ ...inputs, yearsWorking: finalYears, netIncome: mid });
            const finalOffsetBalance = schedule[schedule.length - 1].offsetBalance;

            if (finalOffsetBalance < 0) {
                low = mid;
            } else {
                optimalIncome = mid;
                high = mid;
            }
        }

        dispatch({ type: 'SET_YEARS_WORKING', payload: finalYears });
        dispatch({ type: 'SET_NET_INCOME', payload: optimalIncome });
    };

    const actualMonthlyRepayment = useMemo(() => {
        if (state.isRefinanced) {
            return calculateRefiMonthlyPayment(state);
        }
        return state.monthlyRepayment;
    }, [state]);

    useEffect(() => {
        const data = calculateAmortizationSchedule(state);
        setAmortizationData(data);
        const hasDepleted = data.some(row => row.offsetBalance <= 0);
        setHasDepletedOffsetRows(hasDepleted);
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
