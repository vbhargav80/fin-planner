
import { useState, useEffect, useMemo } from 'react';
import type {AmortizationRow, AmortizationCalculatorState} from '../types/amortization.types';
import { calculateAmortizationSchedule, calculateMonthlyRepayment } from '../utils/calculations/amortizationCalculations';

export function useAmortizationCalculator(): AmortizationCalculatorState {
    const [amortizationData, setAmortizationData] = useState<AmortizationRow[]>([]);
    const [interestRate, setInterestRate] = useState<number>(6);
    const [principal, setPrincipal] = useState<number>(550000);
    const [monthlyRepayment, setMonthlyRepayment] = useState<number>(6750);
    const [initialRentalIncome, setInitialRentalIncome] = useState<number>(4500);
    const [initialOffsetBalance, setInitialOffsetBalance] = useState<number>(1000000);
    const [monthlyExpenditure, setMonthlyExpenditure] = useState<number>(10000);
    const [rentalGrowthRate, setRentalGrowthRate] = useState<number>(2.5);
    const [isRefinanced, setIsRefinanced] = useState<boolean>(false);
    const [considerOffsetIncome, setConsiderOffsetIncome] = useState<boolean>(false);
    const [offsetIncomeRate, setOffsetIncomeRate] = useState<number>(3);
    const [continueWorking, setContinueWorking] = useState<boolean>(false);
    const [yearsWorking, setYearsWorking] = useState<number>(0);
    const [netIncome, setNetIncome] = useState<number>(10000);

    const actualMonthlyRepayment = useMemo(() => {
        if (isRefinanced && principal > 0) {
            return calculateMonthlyRepayment(principal, interestRate);
        }
        return monthlyRepayment;
    }, [isRefinanced, principal, interestRate, monthlyRepayment]);

    useEffect(() => {
        const inputs = {
            interestRate,
            principal,
            monthlyRepayment,
            initialRentalIncome,
            initialOffsetBalance,
            monthlyExpenditure,
            rentalGrowthRate,
            isRefinanced,
            considerOffsetIncome,
            offsetIncomeRate,
            continueWorking,
            yearsWorking,
            netIncome,
        };

        const data = calculateAmortizationSchedule(inputs, actualMonthlyRepayment);
        setAmortizationData(data);
    }, [
        interestRate,
        principal,
        initialRentalIncome,
        initialOffsetBalance,
        monthlyExpenditure,
        rentalGrowthRate,
        actualMonthlyRepayment,
        continueWorking,
        yearsWorking,
        netIncome,
        considerOffsetIncome,
        offsetIncomeRate
    ]);

    return {
        amortizationData,
        interestRate, setInterestRate,
        principal, setPrincipal,
        monthlyRepayment, setMonthlyRepayment,
        initialRentalIncome, setInitialRentalIncome,
        initialOffsetBalance, setInitialOffsetBalance,
        monthlyExpenditure, setMonthlyExpenditure,
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