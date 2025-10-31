import * as React from 'react'

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection'

const hapticPatterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [30, 50, 30, 50, 30],
  selection: 5,
}

export interface UseHapticOptions {
  enabled?: boolean
}

export const useHaptic = ({ enabled = true }: UseHapticOptions = {}) => {
  const [isSupported, setIsSupported] = React.useState(false)

  React.useEffect(() => {
    // Check if vibration API is supported
    setIsSupported('vibrate' in navigator)
  }, [])

  const vibrate = React.useCallback(
    (pattern: HapticPattern | number | number[]) => {
      if (!enabled || !isSupported) return false

      try {
        let vibrationPattern: number | number[]

        if (typeof pattern === 'string') {
          vibrationPattern = hapticPatterns[pattern]
        } else {
          vibrationPattern = pattern
        }

        return navigator.vibrate(vibrationPattern)
      } catch (error) {
        console.warn('Haptic feedback failed:', error)
        return false
      }
    },
    [enabled, isSupported]
  )

  const stop = React.useCallback(() => {
    if (!isSupported) return false

    try {
      return navigator.vibrate(0)
    } catch (error) {
      console.warn('Stop haptic failed:', error)
      return false
    }
  }, [isSupported])

  // Convenience methods for common patterns
  const light = React.useCallback(() => vibrate('light'), [vibrate])
  const medium = React.useCallback(() => vibrate('medium'), [vibrate])
  const heavy = React.useCallback(() => vibrate('heavy'), [vibrate])
  const success = React.useCallback(() => vibrate('success'), [vibrate])
  const warning = React.useCallback(() => vibrate('warning'), [vibrate])
  const error = React.useCallback(() => vibrate('error'), [vibrate])
  const selection = React.useCallback(() => vibrate('selection'), [vibrate])

  return {
    isSupported,
    vibrate,
    stop,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
  }
}

// HOC to add haptic feedback to click events
export interface WithHapticProps {
  onClick?: (e: React.MouseEvent) => void
  hapticPattern?: HapticPattern
  hapticEnabled?: boolean
}

export const withHaptic = <P extends object>(
  Component: React.ComponentType<P>,
  defaultPattern: HapticPattern = 'light'
) => {
  return React.forwardRef<any, P & WithHapticProps>((props, ref) => {
    const { onClick, hapticPattern = defaultPattern, hapticEnabled = true, ...rest } = props
    const { vibrate } = useHaptic({ enabled: hapticEnabled })

    const handleClick = (e: React.MouseEvent) => {
      vibrate(hapticPattern)
      onClick?.(e)
    }

    return <Component ref={ref} {...(rest as P)} onClick={handleClick} />
  })
}

// Hook for haptic feedback on specific events
export interface UseHapticFeedbackOptions {
  onSuccess?: HapticPattern
  onError?: HapticPattern
  onWarning?: HapticPattern
  onSelection?: HapticPattern
  enabled?: boolean
}

export const useHapticFeedback = ({
  onSuccess = 'success',
  onError = 'error',
  onWarning = 'warning',
  onSelection = 'selection',
  enabled = true,
}: UseHapticFeedbackOptions = {}) => {
  const { vibrate } = useHaptic({ enabled })

  const triggerSuccess = React.useCallback(() => {
    vibrate(onSuccess)
  }, [vibrate, onSuccess])

  const triggerError = React.useCallback(() => {
    vibrate(onError)
  }, [vibrate, onError])

  const triggerWarning = React.useCallback(() => {
    vibrate(onWarning)
  }, [vibrate, onWarning])

  const triggerSelection = React.useCallback(() => {
    vibrate(onSelection)
  }, [vibrate, onSelection])

  return {
    triggerSuccess,
    triggerError,
    triggerWarning,
    triggerSelection,
  }
}
