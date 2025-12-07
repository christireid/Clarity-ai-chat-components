'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
export function TableOfContents({ headings: propHeadings, className }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');
    const pathname = usePathname();
    useEffect(() => {
        if (propHeadings) {
            setHeadings(propHeadings);
            return;
        }
        // Auto-detect headings from the page
        const headingElements = document.querySelectorAll('h2, h3, h4');
        const detectedHeadings = Array.from(headingElements).map((el) => {
            const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
            if (!el.id) {
                el.id = id;
            }
            return {
                id,
                text: el.textContent || '',
                level: parseInt(el.tagName.charAt(1)),
            };
        });
        setHeadings(detectedHeadings);
    }, [propHeadings, pathname]);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, {
            rootMargin: '-20% 0% -35% 0%',
            threshold: 0,
        });
        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });
        return () => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [headings]);
    if (headings.length === 0) {
        return null;
    }
    return (_jsx("nav", { className: clsx('sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto', 'hidden xl:block w-64 ml-8', 'text-sm', className), "aria-label": "Table of contents", children: _jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3", children: "On this page" }), _jsx("ul", { className: "space-y-1", children: headings.map((heading) => (_jsx("li", { children: _jsx("a", { href: `#${heading.id}`, className: clsx('block py-1.5 px-2 rounded-md transition-colors', 'hover:bg-bg-secondary', heading.level === 2 && 'font-medium', heading.level === 3 && 'ml-4 text-sm', heading.level === 4 && 'ml-8 text-xs', activeId === heading.id
                                ? 'text-brand-500 bg-brand-500/10'
                                : 'text-text-secondary hover:text-text-primary'), onClick: (e) => {
                                e.preventDefault();
                                const element = document.getElementById(heading.id);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    // Update URL without scrolling
                                    window.history.pushState(null, '', `#${heading.id}`);
                                }
                            }, children: heading.text }) }, heading.id))) })] }) }));
}
//# sourceMappingURL=TableOfContents.js.map