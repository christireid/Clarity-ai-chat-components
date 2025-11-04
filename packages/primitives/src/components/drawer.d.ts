import * as React from 'react';
export interface DrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    defaultOpen?: boolean;
}
export interface DrawerTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}
export interface DrawerContentProps {
    children: React.ReactNode;
    className?: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    blurBackdrop?: boolean;
    overlayClassName?: string;
}
export declare const Drawer: React.FC<DrawerProps>;
export declare const DrawerTrigger: React.FC<DrawerTriggerProps>;
export declare const DrawerContent: React.FC<DrawerContentProps>;
export declare const DrawerHeader: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DrawerTitle: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DrawerDescription: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DrawerBody: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DrawerFooter: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DrawerClose: React.FC<{
    children?: React.ReactNode;
    className?: string;
    asChild?: boolean;
}>;
//# sourceMappingURL=drawer.d.ts.map