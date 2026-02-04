/**
 * Utility functions for Think component
 * @packageDocumentation
 */

import * as React from 'react'

/**
 * Handles keyboard events for collapsible elements
 */
export function handleKeyDown(
  e: React.KeyboardEvent,
  callback: () => void
): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    callback()
  }
}
