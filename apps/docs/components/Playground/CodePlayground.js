'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { Maximize2, Minimize2 } from 'lucide-react';
// Dynamic import for code editor to avoid SSR issues
const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false });
export function CodePlayground({ initialCode, dependencies = {}, onCodeChange, className }) {
    const [code, setCode] = useState(initialCode);
    const [layout, setLayout] = useState('horizontal');
    const [editorSize, setEditorSize] = useState(50);
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);
    // Handle fullscreen toggle with escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        if (isFullscreen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        onCodeChange?.(newCode);
    };
    // Load ClarityChat components dynamically on client only
    const [clarityComponents, setClarityComponents] = useState(null);
    useEffect(() => {
        import('@clarity-chat/react').then((mod) => {
            setClarityComponents(mod);
        });
    }, []);
    const scope = useMemo(() => ({
        ...(clarityComponents || {}),
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useCallback: React.useCallback,
        useMemo: React.useMemo,
        useRef: React.useRef,
        useContext: React.useContext,
        createContext: React.createContext,
        // Add render function for react-live
        render: (component) => component,
    }), [clarityComponents]);
    // Transform code to work with react-live (remove imports, handle exports)
    const transformCode = (code) => {
        // Remove all import statements
        let transformed = code.replace(/import\s+.*?from\s+['"].*?['"]\s*;?\n?/g, '');
        // Remove 'use client' directive
        transformed = transformed.replace(/'use client'\s*;?\n?/g, '');
        // Replace export default function with just function and render it
        transformed = transformed.replace(/export\s+default\s+function\s+(\w+)\s*\(/g, 'function $1(');
        // If there's a function definition, add a render call at the end
        if (transformed.includes('function App(') || transformed.includes('function Home(')) {
            const functionName = transformed.includes('function App(') ? 'App' : 'Home';
            transformed += `\n\nrender(<${functionName} />)`;
        }
        return transformed.trim();
    };
    const containerClass = isFullscreen
        ? 'fixed inset-0 z-50 bg-white dark:bg-gray-800'
        : `w-full max-w-[1400px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className || ''}`;
    const heightStyle = isFullscreen
        ? { height: '100vh' }
        : { height: 'calc(100vh - 200px)', minHeight: '700px' };
    return (_jsxs("div", { className: containerClass, children: [_jsxs("div", { className: "border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-900", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Layout:" }), _jsx("button", { onClick: () => setLayout('horizontal'), className: `px-3 py-1 text-sm rounded transition-colors ${layout === 'horizontal'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`, "aria-label": "Side by side layout", children: "Side by Side" }), _jsx("button", { onClick: () => setLayout('vertical'), className: `px-3 py-1 text-sm rounded transition-colors ${layout === 'vertical'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`, "aria-label": "Stacked layout", children: "Stacked" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setIsFullscreen(!isFullscreen), className: "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors", "aria-label": isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen', children: isFullscreen ? (_jsxs(_Fragment, { children: [_jsx(Minimize2, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Exit Fullscreen" })] })) : (_jsxs(_Fragment, { children: [_jsx(Maximize2, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Fullscreen" })] })) }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400 hidden md:inline", children: "Press Ctrl+Enter to run \u2022 ESC to exit fullscreen" })] })] }), _jsx(LiveProvider, { code: transformCode(code), scope: scope, noInline: true, children: _jsxs("div", { className: `flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`, style: heightStyle, children: [_jsx("div", { className: "border-r border-gray-200 dark:border-gray-700", style: {
                                width: layout === 'horizontal' ? `${editorSize}%` : '100%',
                                height: layout === 'vertical' ? `${editorSize}%` : '100%'
                            }, children: _jsx(CodeEditor, { value: code, onChange: handleCodeChange, language: "typescript" }) }), _jsx("div", { className: `${layout === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'} bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 transition-colors`, onMouseDown: (e) => {
                                e.preventDefault();
                                const startPos = layout === 'horizontal' ? e.clientX : e.clientY;
                                const startSize = editorSize;
                                const handleMouseMove = (e) => {
                                    const container = e.currentTarget;
                                    const rect = container.getBoundingClientRect();
                                    const total = layout === 'horizontal' ? rect.width : rect.height;
                                    const current = layout === 'horizontal' ? e.clientX : e.clientY;
                                    const delta = current - startPos;
                                    const deltaPercent = (delta / total) * 100;
                                    const newSize = Math.min(Math.max(startSize + deltaPercent, 20), 80);
                                    setEditorSize(newSize);
                                };
                                const handleMouseUp = () => {
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                            } }), _jsx("div", { className: "overflow-auto bg-white dark:bg-gray-900", style: {
                                width: layout === 'horizontal' ? `${100 - editorSize}%` : '100%',
                                height: layout === 'vertical' ? `${100 - editorSize}%` : '100%'
                            }, children: _jsxs("div", { className: "p-6 h-full", children: [_jsx("div", { className: "mb-4 pb-4 border-b border-gray-200 dark:border-gray-700", children: _jsx("h3", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "Preview" }) }), _jsx(LiveError, { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-800 dark:text-red-200 text-sm font-mono whitespace-pre-wrap" }), _jsx("div", { className: "playground-preview h-full", children: clarityComponents ? (_jsx(LivePreview, {})) : (_jsx("div", { className: "flex items-center justify-center h-32 text-gray-500", children: "Loading components..." })) })] }) })] }) }), _jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { children: "Ready" }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [code.split('\n').length, " lines"] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { children: "TypeScript" }) })] })] }));
}
//# sourceMappingURL=CodePlayground.js.map