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

'use client'

import * as React from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  SecurityManager,
  type SecurityConfig,
  type SecurityResult,
  type SecurityContext,
  type SecurityMetrics,
  type SecurityEvent,
} from '../../security/security-manager'
import type {
  SafetyMessage,
  OutputValidationResult,
} from '../../safety/jailbreak-prevention'

/**
 * useSecurity Hook
 *
 * Provides access to full SecurityManager functionality
 */
export function useSecurity(config?: SecurityConfig) {
  const [securityManager] = useState(() => new SecurityManager(config))

  const validateInput = useCallback(
    async (
      input: string,
      context?: SecurityContext
    ): Promise<SecurityResult> => {
      return await securityManager.validateInput(input, context)
    },
    [securityManager]
  )

  const prepareMessages = useCallback(
    (messages: SafetyMessage[]): SafetyMessage[] => {
      return securityManager.prepareMessages(messages)
    },
    [securityManager]
  )

  const validateOutput = useCallback(
    async (
      output: string,
      context?: SecurityContext
    ): Promise<OutputValidationResult> => {
      return await securityManager.validateOutput(output, context)
    },
    [securityManager]
  )

  const getMetrics = useCallback(
    (timeRange?: { start?: number; end?: number }): SecurityMetrics => {
      return securityManager.getMetrics(timeRange)
    },
    [securityManager]
  )

  const getEvents = useCallback(
    (filter?: {
      type?: any
      severity?: 'info' | 'warning' | 'critical'
      userId?: string
      limit?: number
    }): SecurityEvent[] => {
      return securityManager.getEvents(filter)
    },
    [securityManager]
  )

  const onAlert = useCallback(
    (handler: (event: SecurityEvent) => void | Promise<void>): void => {
      securityManager.onAlert({ handle: handler })
    },
    [securityManager]
  )

  return {
    validateInput,
    prepareMessages,
    validateOutput,
    getMetrics,
    getEvents,
    onAlert,
    manager: securityManager,
  }
}

/**
 * useSecurityMonitor Hook
 *
 * Real-time security metrics monitoring
 */
export function useSecurityMonitor(options?: {
  config?: SecurityConfig
  updateInterval?: number
  timeRange?: { start?: number; end?: number }
}) {
  const { getMetrics } = useSecurity(options?.config)
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const updateInterval = options?.updateInterval || 60000 // 1 minute

  // Stabilize timeRange to prevent unnecessary re-renders
  const timeRangeRef = React.useRef(options?.timeRange)
  React.useEffect(() => {
    timeRangeRef.current = options?.timeRange
  }, [options?.timeRange])

  useEffect(() => {
    // Initial fetch
    setMetrics(getMetrics(timeRangeRef.current))

    // Update periodically
    const interval = setInterval(() => {
      setMetrics(getMetrics(timeRangeRef.current))
    }, updateInterval)

    return () => clearInterval(interval)
     
  }, [getMetrics, updateInterval])

  return metrics
}

/**
 * useSecureInput Hook
 *
 * Validate individual user inputs
 */
export function useSecureInput(config?: SecurityConfig) {
  const { validateInput } = useSecurity(config)
  const [isValidating, setIsValidating] = useState(false)
  const [lastResult, setLastResult] = useState<SecurityResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validate = useCallback(
    async (input: string, context?: SecurityContext) => {
      setIsValidating(true)
      setError(null)

      try {
        const result = await validateInput(input, context)
        setLastResult(result)
        return result
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Validation failed'
        setError(errorMessage)
        throw err
      } finally {
        setIsValidating(false)
      }
    },
    [validateInput]
  )

  return {
    validate,
    isValidating,
    lastResult,
    error,
  }
}

/**
 * useSecureChat Hook
 *
 * Chat with built-in security validation
 */
export function useSecureChat(options?: {
  config?: SecurityConfig
  userId?: string
  tenantId?: string
  onSecurityBlock?: (reason: string, details?: any) => void
  onSecurityWarning?: (warning: string, details?: any) => void
}) {
  const { validateInput, prepareMessages, validateOutput } = useSecurity(
    options?.config
  )
  const [messages, setMessages] = useState<SafetyMessage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize context to prevent unnecessary re-renders
  const context: SecurityContext = React.useMemo(
    () => ({
      userId: options?.userId,
      tenantId: options?.tenantId,
    }),
    [options?.userId, options?.tenantId]
  )

  // Stabilize callbacks to prevent dependency changes
  const onSecurityBlockRef = React.useRef(options?.onSecurityBlock)
  const onSecurityWarningRef = React.useRef(options?.onSecurityWarning)
  React.useEffect(() => {
    onSecurityBlockRef.current = options?.onSecurityBlock
    onSecurityWarningRef.current = options?.onSecurityWarning
  }, [options?.onSecurityBlock, options?.onSecurityWarning])

  const sendMessage = useCallback(
    async (
      userMessage: string,
      onLLMResponse?: (messages: SafetyMessage[]) => Promise<string>
    ): Promise<void> => {
      setIsProcessing(true)
      setError(null)

      try {
        // Step 1: Validate input
        const validation = await validateInput(userMessage, context)

        if (!validation.allowed) {
          setError(validation.reason || 'Message blocked by security policy')
          onSecurityBlockRef.current?.(
            validation.reason || 'blocked',
            validation.details
          )
          return
        }

        if (validation.action === 'warn') {
          onSecurityWarningRef.current?.('Security warning', validation.details)
        }

        // Step 2: Add user message (use sanitized version)
        const userMsg: SafetyMessage = {
          role: 'user',
          content: validation.sanitizedInput || userMessage,
        }

        const newMessages = [...messages, userMsg]

        // Step 3: Prepare messages with security (jailbreak prevention)
        const secureMessages = prepareMessages(newMessages)

        // Step 4: Call LLM (if handler provided)
        if (onLLMResponse) {
          const response = await onLLMResponse(secureMessages)

          // Step 5: Validate output
          const outputValidation = await validateOutput(response, context)

          if (!outputValidation.safe) {
            setError('Response blocked by security policy')
            onSecurityBlockRef.current?.(
              'output_validation_failed',
              outputValidation.risks
            )
            return
          }

          // Step 6: Add assistant message
          // Use nullish coalescing to preserve empty string as valid output
          const assistantMsg: SafetyMessage = {
            role: 'assistant',
            content: outputValidation.output ?? response,
          }

          setMessages([...newMessages, assistantMsg])
        } else {
          // Just add user message if no LLM handler
          setMessages(newMessages)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to process message'
        setError(errorMessage)
        throw err
      } finally {
        setIsProcessing(false)
      }
    },
    [messages, validateInput, prepareMessages, validateOutput, context]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const addSystemMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { role: 'system', content }])
  }, [])

  return {
    messages,
    sendMessage,
    clearMessages,
    addSystemMessage,
    isProcessing,
    error,
  }
}

/**
 * useSecurityEvents Hook
 *
 * Subscribe to security events in real-time
 */
export function useSecurityEvents(options?: {
  config?: SecurityConfig
  filter?: {
    type?: any
    severity?: 'info' | 'warning' | 'critical'
    userId?: string
  }
  onEvent?: (event: SecurityEvent) => void
}) {
  const { getEvents, onAlert } = useSecurity(options?.config)
  const [events, setEvents] = useState<SecurityEvent[]>([])

  // Stabilize filter and callback to prevent re-subscriptions
  const filterRef = React.useRef(options?.filter)
  const onEventRef = React.useRef(options?.onEvent)
  React.useEffect(() => {
    filterRef.current = options?.filter
    onEventRef.current = options?.onEvent
  }, [options?.filter, options?.onEvent])

  useEffect(() => {
    // Subscribe to new events
    onAlert((event) => {
      const filter = filterRef.current
      if (filter) {
        const { type, severity, userId } = filter
        if (type && event.type !== type) return
        if (severity && event.severity !== severity) return
        if (userId && event.userId !== userId) return
      }

      setEvents((prev) => [...prev, event])
      onEventRef.current?.(event)
    })

    // Load initial events
    setEvents(getEvents(filterRef.current))
     
  }, [getEvents, onAlert])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  return {
    events,
    clearEvents,
  }
}

/**
 * useSecurityStats Hook
 *
 * Get aggregated security statistics
 */
export function useSecurityStats(options?: {
  config?: SecurityConfig
  timeRange?: { start?: number; end?: number }
}) {
  const { getMetrics } = useSecurity(options?.config)
  const [stats, setStats] = useState<SecurityMetrics | null>(null)

  // Stabilize timeRange to prevent unnecessary re-fetches
  const timeRangeRef = React.useRef(options?.timeRange)
  React.useEffect(() => {
    timeRangeRef.current = options?.timeRange
  }, [options?.timeRange])

  useEffect(() => {
    setStats(getMetrics(timeRangeRef.current))
     
  }, [getMetrics])

  return stats
}

/**
 * useRateLimitStatus Hook
 *
 * Check rate limit status for current user
 */
export function useRateLimitStatus(options: {
  config?: SecurityConfig
  userId: string
  checkInterval?: number
}) {
  const { validateInput } = useSecurity(options.config)
  const [remaining, setRemaining] = useState<number>(-1)
  const [isLimited, setIsLimited] = useState(false)
  const lastCheck = useRef<number>(0)

  const checkStatus = useCallback(async () => {
    try {
      // Try a dummy validation to check rate limit
      const result = await validateInput('', { userId: options.userId })
      setIsLimited(!result.allowed && result.reason === 'rate_limit_exceeded')
      setRemaining(result.rateLimitRemaining ?? -1)
    } catch {
      // Ignore errors
    }
  }, [validateInput, options.userId])

  useEffect(() => {
    // Check immediately
    checkStatus()

    // Check periodically
    const interval = setInterval(checkStatus, options.checkInterval || 30000)

    return () => clearInterval(interval)
  }, [checkStatus, options.checkInterval])

  return {
    remaining,
    isLimited,
    check: checkStatus,
  }
}
