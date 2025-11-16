import React from 'react';
import { RangeSlider } from '../common/RangeSlider';
import PersonTabsPanel from '../PersonTabsPanel';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { PersonDetailsCard } from './PersonDetailsCard';

interface SuperFormProps {
    calculator: SuperCalculatorState;
}

export const SuperForm: React.FC<SuperFormProps> = ({ calculator }) => {
    const {
        targetAge, setTargetAge,
        targetBalance, setTargetBalance,
        netReturn, setNetReturn,
        calcMode, setCalcMode,
        contributionFrequency, setContributionFrequency,
        makeExtraContribution, setMakeExtraContribution,
        error
    } = calculator;

    const isMonthly = contributionFrequency === 'monthly';
    const isBalanceMode = calcMode === 'balance';

    return (
        <div className="md:w-[45%] p-6 sm:p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">Superannuation Goal Calculator</h2>
            <p className="mt-2 text-gray-600">Enter your details below to see your projection. The results will update automatically.</p>

            <div className="mt-8 space-y-6">
                {/* Calculation type toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Calculation Type</label>
                    <div className="mt-1 flex w-full gap-1 rounded-full bg-gray-900 p-1 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setCalcMode('contribution')}
                            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                                calcMode === 'contribution' ? 'bg-white text-gray-900 border-gray-900 shadow-sm' : 'bg-transparent text-white border-transparent hover:bg-gray-700'
                            }`}
                        >
                            Calculate Contribution
                        </button>
                        <button
                            type="button"
                            onClick={() => setCalcMode('balance')}
                            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                                calcMode === 'balance' ? 'bg-white text-gray-900 border-gray-900 shadow-sm' : 'bg-transparent text-white border-transparent hover:bg-gray-700'
                            }`}
                        >
                            Calculate Balance
                        </button>
                    </div>
                </div>

                {/* Goals & Assumptions Panel */}
                <PersonTabsPanel>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Assumptions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="sm:col-span-2">
                            <RangeSlider label="Target Retirement Age" value={targetAge} min={58} max={65} step={1} onChange={setTargetAge} />
                        </div>
                        {calcMode === 'contribution' && (
                            <div className="sm:col-span-2">
                                <RangeSlider label="Target Combined Balance" value={targetBalance} min={1400000} max={1700000} step={50000} onChange={setTargetBalance} formatValue={(v) => formatCurrency(v)} />
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <RangeSlider label="Est. Annual Net Return (after fees)" value={netReturn} min={5} max={8} step={0.1} onChange={setNetReturn} formatValue={(v) => `${v.toFixed(1)}%`} />
                        </div>
                        {isBalanceMode && (
                            <>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Contribution Frequency</label>
                                    <div className="mt-1 flex w-full gap-1 rounded-full bg-teal-50 p-1 shadow-inner">
                                        <button type="button" onClick={() => setContributionFrequency('monthly')} className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${isMonthly ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-transparent text-teal-700 border-transparent hover:bg-teal-100'}`}>Monthly</button>
                                        <button type="button" onClick={() => setContributionFrequency('yearly')} className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${!isMonthly ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-transparent text-teal-700 border-transparent hover:bg-teal-100'}`}>Yearly</button>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <ToggleSwitch label="Make Concessional Contributions" checked={makeExtraContribution} onChange={setMakeExtraContribution} />
                                </div>
                            </>
                        )}
                    </div>
                </PersonTabsPanel>

                {/* Personal Details Section */}
                <PersonDetailsCard
                    {...calculator}
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
