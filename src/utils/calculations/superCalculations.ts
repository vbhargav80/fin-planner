import type { SuperInputs, SuperResultData, SuperBreakdownRow, CalcMode, ContributionFrequency } from '../../types/super.types';

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
    frequency: ContributionFrequency
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
        const contribution = currentAge < 50 ? contributionPre50 : contributionPost50;

        if (frequency === 'monthly') {
            runningBalance += contribution;
        } else if (frequency === 'yearly' && i % 12 === 0) {
            runningBalance += contribution;
        }

        // Add extra yearly contribution at the end of the year
        if (i % 12 === 0) {
            runningBalance += extraYearlyContribution;
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
        contributionFrequency,
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
        ([myContributionPre50, myContributionPost50, wifeContributionPre50, wifeContributionPost50, myExtraYearlyContribution, wifeExtraYearlyContribution].some((v) => isNaN(v as number)))
    ) {
        return { results: null, breakdown: [], error: '' };
    }

    const monthlyRate = (netReturn / 100) / 12;
    const combinedStartBalance = mySuper + wifeSuper;

    let finalBalance = 0;
    let fvOfCurrentSuper = 0;
    let finalResults: Partial<SuperResultData> = {};
    let combinedBreakdown: SuperBreakdownRow[] = [];

    if (calcMode === 'contribution') {
        // This mode is complex with extra yearly contributions, so we'll assume monthly for now.
        const myYearsToGrow = targetAge - myAge;
        const wifeYearsToGrow = targetAge - wifeAge;

        const my_n_months = myYearsToGrow * 12;
        const wife_n_months = wifeYearsToGrow * 12;

        const fvMySuper = mySuper * Math.pow(1 + monthlyRate, my_n_months);
        const fvWifeSuper = wifeSuper * Math.pow(1 + monthlyRate, wife_n_months);
        fvOfCurrentSuper = fvMySuper + fvWifeSuper;

        const myAnnuityFactor = (Math.pow(1 + monthlyRate, my_n_months) - 1) / monthlyRate;
        const wifeAnnuityFactor = (Math.pow(1 + monthlyRate, wife_n_months) - 1) / monthlyRate;
        const combinedAnnuityFactor = myAnnuityFactor + wifeAnnuityFactor;

        const shortfall = targetBalance! - fvOfCurrentSuper;
        const requiredMonthlyPMT = shortfall > 0 ? shortfall / combinedAnnuityFactor : 0;

        finalResults = {
            pmt: requiredMonthlyPMT,
            target: targetBalance,
        };

        const myFinal = calculateFutureValue(myAge, targetAge, mySuper, requiredMonthlyPMT, requiredMonthlyPMT, myExtraYearlyContribution!, monthlyRate, 'monthly');
        const wifeFinal = calculateFutureValue(wifeAge, targetAge, wifeSuper, requiredMonthlyPMT, requiredMonthlyPMT, wifeExtraYearlyContribution!, monthlyRate, 'monthly');
        finalBalance = myFinal.finalBalance + wifeFinal.finalBalance;
        combinedBreakdown = myFinal.breakdown;

    } else { // 'balance' mode
        const myFinal = calculateFutureValue(myAge, targetAge, mySuper, myContributionPre50!, myContributionPost50!, myExtraYearlyContribution!, monthlyRate, contributionFrequency);
        const wifeFinal = calculateFutureValue(wifeAge, targetAge, wifeSuper, wifeContributionPre50!, wifeContributionPost50!, wifeExtraYearlyContribution!, monthlyRate, contributionFrequency);

        finalBalance = myFinal.finalBalance + wifeFinal.finalBalance;
        fvOfCurrentSuper = (mySuper + wifeSuper) * Math.pow(1 + monthlyRate, (targetAge - myAge) * 12); // Approx for display

        finalResults = {
            projectedBalance: finalBalance,
            pmt: myContributionPre50,
            pmtPost50: myContributionPost50,
        };
        
        const longerBreakdown = myFinal.breakdown.length > wifeFinal.breakdown.length ? myFinal.breakdown : wifeFinal.breakdown;
        const shorterBreakdown = myFinal.breakdown.length > wifeFinal.breakdown.length ? wifeFinal.breakdown : myFinal.breakdown;

        combinedBreakdown = longerBreakdown.map((row, i) => {
            const otherBalance = i < shorterBreakdown.length ? shorterBreakdown[i].balance : shorterBreakdown[shorterBreakdown.length - 1].balance;
            return {
                ...row,
                balance: row.balance + otherBalance,
            };
        });
    }

    const results: SuperResultData = {
        ...finalResults,
        calcMode,
        years: targetAge - myAge, // Use primary person's timeline for display
        start: combinedStartBalance,
        rate: netReturn,
        fvStart: fvOfCurrentSuper,
        finalBalance,
        pmt: finalResults.pmt || 0,
    };

    return { results, breakdown: combinedBreakdown, error: undefined };
}
