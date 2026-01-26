/**
 * Accessibility React Hooks
 * Custom hooks for managing accessibility features in React components
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { createFocusTrap, announceToScreenReader, prefersReducedMotion } from '@/lib/accessibility'

/**
 * Hook to manage focus trap in modals and dialogs
 * Automatically traps focus when component is mounted
 */
export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean,
  options?: {
    initialFocus?: HTMLElement | null
    returnFocus?: boolean
    escapeDeactivates?: boolean
    onDeactivate?: () => void
  }
) {
  const containerRef = useRef<T>(null)
  const trapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      trapRef.current?.deactivate()
      return
    }

    const trap = createFocusTrap(containerRef.current, {
      initialFocus: options?.initialFocus || undefined,
      returnFocus: options?.returnFocus,
      escapeDeactivates: options?.escapeDeactivates,
    })

    trapRef.current = trap
    trap.activate()

    return () => {
      trap.deactivate()
      options?.onDeactivate?.()
    }
  }, [isActive, options?.initialFocus, options?.returnFocus, options?.escapeDeactivates, options?.onDeactivate])

  return containerRef
}

/**
 * Hook to announce messages to screen readers
 */
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])

  return announce
}

/**
 * Hook to detect and respond to keyboard events
 */
export function useKeyboardShortcut(
  keys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options?: {
    enabled?: boolean
    preventDefault?: boolean
    requireModifier?: 'ctrl' | 'meta' | 'shift' | 'alt'
  }
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (options?.enabled === false) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const targetKeys = Array.isArray(keys) ? keys : [keys]

      // Check if the key matches
      if (!targetKeys.includes(event.key)) return

      // Check for required modifier
      if (options?.requireModifier) {
        const hasModifier =
          (options.requireModifier === 'ctrl' && event.ctrlKey) ||
          (options.requireModifier === 'meta' && event.metaKey) ||
          (options.requireModifier === 'shift' && event.shiftKey) ||
          (options.requireModifier === 'alt' && event.altKey)

        if (!hasModifier) return
      }

      if (options?.preventDefault !== false) {
        event.preventDefault()
      }

      callbackRef.current(event)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [keys, options?.enabled, options?.preventDefault, options?.requireModifier])
}

/**
 * Hook to manage ARIA live regions for dynamic content
 */
export function useLiveRegion() {
  const [message, setMessage] = useState<string>('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = useCallback((msg: string, prio: 'polite' | 'assertive' = 'polite') => {
    setMessage(msg)
    setPriority(prio)

    // Clear message after announcement
    setTimeout(() => setMessage(''), 1000)
  }, [])

  return {
    message,
    priority,
    announce,
  }
}

/**
 * Hook to manage accessible modal state
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const open = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement
    setIsOpen(true)

    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)

    // Restore body scroll
    document.body.style.overflow = ''

    // Restore focus
    if (previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return shouldReduceMotion
}

/**
 * Hook to manage focus restoration after navigation or async operations
 */
export function useFocusManagement() {
  const previousFocus = useRef<HTMLElement | null>(null)

  const captureFocus = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (previousFocus.current) {
      previousFocus.current.focus()
      previousFocus.current = null
    }
  }, [])

  const clearFocus = useCallback(() => {
    previousFocus.current = null
  }, [])

  return {
    captureFocus,
    restoreFocus,
    clearFocus,
  }
}

/**
 * Hook to manage unique IDs for ARIA relationships
 */
let idCounter = 0
export function useId(prefix = 'a11y'): string {
  const [id] = useState(() => {
    idCounter += 1
    return `${prefix}-${idCounter}-${Date.now()}`
  })

  return id
}

/**
 * Hook to manage roving tabindex for keyboard navigation in lists
 */
export function useRovingTabIndex<T extends HTMLElement>(
  itemCount: number,
  options?: {
    loop?: boolean
    orientation?: 'horizontal' | 'vertical'
  }
) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsRef = useRef<(T | null)[]>([])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const isHorizontal = options?.orientation === 'horizontal'
      const loop = options?.loop !== false

      let nextIndex = index

      if (event.key === 'ArrowDown' && !isHorizontal) {
        event.preventDefault()
        nextIndex = index + 1
      } else if (event.key === 'ArrowUp' && !isHorizontal) {
        event.preventDefault()
        nextIndex = index - 1
      } else if (event.key === 'ArrowRight' && isHorizontal) {
        event.preventDefault()
        nextIndex = index + 1
      } else if (event.key === 'ArrowLeft' && isHorizontal) {
        event.preventDefault()
        nextIndex = index - 1
      } else if (event.key === 'Home') {
        event.preventDefault()
        nextIndex = 0
      } else if (event.key === 'End') {
        event.preventDefault()
        nextIndex = itemCount - 1
      }

      // Handle looping
      if (loop) {
        if (nextIndex < 0) nextIndex = itemCount - 1
        if (nextIndex >= itemCount) nextIndex = 0
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, itemCount - 1))
      }

      if (nextIndex !== index) {
        setCurrentIndex(nextIndex)
        itemsRef.current[nextIndex]?.focus()
      }
    },
    [itemCount, options?.loop, options?.orientation]
  )

  const getItemProps = useCallback(
    (index: number) => ({
      ref: (el: T | null) => {
        itemsRef.current[index] = el
      },
      tabIndex: currentIndex === index ? 0 : -1,
      onKeyDown: (event: React.KeyboardEvent) => handleKeyDown(event, index),
      onClick: () => {
        setCurrentIndex(index)
      },
    }),
    [currentIndex, handleKeyDown]
  )

  return {
    currentIndex,
    setCurrentIndex,
    getItemProps,
  }
}

/**
 * Hook to detect if element is visible in viewport (for lazy loading)
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return {
    ref,
    isIntersecting,
  }
}

/**
 * Hook to manage accessible disclosure/accordion patterns
 */
export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const buttonId = useId('disclosure-button')
  const panelId = useId('disclosure-panel')

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const buttonProps = {
    id: buttonId,
    'aria-expanded': isOpen,
    'aria-controls': panelId,
    onClick: toggle,
  }

  const panelProps = {
    id: panelId,
    'aria-labelledby': buttonId,
    hidden: !isOpen,
  }

  return {
    isOpen,
    toggle,
    open,
    close,
    buttonProps,
    panelProps,
  }
}
