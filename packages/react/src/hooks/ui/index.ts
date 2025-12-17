/**
 * UI Hooks
 *
 * General-purpose UI utility hooks for common patterns.
 */

export * from './use-auto-scroll'
export * from './use-clipboard'
export * from './use-debounce'
export * from './use-throttle'
export * from './use-toggle'
export * from './use-previous'
export * from './use-mounted'
export * from './use-is-mounted'
export {
  useMergedRef,
  mergeRefs,
  useMergedRefWithCleanup,
  assignRef,
  type ReactRef,
} from './use-merged-ref'
export * from './use-window-size'
export * from './use-intersection-observer'
export * from './use-event-listener'
export * from './use-media-query'
export * from './use-reduced-motion'
export {
  useAnimatedValue,
  AnimatedNumber,
  useValueChange,
  FlashingValue,
  type UseAnimatedValueOptions,
  type AnimatedValueResult,
  type AnimatedNumberProps,
  type FlashingValueProps,
} from './use-animated-value'
export * from './use-safe-timeout'
