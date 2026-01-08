'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { logger } from '@clarity-chat/utils/logger';
/**
 * PromptArchitectErrorBoundary
 *
 * Error boundary wrapper specifically for the Prompt Architect Studio.
 * This is a thin wrapper around the base ErrorBoundary with custom
 * fallback UI.
 *
 * @see {@link ../../../../components/feedback/error-boundary.tsx} for the base implementation
 */
import * as React from 'react';
import { ErrorBoundary } from '../../../feedback/error-boundary';
import { ErrorFallback } from './ErrorFallback';
/**
 * Error boundary for the Prompt Architect demo
 *
 * Uses the base ErrorBoundary with a custom fallback UI styled
 * for the PromptArchitect context.
 */
export function PromptArchitectErrorBoundary({ children, fallback, onError, onReset, }) {
    // Use custom fallback or default ErrorFallback
    const renderFallback = React.useCallback((error, resetError) => {
        if (fallback) {
            return fallback({ error, resetError });
        }
        return _jsx(ErrorFallback, { error: error, resetError: resetError });
    }, [fallback]);
    return (_jsx(ErrorBoundary, { fallback: renderFallback, onError: onError, onReset: onReset, logError: (error, errorInfo) => {
            // Log to console in development with PromptArchitect context
            if (process.env.NODE_ENV === 'development') {
                console.error('[PromptArchitect] Error caught:', error);
                console.error('[PromptArchitect] Error info:', errorInfo);
            }
        }, children: children }));
}
export default PromptArchitectErrorBoundary;
//# sourceMappingURL=PromptArchitectErrorBoundary.js.map