import React from 'react';
import { InputGroup } from '../common/InputGroup';
import PersonTabsPanel from '../PersonTabsPanel';
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
            <h2 className="text-3xl font-bold text-gray-900">
                Superannuation Goal Calculator
            </h2>
            <p className="mt-2 text-gray-600">
                Enter your details below to see your projection. The results
                will update automatically.
            </p>

            <div className="mt-8 space-y-5">
                {/* Calculation type toggle */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Calculation Type
                    </label>
                    <div className="mt-1 flex rounded-lg p-1 bg-gray-200">
                        <button
                            type="button"
                            onClick={() => setCalcMode('contribution')}
                            className={`w-1/2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                calcMode === 'contribution'
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Calculate Contribution
                        </button>
                        <button
                            type="button"
                            onClick={() => setCalcMode('balance')}
                            className={`w-1/2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                                calcMode === 'balance'
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Calculate Balance
                        </button>
                    </div>
                </div>

                {/* Person tabs panel (using reusable component) */}
                <PersonTabsPanel title="Person">
                    <div className="flex w-full gap-1 rounded-full bg-indigo-50 p-1 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setActivePersonTab('self')}
                            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                                activePersonTab === 'self'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-transparent text-indigo-700 border-transparent hover:bg-indigo-100'
                            }`}
                        >
                            You
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePersonTab('spouse')}
                            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                                activePersonTab === 'spouse'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-transparent text-indigo-700 border-transparent hover:bg-indigo-100'
                            }`}
                        >
                            Spouse
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        {activePersonTab === 'self' && (
                            <>
                                <InputGroup
                                    label="Your Current Age"
                                    id="myAge"
                                    value={myAge}
                                    onChange={(e) => setMyAge(e.target.value)}
                                />
                                <InputGroup
                                    label="Your Current Super"
                                    id="mySuper"
                                    value={mySuper}
                                    onChange={(e) => setMySuper(e.target.value)}
                                    symbol="$"
                                    symbolPosition="left"
                                />
                            </>
                        )}

                        {activePersonTab === 'spouse' && (
                            <>
                                <InputGroup
                                    label="Spouse's Current Age"
                                    id="wifeAge"
                                    value={wifeAge}
                                    onChange={(e) => setWifeAge(e.target.value)}
                                />
                                <InputGroup
                                    label="Spouse's Current Super"
                                    id="wifeSuper"
                                    value={wifeSuper}
                                    onChange={(e) => setWifeSuper(e.target.value)}
                                    symbol="$"
                                    symbolPosition="left"
                                />
                            </>
                        )}
                    </div>
                </PersonTabsPanel>

                {/* Shared goal & contribution inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <InputGroup
                        label="Your Target Retirement Age"
                        id="targetAge"
                        value={targetAge}
                        onChange={(e) => setTargetAge(e.target.value)}
                    />


                    {calcMode === 'balance' && (
                        <>
                            <InputGroup
                                label="Monthly Contribution (Pre-50)"
                                id="monthlyContribution"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(e.target.value)}
                                symbol="$"
                                symbolPosition="left"
                                step={100}
                            />
                            <InputGroup
                                label="Monthly Contribution (Post-50)"
                                id="monthlyContributionPost50"
                                value={monthlyContributionPost50}
                                onChange={(e) => setMonthlyContributionPost50(e.target.value)}
                                symbol="$"
                                symbolPosition="left"
                                step={100}
                            />
                        </>
                    )}

                    <div className={calcMode === 'contribution' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                        <InputGroup
                            label="Est. Annual Net Return (after fees)"
                            id="netReturn"
                            value={netReturn}
                            onChange={(e) => setNetReturn(e.target.value)}
                            symbol="%"
                            symbolPosition="right"
                        />
                    </div>
                </div>

                {/* Move Target Combined Balance to the bottom of the form for better flow */}
                {calcMode === 'contribution' && (
                    <div>
                        <InputGroup
                            label="Target Combined Balance"
                            id="targetBalance"
                            value={targetBalance}
                            onChange={(e) => setTargetBalance(e.target.value)}
                            symbol="$"
                            symbolPosition="left"
                        />
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-center text-red-600 font-medium">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};