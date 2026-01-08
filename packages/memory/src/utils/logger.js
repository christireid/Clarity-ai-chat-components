/**
 * Logger Utility
 *
 * Centralized logging with levels and formatting
 */
class ClarityLogger {
    level;
    prefix;
    constructor(level = 'warn', prefix = '[ClarityMemory]') {
        this.level = level;
        this.prefix = prefix;
    }
    shouldLog(level) {
        const levels = ['silent', 'error', 'warn', 'info', 'debug'];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
    error(message, ...args) {
        if (this.shouldLog('error')) {
            console.error(`${this.prefix} [ERROR] ${message}`, ...args);
        }
    }
    warn(message, ...args) {
        if (this.shouldLog('warn')) {
            console.warn(`${this.prefix} [WARN] ${message}`, ...args);
        }
    }
    info(message, ...args) {
        if (this.shouldLog('info')) {
            console.info(`${this.prefix} [INFO] ${message}`, ...args);
        }
    }
    debug(message, ...args) {
        if (this.shouldLog('debug')) {
            console.log(`${this.prefix} [DEBUG] ${message}`, ...args);
        }
    }
    setLevel(level) {
        this.level = level;
    }
}
// Default logger instance
export const logger = new ClarityLogger();
/**
 * Create a logger instance
 */
export function createLogger(level = 'warn', prefix) {
    return new ClarityLogger(level, prefix);
}
//# sourceMappingURL=logger.js.map