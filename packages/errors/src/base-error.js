/**
 * Base error class for Clarity Chat
 * Provides structured error information with helpful debugging context
 */
export class ClarityError extends Error {
    /** Error code for programmatic handling */
    code;
    /** User-friendly error message */
    userMessage;
    /** Technical details for developers */
    technicalMessage;
    /** Suggested solutions */
    solutions;
    /** Additional context */
    context;
    /** Timestamp when error occurred */
    timestamp;
    /** Original error if this wraps another error */
    originalError;
    constructor(code, userMessage, technicalMessage, solutions = [], context = {}, originalError) {
        super(userMessage);
        this.name = this.constructor.name;
        this.code = code;
        this.userMessage = userMessage;
        this.technicalMessage = technicalMessage;
        this.solutions = solutions;
        this.context = context;
        this.timestamp = new Date();
        this.originalError = originalError;
        // Capture stack trace (Node.js/V8 specific, but safe to call)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        // Preserve original stack if available
        if (originalError?.stack) {
            this.context.originalStack = originalError.stack;
        }
    }
    /**
     * Format error for display in terminal
     */
    toTerminalString() {
        const lines = [];
        lines.push(`\n❌ ${this.name}: ${this.userMessage}`);
        lines.push(`\nCode: ${this.code}`);
        if (this.technicalMessage) {
            lines.push(`\n📋 Technical Details:`);
            lines.push(`   ${this.technicalMessage}`);
        }
        if (this.context.location) {
            lines.push(`\n📍 Location: ${this.context.location}`);
        }
        if (this.context.action) {
            lines.push(`\n🎯 Action: ${this.context.action}`);
        }
        if (this.context.data && Object.keys(this.context.data).length > 0) {
            lines.push(`\n📊 Context Data:`);
            Object.entries(this.context.data).forEach(([key, value]) => {
                lines.push(`   ${key}: ${JSON.stringify(value)}`);
            });
        }
        if (this.solutions.length > 0) {
            lines.push(`\n💡 Suggested Solutions:`);
            this.solutions.forEach((solution, index) => {
                lines.push(`\n   ${index + 1}. ${solution.description}`);
                if (solution.steps) {
                    solution.steps.forEach((step, stepIndex) => {
                        lines.push(`      ${stepIndex + 1}. ${step}`);
                    });
                }
                if (solution.example) {
                    lines.push(`\n      Example:`);
                    lines.push(`      ${solution.example.split('\n').join('\n      ')}`);
                }
                if (solution.docsUrl) {
                    lines.push(`\n      📚 Documentation: ${solution.docsUrl}`);
                }
            });
        }
        if (this.originalError) {
            lines.push(`\n🔍 Original Error: ${this.originalError.message}`);
        }
        lines.push(''); // Empty line at end
        return lines.join('\n');
    }
    /**
     * Format error for JSON API response
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.userMessage,
            technicalMessage: this.technicalMessage,
            solutions: this.solutions,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
            ...(this.originalError && {
                originalError: {
                    message: this.originalError.message,
                    stack: this.originalError.stack
                }
            })
        };
    }
    /**
     * Format error for logging
     */
    toLogString() {
        return JSON.stringify({
            timestamp: this.timestamp.toISOString(),
            level: 'error',
            name: this.name,
            code: this.code,
            message: this.userMessage,
            technical: this.technicalMessage,
            context: this.context,
            stack: this.stack
        });
    }
}
//# sourceMappingURL=base-error.js.map