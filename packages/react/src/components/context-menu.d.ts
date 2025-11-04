import * as React from 'react';
export interface ContextMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    shortcut?: string;
    danger?: boolean;
    disabled?: boolean;
    separator?: boolean;
    submenu?: ContextMenuItem[];
    onSelect?: () => void;
}
export interface ContextMenuProps {
    items: ContextMenuItem[];
    children: React.ReactNode;
    className?: string;
}
export declare const ContextMenu: React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=context-menu.d.ts.map