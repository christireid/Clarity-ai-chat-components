/**
 * Error Reporter Provider
 *
 * This component provides error tracking and reporting functionality throughout the app.
 * It automatically captures unhandled errors and provides utilities for manual error reporting.
 */
import React from 'react';
import type { ErrorReport, ErrorReporterConfig, ErrorStats } from './types';
/**
 * Error Reporter Context
 */
interface ErrorReporterContextValue {
    /** Report an error manually */
    reportError: (error: Error | string, context?: Record<string, any>) => void;
    /** Report an error with full options */
    reportErrorDetailed: (report: Partial<ErrorReport>) => void;
    /** Set user context */
    setUser: (userId: string, email?: string, userData?: Record<string, any>) => void;
    /** Set global context */
    setContext: (context: Record<string, any>) => void;
    /** Add breadcrumb for debugging */
    addBreadcrumb: (message: string, data?: Record<string, any>) => void;
    /** Get error statistics */
    getStats: () => ErrorStats;
    /** Check if error reporting is enabled */
    isEnabled: boolean;
}
/**
 * Error Reporter Provider Props
 */
export interface ErrorReporterProviderProps {
    children: React.ReactNode;
    config: ErrorReporterConfig;
}
/**
 * Error Reporter Provider Component
 *
 * @example
 * ```tsx
 * import { ErrorReporterProvider, createSentryProvider, createConsoleProvider } from '@chat-ui/react'
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
export declare function ErrorReporterProvider({ children, config }: ErrorReporterProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Hook to access error reporter
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { reportError, setUser, addBreadcrumb } = useErrorReporter()
 *
 *   useEffect(() => {
 *     setUser('user-123', 'user@example.com')
 *   }, [])
 *
 *   const handleAction = () => {
 *     addBreadcrumb('User clicked button')
 *     try {
 *       // Some action
 *     } catch (error) {
 *       reportError(error, { action: 'button_click' })
 *     }
 *   }
 *
 *   return <button onClick={handleAction}>Click me</button>
 * }
 * ```
 */
export declare function useErrorReporter(): ErrorReporterContextValue;
export {};
//# sourceMappingURL=ErrorReporter.d.ts.map