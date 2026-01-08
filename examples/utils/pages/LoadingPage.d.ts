/**
 * Shared Loading Page Component
 *
 * A reusable Next.js App Router loading page component.
 * Use this in your loading.tsx files for consistent loading states.
 *
 * @example
 * // In your app/loading.tsx:
 * export { LoadingPage as default } from '@clarity-chat/example-utils/pages'
 */
export interface LoadingPageProps {
    title?: string;
    description?: string;
}
export declare function LoadingPage({ title, description, }: LoadingPageProps): import("react").JSX.Element;
export default LoadingPage;
//# sourceMappingURL=LoadingPage.d.ts.map