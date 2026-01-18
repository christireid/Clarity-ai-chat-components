/**
 * DOM Utilities
 *
 * Browser-specific utilities for DOM operations.
 * These utilities are SSR-safe and will handle non-browser environments gracefully.
 *
 * @module @clarity-chat/utils/dom
 *
 * @example
 * ```ts
 * import { copyToClipboard, downloadFile } from '@clarity-chat/utils/dom'
 *
 * await copyToClipboard('Hello, World!')
 * downloadFile('data.json', JSON.stringify(data), 'application/json')
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const navigator: any
declare const document: any
declare const window: any
declare const URL: any
declare const Blob: any

// Type declarations for DOM APIs
type Element = {
  scrollIntoView: (options?: any) => void
  getBoundingClientRect: () => {
    top: number
    left: number
    bottom: number
    right: number
    width: number
    height: number
  }
}

type ScrollIntoViewOptions = {
  behavior?: 'auto' | 'smooth'
  block?: 'start' | 'center' | 'end' | 'nearest'
  inline?: 'start' | 'center' | 'end' | 'nearest'
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Copy text to the clipboard
 *
 * Uses the modern Clipboard API when available, with a fallback for older browsers.
 * SSR-safe - returns false in non-browser environments.
 *
 * @param text - The text to copy to the clipboard
 * @returns Promise<boolean> - true if successful, false otherwise
 *
 * @example
 * ```ts
 * const success = await copyToClipboard('Hello, World!')
 * if (success) {
 *   console.log('Copied to clipboard!')
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // SSR safety check
  if (typeof navigator === 'undefined' || typeof document === 'undefined') {
    return false
  }

  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers or non-secure contexts
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, text.length) // For mobile devices
    const success = document.execCommand ? document.execCommand('copy') : false
    document.body.removeChild(textarea)
    return success
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Download content as a file
 *
 * Creates a download link and triggers a file download.
 * SSR-safe - does nothing in non-browser environments.
 *
 * @param filename - The name of the file to download
 * @param content - The content of the file
 * @param mimeType - The MIME type of the file (default: 'text/plain')
 *
 * @example
 * ```ts
 * downloadFile('data.json', JSON.stringify(data), 'application/json')
 * downloadFile('readme.txt', 'Hello World')
 * ```
 */
export function downloadFile(
  filename: string,
  content: string,
  mimeType = 'text/plain'
): void {
  // SSR safety check
  if (typeof document === 'undefined' || typeof URL === 'undefined') {
    return
  }

  try {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download file:', error)
  }
}

/**
 * Scroll an element into view smoothly
 *
 * SSR-safe - does nothing in non-browser environments.
 *
 * @param element - The element to scroll into view
 * @param options - Scroll behavior options
 *
 * @example
 * ```ts
 * const element = document.getElementById('my-element')
 * if (element) {
 *   scrollIntoView(element, { behavior: 'smooth', block: 'center' })
 * }
 * ```
 */
export function scrollIntoView(
  element: Element | null,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'nearest' }
): void {
  if (!element || typeof element.scrollIntoView !== 'function') {
    return
  }

  try {
    element.scrollIntoView(options)
  } catch (error) {
    // Fallback for browsers that don't support options
    element.scrollIntoView()
  }
}

/**
 * Get the current scroll position
 *
 * SSR-safe - returns { x: 0, y: 0 } in non-browser environments.
 *
 * @returns { x: number, y: number } - The current scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 }
  }

  return {
    x: window.scrollX || window.pageXOffset || 0,
    y: window.scrollY || window.pageYOffset || 0,
  }
}

/**
 * Check if an element is in the viewport
 *
 * SSR-safe - returns false in non-browser environments.
 *
 * @param element - The element to check
 * @param threshold - Percentage of element that must be visible (0-1, default: 0)
 * @returns boolean - true if the element is in the viewport
 */
export function isInViewport(element: Element | null, threshold = 0): boolean {
  if (!element || typeof window === 'undefined') {
    return false
  }

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  const elementHeight = rect.height
  const elementWidth = rect.width

  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)

  if (visibleHeight <= 0 || visibleWidth <= 0) {
    return false
  }

  const visibleArea = visibleHeight * visibleWidth
  const totalArea = elementHeight * elementWidth

  return visibleArea / totalArea >= threshold
}
