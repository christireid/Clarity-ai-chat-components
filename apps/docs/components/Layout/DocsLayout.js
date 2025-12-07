'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/Navigation/Sidebar';
import { TableOfContents } from '@/components/Enhanced/TableOfContents';
import clsx from 'clsx';
export function DocsLayout({ children, navigation, tableOfContents, }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsx("div", { className: "container-docs", children: _jsxs("div", { className: "flex gap-8 py-8", children: [_jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-colors", "aria-label": "Toggle sidebar", children: sidebarOpen ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) }), _jsx("aside", { className: clsx('fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-bg-primary border-r border-border lg:border-0 transition-transform', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'), children: _jsx("div", { className: "p-6", children: _jsx(Sidebar, { navigation: navigation }) }) }), sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-30 bg-black/50 lg:hidden", onClick: () => setSidebarOpen(false) })), _jsx("main", { className: "flex-1 min-w-0", children: _jsx("article", { className: "prose prose-lg dark:prose-invert max-w-3xl", children: children }) }), _jsx(TableOfContents, {})] }) }));
}
//# sourceMappingURL=DocsLayout.js.map