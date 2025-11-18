import React, { useState } from 'react';
import type { SuperCalculatorState } from '../../types/super.types';
import { SuperSummary } from './SuperSummary';
import { SuperBreakdown } from './SuperBreakdown';
import { SuperDrawdownTable } from './SuperDrawdownTable';
import { Tabs } from '../common/Tabs';

interface SuperResultsProps {
    calculator: SuperCalculatorState;
}

export const SuperResults: React.FC<SuperResultsProps> = ({ calculator }) => {
    const { results, breakdownData, drawdownSchedule } = calculator;
    const [activeTab, setActiveTab] = useState<'growth' | 'drawdown'>('growth');

    const TABS = [
        { id: 'growth', label: 'Growth Details' },
        { id: 'drawdown', label: 'Drawdown Schedule' },
    ];

    return (
        <div className="md:w-[65%] bg-indigo-700 text-white p-6 sm:p-8 flex flex-col h-full overflow-hidden">
            {!results ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center opacity-50">
                    <p>Enter details to view projection.</p>
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    {/* 1. HERO SCORECARDS (Always Visible) */}
                    <div className="flex-shrink-0">
                        <h2 className="text-xl font-bold text-white mb-4 hidden md:block">Results Dashboard</h2>
                        <SuperSummary results={results} drawdownSchedule={drawdownSchedule} />
                    </div>

                    {/* 2. DETAILS TABS */}
                    <div className="flex-shrink-0 mb-4 border-b border-indigo-600">
                        <Tabs
                            tabs={TABS}
                            activeTab={activeTab}
                            onTabClick={(id) => setActiveTab(id as any)}
                            variant="dark-underline"
                        />
                    </div>

                    {/* 3. SCROLLABLE CONTENT AREA */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                        {activeTab === 'growth' && (
                            <SuperBreakdown breakdownData={breakdownData} />
                        )}
                        {activeTab === 'drawdown' && (
                            <SuperDrawdownTable schedule={drawdownSchedule} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};