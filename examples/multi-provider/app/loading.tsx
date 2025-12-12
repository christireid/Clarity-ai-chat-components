/**
 * Loading State
 *
 * Displayed while the page is loading. Shows skeleton for
 * the multi-provider chat interface.
 */
export default function Loading() {
  return (
    <div
      className="flex flex-col h-screen"
      aria-busy="true"
      aria-label="Loading multi-provider chat"
    >
      {/* Header skeleton */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="flex-1 overflow-hidden flex">
        {/* Chat area */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[70%] space-y-2">
                <div className="p-4 bg-muted animate-pulse rounded-2xl space-y-2">
                  <div className="h-4 w-48 bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-36 bg-muted-foreground/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Provider sidebar skeleton */}
        <aside className="w-80 border-l p-4 space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-muted animate-pulse rounded-lg space-y-2"
            >
              <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
              <div className="h-3 w-32 bg-muted-foreground/10 rounded" />
            </div>
          ))}
        </aside>
      </main>

      {/* Input skeleton */}
      <footer className="border-t bg-background/95 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-12 bg-muted animate-pulse rounded-xl" />
        </div>
      </footer>

      <span className="sr-only">Loading multi-provider chat...</span>
    </div>
  )
}
