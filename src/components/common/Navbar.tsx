// src/components/common/Navbar.tsx
import React from 'react';
import { Calculator, Landmark, LayoutDashboard } from 'lucide-react';
import type { NavbarProps } from '../../types/common.types';

export const Navbar: React.FC<NavbarProps> = ({ activeCalculator, onNavigate }) => {
    const navItems = [
        { id: 'super' as const, name: 'Super Calculator', icon: Calculator },
        { id: 'homeLoan' as const, name: 'Amortization', icon: Landmark },
    ];

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            {/* Full width wrapper with no horizontal margin/padding */}
            <div className="w-full mx-0 px-0">
                <div className="flex items-center justify-start h-16">
                    <div className="flex items-center gap-6 pl-4">
                        {/* Brand with icon and done badge */}
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={28} className="text-indigo-400" />
                            <span className="text-xl font-bold text-white flex items-center gap-2">
                                Financial Planning Tool
                            </span>
                        </div>

                        {/* Navigation Items (left aligned) */}
                        <div className="flex items-center space-x-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                        activeCalculator === item.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium hidden sm:inline">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
