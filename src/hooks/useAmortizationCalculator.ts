import { useState, useEffect } from 'react';
import { usePersistentReducer } from './usePersistentReducer';
import { useConfig } from '../contexts/ConfigContext';
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
        case 'SET_MONTHLY_SALARY': return { ...state, monthlySalary: action.payload };
        case 'SET_TRANSITIONAL_SALARY': return { ...state, transitionalSalary: action.payload };
        case 'SET_CURRENT_LIVING_EXPENSES': return { ...state, currentLivingExpenses: action.payload };
        case 'SET_RETIREMENT_LIVING_EXPENSES': return { ...state, retirementLivingExpenses: action.payload };
        case 'SET_RENTAL_GROWTH_RATE': return { ...state, rentalGrowthRate: action.payload };
        case 'SET_IS_REFINANCED': return { ...state, isRefinanced: action.payload };
        case 'SET_CONSIDER_OFFSET_INCOME': return { ...state, considerOffsetIncome: action.payload };
        case 'SET_OFFSET_INCOME_RATE': return { ...state, offsetIncomeRate: action.payload };
        case 'SET_RETIREMENT_DATE': return { ...state, retirementDate: action.payload };
        case 'SET_CONTINUE_WORKING': return { ...state, continueWorking: action.payload };
        case 'SET_YEARS_WORKING': return { ...state, yearsWorking: action.payload };
        case 'RESET': return action.payload;
        default: return state;
    }
}

export function useAmortizationCalculator(): AmortizationCalculatorState {
    const { config } = useConfig();
    // Correctly use config.amortization as the initial state source
    const [state, dispatch] = usePersistentReducer(reducer, config.amortization, 'amortization-v7');

    const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
    // Correctly use config value for the default repayment state
    const [actualMonthlyRepayment, setActualMonthlyRepayment] = useState(config.amortization.monthlyRepayment);
    const [hasDepletedOffsetRows, setHasDepletedOffsetRows] = useState(false);

    const calculateOptimalExpenditure = () => {
        const inputs = { ...state };
        let low = 0, high = 50000, optimalExpenditure = state.retirementLivingExpenses;
        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;
            const { schedule } = calculateAmortizationSchedule({ ...inputs, retirementLivingExpenses: mid });
            const finalOffsetBalance = schedule.length > 0 ? schedule[schedule.length - 1].offsetBalance : 0;
            if (finalOffsetBalance < 0) high = mid; else { optimalExpenditure = mid; low = mid; }
        }
        dispatch({ type: 'SET_RETIREMENT_LIVING_EXPENSES', payload: optimalExpenditure });
        return optimalExpenditure;
    };

    const calculateOptimalOffsetBalance = () => {
        const inputs = { ...state };
        let low = 0, high = 5000000;
        let optimalOffset = high;
        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;
            const { schedule } = calculateAmortizationSchedule({ ...inputs, initialOffsetBalance: mid });
            const neverDepleted = schedule.every(row => row.offsetBalance >= 0);
            if (neverDepleted) { optimalOffset = mid; high = mid; }
            else { low = mid; }
        }
        const result = Math.ceil(optimalOffset / 1000) * 1000;
        dispatch({ type: 'SET_INITIAL_OFFSET_BALANCE', payload: result });
        return result;
    };

    const calculateOptimalWorkingYears = () => {
        dispatch({ type: 'SET_CONTINUE_WORKING', payload: true });
        const inputs = { ...state, continueWorking: true };

        let optimalYears = -1;
        for (let years = 0; years <= 10; years++) {
            const { schedule } = calculateAmortizationSchedule({ ...inputs, yearsWorking: years });
            if (schedule.length > 0 && schedule[schedule.length - 1].offsetBalance >= 0) {
                optimalYears = years;
                break;
            }
        }
        const finalYears = optimalYears === -1 ? 10 : optimalYears;

        let low = 0, high = 50000, optimalIncome = state.transitionalSalary;
        for (let i = 0; i < 30; i++) {
            const mid = (low + high) / 2;
            const { schedule } = calculateAmortizationSchedule({ ...inputs, yearsWorking: finalYears, transitionalSalary: mid });
            if (schedule.length > 0 && schedule[schedule.length - 1].offsetBalance < 0) low = mid; else { optimalIncome = mid; high = mid; }
        }

        dispatch({ type: 'SET_YEARS_WORKING', payload: finalYears });
        dispatch({ type: 'SET_TRANSITIONAL_SALARY', payload: optimalIncome });
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
        calculateOptimalExpenditure,
        calculateOptimalOffsetBalance,
        calculateOptimalWorkingYears,
        hasDepletedOffsetRows,
    };
}