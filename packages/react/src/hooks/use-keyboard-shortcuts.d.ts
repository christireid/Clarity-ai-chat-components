export type KeyboardShortcut = {
    /**
     * Key combination (e.g., 'mod+k', 'ctrl+shift+f', 'escape')
     * Use 'mod' for Cmd on Mac, Ctrl on Windows/Linux
     */
    key: string;
    /**
     * Callback when shortcut is triggered
     */
    callback: (event: KeyboardEvent) => void;
    /**
     * Description for documentation
     */
    description?: string;
    /**
     * Whether shortcut is enabled
     * @default true
     */
    enabled?: boolean;
    /**
     * Prevent default browser behavior
     * @default true
     */
    preventDefault?: boolean;
    /**
     * Enable in input elements
     * @default false
     */
    enableInInput?: boolean;
};
/**
 * Register keyboard shortcuts with support for modifiers
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: 'mod+k',
 *     callback: () => setSearchOpen(true),
 *     description: 'Open search'
 *   },
 *   {
 *     key: 'escape',
 *     callback: () => setSearchOpen(false),
 *     description: 'Close search'
 *   },
 *   {
 *     key: 'mod+enter',
 *     callback: handleSubmit,
 *     description: 'Submit form',
 *     enableInInput: true
 *   }
 * ])
 * ```
 */
export declare function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void;
/**
 * Hook for getting shortcut display string (e.g., '⌘K' on Mac, 'Ctrl+K' on Windows)
 *
 * @example
 * ```tsx
 * const getShortcut = useShortcutDisplay()
 *
 * return <kbd>{getShortcut('mod+k')}</kbd> // Shows ⌘K on Mac, Ctrl+K on Windows
 * ```
 */
export declare function useShortcutDisplay(): (pattern: string) => string;
//# sourceMappingURL=use-keyboard-shortcuts.d.ts.map