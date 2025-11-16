
import React, {useEffect, useRef, useState} from 'react';
import type {AmortizationCalculatorState} from '../../types/amortization.types';
import { formatCurrency } from '../../utils/formatters';

interface AmortizationTableProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ calculator }) => {
    const { amortizationData, considerOffsetIncome, scrollTo2031, triggerScrollTo2031 } = calculator;
    const theadRef = useRef<HTMLTableSectionElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

    useEffect(() => {
        if (theadRef.current) {
            setHeaderHeight(theadRef.current.offsetHeight);
        }
    }, [amortizationData]);

    useEffect(() => {
        if (scrollTo2031 > 0) {
            const index = amortizationData.findIndex(row => row.date === 'Jan 2031');
            if (index !== -1 && rowRefs.current[index] && scrollContainerRef.current) {
                const rowElement = rowRefs.current[index];
                const containerElement = scrollContainerRef.current;
                if (rowElement) {
                    const targetScrollTop = rowElement.offsetTop - headerHeight;
                    containerElement.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [scrollTo2031, amortizationData, headerHeight]);

    return (
        <div className="md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col relative">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Amortization Schedule
            </h3>
            <div ref={scrollContainerRef} className="bg-indigo-800 rounded-lg shadow-inner flex-grow overflow-auto">
                <div className="overflow-x-auto h-full">
                    <table className="min-w-full text-left">
                        <thead ref={theadRef} className="bg-indigo-900 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Beginning Balance
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Ending Balance
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider">
                                Offset Balance
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
                        </tr>
                        </thead>
                        <tbody className="bg-indigo-800 divide-y divide-indigo-700">
                        {amortizationData.map((row, index) => {
                            const isStickyRow = row.date === 'Jan 2031';
                            const isNegativeOffset = row.offsetBalance <= 0;

                            const stickyClass = isStickyRow ? 'sticky' : '';
                            const bgClass = isNegativeOffset
                                ? 'bg-red-900 hover:bg-red-700'
                                : isStickyRow
                                    ? 'bg-indigo-900'
                                    : 'hover:bg-indigo-700/50';

                            const stickyStyles = isStickyRow
                                ? { top: `${headerHeight}px`, zIndex: 5 }
                                : {};

                            return (
                                <tr
                                    key={index}
                                    ref={el => { rowRefs.current[index] = el; }}
                                    className={`transition-colors duration-200 ${stickyClass} ${bgClass}`}
                                    style={stickyStyles}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                        {row.date}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-200 font-mono">
                                        {formatCurrency(row.beginningBalance)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white font-mono">
                                        {formatCurrency(row.endingBalance)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-100 font-medium font-mono">
                                        {formatCurrency(row.offsetBalance)}
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
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <button
                onClick={triggerScrollTo2031}
                className="absolute bottom-10 right-16 bg-indigo-600/50 hover:bg-indigo-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                aria-label="Scroll to Jan 2031"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
            </button>

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
