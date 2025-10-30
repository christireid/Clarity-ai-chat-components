import { describe, it, expect } from 'vitest'

/**
 * Smoke tests to verify test setup is working correctly
 * These tests should always pass if the environment is configured properly
 */
describe('Test Setup Verification', () => {
  it('should run basic vitest tests', () => {
    expect(true).toBe(true)
    expect(1 + 1).toBe(2)
  })

  it('should have DOM environment', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
  })

  it('should have jest-dom matchers available', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    
    // jest-dom matchers from @testing-library/jest-dom
    expect(element).toBeInTheDocument()
    expect(element).toBeVisible()
    
    document.body.removeChild(element)
  })

  it('should have mocked matchMedia', () => {
    const media = window.matchMedia('(max-width: 768px)')
    expect(media).toBeDefined()
    expect(media.matches).toBe(false)
  })

  it('should have mocked IntersectionObserver', () => {
    const observer = new IntersectionObserver(() => {})
    expect(observer).toBeDefined()
    expect(typeof observer.observe).toBe('function')
    expect(typeof observer.disconnect).toBe('function')
  })

  it('should have mocked ResizeObserver', () => {
    const observer = new ResizeObserver(() => {})
    expect(observer).toBeDefined()
    expect(typeof observer.observe).toBe('function')
    expect(typeof observer.disconnect).toBe('function')
  })

  it('should have mocked localStorage', () => {
    expect(localStorage).toBeDefined()
    expect(typeof localStorage.getItem).toBe('function')
    expect(typeof localStorage.setItem).toBe('function')
  })

  it('should have mocked sessionStorage', () => {
    expect(sessionStorage).toBeDefined()
    expect(typeof sessionStorage.getItem).toBe('function')
    expect(typeof sessionStorage.setItem).toBe('function')
  })

  it('should handle async tests', async () => {
    const promise = Promise.resolve(42)
    const result = await promise
    expect(result).toBe(42)
  })

  it('should handle timers', () => {
    const callback = vi.fn()
    setTimeout(callback, 100)
    
    vi.runAllTimers()
    expect(callback).toHaveBeenCalled()
  })
})

describe('Optional Features', () => {
  it('should have SpeechRecognition mock if available', () => {
    if (typeof (window as any).SpeechRecognition !== 'undefined') {
      const recognition = new (window as any).SpeechRecognition()
      expect(recognition).toBeDefined()
      expect(typeof recognition.start).toBe('function')
      expect(typeof recognition.stop).toBe('function')
    } else {
      // Skip if not mocked
      expect(true).toBe(true)
    }
  })
})
