export default function Loading() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading dashboard">
      {/* Header skeleton */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-card border rounded-lg">
              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1" />
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-6 bg-card border rounded-lg">
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
              <div className="h-64 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </main>

      <span className="sr-only">Loading AI operations dashboard...</span>
    </div>
  )
}
