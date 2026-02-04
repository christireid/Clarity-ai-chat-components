'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

export interface CreateFolderFormProps {
  newFolderName: string
  prefersReducedMotion: boolean
  onNameChange: (name: string) => void
  onCreate: () => void
  onCancel: () => void
}

/**
 * Form for creating new folders
 */
export const CreateFolderForm = memo(function CreateFolderForm({
  newFolderName,
  prefersReducedMotion,
  onNameChange,
  onCreate,
  onCancel,
}: CreateFolderFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onCreate()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const FormContent = (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Folder name..."
        value={newFolderName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        autoFocus
      />
      <button
        onClick={onCreate}
        className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
      >
        Create
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-2 bg-muted text-muted-foreground text-sm rounded-lg hover:bg-muted/80 transition-colors"
      >
        Cancel
      </button>
    </div>
  )

  if (prefersReducedMotion) {
    return <div className="p-3 border-b border-border">{FormContent}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-3 border-b border-border"
    >
      {FormContent}
    </motion.div>
  )
})

CreateFolderForm.displayName = 'CreateFolderForm'
