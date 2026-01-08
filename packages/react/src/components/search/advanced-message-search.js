'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Badge, Popover, PopoverContent, PopoverTrigger, cn, } from '@clarity-chat/primitives';
import { SearchIcon } from '../ui/icons';
import { Filter, X, Download, BookmarkPlus, Bookmark, Clock, Trash2, ChevronDown, ChevronUp, RefreshCw, SlidersHorizontal, Sparkles, User, Bot, Settings, Calendar, Hash, Paperclip, AlertCircle, Check, Copy, ArrowUpDown, } from 'lucide-react';
// Type assertions for icons
const FilterIcon = Filter;
const XIcon = X;
const DownloadIcon = Download;
const BookmarkPlusIcon = BookmarkPlus;
const BookmarkIcon = Bookmark;
const ClockIcon = Clock;
const TrashIcon = Trash2;
const ChevronDownIcon = ChevronDown;
const ChevronUpIcon = ChevronUp;
const RefreshIcon = RefreshCw;
const SlidersIcon = SlidersHorizontal;
const SparklesIcon = Sparkles;
const UserIcon = User;
const BotIcon = Bot;
const SettingsIcon = Settings;
const CalendarIcon = Calendar;
const HashIcon = Hash;
const PaperclipIcon = Paperclip;
const AlertIcon = AlertCircle;
const CheckIcon = Check;
const CopyIcon = Copy;
const SortIcon = ArrowUpDown;
import { useDeferredSearch } from '../../hooks/performance/use-deferred-search';
import { DURATION_SECONDS as durations } from '../../animations/constants';
const STORAGE_KEY_SAVED = 'clarity-advanced-search-saved';
const STORAGE_KEY_RECENT = 'clarity-advanced-search-recent';
// Default filter presets
const defaultPresets = [
    {
        id: 'user-messages',
        name: 'User Messages',
        icon: _jsx(UserIcon, { className: "h-3.5 w-3.5" }),
        filters: { role: 'user' },
    },
    {
        id: 'ai-responses',
        name: 'AI Responses',
        icon: _jsx(BotIcon, { className: "h-3.5 w-3.5" }),
        filters: { role: 'assistant' },
    },
    {
        id: 'with-attachments',
        name: 'Has Attachments',
        icon: _jsx(PaperclipIcon, { className: "h-3.5 w-3.5" }),
        filters: { hasAttachments: true },
    },
    {
        id: 'with-errors',
        name: 'Has Errors',
        icon: _jsx(AlertIcon, { className: "h-3.5 w-3.5" }),
        filters: { hasErrors: true },
    },
    {
        id: 'today',
        name: 'Today',
        icon: _jsx(CalendarIcon, { className: "h-3.5 w-3.5" }),
        filters: {
            dateRange: {
                start: new Date(new Date().setHours(0, 0, 0, 0)),
                end: new Date(),
            },
        },
    },
];
/**
 * Advanced Message Search Component
 *
 * A comprehensive search solution with:
 * - Full-text search with highlighting
 * - Advanced filtering (date, model, role, tokens, attachments, errors)
 * - Saved searches with persistent storage
 * - Quick filter presets
 * - Export functionality (JSON, CSV, Markdown)
 * - Sorting options
 * - Real-time results with deferred updates
 * - Beautiful animations and transitions
 * - Fully accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <AdvancedMessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   enableSavedSearches
 *   enableExport
 *   enableSorting
 * />
 * ```
 */
export const AdvancedMessageSearch = React.memo(function AdvancedMessageSearch({ messages, onResultsChange, onMessageSelect, enableFuzzySearch: _enableFuzzySearch = false, enableAdvancedFilters = true, enableSavedSearches = true, enableExport = true, enableSorting = true, placeholder = 'Search messages...', showFilterCount = true, filterPresets = defaultPresets, size = 'md', className, }) {
    const [filters, setFilters] = React.useState({ query: '' });
    const [showFilters, setShowFilters] = React.useState(false);
    const [activeFilterCount, setActiveFilterCount] = React.useState(0);
    const [savedSearches, setSavedSearches] = React.useState([]);
    const [recentSearches, setRecentSearches] = React.useState([]);
    const [sortOption, setSortOption] = React.useState('relevance');
    const [showSavedSearches, setShowSavedSearches] = React.useState(false);
    const [savingSearch, setSavingSearch] = React.useState(false);
    const [searchName, setSearchName] = React.useState('');
    const [expandedSections, setExpandedSections] = React.useState(new Set(['role', 'quick']));
    const [exportFormat, setExportFormat] = React.useState('json');
    const [copied, setCopied] = React.useState(false);
    const inputRef = React.useRef(null);
    const copyTimeoutRef = React.useRef(null);
    const onResultsChangeRef = React.useRef(onResultsChange);
    // Keep ref updated without triggering re-renders
    React.useEffect(() => {
        onResultsChangeRef.current = onResultsChange;
    });
    // Cleanup timeouts on unmount
    React.useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);
    // Load saved and recent searches with validation
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        try {
            const saved = localStorage.getItem(STORAGE_KEY_SAVED);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate saved searches structure
                if (Array.isArray(parsed) &&
                    parsed.every((s) => typeof s === 'object' &&
                        s !== null &&
                        'id' in s &&
                        'name' in s &&
                        'filters' in s &&
                        'createdAt' in s)) {
                    setSavedSearches(parsed);
                }
            }
            const recent = localStorage.getItem(STORAGE_KEY_RECENT);
            if (recent) {
                const parsed = JSON.parse(recent);
                // Validate recent searches structure
                if (Array.isArray(parsed) &&
                    parsed.every((r) => typeof r === 'string')) {
                    setRecentSearches(parsed);
                }
            }
        }
        catch {
            // Silently fail - invalid data will use defaults
        }
    }, []);
    // Calculate active filter count
    React.useEffect(() => {
        let count = 0;
        if (filters.role)
            count++;
        if (filters.dateRange?.start || filters.dateRange?.end)
            count++;
        if (filters.model)
            count++;
        if (filters.tags && filters.tags.length > 0)
            count++;
        if (filters.minTokens || filters.maxTokens)
            count++;
        if (filters.hasAttachments)
            count++;
        if (filters.hasErrors)
            count++;
        setActiveFilterCount(count);
    }, [filters]);
    // Perform search with deferred value
    const { filteredMessages, isPending } = useDeferredSearch(messages, filters.query);
    // Apply advanced filters and sorting
    const finalResults = React.useMemo(() => {
        let results = [...filteredMessages];
        // Filter by role
        if (filters.role) {
            results = results.filter((msg) => msg.role === filters.role);
        }
        // Filter by date range
        if (filters.dateRange) {
            const { start, end } = filters.dateRange;
            results = results.filter((msg) => {
                const msgDate = new Date(msg.createdAt);
                if (start && msgDate < start)
                    return false;
                if (end && msgDate > end)
                    return false;
                return true;
            });
        }
        // Filter by model
        if (filters.model) {
            results = results.filter((msg) => {
                const metadata = msg.metadata;
                return metadata?.model === filters.model;
            });
        }
        // Filter by tokens
        if (filters.minTokens || filters.maxTokens) {
            results = results.filter((msg) => {
                const tokenCount = msg.tokenCount || 0;
                if (filters.minTokens && tokenCount < filters.minTokens)
                    return false;
                if (filters.maxTokens && tokenCount > filters.maxTokens)
                    return false;
                return true;
            });
        }
        // Filter by attachments
        if (filters.hasAttachments) {
            results = results.filter((msg) => {
                return (msg.attachments &&
                    msg.attachments.length > 0);
            });
        }
        // Filter by errors
        if (filters.hasErrors) {
            results = results.filter((msg) => msg.status === 'error');
        }
        // Apply sorting
        if (sortOption !== 'relevance') {
            results.sort((a, b) => {
                switch (sortOption) {
                    case 'newest':
                        return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    case 'oldest':
                        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                    case 'longest':
                        return b.content.length - a.content.length;
                    case 'shortest':
                        return a.content.length - b.content.length;
                    default:
                        return 0;
                }
            });
        }
        return results;
    }, [filteredMessages, filters, sortOption]);
    // Notify parent of results (using ref to avoid infinite loops)
    React.useEffect(() => {
        onResultsChangeRef.current?.(finalResults);
    }, [finalResults]);
    // Extract unique models for filter dropdown
    const availableModels = React.useMemo(() => {
        const models = new Set();
        messages.forEach((msg) => {
            const metadata = msg.metadata;
            if (metadata?.model) {
                models.add(metadata.model);
            }
        });
        return Array.from(models);
    }, [messages]);
    // Add to recent searches
    const addToRecent = React.useCallback((query) => {
        if (!query.trim())
            return;
        setRecentSearches((prev) => {
            const newRecent = [query, ...prev.filter((r) => r !== query)].slice(0, 10);
            try {
                localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(newRecent));
            }
            catch {
                // Silently fail
            }
            return newRecent;
        });
    }, []);
    // Save current search
    const handleSaveSearch = React.useCallback(() => {
        if (!searchName.trim())
            return;
        const newSearch = {
            id: Date.now().toString(),
            name: searchName,
            filters: { ...filters },
            createdAt: Date.now(),
        };
        setSavedSearches((prev) => {
            const newSaved = [newSearch, ...prev].slice(0, 20);
            try {
                localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(newSaved));
            }
            catch {
                // Silently fail
            }
            return newSaved;
        });
        setSearchName('');
        setSavingSearch(false);
    }, [searchName, filters]);
    // Load saved search
    const loadSavedSearch = React.useCallback((search) => {
        setFilters(search.filters);
        setShowSavedSearches(false);
        // Update last used
        setSavedSearches((prev) => {
            const updated = prev.map((s) => s.id === search.id ? { ...s, lastUsed: Date.now() } : s);
            try {
                localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
            }
            catch {
                // Silently fail
            }
            return updated;
        });
    }, []);
    // Delete saved search
    const deleteSavedSearch = React.useCallback((id) => {
        setSavedSearches((prev) => {
            const updated = prev.filter((s) => s.id !== id);
            try {
                localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
            }
            catch {
                // Silently fail
            }
            return updated;
        });
    }, []);
    // Clear all filters
    const handleClearFilters = React.useCallback(() => {
        setFilters({ query: filters.query });
    }, [filters.query]);
    // Apply preset filters
    const applyPreset = React.useCallback((preset) => {
        setFilters((prev) => ({
            ...prev,
            ...preset.filters,
        }));
    }, []);
    // Toggle section expansion
    const toggleSection = React.useCallback((section) => {
        setExpandedSections((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            }
            else {
                newSet.add(section);
            }
            return newSet;
        });
    }, []);
    // Export results
    const handleExport = React.useCallback(() => {
        let content = '';
        let filename = '';
        let mimeType = '';
        switch (exportFormat) {
            case 'json':
                content = JSON.stringify(finalResults, null, 2);
                filename = 'search-results.json';
                mimeType = 'application/json';
                break;
            case 'csv':
                const headers = ['id', 'role', 'content', 'createdAt', 'status'];
                const rows = finalResults.map((msg) => headers
                    .map((h) => {
                    const value = msg[h];
                    return typeof value === 'string'
                        ? `"${value.replace(/"/g, '""')}"`
                        : value;
                })
                    .join(','));
                content = [headers.join(','), ...rows].join('\n');
                filename = 'search-results.csv';
                mimeType = 'text/csv';
                break;
            case 'md':
                content = finalResults
                    .map((msg) => `### ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}\n\n${msg.content}\n\n---\n`)
                    .join('\n');
                filename = 'search-results.md';
                mimeType = 'text/markdown';
                break;
        }
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [finalResults, exportFormat]);
    // Copy results to clipboard
    const handleCopyResults = React.useCallback(async () => {
        const content = finalResults
            .map((msg) => `[${msg.role}]: ${msg.content}`)
            .join('\n\n');
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            // Clear any existing timeout before setting a new one
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = setTimeout(() => {
                setCopied(false);
                copyTimeoutRef.current = null;
            }, 2000);
        }
        catch {
            // Silently fail
        }
    }, [finalResults]);
    // Size classes
    const sizeClasses = {
        sm: { input: 'h-8 text-sm', button: 'h-7 w-7', badge: 'text-xs' },
        md: { input: 'h-10 text-sm', button: 'h-8 w-8', badge: 'text-xs' },
        lg: { input: 'h-12 text-base', button: 'h-9 w-9', badge: 'text-sm' },
    };
    const currentSize = sizeClasses[size];
    // Check if any preset is active
    const isPresetActive = (preset) => {
        return Object.entries(preset.filters).every(([key, value]) => {
            const filterValue = filters[key];
            if (key === 'dateRange' && value) {
                return (filters.dateRange?.start?.getTime() ===
                    value.start?.getTime() &&
                    filters.dateRange?.end?.getTime() === value.end?.getTime());
            }
            return filterValue === value;
        });
    };
    return (_jsxs("div", { className: cn('space-y-3', className), children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "relative group", children: [_jsx(SearchIcon, { className: cn('absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors', filters.query && 'text-primary') }), _jsx(Input, { ref: inputRef, type: "search", value: filters.query, onChange: (e) => {
                                    setFilters((prev) => ({ ...prev, query: e.target.value }));
                                }, placeholder: placeholder, className: cn(currentSize.input, 'pl-9 pr-32 transition-all duration-200 border-2', 'focus:border-primary focus:ring-2 focus:ring-primary/20'), onKeyDown: (e) => {
                                    if (e.key === 'Enter' && filters.query.trim()) {
                                        // Add to recent on Enter
                                        addToRecent(filters.query.trim());
                                    }
                                    else if (e.key === 'Escape') {
                                        if (filters.query) {
                                            setFilters((prev) => ({ ...prev, query: '' }));
                                        }
                                        else {
                                            inputRef.current?.blur();
                                        }
                                    }
                                }, onBlur: () => {
                                    // Add to recent on blur if there's a query
                                    if (filters.query.trim()) {
                                        addToRecent(filters.query.trim());
                                    }
                                } }), _jsxs("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1", children: [_jsx(AnimatePresence, { children: isPending && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" })) }), _jsx(AnimatePresence, { children: filters.query && (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setFilters((prev) => ({ ...prev, query: '' })), className: "h-6 w-6 p-0 hover:bg-transparent hover:text-destructive", children: _jsx(XIcon, { className: "h-3.5 w-3.5" }) }) })) }), enableSorting && (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: cn(currentSize.button, 'p-0', sortOption !== 'relevance' && 'text-primary'), children: _jsx(SortIcon, { className: "h-4 w-4" }) }) }), _jsx(PopoverContent, { className: "w-40 p-1", align: "end", children: [
                                                    'relevance',
                                                    'newest',
                                                    'oldest',
                                                    'longest',
                                                    'shortest',
                                                ].map((option) => (_jsxs("button", { onClick: () => setSortOption(option), className: cn('w-full px-2 py-1.5 text-sm text-left rounded hover:bg-accent flex items-center justify-between', sortOption === option && 'bg-accent'), children: [option.charAt(0).toUpperCase() + option.slice(1), sortOption === option && (_jsx(CheckIcon, { className: "h-3.5 w-3.5 text-primary" }))] }, option))) })] })), enableSavedSearches && (_jsxs(Popover, { open: showSavedSearches, onOpenChange: setShowSavedSearches, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: cn(currentSize.button, 'p-0'), children: _jsx(BookmarkIcon, { className: "h-4 w-4" }) }) }), _jsx(PopoverContent, { className: "w-72", align: "end", children: _jsxs("div", { className: "space-y-3", children: [(filters.query || activeFilterCount > 0) && (_jsx("div", { className: "pb-3 border-b", children: savingSearch ? (_jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: searchName, onChange: (e) => setSearchName(e.target.value), placeholder: "Search name...", className: "h-8 text-sm", autoFocus: true, onKeyDown: (e) => {
                                                                            if (e.key === 'Enter')
                                                                                handleSaveSearch();
                                                                            if (e.key === 'Escape')
                                                                                setSavingSearch(false);
                                                                        } }), _jsx(Button, { size: "sm", onClick: handleSaveSearch, disabled: !searchName.trim(), className: "h-8", children: "Save" })] })) : (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => setSavingSearch(true), className: "w-full justify-start", children: [_jsx(BookmarkPlusIcon, { className: "h-4 w-4 mr-2" }), "Save Current Search"] })) })), savedSearches.length > 0 ? (_jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: savedSearches.map((search) => (_jsxs("div", { className: "flex items-center gap-2 p-2 rounded hover:bg-accent group", children: [_jsxs("button", { onClick: () => loadSavedSearch(search), className: "flex-1 text-left", children: [_jsx("div", { className: "text-sm font-medium truncate", children: search.name }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [search.filters.query &&
                                                                                        `"${search.filters.query}"`, Object.keys(search.filters).filter((k) => k !== 'query' &&
                                                                                        search.filters[k]).length > 0 && ' + filters'] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteSavedSearch(search.id), className: "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive", children: _jsx(TrashIcon, { className: "h-3.5 w-3.5" }) })] }, search.id))) })) : (_jsx("div", { className: "text-sm text-center text-muted-foreground py-4", children: "No saved searches yet" })), recentSearches.length > 0 && (_jsxs("div", { className: "pt-3 border-t", children: [_jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mb-2", children: [_jsx(ClockIcon, { className: "h-3 w-3" }), "Recent"] }), _jsx("div", { className: "flex flex-wrap gap-1", children: recentSearches.slice(0, 5).map((query, i) => (_jsx("button", { onClick: () => setFilters((prev) => ({ ...prev, query })), className: "px-2 py-1 text-xs bg-muted rounded-full hover:bg-accent truncate max-w-[100px]", children: query }, i))) })] }))] }) })] })), enableAdvancedFilters && (_jsxs(Popover, { open: showFilters, onOpenChange: setShowFilters, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: cn(currentSize.button, 'p-0 relative', activeFilterCount > 0 && 'text-primary'), children: [_jsx(SlidersIcon, { className: "h-4 w-4" }), activeFilterCount > 0 && showFilterCount && (_jsx(Badge, { variant: "default", className: "absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px]", children: activeFilterCount }))] }) }), _jsx(PopoverContent, { className: "w-80", align: "end", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h4", { className: "font-semibold flex items-center gap-2", children: [_jsx(FilterIcon, { className: "h-4 w-4" }), "Filters"] }), activeFilterCount > 0 && (_jsxs(Button, { variant: "ghost", size: "sm", onClick: handleClearFilters, className: "h-7 text-xs text-muted-foreground hover:text-destructive", children: [_jsx(RefreshIcon, { className: "h-3 w-3 mr-1" }), "Clear All"] }))] }), _jsxs("div", { children: [_jsxs("button", { onClick: () => toggleSection('quick'), className: "flex items-center justify-between w-full text-sm font-medium mb-2", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(SparklesIcon, { className: "h-3.5 w-3.5" }), "Quick Filters"] }), expandedSections.has('quick') ? (_jsx(ChevronUpIcon, { className: "h-4 w-4" })) : (_jsx(ChevronDownIcon, { className: "h-4 w-4" }))] }), _jsx(AnimatePresence, { children: expandedSections.has('quick') && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "overflow-hidden", children: _jsx("div", { className: "flex flex-wrap gap-1.5", children: filterPresets.map((preset) => (_jsxs(Button, { variant: isPresetActive(preset)
                                                                                    ? 'default'
                                                                                    : 'outline', size: "sm", onClick: () => applyPreset(preset), className: "h-7 text-xs gap-1", children: [preset.icon, preset.name] }, preset.id))) }) })) })] }), _jsxs("div", { children: [_jsxs("button", { onClick: () => toggleSection('role'), className: "flex items-center justify-between w-full text-sm font-medium mb-2", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(UserIcon, { className: "h-3.5 w-3.5" }), "Message Role"] }), expandedSections.has('role') ? (_jsx(ChevronUpIcon, { className: "h-4 w-4" })) : (_jsx(ChevronDownIcon, { className: "h-4 w-4" }))] }), _jsx(AnimatePresence, { children: expandedSections.has('role') && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "overflow-hidden", children: _jsx("div", { className: "flex gap-1.5", children: ['all', 'user', 'assistant', 'system'].map((role) => (_jsx(Button, { variant: (role === 'all' && !filters.role) ||
                                                                                    filters.role === role
                                                                                    ? 'default'
                                                                                    : 'outline', size: "sm", onClick: () => setFilters((prev) => ({
                                                                                    ...prev,
                                                                                    role: role === 'all' ? undefined : role,
                                                                                })), className: "h-7 text-xs flex-1", children: role === 'all'
                                                                                    ? 'All'
                                                                                    : role.charAt(0).toUpperCase() +
                                                                                        role.slice(1) }, role))) }) })) })] }), availableModels.length > 0 && (_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium mb-1 block flex items-center gap-1", children: [_jsx(SettingsIcon, { className: "h-3.5 w-3.5" }), "Model"] }), _jsxs("select", { value: filters.model || 'all', onChange: (e) => setFilters((prev) => ({
                                                                        ...prev,
                                                                        model: e.target.value === 'all'
                                                                            ? undefined
                                                                            : e.target.value,
                                                                    })), className: "w-full h-8 px-3 text-sm border rounded-md bg-background", children: [_jsx("option", { value: "all", children: "All Models" }), availableModels.map((model) => (_jsx("option", { value: model, children: model }, model)))] })] })), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium mb-1 block flex items-center gap-1", children: [_jsx(CalendarIcon, { className: "h-3.5 w-3.5" }), "Date Range"] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(Input, { type: "date", value: filters.dateRange?.start
                                                                                ? filters.dateRange.start
                                                                                    .toISOString()
                                                                                    .split('T')[0]
                                                                                : '', onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                dateRange: {
                                                                                    ...prev.dateRange,
                                                                                    start: e.target.value
                                                                                        ? new Date(e.target.value)
                                                                                        : undefined,
                                                                                },
                                                                            })), className: "h-8 text-sm" }), _jsx(Input, { type: "date", value: filters.dateRange?.end
                                                                                ? filters.dateRange.end
                                                                                    .toISOString()
                                                                                    .split('T')[0]
                                                                                : '', onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                dateRange: {
                                                                                    ...prev.dateRange,
                                                                                    end: e.target.value
                                                                                        ? new Date(e.target.value)
                                                                                        : undefined,
                                                                                },
                                                                            })), className: "h-8 text-sm" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium mb-1 block flex items-center gap-1", children: [_jsx(HashIcon, { className: "h-3.5 w-3.5" }), "Token Count"] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(Input, { type: "number", placeholder: "Min", value: filters.minTokens || '', onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                minTokens: e.target.value
                                                                                    ? parseInt(e.target.value, 10)
                                                                                    : undefined,
                                                                            })), className: "h-8 text-sm" }), _jsx(Input, { type: "number", placeholder: "Max", value: filters.maxTokens || '', onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                maxTokens: e.target.value
                                                                                    ? parseInt(e.target.value, 10)
                                                                                    : undefined,
                                                                            })), className: "h-8 text-sm" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.hasAttachments || false, onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                hasAttachments: e.target.checked
                                                                                    ? true
                                                                                    : undefined,
                                                                            })), className: "rounded" }), _jsxs("span", { className: "text-sm flex items-center gap-1", children: [_jsx(PaperclipIcon, { className: "h-3.5 w-3.5" }), "Has attachments"] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.hasErrors || false, onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                hasErrors: e.target.checked ? true : undefined,
                                                                            })), className: "rounded" }), _jsxs("span", { className: "text-sm flex items-center gap-1", children: [_jsx(AlertIcon, { className: "h-3.5 w-3.5" }), "Has errors"] })] })] })] }) })] }))] })] }), _jsx(AnimatePresence, { children: isPending && (_jsx(motion.div, { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-muted overflow-hidden rounded-b-md", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(motion.div, { className: "h-full bg-primary", initial: { x: '-100%' }, animate: { x: '100%' }, transition: {
                                    duration: durations.slower,
                                    repeat: Infinity,
                                    ease: 'linear',
                                } }) })) })] }), _jsx(AnimatePresence, { children: activeFilterCount > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "flex flex-wrap gap-1.5", children: [filters.role && (_jsxs(Badge, { variant: "secondary", className: "gap-1 pr-1", children: ["Role: ", filters.role, _jsx("button", { onClick: () => setFilters((prev) => ({ ...prev, role: undefined })), className: "ml-0.5 hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] })), filters.model && (_jsxs(Badge, { variant: "secondary", className: "gap-1 pr-1", children: ["Model: ", filters.model, _jsx("button", { onClick: () => setFilters((prev) => ({ ...prev, model: undefined })), className: "ml-0.5 hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] })), (filters.dateRange?.start || filters.dateRange?.end) && (_jsxs(Badge, { variant: "secondary", className: "gap-1 pr-1", children: ["Date: ", filters.dateRange?.start?.toLocaleDateString() || '...', ' ', "- ", filters.dateRange?.end?.toLocaleDateString() || '...', _jsx("button", { onClick: () => setFilters((prev) => ({ ...prev, dateRange: undefined })), className: "ml-0.5 hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] })), (filters.minTokens || filters.maxTokens) && (_jsxs(Badge, { variant: "secondary", className: "gap-1 pr-1", children: ["Tokens: ", filters.minTokens || 0, " - ", filters.maxTokens || '...', _jsx("button", { onClick: () => setFilters((prev) => ({
                                        ...prev,
                                        minTokens: undefined,
                                        maxTokens: undefined,
                                    })), className: "ml-0.5 hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] })), filters.hasAttachments && (_jsxs(Badge, { variant: "secondary", className: "gap-1 pr-1", children: ["Has attachments", _jsx("button", { onClick: () => setFilters((prev) => ({
                                        ...prev,
                                        hasAttachments: undefined,
                                    })), className: "ml-0.5 hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] })), filters.hasErrors && (_jsxs(Badge, { variant: "secondary", className: "gap-1 pr-1", children: ["Has errors", _jsx("button", { onClick: () => setFilters((prev) => ({ ...prev, hasErrors: undefined })), className: "ml-0.5 hover:text-destructive", children: _jsx(XIcon, { className: "h-3 w-3" }) })] }))] })) }), _jsx(AnimatePresence, { children: (filters.query || activeFilterCount > 0) && (_jsxs(motion.div, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(motion.span, { className: cn('inline-block w-2 h-2 rounded-full', finalResults.length > 0 ? 'bg-green-500' : 'bg-amber-500'), animate: isPending ? { scale: [1, 1.2, 1] } : {}, transition: {
                                        duration: durations.slower,
                                        repeat: isPending ? Infinity : 0,
                                    } }), _jsxs("span", { children: ["Found", ' ', _jsx(motion.span, { initial: { scale: 1.2 }, animate: { scale: 1 }, className: "font-semibold text-foreground", children: finalResults.length }, finalResults.length), ' ', "of ", messages.length, " messages"] }), sortOption !== 'relevance' && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["Sorted by ", sortOption] }))] }), enableExport && finalResults.length > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: handleCopyResults, className: "h-7 text-xs gap-1", children: [copied ? (_jsx(CheckIcon, { className: "h-3.5 w-3.5 text-green-500" })) : (_jsx(CopyIcon, { className: "h-3.5 w-3.5" })), copied ? 'Copied!' : 'Copy'] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs gap-1", children: [_jsx(DownloadIcon, { className: "h-3.5 w-3.5" }), "Export"] }) }), _jsx(PopoverContent, { className: "w-48 p-2", align: "end", children: _jsx("div", { className: "space-y-1", children: ['json', 'csv', 'md'].map((format) => (_jsxs("button", { onClick: () => {
                                                        setExportFormat(format);
                                                        handleExport();
                                                    }, className: "w-full px-2 py-1.5 text-sm text-left rounded hover:bg-accent flex items-center justify-between", children: ["Export as .", format, _jsx(Badge, { variant: "outline", className: "text-[10px]", children: format.toUpperCase() })] }, format))) }) })] })] }))] })) })] }));
});
AdvancedMessageSearch.displayName = 'AdvancedMessageSearch';
//# sourceMappingURL=advanced-message-search.js.map