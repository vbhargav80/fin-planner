// File: 'src/components/drawdown-simulator/DrawdownSimulator.tsx'
import React from 'react';
import { useSaleDrawdownCalculator } from '../../hooks/useSaleDrawdownCalculator';
import { DrawdownForm } from './DrawdownForm';
import { DrawdownResults } from './DrawdownResults';

export const DrawdownSimulator: React.FC = () => {
    const model = useSaleDrawdownCalculator();

    return (
        <div className="min-h-full flex">
            <DrawdownForm model={model} />
            <DrawdownResults
                netProceeds={model.netProceeds}
                durationLabel={model.durationLabel}
                person1Tax={model.person1Tax}
                person2Tax={model.person2Tax}
                schedule={model.schedule}
            />
        </div>
    );
};
