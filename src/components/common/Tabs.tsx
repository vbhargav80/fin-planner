import React from 'react';

// CHANGED: label can now be a node (for icons), not just a string
export interface Tab<T extends string> {
    id: T;
    label: string | React.ReactNode;
}

interface TabsProps<T extends string> {
    tabs: Tab<T>[];
    activeTab: T;
    onTabClick: (id: T) => void;
    variant?: 'button' | 'underline' | 'dark-underline' | 'full-width' | 'pill' | 'pill-on-dark' | 'segmented' | 'segmented-indigo';
    className?: string;
}

export const Tabs = <T extends string>({
                                           tabs,
                                           activeTab,
                                           onTabClick,
                                           variant = 'button',
                                           className = ''
                                       }: TabsProps<T>) => {

    if (variant === 'underline') {
        return (
            <div className={`border-b border-gray-200 ${className}`}>
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
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

    if (variant === 'full-width') {
        return (
            <ul className={`flex text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-t-lg ${className}`}>
                {tabs.map((tab, index) => (
                    <li className="w-full" key={tab.id}>
                        <button
                            type="button"
                            onClick={() => onTabClick(tab.id)}
                            className={`inline-block w-full p-4 transition-colors duration-150 focus:outline-none ${
                                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            } ${index === 0 ? 'rounded-tl-lg' : ''} ${index === tabs.length - 1 ? 'rounded-tr-lg' : ''}`}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
        );
    }

    if (variant === 'dark-underline') {
        return (
            <div className={`flex border-b border-indigo-600 ${className}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`py-2 px-4 font-medium rounded-t-lg transition-colors ${
                            activeTab === tab.id
                                ? 'bg-indigo-800 text-white'
                                : 'text-indigo-300 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'pill') {
        return (
            <div className={`flex w-full gap-1 rounded-full bg-gray-900 p-1 shadow-inner overflow-x-auto ${className}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabClick(tab.id)}
                        className={`flex-1 px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full text-center transition-colors duration-150 border whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-white text-gray-900 border-gray-900 shadow-sm'
                                : 'bg-transparent text-white border-transparent hover:bg-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'pill-on-dark') {
        return (
            <div className={`flex w-full gap-1 rounded-full bg-indigo-950 p-1 shadow-inner overflow-x-auto ${className}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabClick(tab.id)}
                        className={`flex-1 px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full text-center transition-all duration-200 border whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm'
                                : 'bg-transparent text-indigo-300 border-transparent hover:text-white hover:bg-indigo-900'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'segmented') {
        return (
            <div className={`flex w-full gap-1 rounded-full bg-teal-50 p-1 shadow-inner ${className}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabClick(tab.id)}
                        className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                            activeTab === tab.id
                                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                : 'bg-transparent text-teal-700 border-transparent hover:bg-teal-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'segmented-indigo') {
        return (
            <div className={`flex w-full gap-1 rounded-full bg-indigo-50 p-1 shadow-inner ${className}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabClick(tab.id)}
                        className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-full text-center transition-colors duration-150 border ${
                            activeTab === tab.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-transparent text-indigo-700 border-transparent hover:bg-indigo-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        );
    }

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