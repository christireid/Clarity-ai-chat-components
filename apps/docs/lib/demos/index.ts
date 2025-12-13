/**
 * Demo utilities barrel export
 * Import from '@/lib/demos' for all demo-related utilities
 */

// Utilities
export {
  generateId,
  copyToClipboard,
  sleep,
  estimateTokens,
  formatCurrency,
  formatNumber,
  randomVariance,
  clamp,
} from './utils'

// Hooks
export {
  useMountedRef,
  useSimulatedStream,
  useCopyToClipboard,
  useDemoExecution,
  useDemoMessages,
} from './hooks'
export type { DemoMessage } from './hooks'

// Analytics
export {
  trackDemoEvent,
  trackDemoViewed,
  trackDemoStarted,
  trackDemoCompleted,
  trackCodeCopied,
  trackFullExampleCopied,
  trackProviderSwitched,
  trackMessageSent,
  trackToolExecuted,
  trackCtaClicked,
  useDemoViewTracking,
} from './analytics'
export type { DemoName, DemoAction } from './analytics'

// Examples
export { fullExamples, getFullExample, getDemoIds } from './examples'
