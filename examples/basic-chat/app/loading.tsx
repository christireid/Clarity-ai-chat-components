/**
 * Loading State
 *
 * Displayed while the page is loading. Uses skeleton components
 * to show a preview of the chat interface layout.
 */
export default function Loading() {
  return (
    <div
      className="flex flex-col h-screen"
      aria-busy="true"
      aria-label="Loading chat"
    >
      {/* Header skeleton */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        </div>
      </header>

      {/* Chat area skeleton */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%] space-y-2">
                <div className="p-4 bg-muted animate-pulse rounded-2xl space-y-2">
                  <div className="h-4 w-48 bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-36 bg-muted-foreground/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input skeleton */}
      <footer className="border-t bg-background/95 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-12 bg-muted animate-pulse rounded-xl" />
        </div>
      </footer>

      <span className="sr-only">Loading chat interface...</span>
    </div>
  )
}
