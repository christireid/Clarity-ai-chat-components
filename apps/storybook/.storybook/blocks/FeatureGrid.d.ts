import React from 'react';
export interface Feature {
    title: string;
    description: string;
    icon?: React.ReactNode;
}
interface FeatureGridProps {
    features: Feature[];
    columns?: 2 | 3 | 4;
    className?: string;
}
export declare const FeatureGrid: React.FC<FeatureGridProps>;
export {};
//# sourceMappingURL=FeatureGrid.d.ts.map