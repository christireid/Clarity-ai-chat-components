'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import {
  Filter,
  X,
  ChevronDown,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Plus,
} from 'lucide-react'

// Types
export interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'search'
  options?: FilterOption[]
  range?: { min: number; max: number; step?: number }
}

export interface ActiveFilter {
  groupId: string
  value: string | string[] | [number, number]
}

// Filter Chip
export interface FilterChipProps {
  label: string
  value?: string
  onRemove: () => void
  className?: string
}

export function FilterChip({
  label,
  value,
  onRemove,
  className,
}: FilterChipProps) {
  return (
    <Badge variant="secondary" className={cn('gap-1.5 pr-1', className)}>
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}

// Filter Bar
export interface FilterBarProps {
  filters: ActiveFilter[]
  groups: FilterGroup[]
  onRemove: (groupId: string, value?: string) => void
  onClearAll: () => void
  className?: string
}

export function FilterBar({
  filters,
  groups,
  onRemove,
  onClearAll,
  className,
}: FilterBarProps) {
  if (filters.length === 0) return null

  const getLabel = (groupId: string, value: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return value
    const option = group.options?.find((o) => o.value === value)
    return option?.label || value
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.map((filter) => {
        const group = groups.find((g) => g.id === filter.groupId)
        if (!group) return null

        if (
          Array.isArray(filter.value) &&
          typeof filter.value[0] === 'number'
        ) {
          return (
            <FilterChip
              key={filter.groupId}
              label={group.label}
              value={`${filter.value[0]} - ${filter.value[1]}`}
              onRemove={() => onRemove(filter.groupId)}
            />
          )
        }

        if (Array.isArray(filter.value)) {
          return (filter.value as string[]).map((v) => (
            <FilterChip
              key={`${filter.groupId}-${v}`}
              label={group.label}
              value={getLabel(filter.groupId, v)}
              onRemove={() => onRemove(filter.groupId, v)}
            />
          ))
        }

        return (
          <FilterChip
            key={filter.groupId}
            label={group.label}
            value={getLabel(filter.groupId, filter.value as string)}
            onRemove={() => onRemove(filter.groupId)}
          />
        )
      })}
      <Button variant="ghost" size="sm" onClick={onClearAll}>
        Clear all
      </Button>
    </div>
  )
}

// Filter Dropdown
export interface FilterDropdownProps {
  group: FilterGroup
  value: string | string[] | [number, number] | undefined
  onChange: (value: string | string[] | [number, number]) => void
  className?: string
}

export function FilterDropdown({
  group,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  const [search, setSearch] = React.useState('')

  const filteredOptions = group.options?.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedCount = Array.isArray(value) ? value.length : value ? 1 : 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('gap-2', className)}>
          {group.label}
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {selectedCount}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        {group.type === 'search' && (
          <div className="p-3 border-b border-border">
            <Input
              placeholder={`Search ${group.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
        )}

        {group.type === 'range' && group.range && (
          <div className="p-4 space-y-4">
            <Slider
              value={
                (value as [number, number]) || [
                  group.range.min,
                  group.range.max,
                ]
              }
              onValueChange={(v) => onChange(v as [number, number])}
              min={group.range.min}
              max={group.range.max}
              step={group.range.step || 1}
            />
            <div className="flex items-center justify-between text-sm">
              <span>{(value as [number, number])?.[0] || group.range.min}</span>
              <span>{(value as [number, number])?.[1] || group.range.max}</span>
            </div>
          </div>
        )}

        {(group.type === 'checkbox' || group.type === 'radio') && (
          <div className="max-h-64 overflow-auto p-2">
            {filteredOptions?.map((option) => {
              const isSelected = Array.isArray(value)
                ? value.includes(option.value)
                : value === option.value

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    if (group.type === 'radio') {
                      onChange(option.value)
                    } else {
                      const current = (value as string[]) || []
                      const newValue = isSelected
                        ? current.filter((v) => v !== option.value)
                        : [...current, option.value]
                      onChange(newValue)
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm',
                    'hover:bg-muted transition-colors text-left',
                    isSelected && 'bg-muted'
                  )}
                >
                  {group.type === 'checkbox' ? (
                    <Checkbox checked={isSelected} />
                  ) : (
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full border',
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      )}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  )}
                  <span className="flex-1">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-muted-foreground">
                      {option.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Advanced Filter Panel
export interface FilterPanelProps {
  groups: FilterGroup[]
  filters: Record<string, string | string[] | [number, number]>
  onChange: (
    groupId: string,
    value: string | string[] | [number, number]
  ) => void
  onReset: () => void
  onApply: () => void
  className?: string
}

export function FilterPanel({
  groups,
  filters,
  onChange,
  onReset,
  onApply,
  className,
}: FilterPanelProps) {
  return (
    <div
      className={cn('bg-card border border-border rounded-lg p-4', className)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id}>
            <Label className="text-sm font-medium mb-3 block">
              {group.label}
            </Label>

            {group.type === 'range' && group.range && (
              <div className="space-y-3">
                <Slider
                  value={
                    (filters[group.id] as [number, number]) || [
                      group.range.min,
                      group.range.max,
                    ]
                  }
                  onValueChange={(v) =>
                    onChange(group.id, v as [number, number])
                  }
                  min={group.range.min}
                  max={group.range.max}
                  step={group.range.step || 1}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {(filters[group.id] as [number, number])?.[0] ||
                      group.range.min}
                  </span>
                  <span>
                    {(filters[group.id] as [number, number])?.[1] ||
                      group.range.max}
                  </span>
                </div>
              </div>
            )}

            {(group.type === 'checkbox' || group.type === 'radio') && (
              <div className="space-y-2">
                {group.options?.map((option) => {
                  const currentValue = filters[group.id]
                  const isSelected = Array.isArray(currentValue)
                    ? currentValue.includes(option.value)
                    : currentValue === option.value

                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (group.type === 'radio') {
                            onChange(group.id, option.value)
                          } else {
                            const current = (currentValue as string[]) || []
                            const newValue = checked
                              ? [...current, option.value]
                              : current.filter((v) => v !== option.value)
                            onChange(group.id, newValue)
                          }
                        }}
                      />
                      <span className="text-sm">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-sm text-muted-foreground ml-auto">
                          ({option.count})
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 bg-transparent"
        >
          Clear
        </Button>
        <Button onClick={onApply} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

// Quick Filter Tabs
export interface QuickFilterTab {
  id: string
  label: string
  count?: number
}

export interface QuickFilterTabsProps {
  tabs: QuickFilterTab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function QuickFilterTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: QuickFilterTabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-muted rounded-lg',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}

// Search with Filters
export interface SearchWithFiltersProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  filters?: React.ReactNode
  onSearch?: () => void
  className?: string
}

export function SearchWithFilters({
  value,
  onChange,
  placeholder = 'Search...',
  filters,
  onSearch,
  className,
}: SearchWithFiltersProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
        />
      </div>
      {filters}
      {onSearch && <Button onClick={onSearch}>Search</Button>}
    </div>
  )
}

// Sortable List Header
export interface SortOption {
  id: string
  label: string
}

export interface SortHeaderProps {
  options: SortOption[]
  value: string
  direction: 'asc' | 'desc'
  onChange: (value: string, direction: 'asc' | 'desc') => void
  className?: string
}

export function SortHeader({
  options,
  value,
  direction,
  onChange,
  className,
}: SortHeaderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={(v) => onChange(v, direction)}>
        <SelectTrigger className="w-40 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(value, direction === 'asc' ? 'desc' : 'asc')}
      >
        {direction === 'asc' ? 'A-Z' : 'Z-A'}
      </Button>
    </div>
  )
}
