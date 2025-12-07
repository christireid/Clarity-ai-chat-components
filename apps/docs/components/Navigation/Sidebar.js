'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
function NavGroup({ item, level = 0 }) {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const hasChildren = item.items && item.items.length > 0;
    const isActive = pathname === item.href;
    const isParentActive = item.items?.some((child) => pathname === child.href);
    // Auto-open parent if child is active
    useEffect(() => {
        if (isParentActive && !isOpen) {
            setIsOpen(true);
        }
    }, [isParentActive, isOpen]);
    if (!hasChildren && item.href) {
        // Leaf node (link) with animations
        return (_jsx(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.2 }, children: _jsx(Link, { href: item.href, className: clsx('block px-3 py-2 rounded-lg text-sm transition-all', 'hover:scale-[1.02] active:scale-[0.98]', level === 0 && 'font-medium', level > 0 && 'ml-4', isActive
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'), children: item.title }) }));
    }
    // Group node (collapsible) with animations
    return (_jsxs("div", { children: [item.href ? (_jsxs(Link, { href: item.href, className: clsx('flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all', 'hover:scale-[1.01] active:scale-[0.99]', level === 0 && 'font-semibold', level > 0 && 'ml-4', isActive || isParentActive
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10'
                    : 'text-text-primary hover:bg-bg-secondary'), children: [_jsx("span", { children: item.title }), hasChildren && (_jsx(motion.button, { onClick: (e) => {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        }, className: "p-1 hover:bg-bg-tertiary rounded transition-colors", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, "aria-label": isOpen ? 'Collapse section' : 'Expand section', "aria-expanded": isOpen, children: _jsx(motion.div, { animate: { rotate: isOpen ? 0 : -90 }, transition: { duration: 0.2 }, children: _jsx(ChevronDown, { className: "w-4 h-4" }) }) }))] })) : (_jsxs(motion.button, { onClick: () => setIsOpen(!isOpen), className: clsx('flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all text-left', 'hover:scale-[1.01] active:scale-[0.99]', level === 0 && 'font-semibold', level > 0 && 'ml-4', isParentActive
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/10'
                    : 'text-text-primary hover:bg-bg-secondary'), whileHover: { x: 2 }, "aria-label": `${item.title} section`, "aria-expanded": isOpen, children: [_jsx("span", { children: item.title }), _jsx(motion.div, { animate: { rotate: isOpen ? 0 : -90 }, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }, children: _jsx(ChevronDown, { className: "w-4 h-4" }) })] })), _jsx(AnimatePresence, { initial: false, children: isOpen && hasChildren && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }, className: "overflow-hidden", children: _jsx("div", { className: "mt-1 space-y-1", children: item.items.map((child, index) => (_jsx(motion.div, { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.03, duration: 0.2 }, children: _jsx(NavGroup, { item: child, level: level + 1 }) }, index))) }) })) })] }));
}
export function Sidebar({ navigation }) {
    return (_jsx("nav", { className: "space-y-1", "aria-label": "Documentation navigation", children: navigation.map((item, index) => (_jsx(NavGroup, { item: item }, index))) }));
}
//# sourceMappingURL=Sidebar.js.map