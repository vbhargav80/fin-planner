
import React from 'react';
import type {AmortizationCalculatorState} from '../../types/amortization.types';
import { formatCurrency } from '../../utils/formatters';

interface AmortizationTableProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ calculator }) => {
    const { amortizationData, considerOffsetIncome } = calculator;

    return (
        <div className="md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Amortization Schedule
            </h3>
            <div className="bg-indigo-800 rounded-lg shadow-inner overflow-hidden flex-grow">
                <div className="overflow-x-auto h-full">
                    <table className="min-w-full text-left">
                        <thead className="bg-indigo-900 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Beginning Balance
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Repayment
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Net Rental
                            </th>
                            {considerOffsetIncome && (
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                    Offset Income
                                </th>
                            )}
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Total Incoming
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Total Outgoing
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Total Shortfall
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Ending Balance
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Offset Balance
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-indigo-800 divide-y divide-indigo-700">
                        {amortizationData.map((row, index) => (
                            <tr
                                key={index}
                                className={`transition-colors duration-200 ${
                                    row.offsetBalance <= 0
                                        ? 'bg-red-900 hover:bg-red-700'
                                        : 'hover:bg-indigo-700/50'
                                }`}
                            >
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                    {row.date}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-200 font-mono">
                                    {formatCurrency(row.beginningBalance)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-300 font-mono">
                                    {formatCurrency(row.repayment)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-300 font-mono">
                                    {formatCurrency(row.rentalIncome)}
                                </td>
                                {considerOffsetIncome && (
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-300 font-mono">
                                        {formatCurrency(row.offsetIncome)}
                                    </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-green-300 font-medium font-mono">
                                    {formatCurrency(row.totalIncoming)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-300 font-mono">
                                    {formatCurrency(row.totalOutgoing)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium font-mono ${
                                    row.totalShortfall < 0 ? 'text-red-300' : 'text-green-300'
                                }`}>
                                    {formatCurrency(row.totalShortfall)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white font-mono">
                                    {formatCurrency(row.endingBalance)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-100 font-medium font-mono">
                                    {formatCurrency(row.offsetBalance)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
};