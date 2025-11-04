import * as React from 'react';
export interface PlanAction {
    id: string;
    label: string;
    onClick: () => void;
}
export interface SeatBreakdown {
    label: string;
    used: number;
    total: number;
}
export interface AuthTenantDashboardProps {
    organizationName: string;
    planName: string;
    planBadge?: string;
    renewalDate?: string;
    seatUsage: SeatBreakdown;
    apiUsage?: {
        label: string;
        value: string;
    };
    actions?: PlanAction[];
    className?: string;
}
export declare const AuthTenantDashboard: React.FC<AuthTenantDashboardProps>;
//# sourceMappingURL=AuthTenantDashboard.d.ts.map