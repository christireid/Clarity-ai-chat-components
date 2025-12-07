import React from 'react';
export type ComponentStatus = 'stable' | 'beta' | 'deprecated' | 'new' | 'experimental';
interface StatusBadgeProps {
    status: ComponentStatus;
    className?: string;
}
export declare const StatusBadge: React.FC<StatusBadgeProps>;
export {};
//# sourceMappingURL=StatusBadge.d.ts.map