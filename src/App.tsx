// File: src/App.tsx
import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { SuperCalculator } from './components/super/SuperCalculator';
import { AmortizationCalculator } from './components/amortization/AmortizationCalculator';
import { DrawdownSimulator } from './components/drawdown-simulator/DrawdownSimulator';
import { BudgetPlanner } from './components/budget/BudgetPlanner';
import { Dashboard } from './components/dashboard/Dashboard';
import { AdminScreen } from './components/admin/AdminScreen'; // New
import type { CalculatorId } from './types/common.types';
import { ConfigProvider } from './contexts/ConfigContext'; // New

export default function App() {
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
            case 'admin':
                return <AdminScreen />;
            default:
                return <Dashboard onNavigate={setActiveCalculator} />;
        }
    };

    return (
        <ConfigProvider>
            <div className="flex flex-col min-h-screen bg-gray-100 font-inter antialiased">
                <Navbar activeCalculator={activeCalculator} onNavigate={setActiveCalculator} />
                <main className="flex-1 overflow-hidden flex flex-col">{renderCalculator()}</main>
            </div>
        </ConfigProvider>
    );
}