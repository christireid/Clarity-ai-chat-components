import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  cn,
} from '@clarity-chat/primitives'
import type { ExportOptions, ExportFormat } from '@clarity-chat/types'

export interface ExportDialogProps {
  open: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => Promise<void>
  resourceType: 'chat' | 'project' | 'knowledge-base'
  resourceName: string
  className?: string
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  onExport,
  resourceType,
  resourceName,
  className,
}) => {
  const [format, setFormat] = React.useState<ExportFormat>('pdf')
  const [options, setOptions] = React.useState<Partial<ExportOptions>>({
    includeMetadata: true,
    includeImages: true,
    includeAttachments: false,
  })
  const [exporting, setExporting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const formats: Array<{ value: ExportFormat; label: string; icon: string; description: string }> = [
    { value: 'pdf', label: 'PDF', icon: '📕', description: 'Portable document format' },
    { value: 'docx', label: 'Word', icon: '📄', description: 'Microsoft Word document' },
    { value: 'markdown', label: 'Markdown', icon: '📝', description: 'Plain text with formatting' },
    { value: 'json', label: 'JSON', icon: '📊', description: 'Raw data format' },
    { value: 'html', label: 'HTML', icon: '🌐', description: 'Web page format' },
  ]

  const handleExport = async () => {
    setExporting(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      await onExport({
        format,
        ...options,
      } as ExportOptions)

      clearInterval(progressInterval)
      setProgress(100)

      // Close after brief delay to show completion
      setTimeout(() => {
        onClose()
        setProgress(0)
      }, 500)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={cn('w-full max-w-2xl', className)}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Export {resourceType}</CardTitle>
                  <CardDescription>Export "{resourceName}" in your preferred format</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  ✕
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Select Format</h3>
                <div className="grid grid-cols-5 gap-2">
                  {formats.map((fmt) => (
                    <button
                      key={fmt.value}
                      onClick={() => setFormat(fmt.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                        format === fmt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-3xl">{fmt.icon}</span>
                      <span className="text-xs font-medium">{fmt.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formats.find((f) => f.value === format)?.description}
                </p>
              </div>

              {/* Export Options */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Export Options</h3>
                <div className="space-y-2">
                  {[
                    { key: 'includeMetadata', label: 'Include Metadata', description: 'Timestamps, authors, etc.' },
                    { key: 'includeImages', label: 'Include Images', description: 'Embed images in export' },
                    { key: 'includeAttachments', label: 'Include Attachments', description: 'Separate attachment files' },
                  ].map(({ key, label, description }) => (
                    <label
                      key={key}
                      className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={options[key as keyof ExportOptions] as boolean}
                        onChange={(e) =>
                          setOptions({ ...options, [key]: e.target.checked })
                        }
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range (if applicable) */}
              {resourceType === 'chat' && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Date Range (Optional)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">From</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">To</label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>
              )}

              {/* File Preview */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {formats.find((f) => f.value === format)?.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {resourceName}.{format}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Estimated size: ~{Math.ceil(Math.random() * 500 + 100)} KB
                    </p>
                  </div>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>

              {/* Progress Bar */}
              {exporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Exporting...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExport}
                  disabled={exporting}
                  loading={exporting}
                  className="flex-1"
                >
                  {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
                </Button>
                <Button variant="outline" onClick={onClose} disabled={exporting}>
                  Cancel
                </Button>
              </div>

              {/* Tips */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> PDF and DOCX formats preserve formatting best.
                  Markdown is great for editing later.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
