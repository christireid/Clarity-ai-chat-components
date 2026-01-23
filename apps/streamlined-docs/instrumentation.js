/**
 * Next.js 16 Instrumentation Hook
 *
 * This file is automatically loaded by Next.js at startup time.
 * Use it for:
 * - Setting up observability (OpenTelemetry, etc.)
 * - Initializing monitoring services
 * - Registering error tracking
 * - Setting up database connections
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
    // Only run on server
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[Instrumentation] Node.js runtime initialized');
        }
        // Example: Initialize monitoring in production
        if (process.env.NODE_ENV === 'production') {
            // Uncomment and configure for your observability provider:
            // const { init } = await import('@sentry/nextjs')
            // init({ dsn: process.env.SENTRY_DSN })
            // const { registerOTel } = await import('@vercel/otel')
            // registerOTel({ serviceName: 'clarity-chat-docs' })
        }
    }
    // Edge runtime specific initialization
    if (process.env.NEXT_RUNTIME === 'edge') {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[Instrumentation] Edge runtime initialized');
        }
    }
}
/**
 * Called when an uncaught error occurs
 */
export function onRequestError(error, request, context) {
    // Log errors for monitoring
    console.error('[Request Error]', {
        digest: error.digest,
        message: error.message,
        path: request.path,
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
    });
    // Example: Send to error tracking service
    // Sentry.captureException(error, { extra: { request, context } })
}
//# sourceMappingURL=instrumentation.js.map