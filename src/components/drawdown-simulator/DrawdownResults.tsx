// File: 'src/components/drawdown-simulator/DrawdownResults.tsx'
// Only the wrapper div className changed to be full-width on mobile
import React from 'react';
import type { DrawdownRow } from '../../types/drawdown.types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
    netProceeds: number;
    durationLabel: string;
    person1Tax: number;
    person2Tax: number;
    schedule: DrawdownRow[];
}

const Pill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="rounded-lg bg-indigo-600 border border-indigo-500 px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="text-sm text-indigo-100">{label}</span>
        <span className="text-base font-semibold text-white">{value}</span>
    </div>
);

export const DrawdownResults: React.FC<Props> = ({
                                                     netProceeds,
                                                     durationLabel,
                                                     person1Tax,
                                                     person2Tax,
                                                     schedule,
                                                 }) => {
    return (
        <div className="w-full md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Monthly Drawdown Results</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <Pill label="Net Proceeds" value={formatCurrency(netProceeds)} />
                <Pill label="How long funds will last" value={durationLabel} />
                <Pill label="Person 1 Tax Payable" value={formatCurrency(person1Tax)} />
                <Pill label="Person 2 Tax Payable" value={formatCurrency(person2Tax)} />
            </div>

            <div className="bg-indigo-800 rounded-lg shadow-inner overflow-hidden flex-grow">
                <div className="overflow-x-auto h-full">
                    <table className="min-w-full text-left">
                        <thead className="bg-indigo-900 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Month
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Starting Balance
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Interest Earned
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Drawdown
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Ending Balance
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Monthly Rent Lost
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-indigo-800 divide-y divide-indigo-700">
                        {schedule.map((row, idx) => (
                            <tr
                                key={idx}
                                className={`transition-colors duration-200 ${
                                    row.endBalance <= 0
                                        ? 'bg-red-900 hover:bg-red-700'
                                        : 'hover:bg-indigo-700/50'
                                }`}
                            >
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                    {row.dateLabel}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-200 font-mono">
                                    {formatCurrency(row.startBalance)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-300 font-mono">
                                    {formatCurrency(row.interestEarned)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-300 font-mono">
                                    {formatCurrency(row.drawdown)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white font-mono">
                                    {formatCurrency(row.endBalance)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-emerald-300 font-mono">
                                    {formatCurrency(row.rentLost)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
