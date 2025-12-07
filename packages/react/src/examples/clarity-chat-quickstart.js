import { jsx as _jsx } from "react/jsx-runtime";
/**
 * ClarityChat Quickstart Example
 *
 * This demonstrates the simplest way to use Clarity Chat - just one component!
 */
import { ClarityChat } from '../components/clarity-chat';
import '@clarity-chat/react/dist/styles/index.css';
/**
 * Minimal Example - Just provide an API endpoint
 */
export function MinimalExample() {
    return (_jsx("div", { style: { height: '600px', width: '100%', maxWidth: '800px' }, children: _jsx(ClarityChat, { api: "/api/chat" }) }));
}
/**
 * With Custom Styling
 */
export function StyledExample() {
    return (_jsx("div", { style: { height: '100vh' }, children: _jsx(ClarityChat, { api: "/api/chat", className: "h-full", showHeader: true, sessionTitle: "My AI Assistant", sessionSubtitle: "Powered by Clarity Chat" }) }));
}
/**
 * With Memory Enabled
 */
export function WithMemoryExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ClarityChat, { api: "/api/chat", memory: {
                enabled: true,
                strategy: 'vector-store',
            } }) }));
}
/**
 * With All Features
 */
export function FullFeaturedExample() {
    return (_jsx("div", { style: { height: '600px' }, children: _jsx(ClarityChat, { api: "/api/chat", chatId: "my-chat-session", showHeader: true, sessionTitle: "Full Featured Chat", showMessageCount: true, onMessageCopy: (id, content) => {
                console.log('Message copied:', id, content);
            }, onMessageFeedback: (id, type) => {
                console.log('Feedback:', id, type);
            }, onExport: () => {
                console.log('Export conversation');
            }, onClear: () => {
                console.log('Clear conversation');
            }, memory: {
                enabled: true,
                strategy: 'vector-store',
            } }) }));
}
//# sourceMappingURL=clarity-chat-quickstart.js.map