'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Monitor, Search, ExternalLink, BookOpen } from 'lucide-react';
import { SearchDialog } from './SearchDialog';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
const navigation = [
    { name: 'Learn', href: '/learn/quick-start' },
    { name: 'Docs', href: '/guides' },
    { name: 'Reference', href: '/reference/components' },
    { name: 'Cookbook', href: '/cookbook' },
    { name: 'Examples', href: '/examples' },
];
export function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    useEffect(() => {
        setMounted(true);
    }, []);
    // Handle keyboard shortcut for search (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    const cycleTheme = () => {
        if (theme === 'light')
            setTheme('dark');
        else if (theme === 'dark')
            setTheme('system');
        else
            setTheme('light');
    };
    const getThemeIcon = () => {
        if (!mounted)
            return _jsx(Monitor, { className: "w-5 h-5" });
        if (theme === 'light')
            return _jsx(Sun, { className: "w-5 h-5" });
        if (theme === 'dark')
            return _jsx(Moon, { className: "w-5 h-5" });
        return _jsx(Monitor, { className: "w-5 h-5" });
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-bg-primary/80 backdrop-blur-xl", children: _jsxs("nav", { className: "container-docs", "aria-label": "Main navigation", children: [_jsxs("div", { className: "flex h-16 items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs(Link, { href: "/", className: "group flex items-center gap-2 font-bold text-xl", children: [_jsx(motion.div, { whileHover: { rotate: 15, scale: 1.1 }, transition: { type: 'spring', stiffness: 300, damping: 15 }, children: _jsx(BookOpen, { className: "w-6 h-6 text-brand-500" }) }), _jsx("span", { className: "group-hover:text-brand-500 transition-colors", children: "Clarity Chat" })] }), _jsx("div", { className: "hidden md:flex items-center gap-1", children: navigation.map((item, index) => (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.05 }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Link, { href: item.href, className: clsx('relative px-4 py-2 rounded-lg text-sm font-medium transition-colors', pathname?.startsWith(item.href)
                                                        ? 'bg-bg-tertiary text-brand-500'
                                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'), children: [item.name, !pathname?.startsWith(item.href) && (_jsx(motion.span, { className: "absolute bottom-1 left-4 right-4 h-0.5 bg-brand-500", initial: { scaleX: 0 }, whileHover: { scaleX: 1 }, transition: { duration: 0.2 } }))] }) }, item.name))) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(motion.button, { onClick: () => setSearchOpen(true), whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-secondary hover:bg-bg-tertiary transition-colors text-sm text-text-secondary hover:shadow-sm", "aria-label": "Search documentation", children: [_jsx(Search, { className: "w-4 h-4" }), _jsx("span", { children: "Search" }), _jsxs("kbd", { className: "hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-bg-primary px-1.5 font-mono text-xs", children: [_jsx("span", { className: "text-xs", children: "\u2318" }), "K"] })] }), _jsx(motion.button, { onClick: () => setSearchOpen(true), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "sm:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "Search", children: _jsx(Search, { className: "w-5 h-5" }) }), _jsx(motion.button, { onClick: cycleTheme, whileHover: { scale: 1.1, rotate: 15 }, whileTap: { scale: 0.9 }, className: "p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "Cycle through themes: light, dark, and system", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { rotate: -90, opacity: 0 }, animate: { rotate: 0, opacity: 1 }, exit: { rotate: 90, opacity: 0 }, transition: { duration: 0.2 }, children: getThemeIcon() }, theme) }) }), _jsx(motion.a, { href: "https://github.com/christireid/Clarity-ai-chat-components", target: "_blank", rel: "noopener noreferrer", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "View on GitHub", children: _jsx(ExternalLink, { className: "w-5 h-5" }) }), _jsx(motion.button, { onClick: () => setMobileMenuOpen(!mobileMenuOpen), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "Toggle mobile menu", children: _jsx(AnimatePresence, { mode: "wait", children: mobileMenuOpen ? (_jsx(motion.div, { initial: { rotate: -90, opacity: 0 }, animate: { rotate: 0, opacity: 1 }, exit: { rotate: 90, opacity: 0 }, transition: { duration: 0.2 }, children: _jsx(X, { className: "w-6 h-6" }) }, "close")) : (_jsx(motion.div, { initial: { rotate: 90, opacity: 0 }, animate: { rotate: 0, opacity: 1 }, exit: { rotate: -90, opacity: 0 }, transition: { duration: 0.2 }, children: _jsx(Menu, { className: "w-6 h-6" }) }, "menu")) }) })] })] }), _jsx(AnimatePresence, { children: mobileMenuOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: "md:hidden overflow-hidden border-t border-border", children: _jsx(motion.div, { initial: "hidden", animate: "show", exit: "hidden", variants: {
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.1,
                                            },
                                        },
                                    }, className: "flex flex-col gap-2 py-4", children: navigation.map((item) => (_jsx(motion.div, { variants: {
                                            hidden: { opacity: 0, x: -20 },
                                            show: { opacity: 1, x: 0 },
                                        }, whileTap: { scale: 0.98 }, children: _jsx(Link, { href: item.href, onClick: () => setMobileMenuOpen(false), className: clsx('block px-4 py-3 rounded-lg text-sm font-medium transition-colors', pathname?.startsWith(item.href)
                                                ? 'bg-bg-tertiary text-brand-500'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'), children: item.name }) }, item.name))) }) })) })] }) }), _jsx(SearchDialog, { open: searchOpen, onClose: () => setSearchOpen(false) })] }));
}
//# sourceMappingURL=Navigation.js.map