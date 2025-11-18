import type {
    DrawdownRow,
    SaleInputs,
    DrawdownPlanInputs,
    SaleDrawdownDerived,
    ChartDataPoint,
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
    const outstandingLoan = clampNonNegative(sale.outstandingLoan);
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

    const netProceeds = Math.max(0, salePrice - outstandingLoan - sellingCosts - totalTax);

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

    // If drawing nothing or earning more than drawing, it lasts forever
    if ((monthlyRate > 0 && balance * monthlyRate >= monthlyDraw && monthlyDraw > 0) || monthlyDraw === 0) {
        // Generate a short preview schedule anyway so the chart has data
        // But we return "Does not deplete"
        // For chart generation, we will handle this separately.
    }

    const maxMonths = 1200; // 100 years
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

// NEW: Generate comparison data for the chart (30 years)
function generateWealthChart(
    netProceeds: number,
    schedule: DrawdownRow[],
    salePrice: number,
    outstandingLoan: number,
    capitalGrowthRate: number
): ChartDataPoint[] {
    const years = 30;
    const data: ChartDataPoint[] = [];

    // Initial Point (Year 0)
    data.push({
        year: 0,
        cashWealth: netProceeds,
        propertyWealth: Math.max(0, salePrice - outstandingLoan)
    });

    let currentPropertyValue = salePrice;
    const growthDec = capitalGrowthRate / 100;

    for (let y = 1; y <= years; y++) {
        // 1. Calculate Keep Wealth
        currentPropertyValue *= (1 + growthDec);
        const keepWealth = Math.max(0, currentPropertyValue - outstandingLoan);

        // 2. Get Sell Wealth from Schedule
        // Find the balance at the end of month y*12
        const monthIndex = (y * 12) - 1;
        let sellWealth = 0;

        if (monthIndex < schedule.length) {
            sellWealth = schedule[monthIndex].endBalance;
        } else {
            sellWealth = 0; // Depleted
        }

        data.push({
            year: y,
            cashWealth: Math.round(sellWealth),
            propertyWealth: Math.round(keepWealth)
        });
    }

    return data;
}

export function computeSaleDrawdownDerived(
    sale: SaleInputs,
    plan: DrawdownPlanInputs
): SaleDrawdownDerived {
    const { taxableGain, person1Tax, person2Tax, totalTax, netProceeds } = calculateSaleAndTaxes(sale);
    const { schedule, monthsToDeplete, depletionDateLabel, durationLabel } =
        buildDrawdownSchedule(plan, netProceeds);

    // Generate Chart Data
    const chartData = generateWealthChart(
        netProceeds,
        schedule,
        sale.salePrice,
        sale.outstandingLoan,
        plan.capitalGrowthRate
    );

    return {
        taxableGain,
        person1Tax,
        person2Tax,
        totalTax,
        netProceeds,
        schedule,
        chartData, // Export
        monthsToDeplete,
        depletionDateLabel,
        durationLabel,
    };
}