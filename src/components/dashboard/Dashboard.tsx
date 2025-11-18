// File: src/components/dashboard/Dashboard.tsx
import React from 'react';
import { Wallet, Landmark, PiggyBank, CheckCircle2, AlertCircle } from 'lucide-react'; // Removed RotateCcw
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
        </div>
    );
};