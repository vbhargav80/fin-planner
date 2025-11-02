// File: 'src/components/amortization/AmortizationForm.tsx'
import React from 'react';
import { InputGroup } from '../common/InputGroup';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { RangeSlider } from '../common/RangeSlider';
import type { AmortizationCalculatorState } from '../../types/amortization.types';

interface AmortizationFormProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationForm: React.FC<AmortizationFormProps> = ({ calculator }) => {
    const [activeTab, setActiveTab] = React.useState<'loan' | 'cashflow' | 'assumptions'>('loan');

    const {
        interestRate, setInterestRate,
        principal, setPrincipal,
        monthlyRepayment, setMonthlyRepayment,
        initialRentalIncome, setInitialRentalIncome,
        initialOffsetBalance, setInitialOffsetBalance,
        monthlyExpenditure, setMonthlyExpenditure,
        monthlyExpenditurePre2031, setMonthlyExpenditurePre2031,
        rentalGrowthRate, setRentalGrowthRate,
        isRefinanced, setIsRefinanced,
        considerOffsetIncome, setConsiderOffsetIncome,
        offsetIncomeRate, setOffsetIncomeRate,
        continueWorking, setContinueWorking,
        yearsWorking, setYearsWorking,
        netIncome, setNetIncome,
        actualMonthlyRepayment,
    } = calculator;

    // Snap interest rate to discrete 0.25% steps within [4, 8]
    const handleInterestRateChange = React.useCallback((v: number) => {
        const step = 0.25;
        const min = 4;
        const max = 8;
        const snapped = Math.min(max, Math.max(min, Math.round(v / step) * step));
        setInterestRate(Number(snapped.toFixed(2)));
    }, [setInterestRate]);

    return (
        <div className="md:w-[35%] p-6 sm:p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">
                Amortization Calculator
            </h2>
            <p className="mt-2 text-gray-600">
                Monthly schedule from Jan 2026 to Dec 2040. Results update automatically.
            </p>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('loan')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium ${
                            activeTab === 'loan'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Loan Details
                    </button>
                    <button
                        onClick={() => setActiveTab('cashflow')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium ${
                            activeTab === 'cashflow'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Monthly Cashflow
                    </button>
                    <button
                        onClick={() => setActiveTab('assumptions')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium ${
                            activeTab === 'assumptions'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Assumptions &amp; Actions
                    </button>
                </nav>
            </div>

            <div className="mt-8 space-y-6">
                {activeTab === 'loan' && (
                    <section>
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                            Loan Details
                        </h3>
                        <div className="space-y-4">
                            <RangeSlider
                                label="Starting Loan"
                                value={principal}
                                min={800000}
                                max={1100000}
                                step={50000}
                                onChange={setPrincipal}
                            />
                            <RangeSlider
                                label="Starting Offset"
                                value={initialOffsetBalance}
                                min={800000}
                                max={1000000}
                                step={50000}
                                onChange={setInitialOffsetBalance}
                            />
                            <RangeSlider
                                label="Interest Rate"
                                value={interestRate}
                                min={4}
                                max={8}
                                step={0.25}
                                onChange={handleInterestRateChange}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'cashflow' && (
                    <section>
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                            Monthly Cashflow
                        </h3>

                        <div className="space-y-8">
                            {/* Incomings */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">Incomings</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RangeSlider
                                        label="Net Rent"
                                        value={initialRentalIncome}
                                        min={4000}
                                        max={5000}
                                        step={100}
                                        onChange={setInitialRentalIncome}
                                    />
                                    <RangeSlider
                                        label="Net Income (while working)"
                                        value={netIncome}
                                        min={5000}
                                        max={15000}
                                        step={1000}
                                        onChange={setNetIncome}
                                        disabled={!continueWorking}
                                    />
                                </div>
                            </div>

                            {/* Outgoings */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">Outgoings</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RangeSlider
                                        label="Monthly Expenditure"
                                        value={monthlyExpenditure}
                                        min={5000}
                                        max={15000}
                                        step={1000}
                                        onChange={setMonthlyExpenditure}
                                    />
                                    <RangeSlider
                                        label="Monthly Expenditure Pre 2031"
                                        value={monthlyExpenditurePre2031}
                                        min={1000}
                                        max={5000}
                                        step={1000}
                                        onChange={setMonthlyExpenditurePre2031}
                                    />
                                    <RangeSlider
                                        label="Monthly Repayment"
                                        value={isRefinanced ? actualMonthlyRepayment : monthlyRepayment}
                                        min={5500}
                                        max={7000}
                                        step={50}
                                        onChange={setMonthlyRepayment}
                                        disabled={isRefinanced}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'assumptions' && (
                    <section>
                        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                            Assumptions &amp; Actions
                        </h3>
                        <div className="space-y-4">
                            <RangeSlider
                                label="Annual Rental Growth"
                                value={rentalGrowthRate}
                                min={1}
                                max={4}
                                step={0.25}
                                onChange={setRentalGrowthRate}
                            />
                            <ToggleSwitch
                                label="Refinance for 25-year term"
                                checked={isRefinanced}
                                onChange={setIsRefinanced}
                            />
                            <ToggleSwitch
                                label="Consider Offset Interest Income"
                                checked={considerOffsetIncome}
                                onChange={setConsiderOffsetIncome}
                            />
                            {considerOffsetIncome && (
                                <InputGroup
                                    label="Offset Income Rate"
                                    id="offsetIncomeRate"
                                    step={0.1}
                                    value={String(offsetIncomeRate)}
                                    onChange={(e) => setOffsetIncomeRate(parseFloat(e.target.value) || 0)}
                                    symbol="%"
                                    symbolPosition="right"
                                />
                            )}
                            <ToggleSwitch
                                label="Continue Working"
                                checked={continueWorking}
                                onChange={setContinueWorking}
                            />
                            {continueWorking && (
                                <RangeSlider
                                    label="Number of years"
                                    value={yearsWorking}
                                    min={0}
                                    max={10}
                                    step={1}
                                    onChange={setYearsWorking}
                                    disabled={!continueWorking}
                                />
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
