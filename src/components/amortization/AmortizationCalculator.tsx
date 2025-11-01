import { useAmortizationCalculator } from '../../hooks/useAmortizationCalculator';
import { AmortizationForm } from './AmortizationForm';
import { AmortizationTable } from './AmortizationTable';

export function AmortizationCalculator() {
    const calculator = useAmortizationCalculator();

    return (
        <div className="bg-white shadow-xl overflow-hidden md:flex w-full h-full">
            <AmortizationForm calculator={calculator} />
            <AmortizationTable calculator={calculator} />
        </div>
    );
}