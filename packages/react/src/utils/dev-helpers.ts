/**
 * Development Helpers - DX Utilities for Clarity Chat
 *
 * These utilities help developers during development by providing:
 * - Quick setup validation
 * - Development-time warnings
 * - Configuration helpers
 * - Debugging utilities
 *
 * @module utils/dev-helpers
 */

import { ComponentError } from '../internal/component-errors'

// =============================================================================
// QUICK SETUP VALIDATION
// =============================================================================

/**
 * Validate common setup issues and provide helpful guidance
 */
export function validateSetup(): { issues: string[]; suggestions: string[] } {
  const issues: string[] = []
  const suggestions: string[] = []

  // Check if running in development
  const isDev = process.env['NODE_ENV'] === 'development'
  if (!isDev) return { issues, suggestions }

  // Check for common issues
  if (typeof window === 'undefined') {
    issues.push(
      'Server-side rendering detected - ensure proper client-side setup'
    )
    suggestions.push(
      'Wrap ClarityChat components in a client component with "use client" directive'
    )
  }

  // Check for CSS imports
  const hasStyles =
    document.querySelector('link[href*="clarity-chat"]') ||
    document.querySelector('style[data-clarity-chat]')
  if (!hasStyles) {
    issues.push('Clarity Chat styles not found')
    suggestions.push('Import styles: import "@clarity-chat/react/styles.css"')
  }

  return { issues, suggestions }
}

/**
 * Quick setup check that runs in development mode
 */
export function runDevSetupCheck(): void {
  if (process.env['NODE_ENV'] !== 'development') return

  const { issues, suggestions } = validateSetup()

  if (issues.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Clarity Chat Setup Check')
      issues.forEach((issue) => console.warn(`⚠️  ${issue}`))
      console.log('')
      console.log('💡 Suggestions:')
      suggestions.forEach((suggestion) => console.log(`   • ${suggestion}`))
      console.groupEnd()
    }
  }
}

// =============================================================================
// CONFIGURATION PRESETS
// =============================================================================

/**
 * Common configuration presets for different use cases
 */
export const ConfigPresets = {
  /** Minimal viable chat */
  minimal: {
    memory: { enabled: false },
    promptOptimization: { enabled: false },
    rateLimiting: { enabled: false },
  },

  /** Chat with memory for context */
  withMemory: {
    memory: {
      enabled: true,
      strategy: 'sliding-window' as const,
      maxTokens: 4000,
    },
    promptOptimization: { enabled: false },
    rateLimiting: { enabled: true },
  },

  /** Enterprise-grade chat */
  enterprise: {
    memory: {
      enabled: true,
      strategy: 'vector-store' as const,
      maxTokens: 10000,
      retryOnError: true,
    },
    promptOptimization: {
      enabled: true,
      strategy: 'hybrid' as const,
    },
    rateLimiting: { enabled: true },
    transport: 'websocket' as const,
  },

  /** Streaming-optimized chat */
  streaming: {
    transport: 'sse' as const,
    memory: { enabled: false },
    promptOptimization: { enabled: false },
    rateLimiting: { enabled: true },
  },
} as const

/**
 * Create a configuration from preset with overrides
 */
export function createConfig(
  preset: keyof typeof ConfigPresets,
  overrides: Record<string, any> = {}
) {
  return {
    ...ConfigPresets[preset],
    ...overrides,
  }
}

// =============================================================================
// DEVELOPMENT DEBUGGING
// =============================================================================

/**
 * Development-only logging utility
 */
export const devLog = {
  info: (message: string, ...args: any[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.log(`🔍 Clarity Chat: ${message}`, ...args)
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.warn(`⚠️  Clarity Chat: ${message}`, ...args)
    }
  },

  error: (message: string, ...args: any[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.error(`❌ Clarity Chat: ${message}`, ...args)
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.debug(`🐛 Clarity Chat: ${message}`, ...args)
    }
  },
}

// =============================================================================
// QUICK START TEMPLATES
// =============================================================================

/**
 * Generate quick start code snippets for common setups
 */
export const QuickStartTemplates = {
  basic: `import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function ChatApp() {
  return <ClarityChat api="/api/chat" />
}`,

  withMemory: `import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function ChatApp() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{ enabled: true, strategy: 'vector-store' }}
    />
  )
}`,

  withHook: `import { useClarityChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'

export function ChatApp() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}`,

  enterprise: `import { ClarityChatPresets } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function ChatApp() {
  return (
    <ClarityChatPresets.Enterprise
      api="/api/chat"
      sessionTitle="Enterprise Assistant"
    />
  )
}`,

  ultraSimple: `import { chat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export function ChatApp() {
  return chat('/api/chat') // That's it!
}`,
}

/**
 * Print a quick start template to console
 */
export function showQuickStart(
  template: keyof typeof QuickStartTemplates
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 Quick Start: ${template}`)
    console.log('='.repeat(50))
    console.log(QuickStartTemplates[template])
    console.log('')
    console.log('💡 Copy this code to get started quickly!')
  }
}

// =============================================================================
// PERFORMANCE MONITORING (DEV MODE)
// =============================================================================

/**
 * Development-time performance monitoring
 */
export class DevPerformanceMonitor {
  private renders = 0
  private lastRender = Date.now()

  trackRender(component: string): void {
    if (process.env['NODE_ENV'] !== 'development') return

    this.renders++
    const now = Date.now()
    const timeSinceLast = now - this.lastRender
    this.lastRender = now

    if (this.renders % 10 === 0) {
      devLog.info(
        `${component} render #${this.renders} (${timeSinceLast}ms since last)`
      )
    }
  }

  getStats(): { renders: number; avgRenderTime: number } {
    return {
      renders: this.renders,
      avgRenderTime: 16.67, // Rough estimate
    }
  }
}

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

// Auto-run setup check in development
if (
  typeof window !== 'undefined' &&
  process.env['NODE_ENV'] === 'development'
) {
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDevSetupCheck)
  } else {
    setTimeout(runDevSetupCheck, 100)
  }
}
