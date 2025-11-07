'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
export function TableOfContents({ items }) {
    const [activeId, setActiveId] = useState('');
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, {
            rootMargin: '-80px 0px -80% 0px',
        });
        items.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });
        return () => observer.disconnect();
    }, [items]);
    const handleClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const top = element.offsetTop - 80; // Account for sticky header
            window.scrollTo({ top, behavior: 'smooth' });
            setActiveId(id);
        }
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-semibold text-sm text-text-primary mb-4", children: "On this page" }), _jsx("nav", { children: _jsx("ul", { className: "space-y-2", children: items.map((item) => (_jsx("li", { style: { paddingLeft: `${(item.level - 2) * 12}px` }, children: _jsx("a", { href: `#${item.id}`, onClick: (e) => handleClick(e, item.id), className: clsx('block text-sm py-1 transition-colors border-l-2', activeId === item.id
                                ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'), children: item.title }) }, item.id))) }) })] }));
}
//# sourceMappingURL=TableOfContents.js.map