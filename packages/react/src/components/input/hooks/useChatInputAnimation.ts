/**
 * useChatInputAnimation Hook
 *
 * Manages animation states for PillChatInput container.
 * Provides box shadow animation values for focus states.
 */

import * as React from 'react'

export interface UseChatInputAnimationOptions {
  /** Whether input is focused */
  isFocused: boolean
  /** Disable animations */
  disableAnimations: boolean
}

export interface UseChatInputAnimationReturn {
  /** Animation props for container */
  containerAnimation: {
    boxShadow: string
  }
}

/**
 * Hook for managing chat input animations
 *
 * @example
 * ```tsx
 * const { containerAnimation } = useChatInputAnimation({
 *   isFocused: true,
 *   disableAnimations: false,
 * })
 * ```
 */
export function useChatInputAnimation({
  isFocused,
  disableAnimations,
}: UseChatInputAnimationOptions): UseChatInputAnimationReturn {
  const containerAnimation = React.useMemo(() => {
    if (isFocused && !disableAnimations) {
      return { boxShadow: '0 0 0 2px hsl(var(--primary) / 0.2)' }
    }
    return { boxShadow: '0 0 0 0px transparent' }
  }, [isFocused, disableAnimations])

  return {
    containerAnimation,
  }
}
