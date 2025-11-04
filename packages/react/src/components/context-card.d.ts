import * as React from 'react';
import type { Context } from '@clarity-chat/types';
export interface ContextCardProps {
    context: Context;
    onRemove?: (id: string) => void;
    onToggle?: (id: string) => void;
    onPreview?: (context: Context) => void;
    showActions?: boolean;
    className?: string;
}
export declare const ContextCard: React.NamedExoticComponent<ContextCardProps>;
//# sourceMappingURL=context-card.d.ts.map