import React, { useState, useRef } from 'react';
import {
    Landmark, LayoutDashboard, CalendarRange, PiggyBank,
    Menu, X, Wallet, RotateCcw, Settings
} from 'lucide-react';
import type { NavbarProps } from '../../types/common.types';
import { ConfirmationModal } from './ConfirmationModal';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { useConfig } from '../../contexts/ConfigContext'; // NEW IMPORT

export const Navbar: React.FC<NavbarProps> = ({ activeCalculator, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const { isAdminMode, toggleAdminMode } = useConfig(); // Consume global admin state

    // Secret Click Logic
    const clickCountRef = useRef(0);
    const timeoutRef = useRef<number | null>(null);

    const handleSecretClick = () => {
        clickCountRef.current += 1;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            clickCountRef.current = 0;
        }, 1000); // Reset count if not clicked fast enough

        if (clickCountRef.current === 4) {
            toggleAdminMode();
            clickCountRef.current = 0;
        }
    };

    const navItems = [
        { id: 'dashboard' as const, name: 'Dashboard', icon: Landmark }, // Changed Icon for variety if needed, keeping mostly same
        { id: 'budget' as const, name: 'Budget', icon: Wallet },
        { id: 'homeLoan' as const, name: 'Amortization', icon: Landmark },
        { id: 'super' as const, name: 'Super', icon: PiggyBank },
        { id: 'drawdown' as const, name: 'Drawdown', icon: CalendarRange },
    ];

    const handleGlobalReset = () => {
        const keysToClear = [
            STORAGE_KEYS.AMORTIZATION,
            STORAGE_KEYS.SUPER,
            STORAGE_KEYS.DRAWDOWN,
            STORAGE_KEYS.BUDGET,
            STORAGE_KEYS.APP_DEFAULTS,
            ...STORAGE_KEYS.LEGACY
        ];

        keysToClear.forEach(key => localStorage.removeItem(key));
        window.location.reload();
    };

    return (
        <>
            <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
                <div className="w-full mx-0 px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-6">
                            {/* SECRET TRIGGER AREA */}
                            <div
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
                                onClick={(e) => {
                                    // Prevent navigation if user is just clicking for secret
                                    if(e.detail > 1) e.preventDefault();
                                    handleSecretClick();
                                    if(clickCountRef.current === 1) onNavigate('dashboard');
                                }}
                            >
                                <LayoutDashboard size={28} className={isAdminMode ? "text-red-500" : "text-indigo-400"} />
                                <span className={`text-xl font-bold flex items-center gap-2 hidden sm:flex ${isAdminMode ? "text-red-400" : "text-white"}`}>
                                    {isAdminMode ? "ADMIN MODE" : "Finance Tools"}
                                </span>
                            </div>

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

                        <div className="flex items-center gap-2">
                            {/* ONLY SHOW ADMIN BUTTONS IF IN ADMIN MODE */}
                            {isAdminMode && (
                                <div className="flex items-center gap-2 animate-fade-in">
                                    <button
                                        onClick={() => onNavigate('admin')}
                                        className={`p-2 rounded-full transition-colors ${activeCalculator === 'admin' ? 'text-white bg-gray-800' : 'text-red-400 hover:text-white hover:bg-red-900'}`}
                                        title="Admin Settings"
                                    >
                                        <Settings size={20} />
                                    </button>

                                    <button
                                        onClick={() => setIsResetModalOpen(true)}
                                        className="p-2 text-red-400 hover:text-white hover:bg-red-900 rounded-full transition-colors"
                                        title="Reset All Data"
                                    >
                                        <RotateCcw size={20} />
                                    </button>
                                </div>
                            )}

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

                            {isAdminMode && (
                                <button
                                    onClick={() => {
                                        onNavigate('admin');
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors text-red-400 hover:bg-red-900 hover:text-white`}
                                >
                                    <Settings size={20} />
                                    <span>Admin Settings</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

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