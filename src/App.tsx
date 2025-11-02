// File: 'src/App.tsx'
import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { SuperCalculator } from './components/super/SuperCalculator';
import { AmortizationCalculator } from './components/amortization/AmortizationCalculator';
import { DrawdownSimulator } from './components/drawdown-simulator/DrawdownSimulator';
import type { CalculatorId } from './types/common.types';

export default function App() {
    const [activeCalculator, setActiveCalculator] = useState<CalculatorId>('super');

    const renderCalculator = () => {
        switch (activeCalculator) {
            case 'super':
                return <SuperCalculator />;
            case 'homeLoan':
                return <AmortizationCalculator />;
            case 'drawdown':
                return <DrawdownSimulator />;
            default:
                return <SuperCalculator />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-inter antialiased">
            <Navbar activeCalculator={activeCalculator} onNavigate={setActiveCalculator} />
            <main className="flex-1 overflow-hidden">{renderCalculator()}</main>
        </div>
    );
}
