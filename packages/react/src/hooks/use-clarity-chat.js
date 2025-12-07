/**
 * useClarityChat - Top-Level Chat State Hook
 *
 * This is the primary public API for chat functionality in Clarity.
 * It wraps useChatEnhanced with Clarity-specific enhancements including
 * memory integration and transport selection.
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat State
 *
 * For Vercel AI SDK compatibility, use mid-level `useChatEnhanced` instead.
 * For raw state management, use low-level `useChat`.
 *
 * @example
 * ```tsx
 * const { messages, append, isLoading, error } = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true, strategy: 'vector-store' },
 * })
 * ```
 *
 * @example
 * ```tsx
 * // With handlers for easier integration
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 *
 * <ChatWindow
 *   messages={chat.messages}
 *   onSendMessage={handlers.onSendMessage}
 * />
 * ```
 */
'use client';
import * as React from 'react';
import { useChat as useChatEnhanced, } from './use-chat-enhanced';
import { MemoryContext } from '../memory/memory-provider';
// Prompt optimization imports
import { buildModelPrompt } from '../prompt/core/builder';
import { MODEL_PRESETS } from '../prompt/core/tokenizer';
/**
 * Safe hook to get memory context without throwing
 * Returns null if MemoryProvider is not available
 * This satisfies React hooks rules by always calling useContext unconditionally
 */
function useMemorySafe() {
    return React.useContext(MemoryContext);
}
// Import unified error handling
import { classifyError as classifyErrorUtil } from '../utils/error-handling';
/**
 * Classify error type for better error handling
 * @deprecated Use classifyError from utils/error-handling instead
 */
function classifyError(error) {
    return classifyErrorUtil(error);
}
/**
 * Retry an async operation with exponential backoff
 */
async function retryOperation(operation, maxAttempts = 2, delayMs = 1000) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Don't retry on last attempt
            if (attempt < maxAttempts) {
                // Exponential backoff: delayMs * 2^(attempt-1)
                const delay = delayMs * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError || new Error('Operation failed after retries');
}
/**
 * useClarityChat - Top-Level Chat State Hook
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat State
 *
 * Wraps useChatEnhanced with Clarity-specific features:
 * - Memory integration (optional)
 * - Transport selection (SSE/WebSocket)
 * - Prompt optimization
 * - Better defaults for production use
 *
 * @param options - Configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.memory - Memory configuration (optional)
 * @param options.transport - Transport protocol: 'sse' (default) or 'websocket'
 * @param options.promptOptimization - Prompt optimization configuration (optional)
 * @returns Chat state and methods with memory info and token stats
 *
 * @example
 * ```tsx
 * // Simple usage
 * const chat = useClarityChat({ api: '/api/chat' })
 *
 * // With memory
 * const chat = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true, strategy: 'vector-store' },
 * })
 *
 * // With handlers for easier integration
 * const handlers = useChatHandlers({ chat })
 * <ChatWindow messages={chat.messages} onSendMessage={handlers.onSendMessage} />
 * ```
 *
 * @throws {Error} If API endpoint is invalid or missing
 */
export function useClarityChat(options = {}) {
    // Validate API endpoint
    if (!options.api || typeof options.api !== 'string' || options.api.trim().length === 0) {
        throw new Error('useClarityChat: "api" option is required.\n' +
            'Please provide your API endpoint URL.\n\n' +
            'Example:\n' +
            '  const chat = useClarityChat({ api: "/api/chat" })\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/getting-started');
    }
    const { memory, transport, promptOptimization, ...rest } = options;
    // Get memory context safely (returns null if MemoryProvider is not available)
    // This hook always runs unconditionally, satisfying React hooks rules
    const memoryContext = useMemorySafe();
    // Configure transport protocol
    // For WebSocket, use 'data' protocol (useChatEnhanced will handle it)
    // For SSE, use 'sse' protocol (default, Vercel-compatible)
    const streamProtocol = transport === 'websocket' ? 'data' : 'sse';
    // Store memory context in a ref for synchronous access in transform
    const memoryContextRef = React.useRef('');
    const lastQueryRef = React.useRef('');
    // Track optimized messages and token stats for prompt optimization
    const [optimizedMessagesState, setOptimizedMessagesState] = React.useState({ messages: [] });
    // Enhanced transform function to enrich messages with memory context and optimize
    const originalTransform = rest.transform;
    const enhancedTransform = React.useCallback(async (messages) => {
        let enrichedMessages = messages;
        // Apply original transform if provided
        if (originalTransform) {
            enrichedMessages = originalTransform(enrichedMessages);
        }
        // Enrich with memory context if available (from ref)
        if (memory?.enabled && memoryContextRef.current) {
            enrichedMessages = [
                {
                    role: 'system',
                    content: `Relevant context from memory:\n${memoryContextRef.current}`,
                },
                ...enrichedMessages,
            ];
        }
        // Apply prompt optimization if enabled
        if (promptOptimization?.enabled) {
            try {
                const modelMetadata = promptOptimization.model
                    ? (MODEL_PRESETS[promptOptimization.model] || {
                        model: promptOptimization.model,
                        maxTokens: promptOptimization.targetTokens || 8192,
                    })
                    : MODEL_PRESETS['gpt-4'];
                const result = await buildModelPrompt({
                    toonNodes: undefined,
                    variables: {},
                    memoryContext: memoryContextRef.current || undefined,
                    userInput: undefined,
                    modelMetadata,
                    messages: enrichedMessages,
                    targetTokens: promptOptimization.targetTokens,
                    optimization: {
                        enabled: true,
                        strategy: promptOptimization.strategy || 'hybrid',
                        priorities: promptOptimization.priorities,
                        summarizeFn: promptOptimization.summarizeFn,
                        keepRecent: promptOptimization.keepRecent || 2,
                    },
                });
                // Use optimized messages, but preserve the structure
                enrichedMessages = result.messages.length > 0 ? result.messages : enrichedMessages;
                // Update token stats
                setOptimizedMessagesState({
                    messages: enrichedMessages,
                    tokenStats: {
                        inputTokens: result.tokenStats.inputTokens,
                        remainingBudget: result.tokenStats.remainingBudget,
                        utilization: result.tokenStats.utilization,
                        lastOptimizationReason: result.optimizationDiagnostics
                            ? result.optimizationDiagnostics.details.join(', ')
                            : undefined,
                        wasOptimized: result.optimizationDiagnostics !== undefined,
                    },
                });
            }
            catch (error) {
                console.warn('[useClarityChat] Prompt optimization failed:', error);
                // Fall back to non-optimized messages
            }
        }
        return enrichedMessages;
    }, [
        memory?.enabled,
        originalTransform,
        promptOptimization?.enabled,
        promptOptimization?.targetTokens,
        promptOptimization?.strategy,
        promptOptimization?.priorities,
        promptOptimization?.summarizeFn,
        promptOptimization?.keepRecent,
        promptOptimization?.model,
    ]);
    // Synchronous transform wrapper (for compatibility)
    const syncTransform = React.useCallback((messages) => {
        // For prompt optimization, we need async, so we'll optimize in a separate effect
        // For now, just apply original transform and memory enrichment
        let enrichedMessages = messages;
        if (originalTransform) {
            enrichedMessages = originalTransform(enrichedMessages);
        }
        if (memory?.enabled && memoryContextRef.current) {
            enrichedMessages = [
                {
                    role: 'system',
                    content: `Relevant context from memory:\n${memoryContextRef.current}`,
                },
                ...enrichedMessages,
            ];
        }
        return enrichedMessages;
    }, [memory?.enabled, originalTransform]);
    // Enhanced onFinish callback to store messages in memory
    const originalOnFinish = rest.onFinish;
    const enhancedOnFinish = React.useCallback(async (message) => {
        // Call original callback first
        await originalOnFinish?.(message);
        // Store in memory if enabled
        if (memory?.enabled && memoryContext?.service) {
            try {
                const content = typeof message.content === 'string'
                    ? message.content
                    : Array.isArray(message.content)
                        ? message.content
                            .filter((part) => part.type === 'text')
                            .map((part) => part.text)
                            .join(' ')
                        : JSON.stringify(message.content);
                if (content) {
                    try {
                        const storeMemory = async () => {
                            return await memoryContext.addMemory(content, 'episodic', 'thread', {
                                messageId: message.id,
                                role: message.role,
                                timestamp: new Date().toISOString(),
                            }, {
                                priority: message.role === 'assistant' ? 'high' : 'medium',
                            });
                        };
                        // Store with retry logic if enabled
                        if (memory.retryOnError !== false) {
                            await retryOperation(storeMemory, memory.maxRetryAttempts || 2, 500);
                        }
                        else {
                            await storeMemory();
                        }
                    }
                    catch (error) {
                        const err = error;
                        const errorType = classifyError(err);
                        // Update error state
                        setMemoryError({
                            error: err,
                            operation: 'store',
                            errorType,
                        });
                        // Call error callback if provided
                        memory.onMemoryError?.(err, 'store');
                        // Log error with classification
                        console.warn(`[Clarity Chat] Memory storage failed (${errorType}):`, err.message);
                        // Memory storage failure is non-critical - don't throw
                    }
                }
            }
            catch (error) {
                const err = error;
                const errorType = classifyError(err);
                memory.onMemoryError?.(err, 'store');
                console.warn(`[Clarity Chat] Memory operation failed (${errorType}):`, err.message);
            }
        }
    }, [memory?.enabled, memoryContext?.service, originalOnFinish]);
    // Wrap useChatEnhanced with Clarity defaults
    const chat = useChatEnhanced({
        stream: true,
        streamProtocol,
        // Prefer SSE by default for parity with Vercel stream protocols
        ...rest,
        // Override transform if memory is enabled
        transform: memory?.enabled && memoryContext?.service
            ? syncTransform
            : originalTransform,
        // Override onFinish if memory is enabled
        onFinish: memory?.enabled && memoryContext?.service
            ? enhancedOnFinish
            : rest.onFinish,
    });
    // Enhanced append wrapper to query memory before sending
    const originalAppend = chat.append;
    const enhancedAppend = React.useCallback(async (message, options) => {
        // Query memory if enabled and this is a user message
        if (memory?.enabled &&
            memoryContext?.service &&
            (message.role === 'user' || !('role' in message))) {
            try {
                const queryText = typeof message.content === 'string'
                    ? message.content
                    : Array.isArray(message.content)
                        ? message.content
                            .filter((part) => part.type === 'text')
                            .map((part) => part.text)
                            .join(' ')
                        : '';
                if (queryText && queryText !== lastQueryRef.current) {
                    lastQueryRef.current = queryText;
                    try {
                        // Query memory for relevant context with retry logic
                        const queryMemory = async () => {
                            return await memoryContext.query({
                                query: queryText,
                                limit: memory.strategy === 'vector-store' ? 5 : 10,
                                scopes: ['thread'],
                            });
                        };
                        const memoryResults = memory.retryOnError !== false
                            ? await retryOperation(queryMemory, memory.maxRetryAttempts || 2, 500)
                            : await queryMemory();
                        // Store context in ref for transform function
                        if (memoryResults.length > 0) {
                            memoryContextRef.current = memoryResults
                                .map((result) => result.memory.content)
                                .join('\n\n');
                        }
                        else {
                            memoryContextRef.current = '';
                        }
                    }
                    catch (error) {
                        const err = error;
                        const errorType = classifyError(err);
                        // Update error state
                        setMemoryError({
                            error: err,
                            operation: 'query',
                            errorType,
                        });
                        // Call error callback if provided
                        memory.onMemoryError?.(err, 'query');
                        // Log error with classification
                        console.warn(`[Clarity Chat] Memory query failed (${errorType}):`, err.message);
                        // Only fail silently if it's a non-critical error
                        if (errorType === 'memory' || errorType === 'unknown') {
                            memoryContextRef.current = '';
                        }
                        else {
                            // For network/server errors, keep previous context if available
                            // Don't clear memoryContextRef to avoid losing context
                        }
                    }
                }
            }
            catch (error) {
                const err = error;
                const errorType = classifyError(err);
                memory.onMemoryError?.(err, 'query');
                console.warn(`[Clarity Chat] Memory operation failed (${errorType}):`, err.message);
                memoryContextRef.current = '';
            }
        }
        // Call original append
        return originalAppend(message, options);
    }, [memory?.enabled, memoryContext?.service, memory?.strategy, originalAppend]);
    // Track memory stats with state to trigger updates
    const [memoryStats, setMemoryStats] = React.useState({ count: 0, contextItems: 0 });
    // Track memory errors
    const [memoryError, setMemoryError] = React.useState({
        error: null,
        operation: null,
        errorType: null,
    });
    // Optimize messages when prompt optimization is enabled
    React.useEffect(() => {
        if (promptOptimization?.enabled && chat.messages.length > 0) {
            const optimizeMessages = async () => {
                try {
                    const modelMetadata = promptOptimization.model
                        ? (MODEL_PRESETS[promptOptimization.model] || {
                            model: promptOptimization.model,
                            maxTokens: promptOptimization.targetTokens || 8192,
                        })
                        : MODEL_PRESETS['gpt-4'];
                    const result = await buildModelPrompt({
                        toonNodes: undefined,
                        variables: {},
                        memoryContext: memoryContextRef.current || undefined,
                        userInput: undefined,
                        modelMetadata,
                        messages: chat.messages,
                        targetTokens: promptOptimization.targetTokens,
                        optimization: {
                            enabled: true,
                            strategy: promptOptimization.strategy || 'hybrid',
                            priorities: promptOptimization.priorities,
                            summarizeFn: promptOptimization.summarizeFn,
                            keepRecent: promptOptimization.keepRecent || 2,
                        },
                    });
                    setOptimizedMessagesState({
                        messages: result.messages,
                        tokenStats: {
                            inputTokens: result.tokenStats.inputTokens,
                            remainingBudget: result.tokenStats.remainingBudget,
                            utilization: result.tokenStats.utilization,
                            lastOptimizationReason: result.optimizationDiagnostics
                                ? result.optimizationDiagnostics.details.join(', ')
                                : undefined,
                            wasOptimized: result.optimizationDiagnostics !== undefined,
                        },
                    });
                }
                catch (error) {
                    console.warn('[useClarityChat] Prompt optimization failed:', error);
                }
            };
            optimizeMessages();
        }
    }, [
        promptOptimization?.enabled,
        chat.messages.length,
        promptOptimization?.targetTokens,
        promptOptimization?.strategy,
        promptOptimization?.model,
    ]);
    // Update memory stats when memory context changes
    React.useEffect(() => {
        if (memory?.enabled && memoryContext?.service) {
            try {
                const stats = memoryContext.getStats();
                const contextItems = memoryContextRef.current
                    ? memoryContextRef.current.split('\n\n').length
                    : 0;
                setMemoryStats({
                    count: stats.totalMemories ?? 0,
                    contextItems,
                });
            }
            catch {
                setMemoryStats({ count: 0, contextItems: 0 });
            }
        }
        else {
            setMemoryStats({ count: 0, contextItems: 0 });
        }
    }, [memory?.enabled, memoryContext?.service, chat.messages.length]);
    // Calculate memory info for return value
    const memoryInfo = React.useMemo(() => {
        if (!memory?.enabled || !memoryContext?.service) {
            return {
                memoryCount: 0,
                enabled: false,
            };
        }
        return {
            memoryCount: memoryStats.count,
            enabled: true,
            strategy: memory.strategy,
            lastContextSummary: memoryStats.contextItems > 0
                ? `Added ${memoryStats.contextItems} memory context items`
                : undefined,
        };
    }, [memory?.enabled, memory?.strategy, memoryContext?.service, memoryStats]);
    // Memory error info
    const memoryErrorInfo = React.useMemo(() => ({
        memoryError: memoryError.error,
        memoryErrorOperation: memoryError.operation,
        memoryErrorType: memoryError.errorType,
    }), [memoryError]);
    // Return enhanced chat with wrapped append, memory info, error info, and token stats
    return {
        ...chat,
        append: memory?.enabled && memoryContext?.service
            ? enhancedAppend
            : chat.append,
        memoryInfo,
        memoryErrorInfo,
        tokenStats: promptOptimization?.enabled ? optimizedMessagesState.tokenStats : undefined,
    };
}
//# sourceMappingURL=use-clarity-chat.js.map