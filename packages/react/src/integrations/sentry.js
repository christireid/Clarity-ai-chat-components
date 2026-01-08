import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Sentry Error Tracking Integration
 *
 * Provides hooks and utilities for integrating Sentry error tracking
 * into Clarity Chat applications. Handles AI-specific error contexts
 * and chat-related breadcrumbs.
 *
 * @example
 * ```tsx
 * // Initialize Sentry with Clarity Chat integration
 * import { initSentry, useSentryChat } from '@clarity-chat/react/integrations/sentry'
 *
 * initSentry({
 *   dsn: 'https://...@sentry.io/...',
 *   environment: 'production',
 * })
 *
 * // In your chat component
 * const { captureError, addBreadcrumb } = useSentryChat()
 * ```
 */
import * as React from 'react';
// Global Sentry instance reference (injected at runtime)
let sentryInstance = null;
/**
 * Initialize Sentry with Clarity Chat defaults
 *
 * Call this once at app startup, before rendering.
 */
export function initSentry(options) {
    // Dynamically import Sentry to avoid bundling if not used
    import('@sentry/react')
        .then((Sentry) => {
        sentryInstance = Sentry;
        Sentry.init({
            dsn: options.dsn,
            environment: options.environment ?? 'development',
            release: options.release,
            sampleRate: options.sampleRate ?? 1.0,
            debug: options.debug ?? false,
            ignoreErrors: [
                // Common non-actionable errors
                'ResizeObserver loop limit exceeded',
                'ResizeObserver loop completed with undelivered notifications',
                'Non-Error promise rejection captured',
                // User-initiated cancellations
                'AbortError',
                'User cancelled',
                // Network errors that are expected
                'Failed to fetch',
                'NetworkError',
                'Load failed',
                ...(options.ignoreErrors ?? []),
            ],
            beforeSend(event, hint) {
                // Filter out rate limit errors (expected in AI apps)
                const error = hint?.originalException;
                if (error?.message?.includes('429') ||
                    error?.message?.includes('rate limit')) {
                    return null;
                }
                return event;
            },
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    maskAllText: true,
                    blockAllMedia: true,
                }),
            ],
            tracesSampleRate: 0.1, // 10% of transactions
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0, // 100% of error sessions
        });
        // Add default tags
        Sentry.setTag('clarity_chat', 'true');
        if (options.tags) {
            Object.entries(options.tags).forEach(([key, value]) => {
                Sentry.setTag(key, value);
            });
        }
    })
        .catch((err) => {
        logger.warn('[Clarity Chat] Sentry not available:', err.message);
    });
}
/**
 * Capture an error with AI-specific context
 */
export function captureAIError(error, context) {
    if (!sentryInstance) {
        logger.logger.error('[Clarity Chat] Sentry not initialized:', error);
        return undefined;
    }
    return sentryInstance.withScope((scope) => {
        scope.setTag('error_type', 'ai_error');
        if (context?.provider)
            scope.setTag('ai_provider', context.provider);
        if (context?.model)
            scope.setTag('ai_model', context.model);
        scope.setContext('ai_context', {
            provider: context?.provider,
            model: context?.model,
            messageCount: context?.messageCount,
            tokenCount: context?.tokenCount,
            conversationId: context?.conversationId,
        });
        if (context?.userId) {
            scope.setUser({ id: context.userId });
        }
        return sentryInstance.captureException(error);
    });
}
/**
 * Add a chat-related breadcrumb
 */
export function addChatBreadcrumb(action, data) {
    if (!sentryInstance)
        return;
    sentryInstance.addBreadcrumb({
        category: 'chat',
        message: action,
        level: action === 'error' ? 'error' : 'info',
        data,
        timestamp: Date.now() / 1000,
    });
}
/**
 * React hook for Sentry integration in chat components
 */
export function useSentryChat() {
    const captureError = React.useCallback((error, context) => {
        if (!sentryInstance) {
            logger.logger.error('[Clarity Chat] Sentry error:', error);
            return;
        }
        sentryInstance.withScope((scope) => {
            if (context) {
                Object.entries(context).forEach(([key, value]) => {
                    scope.setExtra(key, value);
                });
            }
            sentryInstance.captureException(error);
        });
    }, []);
    const addBreadcrumb = React.useCallback((action, data) => {
        if (!sentryInstance)
            return;
        sentryInstance.addBreadcrumb({
            category: 'chat',
            message: action,
            level: 'info',
            data,
            timestamp: Date.now() / 1000,
        });
    }, []);
    const setUser = React.useCallback((user) => {
        if (!sentryInstance)
            return;
        sentryInstance.setUser(user);
    }, []);
    const setConversationContext = React.useCallback((conversationId, metadata) => {
        if (!sentryInstance)
            return;
        sentryInstance.setContext('conversation', {
            id: conversationId,
            ...metadata,
        });
    }, []);
    return {
        captureError,
        addBreadcrumb,
        setUser,
        setConversationContext,
    };
}
/**
 * Higher-order component for error boundary with Sentry
 */
export function withSentryErrorBoundary(Component, fallback) {
    return function SentryWrappedComponent(props) {
        if (!sentryInstance) {
            return _jsx(Component, { ...props });
        }
        const ErrorBoundary = sentryInstance.ErrorBoundary;
        return (_jsx(ErrorBoundary, { fallback: fallback ?? (_jsx("div", { className: "p-4 text-center text-muted-foreground", children: "Something went wrong. Please try again." })), children: _jsx(Component, { ...props }) }));
    };
}
/**
 * Start a Sentry transaction for AI operations
 */
export function startAITransaction(name, operation) {
    if (!sentryInstance)
        return null;
    const transaction = sentryInstance.startInactiveSpan({
        name,
        op: operation,
    });
    return {
        finish: () => transaction?.end(),
    };
}
export default {
    initSentry,
    captureAIError,
    addChatBreadcrumb,
    useSentryChat,
    withSentryErrorBoundary,
    startAITransaction,
};
//# sourceMappingURL=sentry.js.map