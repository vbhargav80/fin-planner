import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Tabs } from '../common/Tabs';
import { InputGroup } from '../common/InputGroup';
import { Save, RotateCcw, ShieldAlert } from 'lucide-react';

export const AdminScreen: React.FC = () => {
    const { config, updateConfig, resetToSystemDefaults } = useConfig();
    const [activeTab, setActiveTab] = useState<'amortization' | 'super' | 'drawdown'>('amortization');

    // Local state to handle form edits before save
    const [localConfig, setLocalConfig] = useState(config);
    const [isDirty, setIsDirty] = useState(false);

    const TABS = [
        { id: 'amortization', label: 'Amortization' },
        { id: 'super', label: 'Super' },
        { id: 'drawdown', label: 'Drawdown' },
    ];

    const handleSave = () => {
        updateConfig(localConfig);
        setIsDirty(false);
        alert("Defaults updated successfully! Reset calculators to see changes.");
    };

    const updateField = (section: keyof typeof config, field: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setIsDirty(true);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <ShieldAlert className="text-red-500" />
                        Admin Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Configure global default values for all calculators.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={resetToSystemDefaults}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <RotateCcw size={16} />
                        Restore System Defaults
                    </button>
                    {isDirty && (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm animate-pulse"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(id) => setActiveTab(id as any)} variant="underline" className="mb-6" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {activeTab === 'amortization' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Principal ($)" id="principal" value={localConfig.amortization.principal} onChange={(v) => updateField('amortization', 'principal', v)} symbol="$" />
                        <InputGroup label="Interest Rate (%)" id="interestRate" value={localConfig.amortization.interestRate} onChange={(v) => updateField('amortization', 'interestRate', v)} symbol="%" />
                        <InputGroup label="Monthly Repayment ($)" id="monthlyRepayment" value={localConfig.amortization.monthlyRepayment} onChange={(v) => updateField('amortization', 'monthlyRepayment', v)} symbol="$" />
                        <InputGroup label="Offset Balance ($)" id="offset" value={localConfig.amortization.initialOffsetBalance} onChange={(v) => updateField('amortization', 'initialOffsetBalance', v)} symbol="$" />
                        <InputGroup label="Initial Rent ($)" id="rent" value={localConfig.amortization.initialRentalIncome} onChange={(v) => updateField('amortization', 'initialRentalIncome', v)} symbol="$" />

                        {/* UPDATED FIELDS FOR NEW MODEL */}
                        <InputGroup label="Monthly Salary ($)" id="monthlySalary" value={localConfig.amortization.monthlySalary} onChange={(v) => updateField('amortization', 'monthlySalary', v)} symbol="$" />
                        <InputGroup label="Current Living Expenses ($)" id="currentExpenses" value={localConfig.amortization.currentLivingExpenses} onChange={(v) => updateField('amortization', 'currentLivingExpenses', v)} symbol="$" />
                        <InputGroup label="Retirement Living Expenses ($)" id="retireExpenses" value={localConfig.amortization.retirementLivingExpenses} onChange={(v) => updateField('amortization', 'retirementLivingExpenses', v)} symbol="$" />
                        <InputGroup label="Transitional Salary ($)" id="transSalary" value={localConfig.amortization.transitionalSalary} onChange={(v) => updateField('amortization', 'transitionalSalary', v)} symbol="$" />
                    </div>
                )}

                {activeTab === 'super' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="My Age" id="myAge" value={localConfig.super.myAge} onChange={(v) => updateField('super', 'myAge', v)} />
                        <InputGroup label="Spouse Age" id="wifeAge" value={localConfig.super.wifeAge} onChange={(v) => updateField('super', 'wifeAge', v)} />
                        <InputGroup label="My Super ($)" id="mySuper" value={localConfig.super.mySuper} onChange={(v) => updateField('super', 'mySuper', v)} symbol="$" />
                        <InputGroup label="Spouse Super ($)" id="wifeSuper" value={localConfig.super.wifeSuper} onChange={(v) => updateField('super', 'wifeSuper', v)} symbol="$" />
                        <InputGroup label="Target Age" id="targetAge" value={localConfig.super.targetAge} onChange={(v) => updateField('super', 'targetAge', v)} />
                        <InputGroup label="Target Balance ($)" id="targetBal" value={localConfig.super.targetBalance || 0} onChange={(v) => updateField('super', 'targetBalance', v)} symbol="$" />
                        <InputGroup label="Net Return (%)" id="netReturn" value={localConfig.super.netReturn} onChange={(v) => updateField('super', 'netReturn', v)} symbol="%" />
                        <InputGroup label="Drawdown Amount ($)" id="ddAmount" value={localConfig.super.drawdownAnnualAmount} onChange={(v) => updateField('super', 'drawdownAnnualAmount', v)} symbol="$" />
                    </div>
                )}

                {activeTab === 'drawdown' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Sale Price ($)" id="salePrice" value={localConfig.drawdown.salePrice} onChange={(v) => updateField('drawdown', 'salePrice', v)} symbol="$" />
                        <InputGroup label="Outstanding Loan ($)" id="loan" value={localConfig.drawdown.outstandingLoan} onChange={(v) => updateField('drawdown', 'outstandingLoan', v)} symbol="$" />
                        <InputGroup label="Cost Base ($)" id="costBase" value={localConfig.drawdown.costBase} onChange={(v) => updateField('drawdown', 'costBase', v)} symbol="$" />
                        <InputGroup label="Selling Costs ($)" id="costs" value={localConfig.drawdown.sellingCosts} onChange={(v) => updateField('drawdown', 'sellingCosts', v)} symbol="$" />
                        <InputGroup label="Interest Rate (%)" id="intRate" value={localConfig.drawdown.annualInterestRate} onChange={(v) => updateField('drawdown', 'annualInterestRate', v)} symbol="%" />
                        <InputGroup label="Monthly Drawdown ($)" id="mDraw" value={localConfig.drawdown.monthlyDrawdown} onChange={(v) => updateField('drawdown', 'monthlyDrawdown', v)} symbol="$" />
                    </div>
                )}
            </div>
        </div>
    );
};