/**
 * React Security Hooks (2025)
 *
 * Easy-to-use React hooks for comprehensive security:
 * - useSecurity: Full security manager
 * - useSecureChat: Chat with built-in security
 * - useSecurityMonitor: Real-time security metrics
 * - useSecureInput: Validate individual inputs
 *
 * @example
 * ```tsx
 * const { validateInput, prepareMessages } = useSecurity({
 *   promptInjection: { enabled: true },
 *   pii: { enabled: true, redactionStrategy: 'synthetic' },
 * })
 * ```
 */
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SecurityManager, } from '../security/security-manager';
/**
 * useSecurity Hook
 *
 * Provides access to full SecurityManager functionality
 */
export function useSecurity(config) {
    const [securityManager] = useState(() => new SecurityManager(config));
    const validateInput = useCallback(async (input, context) => {
        return await securityManager.validateInput(input, context);
    }, [securityManager]);
    const prepareMessages = useCallback((messages) => {
        return securityManager.prepareMessages(messages);
    }, [securityManager]);
    const validateOutput = useCallback(async (output, context) => {
        return await securityManager.validateOutput(output, context);
    }, [securityManager]);
    const getMetrics = useCallback((timeRange) => {
        return securityManager.getMetrics(timeRange);
    }, [securityManager]);
    const getEvents = useCallback((filter) => {
        return securityManager.getEvents(filter);
    }, [securityManager]);
    const onAlert = useCallback((handler) => {
        securityManager.onAlert({ handle: handler });
    }, [securityManager]);
    return {
        validateInput,
        prepareMessages,
        validateOutput,
        getMetrics,
        getEvents,
        onAlert,
        manager: securityManager,
    };
}
/**
 * useSecurityMonitor Hook
 *
 * Real-time security metrics monitoring
 */
export function useSecurityMonitor(options) {
    const { getMetrics } = useSecurity(options?.config);
    const [metrics, setMetrics] = useState(null);
    const updateInterval = options?.updateInterval || 60000; // 1 minute
    useEffect(() => {
        // Initial fetch
        setMetrics(getMetrics(options?.timeRange));
        // Update periodically
        const interval = setInterval(() => {
            setMetrics(getMetrics(options?.timeRange));
        }, updateInterval);
        return () => clearInterval(interval);
    }, [getMetrics, updateInterval, options?.timeRange]);
    return metrics;
}
/**
 * useSecureInput Hook
 *
 * Validate individual user inputs
 */
export function useSecureInput(config) {
    const { validateInput } = useSecurity(config);
    const [isValidating, setIsValidating] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [error, setError] = useState(null);
    const validate = useCallback(async (input, context) => {
        setIsValidating(true);
        setError(null);
        try {
            const result = await validateInput(input, context);
            setLastResult(result);
            return result;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Validation failed';
            setError(errorMessage);
            throw err;
        }
        finally {
            setIsValidating(false);
        }
    }, [validateInput]);
    return {
        validate,
        isValidating,
        lastResult,
        error,
    };
}
/**
 * useSecureChat Hook
 *
 * Chat with built-in security validation
 */
export function useSecureChat(options) {
    const { validateInput, prepareMessages, validateOutput } = useSecurity(options?.config);
    const [messages, setMessages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const context = {
        userId: options?.userId,
        tenantId: options?.tenantId,
    };
    const sendMessage = useCallback(async (userMessage, onLLMResponse) => {
        setIsProcessing(true);
        setError(null);
        try {
            // Step 1: Validate input
            const validation = await validateInput(userMessage, context);
            if (!validation.allowed) {
                setError(validation.reason || 'Message blocked by security policy');
                options?.onSecurityBlock?.(validation.reason || 'blocked', validation.details);
                return;
            }
            if (validation.action === 'warn') {
                options?.onSecurityWarning?.('Security warning', validation.details);
            }
            // Step 2: Add user message (use sanitized version)
            const userMsg = {
                role: 'user',
                content: validation.sanitizedInput || userMessage,
            };
            const newMessages = [...messages, userMsg];
            // Step 3: Prepare messages with security (jailbreak prevention)
            const secureMessages = prepareMessages(newMessages);
            // Step 4: Call LLM (if handler provided)
            if (onLLMResponse) {
                const response = await onLLMResponse(secureMessages);
                // Step 5: Validate output
                const outputValidation = await validateOutput(response, context);
                if (!outputValidation.safe) {
                    setError('Response blocked by security policy');
                    options?.onSecurityBlock?.('output_validation_failed', outputValidation.risks);
                    return;
                }
                // Step 6: Add assistant message
                // Use nullish coalescing to preserve empty string as valid output
                const assistantMsg = {
                    role: 'assistant',
                    content: outputValidation.output ?? response,
                };
                setMessages([...newMessages, assistantMsg]);
            }
            else {
                // Just add user message if no LLM handler
                setMessages(newMessages);
            }
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process message';
            setError(errorMessage);
            throw err;
        }
        finally {
            setIsProcessing(false);
        }
    }, [messages, validateInput, prepareMessages, validateOutput, context, options]);
    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);
    const addSystemMessage = useCallback((content) => {
        setMessages((prev) => [...prev, { role: 'system', content }]);
    }, []);
    return {
        messages,
        sendMessage,
        clearMessages,
        addSystemMessage,
        isProcessing,
        error,
    };
}
/**
 * useSecurityEvents Hook
 *
 * Subscribe to security events in real-time
 */
export function useSecurityEvents(options) {
    const { getEvents, onAlert } = useSecurity(options?.config);
    const [events, setEvents] = useState([]);
    useEffect(() => {
        // Subscribe to new events
        onAlert((event) => {
            if (options?.filter) {
                const { type, severity, userId } = options.filter;
                if (type && event.type !== type)
                    return;
                if (severity && event.severity !== severity)
                    return;
                if (userId && event.userId !== userId)
                    return;
            }
            setEvents((prev) => [...prev, event]);
            options?.onEvent?.(event);
        });
        // Load initial events
        setEvents(getEvents(options?.filter));
    }, [getEvents, onAlert, options]);
    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);
    return {
        events,
        clearEvents,
    };
}
/**
 * useSecurityStats Hook
 *
 * Get aggregated security statistics
 */
export function useSecurityStats(options) {
    const { getMetrics } = useSecurity(options?.config);
    const [stats, setStats] = useState(null);
    useEffect(() => {
        setStats(getMetrics(options?.timeRange));
    }, [getMetrics, options?.timeRange]);
    return stats;
}
/**
 * useRateLimitStatus Hook
 *
 * Check rate limit status for current user
 */
export function useRateLimitStatus(options) {
    const { validateInput } = useSecurity(options.config);
    const [remaining, setRemaining] = useState(-1);
    const [isLimited, setIsLimited] = useState(false);
    const lastCheck = useRef(0);
    const checkStatus = useCallback(async () => {
        try {
            // Try a dummy validation to check rate limit
            const result = await validateInput('', { userId: options.userId });
            setIsLimited(!result.allowed && result.reason === 'rate_limit_exceeded');
            setRemaining(-1); // TODO: Extract remaining from result
        }
        catch {
            // Ignore errors
        }
    }, [validateInput, options.userId]);
    useEffect(() => {
        // Check immediately
        checkStatus();
        // Check periodically
        const interval = setInterval(checkStatus, options.checkInterval || 30000);
        return () => clearInterval(interval);
    }, [checkStatus, options.checkInterval]);
    return {
        remaining,
        isLimited,
        check: checkStatus,
    };
}
//# sourceMappingURL=use-security.js.map