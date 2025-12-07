import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Complex Chat Example - Enterprise-Grade Usage
 *
 * This example demonstrates advanced usage of Clarity Chat with:
 * - Custom layout with sidebar
 * - Memory integration
 * - Message operations (edit, regenerate, delete)
 * - Error handling
 * - Custom styling
 * - Analytics integration
 *
 * This shows how to build a production-ready chat application
 * with enterprise features while maintaining simplicity.
 */
import * as React from 'react';
import { ClarityChat, ChatLayout, useMemoryStore, MemoryProvider, AnalyticsProvider, createGoogleAnalyticsProvider, } from '@clarity-chat/react';
import '@clarity-chat/react/dist/styles/index.css';
// Sidebar component showing memory context
function MemorySidebar() {
    const memory = useMemoryStore({ enabled: true });
    const [memories, setMemories] = React.useState([]);
    React.useEffect(() => {
        // Query recent memories
        memory.query('recent conversations').then(setMemories);
    }, [memory]);
    return (_jsxs("div", { className: "p-4 space-y-4", children: [_jsx("h3", { className: "font-semibold text-sm", children: "Memory Context" }), _jsx("div", { className: "space-y-2", children: memories.length === 0 ? (_jsx("p", { className: "text-xs text-muted-foreground", children: "No memories yet" })) : (memories.slice(0, 5).map((mem, i) => (_jsx("div", { className: "text-xs p-2 bg-muted rounded", children: mem.content }, i)))) })] }));
}
// Header component
function ChatHeader() {
    return (_jsxs("div", { className: "p-4 border-b flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-semibold", children: "Enterprise Chat" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "AI Assistant with Memory" })] }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { className: "px-3 py-1 text-sm bg-primary text-primary-foreground rounded", children: "Settings" }) })] }));
}
// Footer component
function ChatFooter() {
    return (_jsx("div", { className: "p-2 border-t text-xs text-muted-foreground text-center", children: "Powered by Clarity Chat" }));
}
// Main app component
export default function App() {
    // Setup analytics provider (optional - can use empty array for no tracking)
    const gaProvider = React.useMemo(() => createGoogleAnalyticsProvider('G-XXXXXXXXXX'), []);
    return (_jsx(AnalyticsProvider, { config: {
            enabled: true,
            providers: [gaProvider], // Add analytics providers here
            autoTrack: {
                pageViews: true,
                errors: true,
            },
        }, children: _jsx(MemoryProvider, { children: _jsx("div", { className: "h-screen flex flex-col", children: _jsx(ChatLayout, { header: _jsx(ChatHeader, {}), sidebar: _jsx(MemorySidebar, {}), footer: _jsx(ChatFooter, {}), variant: "split", children: _jsx(ClarityChat, { api: "/api/chat", theme: "dark", enableMemory: true, memoryStrategy: "vector-store", showTokenCounter: true, showNetworkStatus: true, enableMessageOperations: true, sessionTitle: "Enterprise Chat", sessionSubtitle: "AI Assistant with Memory & Analytics", onMessageSent: (msg) => {
                            console.log('[Analytics] Message sent:', msg.id);
                        }, onMessageReceived: (msg) => {
                            console.log('[Analytics] Message received:', msg.id);
                        }, onError: (error) => {
                            console.error('[Error] Chat error:', error);
                            // Analytics would track this automatically
                        } }) }) }) }) }));
}
//# sourceMappingURL=App.js.map