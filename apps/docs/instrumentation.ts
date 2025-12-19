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
    console.debug('[Instrumentation] Node.js runtime initialized')

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
    console.debug('[Instrumentation] Edge runtime initialized')
  }
}

/**
 * Called when an uncaught error occurs
 */
export function onRequestError(
  error: { digest: string } & Error,
  request: {
    path: string
    method: string
    headers: Record<string, string>
  },
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    renderSource?:
      | 'react-server-components'
      | 'react-server-components-payload'
      | 'server-rendering'
    revalidateReason?: 'on-demand' | 'stale' | undefined
    renderType?: 'dynamic' | 'dynamic-resume'
  }
) {
  // Log errors for monitoring
  console.error('[Request Error]', {
    digest: error.digest,
    message: error.message,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  })

  // Example: Send to error tracking service
  // Sentry.captureException(error, { extra: { request, context } })
}
