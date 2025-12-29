/**
 * Module Resolution Integration Tests
 *
 * These tests verify that all public exports can be imported without errors.
 * This prevents broken import paths from reaching production.
 *
 * @group integration
 */

import { describe, it, expect } from 'vitest'

describe('Module Resolution - Main Package', () => {
  it('should import main package exports without errors', async () => {
    // This will fail if any import in index.ts is broken
    const mainExports = await import('../../index')

    expect(mainExports).toBeDefined()
    expect(typeof mainExports).toBe('object')
  })

  it('should import core components', async () => {
    const { ClarityChat } = await import('../../index')

    expect(ClarityChat).toBeDefined()
    expect(typeof ClarityChat).toBe('function')
  })

  it('should import hooks', async () => {
    // Public API exports useChat as useHeadlessChat for clarity
    const { useClarityChat, useHeadlessChat } = await import('../../index')

    expect(useClarityChat).toBeDefined()
    expect(useHeadlessChat).toBeDefined()
    expect(typeof useClarityChat).toBe('function')
    expect(typeof useHeadlessChat).toBe('function')
  })
})

describe('Module Resolution - Utils Package', () => {
  it('should import utils exports without errors', async () => {
    const utils = await import('../../utils')

    expect(utils).toBeDefined()
    expect(typeof utils).toBe('object')
  })

  it('should import classifyError utility', async () => {
    const { classifyError } = await import('../../utils')

    expect(classifyError).toBeDefined()
    expect(typeof classifyError).toBe('function')
  })

  it('should import cn utility', async () => {
    const { cn } = await import('../../utils')

    expect(cn).toBeDefined()
    expect(typeof cn).toBe('function')
  })

  it('should import streaming utilities', async () => {
    // Streaming utilities are re-exported from utils/streaming
    const streaming = await import('../../utils/streaming')

    expect(streaming).toBeDefined()
    expect(typeof streaming).toBe('object')
  })
})

describe('Module Resolution - Animations Package', () => {
  it('should import animations exports without errors', async () => {
    const animations = await import('../../animations')

    expect(animations).toBeDefined()
    expect(typeof animations).toBe('object')
  })

  it('should import animation variants', async () => {
    // Animation presets are accessed via ANIMATION_PRESETS and getPreset
    const { ANIMATION_PRESETS, getPreset } = await import('../../animations')

    expect(ANIMATION_PRESETS).toBeDefined()
    expect(getPreset).toBeDefined()
    expect(typeof getPreset).toBe('function')
  })

  it('should import spring presets', async () => {
    const { getSpring } = await import('../../animations')

    expect(getSpring).toBeDefined()
    expect(typeof getSpring).toBe('function')
  })

  it('should import motion-safe utilities', async () => {
    const { getMotionSafeDuration, getMotionSafeScale } =
      await import('../../animations')

    expect(getMotionSafeDuration).toBeDefined()
    expect(getMotionSafeScale).toBeDefined()
  })
})

describe('Module Resolution - Analytics Package', () => {
  it('should import analytics exports without errors', async () => {
    const analytics = await import('../../analytics')

    expect(analytics).toBeDefined()
    expect(typeof analytics).toBe('object')
  })

  it('should import AnalyticsProvider', async () => {
    const { AnalyticsProvider } = await import('../../analytics')

    expect(AnalyticsProvider).toBeDefined()
    expect(typeof AnalyticsProvider).toBe('function')
  })

  it('should import analytics hooks', async () => {
    // useAnalytics is the primary analytics hook
    const { useAnalytics } = await import('../../analytics')

    expect(useAnalytics).toBeDefined()
    expect(typeof useAnalytics).toBe('function')
  })
})

describe('Module Resolution - Memory Package', () => {
  it('should import memory exports without errors', async () => {
    const memory = await import('../../memory')

    expect(memory).toBeDefined()
    expect(typeof memory).toBe('object')
  })

  it('should import MemoryProvider', async () => {
    const { MemoryProvider } = await import('../../memory')

    expect(MemoryProvider).toBeDefined()
    expect(typeof MemoryProvider).toBe('function')
  })

  it('should import memory hooks', async () => {
    // useMemory is the primary memory hook
    const { useMemory } = await import('../../memory')

    expect(useMemory).toBeDefined()
    expect(typeof useMemory).toBe('function')
  })
})

describe('Module Resolution - Adapters Package', () => {
  it('should import adapters exports without errors', async () => {
    const adapters = await import('../../adapters')

    expect(adapters).toBeDefined()
    expect(typeof adapters).toBe('object')
  })

  it('should import OpenAI adapter', async () => {
    // Adapters are exported as pre-configured objects, not factory functions
    const { openAIAdapter, getAdapter } = await import('../../adapters')

    expect(openAIAdapter).toBeDefined()
    expect(getAdapter).toBeDefined()
    expect(typeof getAdapter).toBe('function')
  })

  it('should import Anthropic adapter', async () => {
    const { anthropicAdapter } = await import('../../adapters')

    expect(anthropicAdapter).toBeDefined()
  })
})

describe('Module Resolution - Core Entry', () => {
  it('should import core exports without errors', async () => {
    const core = await import('../../core')

    expect(core).toBeDefined()
    expect(typeof core).toBe('object')
  })

  it('should have minimal core components', async () => {
    const { ChatWindow, MessageList } = await import('../../core')

    expect(ChatWindow).toBeDefined()
    expect(MessageList).toBeDefined()
  })
})

describe('Module Resolution - Component Paths', () => {
  it('should import UI icons', async () => {
    const icons = await import('../../components/ui/icons')

    expect(icons).toBeDefined()
    expect(icons.CopyIcon).toBeDefined()
    expect(icons.CheckIcon).toBeDefined()
  })

  it('should import UI toast', async () => {
    const { useToast } = await import('../../components/ui/toast')

    expect(useToast).toBeDefined()
    expect(typeof useToast).toBe('function')
  })

  it('should import UI skeleton', async () => {
    const { Skeleton, SkeletonMessage } =
      await import('../../components/ui/skeleton')

    expect(Skeleton).toBeDefined()
    expect(SkeletonMessage).toBeDefined()
  })

  it('should import feedback error-message', async () => {
    const { ErrorMessage } =
      await import('../../components/feedback/error-message')

    expect(ErrorMessage).toBeDefined()
    expect(typeof ErrorMessage).toBe('function')
  })
})

describe('Module Resolution - Internal Utilities', () => {
  it('should import resilience utilities', async () => {
    const { classifyError, retryWithBackoff } =
      await import('../../utils/resilience')

    expect(classifyError).toBeDefined()
    expect(retryWithBackoff).toBeDefined()
  })

  it('should import message utilities', async () => {
    const { getMessageGrouping } = await import('../../utils/message')

    expect(getMessageGrouping).toBeDefined()
  })
})
