// File: 'src/hooks/useSaleDrawdownCalculator.ts'
import { useMemo, useState } from 'react';
import type { SaleDrawdownState } from '../types/drawdown.types';
import { computeSaleDrawdownDerived } from '../utils/calculations/drawdownCalculations';

export function useSaleDrawdownCalculator(): SaleDrawdownState {
    // Sale Calculation (defaults)
    const [salePrice, setSalePrice] = useState<number>(1_000_000);
    const [costBase, setCostBase] = useState<number>(350_000);
    const [depreciationClaimed, setDepreciationClaimed] = useState<number>(50_000);
    const [sellingCosts, setSellingCosts] = useState<number>(50_000);
    const [person1TaxRate, setPerson1TaxRate] = useState<number>(45);
    const [person2TaxRate, setPerson2TaxRate] = useState<number>(37);
    const [cgtDiscountRate, setCgtDiscountRate] = useState<number>(50); // disabled in UI

    // Drawdown Plan
    const [annualInterestRate, setAnnualInterestRate] = useState<number>(2); // %
    const [monthlyDrawdown, setMonthlyDrawdown] = useState<number>(10_000);
    const [startMonth, setStartMonth] = useState<string>('2031-01'); // default to Jan 2031

    const derived = useMemo(
        () =>
            computeSaleDrawdownDerived(
                { salePrice, costBase, depreciationClaimed, sellingCosts, person1TaxRate, person2TaxRate, cgtDiscountRate },
                { annualInterestRate, monthlyDrawdown, startMonth }
            ),
        [
            salePrice,
            costBase,
            depreciationClaimed,
            sellingCosts,
            person1TaxRate,
            person2TaxRate,
            cgtDiscountRate,
            annualInterestRate,
            monthlyDrawdown,
            startMonth,
        ]
    );

    return {
        // inputs
        salePrice,
        costBase,
        depreciationClaimed,
        sellingCosts,
        person1TaxRate,
        person2TaxRate,
        cgtDiscountRate,
        annualInterestRate,
        monthlyDrawdown,
        startMonth,
        // setters
        setSalePrice,
        setCostBase,
        setDepreciationClaimed,
        setSellingCosts,
        setPerson1TaxRate,
        setPerson2TaxRate,
        setCgtDiscountRate,
        setAnnualInterestRate,
        setMonthlyDrawdown,
        setStartMonth,
        // derived
        taxableGain: derived.taxableGain,
        person1Tax: derived.person1Tax,
        person2Tax: derived.person2Tax,
        totalTax: derived.totalTax,
        netProceeds: derived.netProceeds,
        schedule: derived.schedule,
        monthsToDeplete: derived.monthsToDeplete,
        depletionDateLabel: derived.depletionDateLabel,
        durationLabel: derived.durationLabel,
    };
}
