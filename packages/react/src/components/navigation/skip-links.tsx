'use client'

/**
 * Skip Links Component
 *
 * Provides keyboard-accessible skip navigation links for screen reader users
 * and keyboard-only navigation. These links are visually hidden until focused.
 *
 * Best practices implemented:
 * - Links appear on first Tab keypress
 * - Multiple skip targets for complex layouts
 * - High contrast, prominent styling when visible
 * - Smooth scroll to targets with focus management
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { useReducedMotion } from '@/hooks/accessibility/use-reduced-motion'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../animations/constants'

export interface SkipLink {
  /** Target element ID (without #) */
  targetId: string
  /** Label for the skip link */
  label: string
  /** Optional priority (higher = shown first) */
  priority?: number
}

export interface SkipLinksProps {
  /** Array of skip link configurations */
  links?: SkipLink[]
  /** Custom class name */
  className?: string
}

const defaultSkipLinks: SkipLink[] = [
  { targetId: 'main-content', label: 'Skip to main content', priority: 100 },
  { targetId: 'chat-input', label: 'Skip to chat input', priority: 90 },
  { targetId: 'chat-messages', label: 'Skip to messages', priority: 80 },
  { targetId: 'navigation', label: 'Skip to navigation', priority: 70 },
]

export function SkipLinks({
  links = defaultSkipLinks,
  className,
}: SkipLinksProps) {
  const prefersReducedMotion = useReducedMotion()
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sort links by priority
  const sortedLinks = React.useMemo(
    () => [...links].sort((a, b) => (b.priority || 0) - (a.priority || 0)),
    [links]
  )

  const handleClick = (targetId: string) => {
    const target = document.getElementById(targetId)
    if (target) {
      // Ensure the target is focusable
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
      }
      // Smooth scroll and focus
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      target.focus({ preventScroll: true })
    }
    setFocusedIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        setFocusedIndex((index + 1) % sortedLinks.length)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        setFocusedIndex((index - 1 + sortedLinks.length) % sortedLinks.length)
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(sortedLinks.length - 1)
        break
    }
  }

  // Focus the active link when index changes
  React.useEffect(() => {
    if (focusedIndex !== null && containerRef.current) {
      const links = containerRef.current.querySelectorAll('a')
      links[focusedIndex]?.focus()
    }
  }, [focusedIndex])

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed top-0 left-0 z-[9999] p-2',
        'pointer-events-none',
        className
      )}
      role="navigation"
      aria-label="Skip links"
    >
      {sortedLinks.map((link, index) => (
        <motion.a
          key={link.targetId}
          href={`#${link.targetId}`}
          onClick={(e) => {
            e.preventDefault()
            handleClick(link.targetId)
          }}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            // Base styles - hidden by default
            'block mb-1 px-4 py-3 rounded-lg font-semibold text-sm',
            'bg-primary text-primary-foreground',
            'shadow-lg border-2 border-primary-foreground/20',
            'outline-none pointer-events-auto',
            'transform transition-all duration-200',
            // Hidden until focused
            'sr-only focus:not-sr-only',
            'focus:translate-y-0 focus:opacity-100',
            // Visible styles
            focusedIndex === index && [
              'ring-4 ring-primary-foreground/30',
              'scale-105',
            ]
          )}
          initial={prefersReducedMotion ? false : { y: -100, opacity: 0 }}
          animate={{
            y: focusedIndex === index ? 0 : -100,
            opacity: focusedIndex === index ? 1 : 0,
          }}
          exit={prefersReducedMotion ? false : { y: -100, opacity: 0 }}
          transition={{
            duration: durations.normal,
            ease: EASING_FRAMER.sharp,
          }}
          viewport={{ once: true }}
          tabIndex={0}
        >
          {link.label}
          <span className="ml-2 text-primary-foreground/70">
            ({index + 1}/{sortedLinks.length})
          </span>
        </motion.a>
      ))}
    </div>
  )
}

SkipLinks.displayName = 'SkipLinks'

/**
 * Hook to register a landmark region for skip links
 */
export function useSkipLinkTarget(id: string) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (element) {
      element.id = id
      // Ensure focusable
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1')
      }
    }
  }, [id])

  return ref
}

/**
 * Wrapper component that creates a landmark region
 */
export interface LandmarkProps {
  /** Landmark ID for skip link targeting */
  id: string
  /** ARIA role for the landmark */
  role?: 'main' | 'navigation' | 'search' | 'complementary' | 'region'
  /** Accessible label for the region */
  'aria-label'?: string
  /** Children elements */
  children: React.ReactNode
  /** Custom class name */
  className?: string
  /** HTML element to render */
  as?: React.ElementType
}

export function Landmark({
  id,
  role = 'region',
  'aria-label': ariaLabel,
  children,
  className,
  as = 'div',
}: LandmarkProps) {
  // Type assertion for component that accepts children and ARIA props
  const Component = as as React.ComponentType<{
    id: string
    role?: string
    'aria-label'?: string
    tabIndex?: number
    className?: string
    children?: React.ReactNode
  }>

  return (
    <Component
      id={id}
      role={role}
      aria-label={ariaLabel}
      tabIndex={-1}
      className={cn('outline-none focus:outline-none', className)}
    >
      {children}
    </Component>
  )
}

Landmark.displayName = 'Landmark'
