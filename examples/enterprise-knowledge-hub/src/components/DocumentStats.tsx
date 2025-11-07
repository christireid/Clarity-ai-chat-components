import { FileText, Search, TrendingUp, Zap } from 'lucide-react'
import type { Document } from '../types'

interface DocumentStatsProps {
  documents: Document[]
}

export function DocumentStats({ documents }: DocumentStatsProps) {
  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0)
  const totalChunks = documents.reduce((acc, doc) => acc + doc.chunks, 0)

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {documents.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Documents</div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalChunks.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Vectors</div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(totalSize / 1024 / 1024).toFixed(1)} MB
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Size</div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              70%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Cache Hit</div>
          </div>
        </div>
      </div>
    </div>
  )
}
