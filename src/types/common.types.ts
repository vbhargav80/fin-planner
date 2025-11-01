
export type CalculatorId = 'super' | 'homeLoan';

export interface InputGroupProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    symbol?: string | null;
    symbolPosition?: 'left' | 'right';
    step?: string | number;
    disabled?: boolean;
}

export interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export interface RangeSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export interface NavbarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}