import { jsx as _jsx } from "react/jsx-runtime";
import { ClarityChat } from './clarity-chat';
import { ErrorBoundary } from './error-boundary';
/**
 * ChatWithErrorBoundary - Chat component with automatic error handling
 *
 * This component wraps ClarityChat with an ErrorBoundary to catch and handle
 * errors gracefully. Perfect for production applications.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ChatWithErrorBoundary api="/api/chat" />
 *
 * // With custom error handling
 * <ChatWithErrorBoundary
 *   api="/api/chat"
 *   onError={(error) => {
 *     // Send to error tracking service
 *     trackError(error)
 *   }}
 *   errorFallback={(error, reset) => (
 *     <div>
 *       <p>Something went wrong: {error.message}</p>
 *       <button onClick={reset}>Try Again</button>
 *     </div>
 *   )}
 * />
 * ```
 */
export function ChatWithErrorBoundary({ errorFallback, onError, resetKeys, ...chatProps }) {
    return (_jsx(ErrorBoundary, { fallback: errorFallback, onError: onError, resetKeys: resetKeys, children: _jsx(ClarityChat, { ...chatProps }) }));
}
ChatWithErrorBoundary.displayName = 'ChatWithErrorBoundary';
//# sourceMappingURL=chat-with-error-boundary.js.map