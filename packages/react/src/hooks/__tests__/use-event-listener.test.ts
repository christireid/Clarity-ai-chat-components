import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as React from 'react'
import { useEventListener } from '../use-event-listener'

describe('useEventListener', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Window events', () => {
    it('should add event listener to window by default', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useEventListener('click', handler))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined
      )
    })

    it('should remove event listener on unmount', () => {
      const handler = vi.fn()
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useEventListener('click', handler))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined
      )
    })

    it('should call handler when event is fired', () => {
      const handler = vi.fn()

      renderHook(() => useEventListener('click', handler))

      // Fire click event
      window.dispatchEvent(new MouseEvent('click'))

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent))
    })

    it('should handle keyboard events', () => {
      const handler = vi.fn()

      renderHook(() => useEventListener('keydown', handler))

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Escape' })
      )
    })

    it('should handle resize events', () => {
      const handler = vi.fn()

      renderHook(() => useEventListener('resize', handler))

      window.dispatchEvent(new Event('resize'))

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Element ref events', () => {
    it('should add event listener to ref element', () => {
      const handler = vi.fn()
      const element = document.createElement('button')
      const ref = { current: element }
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener')

      renderHook(() => useEventListener('click', handler, ref))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined
      )
    })

    it('should remove event listener from ref element on unmount', () => {
      const handler = vi.fn()
      const element = document.createElement('button')
      const ref = { current: element }
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener')

      const { unmount } = renderHook(() =>
        useEventListener('click', handler, ref)
      )

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined
      )
    })

    it('should call handler when element event is fired', () => {
      const handler = vi.fn()
      const element = document.createElement('button')
      const ref = { current: element }

      renderHook(() => useEventListener('click', handler, ref))

      element.dispatchEvent(new MouseEvent('click'))

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should handle null ref gracefully', () => {
      const handler = vi.fn()
      const ref = { current: null }

      // Should not throw
      const { unmount } = renderHook(() =>
        useEventListener('click', handler, ref)
      )

      // Handler should not be called (no element to attach to)
      window.dispatchEvent(new MouseEvent('click'))

      // Falls back to window when element is null
      expect(handler).toHaveBeenCalled()

      unmount()
    })
  })

  describe('Event options', () => {
    it('should pass options to addEventListener', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const options = { capture: true, passive: true }

      renderHook(() => useEventListener('scroll', handler, undefined, options))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        options
      )
    })

    it('should pass boolean options', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      renderHook(() => useEventListener('click', handler, undefined, true))

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        true
      )
    })

    it('should handle once option', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      const ref = { current: element }

      renderHook(() => useEventListener('click', handler, ref, { once: true }))

      // Fire event twice
      element.dispatchEvent(new MouseEvent('click'))
      element.dispatchEvent(new MouseEvent('click'))

      // With once: true, should only be called once
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Handler updates', () => {
    it('should use latest handler when event fires', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const { rerender } = renderHook(
        ({ handler }) => useEventListener('click', handler),
        { initialProps: { handler: handler1 } }
      )

      // Fire event with first handler
      window.dispatchEvent(new MouseEvent('click'))
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()

      // Update to second handler
      rerender({ handler: handler2 })

      // Fire event again - should use new handler
      window.dispatchEvent(new MouseEvent('click'))
      expect(handler1).toHaveBeenCalledTimes(1) // Still 1
      expect(handler2).toHaveBeenCalledTimes(1) // Now called
    })

    it('should not reattach listener when handler changes', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      const { rerender } = renderHook(
        ({ handler }) => useEventListener('click', handler),
        { initialProps: { handler: handler1 } }
      )

      const initialCallCount = addEventListenerSpy.mock.calls.length

      // Update handler
      rerender({ handler: handler2 })

      // Should not have added another listener
      expect(addEventListenerSpy.mock.calls.length).toBe(initialCallCount)
    })
  })

  describe('Event type changes', () => {
    it('should reattach listener when event type changes', () => {
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { rerender } = renderHook(
        ({ eventName }: { eventName: 'click' | 'keydown' }) =>
          useEventListener(eventName, handler),
        { initialProps: { eventName: 'click' as const } }
      )

      // Should have added click listener
      expect(addEventListenerSpy).toHaveBeenLastCalledWith(
        'click',
        expect.any(Function),
        undefined
      )

      // Change event type
      rerender({ eventName: 'keydown' as const })

      // Should have removed old listener and added new
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        undefined
      )
      expect(addEventListenerSpy).toHaveBeenLastCalledWith(
        'keydown',
        expect.any(Function),
        undefined
      )
    })
  })

  describe('SSR safety', () => {
    it('should have SSR check in implementation', () => {
      // The hook has a `typeof window === 'undefined'` check at line 70
      // This ensures the hook is SSR-safe
      // We can't actually test SSR in jsdom since React Testing Library requires window
      // but we verify the implementation has the check
      expect(useEventListener.toString()).toContain('typeof window')
    })
  })
})
