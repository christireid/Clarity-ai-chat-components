/**
 * Test Templates
 *
 * Generic test template for various code types.
 */

export const test = `import { describe, it, expect, vi } from 'vitest'
import { {{pascalName}} } from './{{pascalName}}'


describe('{{pascalName}}', () => {
  it('should work correctly', () => {
    // Add your test implementation here
    expect(true).toBe(true)
  })

  it('should handle edge cases', () => {
    // Add edge case tests here
  })

  it.todo('should handle async operations')
  it.todo('should handle errors gracefully')
})
`
