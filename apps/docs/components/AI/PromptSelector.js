'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PROMPT_TEMPLATES, getDefaultPromptTemplate, } from '@/lib/ai/promptTemplates';
const STORAGE_KEY = 'clarity-docs-prompt-mode';
export function PromptSelector({ value, onChange, className, variant = 'dropdown', }) {
    const [selectedId, setSelectedId] = useState(value || getDefaultPromptTemplate().id);
    const [showMenu, setShowMenu] = useState(false);
    // Load saved preference on mount
    useEffect(() => {
        if (!value) {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setSelectedId(saved);
                onChange?.(saved);
            }
        }
    }, [value, onChange]);
    const handleSelect = (templateId) => {
        setSelectedId(templateId);
        localStorage.setItem(STORAGE_KEY, templateId);
        onChange?.(templateId);
        setShowMenu(false);
    };
    const selectedTemplate = PROMPT_TEMPLATES.find(t => t.id === selectedId) || PROMPT_TEMPLATES[0];
    if (variant === 'tabs') {
        return (_jsxs("div", { className: cn('space-y-3', className), children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [_jsx(Sparkles, { className: "w-4 h-4" }), _jsx("span", { children: "AI Mode" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: PROMPT_TEMPLATES.map(template => {
                        const isSelected = template.id === selectedId;
                        return (_jsxs("button", { onClick: () => handleSelect(template.id), className: cn('px-3 py-2 rounded-lg text-sm font-medium', 'transition-all duration-200', 'flex items-center gap-2', isSelected
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'), children: [_jsx("span", { children: template.emoji }), _jsx("span", { children: template.name }), isSelected && _jsx(Check, { className: "w-3 h-3" })] }, template.id));
                    }) }), _jsx("p", { className: "text-xs text-muted-foreground", children: selectedTemplate.description })] }));
    }
    if (variant === 'cards') {
        return (_jsxs("div", { className: cn('space-y-3', className), children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Sparkles, { className: "w-4 h-4 text-primary" }), _jsx("span", { children: "Choose Your AI Assistant Mode" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: PROMPT_TEMPLATES.map(template => {
                        const isSelected = template.id === selectedId;
                        return (_jsxs("button", { onClick: () => handleSelect(template.id), className: cn('p-4 rounded-lg text-left', 'transition-all duration-200', 'border-2', isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-card hover:border-primary/50'), children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("span", { className: "text-2xl", children: template.emoji }), isSelected && (_jsx("div", { className: "p-1 rounded-full bg-primary text-primary-foreground", children: _jsx(Check, { className: "w-3 h-3" }) }))] }), _jsx("h3", { className: "font-semibold text-sm mb-1", children: template.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: template.description }), _jsx("div", { className: "flex flex-wrap gap-1 mt-3", children: template.tags.slice(0, 2).map(tag => (_jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground", children: tag }, tag))) })] }, template.id));
                    }) })] }));
    }
    // Default: dropdown variant
    return (_jsxs("div", { className: cn('relative', className), children: [_jsxs("button", { onClick: () => setShowMenu(!showMenu), className: cn('flex items-center gap-2 px-3 py-2 rounded-md', 'bg-secondary hover:bg-secondary/80', 'transition-colors text-sm font-medium', 'min-w-[200px] justify-between'), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: selectedTemplate.emoji }), _jsx("span", { children: selectedTemplate.name })] }), _jsx(Sparkles, { className: "w-4 h-4 text-muted-foreground" })] }), _jsx(AnimatePresence, { children: showMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowMenu(false) }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: -10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -10 }, className: cn('absolute left-0 top-full mt-2 z-50', 'bg-popover border border-border rounded-lg shadow-lg', 'min-w-[320px] max-w-[400px] p-2'), children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground px-2 py-1 mb-1", children: "Select AI Mode" }), _jsx("div", { className: "space-y-1", children: PROMPT_TEMPLATES.map(template => {
                                        const isSelected = template.id === selectedId;
                                        return (_jsxs("button", { onClick: () => handleSelect(template.id), className: cn('w-full px-3 py-2 rounded-md text-left', 'transition-colors', 'flex items-start gap-3', isSelected
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-accent hover:text-accent-foreground'), children: [_jsx("span", { className: "text-xl flex-shrink-0", children: template.emoji }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [_jsx("span", { className: "font-medium text-sm", children: template.name }), isSelected && _jsx(Check, { className: "w-3 h-3 flex-shrink-0" })] }), _jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: template.description }), _jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: template.tags.slice(0, 3).map(tag => (_jsx("span", { className: cn('text-xs px-1.5 py-0.5 rounded', isSelected
                                                                    ? 'bg-primary/20 text-primary'
                                                                    : 'bg-secondary text-secondary-foreground'), children: tag }, tag))) })] })] }, template.id));
                                    }) }), _jsx("div", { className: "border-t border-border mt-2 pt-2 px-2", children: _jsx("p", { className: "text-xs text-muted-foreground", children: "Your preference is saved locally" }) })] })] })) })] }));
}
/**
 * Compact mode selector (for toolbar)
 */
export function CompactPromptSelector({ value, onChange, className, }) {
    return (_jsx(PromptSelector, { value: value, onChange: onChange, className: className, variant: "dropdown" }));
}
/**
 * Get current selected prompt template from localStorage
 */
export function useSelectedPrompt() {
    const [template, setTemplate] = useState(getDefaultPromptTemplate());
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const found = PROMPT_TEMPLATES.find(t => t.id === saved);
            if (found)
                setTemplate(found);
        }
    }, []);
    const setPromptById = (id) => {
        const found = PROMPT_TEMPLATES.find(t => t.id === id);
        if (found) {
            setTemplate(found);
            localStorage.setItem(STORAGE_KEY, id);
        }
    };
    return [template, setPromptById];
}
//# sourceMappingURL=PromptSelector.js.map