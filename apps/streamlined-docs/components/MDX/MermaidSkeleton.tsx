/**
 * Skeleton loader shown while Mermaid library and diagram are loading
 *
 * Prevents CLS (Cumulative Layout Shift) by reserving space
 * Shows a pleasant loading state with simulated diagram structure
 */
export function MermaidSkeleton() {
  return (
    <div className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-8 my-6 animate-pulse">
      <div className="space-y-4">
        {/* Simulate diagram nodes */}
        <div className="flex justify-center">
          <div className="w-32 h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="flex justify-center gap-8">
          <div className="w-24 h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="w-24 h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="flex justify-center">
          <div className="w-32 h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Loading diagram...
        </div>
      </div>
    </div>
  )
}
