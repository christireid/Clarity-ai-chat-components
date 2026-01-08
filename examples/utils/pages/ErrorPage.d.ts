/**
 * Shared Error Page Component
 *
 * A reusable Next.js App Router error boundary page component.
 * Use this in your error.tsx files for consistent error handling.
 *
 * @example
 * // In your app/error.tsx:
 * 'use client'
 * export { ErrorPage as default } from '@clarity-chat/example-utils/pages'
 */
export interface ErrorPageProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
    title?: string;
    description?: string;
}
export declare function ErrorPage({ error, reset, title, description, }: ErrorPageProps): import("react").JSX.Element;
export default ErrorPage;
//# sourceMappingURL=ErrorPage.d.ts.map