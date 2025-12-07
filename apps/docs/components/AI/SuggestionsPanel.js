'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
export function SuggestionsPanel({ suggestions, onSelectSuggestion, className, variant = 'default', title = 'Suggested Questions', showIcons = true, }) {
    if (suggestions.length === 0) {
        return null;
    }
    if (variant === 'compact') {
        return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("p", { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [_jsx(Lightbulb, { className: "w-3 h-3" }), title] }), _jsx("div", { className: "flex flex-wrap gap-2", children: suggestions.map((suggestion) => (_jsxs("button", { onClick: () => onSelectSuggestion?.(suggestion), className: cn('px-3 py-1.5 rounded-full text-xs', 'bg-secondary hover:bg-secondary/80', 'text-secondary-foreground', 'transition-colors duration-200', 'flex items-center gap-1.5'), children: [showIcons && suggestion.icon && (_jsx("span", { className: "text-sm", children: suggestion.icon })), _jsx("span", { children: suggestion.question })] }, suggestion.id))) })] }));
    }
    if (variant === 'inline') {
        return (_jsx("div", { className: cn('flex flex-wrap gap-2', className), children: suggestions.map((suggestion) => (_jsxs(motion.button, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => onSelectSuggestion?.(suggestion), className: cn('group relative px-4 py-2 rounded-lg text-sm', 'bg-primary/5 hover:bg-primary/10', 'border border-primary/20 hover:border-primary/30', 'transition-all duration-200', 'flex items-center gap-2'), children: [showIcons && suggestion.icon && (_jsx("span", { className: "text-base", children: suggestion.icon })), _jsx("span", { className: "text-left", children: suggestion.question }), _jsx(ChevronRight, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" })] }, suggestion.id))) }));
    }
    // Default variant
    return (_jsxs("div", { className: cn('space-y-3', className), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-2 rounded-md bg-primary/10", children: _jsx(Lightbulb, { className: "w-4 h-4 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold", children: title }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [suggestions.length, " ", suggestions.length === 1 ? 'suggestion' : 'suggestions'] })] })] }), _jsx("div", { className: "space-y-2", children: _jsx(AnimatePresence, { mode: "popLayout", children: suggestions.map((suggestion, index) => (_jsx(SuggestionCard, { suggestion: suggestion, index: index, onSelect: onSelectSuggestion, showIcon: showIcons }, suggestion.id))) }) })] }));
}
function SuggestionCard({ suggestion, index, onSelect, showIcon = true, }) {
    const categoryColors = {
        exploration: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        clarification: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        practical: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        related: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    };
    const categoryLabels = {
        exploration: 'Explore',
        clarification: 'Clarify',
        practical: 'Practical',
        related: 'Related',
    };
    return (_jsx(motion.button, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { delay: index * 0.05 }, whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, onClick: () => onSelect?.(suggestion), className: cn('w-full group relative', 'p-4 rounded-lg', 'bg-card hover:bg-accent/50', 'border border-border hover:border-primary/30', 'transition-all duration-200', 'text-left'), children: _jsxs("div", { className: "flex items-start gap-3", children: [showIcon && suggestion.icon && (_jsx("div", { className: "text-2xl flex-shrink-0 mt-0.5", children: suggestion.icon })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium mb-1 group-hover:text-primary transition-colors", children: suggestion.question }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: cn('text-xs px-2 py-0.5 rounded-full border', categoryColors[suggestion.category]), children: categoryLabels[suggestion.category] }), suggestion.relevance > 0.8 && (_jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx("span", { className: "w-1 h-1 rounded-full bg-green-500" }), "High relevance"] }))] })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" })] }) }));
}
/**
 * Suggestion chips for quick access
 */
export function SuggestionChips({ suggestions, onSelectSuggestion, className, maxVisible = 3, }) {
    const visibleSuggestions = suggestions.slice(0, maxVisible);
    if (visibleSuggestions.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: cn('flex items-center gap-2 flex-wrap', className), children: [_jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Lightbulb, { className: "w-3 h-3" }), "Try:"] }), visibleSuggestions.map((suggestion) => (_jsxs(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => onSelectSuggestion?.(suggestion), className: cn('px-3 py-1 rounded-full text-xs font-medium', 'bg-primary/10 hover:bg-primary/20', 'text-primary', 'border border-primary/20 hover:border-primary/30', 'transition-all duration-200'), children: [suggestion.icon && _jsx("span", { className: "mr-1", children: suggestion.icon }), suggestion.question] }, suggestion.id)))] }));
}
/**
 * Floating suggestions bubble
 */
export function FloatingSuggestions({ suggestions, onSelectSuggestion, onDismiss, className, }) {
    if (suggestions.length === 0) {
        return null;
    }
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: cn('fixed bottom-4 right-4 z-50', 'max-w-sm', 'bg-popover border border-border rounded-lg shadow-lg', 'p-4', className), children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Lightbulb, { className: "w-4 h-4 text-primary" }), _jsx("span", { className: "text-sm font-semibold", children: "Quick suggestions" })] }), onDismiss && (_jsx("button", { onClick: onDismiss, className: "text-muted-foreground hover:text-foreground transition-colors", "aria-label": "Dismiss", children: _jsx("span", { className: "text-xl leading-none", children: "\u00D7" }) }))] }), _jsx("div", { className: "space-y-2", children: suggestions.slice(0, 3).map((suggestion) => (_jsxs("button", { onClick: () => onSelectSuggestion?.(suggestion), className: cn('w-full p-2 rounded-md text-left text-sm', 'hover:bg-accent', 'transition-colors', 'flex items-center gap-2'), children: [suggestion.icon && _jsx("span", { children: suggestion.icon }), _jsx("span", { className: "flex-1", children: suggestion.question }), _jsx(ChevronRight, { className: "w-3 h-3 text-muted-foreground" })] }, suggestion.id))) })] }));
}
//# sourceMappingURL=SuggestionsPanel.js.map