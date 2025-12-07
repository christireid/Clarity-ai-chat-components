import React from 'react';
import { ComponentStatus } from './StatusBadge';
interface ComponentHeaderProps {
    title: string;
    status?: ComponentStatus;
    description?: string;
    version?: string;
    figmaUrl?: string;
    className?: string;
}
export declare const ComponentHeader: React.FC<ComponentHeaderProps>;
export {};
//# sourceMappingURL=ComponentHeader.d.ts.map