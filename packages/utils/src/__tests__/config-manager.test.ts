import { describe, it, expect, vi } from 'vitest'
import { createConfigManager, validateConfig, mergeConfig } from '../config-manager.js'

describe('ConfigManager', () => {
  it('should validate correct config', () => {
    const manager = createConfigManager({
      name: { type: 'string', required: true },
      age: { type: 'number', min: 0 },
    })

    const result = manager.validate({ name: 'John', age: 30 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ name: 'John', age: 30 })
    }
  })

  it('should fail on missing required field', () => {
    const manager = createConfigManager({
      name: { type: 'string', required: true },
    })

    const result = manager.validate({})
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toContain("Field 'name' is required")
    }
  })

  it('should apply defaults', () => {
    const manager = createConfigManager({
      role: { type: 'string', default: 'user' },
    })

    const defaults = manager.getDefaults()
    expect(defaults).toEqual({ role: 'user' })

    const result = manager.validate({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ role: 'user' })
    }
  })

  it('should merge configs', () => {
    const manager = createConfigManager({
      host: { type: 'string', default: 'localhost' },
      port: { type: 'number', default: 8080 },
    })

    const merged = manager.merge({ port: 3000 })
    expect(merged).toEqual({ host: 'localhost', port: 3000 })
  })

  it('should validate nested objects', () => {
    const manager = createConfigManager({
      server: { type: 'object', required: true },
    })

    const result = manager.validate({ server: { port: 8080 } })
    expect(result.success).toBe(true)
  })
})
