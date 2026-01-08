'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useKeyboardShortcuts, useShortcutDisplay } from './use-keyboard-shortcuts';
/**
 * Hook to manage command palette state with keyboard shortcut support
 *
 * Features:
 * - Toggle behavior (Cmd+K opens if closed, closes if open)
 * - Platform-aware shortcuts (Cmd on Mac, Ctrl on Windows/Linux)
 * - Configurable shortcut key
 * - Callbacks for open/close/toggle events
 *
 * This hook composes `useKeyboardShortcuts` and `useShortcutDisplay` internally
 * for consistent behavior with other keyboard shortcuts in the application.
 *
 * @example
 * ```tsx
 * const { isOpen, toggle, close, shortcutDisplay } = useCommandPalette()
 *
 * return (
 *   <>
 *     <button onClick={toggle}>
 *       Command Palette ({shortcutDisplay})
 *     </button>
 *     <CommandPalette
 *       items={commands}
 *       open={isOpen}
 *       onClose={close}
 *     />
 *   </>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { isOpen, close } = useCommandPalette({
 *   onOpen: () => console.log('Opened'),
 *   onClose: () => console.log('Closed'),
 *   shortcut: 'mod+p', // Use Cmd+P instead of Cmd+K
 * })
 * ```
 */
export function useCommandPalette(options = {}) {
    const { defaultOpen = false, shortcut = 'mod+k', shortcutEnabled = true, onOpen, onClose, onToggle, enableInInput = false, } = options;
    const [isOpen, setIsOpenState] = useState(defaultOpen);
    // Track previous state for callback invocation
    const prevIsOpenRef = useRef(defaultOpen);
    // Store callbacks in refs to avoid re-registering shortcuts
    const onOpenRef = useRef(onOpen);
    const onCloseRef = useRef(onClose);
    const onToggleRef = useRef(onToggle);
    useEffect(() => {
        onOpenRef.current = onOpen;
        onCloseRef.current = onClose;
        onToggleRef.current = onToggle;
    }, [onOpen, onClose, onToggle]);
    // Fire callbacks when state changes (not during render)
    useEffect(() => {
        // Skip initial mount - only fire on actual changes
        if (prevIsOpenRef.current === isOpen)
            return;
        if (isOpen) {
            onOpenRef.current?.();
        }
        else {
            onCloseRef.current?.();
        }
        onToggleRef.current?.(isOpen);
        prevIsOpenRef.current = isOpen;
    }, [isOpen]);
    const toggle = useCallback(() => {
        setIsOpenState((prev) => !prev);
    }, []);
    const open = useCallback(() => {
        setIsOpenState(true);
    }, []);
    const close = useCallback(() => {
        setIsOpenState(false);
    }, []);
    const setOpen = useCallback((value) => {
        setIsOpenState(value);
    }, []);
    // Use the existing keyboard shortcuts hook for consistent behavior
    useKeyboardShortcuts([
        {
            key: shortcut,
            callback: toggle,
            description: 'Toggle command palette',
            enabled: shortcutEnabled,
            preventDefault: true,
            enableInInput,
        },
    ]);
    // Use the existing shortcut display hook for consistent formatting
    const getShortcutDisplay = useShortcutDisplay();
    const shortcutDisplay = getShortcutDisplay(shortcut);
    return {
        isOpen,
        open,
        close,
        toggle,
        setOpen,
        shortcutDisplay,
    };
}
//# sourceMappingURL=use-command-palette.js.map