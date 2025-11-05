/**
 * Error type for different retry strategies
 */
export type RetryErrorType = 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown';
/**
 * Retry button props
 */
export interface RetryButtonProps {
    /** Function to call on retry */
    onRetry: () => void | Promise<void>;
    /** Maximum number of retry attempts (default: 3) */
    maxAttempts?: number;
    /** Backoff delays in milliseconds for each attempt (default: [1000, 3000, 10000]) */
    backoffMs?: number[];
    /** Error type for appropriate messaging (default: 'unknown') */
    errorType?: RetryErrorType;
    /** Current attempt number (external control) */
    attemptNumber?: number;
    /** Whether button is disabled */
    disabled?: boolean;
    /** Custom button text */
    buttonText?: string;
    /** Show remaining attempts count (default: true) */
    showAttemptsRemaining?: boolean;
    /** Callback when max attempts reached */
    onMaxAttemptsReached?: () => void;
    /** Callback when retry starts */
    onRetryStart?: (attempt: number) => void;
    /** Callback when retry succeeds */
    onRetrySuccess?: (attempt: number) => void;
    /** Callback when retry fails */
    onRetryFail?: (attempt: number, error: Error) => void;
    /** Custom CSS class */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Visual variant */
    variant?: 'default' | 'ghost' | 'outline';
}
/**
 * Production-ready Retry Button component with exponential backoff.
 *
 * **Features:**
 * - Exponential backoff with configurable delays
 * - Type-specific error messages (network, rate limit, server, auth)
 * - Visual feedback during retry countdown
 * - Attempt tracking and max attempts enforcement
 * - Success/failure callbacks for analytics
 * - Accessible (keyboard navigation, ARIA attributes)
 * - Loading states during retry operation
 *
 * **Use Cases:**
 * - Retry failed API requests
 * - Reconnect after network errors
 * - Handle rate limit errors gracefully
 * - Provide user-friendly error recovery
 *
 * @example
 * ```tsx
 * // Basic network error retry
 * <RetryButton
 *   onRetry={handleRetry}
 *   errorType="network"
 *   maxAttempts={3}
 * />
 *
 * // Custom backoff delays
 * <RetryButton
 *   onRetry={async () => {
 *     await sendMessage()
 *   }}
 *   backoffMs={[2000, 5000, 15000]} // 2s, 5s, 15s
 *   errorType="ratelimit"
 * />
 *
 * // With analytics tracking
 * <RetryButton
 *   onRetry={handleRetry}
 *   onRetryStart={(attempt) => {
 *     analytics.track('retry_started', { attempt })
 *   }}
 *   onRetrySuccess={(attempt) => {
 *     analytics.track('retry_succeeded', { attempt })
 *   }}
 *   onRetryFail={(attempt, error) => {
 *     analytics.track('retry_failed', { attempt, error: error.message })
 *   }}
 *   onMaxAttemptsReached={() => {
 *     analytics.track('max_retries_reached')
 *     showSupportDialog()
 *   }}
 * />
 *
 * // Small ghost variant
 * <RetryButton
 *   onRetry={handleRetry}
 *   size="sm"
 *   variant="ghost"
 *   buttonText="Try Again"
 * />
 * ```
 */
export declare function RetryButton({ onRetry, maxAttempts, backoffMs, errorType, attemptNumber, disabled, buttonText, showAttemptsRemaining, onMaxAttemptsReached, onRetryStart, onRetrySuccess, onRetryFail, className, size, variant, }: RetryButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=retry-button.d.ts.map