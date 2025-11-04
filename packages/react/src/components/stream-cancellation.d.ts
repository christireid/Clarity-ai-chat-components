import * as React from 'react';
/**
 * Props for StreamCancellation component
 */
export interface StreamCancellationProps {
    /** Whether stream is currently active */
    isStreaming: boolean;
    /** Callback when cancel is clicked */
    onCancel: () => void;
    /** Custom label for cancel button (default: "Cancel") */
    cancelLabel?: string;
    /** Show as icon-only button (default: false) */
    iconOnly?: boolean;
    /** Button size */
    size?: 'default' | 'sm' | 'lg' | 'icon';
    /** Custom className */
    className?: string;
    /** Show progress indicator (default: true) */
    showProgress?: boolean;
    /** Progress message (e.g., "Streaming...") */
    progressMessage?: string;
}
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
export declare const StreamCancellation: React.NamedExoticComponent<StreamCancellationProps>;
//# sourceMappingURL=stream-cancellation.d.ts.map