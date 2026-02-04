export function CodeEditorSkeleton() {
  return (
    <div className="w-full h-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-4 animate-pulse">
      <div className="space-y-3">
        {/* Line numbers and code */}
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5" />
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="flex-1 h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/5" />
        </div>
        {/* Loading indicator */}
        <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Loading code editor...
        </div>
      </div>
    </div>
  )
}
