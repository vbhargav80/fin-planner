import React from 'react';
import { Wallet, Landmark, PiggyBank, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import type { CalculatorId } from '../../types/common.types';
import { formatCurrency } from '../../utils/formatters';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import { DashboardCard } from './DashboardCard';
import { SmartInsights } from './SmartInsights';

interface DashboardProps {
    onNavigate: (id: CalculatorId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const {
        monthlySurplus,
        finalLoanDate,
        currentLoanBalance,
        projectedSuper,
        superGoal,
        isSuperGoalMet
    } = useDashboardMetrics();

    const handleGlobalReset = () => {
        if (window.confirm("This will wipe all your saved data across ALL calculators and reset them to defaults. Are you sure?")) {
            // 1. Clear all known storage keys
            // We clear both v1 and v2 keys to be safe against version changes
            const keysToClear = [
                'amortization-v1',
                'super-v1',
                'super-v2',
                'drawdown-v1',
                'budget-v1'
            ];

            keysToClear.forEach(key => localStorage.removeItem(key));

            // 2. Force reload to reset application state
            window.location.reload();
        }
    };

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in flex flex-col min-h-full">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
                <p className="text-gray-500 mt-1">Your holistic wealth overview</p>
            </div>

            {/* High Level Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <DashboardCard
                    title="Monthly Surplus"
                    value={formatCurrency(monthlySurplus)}
                    subValue={
                        monthlySurplus < 0 ? (
                            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                Deficit Detected
                            </span>
                        ) : null
                    }
                    icon={Wallet}
                    iconColorClass="bg-emerald-100 text-emerald-600"
                    onClick={() => onNavigate('budget')}
                    footer="Available for investing or debt repayment"
                />

                <DashboardCard
                    title="Debt Free By"
                    value={finalLoanDate}
                    icon={Landmark}
                    iconColorClass="bg-blue-100 text-blue-600"
                    onClick={() => onNavigate('homeLoan')}
                    footer={`Current Balance: ${formatCurrency(currentLoanBalance)}`}
                />

                <DashboardCard
                    title="Projected Super"
                    value={formatCurrency(projectedSuper)}
                    subValue={
                        <div className="flex items-center gap-1">
                            {isSuperGoalMet ? (
                                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> On Track
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-orange-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> Shortfall
                                </span>
                            )}
                            <span className="text-xs text-gray-400 ml-1">vs Goal {formatCurrency(superGoal)}</span>
                        </div>
                    }
                    icon={PiggyBank}
                    iconColorClass="bg-purple-100 text-purple-600"
                    onClick={() => onNavigate('super')}
                />
            </div>

            {/* Insights Section */}
            <SmartInsights monthlySurplus={monthlySurplus} />

            {/* Footer Actions */}
            <div className="mt-auto pt-12 border-t border-gray-200 flex justify-end">
                <button
                    onClick={handleGlobalReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                    title="Clear all data and restart"
                >
                    <RotateCcw size={16} />
                    Reset All Data
                </button>
            </div>
        </div>
    );
};