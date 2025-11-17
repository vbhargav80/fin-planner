import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface Props {
    monthlySurplus: number;
}

export const SmartInsights: React.FC<Props> = ({ monthlySurplus }) => {
    return (
        <div className="bg-indigo-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-lg">
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="text-indigo-400" />
                    Smart Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <h4 className="font-medium text-indigo-200 text-lg">Budget to Super Strategy</h4>
                        <p className="text-sm text-indigo-100/80 leading-relaxed">
                            You have a monthly surplus of <strong className="text-white">{formatCurrency(monthlySurplus)}</strong>.
                            Directing this into Super as a concessional contribution could significantly boost your retirement
                            balance due to the tax advantages (15% vs marginal rate).
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium text-indigo-200 text-lg">Loan Repayment Power</h4>
                        <p className="text-sm text-indigo-100/80 leading-relaxed">
                            Alternatively, adding <strong className="text-white">{formatCurrency(monthlySurplus)}</strong> to your
                            mortgage offset account could reduce your loan term by years and save a substantial amount
                            in interest payments.
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-600 rounded-full opacity-30 blur-3xl"></div>
        </div>
    );
};