'use client'

import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'

export interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageId: string
  onDelete: (messageId: string, options: DeleteOptions) => void | Promise<void>
  title?: string
  description?: string
  showDeleteForEveryone?: boolean
  showDeleteHistory?: boolean
  messagePreview?: string
  canUndoDelete?: boolean
}

export interface DeleteOptions {
  deleteForEveryone: boolean
  deleteHistory: boolean
}

/**
 * DeleteConfirmationDialog - Confirmation modal for deleting messages
 *
 * Features:
 * - Warning message with preview
 * - Delete for self vs everyone option
 * - Delete conversation history option
 * - Destructive styling
 * - Loading state
 * - Undo capability info
 *
 * @example
 * ```tsx
 * <DeleteConfirmationDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   messageId="msg-123"
 *   messagePreview="This is the message to delete..."
 *   showDeleteForEveryone={true}
 *   onDelete={async (id, options) => {
 *     await deleteMessage(id, options)
 *   }}
 * />
 * ```
 */
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  messageId,
  onDelete,
  title = 'Delete Message?',
  description = 'This action cannot be undone. The message will be permanently removed.',
  showDeleteForEveryone = false,
  showDeleteHistory = false,
  messagePreview,
  canUndoDelete = false,
}: DeleteConfirmationDialogProps) {
  const [deleteForEveryone, setDeleteForEveryone] = React.useState(false)
  const [deleteHistory, setDeleteHistory] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setDeleteForEveryone(false)
      setDeleteHistory(false)
      setIsDeleting(false)
    }
  }, [open])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(messageId, { deleteForEveryone, deleteHistory })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete message:', error)
      setIsDeleting(false)
      // Error is handled by parent component
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Message Preview */}
          {messagePreview && (
            <div className="p-3 bg-muted/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {messagePreview}
              </p>
            </div>
          )}

          {/* Delete Options */}
          <div className="space-y-3">
            {showDeleteForEveryone && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={deleteForEveryone}
                  onChange={(e) => setDeleteForEveryone(e.target.checked)}
                  disabled={isDeleting}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium group-hover:text-destructive transition-colors">
                    Delete for everyone
                  </div>
                  <div className="text-xs text-muted-foreground">
                    This message will be removed for all participants in the
                    conversation
                  </div>
                </div>
              </label>
            )}

            {showDeleteHistory && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={deleteHistory}
                  onChange={(e) => setDeleteHistory(e.target.checked)}
                  disabled={isDeleting}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium group-hover:text-destructive transition-colors">
                    Delete entire conversation history
                  </div>
                  <div className="text-xs text-muted-foreground">
                    All messages in this conversation will be deleted
                  </div>
                </div>
              </label>
            )}
          </div>

          {/* Warning Message */}
          {(deleteForEveryone || deleteHistory) && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="text-xs text-destructive">
                <strong>Warning:</strong> This is a destructive action.
                {deleteHistory
                  ? ' All conversation history will be permanently removed.'
                  : ' This message will be removed for all users.'}
              </div>
            </div>
          )}

          {/* Undo Info */}
          {canUndoDelete && !deleteHistory && (
            <div className="text-xs text-muted-foreground">
              You can undo this action within 30 seconds after deletion
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className={cn(
              'bg-destructive text-destructive-foreground hover:bg-destructive/90',
              isDeleting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Message
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
