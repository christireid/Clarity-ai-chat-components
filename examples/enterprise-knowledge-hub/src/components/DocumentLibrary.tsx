import { FileText, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Document } from '../types'

interface DocumentLibraryProps {
  documents: Document[]
  selectedDoc: Document | null
  onSelectDoc: (doc: Document) => void
  onDeleteDoc: (doc: Document) => void
}

export function DocumentLibrary({ documents, selectedDoc, onSelectDoc, onDeleteDoc }: DocumentLibraryProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Documents ({documents.length})
      </h3>
      
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onSelectDoc(doc)}
            className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
              selectedDoc?.id === doc.id
                ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'
                : 'bg-white/50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {doc.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(doc.size / 1024).toFixed(1)} KB • {doc.chunks} chunks
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDistanceToNow(doc.uploadedAt, { addSuffix: true })}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteDoc(doc)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents yet</p>
            <p className="text-xs mt-1">Upload documents to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
