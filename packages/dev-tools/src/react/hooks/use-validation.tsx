/**
 * React 19 Hook for Validation
 * Uses useState and useCallback for form validation (client-side)
 * Note: Server Actions require Next.js or Remix - using client-side validation here
 */

'use client'

import { useState, useCallback } from 'react'
import { validateEnv, validateAPIKey, validateChatConfig, validateMessages, type ValidationResult } from '../../validate'

/**
 * Hook for environment validation
 */
export function useEnvValidation() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isPending, setIsPending] = useState(false)

  const validate = useCallback(async () => {
    setIsPending(true)
    try {
      // Simulate async for consistency with server actions pattern
      const validationResult = await Promise.resolve(validateEnv())
      setResult(validationResult)
    } catch (error) {
      setResult({
        valid: false,
        errors: [{ field: 'validation', message: (error as Error).message, severity: 'error' }],
        warnings: [],
      })
    } finally {
      setIsPending(false)
    }
  }, [])

  return {
    result,
    isValid: result?.valid ?? false,
    errors: result?.errors ?? [],
    warnings: result?.warnings ?? [],
    isPending,
    validate,
  }
}

/**
 * Hook for API key validation
 */
export function useAPIKeyValidation() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isPending, setIsPending] = useState(false)

  const validate = useCallback(async (provider: 'openai' | 'anthropic' | 'google', apiKey?: string) => {
    setIsPending(true)
    try {
      const validationResult = await Promise.resolve(validateAPIKey(provider, apiKey))
      setResult(validationResult)
    } catch (error) {
      setResult({
        valid: false,
        errors: [{ field: 'validation', message: (error as Error).message, severity: 'error' }],
        warnings: [],
      })
    } finally {
      setIsPending(false)
    }
  }, [])

  return {
    result,
    isValid: result?.valid ?? false,
    errors: result?.errors ?? [],
    warnings: result?.warnings ?? [],
    isPending,
    validate,
  }
}

/**
 * Hook for chat config validation
 */
export function useChatConfigValidation() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isPending, setIsPending] = useState(false)

  const validate = useCallback(async (config: {
    provider: string
    model: string
    temperature?: number
    maxTokens?: number
    topP?: number
  }) => {
    setIsPending(true)
    try {
      const validationResult = await Promise.resolve(validateChatConfig(config))
      setResult(validationResult)
    } catch (error) {
      setResult({
        valid: false,
        errors: [{ field: 'validation', message: (error as Error).message, severity: 'error' }],
        warnings: [],
      })
    } finally {
      setIsPending(false)
    }
  }, [])

  return {
    result,
    isValid: result?.valid ?? false,
    errors: result?.errors ?? [],
    warnings: result?.warnings ?? [],
    isPending,
    validate,
  }
}

/**
 * Hook for message validation
 */
export function useMessageValidation() {
  const validate = useCallback((messages: any[]): ValidationResult => {
    return validateMessages(messages)
  }, [])

  return {
    validate,
  }
}
