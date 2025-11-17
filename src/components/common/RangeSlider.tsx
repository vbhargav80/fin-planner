import React from 'react';

interface RangeSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    formatValue?: (value: number) => string;
    // New props for custom styling
    labelClassName?: string;
    valueClassName?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
                                                            label,
                                                            value,
                                                            min,
                                                            max,
                                                            step = 1,
                                                            onChange,
                                                            disabled = false,
                                                            formatValue,
                                                            // Default to existing gray styles if not provided
                                                            labelClassName = "text-sm text-gray-700",
                                                            valueClassName = "text-sm font-medium text-gray-900",
                                                        }) => {
    const decimals = !Number.isInteger(step)
        ? (step.toString().split('.')[1]?.length ?? 2)
        : 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(e.target.value);
        if (!Number.isFinite(next)) return;
        onChange(next);
    };

    const displayValue =
        formatValue
            ? formatValue(value)
            : (decimals > 0 ? value.toFixed(decimals) : String(value));

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1">
                {/* Use dynamic classes */}
                <label className={labelClassName}>{label}</label>
                <span className={valueClassName}>{displayValue}</span>
            </div>
            <input
                type="range"
                className="w-full accent-indigo-500 cursor-pointer"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
};