// File: 'src/types/common.types.ts'
import React from 'react';

export type CalculatorId = 'super' | 'homeLoan' | 'drawdown';

export interface NavbarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}

export interface SidebarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}

export interface InputGroupProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    symbol?: string | null;
    symbolPosition?: 'left' | 'right';
    step?: number;
    disabled?: boolean;
}

export interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}
