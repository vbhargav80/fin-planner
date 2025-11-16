import React from 'react';
import { RangeSlider } from '../common/RangeSlider';
import PersonTabsPanel from '../PersonTabsPanel';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';
import { ToggleSwitch } from '../common/ToggleSwitch';
import * as SuperConstants from '../../constants/super';
import { PersonDetailsCard } from './PersonDetailsCard';
import { Tabs } from '../common/Tabs';

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

    const { targetAge, targetBalance, netReturn, calcMode, contributionFrequency, makeExtraContribution } = state;
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
        <div className="md:w-[45%] p-6 sm:p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">Superannuation Goal Calculator</h2>
            <p className="mt-2 text-gray-600">Enter your details below to see your projection. The results will update automatically.</p>

            <div className="mt-8 space-y-6">
                {/* Calculation type toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Calculation Type</label>
                    <Tabs tabs={CALC_MODE_TABS} activeTab={calcMode} onTabClick={(id) => dispatch({ type: 'SET_CALC_MODE', payload: id as any })} variant="pill" className="mt-1" />
                </div>

                {/* Goals & Assumptions Panel */}
                <PersonTabsPanel>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Assumptions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="sm:col-span-2">
                            <RangeSlider label="Target Retirement Age" value={targetAge} min={SuperConstants.TARGET_AGE.MIN} max={SuperConstants.TARGET_AGE.MAX} step={SuperConstants.TARGET_AGE.STEP} onChange={(v) => dispatch({ type: 'SET_TARGET_AGE', payload: v })} />
                        </div>
                        {calcMode === 'contribution' && (
                            <div className="sm:col-span-2">
                                <RangeSlider label="Target Combined Balance" value={targetBalance} min={SuperConstants.TARGET_BALANCE.MIN} max={SuperConstants.TARGET_BALANCE.MAX} step={SuperConstants.TARGET_BALANCE.STEP} onChange={(v) => dispatch({ type: 'SET_TARGET_BALANCE', payload: v })} formatValue={(v) => formatCurrency(v)} />
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <RangeSlider label="Est. Annual Net Return (after fees)" value={netReturn} min={SuperConstants.NET_RETURN.MIN} max={SuperConstants.NET_RETURN.MAX} step={SuperConstants.NET_RETURN.STEP} onChange={(v) => dispatch({ type: 'SET_NET_RETURN', payload: v })} formatValue={(v) => `${v.toFixed(1)}%`} />
                        </div>
                        {isBalanceMode && (
                            <>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Contribution Frequency</label>
                                    <Tabs tabs={FREQUENCY_TABS} activeTab={contributionFrequency} onTabClick={(id) => dispatch({ type: 'SET_CONTRIBUTION_FREQUENCY', payload: id as any })} variant="segmented" className="mt-1" />
                                </div>
                                <div className="sm:col-span-2">
                                    <ToggleSwitch label="Make Concessional Contributions" checked={makeExtraContribution} onChange={(v) => dispatch({ type: 'SET_MAKE_EXTRA_CONTRIBUTION', payload: v })} />
                                </div>
                            </>
                        )}
                    </div>
                </PersonTabsPanel>

                {/* Personal Details Section */}
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

                {error && (
                    <div className="mt-4 text-center text-red-600 font-medium">{error}</div>
                )}
            </div>
        </div>
    );
};
