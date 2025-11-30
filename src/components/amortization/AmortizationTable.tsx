import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import type { AmortizationCalculatorState } from '../../types/amortization.types';
import { formatCurrency } from '../../utils/formatters';
import { ArrowDownCircle, Calendar } from 'lucide-react';

interface AmortizationTableProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ calculator }) => {
    const {
        amortizationData,
        hasDepletedOffsetRows,
        state: { retirementDate }
    } = calculator;

    const theadRef = useRef<HTMLTableSectionElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [isRetirementPinned, setIsRetirementPinned] = useState(false);

    // Extract just the year for the button label
    const retirementYear = retirementDate.split('-')[0];

    useLayoutEffect(() => {
        const thead = theadRef.current;
        if (!thead) return;
        const measure = () => {
            const rect = thead.getBoundingClientRect();
            const h = Math.ceil(rect.height);
            if (h && h !== headerHeight) setHeaderHeight(h);
        };
        measure();
        const ro = new ResizeObserver(() => measure());
        ro.observe(thead);
        return () => ro.disconnect();
    }, []);

    const scrollToIndex = (index: number) => {
        const container = scrollContainerRef.current;
        const rowEl = rowRefs.current[index];
        if (!container || !rowEl) return;

        const extraPadding = 8;
        const containerRect = container.getBoundingClientRect();
        const rowRect = rowEl.getBoundingClientRect();
        const rowTopInContainer = rowRect.top - containerRect.top;

        const targetTop = Math.max(
            0,
            container.scrollTop + rowTopInContainer - headerHeight - extraPadding,
        );

        container.scrollTo({ top: targetTop, behavior: 'smooth' });
    };

    const handleScrollToRetirement = () => {
        // Find the row flagged as the retirement transition
        const index = amortizationData.findIndex((row) => row.isRetirementRow);
        if (index !== -1) scrollToIndex(index);
    };

    const handleScrollToDepletion = () => {
        const index = amortizationData.findIndex((row) => row.offsetBalance <= 0);
        if (index !== -1) scrollToIndex(index);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        // Check for the retirement flag instead of hardcoded date
        const index = amortizationData.findIndex(r => r.isRetirementRow);
        if (index === -1) { setIsRetirementPinned(false); return; }

        let ticking = false;
        const handle = () => {
            const rowEl = rowRefs.current[index!];
            if (!rowEl || !container) return;
            const containerRect = container.getBoundingClientRect();
            const rowRect = rowEl.getBoundingClientRect();
            const relativeTop = rowRect.top - containerRect.top;
            const shouldPin = relativeTop <= headerHeight + 1;
            setIsRetirementPinned(prev => (prev !== shouldPin ? shouldPin : prev));
        };
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                handle();
            });
        };
        container.addEventListener('scroll', onScroll, { passive: true });
        return () => container.removeEventListener('scroll', onScroll);
    }, [amortizationData, headerHeight]);

    return (
        // CHANGE 1: Adjusted widths to match the Form (md:w-[55%] xl:w-[60%])
        <div className="w-full md:w-[55%] xl:w-[60%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col relative h-[calc(100vh-4rem)] sticky top-16">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-2xl font-bold text-white text-center lg:text-left">
                    Amortization Schedule
                </h3>

                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={handleScrollToRetirement}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-indigo-100 rounded-full transition-colors border border-indigo-500"
                    >
                        <Calendar size={14} />
                        Jump to Retirement ({retirementYear})
                    </button>

                    {hasDepletedOffsetRows && (
                        <button
                            onClick={handleScrollToDepletion}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-red-900/50 hover:bg-red-800 text-red-200 rounded-full transition-colors border border-red-800/50"
                        >
                            <ArrowDownCircle size={14} />
                            Jump to Depletion
                        </button>
                    )}
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="bg-indigo-800 rounded-lg shadow-inner flex-grow overflow-auto custom-scrollbar"
                style={{ scrollbarGutter: 'stable' }}
            >
                <table className="min-w-full text-left relative border-collapse">
                    <thead ref={theadRef} className="bg-indigo-900 sticky top-0 z-20 shadow-md">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Date</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Loan Balance</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Offset Balance</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Repayment</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Total In</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Total Out</th>
                        <th scope="col" className="pl-4 pr-6 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider whitespace-nowrap">Net Result</th>
                    </tr>
                    </thead>
                    <tbody className="bg-indigo-800 divide-y divide-indigo-700">
                    {amortizationData.map((row, index) => {
                        // Check the flag we set in the calculations
                        const isRetirementRow = row.isRetirementRow;
                        const isNegativeOffset = row.offsetBalance <= 0;

                        const stickyActive = isRetirementRow && isRetirementPinned;
                        const bgClass = isNegativeOffset
                            ? 'bg-red-900/40 hover:bg-red-900/60'
                            : isRetirementRow
                                ? 'bg-indigo-900'
                                : 'hover:bg-indigo-700/50';

                        const stickyTdStyle = stickyActive ? { position: 'sticky' as const, top: `${headerHeight}px`, zIndex: 10 } : undefined;
                        const stickyTdClass = stickyActive
                            ? ' bg-indigo-900 shadow-[0_2px_4px_rgba(0,0,0,0.3)] border-b border-indigo-500'
                            : '';

                        return (
                            <tr
                                key={index}
                                ref={el => { rowRefs.current[index] = el; }}
                                className={`transition-colors duration-200 ${bgClass}`}
                            >
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-white ${stickyTdClass}`} style={stickyTdStyle}>{row.date}</td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-white font-mono text-right ${stickyTdClass}`} style={stickyTdStyle}>{formatCurrency(row.endingBalance)}</td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-indigo-100 font-medium font-mono text-right ${stickyTdClass}`} style={stickyTdStyle}>{formatCurrency(row.offsetBalance)}</td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-green-300 font-mono text-right ${stickyTdClass}`} style={stickyTdStyle}>{formatCurrency(row.repayment)}</td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-green-300 font-medium font-mono text-right ${stickyTdClass}`} style={stickyTdStyle}>{formatCurrency(row.totalIncoming)}</td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-orange-300 font-mono text-right ${stickyTdClass}`} style={stickyTdStyle}>{formatCurrency(row.totalOutgoing)}</td>
                                <td className={`pl-4 pr-6 py-3 whitespace-nowrap text-sm font-medium font-mono text-right ${row.totalShortfall < 0 ? 'text-red-300' : 'text-green-300'} ${stickyTdClass}`} style={stickyTdStyle}>{formatCurrency(row.totalShortfall)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};