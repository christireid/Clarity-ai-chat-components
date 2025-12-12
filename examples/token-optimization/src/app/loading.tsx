export default function Loading() {
  return (
    <div
      className="min-h-screen bg-background p-6"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="h-9 w-80 bg-muted animate-pulse rounded mb-6" />

        {/* Controls skeleton */}
        <div className="mb-8 flex flex-wrap gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-muted animate-pulse rounded" />
          ))}
        </div>

        {/* Stats grid skeleton */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-card border rounded-lg">
              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>

        {/* Results skeleton */}
        <div className="h-6 w-24 bg-muted animate-pulse rounded mb-4" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>

      <span className="sr-only">Loading token optimization demo...</span>
    </div>
  )
}
