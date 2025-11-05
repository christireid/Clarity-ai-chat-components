import * as React from 'react';
import type { Context, ContextType } from '@clarity-chat/types';
export interface ContextManagerProps {
    contexts: Context[];
    onAdd: (contexts: Context[]) => void;
    onRemove: (id: string) => void;
    onToggle: (id: string) => void;
    onPreview?: (context: Context) => void;
    maxContexts?: number;
    allowedTypes?: ContextType[];
    className?: string;
}
export declare const ContextManager: React.NamedExoticComponent<ContextManagerProps>;
//# sourceMappingURL=context-manager.d.ts.map