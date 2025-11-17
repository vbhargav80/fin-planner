import { useState } from 'react';
import { useBudgetPlanner } from '../../hooks/useBudgetPlanner';
import { formatCurrency } from '../../utils/formatters';
import { InputGroup } from '../common/InputGroup';
import { Tabs } from '../common/Tabs';
import { Wallet, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

export function BudgetPlanner() {
    const { state, dispatch, totalIncome, totalExpenses, remaining } = useBudgetPlanner();

    // UI State
    const [viewMode, setViewMode] = useState<'income' | 'expenses'>('expenses');
    // Default to the first category if available
    const [activeCategoryId, setActiveCategoryId] = useState<string>(
        state.expenseCategories.length > 0 ? state.expenseCategories[0].id : ''
    );

    const activeCategory = state.expenseCategories.find(c => c.id === activeCategoryId);

    const VIEW_TABS = [
        { id: 'expenses', label: 'Expenses' },
        { id: 'income', label: 'Income' },
    ];

    return (
        <div className="bg-gray-100 shadow-xl overflow-hidden md:flex w-full h-full">
            {/* LEFT PANEL: Navigation & Form (45%) */}
            <div className="md:w-[45%] flex flex-col bg-white border-r border-gray-200 h-full">

                {/* Header & Main Toggle */}
                <div className="p-6 border-b border-gray-200 bg-white z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <Wallet size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Budget Planner</h2>
                    </div>
                    <Tabs
                        tabs={VIEW_TABS}
                        activeTab={viewMode}
                        onTabClick={(id) => setViewMode(id as any)}
                        variant="segmented-indigo"
                    />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-hidden flex">

                    {/* EXPENSES VIEW */}
                    {viewMode === 'expenses' && (
                        <>
                            {/* Category Sidebar (Left strip) */}
                            <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto custom-scrollbar">
                                <div className="py-2">
                                    {state.expenseCategories.map(cat => {
                                        // Calculate category total for preview
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
                                                <div className={`text-sm font-semibold ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                    {cat.name}
                                                </div>
                                                <div className={`text-xs mt-1 font-medium ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                                    {formatCurrency(catTotal)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Active Category Details (Right area) */}
                            <div className="w-2/3 bg-white overflow-y-auto p-6">
                                {activeCategory ? (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</span>
                                                <h3 className="text-xl font-bold text-gray-900">{activeCategory.name}</h3>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-medium text-gray-500">Subtotal</span>
                                                <div className="text-lg font-bold text-indigo-600">
                                                    {formatCurrency(activeCategory.items.reduce((sum, i) => sum + i.amount, 0))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {activeCategory.items.map(item => (
                                                <InputGroup
                                                    key={item.id}
                                                    id={item.id}
                                                    label={item.name}
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
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <p>Select a category</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* INCOME VIEW */}
                    {viewMode === 'income' && (
                        <div className="w-full p-6 overflow-y-auto bg-white">
                            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Income Sources</h3>
                                    <p className="text-sm text-gray-500 mt-1">Post-tax monthly income</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-gray-500">Total Income</span>
                                    <div className="text-lg font-bold text-green-600">
                                        {formatCurrency(totalIncome)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {state.incomes.map(item => (
                                    <InputGroup
                                        key={item.id}
                                        id={item.id}
                                        label={item.name}
                                        value={item.amount}
                                        onChange={(val) => dispatch({
                                            type: 'UPDATE_INCOME',
                                            payload: { ...item, amount: val }
                                        })}
                                        symbol="$"
                                        symbolPosition="left"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: Results & Dashboard (55%) */}
            <div className="md:w-[55%] bg-indigo-900 text-white flex flex-col h-full overflow-y-auto">
                <div className="p-8 md:p-12">
                    <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                        <DollarSign className="text-indigo-400" size={32} />
                        Monthly Summary
                    </h3>

                    {/* Big Scorecards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-indigo-800/50 rounded-xl p-4 border border-indigo-700/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-indigo-200 mb-2">
                                <TrendingUp size={18} />
                                <span className="text-sm font-medium">Income</span>
                            </div>
                            <div className="text-2xl font-bold text-green-300 font-mono">
                                {formatCurrency(totalIncome)}
                            </div>
                        </div>

                        <div className="bg-indigo-800/50 rounded-xl p-4 border border-indigo-700/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-indigo-200 mb-2">
                                <TrendingDown size={18} />
                                <span className="text-sm font-medium">Expenses</span>
                            </div>
                            <div className="text-2xl font-bold text-red-300 font-mono">
                                {formatCurrency(totalExpenses)}
                            </div>
                        </div>

                        <div className={`rounded-xl p-4 border backdrop-blur-sm ${remaining >= 0 ? 'bg-emerald-900/40 border-emerald-700/50' : 'bg-rose-900/40 border-rose-700/50'}`}>
                            <div className={`flex items-center gap-2 mb-2 ${remaining >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
                                <Wallet size={18} />
                                <span className="text-sm font-medium">Net Result</span>
                            </div>
                            <div className={`text-2xl font-bold font-mono ${remaining >= 0 ? 'text-white' : 'text-white'}`}>
                                {formatCurrency(remaining)}
                            </div>
                        </div>
                    </div>

                    {/* Visualization / Breakdown */}
                    <div className="bg-indigo-800 rounded-2xl p-6 shadow-inner">
                        <h4 className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-6">Where is your money going?</h4>

                        <div className="space-y-5">
                            {state.expenseCategories.map(cat => {
                                const catTotal = cat.items.reduce((sum, i) => sum + i.amount, 0);
                                const percentage = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;

                                // Hide categories with 0 spend to keep list clean
                                if (percentage === 0) return null;

                                return (
                                    <div key={cat.id} className="group">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-indigo-100 font-medium group-hover:text-white transition-colors">{cat.name}</span>
                                            <div className="text-right">
                                                <span className="text-white font-mono mr-3">{formatCurrency(catTotal)}</span>
                                                <span className="text-indigo-300 text-xs w-8 inline-block text-right">{percentage.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-indigo-950 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-indigo-400 h-full rounded-full transition-all duration-500 ease-out group-hover:bg-indigo-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}