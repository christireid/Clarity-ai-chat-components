'use client'

import * as React from 'react'

// Declare process for environments that may not have @types/node
declare const process: { env: { NODE_ENV?: string } } | undefined

/**
 * Options for useControllableState hook
 */
export interface UseControllableStateOptions<T> {
  /**
   * The controlled value prop from the parent component.
   * If undefined, the component operates in uncontrolled mode.
   */
  prop?: T
  /**
   * The default value for uncontrolled mode.
   * Only used when prop is undefined.
   */
  defaultProp?: T
  /**
   * Callback fired when the value changes.
   * Called in both controlled and uncontrolled modes.
   */
  onChange?: (value: T) => void
}

type SetStateAction<T> = T | ((prevState: T) => T)

/**
 * Hook for components that can be controlled or uncontrolled
 *
 * @description
 * This hook allows components to work in both controlled and uncontrolled modes.
 * When `prop` is provided, the component is controlled and state changes must be
 * managed by the parent. When `prop` is undefined, the component manages its own
 * internal state.
 *
 * The hook also handles edge cases like:
 * - Switching between controlled and uncontrolled modes (warns in development)
 * - Calling onChange in both modes
 * - Proper handling of function updates
 *
 * This pattern is used by Radix UI, Chakra UI, and other professional libraries.
 *
 * @example
 * ```tsx
 * // In a Toggle component
 * interface ToggleProps {
 *   pressed?: boolean
 *   defaultPressed?: boolean
 *   onPressedChange?: (pressed: boolean) => void
 * }
 *
 * function Toggle({ pressed, defaultPressed, onPressedChange }: ToggleProps) {
 *   const [isPressed, setIsPressed] = useControllableState({
 *     prop: pressed,
 *     defaultProp: defaultPressed ?? false,
 *     onChange: onPressedChange,
 *   })
 *
 *   return (
 *     <button onClick={() => setIsPressed(!isPressed)}>
 *       {isPressed ? 'On' : 'Off'}
 *     </button>
 *   )
 * }
 *
 * // Uncontrolled usage
 * <Toggle defaultPressed={false} onPressedChange={console.log} />
 *
 * // Controlled usage
 * const [pressed, setPressed] = useState(false)
 * <Toggle pressed={pressed} onPressedChange={setPressed} />
 * ```
 *
 * @see {@link https://v2.chakra-ui.com/docs/hooks/use-controllable} Chakra useControllable
 * @see {@link https://github.com/radix-ui/primitives} Radix UI implementation
 *
 * @param options - Configuration options
 * @returns [value, setValue] - Current value and setter function
 */
export function useControllableState<T>(
  options: UseControllableStateOptions<T>
): [T, (value: SetStateAction<T>) => void] {
  const { prop, defaultProp, onChange } = options

  // Track whether the component is controlled
  const isControlled = prop !== undefined
  const isControlledRef = React.useRef(isControlled)

  // Warn if switching between controlled and uncontrolled
  React.useEffect(() => {
    // Safe check for development environment that works in all bundlers
    const isDev =
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV !== 'production'

    if (isDev) {
      if (isControlledRef.current !== isControlled) {
        console.warn(
          `[useControllableState] Component is switching from ${
            isControlledRef.current ? 'controlled' : 'uncontrolled'
          } to ${
            isControlled ? 'controlled' : 'uncontrolled'
          }. Components should not switch from controlled to uncontrolled (or vice versa). ` +
            `Decide between using a controlled or uncontrolled component for the lifetime of the component.`
        )
      }
    }
  }, [isControlled])

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = React.useState<T | undefined>(
    defaultProp
  )

  // Determine the current value
  const value = isControlled ? prop : internalValue

  // Stable reference to onChange
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Create stable setValue function
  const setValue = React.useCallback(
    (nextValue: SetStateAction<T>) => {
      // Handle function updater
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (prevState: T) => T)(value as T)
          : nextValue

      // In uncontrolled mode, update internal state
      if (!isControlled) {
        setInternalValue(resolvedValue)
      }

      // Always call onChange if provided
      onChangeRef.current?.(resolvedValue)
    },
    [isControlled, value]
  )

  return [value as T, setValue]
}

/**
 * Simpler hook for boolean controlled state (common pattern)
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useControllableBoolean({
 *   prop: controlledOpen,
 *   defaultProp: false,
 *   onChange: onOpenChange,
 * })
 * ```
 */
export function useControllableBoolean(
  options: UseControllableStateOptions<boolean>
): [boolean, (value: SetStateAction<boolean>) => void] {
  return useControllableState({
    ...options,
    defaultProp: options.defaultProp ?? false,
  })
}
