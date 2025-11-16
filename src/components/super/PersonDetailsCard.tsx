import React, { useState } from 'react';
import { RangeSlider } from '../common/RangeSlider';
import { formatCurrency } from '../../utils/formatters';
import type { State, Action } from '../../types/super.types';
import PersonTabsPanel from '../PersonTabsPanel';
import * as SuperConstants from '../../constants/super';

interface PersonDetailsCardProps {
    state: State;
    dispatch: React.Dispatch<Action>;
    myContributionPre50: number;
    myContributionPost50: number;
    wifeContributionPre50: number;
    wifeContributionPost50: number;
    isBalanceMode: boolean;
    isMonthly: boolean;
}

export const PersonDetailsCard: React.FC<PersonDetailsCardProps> = (props) => {
    const {
        state,
        dispatch,
        myContributionPre50,
        myContributionPost50,
        wifeContributionPre50,
        wifeContributionPost50,
        isBalanceMode,
        isMonthly,
    } = props;
    const { myAge, mySuper, myExtraYearlyContribution, myExtraContributionYears, wifeAge, wifeSuper, wifeExtraYearlyContribution, wifeExtraContributionYears, makeExtraContribution } = state;

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
                        <RangeSlider label="Current Age" value={myAge} min={SuperConstants.CURRENT_AGE.MIN} max={SuperConstants.CURRENT_AGE.MAX} step={SuperConstants.CURRENT_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_MY_AGE', payload: v })} />
                    </div>
                    <div className="sm:col-span-1">
                        <RangeSlider label="Current Super" value={mySuper} min={SuperConstants.CURRENT_SUPER.MIN} max={SuperConstants.CURRENT_SUPER.MAX} step={SuperConstants.CURRENT_SUPER.STEP} onChange={(v) => dispatch({ type: 'SET_MY_SUPER', payload: v })} formatValue={(v) => formatCurrency(v)} />
                    </div>
                    {isBalanceMode && (
                        <>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Pre 50)`} value={myContributionPre50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_CONTRIBUTION_PRE_50', payload: v })} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Post 50)`} value={myContributionPost50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_CONTRIBUTION_POST_50', payload: v })} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            {makeExtraContribution && (
                                <>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="Extra Yearly Cont." value={myExtraYearlyContribution} min={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MIN} max={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MAX} step={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_EXTRA_YEARLY_CONTRIBUTION', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="For How Many Years" value={myExtraContributionYears} min={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MIN} max={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MAX} step={SuperConstants.EXTRA_CONTRIBUTION_YEARS.STEP} onChange={(v) => dispatch({ type: 'SET_MY_EXTRA_CONTRIBUTION_YEARS', payload: v })} formatValue={(v) => `${v} yrs`} />
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
                        <RangeSlider label="Current Age" value={wifeAge} min={SuperConstants.CURRENT_AGE.MIN} max={SuperConstants.CURRENT_AGE.MAX} step={SuperConstants.CURRENT_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_AGE', payload: v })} />
                    </div>
                    <div className="sm:col-span-1">
                        <RangeSlider label="Current Super" value={wifeSuper} min={SuperConstants.CURRENT_SUPER.MIN} max={SuperConstants.CURRENT_SUPER.MAX} step={SuperConstants.CURRENT_SUPER.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_SUPER', payload: v })} formatValue={(v) => formatCurrency(v)} />
                    </div>
                    {isBalanceMode && (
                        <>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Pre 50)`} value={wifeContributionPre50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_CONTRIBUTION_PRE_50', payload: v })} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            <div className="sm:col-span-1">
                                <RangeSlider label={`${isMonthly ? 'Monthly' : 'Yearly'} Cont. (Post 50)`} value={wifeContributionPost50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_CONTRIBUTION_POST_50', payload: v })} formatValue={(v) => formatCurrency(v)} />
                            </div>
                            {makeExtraContribution && (
                                <>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="Extra Yearly Cont." value={wifeExtraYearlyContribution} min={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MIN} max={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MAX} step={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_EXTRA_YEARLY_CONTRIBUTION', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <RangeSlider label="For How Many Years" value={wifeExtraContributionYears} min={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MIN} max={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MAX} step={SuperConstants.EXTRA_CONTRIBUTION_YEARS.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS', payload: v })} formatValue={(v) => `${v} yrs`} />
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