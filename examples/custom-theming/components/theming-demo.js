'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Theming Demo Component
 *
 * Showcases Clarity Chat theming capabilities:
 * - Preset theme selection
 * - Live preview
 * - CSS variable export
 * - Light/dark mode support
 */
import { useState, useEffect } from 'react';
import { THEMES, applyTheme, generateCSSVariables, } from '@/lib/themes';
// ============================================================================
// Theme Card Component
// ============================================================================
function ThemeCard({ theme, isSelected, onSelect, }) {
    return (_jsxs("button", { onClick: onSelect, className: `
        w-full p-4 rounded-xl border-2 text-left transition-all
        ${isSelected
            ? 'border-primary ring-2 ring-primary/20'
            : 'border-border hover:border-primary/50'}
      `, children: [_jsxs("div", { className: "flex gap-1 mb-3", children: [_jsx("div", { className: "w-6 h-6 rounded-full border", style: { backgroundColor: `hsl(${theme.colors.primary})` }, title: "Primary" }), _jsx("div", { className: "w-6 h-6 rounded-full border", style: { backgroundColor: `hsl(${theme.colors.background})` }, title: "Background" }), _jsx("div", { className: "w-6 h-6 rounded-full border", style: { backgroundColor: `hsl(${theme.colors.userBubble})` }, title: "User bubble" }), _jsx("div", { className: "w-6 h-6 rounded-full border", style: { backgroundColor: `hsl(${theme.colors.assistantBubble})` }, title: "Assistant bubble" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", children: theme.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: theme.description })] }), _jsx("span", { className: `
            text-xs px-2 py-0.5 rounded-full
            ${theme.mode === 'dark'
                            ? 'bg-gray-800 text-gray-200'
                            : 'bg-gray-100 text-gray-800'}
          `, children: theme.mode })] })] }));
}
// ============================================================================
// Chat Preview Component
// ============================================================================
function ChatPreview() {
    const sampleMessages = [
        {
            id: '1',
            role: 'user',
            content: 'Hello! Can you help me with a React question?',
        },
        {
            id: '2',
            role: 'assistant',
            content: "Of course! I'd be happy to help you with React. What would you like to know?",
        },
        {
            id: '3',
            role: 'user',
            content: "What's the best way to manage state in a large application?",
        },
        {
            id: '4',
            role: 'assistant',
            content: 'Great question! For large React applications, you have several options:\n\n1. **React Context** - Built-in, good for simpler cases\n2. **Redux/Zustand** - External stores with predictable state\n3. **React Query/SWR** - For server state management\n\nThe best choice depends on your specific needs.',
        },
    ];
    return (_jsxs("div", { className: "h-full flex flex-col bg-background rounded-xl border overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b bg-card", children: [_jsx("h3", { className: "font-semibold", children: "Chat Preview" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "See how your theme looks in action" })] }), _jsx("div", { className: "flex-1 p-4 space-y-4 overflow-y-auto", children: sampleMessages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[80%] px-4 py-3 ${message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                            : 'bg-muted text-foreground rounded-2xl rounded-bl-md'}`, style: {
                            borderRadius: `var(--radius)`,
                        }, children: _jsx("p", { className: "whitespace-pre-wrap text-sm", children: message.content }) }) }, message.id))) }), _jsx("div", { className: "p-4 border-t bg-card", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Type a message...", className: "flex-1 px-4 py-2 border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50", readOnly: true }), _jsx("button", { className: "px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium", children: "Send" })] }) })] }));
}
// ============================================================================
// CSS Export Modal
// ============================================================================
function CSSExportModal({ theme, onClose, }) {
    const css = generateCSSVariables(theme);
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", onClick: onClose, children: _jsxs("div", { className: "bg-card w-full max-w-2xl rounded-2xl shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Export Theme CSS" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Copy these CSS variables to your project" })] }), _jsx("button", { onClick: onClose, className: "text-2xl text-muted-foreground hover:text-foreground", children: "\u00D7" })] }), _jsx("div", { className: "p-4", children: _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto text-sm", children: _jsx("code", { children: css }) }) }), _jsxs("div", { className: "flex justify-end gap-2 p-4 border-t", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 text-sm border rounded-lg hover:bg-muted", children: "Close" }), _jsx("button", { onClick: handleCopy, className: "px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90", children: copied ? 'Copied!' : 'Copy CSS' })] })] }) }));
}
// ============================================================================
// Main Component
// ============================================================================
export function ThemingDemo() {
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [showExport, setShowExport] = useState(false);
    const [filter, setFilter] = useState('all');
    // Apply theme on change
    useEffect(() => {
        applyTheme(selectedTheme);
        // Save to localStorage
        localStorage.setItem('clarity-theme', selectedTheme.id);
    }, [selectedTheme]);
    // Load saved theme on mount
    useEffect(() => {
        const savedThemeId = localStorage.getItem('clarity-theme');
        if (savedThemeId) {
            const saved = THEMES.find((t) => t.id === savedThemeId);
            if (saved)
                setSelectedTheme(saved);
        }
    }, []);
    const filteredThemes = THEMES.filter((t) => filter === 'all' ? true : t.mode === filter);
    return (_jsxs("div", { className: "h-screen flex", children: [_jsxs("aside", { className: "w-96 border-r p-6 overflow-y-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Theme Studio" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Explore preset themes for Clarity Chat" })] }), _jsx("div", { className: "flex gap-2 mb-6", children: ['all', 'light', 'dark'].map((mode) => (_jsx("button", { onClick: () => setFilter(mode), className: `
                px-3 py-1.5 text-sm rounded-lg capitalize transition-colors
                ${filter === mode
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'}
              `, children: mode }, mode))) }), _jsx("div", { className: "space-y-3", children: filteredThemes.map((theme) => (_jsx(ThemeCard, { theme: theme, isSelected: selectedTheme.id === theme.id, onSelect: () => setSelectedTheme(theme) }, theme.id))) }), _jsx("div", { className: "mt-6 pt-6 border-t", children: _jsx("button", { onClick: () => setShowExport(true), className: "w-full py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors", children: "Export CSS Variables" }) })] }), _jsx("div", { className: "flex-1 p-6", children: _jsxs("div", { className: "h-full max-w-2xl mx-auto", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Live Preview" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Current theme: ", selectedTheme.name] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Border radius:" }), _jsx("code", { className: "px-2 py-1 bg-muted rounded text-xs font-mono", children: selectedTheme.radius })] })] }), _jsx("div", { className: "h-[calc(100%-4rem)]", children: _jsx(ChatPreview, {}) })] }) }), showExport && (_jsx(CSSExportModal, { theme: selectedTheme, onClose: () => setShowExport(false) }))] }));
}
export default ThemingDemo;
//# sourceMappingURL=theming-demo.js.map