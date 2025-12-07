import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/**
 * Testing Utilities for useClarityChat
 *
 * Mock implementations and test helpers for testing components using useClarityChat
 */
import * as React from 'react';
/**
 * Mock implementation of useClarityChat for testing
 */
export function createMockUseClarityChat(overrides) {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    return {
        messages: overrides?.messages || messages,
        setMessages: overrides?.setMessages || setMessages,
        append: overrides?.append || (async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            setIsLoading(false);
            return 'mock-message-id';
        }),
        reload: overrides?.reload || (async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            setIsLoading(false);
            return 'mock-message-id';
        }),
        stop: overrides?.stop || (() => { }),
        handleSubmit: overrides?.handleSubmit || (() => { }),
        input: overrides?.input || input,
        setInput: overrides?.setInput || setInput,
        isLoading: overrides?.isLoading || isLoading,
        error: overrides?.error,
        data: overrides?.data,
        abort: overrides?.abort || (() => { }),
        memoryInfo: overrides?.memoryInfo || {
            memoryCount: 0,
            enabled: false,
        },
        memoryErrorInfo: overrides?.memoryErrorInfo || {
            memoryError: null,
            memoryErrorOperation: null,
            memoryErrorType: null,
        },
    };
}
/**
 * Test wrapper component that provides mock useClarityChat
 */
export function MockClarityChatProvider({ children, mockReturn, }) {
    // This is a placeholder - in actual tests, you'd use a mocking library
    // like @testing-library/react-hooks or jest.mock
    return _jsx(_Fragment, { children: children });
}
/**
 * Create test messages
 */
export function createTestMessages() {
    return [
        {
            id: '1',
            role: 'user',
            content: 'Hello, how are you?',
        },
        {
            id: '2',
            role: 'assistant',
            content: 'I am doing well, thank you! How can I help you today?',
        },
        {
            id: '3',
            role: 'user',
            content: 'What is the weather like?',
        },
    ];
}
/**
 * Create a test user message
 */
export function createTestUserMessage(content) {
    return {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
    };
}
/**
 * Create a test assistant message
 */
export function createTestAssistantMessage(content) {
    return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content,
    };
}
/**
 * Wait for async operations in tests
 */
export async function waitForChatUpdate(delay = 100) {
    await new Promise((resolve) => setTimeout(resolve, delay));
}
/**
 * Simulate streaming response
 */
export async function simulateStreamingResponse(chunks, onChunk) {
    let fullContent = '';
    for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        fullContent += chunk;
        onChunk?.(chunk);
    }
    return fullContent;
}
/**
 * Mock fetch for API calls
 */
export function createMockFetch(responses) {
    return async (input, init) => {
        const url = typeof input === 'string' ? input : input.toString();
        const response = responses[url];
        if (!response) {
            throw new Error(`No mock response for ${url}`);
        }
        return typeof response === 'function' ? response() : response;
    };
}
/**
 * Create mock streaming response
 */
export function createMockStreamingResponse(content, chunkSize = 10) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            for (let i = 0; i < content.length; i += chunkSize) {
                const chunk = content.slice(i, i + chunkSize);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
        },
    });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
        },
    });
}
/**
 * Test helper: Assert message structure
 */
export function assertMessageStructure(message) {
    expect(message).toHaveProperty('id');
    expect(message).toHaveProperty('role');
    expect(message).toHaveProperty('content');
    expect(['user', 'assistant', 'system']).toContain(message.role);
}
/**
 * Test helper: Assert chat state
 */
export function assertChatState(chat, expected) {
    if (expected.messageCount !== undefined) {
        expect(chat.messages).toHaveLength(expected.messageCount);
    }
    if (expected.isLoading !== undefined) {
        expect(chat.isLoading).toBe(expected.isLoading);
    }
    if (expected.hasError !== undefined) {
        expect(!!chat.error).toBe(expected.hasError);
    }
    if (expected.memoryEnabled !== undefined) {
        expect(chat.memoryInfo.enabled).toBe(expected.memoryEnabled);
    }
}
//# sourceMappingURL=use-clarity-chat-test-utils.js.map