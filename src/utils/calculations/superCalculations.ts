import type {
    SuperInputs,
    SuperResultData,
    SuperBreakdownRow,
    CalcMode,
    ContributionFrequency,
    DrawdownRow
} from '../../types/super.types';

const CONTRIBUTION_TAX_RATE = 0.15;

export interface CalculationResult {
    results: SuperResultData | null;
    breakdown: SuperBreakdownRow[];
    drawdownSchedule: DrawdownRow[];
    error?: string;
}

function calculateFutureValue(
    startAge: number,
    targetAge: number,
    startBalance: number,
    contributionCurrent: number,
    contributionFuture: number,
    changeAge: number,
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
        const grossContribution = currentAge < changeAge ? contributionCurrent : contributionFuture;
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

function calculateDrawdownSchedule(
    startBalance: number,
    startAge: number,
    annualDrawdown: number,
    annualReturn: number
): DrawdownRow[] {
    const schedule: DrawdownRow[] = [];
    let currentBalance = startBalance;
    const monthlyDrawdown = annualDrawdown / 12;
    const monthlyRate = (annualReturn / 100) / 12;

    let monthIndex = 0;
    const maxMonths = (100 - startAge) * 12;

    while (currentBalance > 0 && monthIndex < maxMonths) {
        const start = currentBalance;
        let drawdown = monthlyDrawdown;
        if (drawdown > start) drawdown = start;

        const afterDrawdown = start - drawdown;
        const earnings = afterDrawdown * monthlyRate;
        const end = afterDrawdown + earnings;

        const currentAge = startAge + Math.floor(monthIndex / 12);
        const displayMonth = (monthIndex % 12) + 1;

        schedule.push({
            age: currentAge,
            month: displayMonth,
            startBalance: start,
            drawdown: drawdown,
            earnings: earnings,
            endBalance: end
        });

        currentBalance = end;
        monthIndex++;
    }

    return schedule;
}

export function calculateSuper(
    inputs: SuperInputs,
    calcMode: CalcMode
): CalculationResult {
    const {
        myAge, wifeAge, mySuper, wifeSuper,
        targetAge, netReturn, targetBalance,

        myContributionCurrent, myContributionFuture, myContributionChangeAge,
        wifeContributionCurrent, wifeContributionFuture, wifeContributionChangeAge,

        myExtraYearlyContribution, wifeExtraYearlyContribution,
        myExtraContributionYears, wifeExtraContributionYears,
        contributionFrequency, makeExtraContribution,
        drawdownAnnualAmount, drawdownReturn,
    } = inputs;

    const baseInputs = [myAge, wifeAge, mySuper, wifeSuper, targetAge, netReturn];
    if (baseInputs.some(isNaN)) {
        return { results: null, breakdown: [], drawdownSchedule: [], error: '' };
    }

    if (calcMode === 'contribution' && !targetBalance) {
        return { results: null, breakdown: [], drawdownSchedule: [], error: '' };
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
        const requiredNetPerPersonPMT = (shortfall > 0 && annuityFactor > 0) ? shortfall / (annuityFactor * 2) : 0;
        const requiredGrossTotalPMT = requiredNetPerPersonPMT / (1 - CONTRIBUTION_TAX_RATE);

        finalResults = {
            pmt: requiredGrossTotalPMT * 2,
            target: targetBalance,
        };

        const myFinal = calculateFutureValue(myAge, targetAge, mySuper, requiredGrossTotalPMT, requiredGrossTotalPMT, 0, 0, monthlyRate, 0, 'monthly', false);
        const wifeRetirementAge = wifeAge + yearsToGrow;
        const wifeFinal = calculateFutureValue(wifeAge, wifeRetirementAge, wifeSuper, requiredGrossTotalPMT, requiredGrossTotalPMT, 0, 0, monthlyRate, 0, 'monthly', false);

        finalBalance = myFinal.finalBalance + wifeFinal.finalBalance;

        const longerBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? myFinal.breakdown : wifeFinal.breakdown;
        const shorterBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? wifeFinal.breakdown : myFinal.breakdown;

        combinedBreakdown = longerBreakdown.map((row, i) => {
            const otherBalance = i < shorterBreakdown.length ? shorterBreakdown[i].balance : (shorterBreakdown.length > 0 ? shorterBreakdown[shorterBreakdown.length - 1].balance : 0);
            return { ...row, balance: row.balance + otherBalance };
        });

    } else {
        const wifeRetirementAge = wifeAge + yearsToGrow;

        const myFinal = calculateFutureValue(myAge, targetAge, mySuper,
            myContributionCurrent!, myContributionFuture!, myContributionChangeAge!,
            myExtraYearlyContribution!, monthlyRate, myExtraContributionYears!, contributionFrequency, makeExtraContribution);

        const wifeFinal = calculateFutureValue(wifeAge, wifeRetirementAge, wifeSuper,
            wifeContributionCurrent!, wifeContributionFuture!, wifeContributionChangeAge!,
            wifeExtraYearlyContribution!, monthlyRate, wifeExtraContributionYears!, contributionFrequency, makeExtraContribution);

        finalBalance = myFinal.finalBalance + wifeFinal.finalBalance;
        fvOfCurrentSuper = (mySuper + wifeSuper) * Math.pow(1 + monthlyRate, yearsToGrow * 12);

        finalResults = {
            projectedBalance: finalBalance,
            pmt: myContributionCurrent,
            pmtFuture: myContributionFuture, // FIXED: Use new key
        };

        const longerBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? myFinal.breakdown : wifeFinal.breakdown;
        const shorterBreakdown = myFinal.breakdown.length >= wifeFinal.breakdown.length ? wifeFinal.breakdown : myFinal.breakdown;
        combinedBreakdown = longerBreakdown.map((row, i) => {
            const otherBalance = i < shorterBreakdown.length ? shorterBreakdown[i].balance : (shorterBreakdown.length > 0 ? shorterBreakdown[shorterBreakdown.length - 1].balance : 0);
            return { ...row, balance: row.balance + otherBalance };
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

    const drawdownSchedule = calculateDrawdownSchedule(
        finalBalance,
        targetAge,
        drawdownAnnualAmount,
        drawdownReturn
    );

    return { results, breakdown: combinedBreakdown, drawdownSchedule, error: undefined };
}