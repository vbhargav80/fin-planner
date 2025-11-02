// File: `src/utils/calculations/amortizationCalculations.ts`
import type { AmortizationRow, AmortizationInputs } from '../../types/amortization.types';
import { formatDate } from '../formatters';

const LOAN_DETAILS = {
    startDate: new Date('2026-01-01T12:00:00Z'),
    endDate: new Date('2040-12-01T12:00:00Z'),
};

export function calculateMonthlyRepayment(
    principal: number,
    interestRate: number
): number {
    if (principal <= 0) return 0;

    const monthlyInterestRate = interestRate / 100 / 12;
    if (monthlyInterestRate <= 0) {
        return principal / (25 * 12);
    }

    const n = 25 * 12; // 300 payments for a 25-year term
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, n);
    const denominator = Math.pow(1 + monthlyInterestRate, n) - 1;
    return principal * (numerator / denominator);
}

// Helper: compute the fixed refinance repayment from the Dec 2030 ending balance
export function calculateRefiMonthlyPayment(inputs: AmortizationInputs): number {
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const annualRentalGrowthDecimal = inputs.rentalGrowthRate / 100;
    const monthlyOffsetIncomeRate = inputs.offsetIncomeRate / 100 / 12;

    let currentLoanBalance = inputs.principal;
    let currentOffsetBalance = inputs.initialOffsetBalance;
    let currentMonthlyRental = inputs.initialRentalIncome;

    const currentDate = new Date(LOAN_DETAILS.startDate);
    const workingEndDate = new Date(LOAN_DETAILS.startDate);
    workingEndDate.setFullYear(workingEndDate.getFullYear() + inputs.yearsWorking);

    // Process months up to and including Dec 2030 (robust to time-of-day)
    while (currentDate.getFullYear() < 2031) {
        // Apply annual rental growth at the start of each year
        if (currentDate.getMonth() === 0 && currentDate.getFullYear() > LOAN_DETAILS.startDate.getFullYear()) {
            currentMonthlyRental *= (1 + annualRentalGrowthDecimal);
        }

        const beginningBalance = currentLoanBalance;
        let repaymentForMonth = 0;
        let endingBalance = beginningBalance;

        const excessOffset = Math.max(0, currentOffsetBalance - beginningBalance);
        const offsetIncome = inputs.considerOffsetIncome ? excessOffset * monthlyOffsetIncomeRate : 0;

        if (beginningBalance > 0) {
            const effectiveBalanceForInterest = Math.max(0, beginningBalance - currentOffsetBalance);
            const interestCharged = effectiveBalanceForInterest * monthlyInterestRate;

            // Up to Dec 2030; use user-provided repayment
            const targetMonthlyRepayment = inputs.monthlyRepayment;

            repaymentForMonth = Math.min(targetMonthlyRepayment, beginningBalance + interestCharged);
            const principalPaid = repaymentForMonth - interestCharged;
            endingBalance = beginningBalance - principalPaid;
        }

        const isPre2031 = currentDate.getFullYear() < 2031;
        const workingIncome = (inputs.continueWorking && currentDate < workingEndDate) ? inputs.netIncome : 0;
        const monthlyExpenditureForMonth = isPre2031 ? inputs.monthlyExpenditurePre2031 : inputs.monthlyExpenditure;
        const totalIncoming = currentMonthlyRental + workingIncome + offsetIncome;
        const totalOutgoing = repaymentForMonth + monthlyExpenditureForMonth;
        const newOffsetBalance = currentOffsetBalance + totalIncoming - totalOutgoing;

        currentLoanBalance = Math.max(0, endingBalance);
        currentOffsetBalance = newOffsetBalance;

        // next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const dec2030EndingBalance = Math.max(0, currentLoanBalance);
    return calculateMonthlyRepayment(dec2030EndingBalance, inputs.interestRate);
}

export function calculateAmortizationSchedule(
    inputs: AmortizationInputs
): AmortizationRow[] {
    const data: AmortizationRow[] = [];
    let currentLoanBalance = inputs.principal;
    let currentOffsetBalance = inputs.initialOffsetBalance;
    let currentMonthlyRental = inputs.initialRentalIncome;

    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const annualRentalGrowthDecimal = inputs.rentalGrowthRate / 100;
    const monthlyOffsetIncomeRate = inputs.offsetIncomeRate / 100 / 12;
    const currentDate = new Date(LOAN_DETAILS.startDate);

    const workingEndDate = new Date(LOAN_DETAILS.startDate);
    workingEndDate.setFullYear(workingEndDate.getFullYear() + inputs.yearsWorking);

    const pre2031Cutoff = new Date('2031-01-01T00:00:00Z');
    const refinanceEffectiveDate = new Date('2031-01-01T00:00:00Z');

    let refiMonthlyPayment: number | null = null;

    while (currentDate <= LOAN_DETAILS.endDate) {
        if (currentDate.getMonth() === 0 && currentDate.getFullYear() > LOAN_DETAILS.startDate.getFullYear()) {
            currentMonthlyRental *= (1 + annualRentalGrowthDecimal);
        }

        const beginningBalance = currentLoanBalance;

        let repaymentForMonth = 0;
        let endingBalance = beginningBalance;

        const excessOffset = Math.max(0, currentOffsetBalance - beginningBalance);
        const offsetIncome = inputs.considerOffsetIncome ? excessOffset * monthlyOffsetIncomeRate : 0;

        if (beginningBalance > 0) {
            const effectiveBalanceForInterest = Math.max(0, beginningBalance - currentOffsetBalance);
            const interestCharged = effectiveBalanceForInterest * monthlyInterestRate;

            let targetMonthlyRepayment = inputs.monthlyRepayment;
            if (inputs.isRefinanced && currentDate >= refinanceEffectiveDate) {
                targetMonthlyRepayment = refiMonthlyPayment ?? calculateMonthlyRepayment(beginningBalance, inputs.interestRate);
            }

            repaymentForMonth = Math.min(targetMonthlyRepayment, beginningBalance + interestCharged);
            const principalPaid = repaymentForMonth - interestCharged;
            endingBalance = beginningBalance - principalPaid;
        }

        if (inputs.isRefinanced &&
            currentDate.getFullYear() === 2030 &&
            currentDate.getMonth() === 11 /* Dec */) {
            const refiPrincipal = Math.max(0, endingBalance);
            refiMonthlyPayment = calculateMonthlyRepayment(refiPrincipal, inputs.interestRate);
        }

        const workingIncome = (inputs.continueWorking && currentDate < workingEndDate) ? inputs.netIncome : 0;
        const monthlyExpenditureForMonth = currentDate < pre2031Cutoff ? inputs.monthlyExpenditurePre2031 : inputs.monthlyExpenditure;
        const totalIncoming = currentMonthlyRental + workingIncome + offsetIncome;
        const totalOutgoing = repaymentForMonth + monthlyExpenditureForMonth;
        const newOffsetBalance = currentOffsetBalance + totalIncoming - totalOutgoing;
        const totalShortfall = totalIncoming - totalOutgoing;

        data.push({
            date: formatDate(currentDate),
            beginningBalance,
            repayment: repaymentForMonth,
            rentalIncome: currentMonthlyRental,
            offsetIncome,
            totalIncoming,
            totalOutgoing,
            totalShortfall,
            endingBalance: Math.max(0, endingBalance),
            offsetBalance: newOffsetBalance,
        });

        currentLoanBalance = Math.max(0, endingBalance);
        currentOffsetBalance = newOffsetBalance;
        currentDate.setMonth(currentDate.getMonth() + 1);

        if (inputs.isRefinanced && currentDate >= refinanceEffectiveDate && refiMonthlyPayment === null) {
            refiMonthlyPayment = calculateMonthlyRepayment(currentLoanBalance, inputs.interestRate);
        }
    }

    return data;
}
