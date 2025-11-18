import type { AppConfig } from '../types/config.types';

const uuid = () => crypto.randomUUID();

export const SYSTEM_DEFAULTS: AppConfig = {
    amortization: {
        interestRate: 6,
        principal: 900000,
        monthlyRepayment: 6800,
        initialRentalIncome: 4300,
        initialOffsetBalance: 1000000,

        // Updated Keys
        monthlySalary: 10000,
        transitionalSalary: 5000,

        currentLivingExpenses: 10000,
        retirementLivingExpenses: 8000,

        rentalGrowthRate: 2.5,
        isRefinanced: false,
        considerOffsetIncome: false,
        offsetIncomeRate: 3,

        retirementDate: '2031-01',
        continueWorking: false,
        yearsWorking: 3,
    },
    super: {
        myAge: 45,
        wifeAge: 42,
        mySuper: 400000,
        wifeSuper: 110000,
        targetAge: 60,
        targetBalance: 1500000,
        netReturn: 7,
        calcMode: 'contribution',
        contributionFrequency: 'monthly',
        makeExtraContribution: false,
        myMonthlyContributionPre50: 1000,
        myMonthlyContributionPost50: 0,
        wifeMonthlyContributionPre50: 200,
        wifeMonthlyContributionPost50: 0,
        myYearlyContributionPre50: 1500,
        myYearlyContributionPost50: 0,
        wifeYearlyContributionPre50: 1500,
        wifeYearlyContributionPost50: 0,
        myExtraYearlyContribution: 2000,
        wifeExtraYearlyContribution: 2000,
        myExtraContributionYears: 1,
        wifeExtraContributionYears: 1,
        drawdownLifestyle: 'comfortable',
        drawdownAnnualAmount: 80000,
        drawdownReturn: 7,
    },
    drawdown: {
        salePrice: 1_000_000,
        outstandingLoan: 200_000,
        costBase: 600_000,
        depreciationClaimed: 50_000,
        sellingCosts: 25_000,
        person1TaxRate: 45,
        person2TaxRate: 37,
        cgtDiscountRate: 50,
        annualInterestRate: 4,
        monthlyDrawdown: 8_000,
        startMonth: '2031-01',
        netMonthlyRent: 3_000,
        netRentGrowthRate: 3,
        capitalGrowthRate: 3,
    },
    budget: {
        isAdminMode: false,
        incomes: [
            { id: uuid(), name: 'Salary', amount: 9000, initialAmount: 9000, iconKey: 'work' },
            { id: uuid(), name: 'Investment Property Rent', amount: 2100, initialAmount: 2100, iconKey: 'housing' },
        ],
        expenseCategories: [
            {
                id: uuid(),
                name: 'Housing',
                iconKey: 'housing',
                items: [
                    { id: uuid(), name: 'Mortgage Repayment', amount: 1050, initialAmount: 1050, iconKey: 'housing', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Rates', amount: 200, initialAmount: 200, iconKey: 'rates', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Body Corporate', amount: 50, initialAmount: 50, iconKey: 'housing', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Insurance', amount: 150, initialAmount: 150, iconKey: 'rates', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Maintenance', amount: 300, initialAmount: 300, iconKey: 'service', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Investment Property Expenses',
                iconKey: 'housing',
                items: [
                    { id: uuid(), name: 'Mortgage Repayment', amount: 2800, initialAmount: 2800, iconKey: 'debt', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Insurance', amount: 180, initialAmount: 180, iconKey: 'rates', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Council Rates', amount: 200, initialAmount: 200, iconKey: 'rates', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Water Rates', amount: 80, initialAmount: 80, iconKey: 'water', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Land Tax', amount: 200, initialAmount: 200, iconKey: 'rates', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Maintenance', amount: 150, initialAmount: 150, iconKey: 'service', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Utilities',
                iconKey: 'utilities',
                items: [
                    { id: uuid(), name: 'Electricity', amount: 150, initialAmount: 150, iconKey: 'electricity', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Gas', amount: 150, initialAmount: 150, iconKey: 'gas', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Water', amount: 150, initialAmount: 150, iconKey: 'water', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Internet', amount: 120, initialAmount: 120, iconKey: 'internet', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Mobile', amount: 250, initialAmount: 250, iconKey: 'mobile', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Transport',
                iconKey: 'transport',
                items: [
                    { id: uuid(), name: 'Fuel', amount: 250, initialAmount: 250, iconKey: 'transport', subGroup: 'Nissan', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Rego', amount: 100, initialAmount: 100, iconKey: 'rates', subGroup: 'Nissan', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Insurance', amount: 100, initialAmount: 100, iconKey: 'rates', subGroup: 'Nissan', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Servicing', amount: 70, initialAmount: 70, iconKey: 'service', subGroup: 'Nissan', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Roadside Assist', amount: 10, initialAmount: 10, iconKey: 'alert', subGroup: 'Nissan', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Fuel', amount: 250, initialAmount: 250, iconKey: 'transport', subGroup: 'Kia', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Rego', amount: 100, initialAmount: 100, iconKey: 'rates', subGroup: 'Kia', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Insurance', amount: 100, initialAmount: 100, iconKey: 'rates', subGroup: 'Kia', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Servicing', amount: 70, initialAmount: 70, iconKey: 'service', subGroup: 'Kia', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Roadside Assist', amount: 10, initialAmount: 10, iconKey: 'alert', subGroup: 'Kia', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Train', amount: 120, initialAmount: 120, iconKey: 'train', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Groceries & Essential',
                iconKey: 'groceries',
                items: [
                    { id: uuid(), name: 'Groceries', amount: 1000, initialAmount: 1000, iconKey: 'groceries', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Health & Insurance',
                iconKey: 'health',
                items: [
                    { id: uuid(), name: 'Private Health', amount: 350, initialAmount: 350, iconKey: 'health', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Dental', amount: 150, initialAmount: 150, iconKey: 'health', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Prescriptions', amount: 150, initialAmount: 150, iconKey: 'health', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Childcare & Education',
                iconKey: 'childcare',
                items: [
                    { id: uuid(), name: 'Radhika Fees', amount: 500, initialAmount: 500, iconKey: 'education', reduction: 0, isFixed: true },
                    { id: uuid(), name: 'Nabhi Swimming', amount: 120, initialAmount: 120, iconKey: 'childcare', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Radhika Swimming', amount: 120, initialAmount: 120, iconKey: 'childcare', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Tuition - Karen', amount: 350, initialAmount: 350, iconKey: 'education', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Tuition - Bright Minds', amount: 150, initialAmount: 150, iconKey: 'education', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Debt & Savings',
                iconKey: 'debt',
                items: [
                    { id: uuid(), name: 'Package Fee', amount: 50, initialAmount: 50, iconKey: 'debt', reduction: 0, isFixed: true },
                ]
            },
            {
                id: uuid(),
                name: 'Lifestyle & Recreation',
                iconKey: 'lifestyle',
                items: [
                    { id: uuid(), name: 'Coffee', amount: 300, initialAmount: 300, iconKey: 'lifestyle', reduction: 0, isFixed: false, isHidden: true },
                    { id: uuid(), name: 'Dining Out', amount: 400, initialAmount: 400, iconKey: 'dining', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Misc', amount: 300, initialAmount: 300, iconKey: 'entertainment', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Personal & Clothing',
                iconKey: 'personal',
                items: [
                    { id: uuid(), name: 'Haircuts', amount: 100, initialAmount: 100, iconKey: 'hair', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Clothing', amount: 400, initialAmount: 400, iconKey: 'clothing', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Cosmetics', amount: 100, initialAmount: 100, iconKey: 'personal', reduction: 0, isFixed: false },
                ]
            },
            {
                id: uuid(),
                name: 'Misc',
                iconKey: 'misc',
                items: [
                    { id: uuid(), name: 'Gifts', amount: 200, initialAmount: 200, iconKey: 'gift', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Donations', amount: 100, initialAmount: 100, iconKey: 'gift', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Unexpected Costs', amount: 200, initialAmount: 200, iconKey: 'alert', reduction: 0, isFixed: false },
                    { id: uuid(), name: 'Software Subscriptions', amount: 150, initialAmount: 150, iconKey: 'internet', reduction: 0, isFixed: false },
                ]
            },
        ]
    }
};