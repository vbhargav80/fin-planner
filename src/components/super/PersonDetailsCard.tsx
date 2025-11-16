import React, { useState } from 'react';
import { RangeSlider } from '../common/RangeSlider';
import { formatCurrency } from '../../utils/formatters';
import { ToggleSwitch } from '../common/ToggleSwitch';
import type { SuperCalculatorState } from '../../types/super.types';

// Pick only the props needed from the main state
type PersonDetailsCardProps = Pick<
    SuperCalculatorState,
    | 'myAge' | 'setMyAge'
    | 'wifeAge' | 'setWifeAge'
    | 'mySuper' | 'setMySuper'
    | 'wifeSuper' | 'setWifeSuper'
    | 'myContributionPre50' | 'setMyContributionPre50'
    | 'myContributionPost50' | 'setMyContributionPost50'
    | 'wifeContributionPre50' | 'setWifeContributionPre50'
    | 'wifeContributionPost50' | 'setWifeContributionPost50'
    | 'myExtraYearlyContribution' | 'setMyExtraYearlyContribution'
    | 'wifeExtraYearlyContribution' | 'setWifeExtraYearlyContribution'
    | 'makeExtraContribution'
> & {
    isBalanceMode: boolean;
    isMonthly: boolean;
};

export const PersonDetailsCard: React.FC<PersonDetailsCardProps> = ({
    myAge, setMyAge,
    wifeAge, setWifeAge,
    mySuper, setMySuper,
    wifeSuper, setWifeSuper,
    myContributionPre50, setMyContributionPre50,
    myContributionPost50, setMyContributionPost50,
    wifeContributionPre50, setWifeContributionPre50,
    wifeContributionPost50, setWifeContributionPost50,
    myExtraYearlyContribution, setMyExtraYearlyContribution,
    wifeExtraYearlyContribution, setWifeExtraYearlyContribution,
    makeExtraContribution,
    isBalanceMode,
    isMonthly,
}) => {
    const [activePersonTab, setActivePersonTab] = useState<'self' | 'spouse'>('self');

    return (
        <div className="bg-white border-l-4 border-indigo-500 rounded-lg shadow-lg">
            <div className="flex">
                <button
                    type="button"
                    onClick={() => setActivePersonTab('self')}
                    className={`w-1/2 p-4 text-center font-medium transition-colors duration-150 rounded-tl-lg ${
                        activePersonTab === 'self'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    You
                </button>
                <button
                    type="button"
                    onClick={() => setActivePersonTab('spouse')}
                    className={`w-1/2 p-4 text-center font-medium rounded-tr-lg transition-colors duration-150 ${
                        activePersonTab === 'spouse'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Spouse
                </button>
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {activePersonTab === 'self' && (
                        <>
                            <RangeSlider label="Current Age" value={Number(myAge)} min={45} max={60} step={1} onChange={(n) => setMyAge(String(n))} />
                            <RangeSlider label="Current Super" value={Number(mySuper)} min={380000} max={450000} step={5000} onChange={(n) => setMySuper(String(n))} formatValue={(v) => formatCurrency(v)} />
                            {isBalanceMode && (
                                <>
                                    <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Contribution (Pre-50)`} value={Number(myContributionPre50)} min={0} max={isMonthly ? 1200 : 18000} step={isMonthly ? 50 : 500} onChange={(n) => setMyContributionPre50(String(n))} formatValue={(v) => formatCurrency(v)} />
                                    <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Contribution (Post-50)`} value={Number(myContributionPost50)} min={0} max={isMonthly ? 1200 : 12000} step={isMonthly ? 50 : 500} onChange={(n) => setMyContributionPost50(String(n))} formatValue={(v) => formatCurrency(v)} />
                                </>
                            )}
                            {isBalanceMode && makeExtraContribution && (
                                <div className="sm:col-span-2">
                                    <RangeSlider label="Extra End-of-Year Contribution" value={Number(myExtraYearlyContribution)} min={0} max={20000} step={500} onChange={(n) => setMyExtraYearlyContribution(String(n))} formatValue={(v) => formatCurrency(v)} />
                                </div>
                            )}
                        </>
                    )}

                    {activePersonTab === 'spouse' && (
                        <>
                            <RangeSlider label="Current Age" value={Number(wifeAge)} min={42} max={60} step={1} onChange={(n) => setWifeAge(String(n))} />
                            <RangeSlider label="Current Super" value={Number(wifeSuper)} min={100000} max={150000} step={5000} onChange={(n) => setWifeSuper(String(n))} formatValue={(v) => formatCurrency(v)} />
                            {isBalanceMode && (
                                <>
                                    <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Contribution (Pre-50)`} value={Number(wifeContributionPre50)} min={0} max={isMonthly ? 1200 : 18000} step={isMonthly ? 50 : 500} onChange={(n) => setWifeContributionPre50(String(n))} formatValue={(v) => formatCurrency(v)} />
                                    <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Contribution (Post-50)`} value={Number(wifeContributionPost50)} min={0} max={isMonthly ? 1200 : 12000} step={isMonthly ? 50 : 500} onChange={(n) => setWifeContributionPost50(String(n))} formatValue={(v) => formatCurrency(v)} />
                                </>
                            )}
                            {isBalanceMode && makeExtraContribution && (
                                <div className="sm:col-span-2">
                                    <RangeSlider label="Extra End-of-Year Contribution" value={Number(wifeExtraYearlyContribution)} min={0} max={20000} step={500} onChange={(n) => setWifeExtraYearlyContribution(String(n))} formatValue={(v) => formatCurrency(v)} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
