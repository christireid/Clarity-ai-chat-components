import { jsx as _jsx } from "react/jsx-runtime";
import { ClarityChat } from './clarity-chat';
/**
 * Preset configurations for common use cases
 *
 * Each preset wraps ClarityChat with sensible defaults for specific use cases.
 * All presets require an `api` prop and accept all other ClarityChat props.
 */
export const ClarityChatPresets = {
    /**
     * Simple chat - minimal configuration
     *
     * @example
     * ```tsx
     * <ClarityChatPresets.Simple api="/api/chat" />
     * ```
     */
    Simple: (props) => (_jsx(ClarityChat, { ...props })),
    /**
     * Chat with memory - context-aware conversations
     *
     * Enables memory management with configurable strategy.
     *
     * @param props - ClarityChat props with memory-specific additions
     * @param props.api - API endpoint URL (required)
     * @param props.memoryStrategy - Memory strategy: 'sliding-window' (default), 'semantic-chunks', or 'vector-store'
     *
     * @example
     * ```tsx
     * <ClarityChatPresets.WithMemory
     *   api="/api/chat"
     *   memoryStrategy="vector-store"
     * />
     * ```
     */
    WithMemory: (props) => (_jsx(ClarityChat, { ...props, memory: {
            enabled: true,
            strategy: props.memoryStrategy || 'sliding-window',
            maxTokens: 4000,
        } })),
    /**
     * Enterprise chat - full-featured with all options
     *
     * Includes memory, prompt optimization, header, and message count.
     * Optimized for production enterprise use cases.
     *
     * @param props - ClarityChat props
     * @param props.api - API endpoint URL (required)
     *
     * @example
     * ```tsx
     * <ClarityChatPresets.Enterprise
     *   api="/api/chat"
     *   sessionTitle="Enterprise Assistant"
     * />
     * ```
     */
    Enterprise: (props) => (_jsx(ClarityChat, { ...props, showHeader: true, showMessageCount: true, memory: {
            enabled: true,
            strategy: 'vector-store',
            maxTokens: 10000,
        }, promptOptimization: {
            enabled: true,
            strategy: 'hybrid',
        } })),
    /**
     * Streaming chat - optimized for real-time updates
     *
     * Configured for optimal streaming performance with SSE (default) or WebSocket.
     *
     * @param props - ClarityChat props with transport option
     * @param props.api - API endpoint URL (required)
     * @param props.useWebSocket - Use WebSocket instead of SSE (default: false)
     *
     * @example
     * ```tsx
     * // SSE (default)
     * <ClarityChatPresets.Streaming api="/api/chat" />
     *
     * // WebSocket
     * <ClarityChatPresets.Streaming api="/api/chat" useWebSocket />
     * ```
     */
    Streaming: (props) => (_jsx(ClarityChat, { ...props, transport: props.useWebSocket ? 'websocket' : 'sse' })),
};
//# sourceMappingURL=clarity-chat-presets.js.map