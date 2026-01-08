import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Button } from '@clarity-chat/primitives';
import { cn } from '@clarity-chat/primitives';
/**
 * StreamCancellation component provides a UI for canceling active streams.
 * Displays a cancel button with optional progress indicator during streaming.
 *
 * **Features:**
 * - Accessible cancel button with keyboard support
 * - Optional progress indicator with animation
 * - Customizable appearance (icon-only, size, label)
 * - Auto-hide when not streaming
 *
 * **Use Cases:**
 * - Cancel SSE streaming responses
 * - Abort WebSocket message streams
 * - Stop long-running AI generations
 *
 * @example
 * ```tsx
 * const Chat = () => {
 *   const { status, disconnect } = useStreamingSSE({
 *     url: '/api/chat/stream',
 *     // ... other options
 *   })
 *
 *   return (
 *     <div>
 *       <StreamCancellation
 *         isStreaming={status === 'streaming'}
 *         onCancel={disconnect}
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function StreamCancellation({ isStreaming, onCancel, cancelLabel = 'Cancel', iconOnly = false, size = 'default', className, showProgress = true, progressMessage = 'Streaming...', }) {
    if (!isStreaming)
        return null;
    return (_jsxs("div", { className: cn('flex items-center gap-3', className), children: [showProgress && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" }), _jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" }), _jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-primary" })] }), !iconOnly && (_jsx("span", { className: "text-sm text-muted-foreground", children: progressMessage }))] })), _jsxs(Button, { variant: "outline", size: size, onClick: onCancel, className: "gap-2", "aria-label": "Cancel stream", children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: _jsx("rect", { x: "3", y: "3", width: "10", height: "10", rx: "2" }) }), !iconOnly && _jsx("span", { children: cancelLabel })] })] }));
}
StreamCancellation.displayName = 'StreamCancellation';
//# sourceMappingURL=stream-cancellation.js.map