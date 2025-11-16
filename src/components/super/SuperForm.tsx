import React from 'react';
import { RangeSlider } from '../common/RangeSlider';
import PersonTabsPanel from '../PersonTabsPanel';
import { formatCurrency } from '../../utils/formatters';
import type { SuperCalculatorState } from '../../types/super.types';

interface SuperFormProps {
    calculator: SuperCalculatorState;
}

export const SuperForm: React.FC<SuperFormProps> = ({ calculator }) => {
    const {
        myAge, setMyAge,
        wifeAge, setWifeAge,
        mySuper, setMySuper,
        wifeSuper, setWifeSuper,
        targetAge, setTargetAge,
        targetBalance, setTargetBalance,
        monthlyContribution, setMonthlyContribution,
        monthlyContributionPost50, setMonthlyContributionPost50,
        netReturn, setNetReturn,
        calcMode, setCalcMode,
        error
    } = calculator;

    const [activePersonTab, setActivePersonTab] = React.useState<'self' | 'spouse'>('self');

    return (
        <div className="md:w-[35%] p-6 sm:p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">Superannuation Goal Calculator</h2>
            <p className="mt-2 text-gray-600">Enter your details below to see your projection. The results will update automatically.</p>

            <div className="mt-8 space-y-5">
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

                {/* Person tabs panel (using reusable component) */}
                <PersonTabsPanel>
                    <div className="flex w-full gap-1 rounded-full bg-indigo-50 p-1 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setActivePersonTab('self')}
                            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                                activePersonTab === 'self' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-transparent text-indigo-700 border-transparent hover:bg-indigo-100'
                            }`}
                        >
                            You
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePersonTab('spouse')}
                            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                                activePersonTab === 'spouse' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-transparent text-indigo-700 border-transparent hover:bg-indigo-100'
                            }`}
                        >
                            Spouse
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        {activePersonTab === 'self' && (
                            <>
                                <RangeSlider label="Current Age" value={Number(myAge)} min={45} max={60} step={1} onChange={(n) => setMyAge(String(n))} />
                                <RangeSlider label="Current Super" value={Number(mySuper)} min={380000} max={450000} step={5000} onChange={(n) => setMySuper(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </>
                        )}

                        {activePersonTab === 'spouse' && (
                            <>
                                <RangeSlider label="Current Age" value={Number(wifeAge)} min={42} max={60} step={1} onChange={(n) => setWifeAge(String(n))} />
                                <RangeSlider label="Current Super" value={Number(wifeSuper)} min={100000} max={150000} step={5000} onChange={(n) => setWifeSuper(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </>
                        )}
                    </div>
                </PersonTabsPanel>

                {/* Shared goal & contribution inputs (with sliders) */}
                <PersonTabsPanel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="sm:col-span-2">
                            <RangeSlider label="Target Retirement Age" value={Number(targetAge)} min={58} max={65} step={1} onChange={(n) => setTargetAge(String(n))} />
                        </div>

                        {calcMode === 'balance' && (
                            <>
                                <RangeSlider label="Monthly Contribution (Pre-50)" value={Number(monthlyContribution)} min={300} max={1500} step={100} onChange={(n) => setMonthlyContribution(String(n))} formatValue={(v) => formatCurrency(v)} />
                                <RangeSlider label="Monthly Contribution (Post-50)" value={Number(monthlyContributionPost50)} min={0} max={1000} step={100} onChange={(n) => setMonthlyContributionPost50(String(n))} formatValue={(v) => formatCurrency(v)} />
                            </>
                        )}

                        <div className={calcMode === 'contribution' ? 'sm:col-span-2' : 'sm:col-span-2'}>
                            <RangeSlider label="Est. Annual Net Return (after fees)" value={Number(netReturn)} min={5} max={8} step={0.1} onChange={(n) => setNetReturn(String(Number(n.toFixed(1))))} formatValue={(v) => `${v}%`} />
                        </div>
                    </div>
                </PersonTabsPanel>


                {/* Move Target Combined Balance to the bottom of the form for better flow */}
                {calcMode === 'contribution' && (
                    <PersonTabsPanel>
                        <RangeSlider label="Target Combined Balance" value={Number(targetBalance)} min={1400000} max={1700000} step={50000} onChange={(n) => setTargetBalance(String(n))} formatValue={(v) => formatCurrency(v)} />
                    </PersonTabsPanel>
                )}

                {error && (
                    <div className="mt-4 text-center text-red-600 font-medium">{error}</div>
                )}
            </div>
        </div>
    );
};
