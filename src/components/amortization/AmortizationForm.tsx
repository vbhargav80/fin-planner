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
        rentalGrowthRate, setRentalGrowthRate,
        isRefinanced, setIsRefinanced,
        considerOffsetIncome, setConsiderOffsetIncome,
        offsetIncomeRate, setOffsetIncomeRate,
        continueWorking, setContinueWorking,
        yearsWorking, setYearsWorking,
        netIncome, setNetIncome,
        actualMonthlyRepayment,
    } = calculator;

    return (
        <div className="md:w-[35%] p-6 sm:p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-gray-900">
                Amortization Calculator
            </h2>
            <p className="mt-2 text-gray-600">
                Monthly schedule from Jan 2031 to Dec 2040. Results update automatically.
            </p>

            <div className="mt-8 space-y-6">
                {/* Loan Details */}
                <section>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        Loan Details
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label="Starting Loan"
                            id="principal"
                            step={10000}
                            value={String(principal)}
                            onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                            symbol="$"
                        />
                        <InputGroup
                            label="Starting Offset"
                            id="initialOffsetBalance"
                            step={10000}
                            value={String(initialOffsetBalance)}
                            onChange={(e) => setInitialOffsetBalance(parseFloat(e.target.value) || 0)}
                            symbol="$"
                        />
                        <InputGroup
                            label="Interest Rate"
                            id="interestRate"
                            step={0.1}
                            value={String(interestRate)}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            symbol="%"
                            symbolPosition="right"
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