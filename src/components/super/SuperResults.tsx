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
    const [activeTab, setActiveTab] = useState<'summary' | 'breakdown' | 'drawdown'>('summary');

    const TABS = [
        { id: 'summary', label: 'Summary' },
        { id: 'breakdown', label: 'Accumulation' },
        { id: 'drawdown', label: 'Drawdown' },
    ];

    return (
        <div className="md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col overflow-y-auto">
            {!results ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center opacity-50">
                    <p>Enter details to view projection.</p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <Tabs
                            tabs={TABS}
                            activeTab={activeTab}
                            onTabClick={(id) => setActiveTab(id as any)}
                            variant="dark-underline"
                        />
                    </div>

                    <div className="flex-grow flex flex-col justify-start animate-fade-in">
                        {activeTab === 'summary' && <SuperSummary results={results} />}
                        {activeTab === 'breakdown' && <SuperBreakdown breakdownData={breakdownData} />}
                        {activeTab === 'drawdown' && <SuperDrawdownTable schedule={drawdownSchedule} />}
                    </div>
                </>
            )}
        </div>
    );
};