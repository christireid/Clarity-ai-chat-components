'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileCode, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
export function TemplateSelector({ templates, selectedId, onSelect }) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);
    // Get unique categories
    const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);
    // Filter templates with debounced search
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            template.description.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    // Reset focused index when filters change
    useEffect(() => {
        setFocusedIndex(-1);
    }, [debouncedSearch, selectedCategory]);
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!filteredTemplates.length)
                return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(prev => prev < filteredTemplates.length - 1 ? prev + 1 : prev);
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
            }
            else if (e.key === 'Enter' && focusedIndex >= 0) {
                e.preventDefault();
                onSelect(filteredTemplates[focusedIndex].id);
            }
            else if (e.key === 'Escape') {
                setSearch('');
                searchInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredTemplates, focusedIndex, onSelect]);
    // Scroll focused item into view
    useEffect(() => {
        if (focusedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-template-item]');
            const focusedItem = items[focusedIndex];
            if (focusedItem) {
                focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [focusedIndex]);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(FileCode, { className: "w-5 h-5 text-brand-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Templates" })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { ref: searchInputRef, type: "text", placeholder: "Search templates...", value: search, onChange: (e) => setSearch(e.target.value), className: cn("w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg", "bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm", "focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all", "placeholder:text-gray-400"), "aria-label": "Search templates" }), _jsx(AnimatePresence, { children: search && (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, onClick: () => setSearch(''), className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", "aria-label": "Clear search", children: _jsx(X, { className: "w-4 h-4 text-gray-400" }) })) })] })] }), _jsx("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto", children: _jsx("div", { className: "flex gap-2", role: "tablist", "aria-label": "Template categories", children: categories.map((category, index) => (_jsx(motion.button, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, onClick: () => setSelectedCategory(category), className: cn("px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all", "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2", selectedCategory === category
                            ? 'bg-brand-500 text-white shadow-md scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'), role: "tab", "aria-selected": selectedCategory === category, "aria-controls": "template-list", children: category.charAt(0).toUpperCase() + category.slice(1) }, category))) }) }), _jsx("div", { ref: listRef, id: "template-list", className: "overflow-y-auto", style: { maxHeight: 'calc(100vh - 400px)' }, role: "tabpanel", children: _jsx(AnimatePresence, { mode: "wait", children: filteredTemplates.length === 0 ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "p-8 text-center", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4", children: _jsx(Search, { className: "w-8 h-8 text-gray-400" }) }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 font-medium mb-2", children: "No templates found" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-500", children: "Try adjusting your search or filters" })] }, "empty")) : (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "divide-y divide-gray-200 dark:divide-gray-700", children: filteredTemplates.map((template, index) => {
                            const isSelected = selectedId === template.id;
                            const isFocused = focusedIndex === index;
                            return (_jsxs(motion.button, { "data-template-item": true, initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.02 }, onClick: () => onSelect(template.id), onMouseEnter: () => setFocusedIndex(index), onMouseLeave: () => setFocusedIndex(-1), className: cn("w-full text-left p-4 transition-all relative", "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500", isSelected && 'bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500', !isSelected && isFocused && 'bg-gray-50 dark:bg-gray-700/50', !isSelected && !isFocused && 'hover:bg-gray-50 dark:hover:bg-gray-700/30'), "aria-selected": isSelected, "aria-label": `Select ${template.name} template`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-1", children: [_jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [isSelected && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "flex-shrink-0", children: _jsx(Sparkles, { className: "w-4 h-4 text-brand-600" }) })), _jsx("h3", { className: cn("font-medium truncate", isSelected ? "text-brand-900 dark:text-brand-100" : "text-gray-900 dark:text-white"), children: template.name })] }), _jsx("span", { className: cn("text-xs px-2 py-1 rounded flex-shrink-0", isSelected
                                                    ? "bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"), children: template.category })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2", children: template.description })] }, template.id));
                        }) }, "list")) }) }), _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, className: "p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50", children: _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("span", { className: "text-gray-500 dark:text-gray-400", children: [filteredTemplates.length, " template", filteredTemplates.length !== 1 ? 's' : '', debouncedSearch && (_jsxs("span", { className: "ml-1", children: ["for \"", debouncedSearch, "\""] }))] }), _jsxs("span", { className: "text-gray-400 dark:text-gray-500 hidden sm:block", children: [_jsx("kbd", { className: "px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700", children: "\u2191\u2193" }), ' ', "navigate \u00B7 ", _jsx("kbd", { className: "px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700", children: "Enter" }), ' ', "select"] })] }) })] }));
}
//# sourceMappingURL=TemplateSelector.js.map