/**
 * Loading State
 *
 * Displayed while the page is loading. Shows skeleton for
 * the theme studio interface.
 */
export default function Loading() {
  return (
    <div
      className="flex h-screen"
      aria-busy="true"
      aria-label="Loading theme studio"
    >
      {/* Theme selector sidebar skeleton */}
      <aside className="w-96 border-r p-6 space-y-6">
        <div>
          <div className="h-8 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </div>

        {/* Filter buttons skeleton */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>

        {/* Theme cards skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-muted animate-pulse rounded-xl space-y-3">
              <div className="flex gap-1">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="w-6 h-6 bg-muted-foreground/10 rounded-full" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
                  <div className="h-3 w-32 bg-muted-foreground/10 rounded mt-1" />
                </div>
                <div className="h-5 w-12 bg-muted-foreground/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Export button skeleton */}
        <div className="pt-6 border-t">
          <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
        </div>
      </aside>

      {/* Preview area skeleton */}
      <div className="flex-1 p-6">
        <div className="h-full max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded mt-1" />
            </div>
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          </div>

          {/* Chat preview skeleton */}
          <div className="h-[calc(100%-4rem)] bg-muted animate-pulse rounded-xl" />
        </div>
      </div>

      <span className="sr-only">Loading theme studio...</span>
    </div>
  )
}
