// File: src/components/budget/ExpensesManager.tsx
import React, { useState, useMemo, useEffect } from 'react';
import type { ExpenseCategory, Action, ExpenseItem } from '../../types/budget.types';
import { formatCurrency } from '../../utils/formatters';
import { InputGroup } from '../common/InputGroup';
import { CategoryIcon } from './CategoryIcon';
import { Tabs } from '../common/Tabs';

interface Props {
    categories: ExpenseCategory[];
    dispatch: React.Dispatch<Action>;
}

export const ExpensesManager: React.FC<Props> = ({ categories, dispatch }) => {
    const [activeCategoryId, setActiveCategoryId] = useState<string>(
        categories.length > 0 ? categories[0].id : ''
    );

    const activeCategory = useMemo(() =>
            categories.find(c => c.id === activeCategoryId),
        [categories, activeCategoryId]);

    // Group items, IGNORING HIDDEN ONES for the UI
    const groupedItems = useMemo(() => {
        if (!activeCategory) return {};
        const groups: Record<string, ExpenseItem[]> = { 'General': [] };

        activeCategory.items.forEach(item => {
            // FILTER HERE: Skip rendering if hidden
            if (item.isHidden) return;

            const key = item.subGroup || 'General';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        if (groups['General'].length === 0 && Object.keys(groups).length > 1) {
            delete groups['General'];
        }

        return groups;
    }, [activeCategory]);

    const groupNames = Object.keys(groupedItems);
    const [activeSubGroup, setActiveSubGroup] = useState<string>(groupNames[0] || 'General');

    useEffect(() => {
        if (groupNames.length > 0) {
            setActiveSubGroup(groupNames[0]);
        }
    }, [activeCategory?.id]);

    return (
        <div className="flex-1 overflow-hidden flex h-full">
            {/* Category Sidebar */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto custom-scrollbar">
                <div className="py-2">
                    {categories.map(cat => {
                        // Calculate total including hidden items (or excluding? usually we want the visible total?)
                        // Based on your requirement "still use their values in calcs", the TOTALS should usually reflect reality.
                        // However, for the sidebar "preview", it might be confusing if the total doesn't match the visible items.
                        // Let's stick to the requirement: "Use values in calcs". So I will keep the TRUE total here.
                        const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);
                        const isActive = cat.id === activeCategoryId;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`w-full text-left px-4 py-3 border-l-4 transition-all hover:bg-gray-100 group ${
                                    isActive
                                        ? 'bg-white border-indigo-600 shadow-sm'
                                        : 'border-transparent text-gray-600'
                                }`}
                            >
                                <div className={`text-sm font-semibold flex items-center gap-2 ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                                    <CategoryIcon iconKey={cat.iconKey} size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                                    <span className="truncate">{cat.name}</span>
                                </div>
                                <div className={`text-xs mt-1 font-medium pl-6 ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                    {formatCurrency(catTotal)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Details Area */}
            <div className="w-2/3 bg-white overflow-y-auto p-6">
                {activeCategory ? (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</span>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <CategoryIcon iconKey={activeCategory.iconKey} size={24} className="text-indigo-600" />
                                    {activeCategory.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-medium text-gray-500">Subtotal</span>
                                <div className="text-lg font-bold text-indigo-600">
                                    {formatCurrency(activeCategory.items.reduce((sum, i) => sum + i.amount, 0))}
                                </div>
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

                        <div className="grid grid-cols-1 gap-4">
                            {(groupedItems[activeSubGroup] || []).map(item => {
                                const step = Math.max(1, Math.round(item.amount * 0.05));
                                return (
                                    <InputGroup
                                        key={item.id}
                                        id={item.id}
                                        label={item.name}
                                        labelIcon={<CategoryIcon iconKey={item.iconKey} size={16} />}
                                        value={item.amount}
                                        onChange={(val) => dispatch({
                                            type: 'UPDATE_EXPENSE_ITEM',
                                            payload: {
                                                categoryId: activeCategory.id,
                                                item: { ...item, amount: val }
                                            }
                                        })}
                                        symbol="$"
                                        symbolPosition="left"
                                        step={step}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p>Select a category</p>
                    </div>
                )}
            </div>
        </div>
    );
};