/**
 * Focus Management Utilities
 * 
 * Advanced focus management for accessibility
 */

import * as React from 'react'

/**
 * Focus trap hook
 * 
 * Traps focus within an element (useful for modals)
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  active: boolean = true
): React.RefObject<T> {
  const ref = React.useRef<T>(null)
  
  React.useEffect(() => {
    if (!active || !ref.current) return
    
    const element = ref.current
    const focusableElements = getFocusableElements(element)
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]
    
    // Focus first element
    firstFocusable?.focus()
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }
    
    element.addEventListener('keydown', handleKeyDown)
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }, [active])
  
  return ref
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')
  
  return Array.from(container.querySelectorAll(selector))
}

/**
 * Roving tabindex hook
 * 
 * Implement roving tabindex pattern for keyboard navigation
 */
export function useRovingTabIndex<T extends HTMLElement = HTMLElement>(
  itemCount: number,
  options?: {
    orientation?: 'horizontal' | 'vertical'
    loop?: boolean
  }
) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const refs = React.useRef<(T | null)[]>([])
  
  const orientation = options?.orientation || 'vertical'
  const loop = options?.loop !== false
  
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex = index
      
      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical') {
            e.preventDefault()
            nextIndex = index + 1
          }
          break
        case 'ArrowUp':
          if (orientation === 'vertical') {
            e.preventDefault()
            nextIndex = index - 1
          }
          break
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            e.preventDefault()
            nextIndex = index + 1
          }
          break
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            e.preventDefault()
            nextIndex = index - 1
          }
          break
        case 'Home':
          e.preventDefault()
          nextIndex = 0
          break
        case 'End':
          e.preventDefault()
          nextIndex = itemCount - 1
          break
        default:
          return
      }
      
      // Handle looping
      if (loop) {
        if (nextIndex < 0) nextIndex = itemCount - 1
        if (nextIndex >= itemCount) nextIndex = 0
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, itemCount - 1))
      }
      
      setActiveIndex(nextIndex)
      refs.current[nextIndex]?.focus()
    },
    [itemCount, orientation, loop]
  )
  
  const getItemProps = React.useCallback(
    (index: number) => ({
      ref: (el: T | null) => {
        refs.current[index] = el
      },
      tabIndex: index === activeIndex ? 0 : -1,
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
      onFocus: () => setActiveIndex(index),
    }),
    [activeIndex, handleKeyDown]
  )
  
  return { activeIndex, getItemProps }
}

/**
 * Focus restoration hook
 * 
 * Restores focus to previous element when component unmounts
 */
export function useFocusRestoration(): {
  saveFocus: () => void
  restoreFocus: () => void
} {
  const previousFocus = React.useRef<HTMLElement | null>(null)
  
  const saveFocus = React.useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement
  }, [])
  
  const restoreFocus = React.useCallback(() => {
    if (previousFocus.current) {
      previousFocus.current.focus()
      previousFocus.current = null
    }
  }, [])
  
  React.useEffect(() => {
    return () => {
      restoreFocus()
    }
  }, [restoreFocus])
  
  return { saveFocus, restoreFocus }
}

/**
 * Focus visible hook
 * 
 * Track if user is using keyboard navigation
 */
export function useFocusVisible(): boolean {
  const [focusVisible, setFocusVisible] = React.useState(false)
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusVisible(true)
      }
    }
    
    const handleMouseDown = () => {
      setFocusVisible(false)
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])
  
  return focusVisible
}

/**
 * Auto focus hook
 * 
 * Auto focus element when component mounts
 */
export function useAutoFocus<T extends HTMLElement = HTMLElement>(
  enabled: boolean = true,
  options?: {
    delay?: number
    preventScroll?: boolean
  }
): React.RefObject<T> {
  const ref = React.useRef<T>(null)
  
  React.useEffect(() => {
    if (!enabled || !ref.current) return
    
    const focusElement = () => {
      ref.current?.focus({
        preventScroll: options?.preventScroll,
      })
    }
    
    if (options?.delay) {
      const timeout = setTimeout(focusElement, options.delay)
      return () => clearTimeout(timeout)
    } else {
      focusElement()
    }
  }, [enabled, options?.delay, options?.preventScroll])
  
  return ref
}

/**
 * Focus within hook
 * 
 * Detect if focus is within an element
 */
export function useFocusWithin<T extends HTMLElement = HTMLElement>(): {
  ref: React.RefObject<T>
  isFocusWithin: boolean
} {
  const ref = React.useRef<T>(null)
  const [isFocusWithin, setIsFocusWithin] = React.useState(false)
  
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const handleFocusIn = () => setIsFocusWithin(true)
    const handleFocusOut = (e: FocusEvent) => {
      if (!element.contains(e.relatedTarget as Node)) {
        setIsFocusWithin(false)
      }
    }
    
    element.addEventListener('focusin', handleFocusIn)
    element.addEventListener('focusout', handleFocusOut)
    
    return () => {
      element.removeEventListener('focusin', handleFocusIn)
      element.removeEventListener('focusout', handleFocusOut)
    }
  }, [])
  
  return { ref, isFocusWithin }
}
