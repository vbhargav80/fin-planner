import type {
    DrawdownRow,
    SaleInputs,              // now exported via alias
    DrawdownPlanInputs,
    SaleDrawdownDerived,
} from '../../types/drawdown.types';

function clampNonNegative(n: number): number {
    return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function formatMonthLabel(d: Date): string {
    return d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
}

function parseMonthString(monthStr: string): Date {
    const [y, m] = monthStr.split('-').map(Number);
    return new Date(Date.UTC(y || 1970, (m || 1) - 1, 1, 12, 0, 0));
}

function addMonthsUTC(d: Date, add: number): Date {
    const nd = new Date(d.getTime());
    nd.setUTCMonth(nd.getUTCMonth() + add);
    return nd;
}

export function calculateSaleAndTaxes(sale: SaleInputs) {
    const salePrice = clampNonNegative(sale.salePrice);
    const costBase = clampNonNegative(sale.costBase);
    const depreciation = clampNonNegative(sale.depreciationClaimed);
    const sellingCosts = clampNonNegative(sale.sellingCosts);
    const p1Rate = clampNonNegative(sale.person1TaxRate) / 100;
    const p2Rate = clampNonNegative(sale.person2TaxRate) / 100;
    const discountRate = clampNonNegative(sale.cgtDiscountRate) / 100;

    const adjustedCostBase = Math.max(0, costBase - depreciation);
    const rawGain = salePrice - sellingCosts - adjustedCostBase;
    const taxableGain = Math.max(0, rawGain);

    const perOwnerDiscountedGain = (taxableGain * 0.5) * (1 - discountRate);

    const person1Tax = perOwnerDiscountedGain * p1Rate;
    const person2Tax = perOwnerDiscountedGain * p2Rate;
    const totalTax = person1Tax + person2Tax;

    const netProceeds = Math.max(0, salePrice - sellingCosts - totalTax);

    return { taxableGain, person1Tax, person2Tax, totalTax, netProceeds };
}

export function buildDrawdownSchedule(
    plan: DrawdownPlanInputs,
    startingBalance: number
): {
    schedule: DrawdownRow[];
    monthsToDeplete: number | null;
    depletionDateLabel: string | null;
    durationLabel: string;
} {
    const annualRate = Math.max(0, plan.annualInterestRate) / 100;
    const monthlyRate = annualRate / 12;
    const monthlyDraw = Math.max(0, plan.monthlyDrawdown);
    const startDate = parseMonthString(plan.startMonth);

    let currentRentLost = clampNonNegative(plan.netMonthlyRent);

    const schedule: DrawdownRow[] = [];
    let balance = clampNonNegative(startingBalance);

    if ((monthlyRate > 0 && balance * monthlyRate >= monthlyDraw && monthlyDraw > 0) || monthlyDraw === 0) {
        return { schedule, monthsToDeplete: null, depletionDateLabel: null, durationLabel: 'Does not deplete' };
    }

    const maxMonths = 1200;
    let months = 0;
    while (balance > 0 && months < maxMonths) {
        const date = addMonthsUTC(startDate, months);

        if (months > 0 && date.getUTCMonth() === 0) {
            currentRentLost *= (1 + (plan.netRentGrowthRate / 100));
        }

        const startBalance = balance;
        const interest = startBalance * monthlyRate;
        const available = startBalance + interest;
        const draw = Math.min(monthlyDraw, available);
        const endBalance = Math.max(0, available - draw);

        schedule.push({
            // removed `index` to satisfy DrawdownRow
            dateLabel: formatMonthLabel(date),
            startBalance,
            interestEarned: interest,
            drawdown: draw,
            endBalance,
            rentLost: currentRentLost,
        });

        balance = endBalance;
        months++;
    }

    const depletes = balance <= 0;
    const monthsToDeplete = depletes ? months : null;
    const depletionDateLabel = depletes ? formatMonthLabel(addMonthsUTC(startDate, months - 1)) : null;
    const years = depletes ? Math.floor(months / 12) : 0;
    const remMonths = depletes ? months % 12 : 0;
    const durationLabel = depletes ? `${years} years ${remMonths} months` : 'Does not deplete';

    return { schedule, monthsToDeplete, depletionDateLabel, durationLabel };
}

export function computeSaleDrawdownDerived(
    sale: SaleInputs,
    plan: DrawdownPlanInputs
): SaleDrawdownDerived {
    const { taxableGain, person1Tax, person2Tax, totalTax, netProceeds } = calculateSaleAndTaxes(sale);
    const { schedule, monthsToDeplete, depletionDateLabel, durationLabel } =
        buildDrawdownSchedule(plan, netProceeds);

    return {
        taxableGain,
        person1Tax,
        person2Tax,
        totalTax,
        netProceeds,
        schedule,
        monthsToDeplete,
        depletionDateLabel,
        durationLabel,
    };
}