/**
 * Browser Debug Mode Utility
 *
 * Provides a global debug mode that can be enabled via browser console
 * to help developers debug Clarity Chat applications.
 *
 * Usage (in browser console):
 * ```js
 * // Enable debug mode
 * ClarityDebug.enable()
 *
 * // Enable with specific options
 * ClarityDebug.enable({ level: 'debug', components: ['ChatInput', 'Message'] })
 *
 * // Disable debug mode
 * ClarityDebug.disable()
 *
 * // Check current configuration
 * ClarityDebug.config()
 *
 * // View debug logs
 * ClarityDebug.logs()
 * ```
 *
 * @packageDocumentation
 * @internal
 */
const STORAGE_KEY = 'clarity-chat-debug';
const LOG_LEVEL_PRIORITY = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
};
const LOG_STYLES = {
    trace: 'color: #888',
    debug: 'color: #0ea5e9',
    info: 'color: #22c55e',
    warn: 'color: #f59e0b',
    error: 'color: #ef4444; font-weight: bold',
};
const LOG_BADGES = {
    trace: 'background: #888; color: white; padding: 2px 6px; border-radius: 3px',
    debug: 'background: #0ea5e9; color: white; padding: 2px 6px; border-radius: 3px',
    info: 'background: #22c55e; color: white; padding: 2px 6px; border-radius: 3px',
    warn: 'background: #f59e0b; color: black; padding: 2px 6px; border-radius: 3px',
    error: 'background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px',
};
const defaultConfig = {
    enabled: false,
    level: 'info',
    components: '*',
    hooks: '*',
    persist: false,
    maxLogs: 500,
};
let config = { ...defaultConfig };
const logs = [];
let initialized = false;
/**
 * Initialize debug configuration from localStorage (browser only)
 * Called lazily on first use to avoid side effects at module load time.
 */
function ensureInitialized() {
    if (initialized)
        return;
    initialized = true;
    if (typeof window === 'undefined')
        return;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            config = { ...defaultConfig, ...parsed };
            if (config.enabled) {
                console.log('%c[Clarity Chat Debug]%c Loaded from localStorage', 'background: #7c3aed; color: white; padding: 2px 6px; border-radius: 3px', 'color: #7c3aed');
            }
        }
    }
    catch {
        // Ignore parsing errors
    }
}
/**
 * Enable debug mode
 *
 * @param options - Configuration options
 *
 * @example
 * ```ts
 * // Enable with defaults
 * enableDebug()
 *
 * // Enable with custom options
 * enableDebug({ level: 'trace', components: ['ChatInput'] })
 * ```
 */
export function enableDebug(options = {}) {
    ensureInitialized();
    config = { ...config, ...options, enabled: true };
    if (config.persist && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    console.log('%c[Clarity Chat Debug]%c Enabled', 'background: #7c3aed; color: white; padding: 2px 6px; border-radius: 3px', 'color: #22c55e; font-weight: bold', config);
}
/**
 * Disable debug mode
 */
export function disableDebug() {
    config.enabled = false;
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
    console.log('%c[Clarity Chat Debug]%c Disabled', 'background: #7c3aed; color: white; padding: 2px 6px; border-radius: 3px', 'color: #ef4444; font-weight: bold');
}
/**
 * Get current debug configuration
 */
export function getDebugConfig() {
    ensureInitialized();
    return { ...config };
}
/**
 * Get all debug logs
 */
export function getDebugLogs() {
    return [...logs];
}
/**
 * Clear debug logs
 */
export function clearDebugLogs() {
    logs.length = 0;
    console.log('%c[Clarity Chat Debug]%c Logs cleared', 'background: #7c3aed; color: white; padding: 2px 6px; border-radius: 3px', 'color: #888');
}
/**
 * Check if debug is enabled for a specific source
 *
 * @param type - 'component' or 'hook'
 * @param name - Name of the component or hook
 */
function shouldLog(type, name) {
    if (!config.enabled)
        return false;
    const filter = type === 'component' ? config.components : config.hooks;
    if (filter === '*')
        return true;
    return filter.includes(name);
}
/**
 * Log a debug message
 *
 * @param level - Log level
 * @param source - Source (component:Name or hook:Name)
 * @param message - Log message
 * @param data - Optional data to log
 */
export function debugLog(level, source, message, data) {
    ensureInitialized();
    if (!config.enabled)
        return;
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[config.level])
        return;
    // Safely parse source - handle malformed sources gracefully
    const colonIndex = source.indexOf(':');
    if (colonIndex > 0) {
        const type = source.slice(0, colonIndex);
        const name = source.slice(colonIndex + 1);
        if ((type === 'component' || type === 'hook') &&
            name &&
            !shouldLog(type, name)) {
            return;
        }
    }
    // Store log entry
    const entry = {
        timestamp: new Date(),
        level,
        source,
        message,
        data,
    };
    logs.push(entry);
    // Trim logs if over limit
    if (logs.length > config.maxLogs) {
        logs.splice(0, logs.length - config.maxLogs);
    }
    // Output to console
    const timestamp = entry.timestamp.toISOString().split('T')[1]?.slice(0, 12);
    if (data !== undefined) {
        console.log(`%c${level.toUpperCase()}%c [${timestamp}] %c${source}%c ${message}`, LOG_BADGES[level], 'color: #888', 'color: #7c3aed; font-weight: bold', LOG_STYLES[level]);
        console.log(data);
        console.log();
    }
    else {
        console.log(`%c${level.toUpperCase()}%c [${timestamp}] %c${source}%c ${message}`, LOG_BADGES[level], 'color: #888', 'color: #7c3aed; font-weight: bold', LOG_STYLES[level]);
    }
}
/**
 * Convenience methods for logging at specific levels
 */
export const debug = {
    /**
     * Log a component message
     */
    component: (name, message, data) => debugLog('debug', `component:${name}`, message, data),
    /**
     * Log a hook message
     */
    hook: (name, message, data) => debugLog('debug', `hook:${name}`, message, data),
    /**
     * Log at trace level
     */
    trace: (source, message, data) => debugLog('trace', source, message, data),
    /**
     * Log at info level
     */
    info: (source, message, data) => debugLog('info', source, message, data),
    /**
     * Log at warn level
     */
    warn: (source, message, data) => debugLog('warn', source, message, data),
    /**
     * Log at error level
     */
    error: (source, message, data) => debugLog('error', source, message, data),
};
/**
 * Measure performance of a function
 *
 * @param name - Name for the measurement
 * @param fn - Function to measure
 * @returns Result of the function
 */
export function measurePerformance(name, fn) {
    if (!config.enabled || process.env.NODE_ENV === 'production') {
        return fn();
    }
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    if (duration > 16) {
        // Longer than one frame at 60fps
        debugLog('warn', 'performance', `${name} took ${duration.toFixed(2)}ms (exceeds 16ms frame budget)`);
    }
    else {
        debugLog('debug', 'performance', `${name} took ${duration.toFixed(2)}ms`);
    }
    return result;
}
/**
 * Measure performance of an async function
 *
 * @param name - Name for the measurement
 * @param fn - Async function to measure
 * @returns Promise resolving to the function result
 */
export async function measurePerformanceAsync(name, fn) {
    if (!config.enabled || process.env.NODE_ENV === 'production') {
        return fn();
    }
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    debugLog('debug', 'performance', `${name} took ${duration.toFixed(2)}ms`);
    return result;
}
let globalDebugExposed = false;
/**
 * Create and expose global debug interface (called lazily)
 */
function exposeGlobalDebug() {
    if (globalDebugExposed)
        return;
    if (typeof window === 'undefined')
        return;
    globalDebugExposed = true;
    const globalInterface = {
        enable: enableDebug,
        disable: disableDebug,
        config: getDebugConfig,
        logs: getDebugLogs,
        clear: clearDebugLogs,
        log: debug,
        measure: measurePerformance,
        measureAsync: measurePerformanceAsync,
    };
    window['ClarityDebug'] =
        globalInterface;
    // Show help message in development
    if (process.env.NODE_ENV !== 'production' && !config.enabled) {
        console.log('%c[Clarity Chat]%c Debug mode available. Type %cClarityDebug.enable()%c in console to start.', 'background: #7c3aed; color: white; padding: 2px 6px; border-radius: 3px', 'color: #888', 'color: #22c55e; font-weight: bold; background: #22c55e15; padding: 2px 4px; border-radius: 3px', 'color: #888');
    }
}
/**
 * Initialize debug mode for browser use.
 * Call this once in your app entry point to enable ClarityDebug in browser console.
 *
 * @example
 * ```ts
 * // In your app entry point
 * import { initDebugMode } from '@clarity-chat/react/internal'
 * initDebugMode()
 * ```
 */
export function initDebugMode() {
    ensureInitialized();
    exposeGlobalDebug();
}
//# sourceMappingURL=debug.js.map