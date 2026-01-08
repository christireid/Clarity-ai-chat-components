'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Keyboard Shortcuts Guide Component
 *
 * A reusable keyboard shortcuts guide for chat applications.
 * Shows available shortcuts in a dialog or inline panel.
 */
import { useState, useEffect, useCallback } from 'react';
export function useKeyboardShortcuts({ shortcuts, enabled = true, }) {
    useEffect(() => {
        if (!enabled)
            return;
        const handleKeyDown = (event) => {
            for (const shortcut of shortcuts) {
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatch = shortcut.modifiers?.includes('ctrl')
                    ? event.ctrlKey || event.metaKey
                    : !event.ctrlKey && !event.metaKey;
                const altMatch = shortcut.modifiers?.includes('alt')
                    ? event.altKey
                    : !event.altKey;
                const shiftMatch = shortcut.modifiers?.includes('shift')
                    ? event.shiftKey
                    : !event.shiftKey;
                if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
                    event.preventDefault();
                    shortcut.action?.();
                    return;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
}
// ============================================================================
// Key Display Component
// ============================================================================
function KeyBadge({ children }) {
    return (_jsx("kbd", { className: "inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 text-xs font-mono font-medium bg-muted border border-border rounded shadow-sm", children: children }));
}
function formatModifier(modifier) {
    // Use symbols on Mac, text on other platforms
    const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
    const symbols = {
        ctrl: isMac ? '⌃' : 'Ctrl',
        alt: isMac ? '⌥' : 'Alt',
        shift: isMac ? '⇧' : 'Shift',
        meta: isMac ? '⌘' : 'Win',
    };
    return symbols[modifier] || modifier;
}
function formatKey(key) {
    const specialKeys = {
        enter: '↵',
        escape: 'Esc',
        arrowup: '↑',
        arrowdown: '↓',
        arrowleft: '←',
        arrowright: '→',
        backspace: '⌫',
        delete: 'Del',
        tab: '⇥',
        space: '␣',
        home: 'Home',
        end: 'End',
        pageup: 'PgUp',
        pagedown: 'PgDn',
    };
    return specialKeys[key.toLowerCase()] || key.toUpperCase();
}
export function ShortcutKeys({ shortcut }) {
    return (_jsxs("div", { className: "flex items-center gap-1", children: [shortcut.modifiers?.map((mod) => (_jsx(KeyBadge, { children: formatModifier(mod) }, mod))), _jsx(KeyBadge, { children: formatKey(shortcut.key) })] }));
}
export function ShortcutsList({ shortcuts, className = '', }) {
    return (_jsx("div", { className: `space-y-2 ${className}`, children: shortcuts.map((shortcut, index) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border last:border-0", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: shortcut.description }), _jsx(ShortcutKeys, { shortcut: shortcut })] }, index))) }));
}
export function ShortcutsDialog({ shortcuts, isOpen, onClose, title = 'Keyboard Shortcuts', }) {
    // Close on Escape
    useEffect(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/50", onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { className: "relative bg-background border rounded-lg shadow-xl max-w-md w-full mx-4 p-6", role: "dialog", "aria-modal": "true", "aria-labelledby": "shortcuts-title", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { id: "shortcuts-title", className: "text-lg font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "p-1 rounded hover:bg-muted transition-colors", "aria-label": "Close", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx(ShortcutsList, { shortcuts: shortcuts }), _jsxs("p", { className: "text-xs text-muted-foreground mt-4 text-center", children: ["Press ", _jsx(KeyBadge, { children: "Esc" }), " to close"] })] })] }));
}
// ============================================================================
// Main Component
// ============================================================================
export function KeyboardShortcutsGuide({ shortcuts, className = '', title = 'Keyboard Shortcuts', triggerKey = '?', showTriggerHint = true, children, }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);
    // Register trigger shortcut
    useKeyboardShortcuts({
        shortcuts: [
            {
                key: triggerKey,
                modifiers: [],
                description: 'Show keyboard shortcuts',
                action: handleOpen,
            },
        ],
        enabled: !isOpen,
    });
    return (_jsxs(_Fragment, { children: [children ? (_jsx("div", { onClick: handleOpen, children: children })) : (_jsxs("button", { onClick: handleOpen, className: `
            inline-flex items-center gap-2 px-3 py-2
            text-sm text-muted-foreground
            hover:text-foreground hover:bg-muted
            rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            ${className}
          `, "aria-label": "Show keyboard shortcuts", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }), "Shortcuts", showTriggerHint && _jsx(KeyBadge, { children: triggerKey })] })), _jsx(ShortcutsDialog, { shortcuts: shortcuts, isOpen: isOpen, onClose: handleClose, title: title })] }));
}
// ============================================================================
// Default Chat Shortcuts
// ============================================================================
export const DEFAULT_CHAT_SHORTCUTS = [
    {
        key: 'Enter',
        description: 'Send message',
    },
    {
        key: 'Enter',
        modifiers: ['shift'],
        description: 'New line',
    },
    {
        key: 'k',
        modifiers: ['ctrl'],
        description: 'Clear chat',
    },
    {
        key: '/',
        description: 'Focus input',
    },
    {
        key: 'Escape',
        description: 'Cancel current action',
    },
    {
        key: 'ArrowUp',
        description: 'Navigate to previous message',
    },
    {
        key: 'ArrowDown',
        description: 'Navigate to next message',
    },
    {
        key: 'Home',
        description: 'Jump to first message',
    },
    {
        key: 'End',
        description: 'Jump to last message',
    },
];
export default KeyboardShortcutsGuide;
//# sourceMappingURL=KeyboardShortcutsGuide.js.map