import React from 'react';
import type { SuperResultData } from '../../types/super.types';
import { formatCurrency } from '../../utils/formatters';

interface SuperSummaryProps {
    results: SuperResultData;
}

export const SuperSummary: React.FC<SuperSummaryProps> = ({ results }) => {
    return (
        <div className="animate-fade-in text-center">
            {results.calcMode === 'contribution' && (
                <>
                    {results.pmt > 0 && (
                        <>
                            <span className="text-lg font-medium text-indigo-200">
                                Combined Monthly Contribution Needed:
                            </span>
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mt-2 mb-6">
                                {formatCurrency(results.pmt)}
                            </h1>
                            <div className="text-indigo-200 space-y-2 text-left bg-indigo-800 p-4 rounded-lg">
                                <p>
                                    To reach your{' '}
                                    <strong>{formatCurrency(results.target || 0)}</strong>{' '}
                                    goal in <strong>{results.years} years</strong>:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>
                                        Your combined start of{' '}
                                        <strong>{formatCurrency(results.start)}</strong>{' '}
                                        is projected to grow to{' '}
                                        <strong>{formatCurrency(results.fvStart)}</strong>.
                                    </li>
                                    <li>
                                        Your monthly contributions will cover the remaining shortfall.
                                    </li>
                                </ul>
                                <p className="pt-2">
                                    This assumes an average annual net return of{' '}
                                    <strong>{results.rate}%</strong>.
                                </p>
                            </div>
                        </>
                    )}

                    {results.pmt <= 0 && (
                        <>
                            <span className="text-lg font-medium text-indigo-200">
                                Congratulations!
                            </span>
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mt-2 mb-6">
                                {formatCurrency(0)}
                            </h1>
                            <div className="text-indigo-200 space-y-2 text-left bg-indigo-800 p-4 rounded-lg">
                                <p>
                                    Based on your inputs, your combined starting balance of{' '}
                                    <strong>{formatCurrency(results.start)}</strong> is projected to
                                    reach (or exceed) your goal of{' '}
                                    <strong>{formatCurrency(results.target || 0)}</strong> in{' '}
                                    <strong>{results.years} years</strong> *without* any additional
                                    contributions.
                                </p>
                                <p className="pt-2">
                                    Your projected final balance is{' '}
                                    <strong>{formatCurrency(results.finalBalance)}</strong>.
                                </p>
                                <p className="pt-2">
                                    This assumes an average annual net return of{' '}
                                    <strong>{results.rate}%</strong>.
                                </p>
                            </div>
                        </>
                    )}
                </>
            )}

            {results.calcMode === 'balance' && (
                <>
                    <span className="text-lg font-medium text-indigo-200">
                        Projected Combined Balance:
                    </span>
                    <h1 className="text-5xl lg:text-6xl font-bold text-white mt-2 mb-6">
                        {formatCurrency(results.projectedBalance || 0)}
                    </h1>
                    <div className="text-indigo-200 space-y-2 text-left bg-indigo-800 p-4 rounded-lg">
                        <p>
                            With a combined monthly contribution of{' '}
                            <strong>{formatCurrency(results.pmt)}</strong> and{' '}
                            {/* FIXED: Use pmtFuture instead of pmtPost50 */}
                            {results.pmtFuture !== undefined && results.pmtFuture !== results.pmt && (
                                <><strong>{formatCurrency(results.pmtFuture)} (future step)</strong> </>
                            )}
                            for <strong>{results.years} years</strong>:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                Your combined start of{' '}
                                <strong>{formatCurrency(results.start)}</strong> is projected to grow
                                to <strong>{formatCurrency(results.fvStart)}</strong>.
                            </li>
                            <li>
                                Your contributions are projected to add{' '}
                                <strong>
                                    {formatCurrency((results.projectedBalance || 0) - results.fvStart)}
                                </strong>
                                .
                            </li>
                        </ul>
                        <p className="pt-2">
                            This assumes an average annual net return of{' '}
                            <strong>{results.rate}%</strong>.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};