// File: src/App.tsx
import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { SuperCalculator } from './components/super/SuperCalculator';
import { AmortizationCalculator } from './components/amortization/AmortizationCalculator';
import { DrawdownSimulator } from './components/drawdown-simulator/DrawdownSimulator';
import { BudgetPlanner } from './components/budget/BudgetPlanner';
import { Dashboard } from './components/dashboard/Dashboard'; // Import Dashboard
import type { CalculatorId } from './types/common.types';

export default function App() {
    // Set Dashboard as default
    const [activeCalculator, setActiveCalculator] = useState<CalculatorId>('dashboard');

    const renderCalculator = () => {
        switch (activeCalculator) {
            case 'dashboard':
                return <Dashboard onNavigate={setActiveCalculator} />;
            case 'super':
                return <SuperCalculator />;
            case 'homeLoan':
                return <AmortizationCalculator />;
            case 'drawdown':
                return <DrawdownSimulator />;
            case 'budget':
                return <BudgetPlanner />;
            default:
                return <Dashboard onNavigate={setActiveCalculator} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-inter antialiased">
            <Navbar activeCalculator={activeCalculator} onNavigate={setActiveCalculator} />
            <main className="flex-1 overflow-hidden flex flex-col">{renderCalculator()}</main>
        </div>
    );
}