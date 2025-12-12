/**
 * Loading State
 *
 * Displayed while the page is loading. Shows skeleton for
 * the tool calling chat interface.
 */
export default function Loading() {
  return (
    <div
      className="flex flex-col h-screen max-w-3xl mx-auto"
      aria-busy="true"
      aria-label="Loading tool calling chat"
    >
      {/* Header skeleton */}
      <header className="p-4 border-b">
        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
      </header>

      {/* Chat area skeleton */}
      <main className="flex-1 overflow-hidden p-4 space-y-4">
        {/* Welcome state skeleton */}
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-muted animate-pulse rounded-full mb-4" />
          <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mb-6" />
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-48 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </main>

      {/* Input skeleton */}
      <footer className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 h-12 bg-muted animate-pulse rounded-xl" />
          <div className="h-12 w-20 bg-muted animate-pulse rounded-xl" />
        </div>
      </footer>

      <span className="sr-only">Loading tool calling chat...</span>
    </div>
  )
}
