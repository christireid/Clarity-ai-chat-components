/**
 * Tests for validation hooks
 * Tests React 19 useState and useCallback functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  useEnvValidation,
  useAPIKeyValidation,
  useChatConfigValidation,
  useMessageValidation,
} from '../hooks/use-validation'
import * as validateModule from '../../validate'

// Mock validation functions
vi.mock('../../validate', () => ({
  validateEnv: vi.fn(() => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
  validateAPIKey: vi.fn(() => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
  validateChatConfig: vi.fn(() => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
  validateMessages: vi.fn(() => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
}))

describe('useEnvValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null result', () => {
    const { result } = renderHook(() => useEnvValidation())

    expect(result.current.result).toBeNull()
    expect(result.current.isValid).toBe(false)
    expect(result.current.isPending).toBe(false)
  })

  it('should validate environment and update state', async () => {
    const { result } = renderHook(() => useEnvValidation())

    await act(async () => {
      result.current.validate()
    })

    await waitFor(() => {
      expect(result.current.result).toBeDefined()
      expect(result.current.isValid).toBe(true)
      expect(result.current.isPending).toBe(false)
    })

    expect(validateModule.validateEnv).toHaveBeenCalled()
  })
})

describe('useAPIKeyValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null result', () => {
    const { result } = renderHook(() => useAPIKeyValidation())

    expect(result.current.result).toBeNull()
    expect(result.current.isValid).toBe(false)
    expect(result.current.isPending).toBe(false)
  })

  it('should validate API key and update state', async () => {
    const { result } = renderHook(() => useAPIKeyValidation())

    await act(async () => {
      result.current.validate('openai', 'test-key')
    })

    await waitFor(() => {
      expect(result.current.result).toBeDefined()
      expect(result.current.isValid).toBe(true)
      expect(result.current.isPending).toBe(false)
    })

    expect(validateModule.validateAPIKey).toHaveBeenCalledWith('openai', 'test-key')
  })
})

describe('useChatConfigValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null result', () => {
    const { result } = renderHook(() => useChatConfigValidation())

    expect(result.current.result).toBeNull()
    expect(result.current.isValid).toBe(false)
    expect(result.current.isPending).toBe(false)
  })

  it('should validate chat config and update state', async () => {
    const { result } = renderHook(() => useChatConfigValidation())

    await act(async () => {
      result.current.validate({
        provider: 'openai',
        model: 'gpt-4-turbo',
        temperature: 0.7,
      })
    })

    await waitFor(() => {
      expect(result.current.result).toBeDefined()
      expect(result.current.isValid).toBe(true)
      expect(result.current.isPending).toBe(false)
    })

    expect(validateModule.validateChatConfig).toHaveBeenCalled()
  })
})

describe('useMessageValidation', () => {
  it('should validate messages synchronously', () => {
    const { result } = renderHook(() => useMessageValidation())

    const validationResult = result.current.validate([
      { role: 'user', content: 'Hello' },
    ])

    expect(validationResult).toBeDefined()
    expect(validateModule.validateMessages).toHaveBeenCalled()
  })
})
