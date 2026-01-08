'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../lib/cn';
/**
 * Key mapping for platform-specific display.
 * Mac uses symbols, Windows/Linux uses text.
 */
const KEY_MAP = {
    mod: { mac: '⌘', other: 'Ctrl' },
    cmd: { mac: '⌘', other: 'Ctrl' },
    command: { mac: '⌘', other: 'Ctrl' },
    ctrl: { mac: '⌃', other: 'Ctrl' },
    control: { mac: '⌃', other: 'Ctrl' },
    alt: { mac: '⌥', other: 'Alt' },
    option: { mac: '⌥', other: 'Alt' },
    shift: { mac: '⇧', other: 'Shift' },
    enter: { mac: '↵', other: 'Enter' },
    return: { mac: '↵', other: 'Enter' },
    backspace: { mac: '⌫', other: 'Backspace' },
    delete: { mac: '⌫', other: 'Delete' },
    escape: { mac: 'Esc', other: 'Esc' },
    esc: { mac: 'Esc', other: 'Esc' },
    tab: { mac: '⇥', other: 'Tab' },
    space: { mac: '␣', other: 'Space' },
    up: { mac: '↑', other: '↑' },
    down: { mac: '↓', other: '↓' },
    left: { mac: '←', other: '←' },
    right: { mac: '→', other: '→' },
    pageup: { mac: '⇞', other: 'PgUp' },
    pagedown: { mac: '⇟', other: 'PgDn' },
    home: { mac: '↖', other: 'Home' },
    end: { mac: '↘', other: 'End' },
};
/**
 * Detects the current platform.
 */
function detectPlatform() {
    if (typeof navigator === 'undefined')
        return 'other';
    const platform = navigator.platform || '';
    const userAgent = navigator.userAgent || '';
    return /Mac|iPod|iPhone|iPad/.test(platform) ||
        /Mac|iPod|iPhone|iPad/.test(userAgent)
        ? 'mac'
        : 'other';
}
/**
 * Formats a single key for display based on platform.
 */
function formatKey(key, platform) {
    const lower = key.toLowerCase().trim();
    // Check if it's a known special key
    if (KEY_MAP[lower]) {
        return KEY_MAP[lower][platform];
    }
    // Single letters should be uppercase
    if (key.length === 1) {
        return key.toUpperCase();
    }
    // Other keys (like F1, F2, etc.) - capitalize first letter
    return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
}
const sizeClasses = {
    sm: 'px-1 py-0.5 text-[10px] min-h-[18px]',
    md: 'px-1.5 py-0.5 text-xs min-h-[22px]',
    lg: 'px-2 py-1 text-sm min-h-[26px]',
};
const variantClasses = {
    default: 'bg-muted border border-border/60 shadow-xs',
    outline: 'border border-border/80 bg-transparent',
    ghost: 'bg-transparent',
};
/**
 * A styled keyboard shortcut indicator that displays platform-appropriate
 * key symbols (⌘ on Mac, Ctrl on Windows/Linux).
 *
 * @example
 * ```tsx
 * // Basic usage - auto-detects platform
 * <Kbd shortcut="mod+k" />
 *
 * // Multiple modifiers
 * <Kbd shortcut="mod+shift+p" />
 *
 * // Array syntax for complex shortcuts
 * <Kbd shortcut={['mod', 'alt', 'enter']} />
 *
 * // Force platform for docs
 * <Kbd shortcut="mod+k" platform="mac" />
 * ```
 *
 * @example
 * ```tsx
 * // In a menu item
 * <MenuItem>
 *   Settings
 *   <Kbd shortcut="mod+," className="ml-auto" />
 * </MenuItem>
 * ```
 */
export const Kbd = React.forwardRef(({ shortcut, platform = 'auto', size = 'md', variant = 'default', separator = 'auto', className, ...props }, ref) => {
    // Determine the actual platform for display
    const [detectedPlatform, setDetectedPlatform] = React.useState('other');
    React.useEffect(() => {
        if (platform === 'auto') {
            setDetectedPlatform(detectPlatform());
        }
        else {
            setDetectedPlatform(platform === 'mac' ? 'mac' : 'other');
        }
    }, [platform]);
    // Parse shortcut into individual keys
    const keys = React.useMemo(() => {
        if (Array.isArray(shortcut)) {
            return shortcut;
        }
        // Split by + but handle edge case of ++ (the plus key)
        return shortcut.split(/\+(?![+])/).map((k) => (k === '' ? '+' : k));
    }, [shortcut]);
    // Format all keys
    const formattedKeys = React.useMemo(() => {
        return keys.map((key) => formatKey(key, detectedPlatform));
    }, [keys, detectedPlatform]);
    // Determine separator
    const actualSeparator = React.useMemo(() => {
        if (separator === 'none')
            return '';
        if (separator === 'auto') {
            // Mac traditionally uses no separator, Windows uses +
            return detectedPlatform === 'mac' ? '' : '+';
        }
        return separator;
    }, [separator, detectedPlatform]);
    return (_jsx("kbd", { ref: ref, className: cn('inline-flex items-center justify-center gap-0.5 rounded font-mono', 'text-muted-foreground select-none', sizeClasses[size], variantClasses[variant], className), ...props, children: formattedKeys.map((key, index) => (_jsxs(React.Fragment, { children: [index > 0 && actualSeparator && (_jsx("span", { className: "text-muted-foreground/60", children: actualSeparator })), _jsx("span", { className: "min-w-[1ch] text-center", children: key })] }, index))) }));
});
Kbd.displayName = 'Kbd';
/**
 * Hook to format a shortcut string for display based on current platform.
 * Useful when you need the formatted string outside of a component.
 *
 * @example
 * ```tsx
 * const formatted = useFormattedShortcut('mod+k')
 * // Returns '⌘K' on Mac or 'Ctrl+K' on Windows
 * ```
 */
export function useFormattedShortcut(shortcut, options) {
    const [formatted, setFormatted] = React.useState('');
    React.useEffect(() => {
        const platform = options?.platform === 'auto' || !options?.platform
            ? detectPlatform()
            : options.platform === 'mac'
                ? 'mac'
                : 'other';
        const keys = Array.isArray(shortcut)
            ? shortcut
            : shortcut.split(/\+(?![+])/).map((k) => (k === '' ? '+' : k));
        const formattedKeys = keys.map((key) => formatKey(key, platform));
        let separator = options?.separator ?? 'auto';
        if (separator === 'none') {
            separator = '';
        }
        else if (separator === 'auto') {
            separator = platform === 'mac' ? '' : '+';
        }
        setFormatted(formattedKeys.join(separator));
    }, [shortcut, options?.platform, options?.separator]);
    return formatted;
}
//# sourceMappingURL=kbd.js.map