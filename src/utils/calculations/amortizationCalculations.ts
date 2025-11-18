import type { AmortizationRow, State as AmortizationInputs } from '../../types/amortization.types';
import { formatDate } from '../formatters';

const LOAN_START_DATE = new Date('2026-01-01T12:00:00Z');
const LOAN_END_DATE = new Date('2040-12-01T12:00:00Z');

export function calculateMonthlyRepayment(
    principal: number,
    interestRate: number
): number {
    if (principal <= 0) return 0;
    const monthlyInterestRate = interestRate / 100 / 12;
    if (monthlyInterestRate <= 0) return principal / (25 * 12);

    const n = 25 * 12;
    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, n);
    const denominator = Math.pow(1 + monthlyInterestRate, n) - 1;
    return principal * (numerator / denominator);
}

function parseMonthString(monthStr: string): Date {
    const [y, m] = monthStr.split('-').map(Number);
    // Create date at 12:00 UTC to match LOAN_START_DATE conventions
    return new Date(Date.UTC(y || 2031, (m || 1) - 1, 1, 12, 0, 0));
}

export function calculateAmortizationSchedule(
    inputs: AmortizationInputs
): { schedule: AmortizationRow[], actualMonthlyRepayment: number } {
    const data: AmortizationRow[] = [];
    let currentLoanBalance = inputs.principal;
    let currentOffsetBalance = inputs.initialOffsetBalance;
    let currentMonthlyRental = inputs.initialRentalIncome;

    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const annualRentalGrowthDecimal = inputs.rentalGrowthRate / 100;
    const monthlyOffsetIncomeRate = inputs.offsetIncomeRate / 100 / 12;

    const currentDate = new Date(LOAN_START_DATE);
    const retirementDate = parseMonthString(inputs.retirementDate);

    // Calculate the "Transition End" date
    const transitionEndDate = new Date(retirementDate);
    if (inputs.continueWorking) {
        transitionEndDate.setFullYear(transitionEndDate.getFullYear() + inputs.yearsWorking);
    }

    let refiMonthlyPayment: number | null = null;

    while (currentDate <= LOAN_END_DATE) {
        // Annual Rent Increase
        if (currentDate.getUTCMonth() === 0 && currentDate.getUTCFullYear() > LOAN_START_DATE.getUTCFullYear()) {
            currentMonthlyRental *= (1 + annualRentalGrowthDecimal);
        }

        // --- 1. DETERMINE PHASE ---
        const isCareerPhase = currentDate < retirementDate;
        // Transition Phase: After retirement date, but before extra work ends
        const isTransitionPhase = currentDate >= retirementDate && currentDate < transitionEndDate;

        const isWorking = isCareerPhase || isTransitionPhase;

        // --- 2. INCOME ---
        let salaryIncome = 0;
        if (isCareerPhase) {
            salaryIncome = inputs.monthlySalary; // Phase 1: Full Career
        } else if (isTransitionPhase && inputs.continueWorking) {
            salaryIncome = inputs.transitionalSalary; // Phase 2: Transition Salary
        }

        const excessOffset = Math.max(0, currentOffsetBalance - currentLoanBalance);
        const offsetIncome = inputs.considerOffsetIncome ? excessOffset * monthlyOffsetIncomeRate : 0;

        const totalIncoming = currentMonthlyRental + salaryIncome + offsetIncome;

        // --- 3. EXPENSES ---
        const currentExpenditure = isWorking
            ? inputs.currentLivingExpenses
            : inputs.retirementLivingExpenses;

        // --- 4. LOAN REPAYMENT ---
        let repaymentForMonth = 0;
        let endingBalance = currentLoanBalance;

        if (currentLoanBalance > 0) {
            const effectiveBalanceForInterest = Math.max(0, currentLoanBalance - currentOffsetBalance);
            const interestCharged = effectiveBalanceForInterest * monthlyInterestRate;

            let targetMonthlyRepayment = inputs.monthlyRepayment;

            // Refinance Logic: Triggers on PLANNED retirement date
            if (inputs.isRefinanced && !isCareerPhase) {
                if (refiMonthlyPayment === null) {
                    refiMonthlyPayment = calculateMonthlyRepayment(currentLoanBalance, inputs.interestRate);
                }
                targetMonthlyRepayment = refiMonthlyPayment;
            }

            repaymentForMonth = Math.min(targetMonthlyRepayment, currentLoanBalance + interestCharged);
            const principalPaid = repaymentForMonth - interestCharged;
            endingBalance = currentLoanBalance - principalPaid;
        }

        // --- 5. NET RESULT ---
        const totalOutgoing = repaymentForMonth + currentExpenditure;
        const newOffsetBalance = currentOffsetBalance + totalIncoming - totalOutgoing;
        const totalShortfall = totalIncoming - totalOutgoing;

        // Robust Date Comparison (Year & Month only)
        const isRetirementRow =
            currentDate.getUTCFullYear() === retirementDate.getUTCFullYear() &&
            currentDate.getUTCMonth() === retirementDate.getUTCMonth();

        data.push({
            date: formatDate(currentDate),
            beginningBalance: currentLoanBalance,
            repayment: repaymentForMonth,
            rentalIncome: currentMonthlyRental,
            offsetIncome,
            totalIncoming,
            totalOutgoing,
            totalShortfall,
            endingBalance: Math.max(0, endingBalance),
            offsetBalance: newOffsetBalance,
            isRetirementRow // Correctly flagged now
        });

        currentLoanBalance = Math.max(0, endingBalance);
        currentOffsetBalance = newOffsetBalance;

        // Safe Month Increment (UTC)
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
    }

    let finalRepayment = inputs.monthlyRepayment;
    if (inputs.isRefinanced && refiMonthlyPayment !== null) {
        finalRepayment = refiMonthlyPayment;
    }

    return { schedule: data, actualMonthlyRepayment: finalRepayment };
}