'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SourceCard } from './SourceCard';
export function SourcesList({ sources, className, variant = 'default', collapsible = true, defaultExpanded = true, maxVisible = 5, }) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [expandedSources, setExpandedSources] = useState(new Set());
    const [showAll, setShowAll] = useState(false);
    if (sources.length === 0) {
        return null;
    }
    const toggleSource = (index) => {
        setExpandedSources(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            }
            else {
                next.add(index);
            }
            return next;
        });
    };
    const visibleSources = showAll ? sources : sources.slice(0, maxVisible);
    const hasMore = sources.length > maxVisible;
    if (variant === 'compact') {
        return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [_jsx(BookOpen, { className: "w-4 h-4" }), _jsxs("span", { children: ["Sources (", sources.length, ")"] })] }), collapsible && (_jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: cn('p-1 rounded-md', 'hover:bg-accent hover:text-accent-foreground', 'transition-colors'), "aria-label": isExpanded ? 'Collapse sources' : 'Expand sources', children: isExpanded ? (_jsx(ChevronUp, { className: "w-4 h-4" })) : (_jsx(ChevronDown, { className: "w-4 h-4" })) }))] }), _jsx(AnimatePresence, { children: isExpanded && (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "space-y-1.5 overflow-hidden", children: [visibleSources.map((source, index) => (_jsx(SourceCard, { source: source, index: index, variant: "compact" }, source.url))), hasMore && !showAll && (_jsxs("button", { onClick: () => setShowAll(true), className: cn('w-full px-3 py-2 rounded-md text-sm', 'bg-secondary/50 hover:bg-secondary', 'text-muted-foreground hover:text-foreground', 'transition-colors'), children: ["Show ", sources.length - maxVisible, " more sources"] })), showAll && hasMore && (_jsx("button", { onClick: () => setShowAll(false), className: cn('w-full px-3 py-2 rounded-md text-sm', 'bg-secondary/50 hover:bg-secondary', 'text-muted-foreground hover:text-foreground', 'transition-colors'), children: "Show less" }))] })) })] }));
    }
    // Default variant
    return (_jsxs("div", { className: cn('space-y-3', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-2 rounded-md bg-primary/10", children: _jsx(BookOpen, { className: "w-4 h-4 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold", children: "Sources" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [sources.length, " ", sources.length === 1 ? 'source' : 'sources', " referenced"] })] })] }), collapsible && (_jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: cn('px-3 py-1.5 rounded-md text-sm font-medium', 'bg-secondary hover:bg-secondary/80', 'transition-colors', 'flex items-center gap-1.5'), children: isExpanded ? (_jsxs(_Fragment, { children: [_jsx(ChevronUp, { className: "w-4 h-4" }), "Collapse"] })) : (_jsxs(_Fragment, { children: [_jsx(ChevronDown, { className: "w-4 h-4" }), "Expand"] })) }))] }), _jsx(AnimatePresence, { children: isExpanded && (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, className: "space-y-2 overflow-hidden", children: [visibleSources.map((source, index) => (_jsx(SourceCard, { source: source, index: index, expanded: expandedSources.has(index), onToggle: () => toggleSource(index) }, source.url))), hasMore && !showAll && (_jsx("button", { onClick: () => setShowAll(true), className: cn('w-full px-4 py-3 rounded-lg', 'bg-secondary/50 hover:bg-secondary', 'text-sm font-medium', 'text-muted-foreground hover:text-foreground', 'transition-all duration-200', 'border border-dashed border-border'), children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(ChevronDown, { className: "w-4 h-4" }), "Show ", sources.length - maxVisible, " more sources"] }) })), showAll && hasMore && (_jsx("button", { onClick: () => setShowAll(false), className: cn('w-full px-4 py-3 rounded-lg', 'bg-secondary/50 hover:bg-secondary', 'text-sm font-medium', 'text-muted-foreground hover:text-foreground', 'transition-all duration-200', 'border border-dashed border-border'), children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(ChevronUp, { className: "w-4 h-4" }), "Show less"] }) }))] })) }), !isExpanded && (_jsx("div", { className: "text-xs text-muted-foreground", children: "Click expand to view sources" }))] }));
}
/**
 * Inline sources display (for embedding in text)
 */
export function InlineSources({ sources, className, }) {
    if (sources.length === 0) {
        return null;
    }
    return (_jsx("div", { className: cn('inline-flex items-center gap-1 flex-wrap', className), children: sources.map((source, index) => (_jsx("a", { href: source.url, target: "_blank", rel: "noopener noreferrer", className: cn('inline-flex items-center gap-0.5', 'text-xs font-medium', 'px-1.5 py-0.5 rounded', 'bg-primary/10 text-primary', 'hover:bg-primary/20', 'transition-colors'), title: source.title, children: _jsxs("span", { children: ["[", index + 1, "]"] }) }, source.url))) }));
}
//# sourceMappingURL=SourcesList.js.map