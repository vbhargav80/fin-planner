import React from 'react';
import type { IncomeItem, Action } from '../../types/budget.types';
import { formatCurrency } from '../../utils/formatters';
import { InputGroup } from '../common/InputGroup';
import { CategoryIcon } from './CategoryIcon';

interface Props {
    items: IncomeItem[];
    totalIncome: number;
    dispatch: React.Dispatch<Action>;
}

export const IncomeList: React.FC<Props> = ({ items, totalIncome, dispatch }) => {
    return (
        <div className="w-full p-6 overflow-y-auto bg-white h-full">
            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Income Sources</h3>
                    <p className="text-sm text-gray-500 mt-1">Post-tax monthly income</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-medium text-gray-500">Total Income</span>
                    <div className="text-lg font-bold text-green-600">
                        {formatCurrency(totalIncome)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map(item => {
                    // Calculate a "smart step" (5% of value), default to 50 if 0
                    const step = Math.max(1, Math.round(item.amount * 0.05)) || 50;

                    return (
                        <InputGroup
                            key={item.id}
                            id={item.id}
                            label={item.name}
                            // This automatically grabs the 'housing' icon for Investment Rent
                            labelIcon={<CategoryIcon iconKey={item.iconKey} size={16} />}
                            value={item.amount}
                            onChange={(val) => dispatch({
                                type: 'UPDATE_INCOME',
                                payload: { ...item, amount: val }
                            })}
                            symbol="$"
                            symbolPosition="left"
                            step={step}
                        />
                    );
                })}
            </div>
        </div>
    );
};