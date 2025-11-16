import React, { useState } from 'react';
import { RangeSlider } from '../common/RangeSlider';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';
import PersonTabsPanel from '../PersonTabsPanel';

interface PersonDetailsCardProps extends SuperCalculatorState {
    isBalanceMode: boolean;
    isMonthly: boolean;
}

export const PersonDetailsCard: React.FC<PersonDetailsCardProps> = (props) => {
    const {
        myAge, setMyAge,
        mySuper, setMySuper,
        myContributionPre50, setMyContributionPre50,
        myContributionPost50, setMyContributionPost50,
        myExtraYearlyContribution, setMyExtraYearlyContribution,
        myExtraContributionYears, setMyExtraContributionYears,
        wifeAge, setWifeAge,
        wifeSuper, setWifeSuper,
        wifeContributionPre50, setWifeContributionPre50,
        wifeContributionPost50, setWifeContributionPost50,
        wifeExtraYearlyContribution, setWifeExtraYearlyContribution,
        wifeExtraContributionYears, setWifeExtraContributionYears,
        isBalanceMode,
        isMonthly,
        makeExtraContribution,
    } = props;

    const [activeTab, setActiveTab] = useState<'me' | 'spouse'>('me');

    return (
        <PersonTabsPanel className="!p-0">
            <ul className="flex text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-t-lg">
                <li className="w-full">
                    <button
                        type="button"
                        onClick={() => setActiveTab('me')}
                        className={`inline-block w-full p-4 rounded-tl-lg transition-colors duration-150 focus:outline-none ${activeTab === 'me' ? 'bg-indigo-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    >You</button>
                </li>
                <li className="w-full">
                    <button
                        type="button"
                        onClick={() => setActiveTab('spouse')}
                        className={`inline-block w-full p-4 rounded-tr-lg transition-colors duration-150 focus:outline-none ${activeTab === 'spouse' ? 'bg-indigo-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                    >Spouse</button>
                </li>
            </ul>

            {activeTab === 'me' && (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 border-t border-gray-200">
                    <div className="sm:col-span-1">
                        <RangeSlider label="Current Age" value={Number(myAge)} min={30} max={55} step={1} onChange={(n) => setMyAge(String(n))} />
                    </div>
                    <div className="sm:col-span-1">
                        <RangeSlider label="Current Super" value={Number(mySuper)} min={0} max={1000000} step={10000} onChange={(n) => setMySuper(String(n))} formatValue={(v) => formatCurrency(v)} />
                    </div>
                    {isBalanceMode && (
                        <>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Pre 50)`} value={Number(myContributionPre50)} min={0} max={isMonthly ? 2000 : 24000} step={isMonthly ? 50 : 500} onChange={(n) => setMyContributionPre50(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Post 50)`} value={Number(myContributionPost50)} min={0} max={isMonthly ? 2000 : 24000} step={isMonthly ? 50 : 500} onChange={(n) => setMyContributionPost50(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            {makeExtraContribution && (
                                <>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="Extra Yearly Cont." value={Number(myExtraYearlyContribution)} min={0} max={27500} step={500} onChange={(n) => setMyExtraYearlyContribution(String(n))} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="For How Many Years" value={Number(myExtraContributionYears)} min={0} max={15} step={1} onChange={(n) => setMyExtraContributionYears(String(n))} formatValue={(v) => `${v} yrs`} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'spouse' && (
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 border-t border-gray-200">
                    <div className="sm:col-span-1">
                        <RangeSlider label="Current Age" value={Number(wifeAge)} min={30} max={55} step={1} onChange={(n) => setWifeAge(String(n))} />
                    </div>
                    <div className="sm:col-span-1">
                        <RangeSlider label="Current Super" value={Number(wifeSuper)} min={0} max={1000000} step={10000} onChange={(n) => setWifeSuper(String(n))} formatValue={(v) => formatCurrency(v)} />
                    </div>
                    {isBalanceMode && (
                        <>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Pre 50)`} value={Number(wifeContributionPre50)} min={0} max={isMonthly ? 2000 : 24000} step={isMonthly ? 50 : 500} onChange={(n) => setWifeContributionPre50(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Post 50)`} value={Number(wifeContributionPost50)} min={0} max={isMonthly ? 2000 : 24000} step={isMonthly ? 50 : 500} onChange={(n) => setWifeContributionPost50(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            {makeExtraContribution && (
                                <>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="Extra Yearly Cont." value={Number(wifeExtraYearlyContribution)} min={0} max={27500} step={500} onChange={(n) => setWifeExtraYearlyContribution(String(n))} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="For How Many Years" value={Number(wifeExtraContributionYears)} min={0} max={15} step={1} onChange={(n) => setWifeExtraContributionYears(String(n))} formatValue={(v) => `${v} yrs`} />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </PersonTabsPanel>
    );
};