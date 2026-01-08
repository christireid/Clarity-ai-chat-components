'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SecurityDemo } from '@/components/security-demo';
/**
 * Security Examples Page
 *
 * Demonstrates comprehensive security features:
 * 1. Prompt Injection Detection
 * 2. PII Redaction
 * 3. Jailbreak Prevention
 * 4. Security Monitoring
 */
export default function SecurityExamplesPage() {
    const [activeTab, setActiveTab] = useState('test-bench');
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "border-b bg-background/95 backdrop-blur sticky top-0 z-10", children: _jsxs("div", { className: "container flex h-16 items-center justify-between px-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-red-100 dark:bg-red-900/20 rounded-lg", children: _jsx("svg", { className: "w-5 h-5 text-red-600 dark:text-red-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold", children: "Security Examples" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Prompt injection, PII, jailbreak protection" })] })] }), _jsx("nav", { className: "flex gap-1", children: [
                                { id: 'test-bench', label: 'Test Bench' },
                                { id: 'monitor', label: 'Monitor' },
                                { id: 'config', label: 'Config' },
                            ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-3 py-1.5 text-sm rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted'}`, children: tab.label }, tab.id))) })] }) }), _jsx("main", { className: "container px-4 py-8", children: _jsx(SecurityDemo, { activeTab: activeTab }) })] }));
}
//# sourceMappingURL=page.js.map