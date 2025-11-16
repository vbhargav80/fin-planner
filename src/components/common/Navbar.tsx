import React, { useState } from 'react';
import { Landmark, LayoutDashboard, CalendarRange, PiggyBank, Menu, X } from 'lucide-react';
import type { NavbarProps } from '../../types/common.types';

export const Navbar: React.FC<NavbarProps> = ({ activeCalculator, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'super' as const, name: 'Super Calculator', icon: PiggyBank },
        { id: 'homeLoan' as const, name: 'Amortization', icon: Landmark },
        { id: 'drawdown' as const, name: 'Drawdown Simulator', icon: CalendarRange },
    ];

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="w-full mx-0 px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={28} className="text-indigo-400" />
                            <span className="text-xl font-bold text-white flex items-center gap-2">
                                Finance Tools
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            {navItems.map((item) => (
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
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    activeCalculator === item.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
