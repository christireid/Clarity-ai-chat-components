/**
 * Accessible Loading State
 *
 * Displayed while the page is loading. Includes comprehensive
 * accessibility features including ARIA attributes and screen
 * reader announcements.
 */
export default function Loading() {
  return (
    <div
      className="flex flex-col h-screen"
      role="status"
      aria-busy="true"
      aria-label="Loading accessible chat interface"
    >
      {/* Skip link placeholder */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header skeleton */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <div
            className="h-6 w-48 bg-muted animate-pulse rounded"
            aria-hidden="true"
          />
          <div
            className="h-8 w-32 bg-muted animate-pulse rounded"
            aria-hidden="true"
          />
        </div>
      </header>

      {/* Main content skeleton */}
      <main id="main-content" className="flex-1 overflow-hidden flex">
        {/* Chat area */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
              aria-hidden="true"
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

        {/* Accessibility settings sidebar skeleton */}
        <aside className="w-72 border-l p-4 space-y-4" aria-hidden="true">
          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted animate-pulse rounded-lg"
            >
              <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
              <div className="h-6 w-12 bg-muted-foreground/10 rounded-full" />
            </div>
          ))}
        </aside>
      </main>

      {/* Input skeleton */}
      <footer className="border-t bg-background/95 backdrop-blur p-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="h-12 bg-muted animate-pulse rounded-xl"
            aria-hidden="true"
          />
        </div>
      </footer>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        Loading accessible chat interface. Please wait.
      </div>
    </div>
  )
}
