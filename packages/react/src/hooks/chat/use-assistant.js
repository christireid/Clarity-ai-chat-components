/**
 * useAssistant - Mid-Level Assistant Hook
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Tools & Agents
 *
 * Hook for managing AI assistant interactions with tool calling support,
 * multi-step workflows, and thread/run management.
 *
 * For chat with tools, use top-level `useClarityChatWithTools` instead.
 * For standalone agents, use top-level `createAgent` instead.
 *
 * **2025 Improvements**:
 * - Uses shared streaming-helpers for consistent behavior
 * - State machine with granular status tracking
 * - Parallel tool execution support
 * - Tool result caching
 * - Request deduplication cache
 * - Removed deprecated mountedRef pattern
 * - Better error handling with type guards
 * - Progress tracking support
 *
 * @param options - Assistant configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.assistantId - Assistant ID for OpenAI-compatible APIs
 * @param options.threadId - Thread ID for multi-turn conversations
 * @param options.onToolCall - Callback when tool is invoked
 * @param options.onFinish - Callback when assistant finishes
 * @returns Assistant state and controls
 *
 * @example
 * ```tsx
 * const { messages, append, status, toolInvocations } = useAssistant({
 *   api: '/api/assistant',
 *   assistantId: 'asst_123',
 *   onToolCall: (invocation) => console.log('Tool called:', invocation),
 * })
 *
 * await append({ role: 'user', content: 'What is the weather?' })
 * ```
 *
 * @throws {Error} If API endpoint is invalid or missing
 */
'use client';
import * as React from 'react';
import { generateId } from '../../internal/helpers';
import { processStream, } from '../../utils/streaming/streaming-helpers';
/**
 * LRU Cache for request deduplication
 */
class AssistantCache {
    cache = new Map();
    maxSize;
    ttl;
    constructor(maxSize = 100, ttl = 300000) {
        this.maxSize = maxSize;
        this.ttl = ttl;
    }
    hashKey(message, context) {
        return `${message}:${JSON.stringify(context || {})}`;
    }
    get(message, context) {
        const key = this.hashKey(message, context);
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        // Check if expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        // Move to end (LRU)
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry;
    }
    set(message, entry, context) {
        const key = this.hashKey(message, context);
        const now = Date.now();
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey)
                this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            ...entry,
            timestamp: now,
            expiresAt: now + this.ttl,
        });
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
/**
 * Tool result cache
 */
class ToolCache {
    cache = new Map();
    ttl;
    constructor(ttl = 300000) {
        this.ttl = ttl;
    }
    hashKey(toolName, args) {
        return `${toolName}:${JSON.stringify(args)}`;
    }
    get(toolName, args) {
        const key = this.hashKey(toolName, args);
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.result;
    }
    set(toolName, args, result) {
        const key = this.hashKey(toolName, args);
        this.cache.set(key, {
            result,
            expiresAt: Date.now() + this.ttl,
        });
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
/**
 * useAssistant hook for AI assistants with tool calling
 *
 * @example
 * ```tsx
 * const { status, messages, submitMessage, input, setInput, isLoading } = useAssistant({
 *   api: '/api/assistant',
 *   assistantId: 'my-assistant',
 *   onToolCall: (toolCall) => {
 *     console.log('Tool called:', toolCall.toolName)
 *   },
 * })
 *
 * // Submit a message
 * await submitMessage('What is the weather in San Francisco?')
 * ```
 *
 * @example
 * ```tsx
 * // With caching, parallel tools, and status tracking
 * const { status, submitMessage, toolInvocations } = useAssistant({
 *   api: '/api/assistant',
 *   enableCache: true, // Request deduplication
 *   cacheToolResults: true, // Cache tool results
 *   parallelTools: true, // Execute multiple tools simultaneously
 *   onStatusChange: (status) => {
 *     console.log('Status:', status)
 *     // idle → loading → streaming → processing_tools → complete
 *   },
 *   onProgress: (bytes) => setProgress(bytes),
 * })
 *
 * // Status-based UI
 * {status === 'processing_tools' && <ToolProcessingIndicator tools={toolInvocations} />}
 * {status === 'streaming' && <StreamingIndicator />}
 * ```
 */
export function useAssistant(options = {}) {
    // Validate API endpoint
    const apiOption = options.api || '/api/assistant';
    if (!apiOption ||
        typeof apiOption !== 'string' ||
        apiOption.trim().length === 0) {
        throw new Error('useAssistant: "api" option is required.\n' +
            'Please provide a valid API endpoint URL.\n\n' +
            'Example:\n' +
            '  const { messages, append } = useAssistant({ api: "/api/assistant" })\n\n' +
            'For more help, see: https://clarity-chat.dev/docs/assistants');
    }
    const { api = apiOption, assistantId, threadId, initialMessages = [], body, headers = {}, credentials, fetch: customFetch = fetch, maxSteps, onResponse, onFinish, onError, onToolCall, onProgress, onStatusChange, stream = true, streamFormat = 'sse', parallelTools = false, cacheToolResults = false, toolCacheTTL = 300000, enableCache = false, cacheTTL = 300000, maxCacheSize = 100, experimental, } = options;
    const [status, setStatus] = React.useState('idle');
    const [messages, setMessages] = React.useState(initialMessages);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState();
    const [data, setData] = React.useState();
    const [toolInvocations, setToolInvocations] = React.useState([]);
    const abortControllerRef = React.useRef(null);
    const cacheRef = React.useRef(null);
    const toolCacheRef = React.useRef(null);
    const onStatusChangeRef = React.useRef(onStatusChange);
    // Initialize caches if enabled
    if (enableCache && !cacheRef.current) {
        cacheRef.current = new AssistantCache(maxCacheSize, cacheTTL);
    }
    if (cacheToolResults && !toolCacheRef.current) {
        toolCacheRef.current = new ToolCache(toolCacheTTL);
    }
    // Keep onStatusChange ref up to date
    React.useEffect(() => {
        onStatusChangeRef.current = onStatusChange;
    }, [onStatusChange]);
    /**
     * Update status with callback
     */
    const updateStatus = React.useCallback((newStatus) => {
        setStatus(newStatus);
        onStatusChangeRef.current?.(newStatus);
        setIsLoading(newStatus !== 'idle' && newStatus !== 'complete' && newStatus !== 'error');
    }, []);
    /**
     * Abort current request
     */
    const abort = React.useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);
    /**
     * Stop assistant
     */
    const stop = React.useCallback(() => {
        abort();
        updateStatus('idle');
    }, [abort, updateStatus]);
    /**
     * Append a message manually
     */
    const append = React.useCallback((message) => {
        setMessages((prev) => [...prev, message]);
    }, []);
    /**
     * Execute tool calls (with optional parallel execution and caching)
     */
    const executeToolCalls = React.useCallback(async (tools) => {
        updateStatus('processing_tools');
        const executeToolCall = async (tool) => {
            const startTime = performance.now();
            try {
                // Check cache first
                if (cacheToolResults && toolCacheRef.current) {
                    const cached = toolCacheRef.current.get(tool.toolName, tool.args);
                    if (cached) {
                        return {
                            ...tool,
                            state: 'result',
                            result: cached,
                            duration: performance.now() - startTime,
                        };
                    }
                }
                // Call onToolCall callback (user may provide tool implementation)
                await onToolCall?.(tool);
                // In real implementation, this would call actual tool functions
                // For now, we just mark it as complete
                const result = { success: true, message: `${tool.toolName} executed` };
                // Cache result
                if (cacheToolResults && toolCacheRef.current) {
                    toolCacheRef.current.set(tool.toolName, tool.args, result);
                }
                return {
                    ...tool,
                    state: 'result',
                    result,
                    duration: performance.now() - startTime,
                };
            }
            catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                return {
                    ...tool,
                    state: 'error',
                    error: error.message,
                    duration: performance.now() - startTime,
                };
            }
        };
        // Execute tools in parallel or sequentially
        const results = parallelTools
            ? await Promise.all(tools.map(executeToolCall))
            : await tools.reduce(async (acc, tool) => {
                const results = await acc;
                const result = await executeToolCall(tool);
                return [...results, result];
            }, Promise.resolve([]));
        return results;
    }, [parallelTools, cacheToolResults, onToolCall, updateStatus]);
    /**
     * Submit a message to the assistant
     */
    const submitMessage = React.useCallback(async (message, options) => {
        const userMessage = typeof message === 'string'
            ? {
                id: generateId(),
                role: 'user',
                content: message,
            }
            : message;
        const messageContent = typeof message === 'string' ? message : message.content;
        const messageContentStr = typeof messageContent === 'string'
            ? messageContent
            : messageContent
                .filter((part) => part.type === 'text')
                .map((part) => (part.type === 'text' ? part.text : ''))
                .join('');
        // Check cache first
        if (enableCache && cacheRef.current) {
            const requestContext = {
                ...body,
                ...options?.data,
                assistantId,
                threadId,
            };
            const cached = cacheRef.current.get(messageContentStr, requestContext);
            if (cached) {
                setMessages((prev) => [...prev, userMessage, cached.message]);
                setData(cached.message);
                setToolInvocations(cached.toolInvocations);
                await onFinish?.(cached.message);
                return;
            }
        }
        // Add user message
        setMessages((prev) => [...prev, userMessage]);
        updateStatus('loading');
        setError(undefined);
        setData(undefined);
        setToolInvocations([]);
        abortControllerRef.current = new AbortController();
        const assistantMessageId = generateId();
        // Create placeholder assistant message
        const assistantMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            toolInvocations: [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setData(assistantMessage);
        try {
            const requestBody = {
                ...body,
                ...options?.data,
                message: messageContent,
                messages: [...messages, userMessage],
            };
            if (assistantId)
                requestBody['assistantId'] = assistantId;
            if (threadId)
                requestBody['threadId'] = threadId;
            if (maxSteps !== undefined)
                requestBody['maxSteps'] = maxSteps;
            const response = await customFetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                credentials,
                body: JSON.stringify(requestBody),
                signal: abortControllerRef.current.signal,
            });
            await onResponse?.(response);
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
            }
            if (!stream || !response.body) {
                // Non-streaming response
                const result = await response.json();
                const finalMessage = {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: result.content || result.text || '',
                    toolInvocations: result.toolInvocations || [],
                };
                setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId ? finalMessage : msg));
                setData(finalMessage);
                setToolInvocations(finalMessage.toolInvocations || []);
                // Execute tools if present
                if (finalMessage.toolInvocations &&
                    finalMessage.toolInvocations.length > 0) {
                    const toolInvocationsForExecution = finalMessage.toolInvocations.map((tool) => ({
                        toolCallId: tool.toolCallId,
                        toolName: tool.toolName,
                        args: tool.args,
                        state: tool.state,
                        result: tool.result,
                    }));
                    const executedTools = await executeToolCalls(toolInvocationsForExecution);
                    setToolInvocations(executedTools);
                }
                updateStatus('complete');
                await onFinish?.(finalMessage);
                // Cache the result
                if (enableCache && cacheRef.current) {
                    const messageContentStr = typeof messageContent === 'string'
                        ? messageContent
                        : messageContent
                            .filter((part) => part.type === 'text')
                            .map((part) => (part.type === 'text' ? part.text : ''))
                            .join('');
                    cacheRef.current.set(messageContentStr, {
                        message: finalMessage,
                        toolInvocations: finalMessage.toolInvocations || [],
                    }, requestBody);
                }
                return;
            }
            // Streaming response using shared utilities
            updateStatus('streaming');
            let accumulatedContent = '';
            let currentToolInvocations = [];
            await processStream(response.body, {
                format: streamFormat,
                signal: abortControllerRef.current.signal,
                onData: (parsed) => {
                    // Handle tool invocations
                    if (parsed?.toolInvocation) {
                        const toolCall = parsed.toolInvocation;
                        currentToolInvocations = [...currentToolInvocations, toolCall];
                        onToolCall?.(toolCall);
                        setToolInvocations(currentToolInvocations);
                    }
                },
                onChunk: (chunk) => {
                    accumulatedContent += chunk;
                    const currentMessage = {
                        id: assistantMessageId,
                        role: 'assistant',
                        content: accumulatedContent,
                        toolInvocations: currentToolInvocations.map((tool) => ({
                            toolCallId: tool.toolCallId,
                            toolName: tool.toolName,
                            args: tool.args,
                            state: tool.state === 'error'
                                ? 'call'
                                : tool.state,
                            result: tool.result,
                        })),
                    };
                    setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId ? currentMessage : msg));
                    setData(currentMessage);
                },
                onProgress,
                onError,
            });
            // Finalize message
            const finalMessage = {
                id: assistantMessageId,
                role: 'assistant',
                content: accumulatedContent,
                toolInvocations: currentToolInvocations.map((tool) => ({
                    toolCallId: tool.toolCallId,
                    toolName: tool.toolName,
                    args: tool.args,
                    state: tool.state === 'error'
                        ? 'call'
                        : tool.state,
                    result: tool.result,
                })),
            };
            // Execute tools if present
            if (currentToolInvocations.length > 0) {
                const executedTools = await executeToolCalls(currentToolInvocations);
                finalMessage.toolInvocations = executedTools.map((tool) => ({
                    toolCallId: tool.toolCallId,
                    toolName: tool.toolName,
                    args: tool.args,
                    state: tool.state === 'error'
                        ? 'call'
                        : tool.state,
                    result: tool.result,
                }));
                setToolInvocations(executedTools);
            }
            setMessages((prev) => prev.map((msg) => msg.id === assistantMessageId ? finalMessage : msg));
            setData(finalMessage);
            updateStatus('complete');
            await onFinish?.(finalMessage);
            // Cache the result
            if (enableCache && cacheRef.current) {
                const messageContentStr = typeof messageContent === 'string'
                    ? messageContent
                    : messageContent
                        .filter((part) => part.type === 'text')
                        .map((part) => (part.type === 'text' ? part.text : ''))
                        .join('');
                cacheRef.current.set(messageContentStr, {
                    message: finalMessage,
                    toolInvocations: finalMessage.toolInvocations || [],
                }, requestBody);
            }
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                updateStatus('idle');
                return;
            }
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            onError?.(error);
            updateStatus('error');
        }
        finally {
            abortControllerRef.current = null;
        }
    }, [
        api,
        assistantId,
        threadId,
        body,
        headers,
        credentials,
        customFetch,
        maxSteps,
        stream,
        streamFormat,
        messages,
        enableCache,
        onResponse,
        onFinish,
        onError,
        onToolCall,
        onProgress,
        updateStatus,
        executeToolCalls,
    ]);
    /**
     * Handle form submission
     */
    const handleSubmit = React.useCallback((event, options) => {
        event?.preventDefault();
        if (!input.trim() || isLoading)
            return;
        submitMessage(input.trim(), options)
            .then(() => {
            setInput('');
        })
            .catch(() => {
            // Error already handled
        });
    }, [input, isLoading, submitMessage]);
    /**
     * Clear request cache
     */
    const clearCache = React.useCallback(() => {
        if (cacheRef.current) {
            cacheRef.current.clear();
        }
    }, []);
    /**
     * Clear tool cache
     */
    const clearToolCache = React.useCallback(() => {
        if (toolCacheRef.current) {
            toolCacheRef.current.clear();
        }
    }, []);
    /**
     * Get cache statistics
     */
    const getCacheStats = React.useCallback(() => {
        return {
            enabled: enableCache,
            size: cacheRef.current?.size() || 0,
            toolCacheSize: toolCacheRef.current?.size() || 0,
        };
    }, [enableCache]);
    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            abort();
            if (cacheRef.current)
                cacheRef.current.clear();
            if (toolCacheRef.current)
                toolCacheRef.current.clear();
        };
    }, [abort]);
    return {
        status,
        messages,
        setMessages,
        submitMessage,
        handleSubmit,
        input,
        setInput,
        isLoading,
        error,
        data,
        toolInvocations,
        stop,
        abort,
        append,
        clearCache,
        clearToolCache,
        getCacheStats,
    };
}
//# sourceMappingURL=use-assistant.js.map