import React from 'react';

interface InputGroupProps {
    label: string;
    id: string;
    value: number;
    onChange: (value: number) => void;
    symbol?: string | null;
    symbolPosition?: 'left' | 'right';
    step?: number | string;
    disabled?: boolean;
    labelIcon?: React.ReactNode; // New prop for the icon
}

export const InputGroup: React.FC<InputGroupProps> = ({
                                                          label,
                                                          id,
                                                          value,
                                                          onChange,
                                                          symbol = null,
                                                          symbolPosition = 'left',
                                                          step: customStep,
                                                          disabled = false,
                                                          labelIcon // Destructure new prop
                                                      }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseFloat(e.target.value);
        if (!isNaN(num)) {
            onChange(num);
        } else if (e.target.value === '' || e.target.value === '-') {
            onChange(0);
        }
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                {/* Render icon if provided */}
                {labelIcon && <span className="text-gray-400">{labelIcon}</span>}
                {label}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                {symbol && symbolPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{symbol}</span>
                    </div>
                )}
                <input
                    type="number"
                    id={id}
                    name={id}
                    value={String(value)}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 ${symbolPosition === 'left' ? 'pl-7' : ''} ${symbolPosition === 'right' ? 'pr-7' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    step={customStep || (symbol === '$' ? '1000' : symbol === '%' ? '0.1' : '1')}
                    placeholder={symbol === '$' ? '0' : symbol === '%' ? '0.0' : '0'}
                />
                {symbol && symbolPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{symbol}</span>
                    </div>
                )}
            </div>
        </div>
    );
};