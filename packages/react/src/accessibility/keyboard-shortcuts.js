import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Keyboard Shortcuts System
 *
 * Customizable keyboard shortcuts with help modal
 */
import * as React from 'react';
const KeyboardShortcutsContext = React.createContext(undefined);
/**
 * Keyboard Shortcuts Provider
 *
 * Manages global keyboard shortcuts
 */
export function KeyboardShortcutsProvider({ children, shortcuts: initialShortcuts = [], }) {
    const [shortcuts, setShortcuts] = React.useState(initialShortcuts);
    const [showHelpModal, setShowHelpModal] = React.useState(false);
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            const key = getKeyString(e);
            // Check if ? is pressed to show help
            if (e.shiftKey && e.key === '?') {
                e.preventDefault();
                setShowHelpModal(true);
                return;
            }
            // Find matching shortcut
            const shortcut = shortcuts.find(s => s.enabled !== false && s.keys.includes(key));
            if (shortcut) {
                e.preventDefault();
                shortcut.handler(e);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcuts]);
    const registerShortcut = React.useCallback((shortcut) => {
        setShortcuts(prev => [...prev.filter(s => s.id !== shortcut.id), shortcut]);
        return () => {
            setShortcuts(prev => prev.filter(s => s.id !== shortcut.id));
        };
    }, []);
    const unregisterShortcut = React.useCallback((id) => {
        setShortcuts(prev => prev.filter(s => s.id !== id));
    }, []);
    const showHelp = React.useCallback(() => setShowHelpModal(true), []);
    const hideHelp = React.useCallback(() => setShowHelpModal(false), []);
    const value = React.useMemo(() => ({
        shortcuts,
        registerShortcut,
        unregisterShortcut,
        showHelp,
        hideHelp,
    }), [shortcuts, registerShortcut, unregisterShortcut, showHelp, hideHelp]);
    return (_jsxs(KeyboardShortcutsContext.Provider, { value: value, children: [children, showHelpModal && _jsx(KeyboardShortcutsHelp, { onClose: hideHelp, shortcuts: shortcuts })] }));
}
/**
 * Hook to use keyboard shortcuts
 */
export function useKeyboardShortcuts() {
    const context = React.useContext(KeyboardShortcutsContext);
    if (!context) {
        throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
    }
    return context;
}
/**
 * Hook to register a keyboard shortcut
 */
export function useKeyboardShortcut(keys, handler, options) {
    const { registerShortcut } = useKeyboardShortcuts();
    React.useEffect(() => {
        const shortcut = {
            id: options?.id || `shortcut-${Math.random().toString(36).substring(7)}`,
            keys: Array.isArray(keys) ? keys : [keys],
            description: options?.description || '',
            category: options?.category,
            handler,
            enabled: options?.enabled !== false,
        };
        return registerShortcut(shortcut);
    }, [keys, handler, registerShortcut, options?.id, options?.description, options?.category, options?.enabled]);
}
/**
 * Get key string from KeyboardEvent
 */
function getKeyString(e) {
    const parts = [];
    if (e.ctrlKey || e.metaKey)
        parts.push('Ctrl');
    if (e.altKey)
        parts.push('Alt');
    if (e.shiftKey)
        parts.push('Shift');
    parts.push(e.key);
    return parts.join('+');
}
/**
 * Format key string for display
 */
function formatKeyString(key) {
    return key
        .replace('Ctrl', window.navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
        .replace('Alt', window.navigator.platform.includes('Mac') ? '⌥' : 'Alt')
        .replace('Shift', '⇧')
        .replace('Enter', '↵')
        .replace('Escape', 'Esc');
}
function KeyboardShortcutsHelp({ shortcuts, onClose }) {
    // Group shortcuts by category
    const groupedShortcuts = React.useMemo(() => {
        const groups = {};
        shortcuts.forEach(shortcut => {
            const category = shortcut.category || 'General';
            if (!groups[category])
                groups[category] = [];
            groups[category].push(shortcut);
        });
        return groups;
    }, [shortcuts]);
    // Close on Escape
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/50 z-50", onClick: onClose, "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": "shortcuts-title", children: _jsxs("div", { className: "bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [_jsx("h2", { id: "shortcuts-title", className: "text-2xl font-bold", children: "Keyboard Shortcuts" }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-accent rounded-md", "aria-label": "Close", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-6 overflow-y-auto max-h-[calc(80vh-120px)]", children: Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (_jsxs("div", { className: "mb-6 last:mb-0", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: category }), _jsx("div", { className: "space-y-2", children: categoryShortcuts.map(shortcut => (_jsxs("div", { className: "flex items-center justify-between p-2 hover:bg-accent rounded", children: [_jsx("span", { className: "text-sm", children: shortcut.description }), _jsx("div", { className: "flex gap-1", children: shortcut.keys.map((key, index) => (_jsx("kbd", { className: "px-2 py-1 text-xs font-mono bg-muted border border-border rounded", children: formatKeyString(key) }, index))) })] }, shortcut.id))) })] }, category))) }), _jsxs("div", { className: "p-4 border-t border-border bg-muted/50 text-sm text-muted-foreground", children: ["Press ", _jsx("kbd", { className: "px-2 py-1 bg-background border border-border rounded", children: "?" }), " to show this help, ", _jsx("kbd", { className: "px-2 py-1 bg-background border border-border rounded", children: "Esc" }), " to close"] })] }) })] }));
}
/**
 * Default keyboard shortcuts
 */
export const defaultShortcuts = [
    {
        id: 'send-message',
        keys: ['Ctrl+Enter', 'Cmd+Enter'],
        description: 'Send message',
        category: 'Chat',
    },
    {
        id: 'new-chat',
        keys: ['Ctrl+n', 'Cmd+n'],
        description: 'New chat',
        category: 'Chat',
    },
    {
        id: 'search',
        keys: ['/'],
        description: 'Focus search',
        category: 'Navigation',
    },
    {
        id: 'command-palette',
        keys: ['Ctrl+k', 'Cmd+k'],
        description: 'Open command palette',
        category: 'Navigation',
    },
    {
        id: 'settings',
        keys: ['Ctrl+,', 'Cmd+,'],
        description: 'Open settings',
        category: 'Navigation',
    },
    {
        id: 'close',
        keys: ['Escape'],
        description: 'Close modal/dialog',
        category: 'General',
    },
    {
        id: 'help',
        keys: ['?'],
        description: 'Show keyboard shortcuts',
        category: 'General',
    },
];
//# sourceMappingURL=keyboard-shortcuts.js.map