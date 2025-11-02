import React, { useMemo } from 'react';

interface MonthYearPickerProps {
    id?: string;
    label?: string;
    value: string;           // 'YYYY-MM'
    onChange: (next: string) => void;
    minYear?: number;
    maxYear?: number;
    disabled?: boolean;
}

function parseYearMonth(value: string): { year: number; month: number } {
    const [yStr, mStr] = (value || '').split('-');
    const now = new Date();
    const year = Number(yStr) || now.getFullYear();
    const month = Number(mStr) || (now.getMonth() + 1);
    return {
        year: Math.max(1, year),
        month: Math.min(12, Math.max(1, month)),
    };
}

function toYearMonthString(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}

const MONTHS = [
    { v: 1, label: 'Jan' },
    { v: 2, label: 'Feb' },
    { v: 3, label: 'Mar' },
    { v: 4, label: 'Apr' },
    { v: 5, label: 'May' },
    { v: 6, label: 'Jun' },
    { v: 7, label: 'Jul' },
    { v: 8, label: 'Aug' },
    { v: 9, label: 'Sep' },
    { v: 10, label: 'Oct' },
    { v: 11, label: 'Nov' },
    { v: 12, label: 'Dec' },
];

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
                                                                    id,
                                                                    label,
                                                                    value,
                                                                    onChange,
                                                                    minYear = new Date().getFullYear() - 50,
                                                                    maxYear = new Date().getFullYear() + 50,
                                                                    disabled = false,
                                                                }) => {
    const { year, month } = parseYearMonth(value);

    const years = useMemo(() => {
        const arr: number[] = [];
        for (let y = minYear; y <= maxYear; y++) arr.push(y);
        return arr;
    }, [minYear, maxYear]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextMonth = Number(e.target.value);
        onChange(toYearMonthString(year, nextMonth));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextYear = Number(e.target.value);
        onChange(toYearMonthString(nextYear, month));
    };

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="mt-1 grid grid-cols-2 gap-2">
                <select
                    id={id ? `${id}-month` : undefined}
                    value={month}
                    onChange={handleMonthChange}
                    disabled={disabled}
                    className={`block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white ${
                        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    aria-label="Select month"
                >
                    {MONTHS.map((m) => (
                        <option key={m.v} value={m.v}>
                            {m.label}
                        </option>
                    ))}
                </select>

                <select
                    id={id ? `${id}-year` : undefined}
                    value={year}
                    onChange={handleYearChange}
                    disabled={disabled}
                    className={`block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white ${
                        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    aria-label="Select year"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};