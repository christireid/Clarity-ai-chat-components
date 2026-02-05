/**
 * Dialog Components for Chat Page
 * Settings Dialog and Export Dialog implementations
 */

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Separator,
} from '@clarity-chat/primitives'
import { Download, Check } from 'lucide-react'
import type { SettingsState, ChatMessage, TokenUsage } from './types'

// ============================================================================
// Settings Dialog Component
// ============================================================================

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: SettingsState
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  setSettings,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
          <DialogDescription>
            Configure your chat experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={settings.model}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-3.5-sonnet">
                  Claude 3.5 Sonnet
                </SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground">
                {settings.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[settings.temperature]}
              onValueChange={([value]) =>
                setSettings((prev) => ({ ...prev, temperature: value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Lower values make output more focused, higher values more creative
            </p>
          </div>

          {/* Max Tokens Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <span className="text-sm text-muted-foreground">
                {settings.maxTokens.toLocaleString()}
              </span>
            </div>
            <Slider
              id="maxTokens"
              min={512}
              max={8192}
              step={512}
              value={[settings.maxTokens]}
              onValueChange={([value]) =>
                setSettings((prev) => ({ ...prev, maxTokens: value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Maximum length of generated responses
            </p>
          </div>

          <Separator />

          {/* Feature Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="streaming">Streaming</Label>
                <p className="text-xs text-muted-foreground">
                  Stream responses as they're generated
                </p>
              </div>
              <Switch
                id="streaming"
                checked={settings.streamingEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    streamingEnabled: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="tools">Tools Enabled</Label>
                <p className="text-xs text-muted-foreground">
                  Allow AI to use external tools
                </p>
              </div>
              <Switch
                id="tools"
                checked={settings.toolsEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, toolsEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="memory">Memory</Label>
                <p className="text-xs text-muted-foreground">
                  Remember context across conversations
                </p>
              </div>
              <Switch
                id="memory"
                checked={settings.memoryEnabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, memoryEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Auto-save</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically save conversation history
                </p>
              </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, autoSave: checked }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Export Dialog Component
// ============================================================================

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: ChatMessage[]
  tokenUsage: TokenUsage
  onExport: () => void
}

export function ExportDialog({
  open,
  onOpenChange,
  messages,
  tokenUsage,
  onExport,
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Chat</DialogTitle>
          <DialogDescription>
            Download your conversation history as JSON
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Your export will include:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>
                  All messages ({messages.length} total)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>
                  Token usage data ({tokenUsage.total.toLocaleString()} tokens)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Timestamps and metadata</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Tool executions and results</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Citations and sources</span>
              </li>
            </ul>
          </div>

          <div className="p-3 border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              <strong>Note:</strong> Exported data may contain sensitive
              information. Store securely.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Confirmation Dialog Component
// ============================================================================

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Message Edit Component
// ============================================================================

interface MessageEditProps {
  content: string
  onChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
}

export function MessageEdit({
  content,
  onChange,
  onSave,
  onCancel,
}: MessageEditProps) {
  return (
    <div className="w-full max-w-[85%] space-y-2">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-y"
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSave} className="gap-2">
          <Check className="h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// File Upload Preview Component
// ============================================================================

interface FileUploadPreviewProps {
  files: File[]
  onRemove: (index: number) => void
}

export function FileUploadPreview({ files, onRemove }: FileUploadPreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="px-4 py-2 border-t bg-muted/30">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Attached:</span>
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-background rounded-md text-xs"
          >
            <span className="max-w-[150px] truncate">{file.name}</span>
            <span className="text-muted-foreground">
              ({(file.size / 1024).toFixed(1)}KB)
            </span>
            <button
              onClick={() => onRemove(index)}
              className="ml-1 hover:text-red-500 transition-colors"
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
