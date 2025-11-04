import * as React from 'react';
export interface DropdownMenuProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}
export declare const DropdownMenu: React.FC<DropdownMenuProps>;
export interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
    disabled?: boolean;
}
export declare const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps>;
export interface DropdownMenuContentProps {
    children: React.ReactNode;
    className?: string;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    alignOffset?: number;
    loopNavigation?: boolean;
    autoFocus?: boolean;
}
declare const DropdownMenuContent: React.FC<DropdownMenuContentProps>;
export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    shortcut?: string;
    destructive?: boolean;
    inset?: boolean;
    keepOpenOnSelect?: boolean;
    active?: boolean;
}
export declare const DropdownMenuItem: React.ForwardRefExoticComponent<DropdownMenuItemProps & React.RefAttributes<HTMLButtonElement>>;
export declare const DropdownMenuSeparator: React.FC<{
    className?: string;
}>;
export declare const DropdownMenuLabel: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const DropdownMenuGroup: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export { DropdownMenuContent };
//# sourceMappingURL=dropdown-menu.d.ts.map