import * as React from 'react';
export interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delay?: number;
    showArrow?: boolean;
    className?: string;
    contentClassName?: string;
    disabled?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
export declare const Tooltip: React.FC<TooltipProps>;
export declare const SimpleTooltip: React.FC<{
    children: React.ReactNode;
    text: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    delay?: number;
}>;
//# sourceMappingURL=tooltip.d.ts.map