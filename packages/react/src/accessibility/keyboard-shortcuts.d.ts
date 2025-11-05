/**
 * Keyboard Shortcuts System
 *
 * Customizable keyboard shortcuts with help modal
 */
import * as React from 'react';
export interface KeyboardShortcut {
    id: string;
    keys: string[];
    description: string;
    category?: string;
    handler: (e: KeyboardEvent) => void;
    enabled?: boolean;
}
interface KeyboardShortcutsContextValue {
    shortcuts: KeyboardShortcut[];
    registerShortcut: (shortcut: KeyboardShortcut) => () => void;
    unregisterShortcut: (id: string) => void;
    showHelp: () => void;
    hideHelp: () => void;
}
export interface KeyboardShortcutsProviderProps {
    children: React.ReactNode;
    shortcuts?: KeyboardShortcut[];
}
/**
 * Keyboard Shortcuts Provider
 *
 * Manages global keyboard shortcuts
 */
export declare function KeyboardShortcutsProvider({ children, shortcuts: initialShortcuts, }: KeyboardShortcutsProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to use keyboard shortcuts
 */
export declare function useKeyboardShortcuts(): KeyboardShortcutsContextValue;
/**
 * Hook to register a keyboard shortcut
 */
export declare function useKeyboardShortcut(keys: string | string[], handler: (e: KeyboardEvent) => void, options?: {
    id?: string;
    description?: string;
    category?: string;
    enabled?: boolean;
}): void;
/**
 * Default keyboard shortcuts
 */
export declare const defaultShortcuts: Omit<KeyboardShortcut, 'handler'>[];
export {};
//# sourceMappingURL=keyboard-shortcuts.d.ts.map