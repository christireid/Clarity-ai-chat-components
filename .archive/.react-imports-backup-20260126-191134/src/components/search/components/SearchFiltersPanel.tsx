'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, useReducedMotion } from '@clarity-chat/primitives'
import {
  Filter,
  RefreshCw,
  Sparkles,
  User,
  Settings,
  Calendar,
  Hash,
  Paperclip,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { SearchFilters, FilterPreset } from '../types'

// Type assertions for icons
const FilterIcon = Filter as React.ComponentType<{ className?: string }>
const RefreshIcon = RefreshCw as React.ComponentType<{ className?: string }>
const SparklesIcon = Sparkles as React.ComponentType<{ className?: string }>
const UserIcon = User as React.ComponentType<{ className?: string }>
const SettingsIcon = Settings as React.ComponentType<{ className?: string }>
const CalendarIcon = Calendar as React.ComponentType<{ className?: string }>
const HashIcon = Hash as React.ComponentType<{ className?: string }>
const PaperclipIcon = Paperclip as React.ComponentType<{ className?: string }>
const AlertIcon = AlertCircle as React.ComponentType<{ className?: string }>
const ChevronDownIcon = ChevronDown as React.ComponentType<{
  className?: string
}>
const ChevronUpIcon = ChevronUp as React.ComponentType<{ className?: string }>

export interface SearchFiltersPanelProps {
  filters: SearchFilters
  activeFilterCount: number
  filterPresets: FilterPreset[]
  availableModels: string[]
  onUpdateFilters: (update: Partial<SearchFilters>) => void
  onClearFilters: () => void
  onApplyPreset: (preset: FilterPreset) => void
}

/**
 * Advanced search filters panel with expandable sections
 */
export const SearchFiltersPanel = React.memo(function SearchFiltersPanel({
  filters,
  activeFilterCount,
  filterPresets,
  availableModels,
  onUpdateFilters,
  onClearFilters,
  onApplyPreset,
}: SearchFiltersPanelProps) {
  const prefersReducedMotion = useReducedMotion()
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(['role', 'quick'])
  )

  const toggleSection = React.useCallback((section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }, [])

  // Check if any preset is active
  const isPresetActive = React.useCallback(
    (preset: FilterPreset) => {
      return Object.entries(preset.filters).every(([key, value]) => {
        const filterValue = filters[key as keyof SearchFilters]
        if (key === 'dateRange' && value) {
          return (
            filters.dateRange?.start?.getTime() ===
              (value as SearchFilters['dateRange'])?.start?.getTime() &&
            filters.dateRange?.end?.getTime() ===
              (value as SearchFilters['dateRange'])?.end?.getTime()
          )
        }
        return filterValue === value
      })
    },
    [filters]
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          Filters
        </h4>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            <RefreshIcon className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Filters / Presets */}
      <div>
        <button
          onClick={() => toggleSection('quick')}
          className="flex items-center justify-between w-full text-sm font-medium mb-2"
        >
          <span className="flex items-center gap-1">
            <SparklesIcon className="h-3.5 w-3.5" />
            Quick Filters
          </span>
          {expandedSections.has('quick') ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
        {prefersReducedMotion ? (
          expandedSections.has('quick') && (
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5">
                {filterPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={isPresetActive(preset) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onApplyPreset(preset)}
                    className="h-7 text-xs gap-1"
                  >
                    {preset.icon}
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )
        ) : (
          <AnimatePresence>
            {expandedSections.has('quick') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5">
                  {filterPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant={isPresetActive(preset) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onApplyPreset(preset)}
                      className="h-7 text-xs gap-1"
                    >
                      {preset.icon}
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Role Filter */}
      <div>
        <button
          onClick={() => toggleSection('role')}
          className="flex items-center justify-between w-full text-sm font-medium mb-2"
        >
          <span className="flex items-center gap-1">
            <UserIcon className="h-3.5 w-3.5" />
            Message Role
          </span>
          {expandedSections.has('role') ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
        {prefersReducedMotion ? (
          expandedSections.has('role') && (
            <div className="overflow-hidden">
              <div className="flex gap-1.5">
                {(['all', 'user', 'assistant', 'system'] as const).map(
                  (role) => (
                    <Button
                      key={role}
                      variant={
                        (role === 'all' && !filters.role) ||
                        filters.role === role
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        onUpdateFilters({
                          role: role === 'all' ? undefined : role,
                        })
                      }
                      className="h-7 text-xs flex-1"
                    >
                      {role === 'all'
                        ? 'All'
                        : role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  )
                )}
              </div>
            </div>
          )
        ) : (
          <AnimatePresence>
            {expandedSections.has('role') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden"
              >
                <div className="flex gap-1.5">
                  {(['all', 'user', 'assistant', 'system'] as const).map(
                    (role) => (
                      <Button
                        key={role}
                        variant={
                          (role === 'all' && !filters.role) ||
                          filters.role === role
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() =>
                          onUpdateFilters({
                            role: role === 'all' ? undefined : role,
                          })
                        }
                        className="h-7 text-xs flex-1"
                      >
                        {role === 'all'
                          ? 'All'
                          : role.charAt(0).toUpperCase() + role.slice(1)}
                      </Button>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Model Filter */}
      {availableModels.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-1 block flex items-center gap-1">
            <SettingsIcon className="h-3.5 w-3.5" />
            Model
          </label>
          <select
            value={filters.model || 'all'}
            onChange={(e) =>
              onUpdateFilters({
                model: e.target.value === 'all' ? undefined : e.target.value,
              })
            }
            className="w-full h-8 px-3 text-sm border rounded-md bg-background"
          >
            <option value="all">All Models</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date Range */}
      <div>
        <label className="text-sm font-medium mb-1 block flex items-center gap-1">
          <CalendarIcon className="h-3.5 w-3.5" />
          Date Range
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            type="date"
            value={
              filters.dateRange?.start
                ? filters.dateRange.start.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              onUpdateFilters({
                dateRange: {
                  ...filters.dateRange,
                  start: e.target.value ? new Date(e.target.value) : undefined,
                },
              })
            }
            className="h-8 text-sm"
          />
          <Input
            type="date"
            value={
              filters.dateRange?.end
                ? filters.dateRange.end.toISOString().split('T')[0]
                : ''
            }
            onChange={(e) =>
              onUpdateFilters({
                dateRange: {
                  ...filters.dateRange,
                  end: e.target.value ? new Date(e.target.value) : undefined,
                },
              })
            }
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Token Range */}
      <div>
        <label className="text-sm font-medium mb-1 block flex items-center gap-1">
          <HashIcon className="h-3.5 w-3.5" />
          Token Count
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minTokens || ''}
            onChange={(e) =>
              onUpdateFilters({
                minTokens: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
            className="h-8 text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxTokens || ''}
            onChange={(e) =>
              onUpdateFilters({
                maxTokens: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
            className="h-8 text-sm"
          />
        </div>
      </div>

      {/* Boolean Options */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasAttachments || false}
            onChange={(e) =>
              onUpdateFilters({
                hasAttachments: e.target.checked ? true : undefined,
              })
            }
            className="rounded"
          />
          <span className="text-sm flex items-center gap-1">
            <PaperclipIcon className="h-3.5 w-3.5" />
            Has attachments
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasErrors || false}
            onChange={(e) =>
              onUpdateFilters({
                hasErrors: e.target.checked ? true : undefined,
              })
            }
            className="rounded"
          />
          <span className="text-sm flex items-center gap-1">
            <AlertIcon className="h-3.5 w-3.5" />
            Has errors
          </span>
        </label>
      </div>
    </div>
  )
})

SearchFiltersPanel.displayName = 'SearchFiltersPanel'
