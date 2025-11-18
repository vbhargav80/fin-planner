import { useSuperCalculator } from '../../hooks/useSuperCalculator';
import { SuperForm } from './SuperForm';
import { SuperResults } from './SuperResults';

export function SuperCalculator() {
    const calculator = useSuperCalculator();

    return (
        <div className="bg-white shadow-xl overflow-hidden md:flex w-full h-full">
            {/* No props passed other than calculator */}
            <SuperForm calculator={calculator} />
            <SuperResults calculator={calculator} />
        </div>
    );
}