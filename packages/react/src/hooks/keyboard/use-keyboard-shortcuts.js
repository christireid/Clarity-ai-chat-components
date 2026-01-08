'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
// ============================================================================
// SSR-safe Platform Detection
// ============================================================================
/**
 * Detect if the user is on a Mac/iOS device (SSR-safe)
 */
function detectIsMac() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    // Modern API (Chrome 90+, Edge 90+)
    const userAgentData = navigator.userAgentData;
    if (userAgentData?.platform) {
        return /macOS|iOS/i.test(userAgentData.platform);
    }
    // Fallback to userAgent
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
// Cache the result
let cachedIsMac = null;
function getIsMac() {
    if (cachedIsMac === null) {
        cachedIsMac = detectIsMac();
    }
    return cachedIsMac;
}
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
export function useKeyboardShortcuts(shortcuts) {
    // Store shortcuts in ref to avoid re-creating listeners on every array reference change
    const shortcutsRef = React.useRef(shortcuts);
    // Update ref when shortcuts change (using deep comparison would be ideal, but ref update is sufficient)
    React.useLayoutEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if we're in an input element
            const target = event.target;
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
            const isContentEditable = target.isContentEditable;
            // Use current shortcuts from ref
            for (const shortcut of shortcutsRef.current) {
                const { key, callback, enabled = true, preventDefault = true, enableInInput = false, } = shortcut;
                if (!enabled)
                    continue;
                if ((isInput || isContentEditable) && !enableInInput)
                    continue;
                if (matchesShortcut(event, key)) {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                    callback(event);
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // Empty deps - shortcuts accessed via ref
}
/**
 * Check if keyboard event matches shortcut pattern
 */
function matchesShortcut(event, pattern) {
    const parts = pattern.toLowerCase().split('+');
    const key = parts.pop();
    // Check modifiers
    const requiresMod = parts.includes('mod');
    const requiresCtrl = parts.includes('ctrl');
    const requiresAlt = parts.includes('alt');
    const requiresShift = parts.includes('shift');
    const requiresMeta = parts.includes('meta');
    // 'mod' is Cmd on Mac, Ctrl on Windows/Linux
    const modKey = getIsMac() ? event.metaKey : event.ctrlKey;
    const modifierMatch = (!requiresMod || modKey) &&
        (!requiresCtrl || event.ctrlKey) &&
        (!requiresAlt || event.altKey) &&
        (!requiresShift || event.shiftKey) &&
        (!requiresMeta || event.metaKey);
    if (!modifierMatch)
        return false;
    // Check key
    const eventKey = event.key.toLowerCase();
    return eventKey === key || event.code.toLowerCase() === key.toLowerCase();
}
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
export function useShortcutDisplay() {
    // Use state to handle SSR hydration correctly
    const [isMac, setIsMac] = React.useState(false);
    React.useEffect(() => {
        setIsMac(detectIsMac());
    }, []);
    return React.useCallback((pattern) => {
        const parts = pattern.split('+').map((p) => {
            switch (p.toLowerCase()) {
                case 'mod':
                    return isMac ? '⌘' : 'Ctrl';
                case 'ctrl':
                    return isMac ? '⌃' : 'Ctrl';
                case 'alt':
                    return isMac ? '⌥' : 'Alt';
                case 'shift':
                    return isMac ? '⇧' : 'Shift';
                case 'meta':
                    return isMac ? '⌘' : 'Win';
                case 'enter':
                    return '↵';
                case 'escape':
                    return 'Esc';
                case 'backspace':
                    return '⌫';
                case 'delete':
                    return 'Del';
                case 'arrowup':
                    return '↑';
                case 'arrowdown':
                    return '↓';
                case 'arrowleft':
                    return '←';
                case 'arrowright':
                    return '→';
                default:
                    return p.charAt(0).toUpperCase() + p.slice(1);
            }
        });
        return parts.join(isMac ? '' : '+');
    }, [isMac]);
}
/**
 * Overlay component to display keyboard shortcuts help.
 *
 * Closes on Escape key or backdrop click.
 *
 * @example
 * ```tsx
 * const [showHelp, setShowHelp] = useState(false)
 *
 * const shortcuts = [
 *   { key: 'j', callback: nextItem, description: 'Next item' },
 *   { key: 'k', callback: prevItem, description: 'Previous item' },
 * ]
 *
 * useKeyboardShortcuts([
 *   ...shortcuts,
 *   { key: 'shift+/', callback: () => setShowHelp(true), description: 'Show help' },
 * ])
 *
 * return (
 *   <>
 *     {showHelp && (
 *       <KeyboardShortcutsHelp
 *         shortcuts={shortcuts}
 *         onClose={() => setShowHelp(false)}
 *       />
 *     )}
 *   </>
 * )
 * ```
 */
export function KeyboardShortcutsHelp({ shortcuts, onClose, title = 'Keyboard Shortcuts', className, }) {
    const getShortcut = useShortcutDisplay();
    // Close on Escape
    React.useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);
    // Focus trap - prevent tabbing outside modal
    const modalRef = React.useRef(null);
    React.useEffect(() => {
        const modal = modalRef.current;
        if (!modal)
            return;
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        firstElement?.focus();
        const handleTab = (event) => {
            if (event.key !== 'Tab')
                return;
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            }
            else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };
        modal.addEventListener('keydown', handleTab);
        return () => modal.removeEventListener('keydown', handleTab);
    }, []);
    // Close on backdrop click
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    return (_jsx("div", { className: `fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className || ''}`, onClick: handleBackdropClick, role: "presentation", children: _jsxs("div", { ref: modalRef, role: "dialog", "aria-modal": "true", "aria-labelledby": "keyboard-shortcuts-title", className: "bg-card border border-border rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [_jsx("h2", { id: "keyboard-shortcuts-title", className: "text-lg font-semibold text-foreground", children: title }), _jsx("button", { type: "button", onClick: onClose, className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50", "aria-label": "Close keyboard shortcuts help", children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("div", { className: "p-4 space-y-1", children: shortcuts
                        .filter((s) => s.description)
                        .map((shortcut, index) => (_jsxs("div", { className: "flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50", children: [_jsx("span", { className: "text-sm text-foreground", children: shortcut.description }), _jsx("kbd", { className: "px-2 py-1 text-xs font-mono bg-muted border border-border rounded min-w-[2rem] text-center", children: getShortcut(shortcut.key) })] }, index))) }), _jsx("div", { className: "p-4 border-t border-border", children: _jsxs("p", { className: "text-xs text-muted-foreground text-center", children: ["Press", ' ', _jsx("kbd", { className: "px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded", children: "Esc" }), ' ', "to close"] }) })] }) }));
}
KeyboardShortcutsHelp.displayName = 'KeyboardShortcutsHelp';
// Global registry for managing shortcut priorities
const scopeRegistry = new Map();
let globalListenerAttached = false;
function attachGlobalShortcutListener() {
    if (globalListenerAttached)
        return;
    const handleKeyDown = (event) => {
        // Check if we're in an input element
        const target = event.target;
        const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
        const isContentEditable = target.isContentEditable;
        // Sort scopes by priority (highest first)
        const sortedScopes = Array.from(scopeRegistry.entries())
            .filter(([, scope]) => scope.enabled)
            .sort(([, a], [, b]) => b.priority - a.priority);
        // Try to handle the shortcut with the highest priority scope first
        for (const [, scope] of sortedScopes) {
            for (const shortcut of scope.shortcuts) {
                const { key, callback, enabled = true, preventDefault = true, enableInInput = false, } = shortcut;
                if (!enabled)
                    continue;
                if ((isInput || isContentEditable) && !enableInInput)
                    continue;
                if (matchesShortcut(event, key)) {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                    callback(event);
                    return; // Stop propagation to lower priority scopes
                }
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    globalListenerAttached = true;
}
/**
 * Scoped keyboard shortcuts with priority-based conflict resolution.
 *
 * Use this when multiple components may have conflicting shortcuts.
 * Higher priority scopes handle shortcuts first.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   // This scope has higher priority, so its '?' shortcut wins
 *   useScopedKeyboardShortcuts({
 *     shortcuts: [
 *       { key: '?', callback: showHelp, description: 'Show dashboard help' },
 *     ],
 *     priority: 10,
 *   })
 *
 *   return <DashboardContent />
 * }
 *
 * function AppShell() {
 *   // Lower priority - only handles '?' if no higher priority component does
 *   useScopedKeyboardShortcuts({
 *     shortcuts: [
 *       { key: '?', callback: showGlobalHelp, description: 'Show global help' },
 *     ],
 *     priority: 0,
 *   })
 *
 *   return <Dashboard />
 * }
 * ```
 */
export function useScopedKeyboardShortcuts(options) {
    const { shortcuts, enabled = true, priority = 0 } = options;
    const scopeIdRef = React.useRef(null);
    // Create scope ID once
    React.useEffect(() => {
        scopeIdRef.current = Symbol('keyboard-scope');
        attachGlobalShortcutListener();
        return () => {
            if (scopeIdRef.current) {
                scopeRegistry.delete(scopeIdRef.current);
            }
        };
    }, []);
    // Update registry when shortcuts/enabled/priority change
    React.useEffect(() => {
        if (scopeIdRef.current) {
            scopeRegistry.set(scopeIdRef.current, {
                shortcuts,
                priority,
                enabled,
            });
        }
    }, [shortcuts, priority, enabled]);
}
/**
 * Keyboard shortcuts that only fire when a specific element contains focus.
 *
 * Use this for component-local shortcuts that shouldn't interfere with
 * other components on the page.
 *
 * @example
 * ```tsx
 * function ABTestingDashboard() {
 *   const containerRef = useRef<HTMLDivElement>(null)
 *
 *   useFocusedKeyboardShortcuts(containerRef, [
 *     { key: 'r', callback: refresh, description: 'Refresh data' },
 *     { key: 'e', callback: exportData, description: 'Export data' },
 *   ])
 *
 *   return (
 *     <div ref={containerRef} tabIndex={-1}>
 *       <DashboardContent />
 *     </div>
 *   )
 * }
 * ```
 */
export function useFocusedKeyboardShortcuts(containerRef, shortcuts) {
    const shortcutsRef = React.useRef(shortcuts);
    React.useLayoutEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Only handle if container contains the active element
            const container = containerRef.current;
            if (!container)
                return;
            const activeElement = document.activeElement;
            if (!container.contains(activeElement) && container !== activeElement) {
                return;
            }
            // Check if we're in an input element
            const target = event.target;
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
            const isContentEditable = target.isContentEditable;
            for (const shortcut of shortcutsRef.current) {
                const { key, callback, enabled = true, preventDefault = true, enableInInput = false, } = shortcut;
                if (!enabled)
                    continue;
                if ((isInput || isContentEditable) && !enableInInput)
                    continue;
                if (matchesShortcut(event, key)) {
                    if (preventDefault) {
                        event.preventDefault();
                    }
                    callback(event);
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [containerRef]);
}
//# sourceMappingURL=use-keyboard-shortcuts.js.map