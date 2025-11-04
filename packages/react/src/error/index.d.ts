/**
 * Error tracking and reporting system
 *
 * This module provides comprehensive error tracking and reporting functionality
 * with support for multiple error tracking providers (Sentry, Rollbar, Bugsnag, etc.)
 * and user feedback collection.
 *
 * @example
 * ```tsx
 * import {
 *   ErrorReporterProvider,
 *   createSentryProvider,
 *   createConsoleProvider,
 *   useErrorReporter
 * } from '@chat-ui/react'
 *
 * function App() {
 *   return (
 *     <ErrorReporterProvider
 *       config={{
 *         providers: [
 *           createSentryProvider({ dsn: 'YOUR_DSN' }),
 *           createConsoleProvider()
 *         ],
 *         enabled: process.env.NODE_ENV === 'production',
 *         autoReport: true,
 *         enableFeedback: true
 *       }}
 *     >
 *       <YourApp />
 *     </ErrorReporterProvider>
 *   )
 * }
 * ```
 */
export type { ErrorSeverity, ErrorReport, ErrorProvider, ErrorReporterConfig, ErrorFeedback as ErrorFeedbackType, ErrorBoundaryState, ErrorStats, } from './types';
export { ErrorReporterProvider, useErrorReporter } from './ErrorReporter';
export { createSentryProvider, createRollbarProvider, createBugsnagProvider, createCustomAPIProvider, createConsoleErrorProvider, createLocalStorageErrorProvider, getStoredErrors, clearStoredErrors, } from './providers';
export { ErrorFeedback, ErrorFeedbackButton } from './ErrorFeedback';
//# sourceMappingURL=index.d.ts.map