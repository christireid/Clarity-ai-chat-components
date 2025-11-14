'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Eye, Code } from 'lucide-react';
import clsx from 'clsx';
export function ComponentPreview({ children, code, title, description, language = 'tsx', className, }) {
    const [activeTab, setActiveTab] = useState('preview');
    return (_jsxs("div", { className: clsx('my-6 border border-border rounded-xl overflow-hidden', className), children: [_jsxs("div", { className: "bg-bg-secondary border-b border-border", children: [_jsxs("div", { className: "px-4 py-3", children: [title && _jsx("h3", { className: "font-semibold text-lg mb-1", children: title }), description && _jsx("p", { className: "text-sm text-text-secondary", children: description })] }), _jsxs("div", { className: "flex border-t border-border", children: [_jsxs("button", { onClick: () => setActiveTab('preview'), className: clsx('flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2', activeTab === 'preview'
                                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'), children: [_jsx(Eye, { className: "w-4 h-4" }), "Preview"] }), _jsxs("button", { onClick: () => setActiveTab('code'), className: clsx('flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2', activeTab === 'code'
                                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'), children: [_jsx(Code, { className: "w-4 h-4" }), "Code"] })] })] }), activeTab === 'preview' ? (_jsx("div", { className: "p-8 bg-bg-primary min-h-[300px] flex items-center justify-center", children: children })) : (_jsx("div", { className: "p-0", children: _jsx(CodeBlock, { code: code, language: language, showLineNumbers: true }) }))] }));
}
//# sourceMappingURL=ComponentPreview.js.map