import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
export const metadata = {
    title: 'Blog',
    description: 'Insights, tutorials, and updates about building AI chat interfaces',
};
const blogPosts = [
    {
        title: 'The 7 UX Disasters Killing AI Chat Apps',
        href: '/blog/the-7-ux-disasters-killing-ai-chat-apps',
        description: 'Learn from $200K in mistakes: the most common UX pitfalls and how to avoid them',
        date: '2024',
        category: 'UX Design',
    },
    {
        title: 'AI Chat UX Pain Points and Solutions',
        href: '/blog/ai-chat-ux-pain-points-and-solutions',
        description: 'A comprehensive guide to solving the most frustrating UX problems in AI chat interfaces',
        date: '2024',
        category: 'Tutorial',
    },
    {
        title: 'Viral Strategies Research',
        href: '/blog/viral-strategies-research',
        description: 'Research on viral growth strategies for developer tools and component libraries',
        date: '2024',
        category: 'Research',
    },
];
export default function BlogPage() {
    return (_jsx("div", { className: "container-docs py-12", children: _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "mb-12", children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: "Blog" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Insights, tutorials, and updates about building AI chat interfaces with Clarity Chat." })] }), _jsx("div", { className: "grid gap-8", children: blogPosts.map((post) => (_jsx(Link, { href: post.href, className: "group block p-8 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all", children: _jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-full text-sm font-medium", children: post.category }), _jsxs("span", { className: "text-sm text-text-tertiary flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), post.date] })] }), _jsx("h2", { className: "text-2xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-2", children: post.title }), _jsx("p", { className: "text-text-secondary", children: post.description })] }), _jsx(ArrowRight, { className: "w-6 h-6 text-text-tertiary group-hover:text-brand-500 group-hover:translate-x-1 transition-all" })] }) }, post.href))) }), _jsxs("div", { className: "mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Stay Updated" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Get the latest updates, tutorials, and insights delivered to your inbox." }), _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsx("a", { href: "https://github.com/clarity-chat/ui/discussions", target: "_blank", rel: "noopener noreferrer", className: "px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors", children: "Join Discussion" }), _jsx("a", { href: "https://discord.gg/clarity-chat", target: "_blank", rel: "noopener noreferrer", className: "px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border", children: "Join Discord" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map