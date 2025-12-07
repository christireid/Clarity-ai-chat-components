'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
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
    return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }, className: "space-y-2", children: [_jsx(motion.h4, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "font-semibold text-sm text-text-primary mb-4", children: "On this page" }), _jsx("nav", { children: _jsx("ul", { className: "space-y-2", children: items.map((item, index) => (_jsx(motion.li, { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3, delay: 0.15 + index * 0.03 }, style: { paddingLeft: `${(item.level - 2) * 12}px` }, children: _jsx(motion.div, { whileHover: { x: 2 }, transition: { duration: 0.2 }, children: _jsxs("a", { href: `#${item.id}`, onClick: (e) => handleClick(e, item.id), className: clsx('block text-sm py-1 pl-3 transition-all border-l-2 relative', activeId === item.id
                                    ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'), children: [item.title, activeId === item.id && (_jsx(motion.div, { layoutId: "activeIndicator", className: "absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500", initial: false, transition: {
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30
                                        } }))] }) }) }, item.id))) }) })] }));
}
//# sourceMappingURL=TableOfContents.js.map