/**
 * Recovery strategy function type
 */
export type RecoveryStrategy = () => void | Promise<void>;
/**
 * Hook for managing custom error recovery strategies
 *
 * @example
 * ```tsx
 * const { registerStrategy, recover, isRecovering } = useErrorRecovery()
 *
 * // Register recovery strategies
 * registerStrategy('API_ERROR', async () => {
 *   await reconnectToAPI()
 * })
 *
 * registerStrategy('AUTH_ERROR', async () => {
 *   await refreshToken()
 * })
 *
 * // Trigger recovery
 * await recover('API_ERROR')
 * ```
 */
export declare function useErrorRecovery(): {
    /** Register a recovery strategy for an error type */
    registerStrategy: (errorType: string, strategy: RecoveryStrategy) => void;
    /** Unregister a recovery strategy */
    unregisterStrategy: (errorType: string) => void;
    /** Attempt to recover from an error using its registered strategy */
    recover: (errorType: string) => Promise<boolean>;
    /** Whether a recovery operation is in progress */
    isRecovering: boolean;
    /** Last error that occurred during recovery */
    lastRecoveryError: Error | null;
    /** Reset recovery state */
    reset: () => void;
    /** Map of all registered strategies */
    strategies: Map<string, RecoveryStrategy>;
};
//# sourceMappingURL=useErrorRecovery.d.ts.map