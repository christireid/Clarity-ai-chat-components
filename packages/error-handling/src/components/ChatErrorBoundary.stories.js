import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChatErrorBoundary } from './ChatErrorBoundary';
import { StreamingError } from '../errors/streaming-error';
import { ProviderError } from '../errors/provider-error';
import { ApiError, ApiErrorCode } from '../errors/api-error';
const meta = {
    title: 'Components/ChatErrorBoundary',
    component: ChatErrorBoundary,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        chatId: {
            control: 'text',
            description: 'Chat session ID for error context',
        },
        provider: {
            control: 'select',
            options: ['openai', 'anthropic', 'google', 'azure', 'cohere'],
            description: 'AI provider name for error context',
        },
    },
};
export default meta;
// Component that throws an error
function ThrowError({ error }) {
    throw error || new Error('Something went wrong!');
}
// Mock chat interface
function MockChatInterface({ errorFactory }) {
    const [shouldThrow, setShouldThrow] = useState(false);
    const [messages] = useState([
        { role: 'user', content: 'Hello, how are you?' },
        { role: 'assistant', content: 'I am doing well, thank you for asking!' },
        { role: 'user', content: 'Can you help me with something?' },
    ]);
    if (shouldThrow) {
        throw errorFactory?.() || new Error('Chat error');
    }
    return (_jsxs("div", { style: {
            width: '400px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
        }, children: [_jsx("div", { style: {
                    background: '#f9fafb',
                    padding: '1rem',
                    borderBottom: '1px solid #e5e7eb',
                }, children: _jsx("h3", { style: { margin: 0 }, children: "Chat Demo" }) }), _jsx("div", { style: { padding: '1rem', minHeight: '200px' }, children: messages.map((msg, i) => (_jsx("div", { style: {
                        marginBottom: '0.5rem',
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                    }, children: _jsx("span", { style: {
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '1rem',
                            background: msg.role === 'user' ? '#3b82f6' : '#e5e7eb',
                            color: msg.role === 'user' ? 'white' : 'black',
                        }, children: msg.content }) }, i))) }), _jsxs("div", { style: {
                    padding: '1rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    gap: '0.5rem',
                }, children: [_jsx("input", { type: "text", placeholder: "Type a message...", style: {
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #d1d5db',
                        } }), _jsx("button", { onClick: () => setShouldThrow(true), style: {
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }, children: "Simulate Error" })] })] }));
}
export const Default = {
    args: {
        chatId: 'chat-123',
        provider: 'openai',
        children: _jsx(ThrowError, {}),
    },
};
export const StreamingConnectionError = {
    args: {
        chatId: 'chat-456',
        provider: 'openai',
        children: _jsx(ThrowError, { error: StreamingError.connectionLost('sse') }),
        onError: (error) => console.log('Chat error:', error),
    },
};
export const StreamingErrorWithPartialContent = {
    args: {
        chatId: 'chat-789',
        provider: 'anthropic',
        children: (_jsx(ThrowError, { error: StreamingError.connectionLost('sse', {
                partialContent: 'The answer to life, the universe, and everything is 42. This is a reference to...',
            }) })),
        onError: (error) => console.log('Chat error with partial content:', error),
    },
};
export const ProviderRateLimitError = {
    args: {
        chatId: 'chat-rate',
        provider: 'openai',
        children: (_jsx(ThrowError, { error: ProviderError.rateLimit('openai', 30, 'gpt-4-turbo') })),
        onRetry: () => console.log('Retrying after rate limit...'),
    },
};
export const ProviderContentFilterError = {
    args: {
        chatId: 'chat-filter',
        provider: 'anthropic',
        children: (_jsx(ThrowError, { error: ProviderError.contentFiltered('anthropic', 'claude-3-opus') })),
    },
};
export const ProviderContextLengthError = {
    args: {
        chatId: 'chat-context',
        provider: 'openai',
        children: (_jsx(ThrowError, { error: ProviderError.contextLengthExceeded('openai', 128000, 150000, 'gpt-4-turbo') })),
    },
};
export const ProviderServiceUnavailable = {
    args: {
        chatId: 'chat-unavailable',
        provider: 'google',
        children: _jsx(ThrowError, { error: ProviderError.serviceUnavailable('google') }),
    },
};
export const GenericApiError = {
    args: {
        chatId: 'chat-api',
        provider: 'openai',
        children: (_jsx(ThrowError, { error: new ApiError('Failed to send message', {
                code: ApiErrorCode.SERVER_ERROR,
                statusCode: 500,
                recoverable: true,
            }) })),
        onRetry: () => console.log('Retrying API call...'),
    },
};
export const InteractiveDemo = {
    args: {
        chatId: 'interactive-chat',
        provider: 'openai',
        children: (_jsx(MockChatInterface, { errorFactory: () => StreamingError.connectionLost('sse') })),
        onError: (error) => console.log('Demo error:', error),
        onRetry: () => console.log('Demo retry triggered'),
    },
};
export const InteractiveProviderError = {
    args: {
        chatId: 'interactive-provider',
        provider: 'anthropic',
        children: (_jsx(MockChatInterface, { errorFactory: () => ProviderError.rateLimit('anthropic', 60, 'claude-3-sonnet') })),
        onError: (error) => console.log('Provider error:', error),
        onRetry: () => console.log('Provider retry triggered'),
    },
};
export const WithCallbacks = {
    args: {
        chatId: 'callback-chat',
        provider: 'openai',
        children: _jsx(ThrowError, { error: StreamingError.connectionLost('sse') }),
        onError: (error) => {
            console.log('Error logged to analytics:', error.message);
        },
        onRetry: () => {
            console.log('User initiated retry - reconnecting...');
        },
    },
};
export const MultipleChatBoundaries = {
    render: () => (_jsxs("div", { style: { display: 'flex', gap: '1rem' }, children: [_jsx(ChatErrorBoundary, { chatId: "chat-1", provider: "openai", children: _jsx(MockChatInterface, { errorFactory: () => StreamingError.connectionLost('sse') }) }), _jsx(ChatErrorBoundary, { chatId: "chat-2", provider: "anthropic", children: _jsx(MockChatInterface, { errorFactory: () => ProviderError.rateLimit('anthropic', 45) }) })] })),
};
//# sourceMappingURL=ChatErrorBoundary.stories.js.map