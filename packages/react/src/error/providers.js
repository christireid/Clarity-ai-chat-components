/**
 * Built-in error tracking providers
 *
 * This file provides ready-to-use providers for popular error tracking services.
 * Each provider implements the ErrorProvider interface.
 */
function isDev() {
    return (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production');
}
function safeDevLog(...args) {
    if (!isDev())
        return;
    // Keep dev-only logs minimal and never include secrets.
    console.debug(...args);
}
function safeDevError(...args) {
    if (!isDev())
        return;
    console.error(...args);
}
function hasLocalStorage() {
    try {
        return (typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined');
    }
    catch {
        return false;
    }
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
export function createSentryProvider(config) {
    let Sentry = null;
    return {
        name: 'sentry',
        initialize: async () => {
            // In real implementation, would import @sentry/react
            // For now, we'll use a mock implementation.
            if (config.debug)
                safeDevLog('[Sentry] Provider initialized');
            // Mock Sentry object
            Sentry = {
                init: () => { },
                captureException: (error, context) => {
                    if (config.debug)
                        safeDevLog('[Sentry] Captured exception', { error, context });
                },
                setUser: (user) => {
                    if (config.debug)
                        safeDevLog('[Sentry] Set user');
                },
                setContext: (name, context) => {
                    if (config.debug)
                        safeDevLog('[Sentry] Set context', name);
                },
                addBreadcrumb: (breadcrumb) => {
                    if (config.debug)
                        safeDevLog('[Sentry] Added breadcrumb');
                },
            };
            Sentry.init({
                dsn: config.dsn,
                environment: config.environment,
                release: config.release,
                tracesSampleRate: config.tracesSampleRate,
            });
        },
        reportError: (report) => {
            if (!Sentry)
                return;
            const error = report.originalError || new Error(report.message);
            Sentry.captureException(error, {
                level: report.severity,
                tags: report.tags,
                contexts: {
                    custom: report.context,
                    environment: report.environment,
                },
                user: report.userId
                    ? {
                        id: report.userId,
                        email: report.userEmail,
                    }
                    : undefined,
                extra: {
                    componentStack: report.componentStack,
                    userFeedback: report.userFeedback,
                    handled: report.handled,
                },
            });
        },
        setUser: (userId, email, userData) => {
            if (!Sentry)
                return;
            Sentry.setUser({ id: userId, email, ...userData });
        },
        setContext: (context) => {
            if (!Sentry)
                return;
            Sentry.setContext('custom', context);
        },
        addBreadcrumb: (message, data) => {
            if (!Sentry)
                return;
            Sentry.addBreadcrumb({
                message,
                data,
                timestamp: Date.now() / 1000,
            });
        },
    };
}
/**
 * Create a Rollbar error tracking provider
 */
export function createRollbarProvider(config) {
    let Rollbar = null;
    return {
        name: 'rollbar',
        initialize: async () => {
            if (config.debug)
                safeDevLog('[Rollbar] Provider initialized');
            // Mock Rollbar object
            Rollbar = {
                error: (error, custom) => {
                    if (config.debug)
                        safeDevLog('[Rollbar] Error', { error, custom });
                },
                warning: (message, custom) => {
                    if (config.debug)
                        safeDevLog('[Rollbar] Warning', { message, custom });
                },
                info: (message, custom) => {
                    if (config.debug)
                        safeDevLog('[Rollbar] Info', { message, custom });
                },
                configure: (config) => {
                    if (config.debug)
                        safeDevLog('[Rollbar] Configured');
                },
            };
            Rollbar.configure({
                accessToken: config.accessToken,
                environment: config.environment,
                codeVersion: config.codeVersion,
            });
        },
        reportError: (report) => {
            if (!Rollbar)
                return;
            const payload = {
                custom: report.context,
                person: report.userId
                    ? {
                        id: report.userId,
                        email: report.userEmail,
                    }
                    : undefined,
                request: report.environment
                    ? {
                        url: report.environment.url,
                        user_ip: undefined, // Would be set by server
                    }
                    : undefined,
            };
            const level = report.severity === 'fatal' ? 'critical' : report.severity;
            if (report.originalError) {
                Rollbar[level](report.originalError, payload);
            }
            else {
                Rollbar[level](report.message, payload);
            }
        },
        setUser: (userId, email, userData) => {
            if (!Rollbar)
                return;
            Rollbar.configure({
                payload: {
                    person: { id: userId, email, ...userData },
                },
            });
        },
    };
}
/**
 * Create a Bugsnag error tracking provider
 */
export function createBugsnagProvider(config) {
    let Bugsnag = null;
    return {
        name: 'bugsnag',
        initialize: async () => {
            if (config.debug)
                safeDevLog('[Bugsnag] Provider initialized');
            // Mock Bugsnag object
            Bugsnag = {
                start: () => { },
                notify: (error, onError) => {
                    if (config.debug)
                        safeDevLog('[Bugsnag] Notified');
                    if (onError)
                        onError();
                },
                setUser: (id, email, name) => {
                    if (config.debug)
                        safeDevLog('[Bugsnag] Set user');
                },
                addMetadata: (section, data) => {
                    if (config.debug)
                        safeDevLog('[Bugsnag] Added metadata', section);
                },
                leaveBreadcrumb: (message, metadata) => {
                    if (config.debug)
                        safeDevLog('[Bugsnag] Left breadcrumb');
                },
            };
            Bugsnag.start({
                apiKey: config.apiKey,
                releaseStage: config.releaseStage,
                appVersion: config.appVersion,
            });
        },
        reportError: (report) => {
            if (!Bugsnag)
                return;
            const error = report.originalError || new Error(report.message);
            Bugsnag.notify(error, (event) => {
                event.severity = report.severity === 'fatal' ? 'error' : report.severity;
                if (report.userId) {
                    event.setUser(report.userId, report.userEmail);
                }
                if (report.context) {
                    event.addMetadata('custom', report.context);
                }
                if (report.environment) {
                    event.addMetadata('environment', report.environment);
                }
                if (report.tags) {
                    event.addMetadata('tags', report.tags);
                }
            });
        },
        setUser: (userId, email, userData) => {
            if (!Bugsnag)
                return;
            Bugsnag.setUser(userId, email, userData?.['name']);
            if (userData) {
                Bugsnag.addMetadata('user', userData);
            }
        },
        addBreadcrumb: (message, data) => {
            if (!Bugsnag)
                return;
            Bugsnag.leaveBreadcrumb(message, data);
        },
    };
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
export function createCustomAPIProvider(config) {
    return {
        name: 'custom-api',
        reportError: async (report) => {
            try {
                const response = await fetch(config.endpoint, {
                    method: config.method || 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...config.headers,
                    },
                    body: JSON.stringify({
                        message: report.message,
                        stack: report.stack,
                        severity: report.severity,
                        timestamp: report.timestamp,
                        userId: report.userId,
                        userEmail: report.userEmail,
                        sessionId: report.sessionId,
                        context: report.context,
                        tags: report.tags,
                        environment: report.environment,
                        componentStack: report.componentStack,
                        userFeedback: report.userFeedback,
                    }),
                });
                if (!response.ok) {
                    safeDevError('Failed to report error to custom API:', response.statusText);
                }
            }
            catch (error) {
                safeDevError('Error reporting to custom API:', error);
            }
        },
    };
}
/**
 * Console provider for development
 * Logs errors to the browser console
 */
export function createConsoleErrorProvider() {
    return {
        name: 'console',
        reportError: (report) => {
            const style = `
        color: white;
        background: ${report.severity === 'fatal' || report.severity === 'error'
                ? '#dc2626'
                : report.severity === 'warning'
                    ? '#f59e0b'
                    : '#3b82f6'};
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: bold;
      `;
            console.debug(`%c${report.severity.toUpperCase()}`, style, report.message);
            if (report.stack) {
                console.error('Stack:', report.stack);
            }
            if (report.componentStack) {
                console.error('Component Stack:', report.componentStack);
            }
            if (report.context) {
                console.debug('Context:', report.context);
            }
            if (report.environment) {
                console.debug('Environment:', report.environment);
            }
            if (report.tags) {
                console.debug('Tags:', report.tags);
            }
            if (report.userFeedback) {
                console.debug('User Feedback:', report.userFeedback);
            }
            console.debug();
        },
        setUser: (userId, email, userData) => {
            console.debug('[Error Reporter] Set user:', {
                userId,
                email,
                ...userData,
            });
        },
        setContext: (context) => {
            console.debug('[Error Reporter] Set context:', context);
        },
        addBreadcrumb: (message, data) => {
            console.debug('[Error Reporter] Breadcrumb:', message, data);
        },
    };
}
/**
 * LocalStorage provider for offline error tracking
 * Stores errors in localStorage for later retrieval
 */
export function createLocalStorageErrorProvider(maxErrors = 50) {
    const STORAGE_KEY = 'error_reports';
    return {
        name: 'localstorage',
        reportError: (report) => {
            try {
                if (!hasLocalStorage())
                    return;
                const stored = localStorage.getItem(STORAGE_KEY);
                const errors = stored ? JSON.parse(stored) : [];
                // Add new error
                errors.push({
                    ...report,
                    // Remove originalError as it's not serializable
                    originalError: undefined,
                });
                // Keep only most recent errors
                if (errors.length > maxErrors) {
                    errors.splice(0, errors.length - maxErrors);
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(errors));
            }
            catch (error) {
                safeDevError('Failed to store error in localStorage:', error);
            }
        },
    };
}
/**
 * Get all errors stored in localStorage
 */
export function getStoredErrors() {
    try {
        if (!hasLocalStorage())
            return [];
        const stored = localStorage.getItem('error_reports');
        return stored ? JSON.parse(stored) : [];
    }
    catch {
        return [];
    }
}
/**
 * Clear all errors from localStorage
 */
export function clearStoredErrors() {
    try {
        if (!hasLocalStorage())
            return;
        localStorage.removeItem('error_reports');
    }
    catch (error) {
        safeDevError('Failed to clear stored errors:', error);
    }
}
//# sourceMappingURL=providers.js.map