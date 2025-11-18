import React, { useState } from 'react';
import { RangeSlider } from '../common/RangeSlider';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';
import { ToggleSwitch } from '../common/ToggleSwitch';
import * as SuperConstants from '../../constants/super';
import { Tabs } from '../common/Tabs';
import { SegmentedControl } from '../common/SegmentedControl';
import { TrendingUp, Sunset, Wallet, PiggyBank, User, Target } from 'lucide-react';

interface SuperFormProps {
    calculator: SuperCalculatorState;
}

export const SuperForm: React.FC<SuperFormProps> = ({ calculator }) => {
    const {
        state,
        dispatch,
        results,
        error,
        myContributionCurrent,
        myContributionFuture,
        wifeContributionCurrent,
        wifeContributionFuture,
    } = calculator;

    const {
        myAge, wifeAge, mySuper, wifeSuper,
        targetAge, targetBalance, netReturn, calcMode, contributionFrequency, makeExtraContribution,
        myExtraYearlyContribution, myExtraContributionYears, wifeExtraYearlyContribution, wifeExtraContributionYears,
        drawdownLifestyle, drawdownAnnualAmount, drawdownReturn
    } = state;

    const [activePhase, setActivePhase] = useState<'accumulation' | 'retirement'>('accumulation');
    const [contributorTab, setContributorTab] = useState<'me' | 'spouse'>('me');

    const [useAgeBasedMe, setUseAgeBasedMe] = useState(false);
    const [useAgeBasedSpouse, setUseAgeBasedSpouse] = useState(false);

    const PHASE_TABS = [
        { id: 'accumulation', label: 'Accumulation Phase' },
        { id: 'retirement', label: 'Retirement Phase' },
    ];

    const CONTRIBUTOR_TABS = [
        { id: 'me', label: 'My Strategy' },
        { id: 'spouse', label: 'Spouse Strategy' },
    ];

    const FREQUENCY_OPTIONS = ['monthly', 'yearly'] as const;

    const LIFESTYLE_OPTIONS = [
        { id: 'modest', label: 'Modest' },
        { id: 'comfortable', label: 'Comfortable' },
        { id: 'luxury', label: 'Luxury' },
        { id: 'custom', label: 'Custom' },
    ];

    const CALC_MODE_TABS = [
        { id: 'balance', label: 'Forecast Final Balance' },
        { id: 'contribution', label: 'Target a Goal' },
    ];

    const isMonthly = contributionFrequency === 'monthly';

    const handleUnifiedChange = (
        value: number,
        person: 'me' | 'spouse',
        type: 'SET_MY_CONTRIBUTION_CURRENT' | 'SET_WIFE_CONTRIBUTION_CURRENT'
    ) => {
        dispatch({ type, payload: value });

        if (person === 'me' && !useAgeBasedMe) {
            dispatch({ type: 'SET_MY_CONTRIBUTION_FUTURE', payload: value });
        }
        if (person === 'spouse' && !useAgeBasedSpouse) {
            dispatch({ type: 'SET_WIFE_CONTRIBUTION_FUTURE', payload: value });
        }
    };

    return (
        <div className="md:w-[45%] p-6 sm:p-8 overflow-y-auto flex flex-col h-full">
            <div className="flex-shrink-0">
                <h2 className="text-3xl font-bold text-gray-900">Super Calculator</h2>
                <p className="mt-2 text-gray-600 mb-6">Optimize your super growth and retirement income.</p>

                <div className="mb-6">
                    <Tabs
                        tabs={PHASE_TABS}
                        activeTab={activePhase}
                        onTabClick={(id) => setActivePhase(id as any)}
                        variant="segmented-indigo"
                    />
                </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-1">

                {/* ==================== ACCUMULATION PHASE ==================== */}
                {activePhase === 'accumulation' && (
                    <div className="space-y-6 animate-fade-in">

                        {/* 1. Context: Current Status */}
                        <div className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-lg">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
                                <Wallet size={20} />
                                <h3>Current Status</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <RangeSlider label="My Age" value={myAge} min={SuperConstants.CURRENT_AGE.MIN} max={SuperConstants.CURRENT_AGE.MAX} step={SuperConstants.CURRENT_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_MY_AGE', payload: v })} />
                                    <div className="mt-4">
                                        <RangeSlider label="My Balance" value={mySuper} min={SuperConstants.CURRENT_SUPER.MIN} max={SuperConstants.CURRENT_SUPER.MAX} step={SuperConstants.CURRENT_SUPER.STEP} onChange={(v) => dispatch({ type: 'SET_MY_SUPER', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                </div>
                                <div>
                                    <RangeSlider label="Spouse Age" value={wifeAge} min={SuperConstants.CURRENT_AGE.MIN} max={SuperConstants.CURRENT_AGE.MAX} step={SuperConstants.CURRENT_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_AGE', payload: v })} />
                                    <div className="mt-4">
                                        <RangeSlider label="Spouse Balance" value={wifeSuper} min={SuperConstants.CURRENT_SUPER.MIN} max={SuperConstants.CURRENT_SUPER.MAX} step={SuperConstants.CURRENT_SUPER.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_SUPER', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Decision: Strategy Goal */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">What is your goal?</label>
                            <Tabs
                                tabs={CALC_MODE_TABS}
                                activeTab={calcMode}
                                onTabClick={(id) => dispatch({ type: 'SET_CALC_MODE', payload: id as any })}
                                variant="pill"
                            />
                        </div>

                        {/* 3A. OPTION: FORECAST (Inputs: Contributions) */}
                        {calcMode === 'balance' && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                                <div className="flex items-center justify-between mb-4 gap-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-bold whitespace-nowrap">
                                        <PiggyBank size={20} className="text-emerald-500" />
                                        <h3>Contribution Strategy</h3>
                                    </div>
                                    <div className="w-32">
                                        <SegmentedControl
                                            label=""
                                            options={FREQUENCY_OPTIONS}
                                            value={contributionFrequency}
                                            onChange={(v) => dispatch({ type: 'SET_CONTRIBUTION_FREQUENCY', payload: v })}
                                            formatLabel={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
                                        />
                                    </div>
                                </div>

                                {/* Person Switcher */}
                                <Tabs tabs={CONTRIBUTOR_TABS} activeTab={contributorTab} onTabClick={(id) => setContributorTab(id as any)} variant="underline" className="mb-4" />

                                {/* Contribution Sliders */}
                                {contributorTab === 'me' ? (
                                    <div className="space-y-5 animate-fade-in">
                                        <div className="flex justify-end">
                                            <ToggleSwitch label="Vary strategy in future?" checked={useAgeBasedMe} onChange={setUseAgeBasedMe} />
                                        </div>

                                        {useAgeBasedMe && (
                                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-2">
                                                <RangeSlider
                                                    label="Change Strategy at Age"
                                                    value={state.myContributionChangeAge}
                                                    min={SuperConstants.CONTRIBUTION_CHANGE_AGE.MIN}
                                                    max={targetAge - 1}
                                                    step={1}
                                                    onChange={(v) => dispatch({ type: 'SET_MY_CONTRIBUTION_CHANGE_AGE', payload: v })}
                                                />
                                            </div>
                                        )}

                                        <RangeSlider
                                            label={useAgeBasedMe ? `Contribution (Pre-${state.myContributionChangeAge})` : "Regular Contribution"}
                                            value={myContributionCurrent}
                                            min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN}
                                            max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX}
                                            step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP}
                                            onChange={(v) => handleUnifiedChange(v, 'me', 'SET_MY_CONTRIBUTION_CURRENT')}
                                            formatValue={(v) => formatCurrency(v)}
                                        />

                                        {useAgeBasedMe && (
                                            <RangeSlider
                                                label={`Contribution (Age ${state.myContributionChangeAge}+)`}
                                                value={myContributionFuture}
                                                min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN}
                                                max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX}
                                                step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP}
                                                onChange={(v) => dispatch({ type: 'SET_MY_CONTRIBUTION_FUTURE', payload: v })}
                                                formatValue={(v) => formatCurrency(v)}
                                            />
                                        )}

                                        <div className="pt-4 border-t border-gray-100">
                                            <ToggleSwitch label="Add Annual Catch-up?" checked={makeExtraContribution} onChange={(v) => dispatch({ type: 'SET_MAKE_EXTRA_CONTRIBUTION', payload: v })} />
                                            {makeExtraContribution && (
                                                <div className="mt-4 grid grid-cols-2 gap-4 animate-fade-in">
                                                    <RangeSlider label="Annual Amount" value={myExtraYearlyContribution} min={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MIN} max={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MAX} step={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_EXTRA_YEARLY_CONTRIBUTION', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                                    <RangeSlider label="Duration (Years)" value={myExtraContributionYears} min={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MIN} max={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MAX} step={SuperConstants.EXTRA_CONTRIBUTION_YEARS.STEP} onChange={(v) => dispatch({ type: 'SET_MY_EXTRA_CONTRIBUTION_YEARS', payload: v })} formatValue={(v) => `${v} yrs`} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-fade-in">
                                        <div className="flex justify-end">
                                            <ToggleSwitch label="Vary strategy in future?" checked={useAgeBasedSpouse} onChange={setUseAgeBasedSpouse} />
                                        </div>

                                        {useAgeBasedSpouse && (
                                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-2">
                                                <RangeSlider
                                                    label="Change Strategy at Age"
                                                    value={state.wifeContributionChangeAge}
                                                    min={SuperConstants.CONTRIBUTION_CHANGE_AGE.MIN}
                                                    max={targetAge - 1}
                                                    step={1}
                                                    onChange={(v) => dispatch({ type: 'SET_WIFE_CONTRIBUTION_CHANGE_AGE', payload: v })}
                                                />
                                            </div>
                                        )}

                                        <RangeSlider
                                            label={useAgeBasedSpouse ? `Contribution (Pre-${state.wifeContributionChangeAge})` : "Regular Contribution"}
                                            value={wifeContributionCurrent}
                                            min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN}
                                            max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX}
                                            step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP}
                                            onChange={(v) => handleUnifiedChange(v, 'spouse', 'SET_WIFE_CONTRIBUTION_CURRENT')}
                                            formatValue={(v) => formatCurrency(v)}
                                        />
                                        {useAgeBasedSpouse && (
                                            <RangeSlider
                                                label={`Contribution (Age ${state.wifeContributionChangeAge}+)`}
                                                value={wifeContributionFuture}
                                                min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN}
                                                max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX}
                                                step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP}
                                                onChange={(v) => dispatch({ type: 'SET_WIFE_CONTRIBUTION_FUTURE', payload: v })}
                                                formatValue={(v) => formatCurrency(v)}
                                            />
                                        )}

                                        <div className="pt-4 border-t border-gray-100">
                                            <ToggleSwitch label="Add Annual Catch-up?" checked={makeExtraContribution} onChange={(v) => dispatch({ type: 'SET_MAKE_EXTRA_CONTRIBUTION', payload: v })} />
                                            {makeExtraContribution && (
                                                <div className="mt-4 grid grid-cols-2 gap-4 animate-fade-in">
                                                    <RangeSlider label="Annual Amount" value={wifeExtraYearlyContribution} min={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MIN} max={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MAX} step={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_EXTRA_YEARLY_CONTRIBUTION', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                                    <RangeSlider label="Duration (Years)" value={wifeExtraContributionYears} min={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MIN} max={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MAX} step={SuperConstants.EXTRA_CONTRIBUTION_YEARS.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS', payload: v })} formatValue={(v) => `${v} yrs`} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3B. OPTION: TARGET GOAL (Inputs: Goal, Output: Result) */}
                        {calcMode === 'contribution' && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                                <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                    <Target size={20} className="text-blue-500" />
                                    <h3>Target Definition</h3>
                                </div>

                                <RangeSlider
                                    label="Target Combined Balance"
                                    value={targetBalance || 0}
                                    min={SuperConstants.TARGET_BALANCE.MIN}
                                    max={SuperConstants.TARGET_BALANCE.MAX}
                                    step={SuperConstants.TARGET_BALANCE.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_TARGET_BALANCE', payload: v })}
                                    formatValue={(v) => formatCurrency(v)}
                                />

                                {/* RESULT DISPLAY */}
                                <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Required Contribution</span>
                                        <p className="text-xs text-indigo-400 mt-0.5">Per person, {isMonthly ? 'monthly' : 'yearly'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-indigo-600">
                                            {results ? formatCurrency(results.pmt / 2) : '$0'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Assumptions (Always Visible) */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700 font-bold mb-3">
                                <TrendingUp size={20} />
                                <h3>Growth Assumptions</h3>
                            </div>
                            <RangeSlider label="Est. Annual Net Return (Accumulation)" value={netReturn} min={SuperConstants.NET_RETURN.MIN} max={SuperConstants.NET_RETURN.MAX} step={SuperConstants.NET_RETURN.STEP} onChange={(v) => dispatch({ type: 'SET_NET_RETURN', payload: v })} formatValue={(v) => `${v.toFixed(1)}%`} />
                        </div>
                    </div>
                )}

                {/* ... (Spend Phase remains the same) ... */}
                {activePhase === 'retirement' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="border-l-4 border-orange-500 bg-orange-50/50 p-4 rounded-r-lg">
                            <div className="flex items-center gap-2 text-orange-900 font-bold mb-4">
                                <Sunset size={20} />
                                <h3>Retirement Goal</h3>
                            </div>
                            <RangeSlider
                                label="Target Retirement Age"
                                value={targetAge}
                                min={SuperConstants.TARGET_AGE.MIN}
                                max={SuperConstants.TARGET_AGE.MAX}
                                step={SuperConstants.TARGET_AGE.STEP}
                                onChange={(v) => dispatch({ type: 'SET_TARGET_AGE', payload: v })}
                            />
                            <div className="mt-4">
                                {/* Optional Goal Balance Slider only if mode is Contribution */}
                                {calcMode === 'contribution' && (
                                    <RangeSlider label="Target Combined Balance" value={targetBalance || 0} min={SuperConstants.TARGET_BALANCE.MIN} max={SuperConstants.TARGET_BALANCE.MAX} step={SuperConstants.TARGET_BALANCE.STEP} onChange={(v) => dispatch({ type: 'SET_TARGET_BALANCE', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                )}
                            </div>
                        </div>

                        {/* 2. Lifestyle Settings (Moved from Results!) */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                                <User size={20} className="text-indigo-500" />
                                <h3>Retirement Lifestyle</h3>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Lifestyle Tier</label>
                                <Tabs
                                    tabs={LIFESTYLE_OPTIONS}
                                    activeTab={drawdownLifestyle}
                                    onTabClick={(id) => dispatch({ type: 'SET_DRAWDOWN_LIFESTYLE', payload: id as any })}
                                    variant="segmented-indigo"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <RangeSlider
                                    label="Annual Spending (Drawdown)"
                                    value={drawdownAnnualAmount}
                                    min={SuperConstants.DRAWDOWN_AMOUNT.MIN}
                                    max={SuperConstants.DRAWDOWN_AMOUNT.MAX}
                                    step={SuperConstants.DRAWDOWN_AMOUNT.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_DRAWDOWN_ANNUAL_AMOUNT', payload: v })}
                                    formatValue={(v) => formatCurrency(v)}
                                />
                                <RangeSlider
                                    label="Est. Annual Return (Retirement)"
                                    value={drawdownReturn}
                                    min={SuperConstants.DRAWDOWN_RETURN.MIN}
                                    max={SuperConstants.DRAWDOWN_RETURN.MAX}
                                    step={SuperConstants.DRAWDOWN_RETURN.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_DRAWDOWN_RETURN', payload: v })}
                                    formatValue={(v) => `${v.toFixed(1)}%`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-center text-red-600 font-medium p-2 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};