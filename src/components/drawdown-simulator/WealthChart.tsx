import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import type { ChartDataPoint } from '../../types/drawdown.types';

interface Props {
    data: ChartDataPoint[];
}

export const WealthChart: React.FC<Props> = ({ data }) => {
    return (
        <div className="w-full h-80 bg-indigo-800 rounded-lg p-4 shadow-inner border border-indigo-700">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4338ca" />
                    <XAxis
                        dataKey="year"
                        stroke="#a5b4fc"
                        tick={{ fill: '#a5b4fc', fontSize: 12 }}
                        label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#a5b4fc', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#a5b4fc"
                        tick={{ fill: '#a5b4fc', fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#4338ca', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [formatCurrency(value), '']}
                        labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />

                    <Line
                        type="monotone"
                        dataKey="cashWealth"
                        name="Cash (Sell Strategy)"
                        stroke="#34d399" // Emerald-400
                        strokeWidth={3}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="propertyWealth"
                        name="Property Equity (Keep Strategy)"
                        stroke="#fb923c" // Orange-400
                        strokeWidth={3}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};