// File: src/components/drawdown-simulator/DrawdownResults.tsx
import React, { useState } from 'react';
import type { DrawdownRow, ChartDataPoint } from '../../types/drawdown.types';
import { formatCurrency } from '../../utils/formatters';
import { WealthChart } from './WealthChart'; // Import Chart
import { Tabs } from '../common/Tabs';

interface Props {
    netProceeds: number;
    durationLabel: string;
    person1Tax: number;
    person2Tax: number;
    schedule: DrawdownRow[];
    chartData: ChartDataPoint[]; // NEW PROP
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
                                                     chartData,
                                                 }) => {
    const [activeTab, setActiveTab] = useState<'table' | 'chart'>('chart'); // Default to chart for visual impact

    const TABS = [
        { id: 'chart', label: 'Wealth Projection' },
        { id: 'table', label: 'Monthly Schedule' },
    ];

    return (
        <div className="w-full md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col h-[calc(100vh-4rem)] overflow-hidden sticky top-16">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Results</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 flex-shrink-0">
                <Pill label="Net Proceeds" value={formatCurrency(netProceeds)} />
                <Pill label="Funds Last For" value={durationLabel} />
                <Pill label="Person 1 Tax" value={formatCurrency(person1Tax)} />
                <Pill label="Person 2 Tax" value={formatCurrency(person2Tax)} />
            </div>

            <Tabs
                tabs={TABS}
                activeTab={activeTab}
                onTabClick={(id) => setActiveTab(id as any)}
                variant="dark-underline"
                className="mb-4"
            />

            <div className="bg-indigo-800 rounded-lg shadow-inner overflow-hidden flex-grow flex flex-col min-h-0">
                {activeTab === 'chart' && (
                    <div className="flex-1 p-4">
                        <h4 className="text-center text-indigo-200 text-sm mb-4">
                            30-Year Comparison: Selling vs Keeping
                        </h4>
                        <WealthChart data={chartData} />
                    </div>
                )}

                {activeTab === 'table' && (
                    <div className="overflow-auto flex-1 custom-scrollbar">
                        <table className="min-w-full text-left relative">
                            <thead className="bg-indigo-900 sticky top-0 z-10 shadow-md">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-100 uppercase tracking-wider w-1/6">Month</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider w-1/6">Start Bal</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider w-1/6">Interest</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider w-1/6">Drawdown</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-indigo-100 uppercase tracking-wider w-1/6">End Bal</th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-orange-200 uppercase tracking-wider w-1/6 bg-indigo-900/50 border-l border-indigo-700">(Foregone Rent)</th>
                            </tr>
                            </thead>
                            <tbody className="bg-indigo-800 divide-y divide-indigo-700">
                            {schedule.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={`transition-colors duration-200 ${
                                        row.endBalance <= 0
                                            ? 'bg-red-900 hover:bg-red-800'
                                            : 'hover:bg-indigo-700/50'
                                    }`}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{row.dateLabel}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-200 font-mono text-right">{formatCurrency(row.startBalance)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-300 font-mono text-right">{formatCurrency(row.interestEarned)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-300 font-mono text-right">{formatCurrency(row.drawdown)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white font-mono text-right">{formatCurrency(row.endBalance)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-300/80 font-mono text-right border-l border-indigo-700 bg-indigo-800/30">{formatCurrency(row.rentLost)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};