import type { SuperInputs, SuperResultData, SuperBreakdownRow, CalcMode, ContributionFrequency } from '../../types/super.types';

const CONTRIBUTION_TAX_RATE = 0.15;

export interface CalculationResult {
    results: SuperResultData | null;
    breakdown: SuperBreakdownRow[];
    error?: string;
}

function calculateFutureValue(
    startAge: number,
    targetAge: number,
    startBalance: number,
    contributionPre50: number,
    contributionPost50: number,
    extraYearlyContribution: number,
    monthlyRate: number,
    extraContributionYears: number,
    frequency: ContributionFrequency,
    makeExtraContribution: boolean
): { finalBalance: number; breakdown: SuperBreakdownRow[] } {
    const yearsToGrow = targetAge - startAge;
    if (yearsToGrow <= 0) {
        return { finalBalance: startBalance, breakdown: [] };
    }

    const n_months = yearsToGrow * 12;
    let runningBalance = startBalance;
    const breakdown: SuperBreakdownRow[] = [];

    for (let i = 1; i <= n_months; i++) {
        const interestEarned = monthlyRate > 0 ? runningBalance * monthlyRate : 0;
        runningBalance += interestEarned;

        const currentAge = startAge + Math.floor((i - 1) / 12);
        const grossContribution = currentAge < 50 ? contributionPre50 : contributionPost50;
        const netContribution = grossContribution * (1 - CONTRIBUTION_TAX_RATE);

        if (frequency === 'monthly') {
            runningBalance += netContribution;
        } else if (frequency === 'yearly' && i % 12 === 0) {
            runningBalance += netContribution;
        }

        const currentYear = Math.floor((i - 1) / 12) + 1;
        if (makeExtraContribution && currentYear <= extraContributionYears && i % 12 === 0) {
            const netExtraContribution = extraYearlyContribution * (1 - CONTRIBUTION_TAX_RATE);
            runningBalance += netExtraContribution;
        }

        const displayMonth = ((i - 1) % 12) + 1;
        breakdown.push({
            month: displayMonth,
            age: currentAge,
            balance: runningBalance,
        });
    }

    return { finalBalance: runningBalance, breakdown };
}

export function calculateSuper(
    inputs: SuperInputs,
    calcMode: CalcMode
): CalculationResult {
    const {
        myAge,
        wifeAge,
        mySuper,
        wifeSuper,
        targetAge,
        netReturn,
        targetBalance,
        myContributionPre50,
        myContributionPost50,
        wifeContributionPre50,
        wifeContributionPost50,
        myExtraYearlyContribution,
        wifeExtraYearlyContribution,
        myExtraContributionYears,
        wifeExtraContributionYears,
        contributionFrequency,
        makeExtraContribution,
    } = inputs;

    // Validation
    const baseInputs = [myAge, wifeAge, mySuper, wifeSuper, targetAge, netReturn];
    if (baseInputs.some(isNaN)) {
        return { results: null, breakdown: [], error: '' };
    }

    if (calcMode === 'contribution' && !targetBalance) {
        return { results: null, breakdown: [], error: '' };
    }

    if (
        calcMode === 'balance' &&
        ([myContributionPre50, myContributionPost50, wifeContributionPre50, wifeContributionPost50, myExtraYearlyContribution, wifeExtraYearlyContribution, myExtraContributionYears, wifeExtraContributionYears].some((v) => isNaN(v as number)))
    ) {
        return { results: null, breakdown: [], error: '' };
    }

    const monthlyRate = (netReturn / 100) / 12;
    const combinedStartBalance = mySuper + wifeSuper;
    const yearsToGrow = targetAge - myAge;

    let finalBalance = 0;
    let fvOfCurrentSuper = 0;
    let finalResults: Partial<SuperResultData> = {};
    let combinedBreakdown: SuperBreakdownRow[] = [];

    if (calcMode === 'contribution') {
        const n_months = yearsToGrow > 0 ? yearsToGrow * 12 : 0;

        const fvMySuper = mySuper * Math.pow(1 + monthlyRate, n_months);
        const fvWifeSuper = wifeSuper * Math.pow(1 + monthlyRate, n_months);
        fvOfCurrentSuper = fvMySuper + fvWifeSuper;

        const annuityFactor = n_months > 0 ? (Math.pow(1 + monthlyRate, n_months) - 1) / monthlyRate : 0;

        const shortfall = targetBalance! - fvOfCurrentSuper;

        // This is the required NET amount that needs to be invested
        const requiredNetPerPersonPMT = (shortfall > 0 && annuityFactor > 0) ? shortfall / (annuityFactor * 2) : 0;

        // This is the GROSS amount the user needs to contribute (before tax)
        const requiredGrossTotalPMT = requiredNetPerPersonPMT / (1 - CONTRIBUTION_TAX_RATE);

        finalResults = {
            pmt: requiredGrossTotalPMT * 2, // Display the total combined gross payment
            target: targetBalance,
        };

        // The breakdown simulation uses the per-person NET payment
        const myFinal = calculateFutureValue(myAge, targetAge, mySuper, requiredGrossTotalPMT, requiredGrossTotalPMT, 0, monthlyRate, 0, 'monthly', false);
        const wifeRetirementAge = wifeAge + yearsToGrow;
        const wifeFinal = calculateFutureValue(wifeAge, wifeRetirementAge, wifeSuper, requiredGrossTotalPMT, requiredGrossTotalPMT, 0, monthlyRate, 0, 'monthly', false);
        finalBalance = myFinal.finalBalance + wifeFinal.finalBalance;

        // FIX: Changed '>' to '>=' to prioritize 'myFinal' when lengths are equal
        const longerBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? myFinal.breakdown : wifeFinal.breakdown;
        const shorterBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? wifeFinal.breakdown : myFinal.breakdown;

        combinedBreakdown = longerBreakdown.map((row, i) => {
            const otherBalance = i < shorterBreakdown.length ? shorterBreakdown[i].balance : (shorterBreakdown.length > 0 ? shorterBreakdown[shorterBreakdown.length - 1].balance : 0);
            return {
                ...row,
                balance: row.balance + otherBalance,
            };
        });

    } else { // 'balance' mode
        const wifeRetirementAge = wifeAge + yearsToGrow;
        const myFinal = calculateFutureValue(myAge, targetAge, mySuper, myContributionPre50!, myContributionPost50!, myExtraYearlyContribution!, monthlyRate, myExtraContributionYears!, contributionFrequency, makeExtraContribution);
        const wifeFinal = calculateFutureValue(wifeAge, wifeRetirementAge, wifeSuper, wifeContributionPre50!, wifeContributionPost50!, wifeExtraYearlyContribution!, monthlyRate, wifeExtraContributionYears!, contributionFrequency, makeExtraContribution);

        finalBalance = myFinal.finalBalance + wifeFinal.finalBalance;
        fvOfCurrentSuper = (mySuper + wifeSuper) * Math.pow(1 + monthlyRate, yearsToGrow * 12);

        finalResults = {
            projectedBalance: finalBalance,
            pmt: myContributionPre50,
            pmtPost50: myContributionPost50,
        };

        // FIX: Changed '>' to '>=' here as well
        const longerBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? myFinal.breakdown : wifeFinal.breakdown;
        const shorterBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? wifeFinal.breakdown : myFinal.breakdown;

        combinedBreakdown = longerBreakdown.map((row, i) => {
            const otherBalance = i < shorterBreakdown.length ? shorterBreakdown[i].balance : (shorterBreakdown.length > 0 ? shorterBreakdown[shorterBreakdown.length - 1].balance : 0);
            return {
                ...row,
                balance: row.balance + otherBalance,
            };
        });
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

    return { results, breakdown: combinedBreakdown, error: undefined };
}