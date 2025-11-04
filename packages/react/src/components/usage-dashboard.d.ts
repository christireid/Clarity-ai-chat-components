import * as React from 'react';
import type { UsageStats, CreditBalance, UsageLimit } from '@clarity-chat/types';
export interface UsageDashboardProps {
    balance: CreditBalance;
    stats: UsageStats;
    limits?: UsageLimit[];
    onPurchaseCredits?: () => void;
    className?: string;
}
export declare const UsageDashboard: React.NamedExoticComponent<UsageDashboardProps>;
//# sourceMappingURL=usage-dashboard.d.ts.map