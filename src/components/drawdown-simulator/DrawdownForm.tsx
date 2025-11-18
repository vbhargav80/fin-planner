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

    const { state, dispatch } = model;
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
                                value={state.salePrice}
                                min={DrawdownConstants.SALE_PRICE.MIN}
                                max={DrawdownConstants.SALE_PRICE.MAX}
                                step={DrawdownConstants.SALE_PRICE.STEP}
                                onChange={(v) => dispatch({ type: 'SET_SALE_PRICE', payload: v })}
                                formatValue={(v) => fmtCurrency(v)}
                            />

                            <RangeSlider
                                label="Outstanding Loan"
                                value={state.outstandingLoan}
                                min={DrawdownConstants.OUTSTANDING_LOAN.MIN}
                                max={DrawdownConstants.OUTSTANDING_LOAN.MAX}
                                step={DrawdownConstants.OUTSTANDING_LOAN.STEP}
                                onChange={(v) => dispatch({ type: 'SET_OUTSTANDING_LOAN', payload: v })}
                                formatValue={(v) => fmtCurrency(v)}
                            />

                            <RangeSlider
                                label="Cost Base"
                                value={state.costBase}
                                min={DrawdownConstants.COST_BASE.MIN}
                                max={DrawdownConstants.COST_BASE.MAX}
                                step={DrawdownConstants.COST_BASE.STEP}
                                onChange={(v) => dispatch({ type: 'SET_COST_BASE', payload: v })}
                                formatValue={(v) => fmtCurrency(v)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RangeSlider
                                    label="Depreciation Claimed"
                                    value={state.depreciationClaimed}
                                    min={DrawdownConstants.DEPRECIATION_CLAIMED.MIN}
                                    max={DrawdownConstants.DEPRECIATION_CLAIMED.MAX}
                                    step={DrawdownConstants.DEPRECIATION_CLAIMED.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_DEPRECIATION_CLAIMED', payload: v })}
                                    formatValue={(v) => fmtCurrency(v)}
                                />
                                <RangeSlider
                                    label="Selling Costs"
                                    value={state.sellingCosts}
                                    min={DrawdownConstants.SELLING_COSTS.MIN}
                                    max={DrawdownConstants.SELLING_COSTS.MAX}
                                    step={DrawdownConstants.SELLING_COSTS.STEP}
                                    onChange={(v) => dispatch({ type: 'SET_SELLING_COSTS', payload: v })}
                                    formatValue={(v) => fmtCurrency(v)}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SegmentedControl
                                    label="Person 1 Tax Rate"
                                    options={TAX_RATES}
                                    value={state.person1TaxRate as (typeof TAX_RATES)[number]}
                                    onChange={(rate) => dispatch({ type: 'SET_PERSON_1_TAX_RATE', payload: rate })}
                                    formatLabel={(r) => `${r}%`}
                                />
                                <SegmentedControl
                                    label="Person 2 Tax Rate"
                                    options={TAX_RATES}
                                    value={state.person2TaxRate as (typeof TAX_RATES)[number]}
                                    onChange={(rate) => dispatch({ type: 'SET_PERSON_2_TAX_RATE', payload: rate })}
                                    formatLabel={(r) => `${r}%`}
                                />
                            </div>

                            <InputGroup
                                label="CGT Discount"
                                id="cgtDiscount"
                                value={state.cgtDiscountRate}
                                onChange={(v) => dispatch({ type: 'SET_CGT_DISCOUNT_RATE', payload: v })}
                                symbol="%"
                                symbolPosition="right"
                                step="0.1"
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
                                value={state.netMonthlyRent}
                                min={DrawdownConstants.NET_MONTHLY_RENT.MIN}
                                max={DrawdownConstants.NET_MONTHLY_RENT.MAX}
                                step={DrawdownConstants.NET_MONTHLY_RENT.STEP}
                                onChange={(v) => dispatch({ type: 'SET_NET_MONTHLY_RENT', payload: v })}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <RangeSlider
                                label="Net Monthly Rent Growth Rate (%)"
                                value={state.netRentGrowthRate}
                                min={DrawdownConstants.NET_RENT_GROWTH_RATE.MIN}
                                max={DrawdownConstants.NET_RENT_GROWTH_RATE.MAX}
                                step={DrawdownConstants.NET_RENT_GROWTH_RATE.STEP}
                                onChange={(v) => dispatch({ type: 'SET_NET_RENT_GROWTH_RATE', payload: v })}
                                formatValue={(v) => `${v.toFixed(2)}%`}
                            />
                            <RangeSlider
                                label="Est. Annual Interest Rate (%)"
                                value={state.annualInterestRate}
                                min={DrawdownConstants.ANNUAL_INTEREST_RATE.MIN}
                                max={DrawdownConstants.ANNUAL_INTEREST_RATE.MAX}
                                step={DrawdownConstants.ANNUAL_INTEREST_RATE.STEP}
                                onChange={(v) => dispatch({ type: 'SET_ANNUAL_INTEREST_RATE', payload: v })}
                                formatValue={(v) => `${v.toFixed(2)}%`}
                            />
                            <RangeSlider
                                label="Monthly Drawdown"
                                value={state.monthlyDrawdown}
                                min={DrawdownConstants.MONTHLY_DRAWDOWN.MIN}
                                max={DrawdownConstants.MONTHLY_DRAWDOWN.MAX}
                                step={DrawdownConstants.MONTHLY_DRAWDOWN.STEP}
                                onChange={(v) => dispatch({ type: 'SET_MONTHLY_DRAWDOWN', payload: v })}
                                formatValue={(v) => fmtCurrency(v)}
                            />
                            <MonthYearPicker
                                id="startMonth"
                                label="Drawdown Start Date"
                                value={state.startMonth}
                                onChange={(v) => dispatch({ type: 'SET_START_MONTH', payload: v })}
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