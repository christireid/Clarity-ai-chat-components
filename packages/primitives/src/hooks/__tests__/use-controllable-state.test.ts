import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useControllableState,
  useControllableBoolean,
} from '../use-controllable-state'

describe('useControllableState', () => {
  describe('uncontrolled mode', () => {
    it('uses defaultProp as initial value', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 'initial',
        })
      )

      expect(result.current[0]).toBe('initial')
    })

    it('updates internal state when setValue is called', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 'initial',
        })
      )

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
    })

    it('supports function updater', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 0,
        })
      )

      act(() => {
        result.current[1]((prev) => prev + 1)
      })

      expect(result.current[0]).toBe(1)
    })

    it('calls onChange when value changes', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 'initial',
          onChange,
        })
      )

      act(() => {
        result.current[1]('updated')
      })

      expect(onChange).toHaveBeenCalledWith('updated')
    })
  })

  describe('controlled mode', () => {
    it('uses prop value', () => {
      const { result } = renderHook(() =>
        useControllableState({
          prop: 'controlled',
          defaultProp: 'default',
        })
      )

      expect(result.current[0]).toBe('controlled')
    })

    it('does not update internal state when controlled', () => {
      const { result } = renderHook(() =>
        useControllableState({
          prop: 'controlled',
        })
      )

      act(() => {
        result.current[1]('new value')
      })

      // Value should still be controlled value
      expect(result.current[0]).toBe('controlled')
    })

    it('calls onChange when setValue is called', () => {
      const onChange = vi.fn()
      const { result } = renderHook(() =>
        useControllableState({
          prop: 'controlled',
          onChange,
        })
      )

      act(() => {
        result.current[1]('new value')
      })

      expect(onChange).toHaveBeenCalledWith('new value')
    })

    it('reflects prop changes', () => {
      const { result, rerender } = renderHook(
        ({ prop }) =>
          useControllableState({
            prop,
          }),
        { initialProps: { prop: 'initial' } }
      )

      expect(result.current[0]).toBe('initial')

      rerender({ prop: 'updated' })

      expect(result.current[0]).toBe('updated')
    })
  })

  describe('mode switching warnings', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleWarnSpy.mockRestore()
    })

    it('warns when switching from controlled to uncontrolled', () => {
      const { rerender } = renderHook(
        ({ prop }) =>
          useControllableState({
            prop,
          }),
        { initialProps: { prop: 'controlled' as string | undefined } }
      )

      rerender({ prop: undefined })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('switching from controlled to uncontrolled')
      )
    })

    it('warns when switching from uncontrolled to controlled', () => {
      const { rerender } = renderHook(
        ({ prop }) =>
          useControllableState({
            prop,
          }),
        { initialProps: { prop: undefined as string | undefined } }
      )

      rerender({ prop: 'controlled' })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('switching from uncontrolled to controlled')
      )
    })
  })

  describe('with numbers', () => {
    it('handles numeric values correctly', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: 0,
        })
      )

      expect(result.current[0]).toBe(0)

      act(() => {
        result.current[1](5)
      })

      expect(result.current[0]).toBe(5)
    })
  })

  describe('with objects', () => {
    it('handles object values correctly', () => {
      const { result } = renderHook(() =>
        useControllableState({
          defaultProp: { count: 0 },
        })
      )

      expect(result.current[0]).toEqual({ count: 0 })

      act(() => {
        result.current[1]({ count: 1 })
      })

      expect(result.current[0]).toEqual({ count: 1 })
    })
  })
})

describe('useControllableBoolean', () => {
  it('defaults to false when no defaultProp provided', () => {
    const { result } = renderHook(() => useControllableBoolean({}))

    expect(result.current[0]).toBe(false)
  })

  it('respects provided defaultProp', () => {
    const { result } = renderHook(() =>
      useControllableBoolean({
        defaultProp: true,
      })
    )

    expect(result.current[0]).toBe(true)
  })

  it('toggles correctly', () => {
    const { result } = renderHook(() =>
      useControllableBoolean({
        defaultProp: false,
      })
    )

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1](false)
    })

    expect(result.current[0]).toBe(false)
  })

  it('supports function updater for toggle', () => {
    const { result } = renderHook(() =>
      useControllableBoolean({
        defaultProp: false,
      })
    )

    act(() => {
      result.current[1]((prev) => !prev)
    })

    expect(result.current[0]).toBe(true)
  })
})
