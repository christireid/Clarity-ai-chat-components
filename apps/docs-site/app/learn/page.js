import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { BookOpen, Zap, Code, Lightbulb } from 'lucide-react';
export const metadata = {
    title: 'Learn',
    description: 'Learn how to use Clarity Chat UI',
};
const sections = [
    {
        title: 'Getting Started',
        icon: Zap,
        description: 'Quick start guides and installation instructions',
        links: [
            { title: 'Quick Start', href: '/learn/quick-start', description: 'Get up and running in 5 minutes' },
            { title: 'Installation', href: '/learn/installation', description: 'Install Clarity Chat in your project' },
            { title: 'Tutorial', href: '/learn/tutorial', description: 'Build a complete chat application' },
        ],
    },
    {
        title: 'Core Concepts',
        icon: BookOpen,
        description: 'Understand the fundamentals of Clarity Chat',
        links: [
            { title: 'Components', href: '/learn/concepts/components', description: 'Learn about UI components' },
            { title: 'Hooks', href: '/learn/concepts/hooks', description: 'Powerful React hooks for state management' },
            { title: 'Theming', href: '/learn/concepts/theming', description: 'Customize colors and styles' },
            { title: 'Animations', href: '/learn/concepts/animations', description: 'Smooth motion and transitions' },
        ],
    },
    {
        title: 'Guides',
        icon: Code,
        description: 'In-depth guides for specific topics',
        links: [
            { title: 'Styling', href: '/learn/guides/styling', description: 'Custom styles and CSS' },
            { title: 'Accessibility', href: '/learn/guides/accessibility', description: 'Build inclusive interfaces' },
            { title: 'Performance', href: '/learn/guides/performance', description: 'Optimize your chat app' },
            { title: 'Testing', href: '/learn/guides/testing', description: 'Test your components' },
            { title: 'TypeScript', href: '/learn/guides/typescript', description: 'Type-safe development' },
        ],
    },
    {
        title: 'Examples',
        icon: Lightbulb,
        description: 'Real-world examples and patterns',
        links: [
            { title: 'View all examples', href: '/examples', description: 'Browse code examples →' },
        ],
    },
];
export default function LearnPage() {
    return (_jsx("div", { className: "container-docs py-12", children: _jsxs("div", { className: "max-w-4xl", children: [_jsx("h1", { className: "text-5xl font-bold mb-6", children: "Learn Clarity Chat" }), _jsx("p", { className: "text-xl text-text-secondary mb-12", children: "Everything you need to know to build beautiful, accessible chat interfaces with React." }), _jsx("div", { className: "grid gap-8", children: sections.map((section) => {
                        const Icon = section.icon;
                        return (_jsxs("div", { className: "border border-border rounded-xl p-8 hover:border-brand-500/50 transition-colors", children: [_jsxs("div", { className: "flex items-start gap-4 mb-6", children: [_jsx("div", { className: "p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg", children: _jsx(Icon, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: section.title }), _jsx("p", { className: "text-text-secondary", children: section.description })] })] }), _jsx("div", { className: "grid gap-4", children: section.links.map((link) => (_jsx(Link, { href: link.href, className: "group block p-4 rounded-lg hover:bg-bg-secondary transition-colors", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-1", children: link.title }), _jsx("p", { className: "text-sm text-text-secondary", children: link.description })] }), _jsx("span", { className: "text-text-tertiary group-hover:text-brand-500 transition-colors", children: "\u2192" })] }) }, link.href))) })] }, section.title));
                    }) }), _jsxs("div", { className: "mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Need Help?" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Can't find what you're looking for? We're here to help!" }), _jsxs("div", { className: "flex gap-4 flex-wrap", children: [_jsx(Link, { href: "https://github.com/clarity-chat/ui/discussions", className: "px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors", children: "Ask on GitHub" }), _jsx(Link, { href: "https://discord.gg/clarity-chat", className: "px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border", children: "Join Discord" })] })] })] }) }));
}
//# sourceMappingURL=page.js.map