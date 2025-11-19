import { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { SuperCalculator } from './components/super/SuperCalculator';
import { AmortizationCalculator } from './components/amortization/AmortizationCalculator';
import { DrawdownSimulator } from './components/drawdown-simulator/DrawdownSimulator';
import { BudgetPlanner } from './components/budget/BudgetPlanner';
import { Dashboard } from './components/dashboard/Dashboard';
import { AdminScreen } from './components/admin/AdminScreen';
import type { CalculatorId } from './types/common.types';
import { ConfigProvider } from './contexts/ConfigContext';

export default function App() {
    const [activeCalculator, setActiveCalculator] = useState<CalculatorId>(() => {
        const saved = localStorage.getItem('app-active-screen');
        const validScreens = ['dashboard', 'super', 'homeLoan', 'drawdown', 'budget', 'admin'];
        if (saved && validScreens.includes(saved)) {
            return saved as CalculatorId;
        }
        return 'dashboard';
    });

    useEffect(() => {
        localStorage.setItem('app-active-screen', activeCalculator);
    }, [activeCalculator]);

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
                // Pass the navigation handler
                return <BudgetPlanner onNavigate={setActiveCalculator} />;
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