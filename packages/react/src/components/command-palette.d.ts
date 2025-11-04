import * as React from 'react';
export interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    shortcut?: string[];
    category?: string;
    onSelect: () => void;
}
export interface CommandPaletteProps {
    items: CommandItem[];
    open: boolean;
    onClose: () => void;
    placeholder?: string;
    className?: string;
}
export declare const CommandPalette: React.ForwardRefExoticComponent<CommandPaletteProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=command-palette.d.ts.map