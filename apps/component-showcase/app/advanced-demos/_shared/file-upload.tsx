'use client'

import { useState, useRef, memo } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Upload,
  X,
  FileText,
  FileCode,
  File,
  FileJson,
  Image,
} from 'lucide-react'
import { type FileAttachment, generateId, formatFileSize } from './types'

interface FileUploadProps {
  files: FileAttachment[]
  onFilesChange: (files: FileAttachment[]) => void
  accept?: string
  className?: string
}

const fileIcons: Record<string, React.ReactNode> = {
  ts: <FileCode className="h-4 w-4 text-blue-400" />,
  tsx: <FileCode className="h-4 w-4 text-blue-400" />,
  js: <FileCode className="h-4 w-4 text-yellow-400" />,
  jsx: <FileCode className="h-4 w-4 text-yellow-400" />,
  json: <FileJson className="h-4 w-4 text-yellow-300" />,
  md: <FileText className="h-4 w-4 text-gray-400" />,
  txt: <FileText className="h-4 w-4 text-gray-400" />,
  css: <FileCode className="h-4 w-4 text-purple-400" />,
  html: <FileCode className="h-4 w-4 text-red-400" />,
  svg: <Image className="h-4 w-4 text-emerald-400" />,
  pdf: <FileText className="h-4 w-4 text-red-500" />,
  csv: <FileText className="h-4 w-4 text-green-400" />,
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return fileIcons[ext] || <File className="h-4 w-4 text-muted-foreground" />
}

export const FileUploadZone = memo(function FileUploadZone({
  files,
  onFilesChange,
  accept,
  className,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles: FileAttachment[] = Array.from(fileList).map((f) => ({
      id: generateId(),
      name: f.name,
      type: f.type || `text/${f.name.split('.').pop()}`,
      size: f.size,
    }))
    onFilesChange([...files, ...newFiles])
  }

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all',
          dragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/20'
        )}
      >
        <Upload className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Drop files here or click to upload
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          .ts .tsx .js .json .md .txt .pdf .csv .html .css .svg
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={
            accept ||
            '.ts,.tsx,.js,.jsx,.json,.md,.txt,.pdf,.csv,.html,.css,.svg'
          }
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File Cards */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 group"
            >
              {getFileIcon(file.name)}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{file.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(file.id)
                }}
                className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
