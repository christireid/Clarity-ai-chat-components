'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardContent, Badge, cn, } from '@clarity-chat/primitives';
/**
 * PromptSuggestions Component
 *
 * Displays context-aware prompt suggestions based on conversation state.
 * Supports starter prompts, follow-ups, quick replies, and templates.
 *
 * Features:
 * - Context-aware suggestions based on conversation history
 * - Animated, accessible UI
 * - Multiple layout options
 * - Category grouping
 * - Confidence-based sorting
 *
 * @example
 * ```tsx
 * <PromptSuggestions
 *   suggestions={suggestions}
 *   onSelect={(suggestion) => sendMessage(suggestion.text)}
 *   messages={messages}
 *   suggestionType="follow-up"
 *   layout="chips"
 * />
 * ```
 */
export function PromptSuggestions({ suggestions, onSelect, messages: _messages = [], suggestionType = 'starter', layout = 'chips', isLoading = false, maxSuggestions = 6, emptyState, showCategories = false, className, }) {
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    // Filter and sort suggestions
    const processedSuggestions = React.useMemo(() => {
        let filtered = suggestions;
        // Filter by type
        if (suggestionType) {
            filtered = filtered.filter((s) => s.type === suggestionType);
        }
        // Filter by category if needed
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((s) => s.category === selectedCategory);
        }
        // Sort by confidence (for context-aware) or usage count
        filtered = [...filtered].sort((a, b) => {
            if (suggestionType === 'follow-up' && a.confidence && b.confidence) {
                return b.confidence - a.confidence;
            }
            if (a.usageCount && b.usageCount) {
                return b.usageCount - a.usageCount;
            }
            return 0;
        });
        // Limit results
        return filtered.slice(0, maxSuggestions);
    }, [suggestions, suggestionType, selectedCategory, maxSuggestions]);
    // Extract unique categories
    const categories = React.useMemo(() => {
        const cats = new Set();
        suggestions.forEach((s) => {
            if (s.category)
                cats.add(s.category);
        });
        return Array.from(cats);
    }, [suggestions]);
    // Loading skeleton
    if (isLoading) {
        return (_jsx("div", { className: cn('flex flex-wrap gap-2.5', className), children: Array.from({ length: maxSuggestions }).map((_, i) => (_jsx("div", { className: "h-9 w-28 animate-pulse rounded-full bg-muted/60" }, i))) }));
    }
    // Empty state
    if (processedSuggestions.length === 0) {
        if (emptyState) {
            return _jsx(_Fragment, { children: emptyState });
        }
        return null;
    }
    // Render chips layout
    if (layout === 'chips') {
        return (_jsxs("div", { className: cn('space-y-3.5', className), children: [showCategories && categories.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-2.5", children: [_jsx(Button, { variant: selectedCategory === 'all' ? 'default' : 'outline', size: "sm", onClick: () => setSelectedCategory('all'), children: "All" }), categories.map((cat) => (_jsx(Button, { variant: selectedCategory === cat ? 'default' : 'outline', size: "sm", onClick: () => setSelectedCategory(cat), children: cat }, cat)))] })), _jsx("div", { className: "flex flex-wrap gap-2.5", children: _jsx(AnimatePresence, { mode: "popLayout", children: processedSuggestions.map((suggestion, index) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.9, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: -10 }, transition: {
                                duration: 0.25,
                                delay: index * 0.05,
                                ease: [0.25, 0.1, 0.25, 1],
                            }, children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => onSelect(suggestion), className: cn('group relative rounded-full', 'hover:bg-primary hover:text-primary-foreground hover:border-primary', 'transition-all duration-200 ease-out', 'hover:shadow-md hover:-translate-y-[1px]'), "aria-label": suggestion.label || suggestion.text, children: [suggestion.icon && (_jsx("span", { className: "mr-2", children: suggestion.icon })), _jsx("span", { children: suggestion.label || suggestion.text }), suggestion.confidence !== undefined && (_jsxs(Badge, { variant: "secondary", className: "ml-2 text-xs", children: [Math.round(suggestion.confidence * 100), "%"] }))] }) }, suggestion.id))) }) })] }));
    }
    // Render cards layout
    if (layout === 'cards') {
        return (_jsx("div", { className: cn('grid grid-cols-1 md:grid-cols-2 gap-3.5', className), children: _jsx(AnimatePresence, { mode: "popLayout", children: processedSuggestions.map((suggestion, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -10, scale: 0.96 }, transition: {
                        duration: 0.25,
                        delay: index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1],
                    }, children: _jsx(Card, { hoverable: true, className: cn('cursor-pointer transition-all duration-200 ease-out', 'hover:shadow-lg hover:border-primary/50', 'hover:-translate-y-[2px]', 'group'), onClick: () => onSelect(suggestion), children: _jsx(CardContent, { className: "px-4 py-3.5", children: _jsxs("div", { className: "flex items-start gap-3", children: [suggestion.icon && (_jsx(motion.div, { className: "flex-shrink-0 text-primary", whileHover: { scale: 1.1, rotate: 5 }, transition: { type: 'spring', stiffness: 400, damping: 25 }, children: suggestion.icon })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-semibold text-sm mb-1.5 text-foreground group-hover:text-primary transition-colors duration-200", children: suggestion.label || suggestion.text }), suggestion.description && (_jsx("p", { className: "text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed", children: suggestion.description })), suggestion.confidence !== undefined && (_jsxs(Badge, { variant: "secondary", className: "mt-2 text-xs", children: [Math.round(suggestion.confidence * 100), "% match"] }))] })] }) }) }) }, suggestion.id))) }) }));
    }
    // Render list layout
    return (_jsx("div", { className: cn('space-y-2.5', className), children: _jsx(AnimatePresence, { mode: "popLayout", children: processedSuggestions.map((suggestion, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -10, scale: 0.98 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 10, scale: 0.98 }, transition: {
                    duration: 0.2,
                    delay: index * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                }, children: _jsxs(Button, { variant: "ghost", className: cn('w-full justify-start text-left', 'hover:bg-accent/50'), onClick: () => onSelect(suggestion), children: [suggestion.icon && (_jsx("span", { className: "mr-2.5", children: suggestion.icon })), _jsxs("div", { className: "flex-1 text-left", children: [_jsx("div", { className: "font-semibold text-sm", children: suggestion.label || suggestion.text }), suggestion.description && (_jsx("div", { className: "text-xs text-muted-foreground/90 mt-0.5", children: suggestion.description }))] })] }) }, suggestion.id))) }) }));
}
/**
 * Hook to generate context-aware prompt suggestions
 */
export function usePromptSuggestions(messages, options) {
    const { maxSuggestions = 6, suggestionType = 'follow-up' } = options || {};
    const suggestions = React.useMemo(() => {
        if (messages.length === 0) {
            // Return starter prompts for empty conversations
            return [
                {
                    id: 'starter-1',
                    text: 'Help me get started',
                    label: 'Get Started',
                    type: 'starter',
                    description: 'Begin a new conversation',
                },
                {
                    id: 'starter-2',
                    text: 'What can you help me with?',
                    label: 'Capabilities',
                    type: 'starter',
                    description: 'Learn about available features',
                },
            ];
        }
        // Generate context-aware follow-ups based on last message
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage)
            return [];
        const lastContent = lastMessage.content.toLowerCase();
        const followUps = [];
        // Example: If last message is about code, suggest code-related follow-ups
        if (lastContent.includes('code') || lastContent.includes('function')) {
            followUps.push({
                id: 'follow-up-code-1',
                text: 'Can you explain this in more detail?',
                label: 'Explain More',
                type: 'follow-up',
                confidence: 0.8,
                keywords: ['code', 'explain'],
            });
            followUps.push({
                id: 'follow-up-code-2',
                text: 'Show me an example',
                label: 'Show Example',
                type: 'follow-up',
                confidence: 0.75,
                keywords: ['code', 'example'],
            });
        }
        // Add generic follow-ups
        followUps.push({
            id: 'follow-up-generic-1',
            text: 'Tell me more',
            label: 'More Info',
            type: 'follow-up',
            confidence: 0.6,
        });
        return followUps.slice(0, maxSuggestions);
    }, [messages, maxSuggestions]);
    return suggestions;
}
//# sourceMappingURL=prompt-suggestions.js.map