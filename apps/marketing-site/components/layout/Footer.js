import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'FAQ', href: '#faq' },
    ],
    resources: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Getting Started', href: '/docs/guides/getting-started' },
        { name: 'API Reference', href: '/docs/api' },
        { name: 'Examples', href: '/docs/examples' },
    ],
    developers: [
        {
            name: 'GitHub',
            href: 'https://github.com/christireid/Clarity-ai-chat-components',
        },
        {
            name: 'Discussions',
            href: 'https://github.com/christireid/Clarity-ai-chat-components/discussions',
        },
        {
            name: 'Issues',
            href: 'https://github.com/christireid/Clarity-ai-chat-components/issues',
        },
        {
            name: 'Releases',
            href: 'https://github.com/christireid/Clarity-ai-chat-components/releases',
        },
    ],
    legal: [
        {
            name: 'MIT License',
            href: 'https://github.com/christireid/Clarity-ai-chat-components/blob/main/LICENSE',
        },
    ],
};
const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/christireid/Clarity-ai-chat-components',
        icon: Github,
    },
    {
        name: 'Twitter',
        href: 'https://twitter.com/claritychat',
        icon: Twitter,
    },
];
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (_jsxs("footer", { className: "bg-surface-950 border-t border-white/5", "aria-labelledby": "footer-heading", children: [_jsx("h2", { id: "footer-heading", className: "sr-only", children: "Footer" }), _jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16", children: [_jsxs("div", { className: "xl:grid xl:grid-cols-3 xl:gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs(Link, { href: "/", className: "flex items-center gap-2 group", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-clarity-400 to-cosmic-500 flex items-center justify-center", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }) }), _jsxs("span", { className: "text-lg font-bold text-white", children: ["Clarity", _jsx("span", { className: "text-clarity-400", children: "Chat" })] })] }), _jsx("p", { className: "text-sm text-gray-400 max-w-xs", children: "Premium React components for AI chat applications. Build beautiful, accessible, and performant chat interfaces in minutes." }), _jsx("div", { className: "flex gap-4", children: socialLinks.map((item) => {
                                            const Icon = item.icon;
                                            return (_jsx(Link, { href: item.href, target: "_blank", rel: "noopener noreferrer", className: "text-gray-400 hover:text-white transition-colors", "aria-label": item.name, children: _jsx(Icon, { className: "w-5 h-5" }) }, item.name));
                                        }) })] }), _jsx("div", { className: "mt-12 xl:mt-0 xl:col-span-2", children: _jsxs("div", { className: "grid grid-cols-2 gap-8 md:grid-cols-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Product" }), _jsx("ul", { className: "mt-4 space-y-3", children: footerLinks.product.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, className: "text-sm text-gray-400 hover:text-white transition-colors", children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Resources" }), _jsx("ul", { className: "mt-4 space-y-3", children: footerLinks.resources.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, className: "text-sm text-gray-400 hover:text-white transition-colors", children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Developers" }), _jsx("ul", { className: "mt-4 space-y-3", children: footerLinks.developers.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, target: item.href.startsWith('http') ? '_blank' : undefined, rel: item.href.startsWith('http')
                                                                ? 'noopener noreferrer'
                                                                : undefined, className: "text-sm text-gray-400 hover:text-white transition-colors", children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-white", children: "Legal" }), _jsx("ul", { className: "mt-4 space-y-3", children: footerLinks.legal.map((item) => (_jsx("li", { children: _jsx(Link, { href: item.href, target: item.href.startsWith('http') ? '_blank' : undefined, rel: item.href.startsWith('http')
                                                                ? 'noopener noreferrer'
                                                                : undefined, className: "text-sm text-gray-400 hover:text-white transition-colors", children: item.name }) }, item.name))) })] })] }) })] }), _jsx("div", { className: "mt-12 pt-8 border-t border-white/5", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4", children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["\u00A9 ", currentYear, " Code & Clarity. All rights reserved."] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-400", children: [_jsx("span", { children: "Made with" }), _jsx("span", { className: "text-pink-500", "aria-hidden": "true", children: _jsx("svg", { className: "w-4 h-4 fill-current", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z", clipRule: "evenodd" }) }) }), _jsx("span", { children: "for developers" })] })] }) })] })] }));
}
//# sourceMappingURL=Footer.js.map