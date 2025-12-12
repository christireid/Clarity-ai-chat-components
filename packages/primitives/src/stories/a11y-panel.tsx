/**
 * Accessibility Panel Components for Storybook
 *
 * These components provide real-time accessibility information display
 * for use in Storybook stories. They help developers understand and
 * verify ARIA attributes and accessibility features.
 *
 * @example
 * ```tsx
 * import { A11yPanel, AriaAttributesDisplay, FocusOrderVisualization } from './a11y-panel'
 *
 * // In your story
 * <div>
 *   <YourComponent />
 *   <A11yPanel targetSelector="[role='dialog']" />
 * </div>
 * ```
 */

import * as React from 'react'
import { cn } from '../lib/utils'

// ============================================================================
// Types
// ============================================================================

interface AriaAttribute {
  name: string
  value: string
}

interface ElementInfo {
  tagName: string
  role: string | null
  ariaAttributes: AriaAttribute[]
  id: string | null
  tabIndex: number
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract ARIA attributes from an element
 */
function getAriaAttributes(element: Element): AriaAttribute[] {
  const attributes: AriaAttribute[] = []
  const ariaPrefix = 'aria-'

  for (const attr of element.attributes) {
    if (attr.name.startsWith(ariaPrefix) || attr.name === 'role') {
      attributes.push({ name: attr.name, value: attr.value })
    }
  }

  return attributes.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get element info for accessibility display
 */
function getElementInfo(element: Element): ElementInfo {
  return {
    tagName: element.tagName.toLowerCase(),
    role: element.getAttribute('role'),
    ariaAttributes: getAriaAttributes(element),
    id: element.id || null,
    tabIndex:
      element instanceof HTMLElement
        ? element.tabIndex
        : parseInt(element.getAttribute('tabindex') || '-1', 10),
  }
}

/**
 * Get all focusable elements in order
 */
function getFocusableElementsInOrder(container: Element): Element[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ')

  return Array.from(container.querySelectorAll(selector))
}

// ============================================================================
// Components
// ============================================================================

/**
 * Display ARIA attributes for a single element
 */
export function AriaAttributesDisplay({
  element,
  className,
}: {
  element: Element | null
  className?: string
}) {
  if (!element) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        No element selected
      </div>
    )
  }

  const info = getElementInfo(element)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
          &lt;{info.tagName}&gt;
        </code>
        {info.role && (
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">
            role=&quot;{info.role}&quot;
          </span>
        )}
        {info.id && (
          <span className="text-xs text-muted-foreground">#{info.id}</span>
        )}
      </div>

      {info.ariaAttributes.length > 0 ? (
        <ul className="space-y-1">
          {info.ariaAttributes.map((attr) => (
            <li
              key={attr.name}
              className="flex items-center gap-2 text-xs font-mono"
            >
              <span className="text-blue-600 dark:text-blue-400">
                {attr.name}
              </span>
              <span className="text-muted-foreground">=</span>
              <span className="text-green-600 dark:text-green-400">
                &quot;{attr.value}&quot;
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No ARIA attributes</p>
      )}
    </div>
  )
}

/**
 * Visualize focus order within a container
 */
export function FocusOrderVisualization({
  containerSelector,
  className,
}: {
  containerSelector: string
  className?: string
}) {
  const [focusableElements, setFocusableElements] = React.useState<Element[]>(
    []
  )

  React.useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (container) {
      setFocusableElements(getFocusableElementsInOrder(container))
    }

    // Set up mutation observer to update on DOM changes
    const observer = new MutationObserver(() => {
      const updatedContainer = document.querySelector(containerSelector)
      if (updatedContainer) {
        setFocusableElements(getFocusableElementsInOrder(updatedContainer))
      }
    })

    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex'],
      })
    }

    return () => observer.disconnect()
  }, [containerSelector])

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium">
        Focus Order ({focusableElements.length} elements)
      </h4>
      {focusableElements.length > 0 ? (
        <ol className="space-y-1 list-decimal list-inside">
          {focusableElements.map((element, index) => {
            const info = getElementInfo(element)
            return (
              <li key={index} className="text-xs">
                <code className="font-mono">
                  {info.tagName}
                  {info.id && `#${info.id}`}
                  {info.role && ` [role="${info.role}"]`}
                </code>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="text-xs text-muted-foreground">No focusable elements</p>
      )}
    </div>
  )
}

/**
 * Live region announcements log
 */
export function AnnouncementsLog({ className }: { className?: string }) {
  const [announcements, setAnnouncements] = React.useState<string[]>([])

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'childList' ||
          mutation.type === 'characterData'
        ) {
          const target = mutation.target as HTMLElement
          if (
            target.getAttribute('aria-live') ||
            target.getAttribute('role') === 'alert' ||
            target.getAttribute('role') === 'status'
          ) {
            const text = target.textContent?.trim()
            if (text) {
              setAnnouncements((prev) => [...prev.slice(-9), text])
            }
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium">Screen Reader Announcements</h4>
      {announcements.length > 0 ? (
        <ul className="space-y-1">
          {announcements.map((msg, index) => (
            <li
              key={index}
              className="text-xs px-2 py-1 bg-muted rounded font-mono"
            >
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No announcements yet</p>
      )}
    </div>
  )
}

/**
 * Complete accessibility panel combining all features
 */
export function A11yPanel({
  targetSelector,
  className,
}: {
  targetSelector?: string
  className?: string
}) {
  const [targetElement, setTargetElement] = React.useState<Element | null>(null)

  React.useEffect(() => {
    if (targetSelector) {
      const element = document.querySelector(targetSelector)
      setTargetElement(element)
    }
  }, [targetSelector])

  return (
    <div
      className={cn(
        'mt-4 p-4 border border-border rounded-lg bg-card space-y-4',
        className
      )}
    >
      <h3 className="text-sm font-semibold border-b border-border pb-2">
        ♿ Accessibility Panel
      </h3>

      {targetSelector && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Target: {targetSelector}
          </h4>
          <AriaAttributesDisplay element={targetElement} />
        </div>
      )}

      {targetSelector && (
        <FocusOrderVisualization containerSelector={targetSelector} />
      )}

      <AnnouncementsLog />
    </div>
  )
}

export default A11yPanel
