/**
 * Built-in error tracking providers
 *
 * This file provides ready-to-use providers for popular error tracking services.
 * Each provider implements the ErrorProvider interface.
 */
import type { ErrorProvider, ErrorReport } from './types';
/**
 * Sentry provider configuration
 */
interface SentryConfig {
    dsn: string;
    environment?: string;
    release?: string;
    tracesSampleRate?: number;
}
/**
 * Create a Sentry error tracking provider
 *
 * @example
 * ```tsx
 * const sentryProvider = createSentryProvider({
 *   dsn: 'https://xxx@sentry.io/123',
 *   environment: 'production',
 *   release: '1.0.0'
 * })
 * ```
 */
export declare function createSentryProvider(config: SentryConfig): ErrorProvider;
/**
 * Rollbar provider configuration
 */
interface RollbarConfig {
    accessToken: string;
    environment?: string;
    codeVersion?: string;
}
/**
 * Create a Rollbar error tracking provider
 */
export declare function createRollbarProvider(config: RollbarConfig): ErrorProvider;
/**
 * Bugsnag provider configuration
 */
interface BugsnagConfig {
    apiKey: string;
    releaseStage?: string;
    appVersion?: string;
}
/**
 * Create a Bugsnag error tracking provider
 */
export declare function createBugsnagProvider(config: BugsnagConfig): ErrorProvider;
/**
 * Custom API provider configuration
 */
interface CustomAPIConfig {
    endpoint: string;
    headers?: Record<string, string>;
    method?: 'POST' | 'PUT';
}
/**
 * Create a custom API error tracking provider
 *
 * @example
 * ```tsx
 * const apiProvider = createCustomAPIProvider({
 *   endpoint: 'https://api.example.com/errors',
 *   headers: { 'Authorization': 'Bearer token' }
 * })
 * ```
 */
export declare function createCustomAPIProvider(config: CustomAPIConfig): ErrorProvider;
/**
 * Console provider for development
 * Logs errors to the browser console
 */
export declare function createConsoleErrorProvider(): ErrorProvider;
/**
 * LocalStorage provider for offline error tracking
 * Stores errors in localStorage for later retrieval
 */
export declare function createLocalStorageErrorProvider(maxErrors?: number): ErrorProvider;
/**
 * Get all errors stored in localStorage
 */
export declare function getStoredErrors(): ErrorReport[];
/**
 * Clear all errors from localStorage
 */
export declare function clearStoredErrors(): void;
export {};
//# sourceMappingURL=providers.d.ts.map