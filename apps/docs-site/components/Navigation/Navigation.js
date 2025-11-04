'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Monitor, Search, Github, BookOpen } from 'lucide-react';
import { SearchDialog } from './SearchDialog';
import clsx from 'clsx';
const navigation = [
    { name: 'Learn', href: '/learn' },
    { name: 'Reference', href: '/reference' },
    { name: 'Examples', href: '/examples' },
    { name: 'Blog', href: '/blog' },
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
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-bg-primary/80 backdrop-blur-xl", children: _jsxs("nav", { className: "container-docs", "aria-label": "Main navigation", children: [_jsxs("div", { className: "flex h-16 items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs(Link, { href: "/", className: "flex items-center gap-2 font-bold text-xl", children: [_jsx(BookOpen, { className: "w-6 h-6 text-brand-500" }), _jsx("span", { children: "Clarity Chat" })] }), _jsx("div", { className: "hidden md:flex items-center gap-1", children: navigation.map((item) => (_jsx(Link, { href: item.href, className: clsx('px-4 py-2 rounded-lg text-sm font-medium transition-colors', pathname?.startsWith(item.href)
                                                    ? 'bg-bg-tertiary text-brand-500'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'), children: item.name }, item.name))) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setSearchOpen(true), className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-secondary hover:bg-bg-tertiary transition-colors text-sm text-text-secondary", "aria-label": "Search documentation", children: [_jsx(Search, { className: "w-4 h-4" }), _jsx("span", { children: "Search" }), _jsxs("kbd", { className: "hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-bg-primary px-1.5 font-mono text-xs", children: [_jsx("span", { className: "text-xs", children: "\u2318" }), "K"] })] }), _jsx("button", { onClick: () => setSearchOpen(true), className: "sm:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "Search", children: _jsx(Search, { className: "w-5 h-5" }) }), _jsx("button", { onClick: cycleTheme, className: "p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": `Current theme: ${theme}. Click to cycle through themes.`, children: getThemeIcon() }), _jsx("a", { href: "https://github.com/clarity-chat/ui", target: "_blank", rel: "noopener noreferrer", className: "p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "View on GitHub", children: _jsx(Github, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "md:hidden p-2 rounded-lg hover:bg-bg-secondary transition-colors", "aria-label": "Toggle mobile menu", children: mobileMenuOpen ? (_jsx(X, { className: "w-6 h-6" })) : (_jsx(Menu, { className: "w-6 h-6" })) })] })] }), mobileMenuOpen && (_jsx("div", { className: "md:hidden py-4 border-t border-border animate-slide-down", children: _jsx("div", { className: "flex flex-col gap-2", children: navigation.map((item) => (_jsx(Link, { href: item.href, onClick: () => setMobileMenuOpen(false), className: clsx('px-4 py-3 rounded-lg text-sm font-medium transition-colors', pathname?.startsWith(item.href)
                                        ? 'bg-bg-tertiary text-brand-500'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'), children: item.name }, item.name))) }) }))] }) }), _jsx(SearchDialog, { open: searchOpen, onClose: () => setSearchOpen(false) })] }));
}
//# sourceMappingURL=Navigation.js.map