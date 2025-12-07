'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { ANIMATION_DURATION, ANIMATION_EASING } from '../animations/constants';
export const CommandPalette = forwardRef(({ items, open, onClose, placeholder = 'Type a command...', className }, ref) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const selectedItemRef = useRef(null);
    // Filter items based on search
    const filteredItems = useMemo(() => {
        if (!search)
            return items;
        const query = search.toLowerCase();
        return items.filter((item) => item.label.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query));
    }, [items, search]);
    // Group items by category
    const groupedItems = useMemo(() => {
        const groups = {};
        filteredItems.forEach((item) => {
            const category = item.category || 'Commands';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        });
        return groups;
    }, [filteredItems]);
    // Reset selection when filtered items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredItems]);
    // Focus input when opened
    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [open]);
    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!open)
                return;
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredItems[selectedIndex]) {
                        filteredItems[selectedIndex].onSelect();
                        onClose();
                    }
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, filteredItems, selectedIndex, onClose]);
    // Scroll selected item into view
    useEffect(() => {
        if (selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            });
        }
    }, [selectedIndex]);
    // Calculate flat index for keyboard navigation
    const flatItems = useMemo(() => {
        return Object.values(groupedItems).flat();
    }, [groupedItems]);
    return (_jsx(AnimatePresence, { children: open && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: ANIMATION_DURATION.normal / 1000 }, onClick: onClose, className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal-backdrop)]" }), _jsxs(motion.div, { ref: ref, initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, transition: {
                        duration: ANIMATION_DURATION.normal / 1000,
                        ease: ANIMATION_EASING.out,
                    }, className: cn('fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4', 'bg-card border shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),0_8px_10px_-6px_rgb(0_0_0_/_0.1)] rounded-lg z-[var(--z-modal)]', 'flex flex-col max-h-[60vh] overflow-hidden', className), children: [_jsx("div", { className: "relative p-4 border-b", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("svg", { className: "h-5 w-5 text-muted-foreground shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx(motion.input, { ref: inputRef, type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: placeholder, initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, className: cn('flex-1 px-0 py-2 text-base bg-transparent', 'border-none outline-none placeholder:text-muted-foreground', 'focus:ring-0') }), search && (_jsx(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, onClick: () => setSearch(''), className: "flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted transition-colors", "aria-label": "Clear search", children: _jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }) }), _jsx("div", { className: "overflow-y-auto flex-1 p-2", children: filteredItems.length === 0 ? (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "py-12 text-center", children: [_jsx("svg", { className: "mx-auto h-12 w-12 text-muted-foreground/40 mb-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: "No commands found" }), _jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: "Try a different search term" })] })) : (_jsx("div", { className: "space-y-4", children: Object.entries(groupedItems).map(([category, categoryItems], groupIndex) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: groupIndex * 0.05 }, children: [_jsx("div", { className: "px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: category }), _jsx("div", { className: "space-y-1", children: categoryItems.map((item) => {
                                                // Calculate global index
                                                const globalIndex = flatItems.indexOf(item);
                                                const isSelected = globalIndex === selectedIndex;
                                                return (_jsxs(motion.button, { ref: isSelected ? selectedItemRef : null, onClick: () => {
                                                        item.onSelect();
                                                        onClose();
                                                    }, onMouseEnter: () => setSelectedIndex(globalIndex), whileHover: { x: 4 }, whileTap: { scale: 0.98 }, className: cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'transition-all duration-150 text-left', isSelected
                                                        ? 'bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(15,23,42,0.15)]'
                                                        : 'hover:bg-accent'), children: [item.icon && (_jsx(motion.div, { animate: isSelected ? { scale: [1, 1.2, 1] } : {}, transition: { duration: 0.3 }, className: "flex-shrink-0", children: item.icon })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: item.label }), item.description && (_jsx("div", { className: cn('text-sm truncate', isSelected
                                                                        ? 'text-primary-foreground/70'
                                                                        : 'text-muted-foreground'), children: item.description }))] }), item.shortcut && (_jsx("div", { className: "flex gap-1 flex-shrink-0", children: item.shortcut.map((key, i) => (_jsx("kbd", { className: cn('px-2 py-1 text-xs font-mono rounded border', isSelected
                                                                    ? 'bg-primary-foreground/20 border-primary-foreground/30'
                                                                    : 'bg-muted border-border'), children: key }, i))) }))] }, item.id));
                                            }) })] }, category))) })) }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, className: "px-4 py-3 border-t text-xs text-muted-foreground flex items-center justify-between bg-muted/50", children: [_jsxs("div", { className: "flex gap-3 sm:gap-4", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("kbd", { className: "px-2 py-1 bg-background border border-border/60 rounded-md text-xs font-mono shadow-[0_1px_2px_rgba(15,23,42,0.08)]", children: "\u2191\u2193" }), _jsx("span", { className: "hidden sm:inline", children: "Navigate" })] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("kbd", { className: "px-2 py-1 bg-background border border-border/60 rounded-md text-xs font-mono shadow-[0_1px_2px_rgba(15,23,42,0.08)]", children: "\u21B5" }), _jsx("span", { className: "hidden sm:inline", children: "Select" })] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("kbd", { className: "px-2 py-1 bg-background border border-border/60 rounded-md text-xs font-mono shadow-[0_1px_2px_rgba(15,23,42,0.08)]", children: "Esc" }), _jsx("span", { className: "hidden sm:inline", children: "Close" })] })] }), _jsxs("div", { className: "font-medium", children: [filteredItems.length, " ", filteredItems.length === 1 ? 'command' : 'commands'] })] })] })] })) }));
});
CommandPalette.displayName = 'CommandPalette';
//# sourceMappingURL=command-palette.js.map