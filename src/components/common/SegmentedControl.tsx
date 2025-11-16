interface SegmentedControlProps<T extends string | number> {
    label: string;
    options: readonly T[];
    value: T;
    onChange: (value: T) => void;
    formatLabel?: (value: T) => string;
    className?: string;
}

export const SegmentedControl = <T extends string | number>({
    label,
    options,
    value,
    onChange,
    formatLabel = (v) => String(v),
    className = '',
}: SegmentedControlProps<T>) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex w-full gap-1 rounded-full bg-gray-200 p-1 shadow-inner">
                {options.map((option) => (
                    <button
                        key={String(option)}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`flex-1 px-2 py-1 text-xs font-medium rounded-full text-center transition-colors duration-150 border ${
                            value === option
                                ? 'bg-white text-gray-800 border-gray-200 shadow-sm'
                                : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-300'
                        }`}
                    >
                        {formatLabel(option)}
                    </button>
                ))}
            </div>
        </div>
    );
};