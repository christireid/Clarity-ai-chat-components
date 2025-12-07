'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ExternalLink, ChevronDown, BookOpen, FileText, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function SourceCard({ source, index, expanded = false, onToggle, className, variant = 'default', }) {
    const [isHovered, setIsHovered] = useState(false);
    // Get icon based on source type
    const Icon = getSourceIcon(source.type);
    // Get relevance label
    const relevanceLabel = source.score ? getRelevanceLabel(source.score) : null;
    const relevanceColor = source.score ? getRelevanceColor(source.score) : null;
    if (variant === 'compact') {
        return (_jsxs(motion.a, { href: source.url, target: "_blank", rel: "noopener noreferrer", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: index ? index * 0.05 : 0 }, whileHover: { scale: 1.02, x: 4 }, whileTap: { scale: 0.98 }, className: cn('flex items-center gap-2 px-3 py-2 rounded-md', 'bg-secondary/50 hover:bg-secondary', 'transition-all duration-200', 'group', className), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx(motion.div, { whileHover: { scale: 1.1, rotate: 5 }, transition: { type: 'spring', stiffness: 300, damping: 15 }, children: _jsx(Icon, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }) }), _jsx("span", { className: "text-sm truncate flex-1", children: source.title }), source.score && (_jsxs(motion.span, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2 }, className: cn('text-xs font-medium px-2 py-0.5 rounded', relevanceColor), children: [Math.round(source.score * 100), "%"] })), _jsx(motion.div, { whileHover: { x: 2 }, transition: { duration: 0.2 }, children: _jsx(ExternalLink, { className: "w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" }) })] }));
    }
    // Default variant
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index ? index * 0.05 : 0 }, whileHover: { y: -4, scale: 1.01 }, className: cn('rounded-lg border border-border bg-card overflow-hidden', 'transition-all duration-200', isHovered && 'shadow-md', className), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsxs("div", { className: "flex items-start gap-3 p-4", children: [_jsx(motion.div, { whileHover: { scale: 1.1, rotate: 5 }, transition: { type: 'spring', stiffness: 300, damping: 15 }, className: cn('p-2 rounded-md', 'bg-primary/10 text-primary', 'flex-shrink-0'), children: _jsx(Icon, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("a", { href: source.url, target: "_blank", rel: "noopener noreferrer", className: cn('text-sm font-medium hover:underline', 'flex items-center gap-1.5 group'), children: [_jsx("span", { className: "truncate", children: source.title }), _jsx(ExternalLink, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" })] }), index !== undefined && (_jsxs("span", { className: "text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0", children: ["#", index + 1] }))] }), _jsx("div", { className: "text-xs text-muted-foreground truncate mt-1", children: source.url }), source.score && (_jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx("div", { className: "flex-1 h-1.5 bg-muted rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${source.score * 100}%` }, transition: { duration: 0.5, delay: 0.1 }, className: cn('h-full', relevanceColor) }) }), _jsx("span", { className: cn('text-xs font-medium px-2 py-0.5 rounded', relevanceColor), children: relevanceLabel })] }))] }), source.snippet && onToggle && (_jsx(motion.button, { onClick: onToggle, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: cn('p-1.5 rounded-md', 'hover:bg-accent hover:text-accent-foreground', 'transition-colors flex-shrink-0'), "aria-label": expanded ? 'Collapse' : 'Expand', children: _jsx(motion.div, { animate: { rotate: expanded ? 180 : 0 }, transition: { duration: 0.2 }, children: _jsx(ChevronDown, { className: "w-4 h-4" }) }) }))] }), _jsx(AnimatePresence, { children: expanded && source.snippet && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden", children: _jsx("div", { className: "px-4 pb-4 pt-0", children: _jsx("div", { className: "text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border-l-2 border-primary", children: source.snippet }) }) })) })] }));
}
/**
 * Get icon based on source type
 */
function getSourceIcon(type) {
    switch (type) {
        case 'documentation':
            return BookOpen;
        case 'guide':
            return FileText;
        case 'api':
            return FileText;
        case 'example':
            return FileText;
        default:
            return LinkIcon;
    }
}
/**
 * Get relevance label from score
 */
function getRelevanceLabel(score) {
    if (score >= 0.9)
        return 'Excellent';
    if (score >= 0.8)
        return 'Very Good';
    if (score >= 0.7)
        return 'Good';
    if (score >= 0.6)
        return 'Fair';
    return 'Low';
}
/**
 * Get color class for relevance score
 */
function getRelevanceColor(score) {
    if (score >= 0.9)
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
    if (score >= 0.8)
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
    if (score >= 0.7)
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
    if (score >= 0.6)
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
    return 'bg-red-500/20 text-red-700 dark:text-red-300';
}
//# sourceMappingURL=SourceCard.js.map