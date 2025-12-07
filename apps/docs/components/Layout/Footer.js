'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ExternalLink, BookOpen, Github, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
const footerNavigation = {
    learn: [
        { name: 'Quick Start', href: '/learn/quick-start' },
        { name: 'Installation', href: '/learn/installation' },
        { name: 'Tutorial', href: '/learn/tutorial' },
        { name: 'Core Concepts', href: '/learn/concepts' },
    ],
    reference: [
        { name: 'Components', href: '/reference/components' },
        { name: 'Hooks', href: '/reference/hooks' },
        { name: 'Utilities', href: '/reference/utilities' },
        { name: 'API Reference', href: '/reference/api' },
    ],
    community: [
        { name: 'GitHub', href: 'https://github.com/clarity-chat/ui' },
        { name: 'Storybook', href: 'https://storybook.clarity-chat.dev' },
        { name: 'Examples', href: '/examples' },
        { name: 'Blog', href: '/blog' },
    ],
    about: [
        { name: 'About', href: '/about' },
        { name: 'License', href: '/license' },
        { name: 'Changelog', href: '/changelog' },
        { name: 'Contributing', href: '/contributing' },
    ],
};
const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/clarity-chat/ui', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/claritychat', icon: Twitter },
    { name: 'YouTube', href: 'https://youtube.com/@claritychat', icon: Youtube },
];
export function Footer() {
    const footerSections = [
        { title: 'Learn', items: footerNavigation.learn },
        { title: 'Reference', items: footerNavigation.reference },
        { title: 'Community', items: footerNavigation.community },
        { title: 'About', items: footerNavigation.about },
    ];
    return (_jsxs("footer", { className: "relative border-t border-border bg-bg-secondary overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" }), _jsxs("div", { className: "container-docs py-12", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 mb-12", children: footerSections.map((section, sectionIndex) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.4, delay: sectionIndex * 0.1 }, children: [_jsx("h3", { className: "font-semibold text-text-primary mb-4", children: section.title }), _jsx("ul", { className: "space-y-3", children: section.items.map((item, itemIndex) => (_jsx(motion.li, { initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.3, delay: sectionIndex * 0.1 + itemIndex * 0.05 }, children: _jsxs(Link, { href: item.href, className: "group inline-flex items-center gap-1 text-text-secondary hover:text-brand-500 transition-colors text-sm relative", ...(item.href.startsWith('http') && {
                                                target: '_blank',
                                                rel: 'noopener noreferrer',
                                            }), children: [_jsxs("span", { className: "relative", children: [item.name, _jsx(motion.span, { className: "absolute bottom-0 left-0 h-px bg-brand-500", initial: { width: 0 }, whileHover: { width: '100%' }, transition: { duration: 0.2 } })] }), item.href.startsWith('http') && (_jsx(ExternalLink, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" }))] }) }, item.name))) })] }, section.title))) }), _jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.6 }, className: "pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: 0.7 }, className: "flex items-center gap-2 text-text-secondary text-sm", children: [_jsx(motion.div, { whileHover: { rotate: 360 }, transition: { duration: 0.6 }, children: _jsx(BookOpen, { className: "w-5 h-5 text-brand-500" }) }), _jsxs("span", { children: ["\u00A9 ", new Date().getFullYear(), " Clarity Chat. MIT License."] })] }), _jsx(motion.div, { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: 0.7 }, className: "flex items-center gap-4", children: socialLinks.map((social, index) => {
                                    const Icon = social.icon;
                                    return (_jsx(motion.a, { href: social.href, target: "_blank", rel: "noopener noreferrer", className: "text-text-tertiary hover:text-brand-500 transition-colors", "aria-label": social.name, initial: { opacity: 0, scale: 0 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.3, delay: 0.8 + index * 0.1 }, whileHover: { scale: 1.2, rotate: 5 }, whileTap: { scale: 0.9 }, children: _jsx(Icon, { className: "w-5 h-5" }) }, social.name));
                                }) })] })] })] }));
}
//# sourceMappingURL=Footer.js.map