import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Simple Chat with Hook - More Control
 *
 * If you need more control, use the hook directly.
 * ChatWindow now accepts CoreMessage[] directly - no conversion needed!
 */
import { useClarityChat, ChatWindow } from '@clarity-chat/react';
import '@clarity-chat/react/styles.css';
export function SimpleChatWithHook() {
    const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
    });
    return (_jsx(ChatWindow, { messages: messages, isLoading: isLoading, onSendMessage: (content) => append({ role: 'user', content }) }));
}
//# sourceMappingURL=simple-chat-with-hook.js.map