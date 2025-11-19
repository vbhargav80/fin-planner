import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Landmark } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { CalculatorId } from '../../types/common.types';
import { STORAGE_KEYS } from '../../constants/storageKeys';

interface Props {
    totalIncome: number;
    totalExpenses: number;
    remaining: number;
    onNavigate: (id: CalculatorId) => void;
}

export const SummaryCards: React.FC<Props> = memo(({ totalIncome, totalExpenses, remaining, onNavigate }) => {

    const handleApplyToSuper = () => {
        if (remaining <= 0) return;

        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SUPER);
            const data = stored ? JSON.parse(stored) : {};

            // Update the "Extra Contribution" in Super calculator
            // We assume this is a monthly surplus, so we annualize it
            data.myExtraYearlyContribution = Math.floor(remaining * 12);
            data.makeExtraContribution = true;
            data.contributionFrequency = 'monthly'; // Align frequency

            localStorage.setItem(STORAGE_KEYS.SUPER, JSON.stringify(data));

            // Navigate to Super calculator to see the result
            onNavigate('super');

            // Small delay to ensure state rehydration if needed, though navigation usually triggers re-render
            setTimeout(() => window.location.reload(), 50);
        } catch (e) {
            console.error("Failed to update Super", e);
        }
    };

    const handleApplyToLoan = () => {
        if (remaining <= 0) return;

        try {
            const stored = localStorage.getItem(STORAGE_KEYS.AMORTIZATION);
            const data = stored ? JSON.parse(stored) : {};

            // Option A: Add to Monthly Repayment
            // const currentRepayment = data.monthlyRepayment || 0;
            // data.monthlyRepayment = currentRepayment + remaining;

            // Option B: Set as "Net Income" for offset calculation (Cleaner for this specific calculator model)
            // If the user has "Continue Working" on, this acts as that salary.
            // But standard amortization flow is simpler: Just increase the repayment setting.
            const currentRepayment = data.monthlyRepayment || 0;
            data.monthlyRepayment = currentRepayment + remaining;

            localStorage.setItem(STORAGE_KEYS.AMORTIZATION, JSON.stringify(data));

            onNavigate('homeLoan');
            setTimeout(() => window.location.reload(), 50);
        } catch (e) {
            console.error("Failed to update Loan", e);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {/* Income */}
            <div className="bg-indigo-600 rounded-xl p-4 border border-indigo-500 shadow-sm min-w-0">
                <div className="flex items-center gap-2 text-indigo-100 mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Income</span>
                </div>
                <div
                    className="text-lg lg:text-xl xl:text-2xl font-bold text-green-300 font-mono truncate"
                    title={formatCurrency(totalIncome)}
                >
                    {formatCurrency(totalIncome)}
                </div>
            </div>

            {/* Expenses */}
            <div className="bg-indigo-600 rounded-xl p-4 border border-indigo-500 shadow-sm min-w-0">
                <div className="flex items-center gap-2 text-indigo-100 mb-1">
                    <TrendingDown size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Expenses</span>
                </div>
                <div
                    className="text-lg lg:text-xl xl:text-2xl font-bold text-red-300 font-mono truncate"
                    title={formatCurrency(totalExpenses)}
                >
                    {formatCurrency(totalExpenses)}
                </div>
            </div>

            {/* Net Result with Actions */}
            <div className={`rounded-xl p-4 border shadow-sm backdrop-blur-sm min-w-0 relative group overflow-hidden ${
                remaining >= 0
                    ? 'bg-emerald-900/50 border-emerald-700/50'
                    : 'bg-red-900/80 border-red-700/50'
            }`}>
                <div className={`flex items-center gap-2 mb-1 ${
                    remaining >= 0 ? 'text-emerald-200' : 'text-red-200'
                }`}>
                    <Wallet size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Net Result</span>
                </div>
                <div
                    className="text-lg lg:text-xl xl:text-2xl font-bold font-mono text-white truncate"
                    title={formatCurrency(remaining)}
                >
                    {formatCurrency(remaining)}
                </div>

                {/* Hover Actions: Only show if there is a surplus to invest */}
                {remaining > 0 && (
                    <div className="absolute inset-0 bg-emerald-900/95 flex items-center justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2">
                        <button
                            onClick={handleApplyToSuper}
                            className="flex flex-col items-center justify-center text-emerald-100 hover:text-white hover:scale-110 transition-all"
                            title="Apply surplus to Super Calculator"
                        >
                            <div className="p-2 bg-emerald-800 rounded-full mb-1 shadow-sm"><PiggyBank size={18} /></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Boost Super</span>
                        </button>
                        <div className="w-px h-8 bg-emerald-700/50"></div>
                        <button
                            onClick={handleApplyToLoan}
                            className="flex flex-col items-center justify-center text-emerald-100 hover:text-white hover:scale-110 transition-all"
                            title="Apply surplus to Amortization Calculator"
                        >
                            <div className="p-2 bg-emerald-800 rounded-full mb-1 shadow-sm"><Landmark size={18} /></div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Pay Loan</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});