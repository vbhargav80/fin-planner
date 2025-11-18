import React, { useState } from 'react';
import { InputGroup } from '../common/InputGroup';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { RangeSlider } from '../common/RangeSlider';
import { MonthYearPicker } from '../common/MonthYearPicker';
import { Tabs } from '../common/Tabs';
import type { AmortizationCalculatorState } from '../../types/amortization.types';
import * as AmortizationConstants from '../../constants/amortization';
import { Wallet, CheckCircle2, ShieldCheck, Briefcase, ArrowRight, Sun, Sunset } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AmortizationFormProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationForm: React.FC<AmortizationFormProps> = ({ calculator }) => {
    const [activeTab, setActiveTab] = useState<'loan' | 'cashflow' | 'assumptions' | 'strategies'>('loan');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const TABS = [
        { id: 'loan', label: 'Loan' },
        { id: 'cashflow', label: 'Cashflow & Life' },
        { id: 'assumptions', label: 'Assumptions' },
        { id: 'strategies', label: 'Strategies' },
    ];

    const {
        state,
        dispatch,
        actualMonthlyRepayment,
        calculateOptimalExpenditure,
        calculateOptimalOffsetBalance,
        calculateOptimalWorkingYears,
    } = calculator;

    const {
        interestRate, principal, monthlyRepayment, initialRentalIncome,
        initialOffsetBalance,
        retirementLivingExpenses, currentLivingExpenses,
        rentalGrowthRate, isRefinanced, considerOffsetIncome, offsetIncomeRate,
        continueWorking, yearsWorking, monthlySalary, transitionalSalary, retirementDate
    } = state;

    const handleOptimizeExpenditure = () => {
        const result = calculateOptimalExpenditure();
        setSuccessMsg(`Retirement expenditure optimized to ${formatCurrency(result)}/mo`);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    const handleOptimizeOffset = () => {
        const result = calculateOptimalOffsetBalance();
        setSuccessMsg(`Required Offset: ${formatCurrency(result)}`);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    const handleOptimizeWork = () => {
        const { years, income } = calculateOptimalWorkingYears();
        setSuccessMsg(`Plan set: Work ${years} years earning ${formatCurrency(income)}/mo`);
        setTimeout(() => setSuccessMsg(null), 4000);
    };

    return (
        <div className="md:w-[35%] p-6 sm:p-8 bg-white/95 backdrop-blur md:sticky md:top-[4rem] md:self-start md:h-[calc(100vh-4rem)] md:overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">Amortization Calculator</h2>
            <p className="mt-2 text-gray-600">Monthly schedule to 2040.</p>

            <Tabs tabs={TABS} variant="pill" activeTab={activeTab} onTabClick={(id) => setActiveTab(id as any)} className="mt-6" />

            <div className="mt-8 space-y-6">
                {activeTab === 'loan' && (
                    <section className="animate-fade-in bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        <RangeSlider label="Starting Loan" value={principal} min={AmortizationConstants.PRINCIPAL.MIN} max={AmortizationConstants.PRINCIPAL.MAX} step={AmortizationConstants.PRINCIPAL.STEP} onChange={(v) => dispatch({ type: 'SET_PRINCIPAL', payload: v })} />
                        <RangeSlider label="Starting Offset" value={initialOffsetBalance} min={AmortizationConstants.OFFSET_BALANCE.MIN} max={AmortizationConstants.OFFSET_BALANCE.MAX} step={AmortizationConstants.OFFSET_BALANCE.STEP} onChange={(v) => dispatch({ type: 'SET_INITIAL_OFFSET_BALANCE', payload: v })} />
                        <RangeSlider label="Interest Rate" value={interestRate} min={AmortizationConstants.INTEREST_RATE.MIN} max={AmortizationConstants.INTEREST_RATE.MAX} step={0.01} onChange={(v) => dispatch({ type: 'SET_INTEREST_RATE', payload: v })} />
                        <RangeSlider label="Loan Repayment" value={isRefinanced ? actualMonthlyRepayment : monthlyRepayment} min={AmortizationConstants.MONTHLY_REPAYMENT.MIN} max={AmortizationConstants.MONTHLY_REPAYMENT.MAX} step={AmortizationConstants.MONTHLY_REPAYMENT.STEP} onChange={(v) => dispatch({ type: 'SET_MONTHLY_REPAYMENT', payload: v })} disabled={isRefinanced} />
                    </section>
                )}

                {activeTab === 'cashflow' && (
                    <section className="animate-fade-in space-y-6">

                        {/* Phase 1: Career */}
                        <div className="border-l-4 border-indigo-500 bg-indigo-50/50 p-4 rounded-r-lg">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
                                <Briefcase size={20} />
                                <h3>Phase 1: Career</h3>
                            </div>
                            <div className="space-y-4">
                                <RangeSlider label="Monthly Salary" value={monthlySalary} min={AmortizationConstants.MONTHLY_SALARY.MIN} max={AmortizationConstants.MONTHLY_SALARY.MAX} step={AmortizationConstants.MONTHLY_SALARY.STEP} onChange={(v) => dispatch({ type: 'SET_MONTHLY_SALARY', payload: v })} />
                                <RangeSlider label="Current Living Expenses" value={currentLivingExpenses} min={AmortizationConstants.CURRENT_LIVING_EXPENSES.MIN} max={AmortizationConstants.CURRENT_LIVING_EXPENSES.MAX} step={AmortizationConstants.CURRENT_LIVING_EXPENSES.STEP} onChange={(v) => dispatch({ type: 'SET_CURRENT_LIVING_EXPENSES', payload: v })} />
                                <RangeSlider label="Rental Income" value={initialRentalIncome} min={AmortizationConstants.INITIAL_RENTAL_INCOME.MIN} max={AmortizationConstants.INITIAL_RENTAL_INCOME.MAX} step={AmortizationConstants.INITIAL_RENTAL_INCOME.STEP} onChange={(v) => dispatch({ type: 'SET_INITIAL_RENTAL_INCOME', payload: v })} />
                            </div>
                            <div className="mt-6 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                                <MonthYearPicker label="Career Ends On (Retirement Date)" value={retirementDate} onChange={(v) => dispatch({ type: 'SET_RETIREMENT_DATE', payload: v })} minYear={2026} maxYear={2040} />
                            </div>
                        </div>

                        <div className="flex justify-center -my-2 text-gray-300"><ArrowRight className="rotate-90" /></div>

                        {/* Phase 2: Transition */}
                        <div className={`border-l-4 ${continueWorking ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-300 bg-gray-50'} p-4 rounded-r-lg transition-colors`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className={`flex items-center gap-2 font-bold ${continueWorking ? 'text-emerald-900' : 'text-gray-500'}`}>
                                    <Sun size={20} />
                                    <h3>Phase 2: Transition</h3>
                                </div>
                                <ToggleSwitch label="" checked={continueWorking} onChange={(v) => dispatch({ type: 'SET_CONTINUE_WORKING', payload: v })} />
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Optional period of extended work or semi-retirement after the date above.</p>

                            {continueWorking && (
                                <div className="space-y-4 animate-fade-in">
                                    <RangeSlider label="Duration (Years)" value={yearsWorking} min={AmortizationConstants.YEARS_WORKING.MIN} max={AmortizationConstants.YEARS_WORKING.MAX} step={AmortizationConstants.YEARS_WORKING.STEP} onChange={(v) => dispatch({ type: 'SET_YEARS_WORKING', payload: v })} />
                                    <RangeSlider label="Transitional Salary" value={transitionalSalary} min={AmortizationConstants.TRANSITIONAL_SALARY.MIN} max={AmortizationConstants.TRANSITIONAL_SALARY.MAX} step={AmortizationConstants.TRANSITIONAL_SALARY.STEP} onChange={(v) => dispatch({ type: 'SET_TRANSITIONAL_SALARY', payload: v })} />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center -my-2 text-gray-300"><ArrowRight className="rotate-90" /></div>

                        {/* Phase 3: Full Retirement */}
                        <div className="border-l-4 border-orange-500 bg-orange-50/50 p-4 rounded-r-lg">
                            <div className="flex items-center gap-2 text-orange-900 font-bold mb-4">
                                <Sunset size={20} />
                                <h3>Phase 3: Full Retirement</h3>
                            </div>
                            <div className="space-y-4">
                                <RangeSlider label="Retirement Living Expenses" value={retirementLivingExpenses} min={AmortizationConstants.RETIREMENT_LIVING_EXPENSES.MIN} max={AmortizationConstants.RETIREMENT_LIVING_EXPENSES.MAX} step={AmortizationConstants.RETIREMENT_LIVING_EXPENSES.STEP} onChange={(v) => dispatch({ type: 'SET_RETIREMENT_LIVING_EXPENSES', payload: v })} />
                                <div className="pt-2 border-t border-orange-200/50">
                                    <ToggleSwitch label="Refinance at Start of Phase?" checked={isRefinanced} onChange={(v) => dispatch({ type: 'SET_IS_REFINANCED', payload: v })} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'assumptions' && (
                    <section className="animate-fade-in bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                        <RangeSlider label="Annual Rental Growth" value={rentalGrowthRate} min={AmortizationConstants.RENTAL_GROWTH_RATE.MIN} max={AmortizationConstants.RENTAL_GROWTH_RATE.MAX} step={AmortizationConstants.RENTAL_GROWTH_RATE.STEP} onChange={(v) => dispatch({ type: 'SET_RENTAL_GROWTH_RATE', payload: v })} />
                        <div className="pt-4 border-t border-gray-200">
                            <ToggleSwitch label="Consider Offset Interest Income" checked={considerOffsetIncome} onChange={(v) => dispatch({ type: 'SET_CONSIDER_OFFSET_INCOME', payload: v })} />
                            {considerOffsetIncome && (
                                <InputGroup label="Offset Income Rate" id="offsetIncomeRate" value={offsetIncomeRate} onChange={(v) => dispatch({ type: 'SET_OFFSET_INCOME_RATE', payload: v })} step="0.1" symbol="%" symbolPosition="right" />
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'strategies' && (
                    <section className="animate-fade-in space-y-4">
                        <div onClick={handleOptimizeOffset} className="group bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">Secure Offset Longevity</h4>
                                    <p className="text-sm text-gray-600 mt-1">Calculate minimum starting offset to never run out of funds.</p>
                                    <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-medium text-gray-500 border border-gray-200">Current: {formatCurrency(initialOffsetBalance)}</div>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleOptimizeExpenditure} className="group bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform"><Wallet size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">Maximize Retirement Lifestyle</h4>
                                    <p className="text-sm text-gray-600 mt-1">Find max affordable monthly spend after retirement.</p>
                                    <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-medium text-gray-500 border border-gray-200">Current: {formatCurrency(retirementLivingExpenses)}/mo</div>
                                </div>
                            </div>
                        </div>
                        <div onClick={handleOptimizeWork} className="group bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform"><Briefcase size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">Minimize Work Required</h4>
                                    <p className="text-sm text-gray-600 mt-1">Calculate minimum extra working years required.</p>
                                    <div className="mt-3 inline-block bg-white px-2 py-1 rounded text-xs font-medium text-gray-500 border border-gray-200">Current: {yearsWorking} years</div>
                                </div>
                            </div>
                        </div>
                        {successMsg && (
                            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 p-4 z-50">
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