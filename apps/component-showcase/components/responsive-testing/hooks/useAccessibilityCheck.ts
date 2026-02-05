'use client'

import { useState, useCallback } from 'react'

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  category: 'color-contrast' | 'aria' | 'keyboard' | 'semantics' | 'focus'
  message: string
  element?: string
  wcagLevel?: 'A' | 'AA' | 'AAA'
  impact?: 'critical' | 'serious' | 'moderate' | 'minor'
}

export function useAccessibilityCheck() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isChecking, setIsChecking] = useState(false)

  const checkColorContrast = useCallback((element: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []
    const computedStyle = window.getComputedStyle(element)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor

    // Simple contrast check (in real implementation, use proper color contrast algorithm)
    const contrastRatio = 4.5 // Placeholder
    if (contrastRatio < 4.5) {
      issues.push({
        type: 'error',
        category: 'color-contrast',
        message: `Insufficient color contrast ratio: ${contrastRatio.toFixed(2)}:1 (minimum 4.5:1 for AA)`,
        element: element.tagName.toLowerCase(),
        wcagLevel: 'AA',
        impact: 'serious',
      })
    }

    return issues
  }, [])

  const checkARIA = useCallback((element: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []

    // Check for missing ARIA labels on interactive elements
    if (
      ['button', 'a', 'input'].includes(element.tagName.toLowerCase()) &&
      !element.textContent?.trim() &&
      !element.getAttribute('aria-label') &&
      !element.getAttribute('aria-labelledby')
    ) {
      issues.push({
        type: 'error',
        category: 'aria',
        message: 'Interactive element missing accessible label',
        element: element.tagName.toLowerCase(),
        wcagLevel: 'A',
        impact: 'critical',
      })
    }

    // Check for invalid ARIA attributes
    const ariaAttributes = Array.from(element.attributes).filter((attr) =>
      attr.name.startsWith('aria-')
    )
    ariaAttributes.forEach((attr) => {
      // Simplified validation
      if (!attr.value.trim()) {
        issues.push({
          type: 'warning',
          category: 'aria',
          message: `Empty ARIA attribute: ${attr.name}`,
          element: element.tagName.toLowerCase(),
          wcagLevel: 'A',
          impact: 'moderate',
        })
      }
    })

    return issues
  }, [])

  const checkKeyboardAccess = useCallback((element: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []

    // Check if interactive elements are keyboard accessible
    if (
      ['div', 'span'].includes(element.tagName.toLowerCase()) &&
      (element.onclick !== null ||
        element.getAttribute('role') === 'button' ||
        element.getAttribute('role') === 'link')
    ) {
      if (element.tabIndex < 0) {
        issues.push({
          type: 'error',
          category: 'keyboard',
          message: 'Interactive element not keyboard accessible',
          element: element.tagName.toLowerCase(),
          wcagLevel: 'A',
          impact: 'critical',
        })
      }
    }

    return issues
  }, [])

  const checkSemantics = useCallback((element: HTMLElement): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []

    // Check for proper heading hierarchy
    if (element.tagName.match(/^H[1-6]$/)) {
      const level = parseInt(element.tagName[1])
      const prevHeading = element.previousElementSibling?.closest('h1, h2, h3, h4, h5, h6')
      if (prevHeading) {
        const prevLevel = parseInt(prevHeading.tagName[1])
        if (level > prevLevel + 1) {
          issues.push({
            type: 'warning',
            category: 'semantics',
            message: `Heading level skipped from H${prevLevel} to H${level}`,
            element: element.tagName.toLowerCase(),
            wcagLevel: 'AAA',
            impact: 'moderate',
          })
        }
      }
    }

    // Check for images without alt text
    if (element.tagName.toLowerCase() === 'img' && !element.getAttribute('alt')) {
      issues.push({
        type: 'error',
        category: 'semantics',
        message: 'Image missing alt attribute',
        element: 'img',
        wcagLevel: 'A',
        impact: 'critical',
      })
    }

    // Check for form labels
    if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type') !== 'hidden') {
      const id = element.id
      if (!id || !document.querySelector(`label[for="${id}"]`)) {
        issues.push({
          type: 'warning',
          category: 'semantics',
          message: 'Input field missing associated label',
          element: 'input',
          wcagLevel: 'A',
          impact: 'serious',
        })
      }
    }

    return issues
  }, [])

  const runCheck = useCallback(
    (container?: HTMLElement) => {
      setIsChecking(true)
      const allIssues: AccessibilityIssue[] = []

      const root = container || document.body
      const elements = root.querySelectorAll('*')

      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          allIssues.push(...checkColorContrast(element))
          allIssues.push(...checkARIA(element))
          allIssues.push(...checkKeyboardAccess(element))
          allIssues.push(...checkSemantics(element))
        }
      })

      // Remove duplicates
      const uniqueIssues = Array.from(
        new Map(allIssues.map((issue) => [issue.message + issue.element, issue])).values()
      )

      setIssues(uniqueIssues)
      setIsChecking(false)

      return uniqueIssues
    },
    [checkColorContrast, checkARIA, checkKeyboardAccess, checkSemantics]
  )

  const clearIssues = useCallback(() => {
    setIssues([])
  }, [])

  return {
    issues,
    isChecking,
    runCheck,
    clearIssues,
  }
}
