import { logger } from '@clarity-chat/utils/logger';
'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import { Progress } from './progress'
import type { ExportFormat } from '@clarity-chat/types'
import { formatBytes } from '@clarity-chat/primitives'

/**
 * Resource item for batch export
 */
export interface BatchExportResource {
  id: string
  name: string
  type: 'chat' | 'project' | 'knowledge-base'
  messageCount?: number
  lastModified?: Date
  size?: number
}

/**
 * Batch export progress for a single resource
 */
export interface BatchExportProgress {
  resourceId: string
  status: 'pending' | 'exporting' | 'completed' | 'error'
  progress: number
  error?: string
}

/**
 * Props for BatchExportDialog component
 */
export interface BatchExportDialogProps {
  /** Dialog open state */
  open: boolean
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Resources available for export */
  resources: BatchExportResource[]
  /** Callback when export is initiated */
  onExport: (options: {
    resourceIds: string[]
    format: ExportFormat
    includeMetadata: boolean
    includeImages: boolean
    includeAttachments: boolean
  }) => Promise<void>
  /** Export progress updates */
  progress?: BatchExportProgress[]
  className?: string
}

/**
 * Batch Export Dialog Component
 *
 * Allows exporting multiple conversations/resources at once with:
 * - Multi-select resource selection
 * - Format selection
 * - Batch progress tracking
 * - Error handling per resource
 * - Cloud storage integration options
 *
 * @example
 * ```tsx
 * <BatchExportDialog
 *   open={showBatchExport}
 *   onOpenChange={setShowBatchExport}
 *   resources={conversations}
 *   onExport={handleBatchExport}
 *   progress={exportProgress}
 * />
 * ```
 */
export function BatchExportDialog({
  open,
  onOpenChange,
  resources,
  onExport,
  progress = [],
  className,
}: BatchExportDialogProps) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [format, setFormat] = React.useState<ExportFormat>('markdown')
  const [options, setOptions] = React.useState({
    includeMetadata: true,
    includeImages: true,
    includeAttachments: false,
  })
  const [isExporting, setIsExporting] = React.useState(false)
  const [showCloudOptions, setShowCloudOptions] = React.useState(false)

  // Select/deselect all
  const allSelected =
    selectedIds.size === resources.length && resources.length > 0

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(resources.map((r) => r.id)))
    }
  }

  const handleToggleResource = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleExport = async () => {
    if (selectedIds.size === 0) return

    setIsExporting(true)
    try {
      await onExport({
        resourceIds: Array.from(selectedIds),
        format,
        ...options,
      })
    } catch (error) {
      logger.error('Batch export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const formats: Array<{
    value: ExportFormat
    label: string
    icon: string
  }> = [
    { value: 'pdf', label: 'PDF', icon: '📕' },
    { value: 'markdown', label: 'Markdown', icon: '📝' },
    { value: 'json', label: 'JSON', icon: '📊' },
    { value: 'html', label: 'HTML', icon: '🌐' },
  ]

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (progress.length === 0) return 0
    const total = progress.length
    const completed = progress.filter((p) => p.status === 'completed').length
    const exporting = progress.filter((p) => p.status === 'exporting')
    const exportingProgress =
      exporting.reduce((sum, p) => sum + p.progress, 0) / exporting.length || 0
    return (
      ((completed + exporting.length * (exportingProgress / 100)) / total) * 100
    )
  }, [progress])

  const completedCount = progress.filter((p) => p.status === 'completed').length
  const errorCount = progress.filter((p) => p.status === 'error').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-xl', className)}>
        <DialogHeader>
          <DialogTitle>Batch Export</DialogTitle>
          <DialogDescription>
            Export multiple {resources[0]?.type || 'resources'} at once
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* Resource Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">
                Select Resources ({selectedIds.size} selected)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={isExporting}
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
              <AnimatePresence>
                {resources.map((resource, index) => {
                  const isSelected = selectedIds.has(resource.id)
                  const resourceProgress = progress.find(
                    (p) => p.resourceId === resource.id
                  )
                  const isExporting = resourceProgress?.status === 'exporting'
                  const isCompleted = resourceProgress?.status === 'completed'
                  const hasError = resourceProgress?.status === 'error'

                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={cn(
                        'flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors',
                        isSelected && 'bg-primary/5'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleResource(resource.id)}
                        disabled={isExporting}
                        className="h-4 w-4 rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {resource.name}
                          </p>
                          {resource.messageCount && (
                            <Badge variant="secondary" className="text-xs">
                              {resource.messageCount} messages
                            </Badge>
                          )}
                          {resource.size && (
                            <Badge variant="outline" className="text-xs">
                              {formatBytes(resource.size)}
                            </Badge>
                          )}
                        </div>
                        {resource.lastModified && (
                          <p className="text-xs text-muted-foreground">
                            Modified {formatRelativeTime(resource.lastModified)}
                          </p>
                        )}
                      </div>
                      {isExporting && (
                        <div className="w-24">
                          <Progress value={resourceProgress?.progress || 0} />
                        </div>
                      )}
                      {isCompleted && (
                        <Badge variant="success" className="text-xs">
                          ✓ Done
                        </Badge>
                      )}
                      {hasError && (
                        <Badge variant="destructive" className="text-xs">
                          ✗ Error
                        </Badge>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Export Format</h3>
            <div className="grid grid-cols-4 gap-2">
              {formats.map((fmt) => (
                <Button
                  key={fmt.value}
                  variant={format === fmt.value ? 'default' : 'outline'}
                  onClick={() => setFormat(fmt.value)}
                  disabled={isExporting}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <span className="text-2xl">{fmt.icon}</span>
                  <span className="text-xs">{fmt.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Options</h3>
            <div className="space-y-2">
              {[
                {
                  key: 'includeMetadata',
                  label: 'Include Metadata',
                  description: 'Timestamps, authors, etc.',
                },
                {
                  key: 'includeImages',
                  label: 'Include Images',
                  description: 'Embed images in export',
                },
                {
                  key: 'includeAttachments',
                  label: 'Include Attachments',
                  description: 'Separate attachment files',
                },
              ].map(({ key, label, description }) => (
                <label
                  key={key}
                  className="flex items-start gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={options[key as keyof typeof options]}
                    onChange={(e) =>
                      setOptions({ ...options, [key]: e.target.checked })
                    }
                    disabled={isExporting}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Cloud Storage Options (Optional) */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCloudOptions(!showCloudOptions)}
              className="text-xs"
            >
              {showCloudOptions ? '▼' : '▶'} Cloud Storage Options
            </Button>
            {showCloudOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-muted/50 rounded-lg space-y-2"
              >
                <p className="text-xs text-muted-foreground">
                  Cloud storage integration coming soon. For now, exports will
                  be downloaded to your device.
                </p>
              </motion.div>
            )}
          </div>

          {/* Batch Progress */}
          {isExporting && progress.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Exporting {completedCount} of {selectedIds.size}...
                  {errorCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {errorCount} error{errorCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedIds.size === 0 || isExporting}
            state={isExporting ? 'loading' : 'idle'}
          >
            {isExporting
              ? `Exporting ${completedCount}/${selectedIds.size}...`
              : `Export ${selectedIds.size} Resource${selectedIds.size !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions
