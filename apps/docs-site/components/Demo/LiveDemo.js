'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';
import { useTheme } from 'next-themes';
import { Play, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
export function LiveDemo({ title, code, dependencies = {}, showConsole = false, height = '500px', ...props }) {
    const { theme } = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [key, setKey] = useState(0);
    const defaultDependencies = {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@clarity-chat/react': 'latest',
        ...dependencies,
    };
    const files = {
        '/App.tsx': code,
        '/index.tsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@clarity-chat/react/styles.css'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)`,
    };
    const sandpackTheme = theme === 'dark' ? nightOwl : 'light';
    return (_jsxs("div", { className: clsx('my-6 border border-border rounded-xl overflow-hidden', isFullscreen && 'fixed inset-4 z-50 bg-bg-primary'), children: [title && (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Play, { className: "w-4 h-4 text-brand-500" }), _jsx("span", { className: "font-semibold text-sm", children: title })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setKey(key + 1), className: "p-2 hover:bg-bg-tertiary rounded transition-colors", "aria-label": "Reset demo", title: "Reset demo", children: _jsx(RefreshCw, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setIsFullscreen(!isFullscreen), className: "p-2 hover:bg-bg-tertiary rounded transition-colors", "aria-label": isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen', title: isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen', children: isFullscreen ? (_jsx(Minimize2, { className: "w-4 h-4" })) : (_jsx(Maximize2, { className: "w-4 h-4" })) })] })] })), _jsx("div", { style: { height: isFullscreen ? 'calc(100vh - 120px)' : height }, children: _jsx(Sandpack, { template: "react-ts", theme: sandpackTheme, files: files, customSetup: {
                        dependencies: defaultDependencies,
                    }, options: {
                        showNavigator: false,
                        showTabs: true,
                        showLineNumbers: true,
                        showInlineErrors: true,
                        wrapContent: true,
                        editorHeight: isFullscreen ? '100%' : height,
                        editorWidthPercentage: 50,
                        showConsole: showConsole,
                        showConsoleButton: true,
                        ...props.options,
                    }, ...props }, key) })] }));
}
//# sourceMappingURL=LiveDemo.js.map