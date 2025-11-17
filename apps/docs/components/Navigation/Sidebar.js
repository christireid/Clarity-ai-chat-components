'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
function NavGroup({ item, level = 0 }) {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const hasChildren = item.items && item.items.length > 0;
    const isActive = pathname === item.href;
    const isParentActive = item.items?.some((child) => pathname === child.href);
    if (!hasChildren && item.href) {
        // Leaf node (link)
        return (_jsx(Link, { href: item.href, className: clsx('block px-3 py-2 rounded-md text-sm transition-colors', level === 0 && 'font-medium', level > 0 && 'ml-4', isActive
                ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'), children: item.title }));
    }
    // Group node (collapsible)
    return (_jsxs("div", { children: [item.href ? (_jsxs(Link, { href: item.href, className: clsx('flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors', level === 0 && 'font-semibold', level > 0 && 'ml-4', isActive || isParentActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-text-primary hover:bg-bg-secondary'), children: [_jsx("span", { children: item.title }), hasChildren && (_jsx("button", { onClick: (e) => {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        }, className: "p-1 hover:bg-bg-tertiary rounded", children: isOpen ? (_jsx(ChevronDown, { className: "w-4 h-4" })) : (_jsx(ChevronRight, { className: "w-4 h-4" })) }))] })) : (_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: clsx('flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors text-left', level === 0 && 'font-semibold', level > 0 && 'ml-4', isParentActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-text-primary hover:bg-bg-secondary'), children: [_jsx("span", { children: item.title }), isOpen ? (_jsx(ChevronDown, { className: "w-4 h-4" })) : (_jsx(ChevronRight, { className: "w-4 h-4" }))] })), isOpen && hasChildren && (_jsx("div", { className: "mt-1 space-y-1", children: item.items.map((child, index) => (_jsx(NavGroup, { item: child, level: level + 1 }, index))) }))] }));
}
export function Sidebar({ navigation }) {
    return (_jsx("nav", { className: "space-y-1", "aria-label": "Documentation navigation", children: navigation.map((item, index) => (_jsx(NavGroup, { item: item }, index))) }));
}
//# sourceMappingURL=Sidebar.js.map