'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'

type DialogVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info'

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  variant?: DialogVariant
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
  children?: React.ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading,
  children,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const variantConfig = {
    default: {
      icon: null,
      iconColor: '',
      buttonVariant: 'default' as const,
    },
    destructive: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      buttonVariant: 'destructive' as const,
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      buttonVariant: 'default' as const,
    },
    success: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      buttonVariant: 'default' as const,
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      buttonVariant: 'default' as const,
    },
  }

  const config = variantConfig[variant]
  const Icon = config.icon
  const isLoadingState = loading !== undefined ? loading : isLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-4">
            {Icon && (
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  variant === 'destructive' && 'bg-red-500/10',
                  variant === 'warning' && 'bg-yellow-500/10',
                  variant === 'success' && 'bg-green-500/10',
                  variant === 'info' && 'bg-blue-500/10'
                )}
              >
                <Icon className={cn('w-5 h-5', config.iconColor)} />
              </div>
            )}
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoadingState}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoadingState}
          >
            {isLoadingState && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirmation Dialog
interface DeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName?: string
  onConfirm: () => void | Promise<void>
}

export function DeleteConfirmation({
  open,
  onOpenChange,
  itemName,
  onConfirm,
}: DeleteConfirmationProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Item"
      description={
        itemName
          ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
          : 'Are you sure you want to delete this item? This action cannot be undone.'
      }
      variant="destructive"
      confirmLabel="Delete"
      onConfirm={onConfirm}
    />
  )
}

// Checkpoint Dialog
interface CheckpointDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string) => void
  onRestore: (checkpointId: string) => void
  checkpoints?: { id: string; name: string; createdAt: Date }[]
  mode: 'save' | 'restore'
}

export function CheckpointDialog({
  open,
  onOpenChange,
  onSave,
  onRestore,
  checkpoints = [],
  mode,
}: CheckpointDialogProps) {
  const [name, setName] = React.useState('')
  const [selectedCheckpoint, setSelectedCheckpoint] = React.useState<
    string | null
  >(null)

  const handleConfirm = () => {
    if (mode === 'save' && name.trim()) {
      onSave(name.trim())
      setName('')
    } else if (mode === 'restore' && selectedCheckpoint) {
      onRestore(selectedCheckpoint)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'save' ? 'Save Checkpoint' : 'Restore Checkpoint'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'save'
              ? 'Save the current conversation state to return to later.'
              : 'Restore a previous conversation state.'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'save' ? (
          <div className="py-4">
            <label className="text-sm font-medium">Checkpoint Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Before code refactor"
              className="mt-2 w-full px-3 py-2 rounded-md border border-border bg-background"
            />
          </div>
        ) : (
          <div className="py-4 space-y-2 max-h-64 overflow-y-auto">
            {checkpoints.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No checkpoints saved
              </p>
            ) : (
              checkpoints.map((checkpoint) => (
                <button
                  key={checkpoint.id}
                  onClick={() => setSelectedCheckpoint(checkpoint.id)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
                    selectedCheckpoint === checkpoint.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:bg-muted'
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">{checkpoint.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {checkpoint.createdAt.toLocaleString()}
                    </p>
                  </div>
                  {selectedCheckpoint === checkpoint.id && (
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  )}
                </button>
              ))
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              (mode === 'save' && !name.trim()) ||
              (mode === 'restore' && !selectedCheckpoint)
            }
          >
            {mode === 'save' ? 'Save' : 'Restore'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Export Dialog
interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (format: string) => void
  formats?: { id: string; label: string; description?: string }[]
}

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  formats = [
    { id: 'json', label: 'JSON', description: 'Full conversation data' },
    { id: 'markdown', label: 'Markdown', description: 'Human-readable format' },
    { id: 'txt', label: 'Plain Text', description: 'Simple text format' },
    { id: 'pdf', label: 'PDF', description: 'Printable document' },
  ],
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = React.useState(formats[0]?.id)

  const handleExport = () => {
    if (selectedFormat) {
      onExport(selectedFormat)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Conversation</DialogTitle>
          <DialogDescription>
            Choose a format to export your conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
                selectedFormat === format.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:bg-muted'
              )}
            >
              <div>
                <p className="font-medium text-sm">{format.label}</p>
                {format.description && (
                  <p className="text-xs text-muted-foreground">
                    {format.description}
                  </p>
                )}
              </div>
              {selectedFormat === format.id && (
                <CheckCircle2 className="w-4 h-4 text-accent" />
              )}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Clear Conversation Dialog
interface ClearConversationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClear: () => void
  keepSystemPrompt?: boolean
  onKeepSystemPromptChange?: (keep: boolean) => void
}

export function ClearConversationDialog({
  open,
  onOpenChange,
  onClear,
  keepSystemPrompt = true,
  onKeepSystemPromptChange,
}: ClearConversationDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Clear Conversation"
      description="This will remove all messages from the current conversation."
      variant="warning"
      confirmLabel="Clear"
      onConfirm={onClear}
    >
      {onKeepSystemPromptChange && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={keepSystemPrompt}
            onChange={(e) => onKeepSystemPromptChange(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-sm">Keep system prompt</span>
        </label>
      )}
    </ConfirmationDialog>
  )
}

// Aliases for backward compatibility
export const ConfirmDialog = ConfirmationDialog
export const DeleteConfirmDialog = DeleteConfirmation
