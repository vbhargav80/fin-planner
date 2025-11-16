// File: `src/hooks/useAmortizationCalculator.ts`
import { useState, useEffect, useMemo } from 'react';
import type {AmortizationRow, AmortizationCalculatorState} from '../types/amortization.types';
import { calculateAmortizationSchedule, calculateRefiMonthlyPayment } from '../utils/calculations/amortizationCalculations';

export function useAmortizationCalculator(): AmortizationCalculatorState {
    const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
    const [interestRate, setInterestRate] = useState<number>(6);
    const [principal, setPrincipal] = useState<number>(900000);
    const [monthlyRepayment, setMonthlyRepayment] = useState<number>(6800);
    const [initialRentalIncome, setInitialRentalIncome] = useState<number>(4300);
    const [initialOffsetBalance, setInitialOffsetBalance] = useState<number>(1000000);
    const [monthlyExpenditure, setMonthlyExpenditure] = useState<number>(10000);
    const [monthlyExpenditurePre2031, setMonthlyExpenditurePre2031] = useState<number>(1000);
    const [rentalGrowthRate, setRentalGrowthRate] = useState<number>(2.5);
    const [isRefinanced, setIsRefinanced] = useState<boolean>(false);
    const [considerOffsetIncome, setConsiderOffsetIncome] = useState<boolean>(false);
    const [offsetIncomeRate, setOffsetIncomeRate] = useState<number>(3);
    const [continueWorking, setContinueWorking] = useState<boolean>(false);
    const [yearsWorking, setYearsWorking] = useState<number>(3);
    const [netIncome, setNetIncome] = useState<number>(10000);
    const [scrollTo2031, setScrollTo2031] = useState(0);
    const [scrollToFirstDepletedOffset, setScrollToFirstDepletedOffset] = useState(0);

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
        const inputs = {
            interestRate,
            principal,
            monthlyRepayment,
            initialRentalIncome,
            initialOffsetBalance,
            monthlyExpenditure,
            monthlyExpenditurePre2031,
            rentalGrowthRate,
            isRefinanced,
            considerOffsetIncome,
            offsetIncomeRate,
            continueWorking,
            yearsWorking,
            netIncome,
        };

        let low = 0;
        let high = 50000; // Assume expenditure won't exceed this
        let optimalExpenditure = monthlyExpenditure;

        for (let i = 0; i < 30; i++) { // 30 iterations for precision
            const mid = (low + high) / 2;
            const schedule = calculateAmortizationSchedule({ ...inputs, monthlyExpenditure: mid });
            const finalOffsetBalance = schedule[schedule.length - 1].offsetBalance;

            // Check if offset is depleted at any point before the target date
            const isDepletedEarly = schedule.some(row => row.offsetBalance < 0);

            if (isDepletedEarly || finalOffsetBalance < 0) {
                high = mid;
            } else {
                optimalExpenditure = mid;
                low = mid;
            }
        }

        setMonthlyExpenditure(optimalExpenditure);
    };

    const actualMonthlyRepayment = useMemo(() => {
        if (isRefinanced) {
            return calculateRefiMonthlyPayment({
                interestRate,
                principal,
                monthlyRepayment,
                initialRentalIncome,
                initialOffsetBalance,
                monthlyExpenditure,
                monthlyExpenditurePre2031,
                rentalGrowthRate,
                isRefinanced,
                considerOffsetIncome,
                offsetIncomeRate,
                continueWorking,
                yearsWorking,
                netIncome,
            });
        }
        return monthlyRepayment;
    }, [
        isRefinanced,
        interestRate,
        principal,
        monthlyRepayment,
        initialRentalIncome,
        initialOffsetBalance,
        monthlyExpenditure,
        monthlyExpenditurePre2031,
        rentalGrowthRate,
        considerOffsetIncome,
        offsetIncomeRate,
        continueWorking,
        yearsWorking,
        netIncome,
    ]);

    useEffect(() => {
        const inputs = {
            interestRate,
            principal,
            monthlyRepayment,
            initialRentalIncome,
            initialOffsetBalance,
            monthlyExpenditure,
            monthlyExpenditurePre2031,
            rentalGrowthRate,
            isRefinanced,
            considerOffsetIncome,
            offsetIncomeRate,
            continueWorking,
            yearsWorking,
            netIncome,
        };

        const data = calculateAmortizationSchedule(inputs);
        setAmortizationData(data);
    }, [
        interestRate,
        principal,
        initialRentalIncome,
        initialOffsetBalance,
        monthlyExpenditure,
        monthlyExpenditurePre2031,
        rentalGrowthRate,
        continueWorking,
        yearsWorking,
        netIncome,
        considerOffsetIncome,
        offsetIncomeRate,
        isRefinanced,
        monthlyRepayment
    ]);

    return {
        amortizationData,
        interestRate, setInterestRate,
        principal, setPrincipal,
        monthlyRepayment, setMonthlyRepayment,
        initialRentalIncome, setInitialRentalIncome,
        initialOffsetBalance, setInitialOffsetBalance,
        monthlyExpenditure, setMonthlyExpenditure,
        monthlyExpenditurePre2031, setMonthlyExpenditurePre2031,
        rentalGrowthRate, setRentalGrowthRate,
        isRefinanced, setIsRefinanced,
        considerOffsetIncome, setConsiderOffsetIncome,
        offsetIncomeRate, setOffsetIncomeRate,
        continueWorking, setContinueWorking,
        yearsWorking, setYearsWorking,
        netIncome, setNetIncome,
        actualMonthlyRepayment,
        scrollTo2031,
        triggerScrollTo2031,
        clearScrollTo2031,
        scrollToFirstDepletedOffset,
        triggerScrollToFirstDepletedOffset,
        clearScrollToFirstDepletedOffset,
        calculateOptimalExpenditure,
    };
}
