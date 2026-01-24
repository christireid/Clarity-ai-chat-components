'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@clarity-chat/primitives'
import { X } from 'lucide-react'
import type { SearchFilters } from '../types'

// Type assertion for icon
const XIcon = X as React.ComponentType<{ className?: string }>

export interface ActiveFiltersPillsProps {
  filters: SearchFilters
  activeFilterCount: number
  onUpdateFilters: (update: Partial<SearchFilters>) => void
}

/**
 * Component to display active filters as removable pills/badges
 */
export const ActiveFiltersPills = React.memo(function ActiveFiltersPills({
  filters,
  activeFilterCount,
  onUpdateFilters,
}: ActiveFiltersPillsProps) {
  const prefersReducedMotion = React.useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      mediaQuery.addEventListener('change', callback)
      return () => mediaQuery.removeEventListener('change', callback)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  )

  if (activeFilterCount === 0) return null

  return prefersReducedMotion ? (
    <div className="flex flex-wrap gap-1.5">
        {filters.role && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Role: {filters.role}
            <button
              onClick={() => onUpdateFilters({ role: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {filters.model && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Model: {filters.model}
            <button
              onClick={() => onUpdateFilters({ model: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {(filters.dateRange?.start || filters.dateRange?.end) && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Date: {filters.dateRange?.start?.toLocaleDateString() || '...'} -{' '}
            {filters.dateRange?.end?.toLocaleDateString() || '...'}
            <button
              onClick={() => onUpdateFilters({ dateRange: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {(filters.minTokens || filters.maxTokens) && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Tokens: {filters.minTokens || 0} - {filters.maxTokens || '...'}
            <button
              onClick={() =>
                onUpdateFilters({
                  minTokens: undefined,
                  maxTokens: undefined,
                })
              }
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {filters.hasAttachments && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Has attachments
            <button
              onClick={() => onUpdateFilters({ hasAttachments: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {filters.hasErrors && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Has errors
            <button
              onClick={() => onUpdateFilters({ hasErrors: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
  ) : (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-1.5"
      >
        {filters.role && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Role: {filters.role}
            <button
              onClick={() => onUpdateFilters({ role: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {filters.model && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Model: {filters.model}
            <button
              onClick={() => onUpdateFilters({ model: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {(filters.dateRange?.start || filters.dateRange?.end) && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Date: {filters.dateRange?.start?.toLocaleDateString() || '...'} -{' '}
            {filters.dateRange?.end?.toLocaleDateString() || '...'}
            <button
              onClick={() => onUpdateFilters({ dateRange: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {(filters.minTokens || filters.maxTokens) && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Tokens: {filters.minTokens || 0} - {filters.maxTokens || '...'}
            <button
              onClick={() =>
                onUpdateFilters({
                  minTokens: undefined,
                  maxTokens: undefined,
                })
              }
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {filters.hasAttachments && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Has attachments
            <button
              onClick={() => onUpdateFilters({ hasAttachments: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {filters.hasErrors && (
          <Badge variant="secondary" className="gap-1 pr-1">
            Has errors
            <button
              onClick={() => onUpdateFilters({ hasErrors: undefined })}
              className="ml-0.5 hover:text-destructive"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </motion.div>
    </AnimatePresence>
  )
})

ActiveFiltersPills.displayName = 'ActiveFiltersPills'
