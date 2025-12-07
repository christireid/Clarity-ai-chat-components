import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Customized Chat Example
 *
 * Shows how to customize ClarityChat with different options.
 */
import { ClarityChat } from '@clarity-chat/react';
import '@clarity-chat/react/dist/styles/index.css';
export default function App() {
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' }, children: [_jsx("h1", { children: "Customized Chat Example" }), _jsx(ClarityChat, { api: "/api/chat", theme: "dark", enableMemory: true, showTokenCounter: true, showHeader: true, sessionTitle: "My AI Assistant", sessionSubtitle: "Ask me anything!", onMessageSent: (msg) => {
                    console.log('Message sent:', msg.content);
                }, onMessageReceived: (msg) => {
                    console.log('Message received:', msg.content);
                }, onError: (error) => {
                    console.error('Chat error:', error);
                } })] }));
}
//# sourceMappingURL=App.js.map