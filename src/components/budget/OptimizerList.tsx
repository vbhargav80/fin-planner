// File: src/components/budget/OptimizerList.tsx
import React, { useState, useMemo, useEffect } from 'react';
import type { ExpenseCategory, Action, ExpenseItem } from '../../types/budget.types';
import { formatCurrency } from '../../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { Lock, Unlock, EyeOff } from 'lucide-react';
import { Tabs } from '../common/Tabs';

interface Props {
    categories: ExpenseCategory[];
    dispatch: React.Dispatch<Action>;
    isAdminMode: boolean; // New Prop
}

// ... (SAVING_OPTIONS const remains same)
const SAVING_OPTIONS = [
    { label: 'Keep', val: 0, color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
    { label: 'Trim 10%', val: 10, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: 'Cut 20%', val: 20, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' },
    { label: 'Slash 50%', val: 50, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
    { label: 'Drop', val: 100, color: 'bg-red-50 text-red-600 hover:bg-red-100' },
];

export const OptimizerList: React.FC<Props> = ({ categories, dispatch, isAdminMode }) => {
    const [activeCategoryId, setActiveCategoryId] = useState<string>(
        categories.length > 0 ? categories[0].id : ''
    );

    const activeCategory = useMemo(() =>
            categories.find(c => c.id === activeCategoryId),
        [categories, activeCategoryId]);

    const groupedItems = useMemo(() => {
        if (!activeCategory) return {};
        const groups: Record<string, ExpenseItem[]> = { 'General': [] };

        activeCategory.items.forEach(item => {
            // --- VISIBILITY LOGIC ---
            if (item.isHidden && !isAdminMode) return;

            const key = item.subGroup || 'General';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        if (groups['General'].length === 0 && Object.keys(groups).length > 1) {
            delete groups['General'];
        }
        return groups;
    }, [activeCategory, isAdminMode]);

    const groupNames = Object.keys(groupedItems);
    const [activeSubGroup, setActiveSubGroup] = useState<string>(groupNames[0] || 'General');

    useEffect(() => {
        if (groupNames.length > 0 && !groupNames.includes(activeSubGroup)) {
            setActiveSubGroup(groupNames[0]);
        }
    }, [activeCategory?.id, isAdminMode]);

    return (
        <div className="flex-1 overflow-hidden flex h-full">
            {/* Sidebar (Same logic as before) */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto custom-scrollbar">
                <div className="py-2">
                    {categories.map(cat => {
                        const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);
                        const catSavings = cat.items.reduce((sum, i) => sum + (i.amount * (i.reduction/100)), 0);
                        const isActive = cat.id === activeCategoryId;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`w-full text-left px-4 py-3 border-l-4 transition-all group ${
                                    isActive ? 'bg-white border-indigo-600 shadow-sm' : 'border-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className={`text-sm font-semibold flex items-center gap-2 ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                                    <CategoryIcon iconKey={cat.iconKey} size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                                    <span className="truncate">{cat.name}</span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                     <span className={`text-xs font-medium ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}>
                                        {formatCurrency(catTotal)}
                                    </span>
                                    {catSavings > 0 && (
                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                            -{formatCurrency(catSavings)}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Detail Area */}
            <div className="w-2/3 bg-white overflow-y-auto p-6">
                {activeCategory ? (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Optimize Category</span>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <CategoryIcon iconKey={activeCategory.iconKey} size={24} className="text-indigo-600" />
                                    {activeCategory.name}
                                </h3>
                            </div>
                        </div>

                        {groupNames.length > 1 && (
                            <div className="mb-6">
                                <Tabs
                                    tabs={groupNames.map(name => ({ id: name, label: name }))}
                                    activeTab={activeSubGroup}
                                    onTabClick={setActiveSubGroup}
                                    variant="segmented-indigo"
                                />
                            </div>
                        )}

                        <div className="space-y-8">
                            {(groupedItems[activeSubGroup] || []).map(item => {
                                const savings = item.amount * (item.reduction / 100);
                                const newAmount = item.amount - savings;

                                return (
                                    <div key={item.id} className="group">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                {item.isHidden ? (
                                                    <EyeOff size={18} className="text-red-400" />
                                                ) : (
                                                    <CategoryIcon iconKey={item.iconKey} size={18} className="text-gray-400" />
                                                )}
                                                <span className={`text-sm font-medium ${item.isHidden ? 'text-red-500' : 'text-gray-700'}`}>
                                                    {item.name}
                                                </span>

                                                <button
                                                    onClick={() => dispatch({
                                                        type: 'TOGGLE_EXPENSE_FIXED',
                                                        payload: { categoryId: activeCategory.id, itemId: item.id }
                                                    })}
                                                    className={`p-1 rounded-md transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                        item.isFixed
                                                            ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                            : 'text-indigo-200 hover:text-indigo-500 hover:bg-indigo-50'
                                                    }`}
                                                    title={item.isFixed ? "Locked" : "Editable"}
                                                >
                                                    {item.isFixed ? <Lock size={14} /> : <Unlock size={14} />}
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                {!item.isFixed && item.reduction > 0 ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs text-gray-400 line-through decoration-red-400 decoration-1">
                                                            {formatCurrency(item.amount)}
                                                        </span>
                                                        <span className="text-sm font-bold text-green-600">
                                                            {formatCurrency(newAmount)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(item.amount)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {item.isFixed ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-400 border border-gray-200 select-none cursor-not-allowed">
                                                    <Lock size={12} />
                                                    Fixed Cost
                                                </span>
                                            ) : (
                                                SAVING_OPTIONS.map((opt) => {
                                                    const isSelected = item.reduction === opt.val;
                                                    return (
                                                        <button
                                                            key={opt.val}
                                                            onClick={() => dispatch({
                                                                type: 'UPDATE_EXPENSE_REDUCTION',
                                                                payload: { categoryId: activeCategory.id, itemId: item.id, reduction: opt.val }
                                                            })}
                                                            className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all border ${
                                                                isSelected
                                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                                                    : `border-gray-100 ${opt.color}`
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p>Select a category to optimize</p>
                    </div>
                )}
            </div>
        </div>
    );
};