// File: src/components/super/SuperDrawdownTable.tsx
import React from 'react';
import type { DrawdownRow } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';
import { Sunset } from 'lucide-react';

interface Props {
    schedule: DrawdownRow[];
}

export const SuperDrawdownTable: React.FC<Props> = ({ schedule }) => {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Header Info - Cleaned up */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                    <Sunset className="text-orange-400" />
                    Retirement Drawdown
                </h3>
                <p className="text-center text-indigo-200 mb-6 text-sm">
                    Projection based on your <strong>Retirement Phase</strong> settings.
                </p>

                <div className="bg-indigo-800 rounded-lg shadow-inner overflow-visible">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-indigo-900 sticky top-0 z-10 shadow-md">
                        <tr>
                            <th className="p-3 w-20 font-semibold tracking-wider text-indigo-100">Age</th>
                            <th className="p-3 w-20 font-semibold tracking-wider text-indigo-100">Month</th>
                            <th className="p-3 w-1/3 font-semibold tracking-wider text-right text-indigo-100">Balance</th>
                            <th className="p-3 w-1/3 font-semibold tracking-wider text-right text-indigo-100">Earnings</th>
                        </tr>
                        </thead>
                        <tbody className="text-indigo-200 divide-y divide-indigo-700/50">
                        {schedule.map((row, index) => (
                            <tr
                                key={index}
                                className="hover:bg-indigo-700/50 transition-colors"
                            >
                                <td className="p-3 whitespace-nowrap">{row.age}</td>
                                <td className="p-3 whitespace-nowrap">{row.month}</td>
                                <td className="p-3 whitespace-nowrap text-right font-mono text-white">
                                    {formatCurrency(row.endBalance)}
                                </td>
                                <td className="p-3 whitespace-nowrap text-right font-mono text-sm text-emerald-300">
                                    +{formatCurrency(row.earnings)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {schedule.length === 0 && (
                        <div className="p-12 text-center text-indigo-300 italic">
                            No drawdown data available. Check your Target Age and Balance.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};