import { useState } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { SuperCalculator } from './components/super/SuperCalculator';
import { AmortizationCalculator } from './components/amortization/AmortizationCalculator';
import type { CalculatorId } from './types/common.types';

export default function App() {
    const [activeCalculator, setActiveCalculator] = useState<CalculatorId>('super');

    const renderCalculator = () => {
        switch (activeCalculator) {
            case 'super':
                return <SuperCalculator />;
            case 'homeLoan':
                return <AmortizationCalculator />;
            default:
                return <SuperCalculator />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-inter antialiased">
            <Sidebar activeCalculator={activeCalculator} onNavigate={setActiveCalculator} />
            <main className="flex-1 overflow-hidden">
                {renderCalculator()}
            </main>
        </div>
    );
}