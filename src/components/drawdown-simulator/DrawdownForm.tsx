// File: 'src/components/drawdown-simulator/DrawdownForm.tsx'
import React, { useState } from 'react';
import { InputGroup } from '../common/InputGroup';
import { RangeSlider } from '../common/RangeSlider';
import { MonthYearPicker } from '../common/MonthYearPicker';
import { Tabs } from '../common/Tabs';
import { SegmentedControl } from '../common/SegmentedControl';
import * as DrawdownConstants from '../../constants/drawdown';
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
                                min={DrawdownConstants.SALE_PRICE.MIN}
                                max={DrawdownConstants.SALE_PRICE.MAX}
                                step={DrawdownConstants.SALE_PRICE.STEP}
                                onChange={model.setSalePrice}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <RangeSlider
                                label="Cost Base"
                                value={model.costBase}
                                min={DrawdownConstants.COST_BASE.MIN}
                                max={DrawdownConstants.COST_BASE.MAX}
                                step={DrawdownConstants.COST_BASE.STEP}
                                onChange={model.setCostBase}
                                formatValue={(v) => fmtCurrency(v)}
                            />

                            {/* Depreciation Claimed and Selling Costs side-by-side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RangeSlider
                                    label="Depreciation Claimed"
                                    value={model.depreciationClaimed}
                                    min={DrawdownConstants.DEPRECIATION_CLAIMED.MIN}
                                    max={DrawdownConstants.DEPRECIATION_CLAIMED.MAX}
                                    step={DrawdownConstants.DEPRECIATION_CLAIMED.STEP}
                                    onChange={model.setDepreciationClaimed}
                                    formatValue={(v) => fmtCurrency(v)}
                                />
                                <RangeSlider
                                    label="Selling Costs"
                                    value={model.sellingCosts}
                                    min={DrawdownConstants.SELLING_COSTS.MIN}
                                    max={DrawdownConstants.SELLING_COSTS.MAX}
                                    step={DrawdownConstants.SELLING_COSTS.STEP}
                                    onChange={model.setSellingCosts}
                                    formatValue={(v) => fmtCurrency(v)}
                                />
                            </div>

                            {/* Tax rates side-by-side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SegmentedControl
                                    label="Person 1 Tax Rate"
                                    options={TAX_RATES}
                                    value={model.person1TaxRate as (typeof TAX_RATES)[number]}
                                    onChange={(rate) => model.setPerson1TaxRate(rate)}
                                    formatLabel={(r) => `${r}%`}
                                />
                                <SegmentedControl
                                    label="Person 2 Tax Rate"
                                    options={TAX_RATES}
                                    value={model.person2TaxRate as (typeof TAX_RATES)[number]}
                                    onChange={(rate) => model.setPerson2TaxRate(rate)}
                                    formatLabel={(r) => `${r}%`}
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
                                min={DrawdownConstants.NET_MONTHLY_RENT.MIN}
                                max={DrawdownConstants.NET_MONTHLY_RENT.MAX}
                                step={DrawdownConstants.NET_MONTHLY_RENT.STEP}
                                onChange={model.setNetMonthlyRent}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <RangeSlider
                                label="Net Monthly Rent Growth Rate (%)"
                                value={model.netRentGrowthRate}
                                min={DrawdownConstants.NET_RENT_GROWTH_RATE.MIN}
                                max={DrawdownConstants.NET_RENT_GROWTH_RATE.MAX}
                                step={DrawdownConstants.NET_RENT_GROWTH_RATE.STEP}
                                onChange={model.setNetRentGrowthRate}
                                formatValue={(v) => `${v.toFixed(2)}%`}
                            />
                            <RangeSlider
                                label="Est. Annual Interest Rate (%)"
                                value={model.annualInterestRate}
                                min={DrawdownConstants.ANNUAL_INTEREST_RATE.MIN}
                                max={DrawdownConstants.ANNUAL_INTEREST_RATE.MAX}
                                step={DrawdownConstants.ANNUAL_INTEREST_RATE.STEP}
                                onChange={model.setAnnualInterestRate}
                                formatValue={(v) => `${v.toFixed(2)}%`}
                            />
                            <RangeSlider
                                label="Monthly Drawdown"
                                value={model.monthlyDrawdown}
                                min={DrawdownConstants.MONTHLY_DRAWDOWN.MIN}
                                max={DrawdownConstants.MONTHLY_DRAWDOWN.MAX}
                                step={DrawdownConstants.MONTHLY_DRAWDOWN.STEP}
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
