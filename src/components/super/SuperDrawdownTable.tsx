// File: src/components/super/SuperDrawdownTable.tsx
import React from 'react';
import type { DrawdownRow, State, Action } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';
import { RangeSlider } from '../common/RangeSlider';
import { Tabs } from '../common/Tabs';
import * as SuperConstants from '../../constants/super';
import { Sunset, Settings2 } from 'lucide-react';

interface Props {
    schedule: DrawdownRow[];
    state: State;
    dispatch: React.Dispatch<Action>;
}

export const SuperDrawdownTable: React.FC<Props> = ({ schedule, state, dispatch }) => {
    const { drawdownLifestyle, drawdownAnnualAmount, drawdownReturn } = state;

    const LIFESTYLE_OPTIONS = [
        { id: 'modest', label: 'Modest' },
        { id: 'comfortable', label: 'Comfortable' },
        { id: 'luxury', label: 'Luxury' },
        { id: 'custom', label: 'Custom' },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            {/* Contextual Inputs Panel */}
            <div className="bg-indigo-800/50 rounded-xl p-5 border border-indigo-600/30">
                <div className="flex items-center gap-2 mb-4 text-indigo-200 border-b border-indigo-700/50 pb-3">
                    <Settings2 size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">Retirement Scenario Settings</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-indigo-200 mb-2 uppercase tracking-wide">
                            Desired Lifestyle
                        </label>
                        <Tabs
                            tabs={LIFESTYLE_OPTIONS}
                            activeTab={drawdownLifestyle}
                            onTabClick={(id) => dispatch({ type: 'SET_DRAWDOWN_LIFESTYLE', payload: id as any })}
                            variant="segmented"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="text-white">
                            <RangeSlider
                                label="Annual Drawdown Amount"
                                value={drawdownAnnualAmount}
                                min={SuperConstants.DRAWDOWN_AMOUNT.MIN}
                                max={SuperConstants.DRAWDOWN_AMOUNT.MAX}
                                step={SuperConstants.DRAWDOWN_AMOUNT.STEP}
                                onChange={(v) => dispatch({ type: 'SET_DRAWDOWN_ANNUAL_AMOUNT', payload: v })}
                                formatValue={(v) => formatCurrency(v)}
                            />
                        </div>
                        <div className="text-white">
                            <RangeSlider
                                label="Est. Annual Return (Retirement)"
                                value={drawdownReturn}
                                min={SuperConstants.DRAWDOWN_RETURN.MIN}
                                max={SuperConstants.DRAWDOWN_RETURN.MAX}
                                step={SuperConstants.DRAWDOWN_RETURN.STEP}
                                onChange={(v) => dispatch({ type: 'SET_DRAWDOWN_RETURN', payload: v })}
                                formatValue={(v) => `${v.toFixed(1)}%`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
                    <Sunset className="text-orange-400" />
                    Retirement Drawdown Projection
                </h3>
                <p className="text-center text-indigo-200 mb-6 text-sm">
                    Assuming monthly drawdown of <strong>{schedule.length > 0 ? formatCurrency(schedule[0].drawdown) : '$0'}</strong>
                </p>

                <div className="bg-indigo-800 rounded-lg shadow-inner overflow-visible">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-indigo-900 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 w-20 font-semibold tracking-wider">Age</th>
                            <th className="p-3 w-20 font-semibold tracking-wider">Month</th>
                            <th className="p-3 w-1/3 font-semibold tracking-wider text-right">Balance</th>
                            <th className="p-3 w-1/3 font-semibold tracking-wider text-right">Earnings</th>
                        </tr>
                        </thead>
                        <tbody className="text-indigo-200">
                        {schedule.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-indigo-700 last:border-b-0 hover:bg-indigo-700/50"
                            >
                                <td className="p-3 whitespace-nowrap">{row.age}</td>
                                <td className="p-3 whitespace-nowrap">{row.month}</td>
                                <td className="p-3 whitespace-nowrap text-right font-mono">
                                    {formatCurrency(row.endBalance)}
                                </td>
                                <td className="p-3 whitespace-nowrap text-right font-mono text-sm text-indigo-300">
                                    +{formatCurrency(row.earnings)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {schedule.length === 0 && (
                        <div className="p-8 text-center text-indigo-300">
                            No drawdown data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};