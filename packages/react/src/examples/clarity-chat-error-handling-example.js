import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Clarity Chat Error Handling Example
 *
 * Example demonstrating error handling with useClarityChat,
 * including memory error handling, retry logic, and error display.
 *
 * @example
 * ```tsx
 * import { ClarityChatErrorHandlingExample } from '@clarity-chat/react/examples'
 *
 * function App() {
 *   return <ClarityChatErrorHandlingExample />
 * }
 * ```
 */
import * as React from 'react';
import { useClarityChat } from '../hooks/use-clarity-chat';
import { ChatWindow } from '../components/chat-window';
import { convertCoreMessagesToMessages } from '../utils/message-conversion';
import { ErrorBoundary } from '../components/error-boundary';
import { Badge, Alert, Button } from '@clarity-chat/primitives';
/**
 * Error Display Component
 */
function ErrorDisplay({ errorInfo, onDismiss, }) {
    if (!errorInfo.memoryError)
        return null;
    const getErrorColor = () => {
        switch (errorInfo.memoryErrorType) {
            case 'network':
                return 'yellow';
            case 'ratelimit':
                return 'orange';
            case 'server':
                return 'red';
            case 'auth':
                return 'red';
            default:
                return 'gray';
        }
    };
    const getErrorMessage = () => {
        switch (errorInfo.memoryErrorType) {
            case 'network':
                return 'Network error: Unable to connect to memory service. Retrying...';
            case 'ratelimit':
                return 'Rate limit: Too many memory operations. Please wait.';
            case 'server':
                return 'Server error: Memory service temporarily unavailable.';
            case 'auth':
                return 'Authentication error: Please check your credentials.';
            case 'memory':
                return 'Memory error: Unable to process memory operation.';
            default:
                return `Error: ${errorInfo.memoryError.message}`;
        }
    };
    return (_jsx(Alert, { variant: getErrorColor(), className: "mb-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: errorInfo.memoryErrorOperation || 'unknown' }), _jsx("span", { className: "text-sm font-medium", children: "Memory Operation Failed" })] }), _jsx("p", { className: "text-sm", children: getErrorMessage() })] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onDismiss, className: "ml-2", children: "Dismiss" })] }) }));
}
/**
 * Clarity Chat with Error Handling Example Component
 *
 * Demonstrates comprehensive error handling with useClarityChat:
 * - Memory error callbacks
 * - Error state display
 * - Retry configuration
 * - Error classification
 */
export function ClarityChatErrorHandlingExample() {
    const [dismissedErrors, setDismissedErrors] = React.useState(new Set());
    const { messages: coreMessages, append, isLoading, memoryInfo, memoryErrorInfo, } = useClarityChat({
        api: '/api/chat',
        memory: {
            enabled: true,
            strategy: 'vector-store',
            retryOnError: true,
            maxRetryAttempts: 3,
            onMemoryError: (error, operation) => {
                // Custom error handling
                logger.logger.error(`Memory ${operation} failed:`, error);
                // You could send to error tracking service here
                // trackError('memory_operation_failed', { operation, error: error.message })
            },
        },
    });
    // Convert CoreMessage[] to Message[] for ChatWindow
    const messages = React.useMemo(() => convertCoreMessagesToMessages(coreMessages), [coreMessages]);
    const handleSendMessage = React.useCallback(async (content) => {
        await append({
            role: 'user',
            content,
        });
    }, [append]);
    const handleDismissError = React.useCallback(() => {
        if (memoryErrorInfo.memoryError) {
            const errorKey = `${memoryErrorInfo.memoryErrorOperation}-${memoryErrorInfo.memoryErrorType}`;
            setDismissedErrors((prev) => new Set([...prev, errorKey]));
        }
    }, [memoryErrorInfo]);
    // Check if current error should be displayed
    const shouldShowError = memoryErrorInfo.memoryError &&
        !dismissedErrors.has(`${memoryErrorInfo.memoryErrorOperation}-${memoryErrorInfo.memoryErrorType}`);
    return (_jsx(ErrorBoundary, { children: _jsxs("div", { className: "flex h-screen w-full flex-col", children: [_jsx("div", { className: "border-b bg-card px-4 py-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Chat with Error Handling" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Demonstrates memory error handling and recovery" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [memoryInfo.enabled && (_jsxs(Badge, { variant: "secondary", children: ["Memory: ", memoryInfo.memoryCount, " items"] })), memoryErrorInfo.memoryError && (_jsx(Badge, { variant: "destructive", children: "Error" }))] })] }) }), _jsxs("div", { className: "flex-1 overflow-auto p-4", children: [shouldShowError && (_jsx(ErrorDisplay, { errorInfo: memoryErrorInfo, onDismiss: handleDismissError })), _jsx(ChatWindow, { messages: messages, onSendMessage: handleSendMessage, isLoading: isLoading, showHeader: false })] })] }) }));
}
//# sourceMappingURL=clarity-chat-error-handling-example.js.map