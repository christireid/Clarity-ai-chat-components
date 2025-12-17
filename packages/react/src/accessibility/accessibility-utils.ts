/**
 * Accessibility Utilities for Clarity Chat
 * 
 * Provides utilities to fix accessibility warnings and ensure
 * WCAG 2.1 AAA compliance across all components.
 */

import { useEffect, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Get accessible animation duration based on user preferences
 */
export function getAccessibleDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return prefersReduced ? reducedDuration : normalDuration
}

/**
 * Generate accessible CSS for animations
 */
export function createAccessibleAnimation(
  normalAnimation: string,
  reducedAnimation: string = 'none'
): string {
  return `
    @media (prefers-reduced-motion: reduce) {
      ${normalAnimation.replace(/animation-duration:\s*\d+(\.\d+)?(ms|s)/g, 'animation-duration: 0.1s')}
    }
    @media (prefers-reduced-motion: no-preference) {
      ${normalAnimation}
    }
  `
}

/**
 * ARIA label utilities
 */
export function createAriaLabel(
  componentName: string,
  props: Record<string, any>
): string {
  const parts = [componentName]
  
  if (props.variant) parts.push(props.variant)
  if (props.size) parts.push(props.size)
  if (props.state) parts.push(props.state)
  if (props.label) parts.push(props.label)
  if (props.title) parts.push(props.title)
  
  return parts.join(' ').trim()
}

/**
 * Accessibility props for interactive elements
 */
export interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-hidden'?: boolean
  'aria-disabled'?: boolean
  'aria-busy'?: boolean
  'aria-required'?: boolean
  'aria-readonly'?: boolean
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling'
  'aria-live'?: 'off' | 'assertive' | 'polite'
  'aria-atomic'?: boolean
  'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'text'
  'aria-valuenow'?: number
  'aria-valuemin'?: number
  'aria-valuemax'?: number
  'aria-valuetext'?: string
  'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time'
  'aria-modal'?: boolean
  role?: string
  tabIndex?: number
}

/**
 * Create accessibility props for buttons
 */
export function createButtonAccessibility(
  props: Record<string, any>,
  additionalProps: Partial<AccessibilityProps> = {}
): AccessibilityProps {
  const accessibility: AccessibilityProps = {
    ...additionalProps,
  }

  if (props.variant === 'loading') {
    accessibility['aria-busy'] = true
    accessibility['aria-label'] = props['aria-label'] || 'Button is loading'
  }

  if (props.disabled) {
    accessibility['aria-disabled'] = true
    accessibility.tabIndex = props.disabled ? -1 : 0
  }

  if (props.variant === 'destructive') {
    accessibility['aria-label'] = props['aria-label'] || 'Destructive action'
  }

  return accessibility
}

/**
 * Create accessibility props for form inputs
 */
export function createInputAccessibility(
  props: Record<string, any>,
  additionalProps: Partial<AccessibilityProps> = {}
): AccessibilityProps {
  const accessibility: AccessibilityProps = {
    ...additionalProps,
  }

  if (props.required) {
    accessibility['aria-required'] = true
  }

  if (props.disabled) {
    accessibility['aria-disabled'] = true
  }

  if (props.readOnly) {
    accessibility['aria-readonly'] = true
  }

  if (props.error) {
    accessibility['aria-invalid'] = true
    accessibility['aria-describedby'] = `${props.id}-error`
  }

  if (props.value !== undefined) {
    accessibility['aria-valuenow'] = props.value
  }

  if (props.min !== undefined) {
    accessibility['aria-valuemin'] = props.min
  }

  if (props.max !== undefined) {
    accessibility['aria-valuemax'] = props.max
  }

  return accessibility
}

/**
 * Create accessibility props for navigation
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
    // Focus management for modals
    accessibility.tabIndex = -1
  } else {
    // Hide from screen readers when closed
    accessibility['aria-hidden'] = true
  }

  return accessibility
}

/**
 * Color contrast utilities
 */
export function getContrastRatio(foreground: string, background: string): number {
  // WCAG contrast ratio calculation
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)?.map(Number) || [255, 255, 255]
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const L1 = getLuminance(foreground)
  const L2 = getLuminance(background)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
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
 * Generate accessible color palette
 */
export function generateAccessibleColors(baseColor: string): {
  primary: string
  secondary: string
  text: string
  background: string
  accent: string
} {
  // Ensure high contrast for text
  const background = baseColor
  const text = meetsContrastRequirements('#ffffff', background, 'AAA') ? '#ffffff' : '#000000'
  
  return {
    primary: baseColor,
    secondary: text === '#ffffff' ? '#f0f0f0' : '#333333',
    text,
    background,
    accent: baseColor,
  }
}