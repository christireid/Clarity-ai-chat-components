import * as React from 'react';
export type SafetyStatus = 'pass' | 'warn' | 'fail';
export interface SafetyCheckItem {
    id: string;
    label: string;
    status: SafetyStatus;
    detail?: string;
    remediation?: string;
}
export interface SafetyStatusCardProps {
    checks: SafetyCheckItem[];
    lastReviewedAt?: Date;
    onReviewPolicy?: () => void;
    onAcknowledge?: (check: SafetyCheckItem) => void;
    className?: string;
    title?: string;
    subtitle?: string;
}
export declare const SafetyStatusCard: React.FC<SafetyStatusCardProps>;
//# sourceMappingURL=safety-status-card.d.ts.map