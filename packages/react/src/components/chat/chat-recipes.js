/**
 * Chat Recipe Components - Pre-built combinations for common patterns
 *
 * These components combine multiple features for common use cases,
 * making it even easier to get started.
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { ClarityChat } from './clarity-chat';
import { ErrorBoundary } from '../feedback/error-boundary';
import { applyChatPreset } from '../../presets/chat-presets';
import { validateApiEndpoint, validateEnum, } from '../../utils/config/runtime-validation';
export function ChatWithMemory({ strategy = 'vector-store', maxTokens, ...props }) {
    // Runtime validation with developer-friendly errors
    validateApiEndpoint(props.api, 'ChatWithMemory');
    // Validate strategy
    const validStrategies = [
        'sliding-window',
        'semantic-chunks',
        'vector-store',
    ];
    const validatedStrategy = validateEnum(strategy, 'strategy', 'ChatWithMemory', validStrategies, 'vector-store');
    return (_jsx(ClarityChat, { ...props, memory: {
            enabled: true,
            strategy: validatedStrategy,
            maxTokens,
            retryOnError: true,
        } }));
}
export function ChatWithAnalytics({ onMessageSent, onMessageReceived, onError, ...props }) {
    const handleSendMessage = React.useCallback(async (content) => {
        onMessageSent?.(content);
        // Note: This is a simplified version - in practice, you'd wrap the actual send
        // For full analytics, use useClarityChatWithAnalytics hook
    }, [onMessageSent]);
    return (_jsx(ClarityChat, { ...props, onMessageCopy: (id, content) => {
            onMessageReceived?.(id);
            props.onMessageCopy?.(id, content);
        } }));
}
export function ChatWithPreset({ preset, ...props }) {
    const presetOptions = applyChatPreset(preset, props);
    return _jsx(ClarityChat, { ...presetOptions });
}
export function ChatWithPersistence({ storageKey = 'clarity-chat', persist = true, ...props }) {
    // Note: This is a wrapper - actual persistence would be handled by useChat hook
    // This component exists for API consistency
    return _jsx(ClarityChat, { ...props, chatId: storageKey });
}
export function ChatWithErrorHandling({ errorFallback, onError, ...props }) {
    return (_jsx(ErrorBoundary, { fallback: errorFallback, onError: onError, children: _jsx(ClarityChat, { ...props }) }));
}
export function ChatComplete({ memoryStrategy = 'vector-store', errorBoundary = true, storageKey = 'clarity-chat-complete', onMessageSent, onMessageReceived, onError, ...props }) {
    const chatComponent = (_jsx(ClarityChat, { ...props, chatId: storageKey, memory: {
            enabled: true,
            strategy: memoryStrategy,
            retryOnError: true,
        } }));
    if (!errorBoundary) {
        return chatComponent;
    }
    return (_jsx(ErrorBoundary, { onError: (error, errorInfo) => {
            onError?.(error);
            console.error('[ChatComplete] Error:', error, errorInfo);
        }, children: chatComponent }));
}
//# sourceMappingURL=chat-recipes.js.map