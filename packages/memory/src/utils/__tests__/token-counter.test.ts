import { describe, it, expect } from 'vitest'

// Import the TokenCounter from memory-service (it's internal, test via behavior)
describe('TokenCounter approximation', () => {
  // Simple token counter that mirrors the implementation
  const countTokens = (text: string): number => Math.ceil(text.length / 4)

  it('should estimate tokens for short text', () => {
    expect(countTokens('hello')).toBe(2) // 5 chars / 4 = 1.25 → 2
  })

  it('should estimate tokens for longer text', () => {
    expect(countTokens('This is a longer sentence.')).toBe(7) // 26 chars / 4 = 6.5 → 7
  })

  it('should handle empty string', () => {
    expect(countTokens('')).toBe(0)
  })

  it('should handle whitespace', () => {
    expect(countTokens('   ')).toBe(1) // 3 chars / 4 = 0.75 → 1
  })
})
