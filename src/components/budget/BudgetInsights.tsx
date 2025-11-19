import React, { useMemo } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { ExpenseCategory } from '../../types/budget.types';

interface Props {
    totalIncome: number;
    surplus: number;
    categories: ExpenseCategory[];
}

export const BudgetInsights: React.FC<Props> = ({ totalIncome, surplus, categories }) => {
    const metrics = useMemo(() => {
        // 1. Find Housing Costs (Include both Primary and Investment property costs)
        const housingCategories = categories.filter(c => {
            const name = c.name.toLowerCase();
            return name.includes('housing') || name.includes('investment property');
        });

        const housingCost = housingCategories.reduce((total, cat) => {
            return total + cat.items.reduce((sum, item) => sum + item.amount, 0);
        }, 0);

        const housingRatio = totalIncome > 0 ? (housingCost / totalIncome) * 100 : 0;
        // Common rule: Housing stress is often defined as > 30% of pre-tax income,
        // but here we are likely using net income, so 30-35% is a reasonable warning threshold.
        const isHousingStress = housingRatio > 35;

        // 2. Calculate Savings Rate
        const savingsRatio = totalIncome > 0 ? (surplus / totalIncome) * 100 : 0;
        const isGoodSavings = savingsRatio >= 20;

        return { housingCost, housingRatio, isHousingStress, savingsRatio, isGoodSavings };
    }, [totalIncome, categories, surplus]);

    if (totalIncome === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in">

            {/* Insight 1: Savings Power */}
            <div className={`rounded-xl p-4 border ${metrics.isGoodSavings ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-indigo-800 border-indigo-600'}`}>
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${metrics.isGoodSavings ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                        {metrics.isGoodSavings ? <TrendingUp size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Savings Rate</h4>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className={`text-2xl font-bold ${metrics.isGoodSavings ? 'text-emerald-300' : 'text-white'}`}>
                                {metrics.savingsRatio.toFixed(1)}%
                            </span>
                            <span className="text-xs text-indigo-300">of income</span>
                        </div>
                        <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
                            {metrics.isGoodSavings
                                ? "Great job! You are saving more than 20% of your income."
                                : "Try to aim for a 20% savings rate to build wealth faster."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Insight 2: Housing Stress */}
            <div className={`rounded-xl p-4 border ${metrics.isHousingStress ? 'bg-orange-900/30 border-orange-500/30' : 'bg-indigo-800 border-indigo-600'}`}>
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${metrics.isHousingStress ? 'bg-orange-500/20 text-orange-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                        {metrics.isHousingStress ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Housing Stress</h4>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className={`text-2xl font-bold ${metrics.isHousingStress ? 'text-orange-300' : 'text-white'}`}>
                                {metrics.housingRatio.toFixed(1)}%
                            </span>
                            <span className="text-xs text-indigo-300">of income</span>
                        </div>
                        <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
                            {metrics.isHousingStress
                                ? `Your total property costs (${formatCurrency(metrics.housingCost)}) are consuming a significant portion of your income.`
                                : "Your total housing costs are within a healthy range."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};