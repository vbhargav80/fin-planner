// File: 'src/components/common/RangeSlider.tsx'
import React from 'react';

interface RangeSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
                                                            label,
                                                            value,
                                                            min,
                                                            max,
                                                            step = 1,
                                                            onChange,
                                                            disabled = false,
                                                        }) => {
    const decimals =
        !Number.isInteger(step) ? (step.toString().split('.')[1]?.length ?? 2) : 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(e.target.value);
        if (!Number.isFinite(next)) return;
        onChange(next);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-700">{label}</label>
                <span className="text-sm font-medium text-gray-900">
          {decimals > 0 ? value.toFixed(decimals) : value}
        </span>
            </div>
            <input
                type="range"
                className="w-full"
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
