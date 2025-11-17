import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Github, Twitter, Youtube, BookOpen } from 'lucide-react';
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
    return (_jsx("footer", { className: "border-t border-border bg-bg-secondary", children: _jsxs("div", { className: "container-docs py-12", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 mb-12", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-text-primary mb-4", children: "Learn" }), _jsx("ul", { className: "space-y-3", children: footerNavigation.learn.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, className: "text-text-secondary hover:text-brand-500 transition-colors text-sm", children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-text-primary mb-4", children: "Reference" }), _jsx("ul", { className: "space-y-3", children: footerNavigation.reference.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, className: "text-text-secondary hover:text-brand-500 transition-colors text-sm", children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-text-primary mb-4", children: "Community" }), _jsx("ul", { className: "space-y-3", children: footerNavigation.community.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, className: "text-text-secondary hover:text-brand-500 transition-colors text-sm", ...(item.href.startsWith('http') && {
                                                target: '_blank',
                                                rel: 'noopener noreferrer',
                                            }), children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-text-primary mb-4", children: "About" }), _jsx("ul", { className: "space-y-3", children: footerNavigation.about.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, className: "text-text-secondary hover:text-brand-500 transition-colors text-sm", children: item.name }) }, item.name))) })] })] }), _jsxs("div", { className: "pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-text-secondary text-sm", children: [_jsx(BookOpen, { className: "w-5 h-5 text-brand-500" }), _jsxs("span", { children: ["\u00A9 ", new Date().getFullYear(), " Clarity Chat. MIT License."] })] }), _jsx("div", { className: "flex items-center gap-4", children: socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (_jsx("a", { href: social.href, target: "_blank", rel: "noopener noreferrer", className: "text-text-tertiary hover:text-brand-500 transition-colors", "aria-label": social.name, children: _jsx(Icon, { className: "w-5 h-5" }) }, social.name));
                            }) })] })] }) }));
}
//# sourceMappingURL=Footer.js.map