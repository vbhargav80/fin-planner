import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
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
    const [isJan2031Pinned, setIsJan2031Pinned] = useState(false);

    useLayoutEffect(() => {
        const thead = theadRef.current;
        if (!thead) return;

        const measure = () => {
            const rect = thead.getBoundingClientRect();
            const h = Math.ceil(rect.height);
            if (h && h !== headerHeight) {
                setHeaderHeight(h);
            }
        };

        // Measure immediately
        measure();

        // Keep the value in sync if the header wraps or viewport changes
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => measure());
            ro.observe(thead);
            return () => ro.disconnect();
        }

        const id = window.setInterval(measure, 300);
        return () => window.clearInterval(id);
    }, [headerHeight]);

    // Scroll to Jan 2031 row when explicitly requested via button
    useEffect(() => {
        if (!scrollTo2031) return; // only react when counter is non-zero and changes

        const index = amortizationData.findIndex((row) => row.date === 'Jan 2031');
        if (index === -1) {
            console.warn('[AmortizationTable] Jan 2031 row not found');
            return;
        }

        const container = scrollContainerRef.current;
        const rowEl = rowRefs.current[index];
        if (!container || !rowEl) {
            console.warn('[AmortizationTable] Missing container or row element for Jan 2031');
            return;
        }

        const extraPadding = 8;
        let raf1 = 0;
        let raf2 = 0;

        const doScroll = () => {
            const containerRect = container.getBoundingClientRect();
            const rowRect = rowEl.getBoundingClientRect();
            const rowTopInContainer = rowRect.top - containerRect.top;

            const targetTop = Math.max(
                0,
                container.scrollTop + rowTopInContainer - headerHeight - extraPadding,
            );

            container.scrollTo({ top: targetTop, behavior: 'smooth' });
        };

        // Double RAF to ensure layout & sticky header are fully applied
        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(doScroll);
        });

        return () => {
            if (raf1) cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
        };
    }, [scrollTo2031, amortizationData, headerHeight]);

    // Scroll-driven sticky behavior for Jan 2031 row
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const index = amortizationData.findIndex(r => r.date === 'Jan 2031');
        if (index === -1) {
            // Ensure it's not pinned if row doesn't exist
            setIsJan2031Pinned(false);
            return;
        }

        let ticking = false;
        const handle = () => {
            const rowEl = rowRefs.current[index!];
            if (!rowEl || !container) return;
            const containerRect = container.getBoundingClientRect();
            const rowRect = rowEl.getBoundingClientRect();
            const relativeTop = rowRect.top - containerRect.top;
            const shouldPin = relativeTop <= headerHeight + 1; // within/above header -> pin
            setIsJan2031Pinned(prev => (prev !== shouldPin ? shouldPin : prev));
        };
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                handle();
            });
        };

        container.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
        // Evaluate once on attach and on header changes
        requestAnimationFrame(handle);

        return () => {
            container.removeEventListener('scroll', onScroll as EventListener);
        };
    }, [amortizationData, headerHeight]);

    return (
        <div className="md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col relative">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Amortization Schedule
            </h3>

            <div
                ref={scrollContainerRef}
                className="bg-indigo-800 rounded-lg shadow-inner flex-grow overflow-auto max-h-[70vh] md:max-h-[calc(100vh-8rem)]"
            >
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
                        const isJanRow = row.date === 'Jan 2031';
                        const isNegativeOffset = row.offsetBalance <= 0;

                        const stickyActive = isJanRow && isJan2031Pinned;
                        const bgClass = isNegativeOffset
                            ? 'bg-red-900 hover:bg-red-700'
                            : isJanRow
                                ? 'bg-indigo-900'
                                : 'hover:bg-indigo-700/50';

                        const stickyTdStyle = stickyActive
                            ? { position: 'sticky' as const, top: `${headerHeight}px`, zIndex: 5, backgroundColor: '#1e293b' }
                            : undefined;
                        const stickyTdClass = stickyActive ? ' shadow-[0_1px_0_0_rgba(0,0,0,0.2)]' : '';

                        return (
                            <tr
                                key={index}
                                ref={el => { rowRefs.current[index] = el; }}
                                className={`transition-colors duration-200 ${bgClass}`}
                            >
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-white${stickyTdClass}`} style={stickyTdStyle}>
                                    {row.date}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-indigo-200 font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.beginningBalance)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-white font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.endingBalance)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-indigo-100 font-medium font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.offsetBalance)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-green-300 font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.repayment)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-blue-300 font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.rentalIncome)}
                                </td>
                                {considerOffsetIncome && (
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-purple-300 font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                        {formatCurrency(row.offsetIncome)}
                                    </td>
                                )}
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-green-300 font-medium font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.totalIncoming)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-orange-300 font-mono${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.totalOutgoing)}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium font-mono ${
                                    row.totalShortfall < 0 ? 'text-red-300' : 'text-green-300'
                                }${stickyTdClass}`} style={stickyTdStyle}>
                                    {formatCurrency(row.totalShortfall)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <button
                onClick={triggerScrollTo2031}
                className="absolute top-10 right-10 z-20 bg-indigo-600/50 hover:bg-indigo-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
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
