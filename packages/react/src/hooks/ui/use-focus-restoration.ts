/**
 * Focus Restoration Hook
 *
 * Saves and restores focus when opening/closing modals or dialogs.
 */

import { useRef, useCallback } from 'react'

export interface UseFocusRestorationReturn {
  /** Save the currently focused element */
  saveFocus: () => void
  /** Restore focus to the previously saved element */
  restoreFocus: () => void
}

/**
 * Hook to save and restore focus
 *
 * Useful for modals/dialogs to return focus to the trigger element
 * when closed, improving keyboard navigation and accessibility.
 *
 * @returns Object with saveFocus and restoreFocus methods
 */
export function useFocusRestoration(): UseFocusRestorationReturn {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus()
      previouslyFocusedElement.current = null
    }
  }, [])

  return {
    saveFocus,
    restoreFocus,
  }
}
