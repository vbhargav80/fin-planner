import { useMemo } from 'react';
import { useBudgetPlanner } from './useBudgetPlanner';
import { useAmortizationCalculator } from './useAmortizationCalculator';
import { useSuperCalculator } from './useSuperCalculator';

export function useDashboardMetrics() {
    const { remaining: monthlySurplus } = useBudgetPlanner();
    const { results: superResults } = useSuperCalculator();
    const { amortizationData } = useAmortizationCalculator();

    return useMemo(() => {
        // Amortization Metrics
        const finalLoanDate = amortizationData.find(row => row.endingBalance <= 0)?.date || 'Never';
        const currentLoanBalance = amortizationData.length > 0 ? amortizationData[0].beginningBalance : 0;

        // Super Metrics
        const projectedSuper = superResults?.finalBalance || 0;
        const superGoal = superResults?.target || 0;
        const isSuperGoalMet = projectedSuper >= superGoal;

        return {
            monthlySurplus,
            finalLoanDate,
            currentLoanBalance,
            projectedSuper,
            superGoal,
            isSuperGoalMet
        };
    }, [monthlySurplus, superResults, amortizationData]);
}