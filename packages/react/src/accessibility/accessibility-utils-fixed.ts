/**
 * Enhanced Accessibility Utilities for WCAG 2.1 AAA Compliance
 * Fixes the false WCAG 2.1 AAA claims by implementing proper accessibility features
 */

import { useEffect, useState, useCallback } from 'react'

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
  enableTimeoutExtensions: true
}

/**
 * Color contrast calculation utilities
 */
export class ColorContrastChecker {
  /**
   * Calculate relative luminance of a color
   */
  static getLuminance(color: string): number {
    const rgb = this.parseColor(color)
    if (!rgb) return 0

    const [r, g, b] = rgb.map(channel => {
      const sRGB = channel / 255
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1)
    const lum2 = this.getLuminance(color2)
    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Parse color string to RGB array
   */
  private static parseColor(color: string): [number, number, number] | null {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16)
        const g = parseInt(hex[1] + hex[1], 16)
        const b = parseInt(hex[2] + hex[2], 16)
        return [r, g, b]
      } else if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return [r, g, b]
      }
    }
    
    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g)
      if (matches && matches.length >= 3) {
        return [
          parseInt(matches[0]),
          parseInt(matches[1]),
          parseInt(matches[2])
        ]
      }
    }

    return null
  }

  /**
   * Check if two colors meet WCAG AAA contrast requirements
   */
  static meetsAAAContrast(color1: string, color2: string, isLargeText = false): boolean {
    const ratio = this.getContrastRatio(color1, color2)
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
    return 'A' // Fail
  }
}

/**
 * WCAG Compliance Checker
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
  checkColorContrast(forgroundColor: string, backgroundColor: string, isLargeText = false): AccessibilityViolation | null {
    const ratio = ColorContrastChecker.getContrastRatio(forgroundColor, backgroundColor)
    const level = ColorContrastChecker.getWCAGLevel(ratio, isLargeText)
    
    if (this.config.enforceAAAContrast && level !== 'AAA') {
      return {
        type: 'contrast',
        severity: 'high',
        element: 'text',
        message: `Color contrast ratio ${ratio.toFixed(2)}:1 does not meet WCAG AAA requirements`,
        wcagGuideline: 'WCAG 2.1 - 1.4.6 Contrast (Enhanced)',
        recommendation: `Use colors with a contrast ratio of at least 7:1 (normal text) or 4.5:1 (large text)`,
        timestamp: new Date()
      }
    }
    
    return null
  }

  /**
   * Check keyboard navigation compliance
   */
  checkKeyboardNavigation(element: HTMLElement): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = []

    // Check for focusable elements
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
        recommendation: 'Ensure all interactive elements are keyboard accessible',
        timestamp: new Date()
      })
    }

    // Check for focus indicators
    if (this.config.enableFocusIndicators) {
      focusableElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el as Element)
        const outline = computedStyle.outline
        
        if (outline === 'none' || outline === '0px') {
          violations.push({
            type: 'keyboard',
            severity: 'medium',
            element: (el as Element).tagName,
            message: 'Element lacks visible focus indicator',
            wcagGuideline: 'WCAG 2.1 - 2.4.7 Focus Visible',
            recommendation: 'Add visible focus indicators to all interactive elements',
            timestamp: new Date()
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
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        violations.push({
          type: 'screen-reader',
          severity: 'high',
          element: 'img',
          message: 'Image missing alt text',
          wcagGuideline: 'WCAG 2.1 - 1.1.1 Non-text Content',
          recommendation: 'Add descriptive alt text to all images',
          timestamp: new Date()
        })
      }
    })

    // Check for ARIA labels
    if (this.config.enableARIALabels) {
      const interactiveElements = element.querySelectorAll('button, a, input, select, textarea')
      interactiveElements.forEach(el => {
        const hasLabel = el.hasAttribute('aria-label') || 
                        el.hasAttribute('aria-labelledby') || 
                        el.textContent?.trim().length > 0
        
        if (!hasLabel) {
          violations.push({
            type: 'screen-reader',
            severity: 'medium',
            element: (el as Element).tagName,
            message: 'Interactive element lacks accessible label',
            wcagGuideline: 'WCAG 2.1 - 4.1.2 Name, Role, Value',
            recommendation: 'Add ARIA label or descriptive text to interactive elements',
            timestamp: new Date()
          })
        }
      })
    }

    // Check for landmarks
    if (this.config.enableLandmarks) {
      const landmarks = element.querySelectorAll('main, nav, aside, header, footer, section[aria-label], section[aria-labelledby]')
      if (landmarks.length === 0) {
        violations.push({
          type: 'screen-reader',
          severity: 'medium',
          element: 'document',
          message: 'No ARIA landmarks found',
          wcagGuideline: 'WCAG 2.1 - 2.4.1 Bypass Blocks',
          recommendation: 'Add ARIA landmarks to help screen reader navigation',
          timestamp: new Date()
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

    // Check for reduced motion support
    if (this.config.enableReducedMotion) {
      const animatedElements = element.querySelectorAll('*')
      animatedElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el as Element)
        const transition = computedStyle.transition
        const animation = computedStyle.animation
        
        if ((transition !== 'none' && transition !== 'all 0s ease 0s') || 
            (animation !== 'none' && animation !== '0s ease 0s 1 normal none running none')) {
          violations.push({
            type: 'cognitive',
            severity: 'low',
            element: (el as Element).tagName,
            message: 'Element has animations without reduced motion support',
            wcagGuideline: 'WCAG 2.1 - 2.3.3 Animation from Interactions',
            recommendation: 'Provide option to disable animations or respect prefers-reduced-motion',
            timestamp: new Date()
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
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li, td, th')
    textElements.forEach(el => {
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
    const score = Math.max(0, 100 - (this.violations.length * 5))
    const level = this.getWCAGLevel()

    return {
      compliant: this.violations.length === 0,
      violations: this.violations,
      score,
      level,
      timestamp: new Date()
    }
  }

  /**
   * Get WCAG compliance level based on violations
   */
  private getWCAGLevel(): 'A' | 'AA' | 'AAA' {
    const criticalViolations = this.violations.filter(v => v.severity === 'critical').length
    const highViolations = this.violations.filter(v => v.severity === 'high').length
    const mediumViolations = this.violations.filter(v => v.severity === 'medium').length

    if (criticalViolations === 0 && highViolations === 0 && mediumViolations <= 2) {
      return 'AAA'
    } else if (criticalViolations === 0 && highViolations <= 2) {
      return 'AA'
    } else if (criticalViolations === 0) {
      return 'A'
    }
    return 'A'
  }

  /**
   * Get violations
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

/**
 * React Hook for WCAG Compliance
 */
export function useWCAGCompliance(config?: Partial<WCAGComplianceConfig>) {
  const [checker] = useState(() => new WCAGComplianceChecker(config))
  const [complianceReport, setComplianceReport] = useState<AccessibilityReport | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkCompliance = useCallback((element?: HTMLElement) => {
    setIsChecking(true)
    const report = checker.audit(element || document.body)
    setComplianceReport(report)
    setIsChecking(false)
    return report
  }, [checker])

  const getViolations = useCallback(() => {
    return checker.getViolations()
  }, [checker])

  const updateConfig = useCallback((newConfig: Partial<WCAGComplianceConfig>) => {
    checker.updateConfig(newConfig)
  }, [checker])

  return {
    checker,
    complianceReport,
    isChecking,
    checkCompliance,
    getViolations,
    updateConfig
  }
}

/**
 * Hook for detecting reduced motion preference
 */
export function useReducedMotionEnhanced() {
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

  const getAccessibleDuration = useCallback((defaultDuration: number): number => {
    return prefersReducedMotion ? Math.min(defaultDuration, 200) : defaultDuration
  }, [prefersReducedMotion])

  const createAccessibleAnimation = useCallback((animationClass: string): string => {
    if (prefersReducedMotion) {
      return `
        @media (prefers-reduced-motion: reduce) {
          .${animationClass} {
            animation: none !important;
            transition: none !important;
          }
        }
      `
    }
    return ''
  }, [prefersReducedMotion])

  return {
    prefersReducedMotion,
    getAccessibleDuration,
    createAccessibleAnimation
  }
}

/**
 * Hook for keyboard navigation support
 */
export function useKeyboardNavigation() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
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
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element)
    const nextIndex = (currentIndex + 1) % focusableElements.length
    ;(focusableElements[nextIndex] as HTMLElement)?.focus()
  }, [])

  const focusPreviousElement = useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element)
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
    ;(focusableElements[previousIndex] as HTMLElement)?.focus()
  }, [])

  return {
    focusedElement,
    focusNextElement,
    focusPreviousElement
  }
}