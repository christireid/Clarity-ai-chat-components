import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/**
 * Testing Utilities for useClarityChat
 *
 * Mock implementations and test helpers for testing components using useClarityChat
 */
/* global RequestInfo, RequestInit */
import * as React from 'react';
/**
 * Mock implementation of useClarityChat for testing
 *
 * Note: This creates a static mock object without React hooks.
 * For tests that need reactive state, use the provided setters with jest/vitest mocks.
 */
export function createMockUseClarityChat(overrides) {
    // Create mutable state containers for testing
    let messages = overrides?.messages || [];
    let input = overrides?.input || '';
    let isLoading = overrides?.isLoading || false;
    const setMessages = overrides?.setMessages ||
        ((newMessages) => {
            if (typeof newMessages === 'function') {
                messages = newMessages(messages);
            }
            else {
                messages = newMessages;
            }
        });
    const setInput = overrides?.setInput ||
        ((newInput) => {
            if (typeof newInput === 'function') {
                input = newInput(input);
            }
            else {
                input = newInput;
            }
        });
    return {
        messages,
        setMessages,
        append: overrides?.append ||
            (async () => {
                isLoading = true;
                await new Promise((resolve) => setTimeout(resolve, 100));
                isLoading = false;
                return 'mock-message-id';
            }),
        reload: overrides?.reload ||
            (async () => {
                isLoading = true;
                await new Promise((resolve) => setTimeout(resolve, 100));
                isLoading = false;
                return 'mock-message-id';
            }),
        stop: overrides?.stop || (() => { }),
        handleSubmit: overrides?.handleSubmit || (() => { }),
        input,
        setInput,
        isLoading,
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
 * Counter for unique test message ID generation
 */
let testMessageCounter = 0;
/**
 * Generate a unique test message ID
 */
function generateTestMessageId(prefix) {
    const timestamp = Date.now();
    const counter = testMessageCounter++;
    const random = Math.random().toString(36).substring(2, 6);
    return `${prefix}-${timestamp}-${counter}-${random}`;
}
/**
 * Create a test user message
 */
export function createTestUserMessage(content) {
    return {
        id: generateTestMessageId('user'),
        role: 'user',
        content,
    };
}
/**
 * Create a test assistant message
 */
export function createTestAssistantMessage(content) {
    return {
        id: generateTestMessageId('assistant'),
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