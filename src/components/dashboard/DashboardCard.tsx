import React from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface DashboardCardProps {
    title: string;
    value: string;
    subValue?: React.ReactNode;
    icon: LucideIcon;
    iconColorClass: string; // e.g. "text-emerald-600 bg-emerald-100"
    onClick: () => void;
    footer?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
                                                                title,
                                                                value,
                                                                subValue,
                                                                icon: Icon,
                                                                iconColorClass,
                                                                onClick,
                                                                footer
                                                            }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${iconColorClass}`}>
                    <Icon size={24} />
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </div>

            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 break-words">
                {value}
            </h3>

            {subValue && <div className="mt-2">{subValue}</div>}

            {footer && (
                <p className="text-xs text-gray-400 mt-auto pt-4">
                    {footer}
                </p>
            )}
        </div>
    );
};