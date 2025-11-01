import React from 'react';
import { Calculator, Landmark, LayoutDashboard } from 'lucide-react';
import type { SidebarProps } from '../../types/common.types';

export const Sidebar: React.FC<SidebarProps> = ({ activeCalculator, onNavigate }) => {
    const navItems = [
        { id: 'super' as const, name: 'Super Calculator', icon: Calculator },
        { id: 'homeLoan' as const, name: 'Amortization', icon: Landmark },
    ];

    return (
        <nav className="md:w-64 bg-gray-900 text-white flex-shrink-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard size={28} />
                    Calculators
                </h1>
            </div>
            <ul className="mt-4 space-y-2 px-4">
                {navItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                activeCalculator === item.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};