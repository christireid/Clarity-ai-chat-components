import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Error Reporter Provider
 *
 * This component provides error tracking and reporting functionality throughout the app.
 * It automatically captures unhandled errors and provides utilities for manual error reporting.
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef, } from 'react';
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function redactValue(value, replacement, depth) {
    if (depth <= 0)
        return replacement;
    if (Array.isArray(value))
        return value.map((v) => redactValue(v, replacement, depth - 1));
    if (isPlainObject(value)) {
        const out = {};
        for (const [k, v] of Object.entries(value))
            out[k] = redactValue(v, replacement, depth - 1);
        return out;
    }
    return replacement;
}
function sanitizeReport(report, redact) {
    const keys = (redact?.keys ?? [
        'authorization',
        'cookie',
        'token',
        'apikey',
        'apiKey',
        'password',
        'secret',
        'session',
    ]).map((k) => k.toLowerCase());
    const maxDepth = redact?.maxDepth ?? 5;
    const replacement = redact?.replacement ?? '[REDACTED]';
    const shouldRedactKey = (key) => keys.includes(key.toLowerCase());
    const sanitizeObject = (obj, depth) => {
        if (depth <= 0)
            return obj;
        if (Array.isArray(obj))
            return obj.map((v) => sanitizeObject(v, depth - 1));
        if (!isPlainObject(obj))
            return obj;
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
            out[k] = shouldRedactKey(k)
                ? redactValue(v, replacement, 1)
                : sanitizeObject(v, depth - 1);
        }
        return out;
    };
    return {
        ...report,
        context: sanitizeObject(report.context, maxDepth),
        tags: sanitizeObject(report.tags, 2),
        environment: sanitizeObject(report.environment, 2),
    };
}
const ErrorReporterContext = createContext(undefined);
/**
 * Generate a random session ID
 */
function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}
/**
 * Get environment information
 */
function getEnvironment() {
    if (typeof window === 'undefined')
        return undefined;
    return {
        userAgent: window.navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
        locale: window.navigator.language,
    };
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
export function ErrorReporterProvider({ children, config, }) {
    const [sessionId] = useState(generateSessionId);
    const [errorStats, setErrorStats] = useState({
        totalErrors: 0,
        bySeverity: {
            fatal: 0,
            error: 0,
            warning: 0,
            info: 0,
            debug: 0,
        },
        byHour: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
        topErrors: [],
    });
    const suppressConsoleCaptureRef = useRef(0);
    const originalConsoleRef = useRef(null);
    const activeProvidersRef = useRef(config.providers);
    const userRef = useRef({});
    const contextRef = useRef({});
    const breadcrumbsRef = useRef([]);
    const { providers, enabled = true, autoReport = true, captureConsole = false, sampleRate = 1.0, beforeSend, onError, globalTags = {}, globalContext = {}, redact, } = config;
    // Initialize providers
    useEffect(() => {
        if (!enabled)
            return;
        let cancelled = false;
        activeProvidersRef.current = providers;
        (async () => {
            const results = await Promise.allSettled(providers.map(async (provider) => {
                if (!provider.initialize)
                    return;
                await provider.initialize();
            }));
            if (cancelled)
                return;
            const okProviders = [];
            for (let i = 0; i < providers.length; i++) {
                const provider = providers[i];
                const r = results[i];
                if (!r || r.status === 'fulfilled') {
                    okProviders.push(provider);
                    continue;
                }
                ;
                (originalConsoleRef.current?.error ?? console.error)(`[ErrorReporter] Provider "${provider.name}" failed to initialize and will be disabled:`, r.reason);
            }
            activeProvidersRef.current = okProviders;
        })().catch((e) => {
            ;
            (originalConsoleRef.current?.error ?? console.error)('[ErrorReporter] Failed while initializing providers:', e);
            activeProvidersRef.current = providers;
        });
        return () => {
            cancelled = true;
            const toDestroy = activeProvidersRef.current;
            activeProvidersRef.current = [];
            toDestroy.forEach((provider) => {
                try {
                    provider.destroy?.();
                }
                catch (e) {
                    ;
                    (originalConsoleRef.current?.error ?? console.error)(`[ErrorReporter] Provider "${provider.name}" failed to destroy:`, e);
                }
            });
        };
    }, [enabled, providers]);
    // Update error statistics
    const updateStats = useCallback((report) => {
        setErrorStats((prev) => {
            const bySeverity = {
                ...prev.bySeverity,
                [report.severity]: (prev.bySeverity[report.severity] ?? 0) + 1,
            };
            const hour = new Date(report.timestamp).getHours();
            const byHour = prev.byHour.map((h) => h.hour === hour ? { ...h, count: h.count + 1 } : h);
            const existingIndex = prev.topErrors.findIndex((e) => e.message === report.message);
            const nextTopErrorsUnsorted = existingIndex >= 0
                ? prev.topErrors.map((e, i) => i === existingIndex ? { ...e, count: e.count + 1 } : e)
                : [...prev.topErrors, { message: report.message, count: 1 }];
            const topErrors = nextTopErrorsUnsorted
                .slice()
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
            return {
                ...prev,
                totalErrors: prev.totalErrors + 1,
                bySeverity,
                byHour,
                topErrors,
                lastError: report.timestamp,
            };
        });
    }, []);
    // Report error to all providers
    const reportError = useCallback((error, context) => {
        if (!enabled)
            return;
        // Sample rate check
        if (Math.random() > sampleRate)
            return;
        const report = {
            message: typeof error === 'string' ? error : error.message,
            stack: typeof error === 'string' ? undefined : error.stack,
            severity: 'error',
            timestamp: Date.now(),
            sessionId,
            userId: userRef.current.userId,
            userEmail: userRef.current.email,
            context: {
                ...globalContext,
                ...contextRef.current,
                ...context,
            },
            tags: globalTags,
            environment: getEnvironment(),
            originalError: typeof error === 'string' ? undefined : error,
            handled: true,
        };
        const sanitized = sanitizeReport(report, redact);
        // Apply beforeSend filter
        const filteredReport = beforeSend ? beforeSend(sanitized) : sanitized;
        if (!filteredReport)
            return;
        // Update stats
        updateStats(filteredReport);
        // Call onError callback
        onError?.(filteredReport);
        // Report to all providers
        suppressConsoleCaptureRef.current++;
        try {
            activeProvidersRef.current.forEach((provider) => {
                try {
                    // Fire-and-forget: errors are caught and logged
                    Promise.resolve(provider.reportError(filteredReport)).catch((providerError) => {
                        ;
                        (originalConsoleRef.current?.error ?? console.error)(`Error reporting to provider ${provider.name}:`, providerError);
                    });
                }
                catch (providerError) {
                    ;
                    (originalConsoleRef.current?.error ?? console.error)(`Error reporting to provider ${provider.name}:`, providerError);
                }
            });
        }
        finally {
            suppressConsoleCaptureRef.current--;
        }
    }, [
        enabled,
        sampleRate,
        sessionId,
        beforeSend,
        onError,
        globalContext,
        globalTags,
        updateStats,
        redact,
    ]);
    // Report error with full options
    const reportErrorDetailed = useCallback((report) => {
        if (!enabled)
            return;
        // Sample rate check
        if (Math.random() > sampleRate)
            return;
        const fullReport = {
            message: report.message || 'Unknown error',
            stack: report.stack,
            severity: report.severity || 'error',
            timestamp: report.timestamp || Date.now(),
            sessionId: report.sessionId || sessionId,
            userId: report.userId || userRef.current.userId,
            userEmail: report.userEmail || userRef.current.email,
            context: {
                ...globalContext,
                ...contextRef.current,
                ...report.context,
            },
            tags: {
                ...globalTags,
                ...report.tags,
            },
            environment: report.environment || getEnvironment(),
            componentStack: report.componentStack,
            userFeedback: report.userFeedback,
            handled: report.handled ?? true,
            originalError: report.originalError,
        };
        const sanitized = sanitizeReport(fullReport, redact);
        // Apply beforeSend filter
        const filteredReport = beforeSend ? beforeSend(sanitized) : sanitized;
        if (!filteredReport)
            return;
        // Update stats
        updateStats(filteredReport);
        // Call onError callback
        onError?.(filteredReport);
        // Report to all providers
        suppressConsoleCaptureRef.current++;
        try {
            activeProvidersRef.current.forEach((provider) => {
                try {
                    // Fire-and-forget: errors are caught and logged
                    Promise.resolve(provider.reportError(filteredReport)).catch((providerError) => {
                        ;
                        (originalConsoleRef.current?.error ?? console.error)(`Error reporting to provider ${provider.name}:`, providerError);
                    });
                }
                catch (providerError) {
                    ;
                    (originalConsoleRef.current?.error ?? console.error)(`Error reporting to provider ${provider.name}:`, providerError);
                }
            });
        }
        finally {
            suppressConsoleCaptureRef.current--;
        }
    }, [
        enabled,
        sampleRate,
        sessionId,
        beforeSend,
        onError,
        globalContext,
        globalTags,
        updateStats,
        redact,
    ]);
    // Set user context
    const setUser = useCallback((userId, email, userData) => {
        userRef.current = { userId, email, userData };
        if (!enabled)
            return;
        suppressConsoleCaptureRef.current++;
        try {
            activeProvidersRef.current.forEach((provider) => {
                try {
                    provider.setUser?.(userId, email, userData);
                }
                catch (error) {
                    ;
                    (originalConsoleRef.current?.error ?? console.error)(`Error setting user in provider ${provider.name}:`, error);
                }
            });
        }
        finally {
            suppressConsoleCaptureRef.current--;
        }
    }, [enabled]);
    // Set global context
    const setContext = useCallback((context) => {
        contextRef.current = { ...contextRef.current, ...context };
        if (!enabled)
            return;
        suppressConsoleCaptureRef.current++;
        try {
            activeProvidersRef.current.forEach((provider) => {
                try {
                    provider.setContext?.(context);
                }
                catch (error) {
                    ;
                    (originalConsoleRef.current?.error ?? console.error)(`Error setting context in provider ${provider.name}:`, error);
                }
            });
        }
        finally {
            suppressConsoleCaptureRef.current--;
        }
    }, [enabled]);
    // Add breadcrumb
    const addBreadcrumb = useCallback((message, data) => {
        const breadcrumb = {
            message,
            data,
            timestamp: Date.now(),
        };
        breadcrumbsRef.current.push(breadcrumb);
        // Keep only last 50 breadcrumbs
        if (breadcrumbsRef.current.length > 50) {
            breadcrumbsRef.current.shift();
        }
        if (!enabled)
            return;
        suppressConsoleCaptureRef.current++;
        try {
            activeProvidersRef.current.forEach((provider) => {
                try {
                    provider.addBreadcrumb?.(message, data);
                }
                catch (error) {
                    ;
                    (originalConsoleRef.current?.error ?? console.error)(`Error adding breadcrumb in provider ${provider.name}:`, error);
                }
            });
        }
        finally {
            suppressConsoleCaptureRef.current--;
        }
    }, [enabled]);
    // Auto-report unhandled errors
    useEffect(() => {
        if (!enabled || !autoReport)
            return;
        const handleError = (event) => {
            event.preventDefault();
            reportError(event.error || event.message, {
                type: 'unhandled_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            });
        };
        const handleRejection = (event) => {
            event.preventDefault();
            reportError(event.reason, {
                type: 'unhandled_rejection',
            });
        };
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, [enabled, autoReport, reportError]);
    // Capture console errors
    useEffect(() => {
        if (!enabled || !captureConsole)
            return;
        const originalError = console.error;
        const originalWarn = console.warn;
        originalConsoleRef.current = { error: originalError, warn: originalWarn };
        console.error = (...args) => {
            originalError.apply(console, args);
            if (suppressConsoleCaptureRef.current > 0)
                return;
            reportError(args.join(' '), { type: 'console_error' });
        };
        console.warn = (...args) => {
            originalWarn.apply(console, args);
            if (suppressConsoleCaptureRef.current > 0)
                return;
            reportErrorDetailed({
                message: args.join(' '),
                severity: 'warning',
                context: { type: 'console_warn' },
            });
        };
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
            originalConsoleRef.current = null;
        };
    }, [enabled, captureConsole, reportError, reportErrorDetailed]);
    const getStats = useCallback(() => errorStats, [errorStats]);
    const value = {
        reportError,
        reportErrorDetailed,
        setUser,
        setContext,
        addBreadcrumb,
        getStats,
        isEnabled: enabled,
    };
    return (_jsx(ErrorReporterContext.Provider, { value: value, children: children }));
}
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
export function useErrorReporter() {
    const context = useContext(ErrorReporterContext);
    if (!context) {
        throw new Error('useErrorReporter must be used within an ErrorReporterProvider');
    }
    return context;
}
//# sourceMappingURL=ErrorReporter.js.map