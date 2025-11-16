import React from 'react';

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabClick: (id: string) => void;
    variant?: 'button' | 'underline';
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick, variant = 'button', className = '' }) => {
    if (variant === 'underline') {
        return (
            <div className={`border-b border-gray-200 ${className}`}>
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab.id)}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium ${
                                activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
        );
    }

    // Default 'button' variant
    return (
        <div className={`flex space-x-1 ${className}`}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`flex-1 py-2 px-3 rounded-t-md font-medium text-sm transition-colors ${
                        activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};