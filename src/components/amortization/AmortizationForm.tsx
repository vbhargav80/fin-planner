// File: 'src/components/amortization/AmortizationForm.tsx'
import React from 'react';
import { InputGroup } from '../common/InputGroup';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { RangeSlider } from '../common/RangeSlider';
import { Tabs } from '../common/Tabs';
import type { AmortizationCalculatorState } from '../../types/amortization.types';
import * as AmortizationConstants from '../../constants/amortization';
import { Briefcase, Wallet } from 'lucide-react';

interface AmortizationFormProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationForm: React.FC<AmortizationFormProps> = ({ calculator }) => {
    const [activeTab, setActiveTab] = React.useState<'loan' | 'cashflow' | 'assumptions'>('loan');
    const TABS = [
        { id: 'loan', label: 'Loan Details' },
        { id: 'cashflow', label: 'Monthly Cashflow' },
        { id: 'assumptions', label: 'Assumptions & Actions' },
    ];

    const {
        state,
        dispatch,
        actualMonthlyRepayment,
        calculateOptimalExpenditure,
        calculateOptimalWorkingYears,
    } = calculator;

    const { interestRate, principal, monthlyRepayment, initialRentalIncome, initialOffsetBalance, monthlyExpenditure, monthlyExpenditurePre2031, rentalGrowthRate, isRefinanced, considerOffsetIncome, offsetIncomeRate, continueWorking, yearsWorking, netIncome } = state;

    return (
        <div
            className="md:w-[35%] p-6 sm:p-8 bg-white/95 backdrop-blur md:sticky md:top-[4rem] md:self-start md:h-[calc(100vh-4rem)] md:overflow-y-auto"
        >
            <h2 className="text-3xl font-bold text-gray-900">
                Amortization Calculator
            </h2>
            <p className="mt-2 text-gray-600">
                Monthly schedule from Jan 2026 to Dec 2040. Results update automatically.
            </p>

            {/* Tabs */}
            <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(id) => setActiveTab(id as any)} className="mt-6" />

            <div className="mt-8 space-y-6">
                {activeTab === 'loan' && (
                    <section>
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
                                step={0.01} // Allow finer grain control for user, reducer will snap
                                onChange={(v) => dispatch({ type: 'SET_INTEREST_RATE', payload: v })}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'cashflow' && (
                    <section>
                        <div className="space-y-8">
                            {/* Incomings */}
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

                            {/* Outgoings */}
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
                    <section>
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
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={calculateOptimalExpenditure}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Wallet size={16} />
                    <span className="text-sm">Optimize Expenditure</span>
                </button>
                <button
                    onClick={calculateOptimalWorkingYears}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Briefcase size={16} />
                    <span className="text-sm">Optimize Work &amp; Income</span>
                </button>
            </div>
        </div>
    );
};
