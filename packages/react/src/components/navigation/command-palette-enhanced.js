'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced Command Palette
 *
 * A powerful command palette with fuzzy search, recent commands,
 * and best-in-class keyboard navigation.
 *
 * Features:
 * - Fuzzy search with highlighting
 * - Recent commands section
 * - Vim-style navigation (j/k)
 * - Nested command groups
 * - Action previews
 * - Keyboard shortcuts display
 */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { cn, Kbd, useBodyScrollLock } from '@clarity-chat/primitives';
import { useFocusTrap, useFocusRestoration, } from '../../accessibility/focus-management';
import { useReducedMotion } from '@clarity-chat/primitives';
import { formatShortcutDisplay } from '../../hooks/keyboard/use-keyboard-navigation';
import { EASING_FRAMER } from '../../animations/constants';
function fuzzySearch(query, items) {
    if (!query.trim()) {
        return items.map((item) => ({ item, score: 0, matches: [] }));
    }
    const queryLower = query.toLowerCase();
    const results = [];
    items.forEach((item) => {
        const labelLower = item.label.toLowerCase();
        const descLower = (item.description || '').toLowerCase();
        const keywordsLower = (item.keywords || []).join(' ').toLowerCase();
        const categoryLower = (item.category || '').toLowerCase();
        // Check label match
        const labelMatch = fuzzyMatch(queryLower, labelLower);
        const descMatch = fuzzyMatch(queryLower, descLower);
        const keywordsMatch = fuzzyMatch(queryLower, keywordsLower);
        const categoryMatch = fuzzyMatch(queryLower, categoryLower);
        const bestMatch = [
            labelMatch,
            descMatch,
            keywordsMatch,
            categoryMatch,
        ].reduce((best, current) => current && (!best || current.score > best.score) ? current : best, null);
        if (bestMatch && bestMatch.score > 0) {
            results.push({
                item,
                score: bestMatch.score,
                // Only return label matches for highlighting
                matches: labelMatch?.matches || [],
            });
        }
    });
    return results.sort((a, b) => b.score - a.score);
}
function fuzzyMatch(query, text) {
    if (!query)
        return { score: 0, matches: [] };
    if (!text)
        return null;
    const matches = [];
    let score = 0;
    let queryIndex = 0;
    let consecutiveMatches = 0;
    let lastMatchIndex = -1;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
        if (text[i] === query[queryIndex]) {
            // Consecutive match bonus
            if (lastMatchIndex === i - 1) {
                consecutiveMatches++;
                score += consecutiveMatches * 2;
            }
            else {
                consecutiveMatches = 1;
            }
            // Start of word bonus
            if (i === 0 ||
                text[i - 1] === ' ' ||
                text[i - 1] === '-' ||
                text[i - 1] === '_') {
                score += 10;
            }
            // Exact case match bonus
            if (text[i] === query[queryIndex]) {
                score += 1;
            }
            // Record match position
            if (matches.length > 0 && matches[matches.length - 1][1] === i) {
                matches[matches.length - 1][1] = i + 1;
            }
            else {
                matches.push([i, i + 1]);
            }
            lastMatchIndex = i;
            queryIndex++;
            score += 1;
        }
    }
    // All query chars matched
    if (queryIndex === query.length) {
        // Bonus for shorter strings (more relevant matches)
        score += Math.max(0, 50 - text.length);
        return { score, matches };
    }
    return null;
}
// ============================================================================
// Recent Commands Hook (SSR-safe)
// ============================================================================
/**
 * Check if localStorage is available (browser environment)
 */
function isLocalStorageAvailable() {
    if (typeof window === 'undefined')
        return false;
    try {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    }
    catch {
        return false;
    }
}
function useRecentCommands(storageKey, maxRecents) {
    const [recents, setRecents] = React.useState([]);
    const [isClient, setIsClient] = React.useState(false);
    // Check if we're on the client after hydration
    React.useEffect(() => {
        setIsClient(true);
    }, []);
    // Load from localStorage (only on client)
    React.useEffect(() => {
        if (!isClient || !isLocalStorageAvailable())
            return;
        try {
            const stored = window.localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setRecents(parsed);
                }
            }
        }
        catch {
            // Ignore storage errors (quota exceeded, invalid JSON, etc.)
        }
    }, [storageKey, isClient]);
    // Add to recents
    const addRecent = React.useCallback((id) => {
        setRecents((prev) => {
            const newRecents = [id, ...prev.filter((r) => r !== id)].slice(0, maxRecents);
            // Persist to localStorage (if available)
            if (isLocalStorageAvailable()) {
                try {
                    window.localStorage.setItem(storageKey, JSON.stringify(newRecents));
                }
                catch {
                    // Ignore storage errors (quota exceeded, etc.)
                }
            }
            return newRecents;
        });
    }, [storageKey, maxRecents]);
    return [recents, addRecent];
}
// ============================================================================
// Highlight Component
// ============================================================================
function HighlightedText({ text, matches, }) {
    if (matches.length === 0) {
        return _jsx(_Fragment, { children: text });
    }
    const parts = [];
    let lastIndex = 0;
    matches.forEach(([start, end], i) => {
        // Add non-matching part
        if (start > lastIndex) {
            parts.push(_jsx("span", { children: text.slice(lastIndex, start) }, `text-${i}`));
        }
        // Add matching part
        parts.push(_jsx("mark", { className: "bg-primary/20 text-primary rounded px-0.5", children: text.slice(start, end) }, `match-${i}`));
        lastIndex = end;
    });
    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(_jsx("span", { children: text.slice(lastIndex) }, "text-end"));
    }
    return _jsx(_Fragment, { children: parts });
}
// ============================================================================
// Component
// ============================================================================
export function CommandPaletteEnhanced({ commands, open, onClose, placeholder = 'Type a command or search...', enableRecents = true, maxRecents = 5, storageKey = 'clarity-command-palette-recents', className, emptyState, footer, }) {
    const [search, setSearch] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [portalContainer, setPortalContainer] = React.useState(null);
    const [commandStack, setCommandStack] = React.useState([]);
    const inputRef = React.useRef(null);
    const listRef = React.useRef(null);
    const prefersReducedMotion = useReducedMotion();
    const focusTrapRef = useFocusTrap(open);
    const { saveFocus, restoreFocus } = useFocusRestoration();
    const { lock } = useBodyScrollLock();
    // Recent commands
    const [recents, addRecent] = useRecentCommands(storageKey, maxRecents);
    // Current commands (support nested navigation)
    const currentCommands = commandStack.length > 0
        ? commandStack[commandStack.length - 1].children || []
        : commands;
    // Fuzzy search results
    const searchResults = React.useMemo(() => fuzzySearch(search, currentCommands), [search, currentCommands]);
    // Build display list with recents section
    const displayItems = React.useMemo(() => {
        if (search.trim()) {
            return searchResults;
        }
        // Show recents first if available
        if (enableRecents && recents.length > 0 && commandStack.length === 0) {
            const recentCommands = recents
                .map((id) => currentCommands.find((c) => c.id === id))
                .filter(Boolean);
            if (recentCommands.length > 0) {
                return [
                    ...recentCommands.map((item) => ({
                        item: { ...item, category: 'Recent' },
                        score: 1000,
                        matches: [],
                    })),
                    ...currentCommands
                        .filter((c) => !recents.includes(c.id))
                        .map((item) => ({ item, score: 0, matches: [] })),
                ];
            }
        }
        return currentCommands.map((item) => ({ item, score: 0, matches: [] }));
    }, [
        search,
        searchResults,
        currentCommands,
        recents,
        enableRecents,
        commandStack.length,
    ]);
    // Group by category
    const groupedItems = React.useMemo(() => {
        const groups = new Map();
        displayItems.forEach((result) => {
            const category = result.item.category || 'Commands';
            const existing = groups.get(category) || [];
            groups.set(category, [...existing, result]);
        });
        return groups;
    }, [displayItems]);
    // Flat list for keyboard navigation
    const flatItems = React.useMemo(() => displayItems.map((r) => r.item), [displayItems]);
    // Setup portal
    React.useEffect(() => {
        setPortalContainer(document.body);
    }, []);
    // Scroll lock
    React.useEffect(() => {
        if (open) {
            const unlock = lock();
            return unlock;
        }
        return undefined;
    }, [open, lock]);
    // Focus management
    React.useEffect(() => {
        let timeoutId;
        if (open) {
            saveFocus();
            // Focus input with small delay for animation
            timeoutId = setTimeout(() => inputRef.current?.focus(), 50);
            setSearch('');
            setSelectedIndex(0);
            setCommandStack([]);
        }
        else {
            restoreFocus();
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [open, saveFocus, restoreFocus]);
    // Reset selection when results change
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [displayItems.length]);
    // Scroll selected item into view
    React.useEffect(() => {
        if (listRef.current) {
            const selected = listRef.current.querySelector('[data-selected="true"]');
            selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);
    // Handle command selection
    const handleSelect = React.useCallback((command) => {
        if (command.disabled)
            return;
        // If command has children, navigate into it
        if (command.children && command.children.length > 0) {
            setCommandStack((prev) => [...prev, command]);
            setSearch('');
            setSelectedIndex(0);
            return;
        }
        // Execute command
        addRecent(command.id);
        command.onSelect();
        onClose();
    }, [addRecent, onClose]);
    // Handle back navigation
    const handleBack = React.useCallback(() => {
        if (commandStack.length > 0) {
            setCommandStack((prev) => prev.slice(0, -1));
            setSearch('');
            setSelectedIndex(0);
        }
    }, [commandStack.length]);
    // Keyboard navigation
    React.useEffect(() => {
        if (!open)
            return;
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    if (search) {
                        setSearch('');
                    }
                    else if (commandStack.length > 0) {
                        handleBack();
                    }
                    else {
                        onClose();
                    }
                    break;
                case 'ArrowDown':
                case 'j':
                    if (e.key === 'j' && !e.ctrlKey)
                        break;
                    e.preventDefault();
                    setSelectedIndex((prev) => prev < flatItems.length - 1 ? prev + 1 : 0);
                    break;
                case 'ArrowUp':
                case 'k':
                    if (e.key === 'k' && !e.ctrlKey)
                        break;
                    e.preventDefault();
                    setSelectedIndex((prev) => prev > 0 ? prev - 1 : flatItems.length - 1);
                    break;
                case 'Home':
                    e.preventDefault();
                    setSelectedIndex(0);
                    break;
                case 'End':
                    e.preventDefault();
                    setSelectedIndex(flatItems.length - 1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (flatItems[selectedIndex]) {
                        handleSelect(flatItems[selectedIndex]);
                    }
                    break;
                case 'Backspace':
                    if (search === '' && commandStack.length > 0) {
                        e.preventDefault();
                        handleBack();
                    }
                    break;
                case 'Tab':
                    // Prevent default tab behavior inside command palette
                    e.preventDefault();
                    if (e.shiftKey) {
                        setSelectedIndex((prev) => prev > 0 ? prev - 1 : flatItems.length - 1);
                    }
                    else {
                        setSelectedIndex((prev) => prev < flatItems.length - 1 ? prev + 1 : 0);
                    }
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        open,
        search,
        flatItems,
        selectedIndex,
        commandStack.length,
        handleSelect,
        handleBack,
        onClose,
    ]);
    // Render shortcut display
    const renderShortcut = (shortcut) => {
        if (!shortcut)
            return null;
        const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
        return (_jsx("div", { className: "flex items-center gap-1 flex-shrink-0", children: shortcuts.map((s, i) => (_jsxs(React.Fragment, { children: [i > 0 && (_jsx("span", { className: "text-muted-foreground/50 text-xs", children: "or" })), _jsx(Kbd, { shortcut: formatShortcutDisplay(s), size: "sm" })] }, i))) }));
    };
    if (!portalContainer)
        return null;
    const content = (_jsx(MotionConfig, { reducedMotion: prefersReducedMotion ? 'always' : 'never', children: _jsx(AnimatePresence, { children: open && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: prefersReducedMotion ? 0 : 0.15 }, onClick: onClose, className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50", "aria-hidden": "true" }), _jsxs(motion.div, { ref: focusTrapRef, initial: {
                            opacity: 0,
                            scale: prefersReducedMotion ? 1 : 0.95,
                            y: prefersReducedMotion ? 0 : -20,
                        }, animate: { opacity: 1, scale: 1, y: 0 }, exit: {
                            opacity: 0,
                            scale: prefersReducedMotion ? 1 : 0.95,
                            y: prefersReducedMotion ? 0 : -20,
                        }, transition: {
                            duration: prefersReducedMotion ? 0 : 0.2,
                            ease: EASING_FRAMER.sharp,
                        }, role: "dialog", "aria-modal": "true", "aria-label": "Command palette", className: cn('fixed top-[15%] left-1/2 -translate-x-1/2 z-50', 'w-full max-w-2xl mx-4', 'bg-card border border-border/60 rounded-xl', 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]', 'flex flex-col max-h-[70vh] overflow-hidden', className), children: [commandStack.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "px-4 py-2 border-b border-border/40 bg-muted/30", children: _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("button", { onClick: () => setCommandStack([]), className: "text-muted-foreground hover:text-foreground transition-colors", children: "Commands" }), commandStack.map((cmd, i) => (_jsxs(React.Fragment, { children: [_jsx("span", { className: "text-muted-foreground/50", children: "/" }), _jsx("button", { onClick: () => setCommandStack((prev) => prev.slice(0, i + 1)), className: cn(i === commandStack.length - 1
                                                        ? 'text-foreground font-medium'
                                                        : 'text-muted-foreground hover:text-foreground transition-colors'), children: cmd.label })] }, cmd.id)))] }) })), _jsx("div", { className: "relative p-4 border-b border-border/40", children: _jsxs("div", { className: "flex items-center gap-3", children: [commandStack.length > 0 && (_jsx("button", { onClick: handleBack, className: "p-1 hover:bg-accent rounded transition-colors", "aria-label": "Go back", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) })), _jsx("svg", { className: "h-5 w-5 text-muted-foreground shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { ref: inputRef, type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: placeholder, className: cn('flex-1 px-0 py-2 text-base bg-transparent', 'border-none outline-none placeholder:text-muted-foreground/60', 'focus:ring-0'), "aria-label": "Search commands", role: "combobox", "aria-expanded": "true", "aria-controls": "command-list", "aria-activedescendant": flatItems[selectedIndex]
                                                ? `command-option-${flatItems[selectedIndex].id}`
                                                : undefined }), search && (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, onClick: () => setSearch(''), className: "p-1.5 hover:bg-accent rounded-full transition-colors", "aria-label": "Clear search", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }) }), _jsx("div", { ref: listRef, id: "command-list", role: "listbox", className: "flex-1 overflow-y-auto p-2", children: flatItems.length === 0 ? (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "py-12 text-center", children: emptyState || (_jsxs(_Fragment, { children: [_jsx("svg", { className: "mx-auto h-12 w-12 text-muted-foreground/40 mb-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: "No commands found" }), _jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Try a different search term" })] })) })) : (_jsx("div", { className: "space-y-4", children: Array.from(groupedItems.entries()).map(([category, items], groupIndex) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: {
                                            delay: prefersReducedMotion ? 0 : groupIndex * 0.05,
                                        }, children: [_jsx("div", { className: "px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: category }), _jsx("div", { className: "space-y-0.5", children: items.map((result) => {
                                                    const globalIndex = displayItems.indexOf(result);
                                                    const isSelected = globalIndex === selectedIndex;
                                                    return (_jsxs(motion.button, { id: `command-option-${result.item.id}`, "data-selected": isSelected, onClick: () => handleSelect(result.item), onMouseEnter: () => setSelectedIndex(globalIndex), role: "option", "aria-selected": isSelected, disabled: result.item.disabled, className: cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'transition-all duration-100 text-left group', isSelected
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-accent', result.item.disabled &&
                                                            'opacity-50 cursor-not-allowed'), whileHover: prefersReducedMotion ? {} : { x: 2 }, whileTap: prefersReducedMotion ? {} : { scale: 0.98 }, children: [result.item.icon && (_jsx("span", { className: cn('flex-shrink-0', isSelected
                                                                    ? 'text-primary-foreground'
                                                                    : 'text-muted-foreground'), children: result.item.icon })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: _jsx(HighlightedText, { text: result.item.label, matches: result.matches }) }), result.item.description && (_jsx("div", { className: cn('text-sm truncate', isSelected
                                                                            ? 'text-primary-foreground/70'
                                                                            : 'text-muted-foreground'), children: result.item.description }))] }), result.item.children &&
                                                                result.item.children.length > 0 && (_jsx("svg", { className: cn('w-4 h-4 flex-shrink-0', isSelected
                                                                    ? 'text-primary-foreground/70'
                                                                    : 'text-muted-foreground'), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })), result.item.shortcut && (_jsx("div", { className: cn(isSelected &&
                                                                    '[&_kbd]:bg-primary-foreground/20 [&_kbd]:border-primary-foreground/30 [&_kbd]:text-primary-foreground'), children: renderShortcut(result.item.shortcut) }))] }, result.item.id));
                                                }) })] }, category))) })) }), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: prefersReducedMotion ? 0 : 0.2 }, className: "px-4 py-3 border-t border-border/40 bg-muted/30 text-xs text-muted-foreground", children: footer || (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Kbd, { shortcut: "\u2191", size: "sm" }), _jsx(Kbd, { shortcut: "\u2193", size: "sm" }), _jsx("span", { className: "hidden sm:inline", children: "navigate" })] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Kbd, { shortcut: "\u21B5", size: "sm" }), _jsx("span", { className: "hidden sm:inline", children: "select" })] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Kbd, { shortcut: "Esc", size: "sm" }), _jsx("span", { className: "hidden sm:inline", children: "close" })] }), commandStack.length > 0 && (_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Kbd, { shortcut: "\u232B", size: "sm" }), _jsx("span", { className: "hidden sm:inline", children: "back" })] }))] }), _jsxs("div", { className: "font-medium", children: [flatItems.length, " command", flatItems.length !== 1 ? 's' : ''] })] })) })] })] })) }) }));
    return createPortal(content, portalContainer);
}
CommandPaletteEnhanced.displayName = 'CommandPaletteEnhanced';
//# sourceMappingURL=command-palette-enhanced.js.map