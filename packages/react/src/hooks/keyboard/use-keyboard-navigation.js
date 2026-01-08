'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced Keyboard Navigation System
 *
 * Best-in-class keyboard navigation with:
 * - Global shortcut registry with conflict detection
 * - Keyboard shortcut sequences (vim-style g+i chaining)
 * - Vim-style j/k navigation for lists
 * - Focus management with visual feedback
 * - Skip links and landmarks
 * - Keyboard discoverability hints
 */
import * as React from 'react';
// ============================================================================
// Platform Detection (SSR-safe)
// ============================================================================
/**
 * Detect if the user is on a Mac/iOS device
 * Uses userAgentData when available (modern API), falls back to userAgent
 * Returns false during SSR for safe hydration
 */
function detectMacPlatform() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false; // SSR fallback
    }
    // Modern API (Chrome 90+, Edge 90+)
    const userAgentData = navigator.userAgentData;
    if (userAgentData?.platform) {
        return /macOS|iOS/i.test(userAgentData.platform);
    }
    // Fallback to userAgent (more reliable than deprecated navigator.platform)
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
// Memoize the result after first client-side check
let cachedIsMac = null;
function getIsMac() {
    if (cachedIsMac === null) {
        cachedIsMac = detectMacPlatform();
    }
    return cachedIsMac;
}
/**
 * Hook for SSR-safe platform detection
 * Returns stable value after hydration
 */
export function useIsMac() {
    const [isMac, setIsMac] = React.useState(false);
    React.useEffect(() => {
        setIsMac(detectMacPlatform());
    }, []);
    return isMac;
}
// ============================================================================
// Key Parsing and Matching
// ============================================================================
/**
 * Parse a key string into normalized parts
 */
function parseKeyString(keyString) {
    const parts = keyString.toLowerCase().split('+');
    const key = parts.pop() || '';
    const modifiers = new Set(parts);
    // Normalize 'mod' to platform-specific key
    if (modifiers.has('mod')) {
        modifiers.delete('mod');
        modifiers.add(getIsMac() ? 'meta' : 'ctrl');
    }
    return { modifiers, key };
}
/**
 * Check if a keyboard event matches a key pattern
 */
function matchesKeyPattern(event, pattern) {
    const { modifiers, key } = parseKeyString(pattern);
    // Check modifiers
    if (modifiers.has('ctrl') !== event.ctrlKey)
        return false;
    if (modifiers.has('alt') !== event.altKey)
        return false;
    if (modifiers.has('shift') !== event.shiftKey)
        return false;
    if (modifiers.has('meta') !== event.metaKey)
        return false;
    // Check key - handle special cases
    const eventKey = event.key.toLowerCase();
    const eventCode = event.code.toLowerCase();
    // Handle special keys
    const specialKeys = {
        space: [' ', 'space'],
        enter: ['enter', 'return'],
        escape: ['escape', 'esc'],
        tab: ['tab'],
        backspace: ['backspace'],
        delete: ['delete'],
        arrowup: ['arrowup', 'up'],
        arrowdown: ['arrowdown', 'down'],
        arrowleft: ['arrowleft', 'left'],
        arrowright: ['arrowright', 'right'],
        home: ['home'],
        end: ['end'],
        pageup: ['pageup'],
        pagedown: ['pagedown'],
    };
    // Check if key matches
    if (specialKeys[key]) {
        return specialKeys[key].includes(eventKey);
    }
    return (eventKey === key ||
        eventCode === `key${key}` ||
        eventCode === `digit${key}` ||
        // Handle symbols on number keys
        event.key === key);
}
/**
 * Check if event target is an input element
 */
function isInputElement(target) {
    if (!target || !(target instanceof HTMLElement))
        return false;
    const tagName = target.tagName.toUpperCase();
    return (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) ||
        target.isContentEditable);
}
// ============================================================================
// Shortcut Display Formatting
// ============================================================================
/**
 * Format a key pattern for display
 */
export function formatShortcutDisplay(pattern, platform) {
    const effectivePlatform = platform ?? (getIsMac() ? 'mac' : 'windows');
    const symbols = {
        mod: { mac: '⌘', windows: 'Ctrl' },
        ctrl: { mac: '⌃', windows: 'Ctrl' },
        alt: { mac: '⌥', windows: 'Alt' },
        shift: { mac: '⇧', windows: 'Shift' },
        meta: { mac: '⌘', windows: 'Win' },
        enter: { mac: '↵', windows: '↵' },
        return: { mac: '↵', windows: '↵' },
        escape: { mac: 'Esc', windows: 'Esc' },
        esc: { mac: 'Esc', windows: 'Esc' },
        backspace: { mac: '⌫', windows: '⌫' },
        delete: { mac: '⌦', windows: 'Del' },
        tab: { mac: '⇥', windows: 'Tab' },
        space: { mac: '␣', windows: 'Space' },
        arrowup: { mac: '↑', windows: '↑' },
        arrowdown: { mac: '↓', windows: '↓' },
        arrowleft: { mac: '←', windows: '←' },
        arrowright: { mac: '→', windows: '→' },
        up: { mac: '↑', windows: '↑' },
        down: { mac: '↓', windows: '↓' },
        left: { mac: '←', windows: '←' },
        right: { mac: '→', windows: '→' },
        home: { mac: '↖', windows: 'Home' },
        end: { mac: '↘', windows: 'End' },
        pageup: { mac: '⇞', windows: 'PgUp' },
        pagedown: { mac: '⇟', windows: 'PgDn' },
    };
    // Handle sequence patterns (e.g., 'g i')
    if (pattern.includes(' ')) {
        return pattern
            .split(' ')
            .map((p) => formatShortcutDisplay(p, effectivePlatform))
            .join(' ');
    }
    const parts = pattern.split('+');
    const formatted = parts.map((part) => {
        const lower = part.toLowerCase();
        if (symbols[lower]) {
            return symbols[lower][effectivePlatform];
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
    });
    return effectivePlatform === 'mac' ? formatted.join('') : formatted.join('+');
}
// ============================================================================
// Reducer
// ============================================================================
function detectConflicts(shortcuts) {
    const keyMap = new Map();
    shortcuts.forEach((shortcut) => {
        const keys = Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys];
        keys.forEach((key) => {
            const normalized = key.toLowerCase();
            const existing = keyMap.get(normalized) || [];
            // Only count as conflict if both are enabled and in same/no scope
            const conflicting = existing.filter((s) => s.enabled !== false &&
                shortcut.enabled !== false &&
                (s.scope === shortcut.scope || !s.scope || !shortcut.scope));
            if (conflicting.length > 0) {
                keyMap.set(normalized, [...conflicting, shortcut]);
            }
            else {
                keyMap.set(normalized, [shortcut]);
            }
        });
    });
    const conflicts = [];
    keyMap.forEach((shortcuts, key) => {
        if (shortcuts.length > 1) {
            conflicts.push({ key, shortcuts });
        }
    });
    return conflicts;
}
function keyboardNavigationReducer(state, action) {
    switch (action.type) {
        case 'REGISTER_SHORTCUT': {
            const newShortcuts = new Map(state.shortcuts);
            newShortcuts.set(action.shortcut.id, action.shortcut);
            return {
                ...state,
                shortcuts: newShortcuts,
                conflicts: detectConflicts(newShortcuts),
            };
        }
        case 'UNREGISTER_SHORTCUT': {
            const newShortcuts = new Map(state.shortcuts);
            newShortcuts.delete(action.id);
            return {
                ...state,
                shortcuts: newShortcuts,
                conflicts: detectConflicts(newShortcuts),
            };
        }
        case 'SET_SCOPE':
            return { ...state, activeScope: action.scope };
        case 'APPEND_SEQUENCE':
            return {
                ...state,
                sequenceBuffer: [...state.sequenceBuffer, action.key],
            };
        case 'CLEAR_SEQUENCE':
            return { ...state, sequenceBuffer: [] };
        case 'SET_KEYBOARD_NAVIGATING':
            return { ...state, isKeyboardNavigating: action.isNavigating };
        case 'SET_FOCUSED_INDEX':
            return { ...state, focusedIndex: action.index };
        case 'TOGGLE_HINTS':
            return { ...state, showHints: !state.showHints };
        case 'SET_HINTS':
            return { ...state, showHints: action.show };
        default:
            return state;
    }
}
const KeyboardNavigationContext = React.createContext(undefined);
export function KeyboardNavigationProvider({ children, defaultShortcuts = [], sequenceTimeout = 1000, warnOnConflicts = process.env.NODE_ENV === 'development', }) {
    const [state, dispatch] = React.useReducer(keyboardNavigationReducer, {
        shortcuts: new Map(defaultShortcuts.map((s) => [s.id, s])),
        conflicts: [],
        sequenceBuffer: [],
        activeScope: null,
        isKeyboardNavigating: false,
        focusedIndex: -1,
        showHints: false,
    });
    // Screen reader live region ref
    const liveRegionRef = React.useRef(null);
    const sequenceTimeoutRef = React.useRef(null);
    const announceTimeoutRef = React.useRef(null);
    // Warn about conflicts in development
    React.useEffect(() => {
        if (warnOnConflicts && state.conflicts.length > 0) {
            console.warn('[KeyboardNavigation] Shortcut conflicts detected:', state.conflicts.map((c) => ({
                key: c.key,
                shortcuts: c.shortcuts.map((s) => s.id),
            })));
        }
    }, [state.conflicts, warnOnConflicts]);
    // Clear sequence buffer after timeout
    React.useEffect(() => {
        if (state.sequenceBuffer.length > 0) {
            sequenceTimeoutRef.current = setTimeout(() => {
                dispatch({ type: 'CLEAR_SEQUENCE' });
            }, sequenceTimeout);
        }
        return () => {
            if (sequenceTimeoutRef.current) {
                clearTimeout(sequenceTimeoutRef.current);
            }
        };
    }, [state.sequenceBuffer, sequenceTimeout]);
    // Track keyboard navigation mode
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                dispatch({ type: 'SET_KEYBOARD_NAVIGATING', isNavigating: true });
            }
        };
        const handleMouseDown = () => {
            dispatch({ type: 'SET_KEYBOARD_NAVIGATING', isNavigating: false });
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);
    // Global keyboard event handler
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if in input element
            const inInput = isInputElement(event.target);
            // Get current sequence including this key
            const currentKey = event.key.toLowerCase();
            const newSequence = [...state.sequenceBuffer, currentKey];
            const sequencePattern = newSequence.join(' ');
            // Sort shortcuts by priority (higher first)
            const sortedShortcuts = Array.from(state.shortcuts.values()).sort((a, b) => (b.priority || 0) - (a.priority || 0));
            // Try to match shortcuts
            for (const shortcut of sortedShortcuts) {
                if (shortcut.enabled === false)
                    continue;
                if (inInput && !shortcut.enableInInput)
                    continue;
                if (shortcut.scope && shortcut.scope !== state.activeScope)
                    continue;
                const keys = Array.isArray(shortcut.keys)
                    ? shortcut.keys
                    : [shortcut.keys];
                for (const keyPattern of keys) {
                    // Check for sequence match (e.g., 'g i')
                    if (keyPattern.includes(' ')) {
                        if (sequencePattern === keyPattern.toLowerCase()) {
                            if (shortcut.preventDefault !== false) {
                                event.preventDefault();
                            }
                            shortcut.handler(event);
                            dispatch({ type: 'CLEAR_SEQUENCE' });
                            return;
                        }
                        // Check if this could be the start of a sequence
                        if (keyPattern.toLowerCase().startsWith(sequencePattern)) {
                            // Append to sequence buffer
                            dispatch({ type: 'APPEND_SEQUENCE', key: currentKey });
                            return;
                        }
                    }
                    else {
                        // Single key match
                        if (matchesKeyPattern(event, keyPattern)) {
                            if (shortcut.preventDefault !== false) {
                                event.preventDefault();
                            }
                            shortcut.handler(event);
                            dispatch({ type: 'CLEAR_SEQUENCE' });
                            return;
                        }
                    }
                }
            }
            // If we get here and have a sequence buffer, check if this key could start a new sequence
            if (state.sequenceBuffer.length > 0) {
                // Clear the old sequence and try this key as a potential new sequence start
                dispatch({ type: 'CLEAR_SEQUENCE' });
                // Check if this single key matches any sequence start
                for (const shortcut of sortedShortcuts) {
                    if (shortcut.enabled === false)
                        continue;
                    const keys = Array.isArray(shortcut.keys)
                        ? shortcut.keys
                        : [shortcut.keys];
                    for (const keyPattern of keys) {
                        if (keyPattern.includes(' ') &&
                            keyPattern.toLowerCase().startsWith(currentKey)) {
                            dispatch({ type: 'APPEND_SEQUENCE', key: currentKey });
                            return;
                        }
                    }
                }
            }
            else {
                // Check if this key starts a sequence
                for (const shortcut of sortedShortcuts) {
                    if (shortcut.enabled === false)
                        continue;
                    if (inInput && !shortcut.enableInInput)
                        continue;
                    const keys = Array.isArray(shortcut.keys)
                        ? shortcut.keys
                        : [shortcut.keys];
                    for (const keyPattern of keys) {
                        if (keyPattern.includes(' ') &&
                            keyPattern.toLowerCase().startsWith(currentKey)) {
                            dispatch({ type: 'APPEND_SEQUENCE', key: currentKey });
                            return;
                        }
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state.shortcuts, state.sequenceBuffer, state.activeScope]);
    // Context value
    const registerShortcut = React.useCallback((config) => {
        dispatch({ type: 'REGISTER_SHORTCUT', shortcut: config });
        return () => {
            dispatch({ type: 'UNREGISTER_SHORTCUT', id: config.id });
        };
    }, []);
    const setScope = React.useCallback((scope) => {
        dispatch({ type: 'SET_SCOPE', scope });
    }, []);
    const formatShortcut = React.useCallback((pattern) => {
        return formatShortcutDisplay(pattern);
    }, []);
    const getShortcutsByCategory = React.useCallback(() => {
        const categories = new Map();
        state.shortcuts.forEach((shortcut) => {
            if (shortcut.enabled === false)
                return;
            const category = shortcut.category || 'General';
            const existing = categories.get(category) || [];
            categories.set(category, [...existing, shortcut]);
        });
        return categories;
    }, [state.shortcuts]);
    const announceToScreenReader = React.useCallback((message, assertive = false) => {
        if (liveRegionRef.current) {
            // Clear any pending timeout to prevent race conditions
            if (announceTimeoutRef.current) {
                clearTimeout(announceTimeoutRef.current);
            }
            liveRegionRef.current.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
            liveRegionRef.current.textContent = message;
            // Clear after a delay to allow re-announcement of same message
            announceTimeoutRef.current = setTimeout(() => {
                if (liveRegionRef.current) {
                    liveRegionRef.current.textContent = '';
                }
            }, 1000);
        }
    }, []);
    // Cleanup announcement timeout on unmount
    React.useEffect(() => {
        return () => {
            if (announceTimeoutRef.current) {
                clearTimeout(announceTimeoutRef.current);
            }
        };
    }, []);
    const value = React.useMemo(() => ({
        state,
        dispatch,
        registerShortcut,
        setScope,
        formatShortcut,
        getShortcutsByCategory,
        announceToScreenReader,
    }), [
        state,
        registerShortcut,
        setScope,
        formatShortcut,
        getShortcutsByCategory,
        announceToScreenReader,
    ]);
    return (_jsxs(KeyboardNavigationContext.Provider, { value: value, children: [children, _jsx("div", { ref: liveRegionRef, "aria-live": "polite", "aria-atomic": "true", className: "sr-only", style: {
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                } }), state.sequenceBuffer.length > 0 && (_jsx("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-150", role: "status", "aria-live": "polite", children: _jsxs("span", { className: "text-sm font-medium", children: [state.sequenceBuffer.join(' '), _jsx("span", { className: "animate-pulse ml-1", children: "_" })] }) }))] }));
}
// ============================================================================
// Hooks
// ============================================================================
/**
 * Access the keyboard navigation context
 */
export function useKeyboardNavigation() {
    const context = React.useContext(KeyboardNavigationContext);
    if (!context) {
        throw new Error('useKeyboardNavigation must be used within KeyboardNavigationProvider');
    }
    return context;
}
/**
 * Register a keyboard shortcut
 */
export function useKeyboardShortcut(config) {
    const { registerShortcut } = useKeyboardNavigation();
    const idRef = React.useRef(config.id || `shortcut-${Math.random().toString(36).substr(2, 9)}`);
    // Use a ref to always have the latest handler - prevents stale closures
    const handlerRef = React.useRef(config.handler);
    React.useEffect(() => {
        handlerRef.current = config.handler;
    }, [config.handler]);
    // Stable handler that always calls the latest handler ref
    const stableHandler = React.useCallback((event) => {
        handlerRef.current(event);
    }, []);
    React.useEffect(() => {
        return registerShortcut({
            ...config,
            handler: stableHandler,
            id: idRef.current,
        });
    }, [
        config.keys,
        config.enabled,
        config.scope,
        config.description,
        config.category,
        config.priority,
        config.enableInInput,
        config.preventDefault,
        stableHandler,
        registerShortcut,
    ]);
}
export function useVimNavigation({ items, onSelect, onFocus, loop = true, orientation = 'vertical', enabled = true, scope, }) {
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const { registerShortcut, setScope, announceToScreenReader } = useKeyboardNavigation();
    const itemRefs = React.useRef([]);
    // Use refs for callbacks to prevent stale closures and unnecessary re-renders
    const callbacksRef = React.useRef({ onSelect, onFocus });
    React.useEffect(() => {
        callbacksRef.current = { onSelect, onFocus };
    }, [onSelect, onFocus]);
    // Reset focusedIndex if it becomes out of bounds when items change
    React.useEffect(() => {
        if (focusedIndex >= items.length) {
            setFocusedIndex(items.length > 0 ? items.length - 1 : -1);
        }
    }, [items.length, focusedIndex]);
    // Update refs array when items change
    React.useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, items.length);
    }, [items.length]);
    const navigate = React.useCallback((direction) => {
        if (items.length === 0)
            return;
        let newIndex;
        switch (direction) {
            case 'next':
                newIndex = focusedIndex + 1;
                if (newIndex >= items.length) {
                    newIndex = loop ? 0 : items.length - 1;
                }
                break;
            case 'prev':
                newIndex = focusedIndex - 1;
                if (newIndex < 0) {
                    newIndex = loop ? items.length - 1 : 0;
                }
                break;
            case 'first':
                newIndex = 0;
                break;
            case 'last':
                newIndex = items.length - 1;
                break;
        }
        setFocusedIndex(newIndex);
        callbacksRef.current.onFocus?.(items[newIndex], newIndex);
        itemRefs.current[newIndex]?.focus();
        announceToScreenReader(`Item ${newIndex + 1} of ${items.length}`, false);
    }, [items, focusedIndex, loop, announceToScreenReader]);
    // Register vim-style shortcuts
    React.useEffect(() => {
        if (!enabled)
            return;
        const shortcuts = [
            {
                id: `vim-nav-${scope}-j`,
                keys: orientation === 'vertical' ? 'j' : 'l',
                description: 'Next item',
                category: 'Navigation',
                handler: () => navigate('next'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-k`,
                keys: orientation === 'vertical' ? 'k' : 'h',
                description: 'Previous item',
                category: 'Navigation',
                handler: () => navigate('prev'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-down`,
                keys: orientation === 'vertical' ? 'arrowdown' : 'arrowright',
                description: 'Next item',
                category: 'Navigation',
                handler: () => navigate('next'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-up`,
                keys: orientation === 'vertical' ? 'arrowup' : 'arrowleft',
                description: 'Previous item',
                category: 'Navigation',
                handler: () => navigate('prev'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-g`,
                keys: 'g g',
                description: 'Go to first item',
                category: 'Navigation',
                handler: () => navigate('first'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-G`,
                keys: 'shift+g',
                description: 'Go to last item',
                category: 'Navigation',
                handler: () => navigate('last'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-home`,
                keys: 'home',
                description: 'Go to first item',
                category: 'Navigation',
                handler: () => navigate('first'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-end`,
                keys: 'end',
                description: 'Go to last item',
                category: 'Navigation',
                handler: () => navigate('last'),
                scope,
                priority: 10,
            },
            {
                id: `vim-nav-${scope}-enter`,
                keys: 'enter',
                description: 'Select item',
                category: 'Navigation',
                handler: () => {
                    if (focusedIndex >= 0 && focusedIndex < items.length) {
                        callbacksRef.current.onSelect?.(items[focusedIndex], focusedIndex);
                    }
                },
                scope,
                priority: 10,
            },
        ];
        const unsubscribes = shortcuts.map((s) => registerShortcut(s));
        return () => unsubscribes.forEach((u) => u());
        // Note: onSelect is accessed via callbacksRef.current to prevent unnecessary re-registrations
    }, [
        enabled,
        scope,
        orientation,
        navigate,
        focusedIndex,
        items,
        registerShortcut,
    ]);
    // Set scope when this navigation is active
    React.useEffect(() => {
        if (enabled && scope) {
            setScope(scope);
            return () => setScope(null);
        }
        return undefined;
    }, [enabled, scope, setScope]);
    const getItemProps = React.useCallback((index) => ({
        ref: (el) => {
            itemRefs.current[index] = el;
        },
        tabIndex: focusedIndex === index ? 0 : -1,
        'data-focused': focusedIndex === index,
        onFocus: () => {
            setFocusedIndex(index);
            callbacksRef.current.onFocus?.(items[index], index);
        },
        onClick: () => {
            setFocusedIndex(index);
            callbacksRef.current.onSelect?.(items[index], index);
        },
    }), 
    // Note: onFocus/onSelect accessed via callbacksRef.current
    [focusedIndex, items]);
    return {
        focusedIndex,
        setFocusedIndex,
        getItemProps,
        navigate,
        itemRefs,
    };
}
/**
 * Focus scope hook - sets the active scope when focused
 */
export function useFocusScope(scope) {
    const { setScope } = useKeyboardNavigation();
    const ref = React.useRef(null);
    React.useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const handleFocus = () => setScope(scope);
        const handleBlur = (e) => {
            // Only clear scope if focus is leaving the element entirely
            if (!element.contains(e.relatedTarget)) {
                setScope(null);
            }
        };
        element.addEventListener('focusin', handleFocus);
        element.addEventListener('focusout', handleBlur);
        return () => {
            element.removeEventListener('focusin', handleFocus);
            element.removeEventListener('focusout', handleBlur);
        };
    }, [scope, setScope]);
    return ref;
}
/**
 * Hook to show keyboard hints on long press of a modifier key
 */
export function useKeyboardHintsOnModifier(modifierKey = 'alt', delay = 500) {
    const { dispatch, state } = useKeyboardNavigation();
    const timeoutRef = React.useRef(null);
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            const isModifier = (modifierKey === 'alt' && e.key === 'Alt') ||
                (modifierKey === 'ctrl' && e.key === 'Control') ||
                (modifierKey === 'meta' && e.key === 'Meta');
            if (isModifier && !e.repeat) {
                timeoutRef.current = setTimeout(() => {
                    dispatch({ type: 'SET_HINTS', show: true });
                }, delay);
            }
        };
        const handleKeyUp = (e) => {
            const isModifier = (modifierKey === 'alt' && e.key === 'Alt') ||
                (modifierKey === 'ctrl' && e.key === 'Control') ||
                (modifierKey === 'meta' && e.key === 'Meta');
            if (isModifier) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                if (state.showHints) {
                    dispatch({ type: 'SET_HINTS', show: false });
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [modifierKey, delay, dispatch, state.showHints]);
    return state.showHints;
}
// ============================================================================
// Default Shortcuts
// ============================================================================
export const defaultChatShortcuts = [
    {
        id: 'show-shortcuts',
        keys: ['?', 'shift+/'],
        description: 'Show keyboard shortcuts',
        category: 'Help',
        handler: () => { },
        priority: 100,
    },
    {
        id: 'command-palette',
        keys: 'mod+k',
        description: 'Open command palette',
        category: 'Navigation',
        handler: () => { },
        priority: 100,
    },
    {
        id: 'search',
        keys: ['/', 'mod+f'],
        description: 'Focus search',
        category: 'Navigation',
        handler: () => { },
        priority: 90,
    },
    {
        id: 'new-chat',
        keys: 'mod+n',
        description: 'Start new chat',
        category: 'Chat',
        handler: () => { },
        priority: 80,
    },
    {
        id: 'send-message',
        keys: 'mod+enter',
        description: 'Send message',
        category: 'Chat',
        handler: () => { },
        enableInInput: true,
        priority: 100,
    },
    {
        id: 'focus-input',
        keys: ['i', 'mod+i'],
        description: 'Focus message input',
        category: 'Chat',
        handler: () => { },
        priority: 70,
    },
    {
        id: 'escape',
        keys: 'escape',
        description: 'Close modal/Cancel action',
        category: 'General',
        handler: () => { },
        enableInInput: true,
        priority: 100,
    },
    {
        id: 'toggle-sidebar',
        keys: 'mod+b',
        description: 'Toggle sidebar',
        category: 'Navigation',
        handler: () => { },
        priority: 60,
    },
    {
        id: 'scroll-to-bottom',
        keys: ['end', 'mod+down'],
        description: 'Scroll to bottom',
        category: 'Navigation',
        handler: () => { },
        priority: 50,
    },
    {
        id: 'scroll-to-top',
        keys: ['home', 'mod+up'],
        description: 'Scroll to top',
        category: 'Navigation',
        handler: () => { },
        priority: 50,
    },
    {
        id: 'copy-last-message',
        keys: 'mod+shift+c',
        description: 'Copy last assistant message',
        category: 'Chat',
        handler: () => { },
        priority: 70,
    },
    {
        id: 'regenerate',
        keys: 'mod+shift+r',
        description: 'Regenerate last response',
        category: 'Chat',
        handler: () => { },
        priority: 70,
    },
    // Vim-style navigation sequences
    {
        id: 'go-to-settings',
        keys: 'g s',
        description: 'Go to settings',
        category: 'Navigation',
        handler: () => { },
        priority: 40,
    },
    {
        id: 'go-to-home',
        keys: 'g h',
        description: 'Go to home',
        category: 'Navigation',
        handler: () => { },
        priority: 40,
    },
    {
        id: 'go-to-chats',
        keys: 'g c',
        description: 'Go to chat list',
        category: 'Navigation',
        handler: () => { },
        priority: 40,
    },
];
//# sourceMappingURL=use-keyboard-navigation.js.map