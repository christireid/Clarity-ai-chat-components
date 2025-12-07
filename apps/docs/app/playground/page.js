'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TemplateSelector } from '@/components/Playground/TemplateSelector';
import { PlaygroundControls } from '@/components/Playground/PlaygroundControls';
import { playgroundTemplates } from '@/lib/playground-templates';
// Dynamic import to avoid React version conflicts during static generation
const DynamicCodePlayground = dynamic(() => import('@/components/Playground/CodePlayground').then(mod => ({ default: mod.CodePlayground })), {
    ssr: false,
    loading: () => (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[600px] flex items-center justify-center", children: _jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Loading playground..." }) }))
});
export default function PlaygroundPage() {
    const [selectedTemplate, setSelectedTemplate] = useState(playgroundTemplates[0]);
    const [code, setCode] = useState(selectedTemplate.code);
    const [dependencies, setDependencies] = useState(selectedTemplate.dependencies);
    const handleTemplateChange = (templateId) => {
        const template = playgroundTemplates.find(t => t.id === templateId);
        if (template) {
            setSelectedTemplate(template);
            setCode(template.code);
            setDependencies(template.dependencies);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx("div", { className: "border-b bg-white dark:bg-gray-800", children: _jsx("div", { className: "max-w-[1920px] mx-auto px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "\uD83C\uDFAE Interactive Playground" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Try Clarity Chat components live in your browser" })] }), _jsx(PlaygroundControls, { code: code, dependencies: dependencies, templateName: selectedTemplate.name })] }) }) }), _jsx("div", { className: "max-w-[1920px] mx-auto p-6", children: _jsxs("div", { className: "grid grid-cols-12 gap-6", children: [_jsx("div", { className: "col-span-12 lg:col-span-3", children: _jsx(TemplateSelector, { templates: playgroundTemplates, selectedId: selectedTemplate.id, onSelect: handleTemplateChange }) }), _jsx("div", { className: "col-span-12 lg:col-span-9", children: _jsx(DynamicCodePlayground, { initialCode: code, dependencies: dependencies, onCodeChange: setCode }) })] }) })] }) }));
}
//# sourceMappingURL=page.js.map