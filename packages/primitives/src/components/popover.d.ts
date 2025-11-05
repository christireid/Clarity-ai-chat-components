import * as React from 'react';
export interface PopoverProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    defaultOpen?: boolean;
}
export interface PopoverTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
}
export interface PopoverContentProps {
    children: React.ReactNode;
    className?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    showArrow?: boolean;
    avoidCollisions?: boolean;
    collisionPadding?: number;
}
export declare const Popover: React.FC<PopoverProps>;
export declare const PopoverTrigger: React.FC<PopoverTriggerProps>;
export declare const PopoverContent: React.FC<PopoverContentProps>;
export declare const PopoverClose: React.FC<{
    children?: React.ReactNode;
    className?: string;
    asChild?: boolean;
}>;
export declare const PopoverAnchor: React.FC<{
    children: React.ReactNode;
}>;
//# sourceMappingURL=popover.d.ts.map