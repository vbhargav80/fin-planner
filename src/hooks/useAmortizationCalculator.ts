// File: `src/hooks/useAmortizationCalculator.ts`
import { useState, useEffect, useMemo } from 'react';
import type {AmortizationRow, AmortizationCalculatorState} from '../types/amortization.types';
import { calculateAmortizationSchedule, calculateRefiMonthlyPayment } from '../utils/calculations/amortizationCalculations';

export function useAmortizationCalculator(): AmortizationCalculatorState {
    const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
    const [interestRate, setInterestRate] = useState<number>(6);
    const [principal, setPrincipal] = useState<number>(900000);
    const [monthlyRepayment, setMonthlyRepayment] = useState<number>(6750);
    const [initialRentalIncome, setInitialRentalIncome] = useState<number>(4300);
    const [initialOffsetBalance, setInitialOffsetBalance] = useState<number>(1000000);
    const [monthlyExpenditure, setMonthlyExpenditure] = useState<number>(10000);
    const [monthlyExpenditurePre2031, setMonthlyExpenditurePre2031] = useState<number>(2000);
    const [rentalGrowthRate, setRentalGrowthRate] = useState<number>(2.5);
    const [isRefinanced, setIsRefinanced] = useState<boolean>(false);
    const [considerOffsetIncome, setConsiderOffsetIncome] = useState<boolean>(false);
    const [offsetIncomeRate, setOffsetIncomeRate] = useState<number>(3);
    const [continueWorking, setContinueWorking] = useState<boolean>(false);
    const [yearsWorking, setYearsWorking] = useState<number>(0);
    const [netIncome, setNetIncome] = useState<number>(10000);

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
    };
}
