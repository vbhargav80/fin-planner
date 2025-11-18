import React, { useState } from 'react';
import { RangeSlider } from '../common/RangeSlider';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';
import { ToggleSwitch } from '../common/ToggleSwitch';
import * as SuperConstants from '../../constants/super';
import { Tabs } from '../common/Tabs';
import { TrendingUp, Sunset, Wallet, PiggyBank, User } from 'lucide-react';

interface SuperFormProps {
    calculator: SuperCalculatorState;
}

export const SuperForm: React.FC<SuperFormProps> = ({ calculator }) => {
    const {
        state,
        dispatch,
        error,
        myContributionPre50,
        myContributionPost50,
        wifeContributionPre50,
        wifeContributionPost50,
    } = calculator;

    const {
        myAge, wifeAge, mySuper, wifeSuper,
        targetAge, targetBalance, netReturn, calcMode, contributionFrequency, makeExtraContribution,
        myExtraYearlyContribution, myExtraContributionYears, wifeExtraYearlyContribution, wifeExtraContributionYears,
        drawdownLifestyle, drawdownAnnualAmount, drawdownReturn
    } = state;

    const [activePhase, setActivePhase] = useState<'accumulation' | 'retirement'>('accumulation');

    // Sub-tabs for "Me" vs "Spouse" contributions
    const [contributorTab, setContributorTab] = useState<'me' | 'spouse'>('me');

    const PHASE_TABS = [
        { id: 'accumulation', label: 'Accumulation Phase' },
        { id: 'retirement', label: 'Retirement Phase' },
    ];

    const CONTRIBUTOR_TABS = [
        { id: 'me', label: 'My Strategy' },
        { id: 'spouse', label: 'Spouse Strategy' },
    ];

    const FREQUENCY_TABS = [
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' },
    ];

    const LIFESTYLE_OPTIONS = [
        { id: 'modest', label: 'Modest' },
        { id: 'comfortable', label: 'Comfortable' },
        { id: 'luxury', label: 'Luxury' },
        { id: 'custom', label: 'Custom' },
    ];

    const isMonthly = contributionFrequency === 'monthly';

    return (
        <div className="md:w-[45%] p-6 sm:p-8 overflow-y-auto flex flex-col h-full">
            <div className="flex-shrink-0">
                <h2 className="text-3xl font-bold text-gray-900">Super Calculator</h2>
                <p className="mt-2 text-gray-600 mb-6">Optimize your super growth and retirement income.</p>

                {/* MAIN PHASE TABS */}
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

                {/* --- ACCUMULATION TAB (BUILDING WEALTH) --- */}
                {activePhase === 'accumulation' && (
                    <div className="space-y-6 animate-fade-in">

                        {/* 1. Current Balances Card */}
                        <div className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-lg">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
                                <Wallet size={20} />
                                <h3>Current Status</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <RangeSlider label="My Age" value={myAge} min={SuperConstants.CURRENT_AGE.MIN} max={SuperConstants.CURRENT_AGE.MAX} step={SuperConstants.CURRENT_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_MY_AGE', payload: v })} />
                                    <div className="mt-4">
                                        <RangeSlider label="My Super Balance" value={mySuper} min={SuperConstants.CURRENT_SUPER.MIN} max={SuperConstants.CURRENT_SUPER.MAX} step={SuperConstants.CURRENT_SUPER.STEP} onChange={(v) => dispatch({ type: 'SET_MY_SUPER', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                </div>
                                <div>
                                    <RangeSlider label="Spouse Age" value={wifeAge} min={SuperConstants.CURRENT_AGE.MIN} max={SuperConstants.CURRENT_AGE.MAX} step={SuperConstants.CURRENT_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_AGE', payload: v })} />
                                    <div className="mt-4">
                                        <RangeSlider label="Spouse Super Balance" value={wifeSuper} min={SuperConstants.CURRENT_SUPER.MIN} max={SuperConstants.CURRENT_SUPER.MAX} step={SuperConstants.CURRENT_SUPER.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_SUPER', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Contribution Strategy (The "Levers") */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                    <PiggyBank size={20} className="text-emerald-500" />
                                    <h3>Contribution Strategy</h3>
                                </div>
                                <div className="w-40">
                                    <Tabs tabs={FREQUENCY_TABS} activeTab={contributionFrequency} onTabClick={(id) => dispatch({ type: 'SET_CONTRIBUTION_FREQUENCY', payload: id as any })} variant="pill" />
                                </div>
                            </div>

                            {/* Person Switcher */}
                            <Tabs tabs={CONTRIBUTOR_TABS} activeTab={contributorTab} onTabClick={(id) => setContributorTab(id as any)} variant="underline" className="mb-4" />

                            {contributorTab === 'me' ? (
                                <div className="space-y-5 animate-fade-in">
                                    <RangeSlider label={`My ${isMonthly ? 'Monthly' : 'Yearly'} Contrib. (Pre-50)`} value={myContributionPre50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_CONTRIBUTION_PRE_50', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    <RangeSlider label={`My ${isMonthly ? 'Monthly' : 'Yearly'} Contrib. (Post-50)`} value={myContributionPost50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_CONTRIBUTION_POST_50', payload: v })} formatValue={(v) => formatCurrency(v)} />

                                    <div className="pt-4 border-t border-gray-100">
                                        <ToggleSwitch label="Add One-off Lump Sums?" checked={makeExtraContribution} onChange={(v) => dispatch({ type: 'SET_MAKE_EXTRA_CONTRIBUTION', payload: v })} />
                                        {makeExtraContribution && (
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <RangeSlider label="Extra Annual Amount" value={myExtraYearlyContribution} min={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MIN} max={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MAX} step={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_MY_EXTRA_YEARLY_CONTRIBUTION', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                                <RangeSlider label="Duration (Years)" value={myExtraContributionYears} min={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MIN} max={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MAX} step={SuperConstants.EXTRA_CONTRIBUTION_YEARS.STEP} onChange={(v) => dispatch({ type: 'SET_MY_EXTRA_CONTRIBUTION_YEARS', payload: v })} formatValue={(v) => `${v} yrs`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-fade-in">
                                    <RangeSlider label={`Spouse ${isMonthly ? 'Monthly' : 'Yearly'} Contrib. (Pre-50)`} value={wifeContributionPre50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_CONTRIBUTION_PRE_50', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                    <RangeSlider label={`Spouse ${isMonthly ? 'Monthly' : 'Yearly'} Contrib. (Post-50)`} value={wifeContributionPost50} min={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MIN : SuperConstants.YEARLY_CONTRIBUTION.MIN} max={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.MAX : SuperConstants.YEARLY_CONTRIBUTION.MAX} step={isMonthly ? SuperConstants.MONTHLY_CONTRIBUTION.STEP : SuperConstants.YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_CONTRIBUTION_POST_50', payload: v })} formatValue={(v) => formatCurrency(v)} />

                                    <div className="pt-4 border-t border-gray-100">
                                        <ToggleSwitch label="Add One-off Lump Sums?" checked={makeExtraContribution} onChange={(v) => dispatch({ type: 'SET_MAKE_EXTRA_CONTRIBUTION', payload: v })} />
                                        {makeExtraContribution && (
                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <RangeSlider label="Extra Annual Amount" value={wifeExtraYearlyContribution} min={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MIN} max={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.MAX} step={SuperConstants.EXTRA_YEARLY_CONTRIBUTION.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_EXTRA_YEARLY_CONTRIBUTION', payload: v })} formatValue={(v) => formatCurrency(v)} />
                                                <RangeSlider label="Duration (Years)" value={wifeExtraContributionYears} min={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MIN} max={SuperConstants.EXTRA_CONTRIBUTION_YEARS.MAX} step={SuperConstants.EXTRA_CONTRIBUTION_YEARS.STEP} onChange={(v) => dispatch({ type: 'SET_WIFE_EXTRA_CONTRIBUTION_YEARS', payload: v })} formatValue={(v) => `${v} yrs`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Growth Assumptions */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700 font-bold mb-3">
                                <TrendingUp size={20} />
                                <h3>Growth Assumptions</h3>
                            </div>
                            <RangeSlider label="Est. Annual Net Return (Accumulation)" value={netReturn} min={SuperConstants.NET_RETURN.MIN} max={SuperConstants.NET_RETURN.MAX} step={SuperConstants.NET_RETURN.STEP} onChange={(v) => dispatch({ type: 'SET_NET_RETURN', payload: v })} formatValue={(v) => `${v.toFixed(1)}%`} />
                        </div>
                    </div>
                )}

                {/* --- RETIREMENT TAB (INCOME) --- */}
                {activePhase === 'retirement' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* 1. The Goal */}
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