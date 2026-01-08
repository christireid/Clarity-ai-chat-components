'use client';
import * as React from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { isClarityError } from '../errors/base-error';
/**
 * Unified error handling hook for components
 * Integrates with error boundaries and provides async error handling
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { handleAsync, error, clearError } = useEnhancedErrorHandler();
 *
 *   const sendMessage = async () => {
 *     const result = await handleAsync(api.sendMessage(input));
 *     if (result) {
 *       // Success
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={sendMessage}>
 *       {error && (
 *         <div>
 *           <p>{error.message}</p>
 *           <button onClick={clearError}>Dismiss</button>
 *         </div>
 *       )}
 *       <input ... />
 *     </form>
 *   );
 * }
 * ```
 */
export function useEnhancedErrorHandler(options = {}) {
    const { onError, showBoundary = false, logInDev = true } = options;
    const { showBoundary: triggerBoundary, resetBoundary } = useErrorBoundary();
    const [error, setError] = React.useState(null);
    const handleError = React.useCallback((rawError) => {
        // Normalize to Error object
        const normalizedError = rawError instanceof Error ? rawError : new Error(String(rawError));
        // Log in development
        if (logInDev && process.env['NODE_ENV'] === 'development') {
            console.error('[useEnhancedErrorHandler]', normalizedError);
            if (isClarityError(normalizedError)) {
                console.error('Details:', normalizedError.toJSON());
            }
        }
        // Set local state
        setError(normalizedError);
        // Trigger callback
        onError?.(normalizedError);
        // Optionally trigger error boundary
        if (showBoundary) {
            triggerBoundary(normalizedError);
        }
    }, [logInDev, onError, showBoundary, triggerBoundary]);
    const handleAsync = React.useCallback(async (promise) => {
        try {
            setError(null);
            return await promise;
        }
        catch (err) {
            handleError(err);
            return undefined;
        }
    }, [handleError]);
    const withErrorHandling = React.useCallback((fn) => {
        return async (...args) => {
            try {
                setError(null);
                const result = fn(...args);
                return result instanceof Promise ? await result : result;
            }
            catch (err) {
                handleError(err);
                return undefined;
            }
        };
    }, [handleError]);
    const clearError = React.useCallback(() => {
        setError(null);
        resetBoundary();
    }, [resetBoundary]);
    const hasError = error !== null;
    const isRecoverable = error !== null && isClarityError(error) && error.recoverable;
    return {
        handleError,
        handleAsync,
        withErrorHandling,
        clearError,
        error,
        hasError,
        isRecoverable,
    };
}
//# sourceMappingURL=useEnhancedErrorHandler.js.map