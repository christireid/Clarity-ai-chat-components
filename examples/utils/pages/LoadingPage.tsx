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
  title?: string
  description?: string
}

export function LoadingPage({
  title = 'Loading...',
  description = 'Please wait while we load your content.',
}: LoadingPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div
          className="mx-auto w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin"
          role="status"
          aria-label={title}
        />
        <div className="space-y-2">
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <span className="sr-only">{title}</span>
      </div>
    </div>
  )
}

export default LoadingPage
