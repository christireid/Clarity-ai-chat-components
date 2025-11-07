interface UploadProgressProps {
  file: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
}

export function UploadProgress({ file, progress, status }: UploadProgressProps) {
  const statusColors = {
    uploading: 'bg-blue-500',
    processing: 'bg-purple-500',
    complete: 'bg-green-500',
    error: 'bg-red-500',
  }

  const statusText = {
    uploading: 'Uploading...',
    processing: 'Processing...',
    complete: 'Complete!',
    error: 'Error',
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {file}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {statusText[status]}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${statusColors[status]} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
