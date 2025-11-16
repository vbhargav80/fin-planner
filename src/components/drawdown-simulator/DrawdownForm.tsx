// File: 'src/components/drawdown-simulator/DrawdownForm.tsx'
import React, { useState } from 'react';
import { InputGroup } from '../common/InputGroup';
import { RangeSlider } from '../common/RangeSlider';
import { MonthYearPicker } from '../common/MonthYearPicker';
import { Tabs } from '../common/Tabs';
import type { SaleDrawdownState } from '../../types/drawdown.types';

interface Props { model: SaleDrawdownState }

export const DrawdownForm: React.FC<Props> = ({ model }) => {
    const [activeTab, setActiveTab] = useState<'sale' | 'plan'>('sale');
    const TABS = [
        { id: 'sale', label: 'Sale Calculation' },
        { id: 'plan', label: 'Drawdown Plan' },
    ];

    const fmtCurrency = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    const TAX_RATES = [16, 30, 37, 45] as const;

    const p1Idx = Math.max(0, TAX_RATES.indexOf(model.person1TaxRate as (typeof TAX_RATES)[number]));
    const p2Idx = Math.max(0, TAX_RATES.indexOf(model.person2TaxRate as (typeof TAX_RATES)[number]));

    return (
        <div className="w-full md:w-[35%] p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-900">Drawdown Simulator</h2>
            <p className="mt-2 text-gray-600">Net sale proceeds calculator with monthly drawdown plan.</p>

            {/* Tabs */}
            <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(id) => setActiveTab(id as any)} variant="underline" className="mt-6" />

            <div className="mt-6">
                {activeTab === 'sale' && (
                    <section className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Sale Calculation</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <RangeSlider
                                label="Asset Sale Price"
                                value={model.salePrice}
                                min={700_000}
                                max={1_500_000}
                                step={50_000}
                                onChange={model.setSalePrice}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <RangeSlider
                                label="Cost Base"
                                value={model.costBase}
                                min={300_000}
                                max={500_000}
                                step={10_000}
                                onChange={model.setCostBase}
                                formatValue={(v) => fmtCurrency(v)}
                            />

                            {/* Depreciation Claimed and Selling Costs side-by-side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RangeSlider
                                    label="Depreciation Claimed"
                                    value={model.depreciationClaimed}
                                    min={30_000}
                                    max={100_000}
                                    step={10_000}
                                    onChange={model.setDepreciationClaimed}
                                    formatValue={(v) => fmtCurrency(v)}
                                />
                                <RangeSlider
                                    label="Selling Costs"
                                    value={model.sellingCosts}
                                    min={30_000}
                                    max={100_000}
                                    step={10_000}
                                    onChange={model.setSellingCosts}
                                    formatValue={(v) => fmtCurrency(v)}
                                />
                            </div>

                            {/* Tax rates side-by-side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RangeSlider
                                    label="Person 1 Tax Rate (%)"
                                    value={p1Idx}
                                    min={0}
                                    max={TAX_RATES.length - 1}
                                    step={1}
                                    onChange={(idx) => model.setPerson1TaxRate(TAX_RATES[Math.round(idx)] as number)}
                                    formatValue={(idx) => `${TAX_RATES[Math.round(idx)]}%`}
                                />
                                <RangeSlider
                                    label="Person 2 Tax Rate (%)"
                                    value={p2Idx}
                                    min={0}
                                    max={TAX_RATES.length - 1}
                                    step={1}
                                    onChange={(idx) => model.setPerson2TaxRate(TAX_RATES[Math.round(idx)] as number)}
                                    formatValue={(idx) => `${TAX_RATES[Math.round(idx)]}%`}
                                />
                            </div>

                            <InputGroup
                                label="CGT Discount"
                                id="cgtDiscount"
                                value={String(model.cgtDiscountRate)}
                                symbol="%"
                                symbolPosition="right"
                                step={0.1}
                                onChange={(e) => model.setCgtDiscountRate(Number(e.target.value))}
                                disabled={true}
                            />
                        </div>
                    </section>
                )}

                {activeTab === 'plan' && (
                    <section className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Drawdown Plan</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <RangeSlider
                                label="Net Monthly Rent"
                                value={model.netMonthlyRent}
                                min={800}
                                max={1200}
                                step={25}
                                onChange={model.setNetMonthlyRent}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <RangeSlider
                                label="Net Monthly Rent Growth Rate (%)"
                                value={model.netRentGrowthRate}
                                min={1}
                                max={5}
                                step={0.25}
                                onChange={model.setNetRentGrowthRate}
                                formatValue={(v) => `${v.toFixed(2)}%`}
                            />
                            <RangeSlider
                                label="Est. Annual Interest Rate (%)"
                                value={model.annualInterestRate}
                                min={1}
                                max={6}
                                step={0.25}
                                onChange={model.setAnnualInterestRate}
                                formatValue={(v) => `${v.toFixed(2)}%`}
                            />
                            <RangeSlider
                                label="Monthly Drawdown"
                                value={model.monthlyDrawdown}
                                min={5_000}
                                max={15_000}
                                step={1_000}
                                onChange={model.setMonthlyDrawdown}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <MonthYearPicker
                                id="startMonth"
                                label="Drawdown Start Date"
                                value={model.startMonth}
                                onChange={model.setStartMonth}
                                minYear={2000}
                                maxYear={2100}
                            />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
