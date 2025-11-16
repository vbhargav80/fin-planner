import type { SuperInputs, SuperResultData, SuperBreakdownRow, CalcMode } from '../../types/super.types';

export interface CalculationResult {
    results: SuperResultData | null;
    breakdown: SuperBreakdownRow[];
    error?: string;
}

export function calculateSuper(
    inputs: SuperInputs,
    calcMode: CalcMode
): CalculationResult {
    const {
        myAge,
        mySuper,
        wifeSuper,
        targetAge,
        netReturn,
        targetBalance,
        monthlyContribution,
        monthlyContributionPost50
    } = inputs;

    // Validation
    const baseInputs = [myAge, mySuper, wifeSuper, targetAge, netReturn];
    if (baseInputs.some(isNaN)) {
        return { results: null, breakdown: [], error: '' };
    }

    if (calcMode === 'contribution' && !targetBalance) {
        return { results: null, breakdown: [], error: '' };
    }

    // For balance mode, allow zero contributions; only guard against invalid (NaN) numbers
    if (
        calcMode === 'balance' &&
        ([monthlyContribution, monthlyContributionPost50].some((v) => isNaN(v as number)))
    ) {
        return { results: null, breakdown: [], error: '' };
    }

    const yearsToGrow = targetAge - myAge;
    if (yearsToGrow <= 0) {
        return {
            results: null,
            breakdown: [],
            error: 'Target retirement age must be greater than your current age.'
        };
    }

    // Calculations
    const n_months = yearsToGrow * 12;
    const monthlyRate = (netReturn / 100) / 12;
    const combinedStartBalance = mySuper + wifeSuper;

    let fvOfCurrentSuper: number;
    if (monthlyRate === 0) {
        fvOfCurrentSuper = combinedStartBalance;
    } else {
        fvOfCurrentSuper = combinedStartBalance * Math.pow(1 + monthlyRate, n_months);
    }

    let finalResults: Partial<SuperResultData> = {};
    let contribution_phase1 = 0;
    let contribution_phase2 = 0;

    if (calcMode === 'contribution') {
        const annuityFactor = monthlyRate === 0
            ? n_months
            : (Math.pow(1 + monthlyRate, n_months) - 1) / monthlyRate;

        const shortfall = targetBalance! - fvOfCurrentSuper;
        const requiredMonthlyPMT = shortfall > 0 ? shortfall / annuityFactor : 0;

        finalResults = {
            pmt: requiredMonthlyPMT,
            target: targetBalance
        };

        contribution_phase1 = requiredMonthlyPMT;
        contribution_phase2 = requiredMonthlyPMT;
    } else {
        finalResults = {
            pmt: monthlyContribution,
            pmtPost50: monthlyContributionPost50
        };

        contribution_phase1 = monthlyContribution!;
        contribution_phase2 = monthlyContributionPost50!;
    }

    // Generate breakdown
    const breakdown = generateBreakdown(
        myAge,
        combinedStartBalance,
        n_months,
        monthlyRate,
        contribution_phase1,
        contribution_phase2
    );

    const finalBalance = breakdown[breakdown.length - 1]?.balance || 0;

    if (calcMode === 'balance') {
        finalResults.projectedBalance = finalBalance;
    }

    const results: SuperResultData = {
        ...finalResults,
        calcMode,
        years: yearsToGrow,
        start: combinedStartBalance,
        rate: netReturn,
        fvStart: fvOfCurrentSuper,
        finalBalance,
        pmt: finalResults.pmt || 0,
    };

    return { results, breakdown, error: undefined };
}

function generateBreakdown(
    startAge: number,
    startBalance: number,
    n_months: number,
    monthlyRate: number,
    contribution_phase1: number,
    contribution_phase2: number
): SuperBreakdownRow[] {
    const breakdown: SuperBreakdownRow[] = [];
    let runningBalance = startBalance;

    for (let i = 1; i <= n_months; i++) {
        const interestEarned = monthlyRate > 0 ? runningBalance * monthlyRate : 0;
        const currentAge = startAge + Math.floor((i - 1) / 12);
        const currentMonthlyContribution = currentAge < 50 ? contribution_phase1 : contribution_phase2;

        runningBalance += interestEarned + currentMonthlyContribution;

        const displayMonth = ((i - 1) % 12) + 1;

        breakdown.push({
            month: displayMonth,
            age: currentAge,
            balance: runningBalance,
        });
    }

    return breakdown;
}