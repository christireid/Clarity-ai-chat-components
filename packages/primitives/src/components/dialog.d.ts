import * as React from 'react';
export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    modal?: boolean;
    defaultOpen?: boolean;
}
export interface DialogTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}
export interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    animation?: 'scale' | 'slide-up' | 'slide-down' | 'fade' | 'zoom';
    blurBackdrop?: boolean;
    overlayClassName?: string;
}
export interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}
export interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}
export interface DialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
}
export interface DialogFooterProps {
    children: React.ReactNode;
    className?: string;
}
export interface DialogCloseProps {
    children?: React.ReactNode;
    className?: string;
    asChild?: boolean;
}
export declare const Dialog: React.FC<DialogProps>;
export declare const DialogTrigger: React.FC<DialogTriggerProps>;
export declare const DialogContent: React.FC<DialogContentProps>;
export declare const DialogHeader: React.FC<DialogHeaderProps>;
export declare const DialogTitle: React.FC<DialogTitleProps>;
export declare const DialogDescription: React.FC<DialogDescriptionProps>;
export declare const DialogBody: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DialogFooter: React.FC<DialogFooterProps>;
export declare const DialogClose: React.FC<DialogCloseProps>;
//# sourceMappingURL=dialog.d.ts.map