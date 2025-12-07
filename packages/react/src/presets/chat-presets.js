/**
 * Chat Presets - Pre-configured setups for common use cases
 *
 * These presets provide sensible defaults for different scenarios,
 * making it easy to get started without configuration.
 */
/**
 * Preset configurations for common chat scenarios
 */
export const chatPresets = {
    /**
     * Basic chat - Simple, no-frills chat interface
     */
    basic: {
        autoScroll: true,
        showHeader: false,
    },
    /**
     * Enterprise chat - Full-featured with memory and analytics
     */
    enterprise: {
        autoScroll: true,
        showHeader: true,
        showMessageCount: true,
        memory: {
            enabled: true,
            strategy: 'vector-store',
            retryOnError: true,
        },
    },
    /**
     * Customer support - Optimized for support scenarios
     */
    support: {
        autoScroll: true,
        showHeader: true,
        sessionTitle: 'Customer Support',
        showMessageCount: true,
        memory: {
            enabled: true,
            strategy: 'semantic-chunks',
        },
    },
    /**
     * Code assistant - Optimized for code-related conversations
     */
    codeAssistant: {
        autoScroll: true,
        showHeader: true,
        sessionTitle: 'Code Assistant',
        showMessageCount: false,
    },
    /**
     * Minimal chat - Ultra-minimal interface
     */
    minimal: {
        autoScroll: true,
        showHeader: false,
        showMessageCount: false,
    },
    /**
     * Persistent chat - With localStorage persistence
     */
    persistent: {
        autoScroll: true,
        showHeader: true,
        showMessageCount: true,
    },
};
/**
 * Hook preset configurations
 */
export const hookPresets = {
    /**
     * Basic hook configuration
     */
    basic: {
        stream: true,
    },
    /**
     * Enterprise hook configuration
     */
    enterprise: {
        stream: true,
        memory: {
            enabled: true,
            strategy: 'vector-store',
            retryOnError: true,
            maxRetryAttempts: 3,
        },
        transport: 'sse',
    },
    /**
     * WebSocket configuration
     */
    websocket: {
        stream: true,
        transport: 'websocket',
        websocket: {
            autoReconnect: true,
            maxReconnectAttempts: 5,
            enableHeartbeat: true,
        },
    },
    /**
     * With prompt optimization
     */
    optimized: {
        stream: true,
        promptOptimization: {
            enabled: true,
            strategy: 'hybrid',
            targetTokens: 8000,
        },
    },
};
/**
 * Apply a preset to chat options
 */
export function applyChatPreset(preset, options) {
    return {
        ...chatPresets[preset],
        ...options,
    };
}
/**
 * Apply a preset to hook options
 */
export function applyHookPreset(preset, options) {
    return {
        ...hookPresets[preset],
        ...options,
    };
}
//# sourceMappingURL=chat-presets.js.map