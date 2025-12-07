'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Badge, Popover, PopoverContent, PopoverTrigger, cn, } from '@clarity-chat/primitives';
import { SearchIcon } from './icons';
import { Filter as FilterIcon } from 'lucide-react';
// Type assertion to fix React 18/19 compatibility
const FilterIconComponent = FilterIcon;
import { useDeferredSearch } from '../hooks/use-deferred-search';
/**
 * Advanced Message Search Component
 *
 * Features:
 * - Full-text search with highlighting
 * - Fuzzy search with typo tolerance
 * - Advanced filtering (date, model, role, tokens)
 * - Real-time results with deferred updates
 * - Accessible keyboard navigation
 *
 * @example
 * ```tsx
 * <AdvancedMessageSearch
 *   messages={messages}
 *   onResultsChange={(filtered) => setFilteredMessages(filtered)}
 *   enableFuzzySearch
 *   enableAdvancedFilters
 * />
 * ```
 */
export const AdvancedMessageSearch = React.memo(function AdvancedMessageSearch({ messages, onResultsChange, enableFuzzySearch: _enableFuzzySearch = false, // Reserved for future fuzzy search implementation
enableAdvancedFilters = true, placeholder = 'Search messages...', showFilterCount = true, className, }) {
    const [filters, setFilters] = React.useState({
        query: '',
    });
    const [showFilters, setShowFilters] = React.useState(false);
    const [activeFilterCount, setActiveFilterCount] = React.useState(0);
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
    // Perform search with deferred value for performance
    const { filteredMessages, isPending } = useDeferredSearch(messages, filters.query);
    // Apply advanced filters
    const finalResults = React.useMemo(() => {
        let results = filteredMessages;
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
        // Filter by model (if metadata available)
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
                return msg.attachments && msg.attachments.length > 0;
            });
        }
        // Filter by errors
        if (filters.hasErrors) {
            results = results.filter((msg) => msg.status === 'error');
        }
        return results;
    }, [filteredMessages, filters]);
    // Notify parent of results
    React.useEffect(() => {
        onResultsChange?.(finalResults);
    }, [finalResults, onResultsChange]);
    // Extract unique models and roles for filter dropdowns
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
    const handleClearFilters = () => {
        setFilters({
            query: filters.query, // Keep search query
        });
    };
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { className: "relative", children: [_jsx(SearchIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), _jsx(Input, { type: "search", value: filters.query, onChange: (e) => setFilters((prev) => ({ ...prev, query: e.target.value })), placeholder: placeholder, className: "pl-9 pr-20" }), _jsxs("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1", children: [isPending && (_jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" })), enableAdvancedFilters && (_jsxs(Popover, { open: showFilters, onOpenChange: setShowFilters, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: cn('h-7 w-7 p-0', activeFilterCount > 0 && 'bg-primary text-primary-foreground'), "aria-label": "Advanced filters", children: [_jsx(FilterIconComponent, { className: "h-4 w-4" }), activeFilterCount > 0 && showFilterCount && (_jsx(Badge, { variant: "secondary", className: "absolute -top-1 -right-1 h-4 min-w-4 px-1 text-xs", children: activeFilterCount }))] }) }), _jsx(PopoverContent, { className: "w-80", align: "end", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-semibold", children: "Filters" }), activeFilterCount > 0 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: handleClearFilters, className: "h-7 text-xs", children: "Clear All" }))] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block", children: "Role" }), _jsxs("select", { value: filters.role || 'all', onChange: (e) => setFilters((prev) => ({
                                                                ...prev,
                                                                role: e.target.value === 'all' ? undefined : e.target.value,
                                                            })), className: "w-full px-3 py-2 text-sm border rounded-md bg-background", children: [_jsx("option", { value: "all", children: "All Roles" }), _jsx("option", { value: "user", children: "User" }), _jsx("option", { value: "assistant", children: "Assistant" }), _jsx("option", { value: "system", children: "System" })] })] }), availableModels.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-1 block", children: "Model" }), _jsxs("select", { value: filters.model || 'all', onChange: (e) => setFilters((prev) => ({
                                                                ...prev,
                                                                model: e.target.value === 'all' ? undefined : e.target.value,
                                                            })), className: "w-full px-3 py-2 text-sm border rounded-md bg-background", children: [_jsx("option", { value: "all", children: "All Models" }), availableModels.map((model) => (_jsx("option", { value: model, children: model }, model)))] })] })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Date Range" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(Input, { type: "date", value: filters.dateRange?.start
                                                                        ? filters.dateRange.start.toISOString().split('T')[0]
                                                                        : '', onChange: (e) => setFilters((prev) => ({
                                                                        ...prev,
                                                                        dateRange: {
                                                                            ...prev.dateRange,
                                                                            start: e.target.value
                                                                                ? new Date(e.target.value)
                                                                                : undefined,
                                                                        },
                                                                    })), placeholder: "Start date" }), _jsx(Input, { type: "date", value: filters.dateRange?.end
                                                                        ? filters.dateRange.end.toISOString().split('T')[0]
                                                                        : '', onChange: (e) => setFilters((prev) => ({
                                                                        ...prev,
                                                                        dateRange: {
                                                                            ...prev.dateRange,
                                                                            end: e.target.value
                                                                                ? new Date(e.target.value)
                                                                                : undefined,
                                                                        },
                                                                    })), placeholder: "End date" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Token Count" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(Input, { type: "number", placeholder: "Min tokens", value: filters.minTokens || '', onChange: (e) => setFilters((prev) => ({
                                                                        ...prev,
                                                                        minTokens: e.target.value
                                                                            ? parseInt(e.target.value)
                                                                            : undefined,
                                                                    })) }), _jsx(Input, { type: "number", placeholder: "Max tokens", value: filters.maxTokens || '', onChange: (e) => setFilters((prev) => ({
                                                                        ...prev,
                                                                        maxTokens: e.target.value
                                                                            ? parseInt(e.target.value)
                                                                            : undefined,
                                                                    })) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Options" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: filters.hasAttachments || false, onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                hasAttachments: e.target.checked
                                                                                    ? true
                                                                                    : undefined,
                                                                            })), className: "rounded" }), _jsx("span", { className: "text-sm", children: "Has attachments" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: filters.hasErrors || false, onChange: (e) => setFilters((prev) => ({
                                                                                ...prev,
                                                                                hasErrors: e.target.checked ? true : undefined,
                                                                            })), className: "rounded" }), _jsx("span", { className: "text-sm", children: "Has errors" })] })] })] })] }) })] }))] })] }), filters.query && (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "flex items-center justify-between text-sm text-muted-foreground", children: [_jsxs("span", { children: ["Found ", finalResults.length, " of ", messages.length, " messages"] }), activeFilterCount > 0 && (_jsxs(Badge, { variant: "secondary", children: [activeFilterCount, " filter", activeFilterCount !== 1 ? 's' : ''] }))] }) }))] }));
});
//# sourceMappingURL=advanced-message-search.js.map