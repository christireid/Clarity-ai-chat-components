/**
 * WCAG 2.1 AAA Compliance Validator
 *
 * Provides comprehensive accessibility auditing and validation utilities
 * for ensuring WCAG 2.1 AAA compliance.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react'
import { getContrastRatio } from './core-utilities'

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * WCAG 2.1 AAA Compliance Configuration
 */
export interface WCAGComplianceConfig {
  // Color Contrast
  enforceAAAContrast: boolean
  minContrastRatio: number // 7:1 for AAA normal text, 4.5:1 for large text

  // Keyboard Navigation
  enableKeyboardNavigation: boolean
  enableFocusIndicators: boolean
  enableSkipLinks: boolean

  // Screen Reader Support
  enableARIALabels: boolean
  enableLiveRegions: boolean
  enableLandmarks: boolean

  // Cognitive Accessibility
  enableReducedMotion: boolean
  enableSimpleLanguage: boolean
  enableConsistentNavigation: boolean

  // Motor Accessibility
  enableLargeClickTargets: boolean
  enableGestureAlternatives: boolean
  enableTimeoutExtensions: boolean
}

export interface AccessibilityViolation {
  type: 'contrast' | 'keyboard' | 'screen-reader' | 'cognitive' | 'motor'
  severity: 'low' | 'medium' | 'high' | 'critical'
  element: string
  message: string
  wcagGuideline: string
  recommendation: string
  timestamp: Date
}

export interface AccessibilityReport {
  compliant: boolean
  violations: AccessibilityViolation[]
  score: number // 0-100
  level: 'A' | 'AA' | 'AAA'
  timestamp: Date
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_WCAG_CONFIG: WCAGComplianceConfig = {
  enforceAAAContrast: true,
  minContrastRatio: 7.0, // 7:1 for AAA normal text
  enableKeyboardNavigation: true,
  enableFocusIndicators: true,
  enableSkipLinks: true,
  enableARIALabels: true,
  enableLiveRegions: true,
  enableLandmarks: true,
  enableReducedMotion: true,
  enableSimpleLanguage: false,
  enableConsistentNavigation: true,
  enableLargeClickTargets: true,
  enableGestureAlternatives: true,
  enableTimeoutExtensions: true,
}

// ============================================================================
// Color Contrast Checker
// ============================================================================

/**
 * Color contrast checking utilities for WCAG compliance
 */
export class ColorContrastChecker {
  /**
   * Check if two colors meet WCAG AAA contrast requirements
   */
  static meetsAAAContrast(
    color1: string,
    color2: string,
    isLargeText = false
  ): boolean {
    const ratio = getContrastRatio(color1, color2)
    const requiredRatio = isLargeText ? 4.5 : 7.0
    return ratio >= requiredRatio
  }

  /**
   * Get WCAG compliance level based on contrast ratio
   */
  static getWCAGLevel(ratio: number, isLargeText = false): 'A' | 'AA' | 'AAA' {
    const requiredAAA = isLargeText ? 4.5 : 7.0
    const requiredAA = isLargeText ? 3.0 : 4.5
    const requiredA = 3.0

    if (ratio >= requiredAAA) return 'AAA'
    if (ratio >= requiredAA) return 'AA'
    if (ratio >= requiredA) return 'A'
    return 'A' // Fail returns minimum level
  }
}

// ============================================================================
// WCAG Compliance Checker
// ============================================================================

/**
 * Comprehensive WCAG 2.1 compliance checker
 */
export class WCAGComplianceChecker {
  private config: WCAGComplianceConfig
  private violations: AccessibilityViolation[] = []

  constructor(config: Partial<WCAGComplianceConfig> = {}) {
    this.config = { ...DEFAULT_WCAG_CONFIG, ...config }
  }

  /**
   * Check color contrast compliance
   */
  checkColorContrast(
    foregroundColor: string,
    backgroundColor: string,
    isLargeText = false
  ): AccessibilityViolation | null {
    const ratio = getContrastRatio(foregroundColor, backgroundColor)
    const level = ColorContrastChecker.getWCAGLevel(ratio, isLargeText)

    if (this.config.enforceAAAContrast && level !== 'AAA') {
      return {
        type: 'contrast',
        severity: 'high',
        element: 'text',
        message: `Color contrast ratio ${ratio.toFixed(2)}:1 does not meet WCAG AAA requirements`,
        wcagGuideline: 'WCAG 2.1 - 1.4.6 Contrast (Enhanced)',
        recommendation: `Use colors with a contrast ratio of at least 7:1 (normal text) or 4.5:1 (large text)`,
        timestamp: new Date(),
      }
    }

    return null
  }

  /**
   * Check keyboard navigation compliance
   */
  checkKeyboardNavigation(element: HTMLElement): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = []

    const focusableElements = element.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      violations.push({
        type: 'keyboard',
        severity: 'medium',
        element: element.tagName,
        message: 'No keyboard-focusable elements found',
        wcagGuideline: 'WCAG 2.1 - 2.1.1 Keyboard',
        recommendation:
          'Ensure all interactive elements are keyboard accessible',
        timestamp: new Date(),
      })
    }

    if (this.config.enableFocusIndicators) {
      focusableElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el as Element)
        const outline = computedStyle.outline

        if (outline === 'none' || outline === '0px') {
          violations.push({
            type: 'keyboard',
            severity: 'medium',
            element: (el as Element).tagName,
            message: 'Element lacks visible focus indicator',
            wcagGuideline: 'WCAG 2.1 - 2.4.7 Focus Visible',
            recommendation:
              'Add visible focus indicators to all interactive elements',
            timestamp: new Date(),
          })
        }
      })
    }

    return violations
  }

  /**
   * Check screen reader compliance
   */
  checkScreenReaderSupport(element: HTMLElement): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = []

    // Check for alt text on images
    const images = element.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        violations.push({
          type: 'screen-reader',
          severity: 'high',
          element: 'img',
          message: 'Image missing alt text',
          wcagGuideline: 'WCAG 2.1 - 1.1.1 Non-text Content',
          recommendation: 'Add descriptive alt text to all images',
          timestamp: new Date(),
        })
      }
    })

    // Check for ARIA labels
    if (this.config.enableARIALabels) {
      const interactiveElements = element.querySelectorAll(
        'button, a, input, select, textarea'
      )
      interactiveElements.forEach((el) => {
        const hasLabel =
          el.hasAttribute('aria-label') ||
          el.hasAttribute('aria-labelledby') ||
          (el.textContent?.trim().length ?? 0) > 0

        if (!hasLabel) {
          violations.push({
            type: 'screen-reader',
            severity: 'medium',
            element: (el as Element).tagName,
            message: 'Interactive element lacks accessible label',
            wcagGuideline: 'WCAG 2.1 - 4.1.2 Name, Role, Value',
            recommendation:
              'Add ARIA label or descriptive text to interactive elements',
            timestamp: new Date(),
          })
        }
      })
    }

    // Check for landmarks
    if (this.config.enableLandmarks) {
      const landmarks = element.querySelectorAll(
        'main, nav, aside, header, footer, section[aria-label], section[aria-labelledby]'
      )
      if (landmarks.length === 0) {
        violations.push({
          type: 'screen-reader',
          severity: 'medium',
          element: 'document',
          message: 'No ARIA landmarks found',
          wcagGuideline: 'WCAG 2.1 - 2.4.1 Bypass Blocks',
          recommendation: 'Add ARIA landmarks to help screen reader navigation',
          timestamp: new Date(),
        })
      }
    }

    return violations
  }

  /**
   * Check cognitive accessibility
   */
  checkCognitiveAccessibility(element: HTMLElement): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = []

    if (this.config.enableReducedMotion) {
      const animatedElements = element.querySelectorAll('*')
      animatedElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el as Element)
        const transition = computedStyle.transition
        const animation = computedStyle.animation

        if (
          (transition !== 'none' && transition !== 'all 0s ease 0s') ||
          (animation !== 'none' &&
            animation !== '0s ease 0s 1 normal none running none')
        ) {
          violations.push({
            type: 'cognitive',
            severity: 'low',
            element: (el as Element).tagName,
            message: 'Element has animations without reduced motion support',
            wcagGuideline: 'WCAG 2.1 - 2.3.3 Animation from Interactions',
            recommendation:
              'Provide option to disable animations or respect prefers-reduced-motion',
            timestamp: new Date(),
          })
        }
      })
    }

    return violations
  }

  /**
   * Run comprehensive accessibility audit
   */
  audit(element: HTMLElement = document.body): AccessibilityReport {
    this.violations = []

    // Check color contrast
    const textElements = element.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, span, a, button, li, td, th'
    )
    textElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el as Element)
      const color = computedStyle.color
      const backgroundColor = computedStyle.backgroundColor

      const violation = this.checkColorContrast(color, backgroundColor)
      if (violation) {
        this.violations.push(violation)
      }
    })

    // Check keyboard navigation
    this.violations.push(...this.checkKeyboardNavigation(element))

    // Check screen reader support
    this.violations.push(...this.checkScreenReaderSupport(element))

    // Check cognitive accessibility
    this.violations.push(...this.checkCognitiveAccessibility(element))

    // Calculate score and level
    const score = Math.max(0, 100 - this.violations.length * 5)
    const level = this.getWCAGLevel()

    return {
      compliant: this.violations.length === 0,
      violations: this.violations,
      score,
      level,
      timestamp: new Date(),
    }
  }

  /**
   * Get WCAG compliance level based on violations
   */
  private getWCAGLevel(): 'A' | 'AA' | 'AAA' {
    const criticalViolations = this.violations.filter(
      (v) => v.severity === 'critical'
    ).length
    const highViolations = this.violations.filter(
      (v) => v.severity === 'high'
    ).length
    const mediumViolations = this.violations.filter(
      (v) => v.severity === 'medium'
    ).length

    if (
      criticalViolations === 0 &&
      highViolations === 0 &&
      mediumViolations <= 2
    ) {
      return 'AAA'
    } else if (criticalViolations === 0 && highViolations <= 2) {
      return 'AA'
    }
    return 'A'
  }

  /**
   * Get current violations
   */
  getViolations(): AccessibilityViolation[] {
    return [...this.violations]
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = []
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<WCAGComplianceConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Hook for WCAG compliance checking
 */
export function useWCAGCompliance(config?: Partial<WCAGComplianceConfig>) {
  const [checker] = useState(() => new WCAGComplianceChecker(config))
  const [complianceReport, setComplianceReport] =
    useState<AccessibilityReport | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkCompliance = useCallback(
    (element?: HTMLElement) => {
      setIsChecking(true)
      const report = checker.audit(element || document.body)
      setComplianceReport(report)
      setIsChecking(false)
      return report
    },
    [checker]
  )

  const getViolations = useCallback(() => {
    return checker.getViolations()
  }, [checker])

  const updateConfig = useCallback(
    (newConfig: Partial<WCAGComplianceConfig>) => {
      checker.updateConfig(newConfig)
    },
    [checker]
  )

  return {
    checker,
    complianceReport,
    isChecking,
    checkCompliance,
    getViolations,
    updateConfig,
  }
}

/**
 * Hook for keyboard navigation support
 */
export function useKeyboardNavigation() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleFocus = () => {
      setFocusedElement(document.activeElement as HTMLElement)
    }

    const handleBlur = () => {
      setFocusedElement(null)
    }

    document.addEventListener('focus', handleFocus, true)
    document.addEventListener('blur', handleBlur, true)

    return () => {
      document.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('blur', handleBlur, true)
    }
  }, [])

  const focusNextElement = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const currentIndex = Array.from(focusableElements).indexOf(
      document.activeElement as Element
    )
    const nextIndex = (currentIndex + 1) % focusableElements.length
    ;(focusableElements[nextIndex] as HTMLElement)?.focus()
  }, [])

  const focusPreviousElement = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const currentIndex = Array.from(focusableElements).indexOf(
      document.activeElement as Element
    )
    const previousIndex =
      currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
    ;(focusableElements[previousIndex] as HTMLElement)?.focus()
  }, [])

  return {
    focusedElement,
    focusNextElement,
    focusPreviousElement,
  }
}
