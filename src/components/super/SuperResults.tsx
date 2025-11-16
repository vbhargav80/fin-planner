import React, { useState } from 'react';
import type { SuperCalculatorState } from '../../types/super.types';
import { SuperSummary } from './SuperSummary';
import { SuperBreakdown } from './SuperBreakdown';
import { Tabs } from '../common/Tabs';

interface SuperResultsProps {
    calculator: SuperCalculatorState;
}

export const SuperResults: React.FC<SuperResultsProps> = ({ calculator }) => {
    const { results, breakdownData } = calculator;
    const [activeTab, setActiveTab] = useState<'summary' | 'breakdown'>('summary');
    const TABS = [
        { id: 'summary', label: 'Summary' },
        { id: 'breakdown', label: 'Month-by-Month Breakdown' },
    ];

    return (
        <div className="md:w-[65%] bg-indigo-700 text-white p-6 sm:p-10 flex flex-col overflow-y-auto">
            {!results && (
                <div className="flex-grow flex flex-col justify-center items-center text-center">
                    <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-4 text-2xl font-medium text-indigo-100">
                        Your result will appear here
                    </h3>
                    <p className="mt-2 text-indigo-200">
                        Fill out the form to see your projection.
                    </p>
                </div>
            )}

            {results && (
                <>
                    <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(id) => setActiveTab(id as any)} variant="dark-underline" className="mb-4" />

                    <div className="flex-grow flex flex-col justify-center">
                        {activeTab === 'summary' && <SuperSummary results={results} />}
                        {activeTab === 'breakdown' && <SuperBreakdown breakdownData={breakdownData} />}
                    </div>
                </>
            )}

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