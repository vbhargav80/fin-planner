// File: src/components/super/SuperForm.tsx
import React from 'react';
import { RangeSlider } from '../common/RangeSlider';
import PersonTabsPanel from '../PersonTabsPanel';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';
import { ToggleSwitch } from '../common/ToggleSwitch';
import * as SuperConstants from '../../constants/super';
import { PersonDetailsCard } from './PersonDetailsCard';
import { Tabs } from '../common/Tabs';
import { TrendingUp } from 'lucide-react';

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
        targetAge, targetBalance, netReturn, calcMode, contributionFrequency, makeExtraContribution
    } = state;

    const isMonthly = contributionFrequency === 'monthly';
    const isBalanceMode = state.calcMode === 'balance';

    const CALC_MODE_TABS = [
        { id: 'contribution', label: 'Calculate Contribution' },
        { id: 'balance', label: 'Calculate Balance' },
    ];
    const FREQUENCY_TABS = [
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' },
    ];

    return (
        <div className="md:w-[45%] p-6 sm:p-8 overflow-y-auto flex flex-col h-full">
            <div className="flex-shrink-0">
                <h2 className="text-3xl font-bold text-gray-900">Super Calculator</h2>
                <p className="mt-2 text-gray-600 mb-6">Plan your journey to retirement.</p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                <div className="space-y-6 animate-fade-in">
                    {/* 1. Strategy Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Strategy Goal</label>
                        <Tabs
                            tabs={CALC_MODE_TABS}
                            activeTab={calcMode}
                            onTabClick={(id) => dispatch({ type: 'SET_CALC_MODE', payload: id as any })}
                            variant="pill"
                        />
                    </div>

                    {/* 2. Personal Details (Current State) */}
                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Current Situation</h3>
                        <PersonDetailsCard
                            state={state}
                            dispatch={dispatch}
                            myContributionPre50={myContributionPre50}
                            myContributionPost50={myContributionPost50}
                            wifeContributionPre50={wifeContributionPre50}
                            wifeContributionPost50={wifeContributionPost50}
                            isBalanceMode={isBalanceMode}
                            isMonthly={isMonthly}
                        />
                    </div>

                    {/* 3. Assumptions (Future State) */}
                    <PersonTabsPanel>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-500" />
                            Future Assumptions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div className="sm:col-span-2">
                                <RangeSlider
                                    label="Target Retirement Age"
                                    value={targetAge}
                                    min={SuperConstants.TARGET_AGE.MIN}
                                    max={SuperConstants.TARGET_AGE.MAX}
                                    step={SuperConstants.TARGET_AGE.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_TARGET_AGE', payload: v })}
                                />
                            </div>
                            {calcMode === 'contribution' && (
                                <div className="sm:col-span-2">
                                    <RangeSlider
                                        label="Target Combined Balance"
                                        value={targetBalance}
                                        min={SuperConstants.TARGET_BALANCE.MIN}
                                        max={SuperConstants.TARGET_BALANCE.MAX}
                                        step={SuperConstants.TARGET_BALANCE.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_TARGET_BALANCE', payload: v })}
                                        formatValue={(v) => formatCurrency(v)}
                                    />
                                </div>
                            )}
                            <div className="sm:col-span-2">
                                <RangeSlider
                                    label="Annual Return (Accumulation)"
                                    value={netReturn}
                                    min={SuperConstants.NET_RETURN.MIN}
                                    max={SuperConstants.NET_RETURN.MAX}
                                    step={SuperConstants.NET_RETURN.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_NET_RETURN', payload: v })}
                                    formatValue={(v) => `${v.toFixed(1)}%`}
                                />
                            </div>

                            {isBalanceMode && (
                                <>
                                    <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Settings</label>
                                        <Tabs
                                            tabs={FREQUENCY_TABS}
                                            activeTab={contributionFrequency}
                                            onTabClick={(id) => dispatch({ type: 'SET_CONTRIBUTION_FREQUENCY', payload: id as any })}
                                            variant="segmented"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <ToggleSwitch
                                            label="Make Concessional Contributions"
                                            checked={makeExtraContribution}
                                            onChange={(v) => dispatch({ type: 'SET_MAKE_EXTRA_CONTRIBUTION', payload: v })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </PersonTabsPanel>
                </div>

                {error && (
                    <div className="mt-4 text-center text-red-600 font-medium p-2 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};