import React from 'react';
import type { RangeSliderProps } from '../../types/common.types';

export const RangeSlider: React.FC<RangeSliderProps> = ({
                                                            label,
                                                            value,
                                                            min,
                                                            max,
                                                            step,
                                                            onChange,
                                                            disabled = false
                                                        }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">
            {label}: <span className="font-bold">{value}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 accent-indigo-600"
        />
    </div>
);