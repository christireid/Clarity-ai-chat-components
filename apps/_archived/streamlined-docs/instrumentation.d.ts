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
export declare function register(): Promise<void>;
/**
 * Called when an uncaught error occurs
 */
export declare function onRequestError(error: {
    digest: string;
} & Error, request: {
    path: string;
    method: string;
    headers: Record<string, string>;
}, context: {
    routerKind: 'Pages Router' | 'App Router';
    routePath: string;
    routeType: 'render' | 'route' | 'action' | 'middleware';
    renderSource?: 'react-server-components' | 'react-server-components-payload' | 'server-rendering';
    revalidateReason?: 'on-demand' | 'stale' | undefined;
    renderType?: 'dynamic' | 'dynamic-resume';
}): void;
//# sourceMappingURL=instrumentation.d.ts.map