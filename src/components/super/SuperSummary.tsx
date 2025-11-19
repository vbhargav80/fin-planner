import React from 'react';
import type { SuperResultData, DrawdownRow } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, Sunset, CheckCircle2, AlertCircle } from 'lucide-react';

interface SuperSummaryProps {
    results: SuperResultData;
    drawdownSchedule: DrawdownRow[];
}

export const SuperSummary: React.FC<SuperSummaryProps> = ({ results, drawdownSchedule }) => {
    // Calculate Longevity
    const lastRow = drawdownSchedule[drawdownSchedule.length - 1];
    const runOutAge = lastRow ? lastRow.age : results.years + results.start;
    const runsOut = lastRow && lastRow.endBalance <= 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 animate-fade-in">

            {/* CARD 1: ACCUMULATION RESULT */}
            <div className="bg-indigo-600 rounded-xl p-5 border border-indigo-500 shadow-md">
                <div className="flex items-center gap-2 text-indigo-200 mb-2">
                    <TrendingUp size={20} />
                    <h4 className="text-sm font-bold uppercase tracking-wider">
                        {results.calcMode === 'balance' ? 'Projected Nest Egg' : 'Required Contribution'}
                    </h4>
                </div>

                {results.calcMode === 'balance' ? (
                    <div>
                        <div className="text-3xl lg:text-4xl font-bold text-white font-mono mb-1">
                            {formatCurrency(results.finalBalance)}
                        </div>
                        {/* FIX: Use targetAge instead of calculation */}
                        <div className="text-xs text-indigo-300">
                            at age {results.targetAge}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="text-3xl lg:text-4xl font-bold text-white font-mono mb-1">
                            {formatCurrency(results.pmt)}
                        </div>
                        <div className="text-xs text-indigo-300">
                            combined total / month
                        </div>
                    </div>
                )}
            </div>

            {/* CARD 2: RETIREMENT RESULT */}
            <div className={`rounded-xl p-5 border shadow-md ${
                runsOut ? 'bg-indigo-800 border-orange-500/50' : 'bg-indigo-800 border-emerald-500/50'
            }`}>
                <div className="flex items-center gap-2 text-indigo-200 mb-2">
                    <Sunset size={20} className="text-orange-400" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Longevity</h4>
                </div>

                <div className="flex items-baseline gap-2">
                    <div className={`text-3xl lg:text-4xl font-bold font-mono ${runsOut ? 'text-orange-300' : 'text-emerald-300'}`}>
                        Age {runOutAge}
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs">
                    {runsOut ? (
                        <span className="text-orange-300 flex items-center gap-1 bg-orange-900/30 px-2 py-1 rounded">
                            <AlertCircle size={12} /> Depletes fully
                        </span>
                    ) : (
                        <span className="text-emerald-300 flex items-center gap-1 bg-emerald-900/30 px-2 py-1 rounded">
                            <CheckCircle2 size={12} /> Lasts forever
                        </span>
                    )}
                    <span className="text-indigo-400">
                        assuming {formatCurrency(drawdownSchedule[0]?.drawdown || 0)}/yr
                    </span>
                </div>
            </div>
        </div>
    );
};