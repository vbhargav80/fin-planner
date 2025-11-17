import React from 'react';
import { useBudgetPlanner } from '../../hooks/useBudgetPlanner';
import { useAmortizationCalculator } from '../../hooks/useAmortizationCalculator';
import { useSuperCalculator } from '../../hooks/useSuperCalculator';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Landmark, Wallet, PiggyBank, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type { CalculatorId } from '../../types/common.types';

interface DashboardProps {
    onNavigate: (id: CalculatorId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    // 1. Pull data from all hooks
    const { remaining: monthlySurplus } = useBudgetPlanner();
    const { results: superResults } = useSuperCalculator();
    const { amortizationData } = useAmortizationCalculator();

    // 2. Calculate Key Metrics

    // Amortization
    const finalLoanDate = amortizationData.find(row => row.endingBalance <= 0)?.date || 'Never';
    const currentLoanBalance = amortizationData.length > 0 ? amortizationData[0].beginningBalance : 0;

    // Super
    const projectedSuper = superResults?.finalBalance || 0;
    const superGoal = superResults?.target || 0;
    const isSuperGoalMet = projectedSuper >= superGoal;

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
                    <p className="text-gray-500 mt-1">Your holistic wealth overview</p>
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Budget Card */}
                <div
                    onClick={() => onNavigate('budget')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Wallet size={24} />
                        </div>
                        <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Monthly Surplus</p>
                    <h3 className={`text-3xl font-bold mt-1 ${monthlySurplus >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {formatCurrency(monthlySurplus)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">Available for investing or debt repayment</p>
                </div>

                {/* Loan Card */}
                <div
                    onClick={() => onNavigate('homeLoan')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Landmark size={24} />
                        </div>
                        <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Debt Free By</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{finalLoanDate}</h3>
                    <p className="text-xs text-gray-400 mt-2">Current Balance: {formatCurrency(currentLoanBalance)}</p>
                </div>

                {/* Super Card */}
                <div
                    onClick={() => onNavigate('super')}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <PiggyBank size={24} />
                        </div>
                        <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Projected Super</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(projectedSuper)}</h3>
                    <div className="flex items-center gap-1 mt-2">
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
                </div>
            </div>

            {/* Insights / Actions Area */}
            <div className="bg-indigo-900 text-white rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="text-indigo-400" />
                        Smart Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-medium text-indigo-200 mb-2">Budget to Super Strategy</h4>
                            <p className="text-sm text-indigo-100/80 leading-relaxed">
                                You have a monthly surplus of <strong>{formatCurrency(monthlySurplus)}</strong>.
                                If you directed this entire amount into your Super as a concessional contribution,
                                your projected balance could grow significantly faster due to the lower 15% tax rate environment.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-indigo-200 mb-2">Loan Repayment Power</h4>
                            <p className="text-sm text-indigo-100/80 leading-relaxed">
                                Alternatively, adding <strong>{formatCurrency(monthlySurplus)}</strong> to your
                                monthly mortgage repayments (or offset) could shave years off your loan term
                                and save thousands in interest. Use the Amortization calculator to test this scenario.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-600 rounded-full opacity-30 blur-3xl"></div>
            </div>
        </div>
    );
};