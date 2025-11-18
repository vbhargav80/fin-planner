import React from 'react';
import type { DrawdownRow } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';
import { Sunset } from 'lucide-react';

interface Props {
    schedule: DrawdownRow[];
    // Removed state and dispatch props as they are no longer needed here
}

export const SuperDrawdownTable: React.FC<Props> = ({ schedule }) => {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Header Info */}
            <div>
                <h3 className="text-xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                    <Sunset className="text-orange-400" />
                    Drawdown Projection
                </h3>
                <p className="text-center text-indigo-200 mb-6 text-xs sm:text-sm">
                    Monthly spend: <strong>{schedule.length > 0 ? formatCurrency(schedule[0].drawdown) : '$0'}</strong>
                </p>

                <div className="bg-indigo-800 rounded-lg shadow-inner overflow-hidden">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-indigo-900 sticky top-0 z-10 shadow-md">
                        <tr>
                            <th className="px-2 py-2 sm:p-3 w-[15%] text-xs sm:text-sm font-semibold tracking-wider text-indigo-100 text-center">Age</th>
                            <th className="px-2 py-2 sm:p-3 w-[15%] text-xs sm:text-sm font-semibold tracking-wider text-indigo-100 text-center">Mth</th>
                            <th className="px-2 py-2 sm:p-3 w-[35%] text-xs sm:text-sm font-semibold tracking-wider text-right text-indigo-100">Balance</th>
                            <th className="px-2 py-2 sm:p-3 w-[35%] text-xs sm:text-sm font-semibold tracking-wider text-right text-indigo-100">Earnings</th>
                        </tr>
                        </thead>
                        <tbody className="text-indigo-200 divide-y divide-indigo-700/50">
                        {schedule.map((row, index) => (
                            <tr
                                key={index}
                                className="hover:bg-indigo-700/50 transition-colors"
                            >
                                <td className="px-2 py-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap text-center">{row.age}</td>
                                <td className="px-2 py-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap text-center">{row.month}</td>
                                <td className="px-2 py-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap text-right font-mono text-white truncate">
                                    {formatCurrency(row.endBalance)}
                                </td>
                                <td className="px-2 py-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap text-right font-mono text-emerald-300 truncate">
                                    +{formatCurrency(row.earnings)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {schedule.length === 0 && (
                        <div className="p-12 text-center text-indigo-300 italic">
                            No drawdown data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};