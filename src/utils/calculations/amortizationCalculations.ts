import type { AmortizationRow, AmortizationInputs } from '../../types/amortization.types';
import { formatDate } from '../formatters';

const LOAN_DETAILS = {
    startDate: new Date('2031-01-01T12:00:00Z'),
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

export function calculateAmortizationSchedule(
    inputs: AmortizationInputs,
    actualMonthlyRepayment: number
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

    while (currentDate <= LOAN_DETAILS.endDate) {
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
            repaymentForMonth = Math.min(actualMonthlyRepayment, beginningBalance + interestCharged);
            const principalPaid = repaymentForMonth - interestCharged;
            endingBalance = beginningBalance - principalPaid;
        }

        const workingIncome = (inputs.continueWorking && currentDate < workingEndDate) ? inputs.netIncome : 0;
        const totalIncoming = currentMonthlyRental + workingIncome + offsetIncome;
        const totalOutgoing = repaymentForMonth + inputs.monthlyExpenditure;
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
    }

    return data;
}