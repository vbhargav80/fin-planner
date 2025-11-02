import React from 'react';
import type { SuperBreakdownRow } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';

interface SuperBreakdownProps {
    breakdownData: SuperBreakdownRow[];
}

export const SuperBreakdown: React.FC<SuperBreakdownProps> = ({ breakdownData }) => {
    return (
        <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Monthly Growth
            </h3>

            {/* Allow the table to expand naturally; no fixed maxHeight or inner scroll */}
            <div className="bg-indigo-800 rounded-lg shadow-inner overflow-visible">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-indigo-900 sticky top-0">
                    <tr>
                        <th className="p-3 w-1/4 font-semibold tracking-wider">Age</th>
                        <th className="p-3 w-1/4 font-semibold tracking-wider">Month</th>
                        <th className="p-3 w-1/2 font-semibold tracking-wider text-right">Balance</th>
                    </tr>
                    </thead>
                    <tbody className="text-indigo-200">
                    {breakdownData.map((row, index) => (
                        <tr
                            key={index}
                            className="border-b border-indigo-700 last:border-b-0 hover:bg-indigo-700/50"
                        >
                            <td className="p-3 whitespace-nowrap">{row.age}</td>
                            <td className="p-3 whitespace-nowrap">{row.month}</td>
                            <td className="p-3 whitespace-nowrap text-right font-mono">
                                {formatCurrency(row.balance)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
