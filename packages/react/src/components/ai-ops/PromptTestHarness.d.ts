import * as React from 'react';
export type PromptTestStatus = 'pending' | 'running' | 'pass' | 'fail';
export interface PromptVariantItem {
    id: string;
    label: string;
}
export interface PromptTestCase {
    id: string;
    input: string;
    status: PromptTestStatus;
    output?: string;
    expected?: string;
    latencyMs?: number;
    costUsd?: number;
}
export interface PromptTestHarnessProps {
    datasetName?: string;
    datasets?: Array<{
        id: string;
        name: string;
    }>;
    variants: PromptVariantItem[];
    tests: PromptTestCase[];
    onRunAll?: () => void;
    onRunVariant?: (variantId: string) => void;
    onSelectDataset?: (datasetId: string) => void;
    isRunning?: boolean;
    className?: string;
}
export declare const PromptTestHarness: React.FC<PromptTestHarnessProps>;
//# sourceMappingURL=PromptTestHarness.d.ts.map