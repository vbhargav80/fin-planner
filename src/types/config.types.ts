import type { State as AmortizationState } from './amortization.types';
import type { State as SuperState } from './super.types';
import type { State as DrawdownState } from './drawdown.types';
import type { State as BudgetState } from './budget.types';

export interface AppConfig {
    amortization: AmortizationState;
    super: SuperState;
    drawdown: DrawdownState;
    budget: BudgetState;
}

export interface ConfigContextType {
    config: AppConfig;
    updateConfig: (newConfig: AppConfig) => void;
    resetToSystemDefaults: () => void;
}