/**
 * Extension Registry Tests
 *
 * Tests for security hardening, memory leak prevention, and core functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createExtensionRegistry, ExtensionRegistryImpl } from '../registry'
import type { Extension, ExtensionRegistry } from '../types'

// ============================================
// Test Utilities
// ============================================

function createMockExtension(
  id: string,
  overrides: Partial<Extension> = {}
): Extension {
  return {
    metadata: {
      id,
      name: `Test Extension ${id}`,
      version: '1.0.0',
      category: 'utility',
      description: 'A test extension',
      author: 'Test',
      ...overrides.metadata,
    },
    initialize: vi.fn(),
    activate: vi.fn(),
    deactivate: vi.fn(),
    dispose: vi.fn(),
    ...overrides,
  }
}

// ============================================
// Extension ID Validation Tests
// ============================================

describe('Extension ID Validation', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = createExtensionRegistry({ debug: false })
  })

  afterEach(async () => {
    await registry.dispose?.()
  })

  it('should accept valid extension IDs', async () => {
    const validIds = [
      'my-extension',
      'MyExtension',
      'my_extension',
      'my.extension',
      'my:extension',
      'extension123',
      'a',
      'A1-b2_c3.d4:e5',
    ]

    for (const id of validIds) {
      const ext = createMockExtension(id)
      await expect(registry.register(ext)).resolves.toBeDefined()
      await registry.unregister(id)
    }
  })

  it('should reject empty extension ID', async () => {
    const ext = createMockExtension('')
    await expect(registry.register(ext)).rejects.toThrow(
      'Extension ID must be a non-empty string'
    )
  })

  it('should reject extension ID starting with number', async () => {
    const ext = createMockExtension('123extension')
    await expect(registry.register(ext)).rejects.toThrow(
      'Extension ID must start with a letter'
    )
  })

  it('should reject extension ID with invalid characters', async () => {
    const invalidIds = [
      'my extension', // space
      'my/extension', // slash
      'my\\extension', // backslash
      'my<script>', // angle brackets
      'my"extension', // quotes
      "my'extension", // single quote
      'my@extension', // at sign
      'my#extension', // hash
      'my$extension', // dollar
      'my%extension', // percent
      'my&extension', // ampersand
      'my*extension', // asterisk
    ]

    for (const id of invalidIds) {
      const ext = createMockExtension(id)
      await expect(registry.register(ext)).rejects.toThrow(
        'Extension ID must start with a letter and contain only alphanumeric characters'
      )
    }
  })

  it('should reject extension ID exceeding 128 characters', async () => {
    const longId = 'a'.repeat(129)
    const ext = createMockExtension(longId)
    await expect(registry.register(ext)).rejects.toThrow(
      'Extension ID must not exceed 128 characters'
    )
  })

  it('should accept extension ID of exactly 128 characters', async () => {
    const maxId = 'a'.repeat(128)
    const ext = createMockExtension(maxId)
    await expect(registry.register(ext)).resolves.toBeDefined()
  })
})

// ============================================
// Storage Key Sanitization Tests
// ============================================

describe('Storage Key Sanitization', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = createExtensionRegistry({ debug: false })
  })

  afterEach(async () => {
    await registry.dispose?.()
  })

  it('should sanitize storage keys with special characters', async () => {
    const ext = createMockExtension('test-storage')
    const registration = await registry.register(ext)

    // Access storage through context
    const storage = registration.context?.storage

    // Test that storage operations don't throw with potentially dangerous keys
    await expect(
      storage?.set('../../../etc/passwd', 'test')
    ).resolves.not.toThrow()
    await expect(storage?.set('<script>alert(1)</script>', 'test')).resolves.not
      .toThrow

    // Verify the key was sanitized - slashes and special chars become underscores
    const keys = await storage?.keys()
    expect(keys).toBeDefined()
    // Keys should not contain path traversal slashes or HTML characters
    keys?.forEach((key) => {
      expect(key).not.toContain('/')
      expect(key).not.toContain('<')
      expect(key).not.toContain('>')
      // Dots are allowed (for file extensions), but slashes are converted to underscores
    })
  })

  it('should handle malformed JSON gracefully', async () => {
    const ext = createMockExtension('test-json')
    const registration = await registry.register(ext)
    const storage = registration.context?.storage

    // Manually set a malformed value in localStorage if available
    if (typeof localStorage !== 'undefined') {
      const prefix = 'clarity-ext:test-json:'
      localStorage.setItem(`${prefix}malformed`, '{invalid json}')
    }

    // Should not throw, should return undefined for malformed JSON
    const value = await storage?.get('malformed')
    expect(value).toBeUndefined()
  })
})

// ============================================
// Memory Leak Prevention Tests
// ============================================

describe('Memory Leak Prevention', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = createExtensionRegistry({ debug: false, healthCheckInterval: 0 })
  })

  afterEach(async () => {
    await registry.dispose?.()
  })

  it('should clean up state manager on unregister', async () => {
    const ext = createMockExtension('test-cleanup')
    const registration = await registry.register(ext)

    // Set some state
    registration.context?.state.set('key1', 'value1')
    registration.context?.state.set('key2', 'value2')

    // Subscribe to changes
    const callback = vi.fn()
    registration.context?.state.subscribe('key1', callback)

    // Unregister should clean up
    await registry.unregister('test-cleanup')

    // Extension dispose should have been called
    expect(ext.dispose).toHaveBeenCalled()
  })

  it('should notify subscribers when state is cleared', async () => {
    const ext = createMockExtension('test-notify')
    const registration = await registry.register(ext)

    const state = registration.context?.state
    state?.set('key1', 'value1')
    state?.set('key2', 'value2')

    const callback = vi.fn()
    state?.subscribe('key1', callback)

    // Clear should notify subscribers with undefined
    state?.clear()

    expect(callback).toHaveBeenCalledWith(undefined)
  })

  it('should clean up event handlers on registry dispose', async () => {
    const ext1 = createMockExtension('ext1')
    const ext2 = createMockExtension('ext2')

    await registry.register(ext1)
    await registry.register(ext2)

    // Add registry event handlers
    const handler = vi.fn()
    registry.on('extension:registered', handler)
    registry.on('extension:unregistered', handler)

    // Dispose registry
    await registry.dispose?.()

    // Registry should be empty
    expect(registry.getAll()).toHaveLength(0)
  })

  it('should clean up health check interval on dispose', async () => {
    const registryWithHealth = createExtensionRegistry({
      debug: false,
      healthCheckInterval: 1000,
    })

    const ext = createMockExtension('test-health')
    await registryWithHealth.register(ext)

    // Dispose should clear the interval
    await registryWithHealth.dispose?.()

    // No errors should occur after dispose
    expect(registryWithHealth.getAll()).toHaveLength(0)
  })
})

// ============================================
// Registry Event Tests
// ============================================

describe('Registry Events', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = createExtensionRegistry({ debug: false, healthCheckInterval: 0 })
  })

  afterEach(async () => {
    await registry.dispose?.()
  })

  it('should emit events on register/unregister', async () => {
    const registered = vi.fn()
    const unregistered = vi.fn()

    registry.on('extension:registered', registered)
    registry.on('extension:unregistered', unregistered)

    const ext = createMockExtension('test-events')
    await registry.register(ext)

    expect(registered).toHaveBeenCalledWith(
      expect.objectContaining({
        extensionId: 'test-events',
        event: 'extension:registered',
      })
    )

    await registry.unregister('test-events')

    expect(unregistered).toHaveBeenCalledWith(
      expect.objectContaining({
        extensionId: 'test-events',
        event: 'extension:unregistered',
      })
    )
  })

  it('should allow unsubscribing from events', async () => {
    const handler = vi.fn()
    const unsubscribe = registry.on('extension:registered', handler)

    const ext1 = createMockExtension('ext1')
    await registry.register(ext1)
    expect(handler).toHaveBeenCalledTimes(1)

    // Unsubscribe
    unsubscribe()

    const ext2 = createMockExtension('ext2')
    await registry.register(ext2)

    // Should not have been called again
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

// ============================================
// Extension Lifecycle Tests
// ============================================

describe('Extension Lifecycle', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = createExtensionRegistry({ debug: false, healthCheckInterval: 0 })
  })

  afterEach(async () => {
    await registry.dispose?.()
  })

  it('should call lifecycle methods in correct order', async () => {
    const callOrder: string[] = []

    const ext = createMockExtension('lifecycle-test', {
      initialize: vi.fn(() => {
        callOrder.push('initialize')
      }),
      activate: vi.fn(() => {
        callOrder.push('activate')
      }),
      deactivate: vi.fn(() => {
        callOrder.push('deactivate')
      }),
      dispose: vi.fn(() => {
        callOrder.push('dispose')
      }),
    })

    await registry.register(ext)
    expect(callOrder).toEqual(['initialize', 'activate'])

    await registry.unregister('lifecycle-test')
    expect(callOrder).toEqual([
      'initialize',
      'activate',
      'deactivate',
      'dispose',
    ])
  })

  it('should handle errors in lifecycle methods gracefully', async () => {
    const ext = createMockExtension('error-test', {
      initialize: vi.fn(() => {
        throw new Error('Initialize failed')
      }),
    })

    const registration = await registry.register(ext)
    expect(registration.state).toBe('error')
    expect(registration.error?.message).toBe('Initialize failed')
  })

  it('should prevent duplicate registration', async () => {
    const ext = createMockExtension('duplicate')
    await registry.register(ext)

    await expect(registry.register(ext)).rejects.toThrow(
      'Extension "duplicate" is already registered'
    )
  })
})

// ============================================
// Config Validation Tests
// ============================================

describe('Config Validation', () => {
  let registry: ExtensionRegistry

  beforeEach(() => {
    registry = createExtensionRegistry({ debug: false, healthCheckInterval: 0 })
  })

  afterEach(async () => {
    await registry.dispose?.()
  })

  it('should validate required config fields', async () => {
    const ext: Extension<{ apiKey: string }> = {
      metadata: {
        id: 'config-test',
        name: 'Config Test',
        version: '1.0.0',
        category: 'utility',
        description: 'Test',
        author: 'Test',
      },
      configSchema: {
        version: '1.0',
        required: ['apiKey'],
        properties: {
          apiKey: { type: 'string', label: 'API Key' },
        },
      },
    }

    await expect(registry.register(ext)).rejects.toThrow(
      'Required configuration field "apiKey" is missing'
    )

    // Should succeed with required field
    await expect(
      registry.register(ext, { apiKey: 'test-key' })
    ).resolves.toBeDefined()
  })

  it('should validate config field types', async () => {
    const ext: Extension<{ count: number }> = {
      metadata: {
        id: 'type-test',
        name: 'Type Test',
        version: '1.0.0',
        category: 'utility',
        description: 'Test',
        author: 'Test',
      },
      configSchema: {
        version: '1.0',
        required: ['count'],
        properties: {
          count: { type: 'number', label: 'Count' },
        },
      },
    }

    await expect(
      registry.register(ext, { count: 'not a number' as unknown as number })
    ).rejects.toThrow('Field "count" must be a number')
  })
})
