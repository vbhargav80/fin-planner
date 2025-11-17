import React from 'react';

export type CalculatorId = 'super' | 'homeLoan' | 'drawdown' | 'budget';

export interface NavbarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}

export interface SidebarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}

export interface InputGroupProps {
    // CHANGED: label can now be a ReactNode
    label: string | React.ReactNode;
    id: string;
    value: string | number;
    onChange: (value: number) => void;
    symbol?: string | null;
    symbolPosition?: 'left' | 'right';
    step?: number | string;
    disabled?: boolean;
    labelIcon?: React.ReactNode;
}

export interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}