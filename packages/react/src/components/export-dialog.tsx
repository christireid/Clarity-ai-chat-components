import * as React from 'react'
import { motion } from 'framer-motion'
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
  Input,
  cn,
} from '@clarity-chat/primitives'
import type { ExportOptions, ExportFormat } from '@clarity-chat/types'

export interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (options: ExportOptions) => Promise<void>
  resourceType: 'chat' | 'project' | 'knowledge-base'
  resourceName: string
  className?: string
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
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
        onOpenChange(false)
        setProgress(0)
      }, 500)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        size="xl" 
        animation="scale"
        className={className}
      >
        <DialogHeader>
          <DialogTitle>Export {resourceType}</DialogTitle>
          <DialogDescription>
            Export "{resourceName}" in your preferred format
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Select Format</h3>
            <div className="grid grid-cols-5 gap-2">
              {formats.map((fmt, index) => (
                <motion.button
                  key={fmt.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormat(fmt.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    format === fmt.value
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <motion.span 
                    className="text-3xl"
                    animate={format === fmt.value ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {fmt.icon}
                  </motion.span>
                  <span className="text-xs font-medium">{fmt.label}</span>
                </motion.button>
              ))}
            </div>
            <motion.p
              key={format}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-muted-foreground mt-2"
            >
              {formats.find((f) => f.value === format)?.description}
            </motion.p>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Export Options</h3>
            <div className="space-y-2">
              {[
                { key: 'includeMetadata', label: 'Include Metadata', description: 'Timestamps, authors, etc.' },
                { key: 'includeImages', label: 'Include Images', description: 'Embed images in export' },
                { key: 'includeAttachments', label: 'Include Attachments', description: 'Separate attachment files' },
              ].map(({ key, label, description }, index) => (
                <motion.label
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={options[key as keyof ExportOptions] as boolean}
                    onChange={(e) =>
                      setOptions({ ...options, [key]: e.target.checked })
                    }
                    className="w-4 h-4 mt-1 accent-primary cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Date Range (if applicable) */}
          {resourceType === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.5 }}
            >
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
            </motion.div>
          )}

          {/* File Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.6 }}
            className="p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <motion.span
                key={format}
                initial={{ scale: 0.8, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-4xl"
              >
                {formats.find((f) => f.value === format)?.icon}
              </motion.span>
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
          </motion.div>

          {/* Progress Bar */}
          {exporting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <div className="flex items-center justify-between text-sm">
                <span>Exporting...</span>
                <motion.span
                  key={progress}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {progress}%
                </motion.span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          >
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> PDF and DOCX formats preserve formatting best.
              Markdown is great for editing later.
            </p>
          </motion.div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            state={exporting ? 'loading' : 'idle'}
            className="flex-1"
          >
            {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
