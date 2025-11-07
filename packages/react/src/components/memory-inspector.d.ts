import * as React from 'react';
export type MemoryScope = 'session' | 'thread' | 'global';
export interface MemoryItem {
    id: string;
    label: string;
    value: string;
    scope: MemoryScope;
    confidence?: number;
    source?: string;
    lastUpdated: Date;
    tokens?: number;
}
export interface MemoryInspectorProps {
    memories: MemoryItem[];
    isLoading?: boolean;
    onRemove?: (memory: MemoryItem) => void;
    onPromote?: (memory: MemoryItem) => void;
    onRefresh?: () => void;
    className?: string;
    title?: string;
    subtitle?: string;
    showHeaderActions?: boolean;
}
export declare const MemoryInspector: React.FC<MemoryInspectorProps>;
//# sourceMappingURL=memory-inspector.d.ts.map