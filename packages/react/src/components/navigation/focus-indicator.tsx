'use client'

/**
 * Focus Indicator Component
 *
 * Provides beautiful, animated focus indicators that follow focused elements.
 * Enhances keyboard navigation with visual feedback.
 *
 * Features:
 * - Smooth animated focus ring that follows elements
 * - Customizable colors and styles
 * - Respects reduced motion preferences
 * - Works with any focusable element
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'

export interface FocusIndicatorProps {
  /** Whether to show the focus indicator */
  enabled?: boolean
  /** Custom class name for the indicator */
  className?: string
  /** Ring color - uses CSS custom property */
  color?: string
  /** Ring width in pixels */
  ringWidth?: number
  /** Ring offset from element in pixels */
  offset?: number
  /** Border radius - 'inherit' matches focused element */
  borderRadius?: 'inherit' | number | string
  /** Animation duration in ms */
  duration?: number
  /** Only show for keyboard focus (not mouse clicks) */
  keyboardOnly?: boolean
}

interface FocusRect {
  x: number
  y: number
  width: number
  height: number
  borderRadius: string
}

export function FocusIndicator({
  enabled = true,
  className,
  color = 'hsl(var(--primary))',
  ringWidth = 2,
  offset = 3,
  borderRadius = 'inherit',
  duration = 150,
  keyboardOnly = true,
}: FocusIndicatorProps) {
  const [focusRect, setFocusRect] = React.useState<FocusRect | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isKeyboardNav, setIsKeyboardNav] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()
  const animationDuration = prefersReducedMotion ? 0 : duration

  // Track keyboard vs mouse navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardNav(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardNav(false)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('mousedown', handleMouseDown, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('mousedown', handleMouseDown, true)
    }
  }, [])

  // Track focused element
  React.useEffect(() => {
    if (!enabled) {
      setIsVisible(false)
      return
    }

    const updateFocusRect = () => {
      const activeElement = document.activeElement as HTMLElement

      // Skip if not keyboard navigation and keyboardOnly is true
      if (keyboardOnly && !isKeyboardNav) {
        setIsVisible(false)
        return
      }

      // Skip if no active element or it's the body
      if (!activeElement || activeElement === document.body) {
        setIsVisible(false)
        return
      }

      // Skip elements that should not show focus indicator
      if (
        activeElement.hasAttribute('data-no-focus-indicator') ||
        activeElement.closest('[data-no-focus-indicator]')
      ) {
        setIsVisible(false)
        return
      }

      const rect = activeElement.getBoundingClientRect()
      const computedStyle = window.getComputedStyle(activeElement)

      // Calculate border radius
      let br: string
      if (borderRadius === 'inherit') {
        br = computedStyle.borderRadius || '0px'
      } else if (typeof borderRadius === 'number') {
        br = `${borderRadius}px`
      } else {
        br = borderRadius
      }

      setFocusRect({
        x: rect.x - offset,
        y: rect.y - offset,
        width: rect.width + offset * 2,
        height: rect.height + offset * 2,
        borderRadius: br,
      })
      setIsVisible(true)
    }

    const handleFocus = () => {
      // Small delay to ensure DOM has updated
      requestAnimationFrame(updateFocusRect)
    }

    const handleBlur = () => {
      setIsVisible(false)
    }

    const handleScroll = () => {
      if (isVisible) {
        updateFocusRect()
      }
    }

    const handleResize = () => {
      if (isVisible) {
        updateFocusRect()
      }
    }

    document.addEventListener('focusin', handleFocus, true)
    document.addEventListener('focusout', handleBlur, true)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    // Initial check
    if (document.activeElement && document.activeElement !== document.body) {
      handleFocus()
    }

    return () => {
      document.removeEventListener('focusin', handleFocus, true)
      document.removeEventListener('focusout', handleBlur, true)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [enabled, offset, borderRadius, keyboardOnly, isKeyboardNav, isVisible])

  return (
    <AnimatePresence>
      {isVisible && focusRect && (
        <motion.div
          className={cn(
            'fixed pointer-events-none z-[9998]',
            'border-solid',
            className
          )}
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: focusRect.x,
            y: focusRect.y,
            width: focusRect.width,
            height: focusRect.height,
            borderRadius: focusRect.borderRadius,
          }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.95,
          }}
          transition={{
            duration: animationDuration / 1000,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            borderWidth: ringWidth,
            borderColor: color,
            boxShadow: `0 0 0 ${ringWidth}px ${color}20, 0 0 ${ringWidth * 4}px ${color}30`,
          }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  )
}

FocusIndicator.displayName = 'FocusIndicator'

/**
 * Hook to detect if the user is navigating with keyboard
 */
export function useKeyboardNavigating(): boolean {
  const [isKeyboardNav, setIsKeyboardNav] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardNav(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardNav(false)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('mousedown', handleMouseDown, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('mousedown', handleMouseDown, true)
    }
  }, [])

  return isKeyboardNav
}

/**
 * Focus Ring Component
 *
 * A simpler alternative that adds a focus ring around a specific element
 */
export interface FocusRingProps {
  /** Children to wrap */
  children: React.ReactNode
  /** Custom class name when focused */
  focusClassName?: string
  /** Ring color */
  color?: string
  /** Ring width */
  ringWidth?: number
  /** Whether to show ring */
  enabled?: boolean
  /** Only show for keyboard focus */
  keyboardOnly?: boolean
}

export function FocusRing({
  children,
  focusClassName,
  color = 'hsl(var(--ring))',
  ringWidth = 2,
  enabled = true,
  keyboardOnly = true,
}: FocusRingProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const isKeyboardNav = useKeyboardNavigating()

  const showRing = enabled && isFocused && (!keyboardOnly || isKeyboardNav)

  return (
    <div
      className={cn(
        'relative transition-shadow duration-150',
        showRing && (focusClassName || 'ring-2 ring-offset-2'),
        showRing && `ring-[${color}]`
      )}
      style={
        showRing
          ? {
              boxShadow: `0 0 0 ${ringWidth}px ${color}`,
            }
          : undefined
      }
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {children}
    </div>
  )
}

FocusRing.displayName = 'FocusRing'

/**
 * Focus Visible utility component
 *
 * Only shows focus styles for keyboard navigation
 */
export interface FocusVisibleProps {
  children: (isFocusVisible: boolean) => React.ReactNode
}

export function FocusVisible({ children }: FocusVisibleProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const isKeyboardNav = useKeyboardNavigating()
  const isFocusVisible = isFocused && isKeyboardNav

  return (
    <div onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
      {children(isFocusVisible)}
    </div>
  )
}

FocusVisible.displayName = 'FocusVisible'
