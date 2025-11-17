// File: src/components/super/SuperDrawdownTable.tsx
import React from 'react';
import type { DrawdownRow } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
    schedule: DrawdownRow[];
}

export const SuperDrawdownTable: React.FC<Props> = ({ schedule }) => {
    return (
        <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Retirement Drawdown Projection
            </h3>
            <p className="text-center text-indigo-200 mb-6 text-sm">
                Assuming monthly drawdown of {schedule.length > 0 ? formatCurrency(schedule[0].drawdown) : '$0'}
            </p>

            <div className="bg-indigo-800 rounded-lg shadow-inner overflow-visible">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-indigo-900 sticky top-0 z-10">
                    <tr>
                        <th className="p-3 w-20 font-semibold tracking-wider">Age</th>
                        <th className="p-3 w-20 font-semibold tracking-wider">Month</th>
                        <th className="p-3 w-1/3 font-semibold tracking-wider text-right">Balance</th>
                        <th className="p-3 w-1/3 font-semibold tracking-wider text-right">Earnings</th>
                    </tr>
                    </thead>
                    <tbody className="text-indigo-200">
                    {schedule.map((row, index) => (
                        <tr
                            key={index}
                            className="border-b border-indigo-700 last:border-b-0 hover:bg-indigo-700/50"
                        >
                            <td className="p-3 whitespace-nowrap">{row.age}</td>
                            <td className="p-3 whitespace-nowrap">{row.month}</td>
                            <td className="p-3 whitespace-nowrap text-right font-mono">
                                {formatCurrency(row.endBalance)}
                            </td>
                            <td className="p-3 whitespace-nowrap text-right font-mono text-sm text-indigo-300">
                                +{formatCurrency(row.earnings)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {schedule.length === 0 && (
                    <div className="p-8 text-center text-indigo-300">
                        No drawdown data available.
                    </div>
                )}
            </div>
        </div>
    );
};