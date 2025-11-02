// File: 'src/components/amortization/AmortizationForm.tsx'
import React from 'react';
import { InputGroup } from '../common/InputGroup';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { RangeSlider } from '../common/RangeSlider';
import type {AmortizationCalculatorState} from '../../types/amortization.types';

interface AmortizationFormProps {
    calculator: AmortizationCalculatorState;
}

export const AmortizationForm: React.FC<AmortizationFormProps> = ({ calculator }) => {
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

            <div className="mt-8 space-y-6">
                {/* Loan Details */}
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

                {/* Cashflow */}
                <section>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Monthly Cashflow
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-600">Incomings</h4>
                            <InputGroup
                                label="Net Rent"
                                id="initialRentalIncome"
                                step={50}
                                value={String(initialRentalIncome)}
                                onChange={(e) => setInitialRentalIncome(parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <InputGroup
                                label="Net Income (while working)"
                                id="netIncome"
                                step={500}
                                value={String(netIncome)}
                                onChange={(e) => setNetIncome(parseFloat(e.target.value) || 0)}
                                symbol="$"
                                disabled={!continueWorking}
                            />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-600">Outgoings</h4>
                            <InputGroup
                                label="Monthly Repayment"
                                id="monthlyRepayment"
                                step={50}
                                value={isRefinanced ? actualMonthlyRepayment.toFixed(2) : String(monthlyRepayment)}
                                onChange={(e) => setMonthlyRepayment(parseFloat(e.target.value) || 0)}
                                disabled={isRefinanced}
                                symbol="$"
                            />
                            <InputGroup
                                label="Monthly Expenditure"
                                id="monthlyExpenditure"
                                step={500}
                                value={String(monthlyExpenditure)}
                                onChange={(e) => setMonthlyExpenditure(parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                            <InputGroup
                                label="Monthly Expenditure Pre 2031"
                                id="monthlyExpenditurePre2031"
                                step={100}
                                value={String(monthlyExpenditurePre2031)}
                                onChange={(e) => setMonthlyExpenditurePre2031(parseFloat(e.target.value) || 0)}
                                symbol="$"
                            />
                        </div>
                    </div>
                </section>

                {/* Assumptions & Actions */}
                <section>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Assumptions & Actions
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label="Annual Rental Growth"
                            id="rentalGrowthRate"
                            step={0.1}
                            value={String(rentalGrowthRate)}
                            onChange={(e) => setRentalGrowthRate(parseFloat(e.target.value) || 0)}
                            symbol="%"
                            symbolPosition="right"
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
            </div>
        </div>
    );
};
