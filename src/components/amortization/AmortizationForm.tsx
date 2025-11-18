import React, { useState } from 'react';
import { InputGroup } from '../common/InputGroup';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { RangeSlider } from '../common/RangeSlider';
import { Tabs } from '../common/Tabs';
import type { AmortizationCalculatorState } from '../../types/amortization.types';
import * as AmortizationConstants from '../../constants/amortization';
import { Briefcase, Wallet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AmortizationFormProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationForm: React.FC<AmortizationFormProps> = ({ calculator }) => {
    const [activeTab, setActiveTab] = React.useState<'loan' | 'cashflow' | 'assumptions' | 'strategies'>('loan');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const TABS = [
        { id: 'loan', label: 'Loan' },
        { id: 'cashflow', label: 'Cashflow' },
        { id: 'assumptions', label: 'Assumptions' },
        { id: 'strategies', label: 'Strategies' },
    ];

    const {
        state,
        dispatch,
        actualMonthlyRepayment,
        calculateOptimalExpenditure,
        calculateOptimalWorkingYears,
        calculateOptimalOffsetBalance, // NEW
    } = calculator;

    const { interestRate, principal, monthlyRepayment, initialRentalIncome, initialOffsetBalance, monthlyExpenditure, monthlyExpenditurePre2031, rentalGrowthRate, isRefinanced, considerOffsetIncome, offsetIncomeRate, continueWorking, yearsWorking, netIncome } = state;

    const handleOptimizeExpenditure = () => {
        const result = calculateOptimalExpenditure();
        setSuccessMsg(`Expenditure optimized to ${formatCurrency(result)}/mo`);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    const handleOptimizeWork = () => {
        const { years, income } = calculateOptimalWorkingYears();
        setSuccessMsg(`Plan set: Work ${years} years earning ${formatCurrency(income)}/mo`);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    // NEW Handler
    const handleOptimizeOffset = () => {
        const result = calculateOptimalOffsetBalance();
        const increase = result - initialOffsetBalance;
        const msg = increase > 0
            ? `Offset increased by ${formatCurrency(increase)} to ${formatCurrency(result)}`
            : `Offset optimized to ${formatCurrency(result)}`;
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    return (
        <div className="md:w-[35%] p-6 sm:p-8 bg-white/95 backdrop-blur md:sticky md:top-[4rem] md:self-start md:h-[calc(100vh-4rem)] md:overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">Amortization Calculator</h2>
            <p className="mt-2 text-gray-600">Monthly schedule from Jan 2026 to Dec 2040. Results update automatically.</p>

            <Tabs tabs={TABS} variant="pill" activeTab={activeTab} onTabClick={(id) => setActiveTab(id as any)} className="mt-6" />

            <div className="mt-8 space-y-6">
                {activeTab === 'loan' && (
                    <section className="animate-fade-in">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                            <RangeSlider
                                label="Starting Loan"
                                value={principal}
                                min={AmortizationConstants.PRINCIPAL.MIN}
                                max={AmortizationConstants.PRINCIPAL.MAX}
                                step={AmortizationConstants.PRINCIPAL.STEP}
                                onChange={(v) => dispatch({ type: 'SET_PRINCIPAL', payload: v })}
                            />
                            <RangeSlider
                                label="Starting Offset"
                                value={initialOffsetBalance}
                                min={AmortizationConstants.OFFSET_BALANCE.MIN}
                                max={AmortizationConstants.OFFSET_BALANCE.MAX}
                                step={AmortizationConstants.OFFSET_BALANCE.STEP}
                                onChange={(v) => dispatch({ type: 'SET_INITIAL_OFFSET_BALANCE', payload: v })}
                            />
                            <RangeSlider
                                label="Interest Rate"
                                value={interestRate}
                                min={AmortizationConstants.INTEREST_RATE.MIN}
                                max={AmortizationConstants.INTEREST_RATE.MAX}
                                step={0.01}
                                onChange={(v) => dispatch({ type: 'SET_INTEREST_RATE', payload: v })}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'cashflow' && (
                    <section className="animate-fade-in">
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">Incomings</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RangeSlider
                                        label="Net Rent"
                                        value={initialRentalIncome}
                                        min={AmortizationConstants.INITIAL_RENTAL_INCOME.MIN}
                                        max={AmortizationConstants.INITIAL_RENTAL_INCOME.MAX}
                                        step={AmortizationConstants.INITIAL_RENTAL_INCOME.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_INITIAL_RENTAL_INCOME', payload: v })}
                                    />
                                    <RangeSlider
                                        label="Net Income (while working)"
                                        value={netIncome}
                                        min={AmortizationConstants.NET_INCOME.MIN}
                                        max={AmortizationConstants.NET_INCOME.MAX}
                                        step={AmortizationConstants.NET_INCOME.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_NET_INCOME', payload: v })}
                                        disabled={!continueWorking}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">Outgoings</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RangeSlider
                                        label="Monthly Expenditure"
                                        value={monthlyExpenditure}
                                        min={AmortizationConstants.MONTHLY_EXPENDITURE.MIN}
                                        max={AmortizationConstants.MONTHLY_EXPENDITURE.MAX}
                                        step={AmortizationConstants.MONTHLY_EXPENDITURE.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_MONTHLY_EXPENDITURE', payload: v })}
                                    />
                                    <RangeSlider
                                        label="Monthly Expenditure Pre 2031"
                                        value={monthlyExpenditurePre2031}
                                        min={AmortizationConstants.MONTHLY_EXPENDITURE_PRE_2031.MIN}
                                        max={AmortizationConstants.MONTHLY_EXPENDITURE_PRE_2031.MAX}
                                        step={AmortizationConstants.MONTHLY_EXPENDITURE_PRE_2031.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_MONTHLY_EXPENDITURE_PRE_2031', payload: v })}
                                    />
                                    <RangeSlider
                                        label="Monthly Repayment"
                                        value={isRefinanced ? actualMonthlyRepayment : monthlyRepayment}
                                        min={AmortizationConstants.MONTHLY_REPAYMENT.MIN}
                                        max={AmortizationConstants.MONTHLY_REPAYMENT.MAX}
                                        step={AmortizationConstants.MONTHLY_REPAYMENT.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_MONTHLY_REPAYMENT', payload: v })}
                                        disabled={isRefinanced}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'assumptions' && (
                    <section className="animate-fade-in">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                <RangeSlider
                                    label="Annual Rental Growth"
                                    value={rentalGrowthRate}
                                    min={AmortizationConstants.RENTAL_GROWTH_RATE.MIN}
                                    max={AmortizationConstants.RENTAL_GROWTH_RATE.MAX}
                                    step={AmortizationConstants.RENTAL_GROWTH_RATE.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_RENTAL_GROWTH_RATE', payload: v })}
                                />
                                <ToggleSwitch
                                    label="Refinance for 25-year term"
                                    checked={isRefinanced}
                                    onChange={(v) => dispatch({ type: 'SET_IS_REFINANCED', payload: v })}
                                />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                <ToggleSwitch
                                    label="Consider Offset Interest Income"
                                    checked={considerOffsetIncome}
                                    onChange={(v) => dispatch({ type: 'SET_CONSIDER_OFFSET_INCOME', payload: v })}
                                />
                                {considerOffsetIncome && (
                                    <InputGroup
                                        label="Offset Income Rate"
                                        id="offsetIncomeRate"
                                        value={offsetIncomeRate}
                                        onChange={(v) => dispatch({ type: 'SET_OFFSET_INCOME_RATE', payload: v })}
                                        step="0.1"
                                        symbol="%"
                                        symbolPosition="right"
                                    />
                                )}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                <ToggleSwitch
                                    label="Continue Working"
                                    checked={continueWorking}
                                    onChange={(v) => dispatch({ type: 'SET_CONTINUE_WORKING', payload: v })}
                                />
                                {continueWorking && (
                                    <RangeSlider
                                        label="Number of years"
                                        value={yearsWorking}
                                        min={AmortizationConstants.YEARS_WORKING.MIN}
                                        max={AmortizationConstants.YEARS_WORKING.MAX}
                                        step={AmortizationConstants.YEARS_WORKING.STEP}
                                        onChange={(v) => dispatch({ type: 'SET_YEARS_WORKING', payload: v })}
                                        disabled={!continueWorking}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'strategies' && (
                    <section className="animate-fade-in space-y-4">
                        {/* NEW Strategy Card */}
                        <div
                            onClick={handleOptimizeOffset}
                            className="group bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">Secure Offset Longevity</h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                        Calculate the starting offset balance required to ensure your funds last until the end of the loan term.
                                    </p>
                                    <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-medium text-gray-500 border border-gray-200">
                                        Current: {formatCurrency(initialOffsetBalance)}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors" />
                        </div>

                        <div
                            onClick={handleOptimizeExpenditure}
                            className="group bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">Maximize Lifestyle</h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                        Find the maximum monthly expenditure you can afford while still zeroing out your loan by the end of the term.
                                    </p>
                                    <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-medium text-gray-500 border border-gray-200">
                                        Current: {formatCurrency(monthlyExpenditure)}/mo
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors" />
                        </div>

                        <div
                            onClick={handleOptimizeWork}
                            className="group bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">Minimize Work Required</h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                        Calculate the minimum working years and income required to meet your loan obligations safely.
                                    </p>
                                    <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-medium text-gray-500 border border-gray-200">
                                        Current: {yearsWorking} years @ {formatCurrency(netIncome)}/mo
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors" />
                        </div>

                        {successMsg && (
                            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:absolute md:bottom-0 md:left-0 md:w-full md:translate-x-0 p-4 animate-in slide-in-from-bottom-4 fade-in z-50">
                                <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center justify-center gap-2 text-sm font-medium">
                                    <CheckCircle2 size={18} className="text-green-400" />
                                    {successMsg}
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};