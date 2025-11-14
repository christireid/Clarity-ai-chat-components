'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
export function Breadcrumbs() {
    const pathname = usePathname();
    // Don't show breadcrumbs on homepage
    if (pathname === '/')
        return null;
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        return { href, label };
    });
    return (_jsxs("nav", { "aria-label": "Breadcrumb", className: "flex items-center gap-2 text-sm text-text-secondary mb-8", children: [_jsx(Link, { href: "/", className: "hover:text-text-primary transition-colors", "aria-label": "Home", children: _jsx(Home, { className: "w-4 h-4" }) }), breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (_jsxs(Fragment, { children: [_jsx(ChevronRight, { className: "w-4 h-4" }), isLast ? (_jsx("span", { className: "text-text-primary font-medium", children: crumb.label })) : (_jsx(Link, { href: crumb.href, className: "hover:text-text-primary transition-colors", children: crumb.label }))] }, crumb.href));
            })] }));
}
//# sourceMappingURL=Breadcrumbs.js.map