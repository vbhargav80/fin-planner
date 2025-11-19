// File: src/types/common.types.ts
import React from 'react';

export type CalculatorId = 'dashboard' | 'super' | 'homeLoan' | 'drawdown' | 'budget' | 'admin';

export interface NavbarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}

export interface SidebarProps {
    activeCalculator: CalculatorId;
    onNavigate: (id: CalculatorId) => void;
}

export interface InputGroupProps {
    label: string | React.ReactNode;
    id: string;
    value: string | number;
    onChange: (value: number) => void;
    symbol?: string | null;
    symbolPosition?: 'left' | 'right';
    step?: number | string;
    disabled?: boolean;
    labelIcon?: React.ReactNode;
    labelAction?: React.ReactNode; // NEW: Action button next to label
}

export interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}