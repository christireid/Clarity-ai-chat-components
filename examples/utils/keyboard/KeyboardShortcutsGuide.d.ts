/**
 * Keyboard Shortcuts Guide Component
 *
 * A reusable keyboard shortcuts guide for chat applications.
 * Shows available shortcuts in a dialog or inline panel.
 */
import { type ReactNode } from 'react';
export interface KeyboardShortcut {
    key: string;
    modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
    description: string;
    action?: () => void;
}
export interface KeyboardShortcutsGuideProps {
    shortcuts: KeyboardShortcut[];
    className?: string;
    title?: string;
    triggerKey?: string;
    showTriggerHint?: boolean;
    children?: ReactNode;
}
export interface UseKeyboardShortcutsOptions {
    shortcuts: KeyboardShortcut[];
    enabled?: boolean;
}
export declare function useKeyboardShortcuts({ shortcuts, enabled, }: UseKeyboardShortcutsOptions): void;
export declare function ShortcutKeys({ shortcut }: {
    shortcut: KeyboardShortcut;
}): import("react").JSX.Element;
export interface ShortcutsListProps {
    shortcuts: KeyboardShortcut[];
    className?: string;
}
export declare function ShortcutsList({ shortcuts, className, }: ShortcutsListProps): import("react").JSX.Element;
export interface ShortcutsDialogProps {
    shortcuts: KeyboardShortcut[];
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}
export declare function ShortcutsDialog({ shortcuts, isOpen, onClose, title, }: ShortcutsDialogProps): import("react").JSX.Element | null;
export declare function KeyboardShortcutsGuide({ shortcuts, className, title, triggerKey, showTriggerHint, children, }: KeyboardShortcutsGuideProps): import("react").JSX.Element;
export declare const DEFAULT_CHAT_SHORTCUTS: KeyboardShortcut[];
export default KeyboardShortcutsGuide;
//# sourceMappingURL=KeyboardShortcutsGuide.d.ts.map