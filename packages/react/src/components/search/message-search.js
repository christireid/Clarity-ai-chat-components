'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Badge, Button, cn } from '@clarity-chat/primitives';
import { useDeferredSearch } from '../../hooks/performance/use-deferred-search';
import { SearchIcon } from '../ui/icons';
import { X, Command, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react';
import { DURATION_SECONDS as durations } from '../../animations/constants';
const { Suspense, useCallback, useEffect, useRef, useState, useMemo } = React;
// Type assertions for lucide icons
const XIcon = X;
const CommandIcon = Command;
const ArrowUpIcon = ArrowUp;
const ArrowDownIcon = ArrowDown;
const EnterIcon = CornerDownLeft;
/**
 * Enhanced Message Search Component
 *
 * Features:
 * - Keyboard shortcuts (Cmd/Ctrl+K to focus, Escape to clear/blur)
 * - Smooth animations with Framer Motion
 * - Search history with suggestions
 * - Real-time result highlighting
 * - Progress indicator for large searches
 * - Fully accessible with ARIA attributes
 * - Clear button for quick reset
 * - Result count with visual feedback
 *
 * @example
 * ```tsx
 * <MessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   onMessageSelect={(msg) => scrollToMessage(msg)}
 *   enableKeyboardShortcut
 *   showShortcutHint
 *   enableHistory
 * />
 * ```
 */
export function MessageSearch({ messages, onResultsChange, onMessageSelect, placeholder = 'Search messages...', className, enableKeyboardShortcut = true, showShortcutHint = true, autoFocus = false, showResultCount = true, enableHistory = true, maxHistoryItems = 5, emptyMessage = 'No messages found', highlightMatches = true, minSearchLength = 1, size = 'md', }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(-1);
    const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const blurTimeoutRef = useRef(null);
    const onResultsChangeRef = useRef(onResultsChange);
    // Keep ref updated without triggering re-renders
    useEffect(() => {
        onResultsChangeRef.current = onResultsChange;
    });
    const { filteredMessages, isPending } = useDeferredSearch(messages, searchQuery.length >= minSearchLength ? searchQuery : '');
    // Load search history from localStorage
    useEffect(() => {
        if (enableHistory && typeof window !== 'undefined') {
            try {
                const history = localStorage.getItem('clarity-message-search-history');
                if (history) {
                    setSearchHistory(JSON.parse(history));
                }
            }
            catch {
                // Silently fail
            }
        }
    }, [enableHistory]);
    // Save search to history
    const saveToHistory = useCallback((query) => {
        if (!enableHistory || !query.trim())
            return;
        setSearchHistory((prev) => {
            const newHistory = [query, ...prev.filter((h) => h !== query)].slice(0, maxHistoryItems);
            try {
                localStorage.setItem('clarity-message-search-history', JSON.stringify(newHistory));
            }
            catch {
                // Silently fail
            }
            return newHistory;
        });
    }, [enableHistory, maxHistoryItems]);
    // Clear search history
    const clearHistory = useCallback(() => {
        setSearchHistory([]);
        try {
            localStorage.removeItem('clarity-message-search-history');
        }
        catch {
            // Silently fail
        }
    }, []);
    // Notify parent of filtered results (using ref to avoid infinite loops)
    useEffect(() => {
        onResultsChangeRef.current?.(filteredMessages);
    }, [filteredMessages]);
    // Keyboard shortcut handler
    useEffect(() => {
        if (!enableKeyboardShortcut)
            return;
        const handleKeyDown = (e) => {
            // Cmd/Ctrl+K to focus
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setShowHistory(true);
            }
            // Cmd/Ctrl+Shift+K to clear and focus
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
                e.preventDefault();
                setSearchQuery('');
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableKeyboardShortcut]);
    // Handle input keyboard navigation
    const handleInputKeyDown = (e) => {
        switch (e.key) {
            case 'Escape':
                if (searchQuery) {
                    setSearchQuery('');
                }
                else {
                    inputRef.current?.blur();
                    setShowHistory(false);
                }
                setSelectedHistoryIndex(-1);
                setSelectedResultIndex(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (showHistory && searchHistory.length > 0) {
                    setSelectedHistoryIndex((prev) => Math.min(prev + 1, searchHistory.length - 1));
                }
                else if (filteredMessages.length > 0) {
                    setSelectedResultIndex((prev) => Math.min(prev + 1, filteredMessages.length - 1));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (showHistory && searchHistory.length > 0) {
                    setSelectedHistoryIndex((prev) => Math.max(prev - 1, -1));
                }
                else if (filteredMessages.length > 0) {
                    setSelectedResultIndex((prev) => Math.max(prev - 1, 0));
                }
                break;
            case 'Enter':
                if (selectedHistoryIndex >= 0 && searchHistory[selectedHistoryIndex]) {
                    setSearchQuery(searchHistory[selectedHistoryIndex]);
                    setShowHistory(false);
                    setSelectedHistoryIndex(-1);
                }
                else if (selectedResultIndex >= 0 &&
                    filteredMessages[selectedResultIndex]) {
                    onMessageSelect?.(filteredMessages[selectedResultIndex]);
                    saveToHistory(searchQuery);
                }
                else if (searchQuery.trim()) {
                    saveToHistory(searchQuery);
                }
                break;
            case 'Tab':
                if (selectedHistoryIndex >= 0 && searchHistory[selectedHistoryIndex]) {
                    e.preventDefault();
                    setSearchQuery(searchHistory[selectedHistoryIndex]);
                    setShowHistory(false);
                    setSelectedHistoryIndex(-1);
                }
                break;
        }
    };
    const handleClear = () => {
        setSearchQuery('');
        setSelectedHistoryIndex(-1);
        setSelectedResultIndex(-1);
        inputRef.current?.focus();
    };
    const handleFocus = () => {
        setIsFocused(true);
        if (enableHistory && !searchQuery) {
            setShowHistory(true);
        }
    };
    const handleBlur = () => {
        // Clear any existing timeout
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
        // Delay to allow click on history items
        blurTimeoutRef.current = setTimeout(() => {
            setIsFocused(false);
            setShowHistory(false);
            setSelectedHistoryIndex(-1);
            blurTimeoutRef.current = null;
        }, 150);
    };
    // Cleanup blur timeout on unmount
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);
    const handleHistoryItemClick = (query) => {
        setSearchQuery(query);
        setShowHistory(false);
        inputRef.current?.focus();
    };
    // Size variants
    const sizeClasses = {
        sm: {
            input: 'h-8 text-sm pl-8 pr-16',
            icon: 'h-3.5 w-3.5 left-2.5',
            clearBtn: 'h-5 w-5',
            badge: 'text-xs',
        },
        md: {
            input: 'h-10 text-sm pl-9 pr-20',
            icon: 'h-4 w-4 left-3',
            clearBtn: 'h-6 w-6',
            badge: 'text-xs',
        },
        lg: {
            input: 'h-12 text-base pl-11 pr-24',
            icon: 'h-5 w-5 left-3.5',
            clearBtn: 'h-7 w-7',
            badge: 'text-sm',
        },
    };
    const currentSize = sizeClasses[size];
    const hasResults = filteredMessages.length > 0;
    const noResults = searchQuery && !isPending && !hasResults;
    return (_jsxs("div", { ref: containerRef, className: cn('relative', className), children: [_jsxs("div", { className: "relative group", children: [_jsx(motion.div, { className: cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors pointer-events-none z-10', currentSize.icon, isFocused && 'text-primary'), animate: {
                            scale: isPending ? [1, 1.1, 1] : 1,
                        }, transition: {
                            duration: durations.slower,
                            repeat: isPending ? Infinity : 0,
                        }, children: _jsx(SearchIcon, { className: "h-full w-full" }) }), _jsx(Input, { ref: inputRef, type: "search", value: searchQuery, onChange: (e) => {
                            setSearchQuery(e.target.value);
                            setSelectedHistoryIndex(-1);
                            setSelectedResultIndex(-1);
                            setShowHistory(!e.target.value && enableHistory);
                        }, onKeyDown: handleInputKeyDown, onFocus: handleFocus, onBlur: handleBlur, placeholder: placeholder, autoFocus: autoFocus, className: cn(currentSize.input, 'transition-all duration-200', 'border-2', isFocused
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent bg-muted/50 hover:bg-muted', noResults && 'border-destructive/50'), "aria-label": "Search messages", "aria-expanded": showHistory && searchHistory.length > 0, "aria-haspopup": "listbox", "aria-autocomplete": "list", role: "combobox" }), _jsxs("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5", children: [_jsx(AnimatePresence, { mode: "wait", children: isPending && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "relative", children: _jsx("div", { className: cn('rounded-full border-2 border-primary/30 border-t-primary animate-spin', size === 'sm'
                                            ? 'h-3.5 w-3.5'
                                            : size === 'lg'
                                                ? 'h-5 w-5'
                                                : 'h-4 w-4') }) })) }), _jsx(AnimatePresence, { mode: "wait", children: searchQuery && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: handleClear, className: cn('p-0 hover:bg-transparent hover:text-destructive', currentSize.clearBtn), "aria-label": "Clear search", children: _jsx(XIcon, { className: "h-3.5 w-3.5" }) }) })) }), showShortcutHint && !searchQuery && !isFocused && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.6 }, className: "hidden sm:flex items-center gap-0.5 text-xs text-muted-foreground", children: [_jsx("kbd", { className: "px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50", children: _jsx(CommandIcon, { className: "h-2.5 w-2.5 inline" }) }), _jsx("kbd", { className: "px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono border border-border/50", children: "K" })] }))] }), _jsx(AnimatePresence, { children: isPending && (_jsx(motion.div, { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(motion.div, { className: "h-full bg-primary", initial: { x: '-100%' }, animate: { x: '100%' }, transition: {
                                    duration: durations.slower,
                                    repeat: Infinity,
                                    ease: 'linear',
                                } }) })) })] }), _jsx(AnimatePresence, { children: showHistory && searchHistory.length > 0 && !searchQuery && (_jsxs(motion.div, { initial: { opacity: 0, y: -10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.98 }, transition: { duration: durations.fast }, className: "absolute z-50 top-full mt-1 w-full bg-popover border rounded-lg shadow-lg overflow-hidden", role: "listbox", "aria-label": "Search history", children: [_jsxs("div", { className: "p-2 border-b flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Recent Searches" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: clearHistory, className: "h-6 text-xs text-muted-foreground hover:text-destructive", children: "Clear" })] }), _jsx("div", { className: "max-h-48 overflow-y-auto", children: searchHistory.map((query, index) => (_jsxs(motion.button, { onClick: () => handleHistoryItemClick(query), className: cn('w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors flex items-center gap-2', selectedHistoryIndex === index && 'bg-accent'), role: "option", "aria-selected": selectedHistoryIndex === index, initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.03 }, children: [_jsx(SearchIcon, { className: "h-3.5 w-3.5 text-muted-foreground" }), _jsx("span", { className: "truncate flex-1", children: query }), _jsx("span", { className: "text-xs text-muted-foreground", children: _jsx(EnterIcon, { className: "h-3 w-3" }) })] }, query))) }), _jsxs("div", { className: "p-2 border-t bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-3", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ArrowUpIcon, { className: "h-2.5 w-2.5" }), _jsx(ArrowDownIcon, { className: "h-2.5 w-2.5" }), "navigate"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(EnterIcon, { className: "h-2.5 w-2.5" }), "select"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "px-1 bg-background rounded border text-[8px]", children: "esc" }), "close"] })] })] })) }), _jsx(AnimatePresence, { mode: "wait", children: searchQuery && showResultCount && (_jsxs(motion.div, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, transition: { duration: durations.normal }, className: "mt-2 flex items-center justify-between text-sm", children: [_jsx("div", { className: "flex items-center gap-2", children: noResults ? (_jsxs(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-muted-foreground flex items-center gap-2", children: [_jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-amber-500" }), emptyMessage] })) : (_jsxs(motion.span, { className: "text-muted-foreground flex items-center gap-2", initial: { opacity: 0 }, animate: { opacity: 1 }, children: [_jsx("span", { className: cn('inline-block w-2 h-2 rounded-full', hasResults ? 'bg-green-500' : 'bg-muted') }), "Found", ' ', _jsx(motion.span, { initial: { scale: 1.2 }, animate: { scale: 1 }, className: "font-semibold text-foreground", children: filteredMessages.length }, filteredMessages.length), ' ', "of ", messages.length, " messages"] })) }), _jsxs("div", { className: "flex items-center gap-2", children: [isPending && (_jsx(Badge, { variant: "secondary", className: cn('animate-pulse', currentSize.badge), children: "Searching..." })), selectedResultIndex >= 0 && (_jsxs(Badge, { variant: "outline", className: currentSize.badge, children: [selectedResultIndex + 1, " / ", filteredMessages.length] }))] })] })) }), _jsx(AnimatePresence, { children: searchQuery && hasResults && isFocused && (_jsxs(motion.div, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, className: "mt-1.5 text-[10px] text-muted-foreground flex items-center gap-3", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ArrowUpIcon, { className: "h-2.5 w-2.5" }), _jsx(ArrowDownIcon, { className: "h-2.5 w-2.5" }), "navigate results"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(EnterIcon, { className: "h-2.5 w-2.5" }), "select"] })] })) })] }));
}
MessageSearch.displayName = 'MessageSearch';
/**
 * Message Search with Suspense Boundary
 *
 * Wraps MessageSearch in a Suspense boundary for lazy loading.
 * Shows an elegant loading skeleton while the component is being loaded.
 */
export const MessageSearchWithSuspense = React.memo(function MessageSearchWithSuspense(props) {
    return (_jsx(Suspense, { fallback: _jsxs("div", { className: "space-y-2 animate-pulse", children: [_jsx("div", { className: "h-10 bg-gradient-to-r from-muted to-muted/50 rounded-lg" }), _jsx("div", { className: "h-4 w-32 bg-muted rounded-md" })] }), children: _jsx(MessageSearch, { ...props }) }));
});
MessageSearchWithSuspense.displayName = 'MessageSearchWithSuspense';
/**
 * Highlight matching text in content
 * Uses case-insensitive comparison to safely identify match segments
 */
export function highlightSearchMatch(text, query, className) {
    if (!query.trim())
        return text;
    // Escape special regex characters to prevent ReDoS attacks
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Limit query length to prevent performance issues
    const safeQuery = escapedQuery.slice(0, 100);
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    const parts = text.split(regex);
    const queryLower = query.toLowerCase();
    return parts.map((part, index) => 
    // Use case-insensitive comparison instead of regex.test to avoid global flag issues
    part.toLowerCase() === queryLower ? (_jsx("mark", { className: cn('bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded-sm px-0.5', className), children: part }, index)) : (part));
}
//# sourceMappingURL=message-search.js.map