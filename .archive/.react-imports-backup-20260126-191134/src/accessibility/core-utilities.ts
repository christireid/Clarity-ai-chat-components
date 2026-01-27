/**
 * Core Accessibility Utilities
 *
 * Consolidated utilities for accessibility support including:
 * - ARIA attribute generation
 * - Screen reader support
 * - Color contrast checking
 * - Reduced motion detection
 * - Focus management helpers
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@clarity-chat/primitives'

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate unique ID for ARIA attributes
 */
export function generateAriaId(prefix: string = 'aria'): string {
  const rand = Math.random().toString(36).substring(2, 11)
  const time =
    typeof performance !== 'undefined' && performance.now
      ? Math.floor(performance.now()).toString(36)
      : ''
  return `${prefix}-${time}${time ? '-' : ''}${rand}`
}

// ============================================================================
// Screen Reader Support
// ============================================================================

/**
 * Announce message to screen readers
 *
 * @deprecated Prefer using the `useA11y().announce()` hook from `@clarity-chat/primitives`
 * for React components. This function remains available for non-React contexts.
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  if (typeof window === 'undefined') return true
  const style = window.getComputedStyle(element)
  return (
    !element.hidden &&
    element.getAttribute('aria-hidden') !== 'true' &&
    style.visibility !== 'hidden' &&
    style.display !== 'none'
  )
}

/**
 * Get accessible name for element
 */
export function getAccessibleName(element: HTMLElement): string {
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy && typeof document !== 'undefined') {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent || ''
  }

  if (element.id && typeof document !== 'undefined') {
    const label = document.querySelector(`label[for="${element.id}"]`)
    if (label) return label.textContent || ''
  }

  return element.textContent || ''
}

/**
 * Create live region for announcements
 *
 * @deprecated Prefer using `A11yProvider` from `@clarity-chat/primitives` which
 * automatically manages live regions with proper lifecycle handling.
 */
export function createLiveRegion(id: string = 'live-region'): HTMLElement {
  if (typeof document === 'undefined') {
    // @ts-expect-error SSR fallback: no element available
    return {}
  }
  let region = document.getElementById(id)

  if (!region) {
    region = document.createElement('div')
    region.id = id
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    region.className = 'sr-only'
    document.body.appendChild(region)
  }

  return region
}

// ============================================================================
// Color Contrast
// ============================================================================

/**
 * Calculate relative luminance of a color (WCAG algorithm)
 */
function getLuminance(color: string): number {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    let r: number, g: number, b: number

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    } else {
      return 0
    }

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0)
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g)
    if (matches && matches.length >= 3) {
      const [r, g, b] = matches.map((c) => {
        const val = parseInt(c, 10) / 255
        return val <= 0.03928
          ? val / 12.92
          : Math.pow((val + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
  }

  return 0
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check WCAG contrast ratio with detailed results
 */
export function checkContrastRatio(
  foreground: string,
  background: string
): {
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  level: 'AAA' | 'AA' | 'Fail'
} {
  const ratio = getContrastRatio(foreground, background)

  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail',
  }
}

/**
 * Check if colors meet WCAG contrast requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AAA'
): boolean {
  const ratio = getContrastRatio(foreground, background)
  const threshold = level === 'AAA' ? 7 : 4.5
  return ratio >= threshold
}

/**
 * Generate accessible color palette based on contrast requirements
 */
export function generateAccessibleColors(baseColor: string): {
  primary: string
  secondary: string
  text: string
  background: string
  accent: string
} {
  const background = baseColor
  const text = meetsContrastRequirements('#ffffff', background, 'AAA')
    ? '#ffffff'
    : '#000000'

  return {
    primary: baseColor,
    secondary: text === '#ffffff' ? '#f0f0f0' : '#333333',
    text,
    background,
    accent: baseColor,
  }
}

// ============================================================================
// Reduced Motion
// ============================================================================

// Re-export useReducedMotion from primitives
export { useReducedMotion } from '@clarity-chat/primitives'

/**
 * Get accessible animation duration based on user preferences
 */
export function getAccessibleDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  if (typeof window === 'undefined') return normalDuration
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  return prefersReduced ? reducedDuration : normalDuration
}

// ============================================================================
// ARIA Props & Helpers
// ============================================================================

/**
 * Accessibility props for interactive elements
 */
export interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-haspopup'?:
    | boolean
    | 'false'
    | 'true'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog'
  'aria-hidden'?: boolean
  'aria-disabled'?: boolean
  'aria-busy'?: boolean
  'aria-required'?: boolean
  'aria-readonly'?: boolean
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling'
  'aria-live'?: 'off' | 'assertive' | 'polite'
  'aria-atomic'?: boolean
  'aria-relevant'?:
    | 'additions'
    | 'additions removals'
    | 'additions text'
    | 'all'
    | 'removals'
    | 'text'
  'aria-valuenow'?: number
  'aria-valuemin'?: number
  'aria-valuemax'?: number
  'aria-valuetext'?: string
  'aria-current'?:
    | boolean
    | 'false'
    | 'true'
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
  'aria-modal'?: boolean
  role?: string
  tabIndex?: number
}

/**
 * Create ARIA label from component props
 */
export function createAriaLabel(
  componentName: string,
  props: Record<string, unknown>
): string {
  const parts = [componentName]

  if (props.variant) parts.push(String(props.variant))
  if (props.size) parts.push(String(props.size))
  if (props.state) parts.push(String(props.state))
  if (props.label) parts.push(String(props.label))
  if (props.title) parts.push(String(props.title))

  return parts.join(' ').trim()
}

/**
 * Create accessibility props for buttons
 */
export function createButtonAccessibility(
  props: Record<string, unknown>,
  additionalProps: Partial<AccessibilityProps> = {}
): AccessibilityProps {
  const accessibility: AccessibilityProps = {
    ...additionalProps,
  }

  if (props.variant === 'loading') {
    accessibility['aria-busy'] = true
    accessibility['aria-label'] =
      (props['aria-label'] as string) || 'Button is loading'
  }

  if (props.disabled) {
    accessibility['aria-disabled'] = true
    accessibility.tabIndex = -1
  }

  if (props.variant === 'destructive') {
    accessibility['aria-label'] =
      (props['aria-label'] as string) || 'Destructive action'
  }

  return accessibility
}

/**
 * Create accessibility props for form inputs
 */
export function createInputAccessibility(
  props: Record<string, unknown>,
  additionalProps: Partial<AccessibilityProps> = {}
): AccessibilityProps {
  const accessibility: AccessibilityProps = {
    ...additionalProps,
  }

  if (props.required) accessibility['aria-required'] = true
  if (props.disabled) accessibility['aria-disabled'] = true
  if (props.readOnly) accessibility['aria-readonly'] = true

  if (props.error) {
    accessibility['aria-invalid'] = true
    accessibility['aria-describedby'] = `${props.id}-error`
  }

  if (props.value !== undefined)
    accessibility['aria-valuenow'] = props.value as number
  if (props.min !== undefined)
    accessibility['aria-valuemin'] = props.min as number
  if (props.max !== undefined)
    accessibility['aria-valuemax'] = props.max as number

  return accessibility
}

/**
 * Create accessibility props for navigation items
 */
export function createNavigationAccessibility(
  currentPath: string,
  itemPath: string,
  additionalProps: Partial<AccessibilityProps> = {}
): AccessibilityProps {
  const accessibility: AccessibilityProps = {
    ...additionalProps,
  }

  if (currentPath === itemPath) {
    accessibility['aria-current'] = 'page'
  }

  return accessibility
}

/**
 * Create accessibility props for modals and dialogs
 */
export function createModalAccessibility(
  isOpen: boolean,
  additionalProps: Partial<AccessibilityProps> = {}
): AccessibilityProps {
  const accessibility: AccessibilityProps = {
    ...additionalProps,
    role: 'dialog',
    'aria-modal': true,
  }

  if (isOpen) {
    accessibility.tabIndex = -1
  } else {
    accessibility['aria-hidden'] = true
  }

  return accessibility
}

// ============================================================================
// DOM Utilities
// ============================================================================

/**
 * Screen reader only CSS styles
 */
export const srOnlyStyles = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  borderWidth: 0,
}

/**
 * Create skip to content link
 */
export function createSkipLink(
  targetId: string,
  text: string = 'Skip to main content'
): HTMLElement {
  if (typeof document === 'undefined') {
    // @ts-expect-error SSR fallback
    return {}
  }

  const link = document.createElement('a')
  link.href = `#${targetId}`
  link.textContent = text
  link.className = 'skip-link'
  link.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background: #000;
    color: #fff;
    text-decoration: none;
  `

  link.addEventListener('focus', () => {
    link.style.left = '0'
  })

  link.addEventListener('blur', () => {
    link.style.left = '-9999px'
  })

  return link
}

/**
 * Validate ARIA attributes on an element
 */
export function validateAriaAttributes(element: HTMLElement): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const role = element.getAttribute('role')

  if (
    role === 'button' &&
    !element.hasAttribute('aria-label') &&
    !element.textContent?.trim()
  ) {
    errors.push('Button must have accessible name')
  }

  if (
    role === 'img' &&
    !element.hasAttribute('alt') &&
    !element.hasAttribute('aria-label')
  ) {
    errors.push('Image must have alt text or aria-label')
  }

  if (typeof document !== 'undefined') {
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy && !document.getElementById(labelledBy)) {
      errors.push(`aria-labelledby references non-existent ID: ${labelledBy}`)
    }

    const describedBy = element.getAttribute('aria-describedby')
    if (describedBy && !document.getElementById(describedBy)) {
      errors.push(`aria-describedby references non-existent ID: ${describedBy}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
