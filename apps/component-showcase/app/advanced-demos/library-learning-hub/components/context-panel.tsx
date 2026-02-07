'use client'

import { memo } from 'react'
import { cn, Badge, ScrollArea } from '@clarity-chat/primitives'
import { FileText, Trash2, Info } from 'lucide-react'
import {
  FileUploadZone,
  TokenPanel,
  MemoryPanel,
  type FileAttachment,
  type TokenSettings,
  type MemorySettings,
} from '../../_shared'

export interface ContextPanelProps {
  context: string
  onContextChange: (ctx: string) => void
  files: FileAttachment[]
  onFilesChange: (files: FileAttachment[]) => void
  memorySettings?: MemorySettings
  onMemoryUpdate?: (settings: MemorySettings) => void
  tokenSettings?: TokenSettings
  onTokenUpdate?: (settings: TokenSettings) => void
  className?: string
}

export const ContextPanel = memo(function ContextPanel({
  context,
  onContextChange,
  files,
  onFilesChange,
  memorySettings,
  onMemoryUpdate,
  tokenSettings,
  onTokenUpdate,
  className,
}: ContextPanelProps) {
  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="p-4 space-y-6">
        {/* System Context */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              System Context
            </h4>
            {context.trim() && (
              <button
                onClick={() => onContextChange('')}
                className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                title="Clear context"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <textarea
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder='Enter persistent system instructions...&#10;&#10;e.g. "Always include TypeScript examples. Explain concepts as if I am a beginner."'
            className="w-full h-28 px-3 py-2 text-xs rounded-lg bg-muted/50 border border-border/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/40 leading-relaxed"
          />
          <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              System context is prepended to every message. Use it to set the
              tone, knowledge level, or output format for all responses.
            </p>
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-500" />
            Context Files
            {files.length > 0 && (
              <Badge variant="outline" className="text-[10px]">
                {files.length}
              </Badge>
            )}
          </h4>
          <FileUploadZone files={files} onFilesChange={onFilesChange} />
        </div>

        {memorySettings && onMemoryUpdate && (
          <>
            <div className="h-px bg-border" />
            <MemoryPanel settings={memorySettings} onUpdate={onMemoryUpdate} />
          </>
        )}

        {tokenSettings && onTokenUpdate && (
          <>
            <div className="h-px bg-border" />
            <TokenPanel settings={tokenSettings} onUpdate={onTokenUpdate} />
          </>
        )}
      </div>
    </ScrollArea>
  )
})
