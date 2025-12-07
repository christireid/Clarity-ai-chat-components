'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
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
    return (_jsxs(motion.nav, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, "aria-label": "Breadcrumb", className: "flex items-center gap-2 text-sm text-text-secondary mb-8", children: [_jsx(motion.div, { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3, delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }, whileHover: { scale: 1.1, rotate: 5 }, whileTap: { scale: 0.95 }, children: _jsx(Link, { href: "/", className: "hover:text-brand-500 transition-colors inline-flex items-center", "aria-label": "Home", children: _jsx(Home, { className: "w-4 h-4" }) }) }), breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (_jsxs(Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: 0.15 + index * 0.05 }, children: _jsx(ChevronRight, { className: "w-4 h-4 text-text-tertiary" }) }), isLast ? (_jsx(motion.span, { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: 0.2 + index * 0.05 }, className: "text-text-primary font-medium", children: crumb.label })) : (_jsx(motion.div, { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: 0.2 + index * 0.05 }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: _jsxs(Link, { href: crumb.href, className: "group relative hover:text-brand-500 transition-colors", children: [crumb.label, _jsx(motion.span, { className: "absolute bottom-0 left-0 h-px bg-brand-500", initial: { width: 0 }, whileHover: { width: '100%' }, transition: { duration: 0.2 } })] }) }))] }, crumb.href));
            })] }));
}
//# sourceMappingURL=Breadcrumbs.js.map