'use client'

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'
import { useClipboard } from '@clarity-chat/react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

interface InstallTabsProps {
  /** Package name to install */
  packageName: string
  /** Whether this is a dev dependency */
  dev?: boolean
  /** Additional packages */
  additionalPackages?: string[]
  /** Custom className */
  className?: string
  /** Show global install option */
  showGlobal?: boolean
}

interface CLICommandProps {
  /** Command to display */
  command: string
  /** Custom className */
  className?: string
  /** Label for the command */
  label?: string
}

// ============================================================================
// Package Manager Commands
// ============================================================================

const getInstallCommand = (
  pm: PackageManager,
  packageName: string,
  dev: boolean = false,
  additionalPackages: string[] = []
): string => {
  const packages = [packageName, ...additionalPackages].join(' ')
  const devFlag = dev ? (pm === 'npm' ? '--save-dev' : '-D') : ''

  switch (pm) {
    case 'npm':
      return `npm install ${packages}${devFlag ? ` ${devFlag}` : ''}`
    case 'pnpm':
      return `pnpm add ${packages}${devFlag ? ` ${devFlag}` : ''}`
    case 'yarn':
      return `yarn add ${packages}${devFlag ? ` ${devFlag}` : ''}`
    case 'bun':
      return `bun add ${packages}${devFlag ? ` ${devFlag}` : ''}`
  }
}

// ============================================================================
// CLI Command Component
// ============================================================================

export function CLICommand({ command, className, label }: CLICommandProps) {
  const { copy, copied } = useClipboard({ timeout: 2000 })

  const handleCopy = useCallback(() => {
    copy(command)
  }, [copy, command])

  return (
    <div
      className={cn(
        'relative group rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 overflow-hidden',
        className
      )}
    >
      {label && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-sm text-gray-100 font-mono">
          <span className="text-green-400 select-none">$ </span>
          {command}
        </code>

        <button
          onClick={handleCopy}
          className="ml-4 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Coming Soon Notice Component
// ============================================================================

interface ComingSoonNoticeProps {
  className?: string
}

export function ComingSoonNotice({ className }: ComingSoonNoticeProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800',
        className
      )}
    >
      <span className="text-amber-500 text-lg">⚠️</span>
      <div>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Coming Soon
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          This library is currently in development and not yet available on npm
          or other package registries. Star the repository to be notified when
          it&apos;s released!
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Install Tabs Component
// ============================================================================

export function InstallTabs({
  packageName,
  dev = false,
  additionalPackages = [],
  className,
  showGlobal = false,
}: InstallTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>('npm')
  const { copy, copied } = useClipboard({ timeout: 2000 })

  const command = getInstallCommand(
    activeTab,
    packageName,
    dev,
    additionalPackages
  )

  const handleCopy = useCallback(() => {
    copy(command)
  }, [copy, command])

  const tabs: { id: PackageManager; label: string }[] = [
    { id: 'npm', label: 'npm' },
    { id: 'pnpm', label: 'pnpm' },
    { id: 'yarn', label: 'yarn' },
    { id: 'bun', label: 'bun' },
  ]

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      {/* Tabs Header */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-900'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="mr-2 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Command Display */}
      <div className="bg-gray-900 px-4 py-3">
        <code className="text-sm text-gray-100 font-mono">
          <span className="text-green-400 select-none">$ </span>
          {command}
        </code>
      </div>
    </div>
  )
}

// ============================================================================
// CLI Add Component (shadcn-style)
// ============================================================================

interface CLIAddProps {
  /** Component name to add */
  componentName: string
  /** Custom className */
  className?: string
}

export function CLIAdd({ componentName, className }: CLIAddProps) {
  const { copy, copied } = useClipboard({ timeout: 2000 })
  const command = `npx clarity-chat add ${componentName}`

  const handleCopy = useCallback(() => {
    copy(command)
  }, [copy, command])

  return (
    <div
      className={cn(
        'relative group flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 px-4 py-3',
        className
      )}
    >
      <code className="text-sm text-gray-100 font-mono">
        <span className="text-green-400 select-none">$ </span>
        npx clarity-chat add{' '}
        <span className="text-blue-400">{componentName}</span>
      </code>

      <button
        onClick={handleCopy}
        className="ml-4 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

// ============================================================================
// Steps Component
// ============================================================================

interface Step {
  title: string
  description?: string
  code?: string
  language?: string
}

interface StepsProps {
  steps: Step[]
  className?: string
}

export function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {steps.map((step, index) => (
        <div key={index} className="relative pl-8">
          {/* Step number */}
          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-medium">
            {index + 1}
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
          )}

          {/* Content */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {step.title}
            </h3>
            {step.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {step.description}
              </p>
            )}
            {step.code && <CLICommand command={step.code} />}
          </div>
        </div>
      ))}
    </div>
  )
}
