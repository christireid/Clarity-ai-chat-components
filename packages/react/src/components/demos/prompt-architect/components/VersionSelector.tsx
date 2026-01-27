'use client'

/**
 * VersionSelector Component
 *
 * Dropdown to manage and switch between prompt versions.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { formatRelativeTime } from '../../../../internal/helpers'
import type { PromptVersion } from '../types'

export interface VersionSelectorProps {
  /** Available versions */
  versions: PromptVersion[]
  /** Currently active version ID */
  activeVersionId: string | null
  /** Handler when version is selected */
  onSelect: (versionId: string) => void
  /** Handler to save a new version */
  onSave: (name: string, description?: string) => void
  /** Handler to delete a version */
  onDelete: (versionId: string) => void
  /** Whether there are unsaved changes */
  isDirty: boolean
  /** Whether selector is disabled */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

// formatRelativeTime imported from @clarity-chat/primitives

/**
 * Version selector dropdown
 */
export function VersionSelector({
  versions,
  activeVersionId,
  onSelect,
  onSave,
  onDelete,
  isDirty,
  disabled = false,
  className,
}: VersionSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [newVersionName, setNewVersionName] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Get active version name
  const activeVersion = versions.find((v) => v.id === activeVersionId)
  const displayName = activeVersion
    ? activeVersion.name
    : isDirty
      ? 'Unsaved Changes'
      : 'No version'

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsSaving(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSave = () => {
    if (newVersionName.trim()) {
      onSave(newVersionName.trim())
      setNewVersionName('')
      setIsSaving(false)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2',
          'text-sm font-medium',
          'rounded-lg border border-border bg-background',
          'hover:bg-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <span>📜</span>
        <span className="max-w-[120px] truncate">{displayName}</span>
        {isDirty && !activeVersionId && (
          <span
            className="w-2 h-2 rounded-full bg-yellow-500"
            title="Unsaved changes"
          />
        )}
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 z-50',
            'min-w-[250px] max-h-[350px] overflow-auto scrollbar-hide',
            'rounded-lg border border-border bg-background shadow-lg',
            'py-1'
          )}
        >
          {/* Save new version */}
          {isSaving ? (
            <div className="px-3 py-2 space-y-2">
              <input
                type="text"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="Version name (e.g., V2 Friendly)"
                autoFocus
                className={cn(
                  'w-full px-2 py-1 text-sm rounded border border-border',
                  'focus:outline-none focus:ring-1 focus:ring-primary'
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setIsSaving(false)
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!newVersionName.trim()}
                  className={cn(
                    'flex-1 px-2 py-1 text-xs font-medium rounded',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90 transition-colors',
                    'disabled:opacity-50'
                  )}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className={cn(
                    'flex-1 px-2 py-1 text-xs font-medium rounded',
                    'border border-border',
                    'hover:bg-muted transition-colors'
                  )}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSaving(true)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm',
                'hover:bg-muted transition-colors',
                'flex items-center gap-2 text-primary'
              )}
            >
              <span>+</span>
              <span>Save Current Version...</span>
            </button>
          )}

          {/* Divider */}
          {versions.length > 0 && (
            <div className="my-1 border-t border-border" />
          )}

          {/* Version list */}
          {versions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
              No saved versions
            </div>
          ) : (
            versions
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((version) => (
                <div
                  key={version.id}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2',
                    'hover:bg-muted transition-colors group'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(version.id)
                      setIsOpen(false)
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {activeVersionId === version.id && (
                        <span className="text-primary">✓</span>
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {version.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(version.createdAt)}
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(version.id)}
                    className={cn(
                      'p-1 rounded opacity-0 group-hover:opacity-100',
                      'hover:bg-destructive/10 hover:text-destructive',
                      'transition-all'
                    )}
                    title="Delete version"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}

export default VersionSelector
