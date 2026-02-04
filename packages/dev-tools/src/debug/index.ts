/**
 * Debug utilities
 *
 * Comprehensive debugging tools for Clarity Chat:
 * - API Inspector: Monitor API calls and responses
 * - Enhanced Console: Advanced logging with filtering and export
 * - Component Monitor: Track React component performance
 * - Token Tracker: Monitor AI token usage and costs
 * - State Diff: Visualize state changes
 * - Network Timeline: Track network requests
 * - Error Tracker: Monitor errors and recovery
 * - Dev Notifications: Real-time developer feedback
 * - Time Travel: Debug state history
 */

export * from './api-inspector'

// Re-export logger with renamed types to avoid conflicts
export {
  type Logger,
  createLogger,
  getLogger,
  setGlobalLogLevel,
  configureLogger,
  logInfoBox,
  logWarningBox,
  logErrorBox,
  logSuccessBox,
  logKeyValue,
  type LogEntry,
  type LoggerOptions,
} from './logger'
export { type LogLevel as DebugLogLevel } from './logger'

// Re-export time-travel with renamed types to avoid conflicts
export {
  TimeTravelDebugger,
  createTimeTravelHook,
  renderTimeline,
  type StateTransition,
} from './time-travel'
export { type StateSnapshot as TimeTravelSnapshot } from './time-travel'

// Re-export enhanced console with its own LogLevel type
export {
  EnhancedConsole,
  createEnhancedConsole,
  getEnhancedConsole,
  type EnhancedLogEntry,
  type ConsoleFilter,
  type ConsoleExportOptions,
} from './enhanced-console'
export { type LogLevel as ConsoleLogLevel } from './enhanced-console'

export * from './component-monitor'
export * from './token-tracker'
export * from './state-diff'
export * from './network-timeline'
export * from './error-tracker'
export * from './dev-notifications'
