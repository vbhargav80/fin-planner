import React, { useState } from 'react';
import {
    Landmark, LayoutDashboard, CalendarRange, PiggyBank,
    Menu, X, Wallet, Home, RotateCcw, Settings
} from 'lucide-react';
import type { NavbarProps } from '../../types/common.types';
import { ConfirmationModal } from './ConfirmationModal';

export const Navbar: React.FC<NavbarProps> = ({ activeCalculator, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const navItems = [
        { id: 'dashboard' as const, name: 'Dashboard', icon: Home },
        { id: 'budget' as const, name: 'Budget', icon: Wallet },
        { id: 'homeLoan' as const, name: 'Amortization', icon: Landmark },
        { id: 'super' as const, name: 'Super', icon: PiggyBank },
        { id: 'drawdown' as const, name: 'Drawdown', icon: CalendarRange },
    ];

    const handleGlobalReset = () => {
        const keysToClear = [
            'amortization-v1',
            'super-v1',
            'super-v2',
            'super-v3',
            'drawdown-v1',
            'drawdown-v2',
            'drawdown-v3',
            'budget-v1',
            'budget-v2'
        ];

        keysToClear.forEach(key => localStorage.removeItem(key));
        window.location.reload();
    };

    return (
        <>
            <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
                <div className="w-full mx-0 px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Side: Logo & Links */}
                        <div className="flex items-center gap-6">
                            <div
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onNavigate('dashboard')}
                            >
                                <LayoutDashboard size={28} className="text-indigo-400" />
                                <span className="text-xl font-bold text-white flex items-center gap-2 hidden sm:flex">
                                    Finance Tools
                                </span>
                            </div>

                            {/* Desktop Nav Items */}
                            <div className="hidden md:flex items-center space-x-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onNavigate(item.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                                            activeCalculator === item.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        <span className="hidden lg:inline">{item.name}</span>
                                        <span className="lg:hidden">{item.name.slice(0,4)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Global Actions & Mobile Menu */}
                        <div className="flex items-center gap-2">
                            {/* Admin Button */}
                            <button
                                onClick={() => onNavigate('admin')}
                                className={`p-2 rounded-full transition-colors ${activeCalculator === 'admin' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                title="Admin Settings"
                            >
                                <Settings size={20} />
                            </button>

                            {/* Reset Button */}
                            <button
                                onClick={() => setIsResetModalOpen(true)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-full transition-colors"
                                title="Reset All Data"
                            >
                                <RotateCcw size={20} />
                            </button>

                            {/* Mobile Menu Toggle */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-gray-800 border-t border-gray-700">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                                        activeCalculator === item.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    onNavigate('admin');
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                                    activeCalculator === 'admin'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <Settings size={20} />
                                <span>Admin</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* MODAL COMPONENT */}
            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleGlobalReset}
                title="Reset All Data"
                message="Are you sure you want to wipe all saved data across all calculators? This action cannot be undone and will return the application to its default state."
                confirmLabel="Yes, Reset Everything"
                variant="danger"
            />
        </>
    );
};