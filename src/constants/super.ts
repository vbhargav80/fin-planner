// File: src/constants/super.ts
export const TARGET_AGE = { MIN: 58, MAX: 65, STEP: 1 };
export const TARGET_BALANCE = { MIN: 1400000, MAX: 1700000, STEP: 50000 };
export const NET_RETURN = { MIN: 5, MAX: 8, STEP: 0.1 };
export const CURRENT_AGE = { MIN: 30, MAX: 55, STEP: 1 };
export const CURRENT_SUPER = { MIN: 0, MAX: 1000000, STEP: 10000 };
export const MONTHLY_CONTRIBUTION = { MIN: 0, MAX: 2000, STEP: 50 };
export const YEARLY_CONTRIBUTION = { MIN: 0, MAX: 24000, STEP: 500 };
export const EXTRA_YEARLY_CONTRIBUTION = { MIN: 0, MAX: 27500, STEP: 500 };
export const EXTRA_CONTRIBUTION_YEARS = { MIN: 0, MAX: 15, STEP: 1 };

// NEW: Drawdown Constants
export const DRAWDOWN_AMOUNT = {
    MIN: 40000,
    MAX: 150000,
    STEP: 1000,
};

export const DRAWDOWN_RETURN = {
    MIN: 3,
    MAX: 9,
    STEP: 0.1,
};

export const LIFESTYLE_AMOUNTS = {
    modest: 55000,
    comfortable: 80000,
    luxury: 100000,
};