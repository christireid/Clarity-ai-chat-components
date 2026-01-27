import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '../use-local-storage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('existing')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
  })

  it('should work with function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('should remove value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'value'))

    act(() => {
      result.current[2]() // removeValue
    })

    expect(result.current[0]).toBe('value') // Back to initial
    expect(localStorage.getItem('test-key')).toBeNull()
  })

  it('should work with objects', () => {
    const obj = { name: 'Test', count: 42 }
    const { result } = renderHook(() => useLocalStorage('test-key', obj))

    expect(result.current[0]).toEqual(obj)

    act(() => {
      result.current[1]({ name: 'Updated', count: 100 })
    })

    expect(result.current[0]).toEqual({ name: 'Updated', count: 100 })
  })

  it('should handle initialization with function', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', () => 'computed')
    )

    expect(result.current[0]).toBe('computed')
  })
})
