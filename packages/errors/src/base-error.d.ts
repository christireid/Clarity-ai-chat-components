/**
 * Base error class for Clarity Chat
 * Provides structured error information with helpful debugging context
 */
export interface ErrorContext {
    /** Where the error occurred (file, function, line) */
    location?: string;
    /** What the user was trying to do */
    action?: string;
    /** Relevant data that might help debugging */
    data?: Record<string, any>;
    /** Stack trace from the original error */
    originalStack?: string;
}
export interface ErrorSolution {
    /** Brief description of the solution */
    description: string;
    /** Step-by-step instructions */
    steps?: string[];
    /** Code example showing the fix */
    example?: string;
    /** Link to documentation */
    docsUrl?: string;
}
export declare abstract class ClarityError extends Error {
    /** Error code for programmatic handling */
    readonly code: string;
    /** User-friendly error message */
    readonly userMessage: string;
    /** Technical details for developers */
    readonly technicalMessage: string;
    /** Suggested solutions */
    readonly solutions: ErrorSolution[];
    /** Additional context */
    readonly context: ErrorContext;
    /** Timestamp when error occurred */
    readonly timestamp: Date;
    /** Original error if this wraps another error */
    readonly originalError?: Error;
    constructor(code: string, userMessage: string, technicalMessage: string, solutions?: ErrorSolution[], context?: ErrorContext, originalError?: Error);
    /**
     * Format error for display in terminal
     */
    toTerminalString(): string;
    /**
     * Format error for JSON API response
     */
    toJSON(): {
        originalError?: {
            message: string;
            stack: string | undefined;
        } | undefined;
        name: string;
        code: string;
        message: string;
        technicalMessage: string;
        solutions: ErrorSolution[];
        context: ErrorContext;
        timestamp: string;
    };
    /**
     * Format error for logging
     */
    toLogString(): string;
}
//# sourceMappingURL=base-error.d.ts.map