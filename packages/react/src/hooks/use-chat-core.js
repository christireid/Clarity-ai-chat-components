/**
 * useChatCore - Mid-level hook for chat functionality
 *
 * Building block hook that provides core chat functionality without
 * the high-level conveniences. Use this when you need more control
 * than useClarityChat but don't want to wire everything manually.
 *
 * @example
 * ```tsx
 * const chat = useChatCore({ api: '/api/chat' })
 *
 * return (
 *   <ChatWindow
 *     messages={chat.messages}
 *     isLoading={chat.isLoading}
 *     onSendMessage={chat.sendMessage}
 *   />
 * )
 * ```
 */
'use client';
import * as React from 'react';
import { useClarityChat } from './use-clarity-chat';
import { convertCoreMessagesToMessages } from '../utils/message-conversion';
/**
 * useChatCore - Mid-level chat hook
 *
 * Provides core chat functionality with automatic message conversion
 * but without the high-level conveniences of useClarityChat.
 */
export function useChatCore(options = {}) {
    const { autoConvert = true, ...chatOptions } = options;
    const chat = useClarityChat(chatOptions);
    const messages = React.useMemo(() => {
        if (!autoConvert) {
            // Return empty array if not converting
            // User should use chat.messages directly
            return [];
        }
        return convertCoreMessagesToMessages(chat.messages);
    }, [chat.messages, autoConvert]);
    const sendMessage = React.useCallback(async (content) => {
        await chat.append({ role: 'user', content });
    }, [chat]);
    return {
        messages: autoConvert ? messages : [],
        coreMessages: chat.messages,
        sendMessage,
        isLoading: chat.isLoading,
        error: chat.error,
        chat,
    };
}
//# sourceMappingURL=use-chat-core.js.map