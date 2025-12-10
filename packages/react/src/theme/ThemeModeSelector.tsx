/**
 * ThemeModeSelector Component
 *
 * Three-way mode selector (light/dark/system)
 *
 * @module theme/ThemeModeSelector
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { useTheme } from './use-theme'
import type { ThemeMode } from './theme-types'

/**
 * Props for ThemeModeSelector component
 */
export interface ThemeModeSelectorProps {
  className?: string
  variant?: 'buttons' | 'inline' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ThemeModeSelector - Three-way mode selector (light/dark/system)
 *
 * Unlike ThemeToggle which only toggles between light/dark,
 * this component provides access to all three modes including system.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeModeSelector />
 *
 * // Inline variant
 * <ThemeModeSelector variant="inline" />
 *
 * // With custom className
 * <ThemeModeSelector className="my-selector" />
 * ```
 */
export function ThemeModeSelector({
  className,
  variant = 'buttons',
  size = 'md',
}: ThemeModeSelectorProps) {
  const { theme, setTheme, mode } = useTheme()
  const currentMode = theme.mode

  const modes: Array<{
    value: ThemeMode
    label: string
    icon: React.ReactNode
  }> = [
    {
      value: 'light',
      label: 'Light',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ),
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
    },
    {
      value: 'system',
      label: 'System',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8m-4-4v4" />
        </svg>
      ),
    },
  ]

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative inline-block', className)}>
        <select
          value={currentMode}
          onChange={(e) => setTheme({ mode: e.target.value as ThemeMode })}
          className={cn(
            'appearance-none rounded-lg border border-border bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring/40',
            'pr-8 cursor-pointer',
            sizeClasses[size]
          )}
          aria-label="Select theme mode"
        >
          {modes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-lg bg-muted p-1',
          className
        )}
        role="radiogroup"
        aria-label="Theme mode"
      >
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setTheme({ mode: m.value })}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              sizeClasses[size],
              currentMode === m.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            role="radio"
            aria-checked={currentMode === m.value}
            aria-label={m.label}
          >
            {m.icon}
            <span className="sr-only sm:not-sr-only">{m.label}</span>
          </button>
        ))}
      </div>
    )
  }

  // Default: buttons variant
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="radiogroup"
      aria-label="Theme mode"
    >
      {modes.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => setTheme({ mode: m.value })}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            sizeClasses[size],
            currentMode === m.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:bg-muted'
          )}
          role="radio"
          aria-checked={currentMode === m.value}
          aria-label={m.label}
        >
          {m.icon}
          <span>{m.label}</span>
        </button>
      ))}
      {/* Show resolved mode when in system mode */}
      {currentMode === 'system' && (
        <span className="text-xs text-muted-foreground ml-2">
          (using {mode})
        </span>
      )}
    </div>
  )
}

ThemeModeSelector.displayName = 'ThemeModeSelector'
