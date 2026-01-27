'use client'

/**
 * CommandPalette Component - API Reference Documentation
 *
 * A keyboard-first command palette for quick actions, search, and navigation
 * with fuzzy matching, category grouping, and full keyboard support.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Command,
  Copy,
  Check,
  ChevronRight,
  Keyboard,
  Search,
  Zap,
  Filter,
  Settings,
  HelpCircle,
  ExternalLink,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [actionLog, setActionLog] = React.useState<string[]>([])

  const addLog = (action: string) => {
    setActionLog((prev) => [...prev.slice(-4), action])
  }

  // Sample commands
  const commands = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'Actions',
      shortcut: ['⌘', 'N'],
    },
    {
      id: 'search',
      label: 'Search Messages',
      description: 'Search through your message history',
      category: 'Actions',
      shortcut: ['⌘', 'F'],
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Configure your preferences',
      category: 'Navigation',
      shortcut: ['⌘', ','],
    },
    {
      id: 'export',
      label: 'Export Conversation',
      description: 'Download conversation as file',
      category: 'Actions',
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      description: 'Switch between light and dark mode',
      category: 'Settings',
      shortcut: ['⌘', 'D'],
    },
  ]

  // Filter commands
  const filteredCommands = React.useMemo(() => {
    if (!search) return commands
    const query = search.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.category?.toLowerCase().includes(query)
    )
  }, [search])

  // Group by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, typeof commands> = {}
    filteredCommands.forEach((cmd) => {
      const cat = cmd.category || 'Commands'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            addLog(`Executed: ${filteredCommands[selectedIndex].label}`)
            setOpen(false)
            setSearch('')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredCommands, selectedIndex])

  // Reset selection when search changes
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-2">
              Interactive Demo
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Click the button below to open the command palette. Try typing to
              search, use arrow keys to navigate, and press Enter to select.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
            >
              <Command className="w-4 h-4" />
              Open Command Palette
              <kbd className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Action Log */}
      {actionLog.length > 0 && (
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
          <h4 className="font-semibold text-sm mb-2">Action Log</h4>
          <div className="space-y-1 text-xs font-mono">
            {actionLog.map((action, i) => (
              <div key={i} className="text-muted-foreground">
                {new Date().toLocaleTimeString()}: {action}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Command Palette Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 bg-card border shadow-2xl rounded-lg z-50 flex flex-col max-h-[60vh] overflow-hidden"
            >
              {/* Search Input */}
              <div className="relative p-4 border-b">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type a command..."
                    className="flex-1 px-0 py-2 text-base bg-transparent border-none outline-none placeholder:text-muted-foreground focus:ring-0"
                    autoFocus
                  />
                </div>
              </div>

              {/* Results */}
              <div className="overflow-y-auto scrollbar-hide flex-1 p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No commands found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedCommands).map(
                      ([category, items]) => (
                        <div key={category}>
                          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {category}
                          </div>
                          <div className="space-y-1">
                            {items.map((cmd, idx) => {
                              const globalIdx = filteredCommands.indexOf(cmd)
                              const isSelected = globalIdx === selectedIndex
                              return (
                                <button
                                  key={cmd.id}
                                  onClick={() => {
                                    addLog(`Executed: ${cmd.label}`)
                                    setOpen(false)
                                    setSearch('')
                                  }}
                                  className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-accent'
                                  )}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                      {cmd.label}
                                    </div>
                                    {cmd.description && (
                                      <div
                                        className={cn(
                                          'text-sm truncate',
                                          isSelected
                                            ? 'text-primary-foreground/70'
                                            : 'text-muted-foreground'
                                        )}
                                      >
                                        {cmd.description}
                                      </div>
                                    )}
                                  </div>
                                  {cmd.shortcut && (
                                    <div className="flex gap-1 flex-shrink-0">
                                      {cmd.shortcut.map((key, i) => (
                                        <kbd
                                          key={i}
                                          className={cn(
                                            'px-1.5 py-0.5 text-xs rounded border',
                                            isSelected
                                              ? 'bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground'
                                              : 'bg-muted border-border'
                                          )}
                                        >
                                          {key}
                                        </kbd>
                                      ))}
                                    </div>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t text-xs text-muted-foreground flex items-center justify-between bg-muted/50">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background rounded border">
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background rounded border">
                      ↵
                    </kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-background rounded border">
                      Esc
                    </kbd>
                    Close
                  </span>
                </div>
                <div className="font-medium">
                  {filteredCommands.length}{' '}
                  {filteredCommands.length === 1 ? 'command' : 'commands'}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const commandPaletteProps: PropDefinition[] = [
  {
    name: 'items',
    type: 'CommandItem[]',
    required: true,
    description: 'Array of command items to display in the palette',
  },
  {
    name: 'open',
    type: 'boolean',
    required: true,
    description: 'Whether the command palette is open',
  },
  {
    name: 'onClose',
    type: '() => void',
    required: true,
    description: 'Callback when the palette should close',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: 'Type a command...',
    description: 'Placeholder text for the search input',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the palette container',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Show loading spinner during async operations',
  },
  {
    name: 'aria-label',
    type: 'string',
    default: 'Command palette',
    description: 'Accessible label for the command palette',
  },
]

const commandItemProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Unique identifier for the command',
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Display label for the command',
  },
  {
    name: 'onSelect',
    type: '() => void',
    required: true,
    description: 'Callback when the command is selected',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Optional description text shown below the label',
  },
  {
    name: 'icon',
    type: 'React.ReactNode',
    description: 'Optional icon to display before the label',
  },
  {
    name: 'shortcut',
    type: 'string[]',
    description: 'Keyboard shortcut keys (e.g., ["⌘", "K"])',
  },
  {
    name: 'category',
    type: 'string',
    description: 'Category for grouping commands (e.g., "Actions", "Navigation")',
  },
]

// ============================================================================
// Main Component
// ============================================================================

export default function CommandPalettePage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.moderate }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Command className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Navigation</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">
                CommandPalette
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                CommandPalette
              </h1>
              <p className="text-lg text-muted-foreground">
                A keyboard-first command palette for quick actions and
                navigation
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800">
              Stable
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Keyboard className="w-4 h-4" />
              <span>Full keyboard navigation</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="w-4 h-4" />
              <span>Fuzzy search</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Category grouping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>Keyboard shortcuts</span>
            </div>
          </div>
        </motion.header>

        {/* Live Demo */}
        <Section id="demo" title="Live Demo" className="mb-12">
          <LiveDemo />
        </Section>

        {/* Overview */}
        <Section id="overview" title="Overview" className="mb-12">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              The CommandPalette component provides a powerful keyboard-first
              interface for quick actions and navigation. Inspired by modern
              command palettes like Spotlight (macOS) and Command Palette
              (VS Code), it enables users to quickly find and execute commands
              without leaving the keyboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Keyboard className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Keyboard First
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Full keyboard navigation with arrow keys, Enter, and Escape.
                    Designed for power users who prefer keyboard over mouse.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Search className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Fuzzy Search
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Intelligent search that matches labels, descriptions, and
                    categories. Find commands quickly as you type.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Filter className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Category Groups
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Organize commands into logical categories like Actions,
                    Navigation, and Settings for better discovery.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Keyboard Shortcuts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Display keyboard shortcuts for each command. Users can see
                    and learn shortcuts while browsing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Installation */}
        <Section id="installation" title="Installation" className="mb-12">
          <CodeBlock
            code={`import { CommandPalette } from '@clarity-chat/react'`}
            language="typescript"
            showLineNumbers={false}
          />
        </Section>

        {/* Basic Usage */}
        <Section id="usage" title="Basic Usage" className="mb-12">
          <p className="text-muted-foreground mb-4">
            Create a command palette with a list of commands and control its
            open state:
          </p>

          <CodeBlock
            code={`import { CommandPalette, CommandItem } from '@clarity-chat/react'
import { useState } from 'react'

function MyApp() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      category: 'Actions',
      shortcut: ['⌘', 'N'],
      onSelect: () => {
        console.log('Creating new chat...')
      },
    },
    {
      id: 'search',
      label: 'Search Messages',
      description: 'Search through your message history',
      category: 'Actions',
      shortcut: ['⌘', 'F'],
      onSelect: () => {
        console.log('Opening search...')
      },
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Configure your preferences',
      category: 'Navigation',
      shortcut: ['⌘', ','],
      onSelect: () => {
        console.log('Opening settings...')
      },
    },
  ]

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Command Palette (⌘K)
      </button>

      <CommandPalette
        items={commands}
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Type a command..."
      />
    </>
  )
}`}
            language="typescript"
          />
        </Section>

        {/* Keyboard Shortcut Hook */}
        <Section id="keyboard-hook" title="With Keyboard Shortcut" className="mb-12">
          <p className="text-muted-foreground mb-4">
            Use the <code className="text-sm px-1.5 py-0.5 rounded bg-muted">useCommandPalette</code> hook
            to add a global keyboard shortcut (Cmd+K or Ctrl+K):
          </p>

          <CodeBlock
            code={`import { CommandPalette, useCommandPalette } from '@clarity-chat/react'

function MyApp() {
  // Automatically handles Cmd+K / Ctrl+K toggle
  const { isOpen, close, toggle, shortcutDisplay } = useCommandPalette({
    onOpen: () => console.log('Palette opened'),
    onClose: () => console.log('Palette closed'),
  })

  return (
    <>
      <button onClick={toggle}>
        Open Palette ({shortcutDisplay})
      </button>

      <CommandPalette
        items={commands}
        open={isOpen}
        onClose={close}
      />
    </>
  )
}`}
            language="typescript"
          />
        </Section>

        {/* Custom Commands */}
        <Section id="custom-commands" title="Custom Commands" className="mb-12">
          <p className="text-muted-foreground mb-4">
            Add icons, keyboard shortcuts, and organize commands by category:
          </p>

          <CodeBlock
            code={`import { Plus, Search, Settings, Download } from 'lucide-react'

const commands: CommandItem[] = [
  // Actions with icons
  {
    id: 'new',
    label: 'New Chat',
    description: 'Start a fresh conversation',
    icon: <Plus className="w-4 h-4" />,
    category: 'Actions',
    shortcut: ['⌘', 'N'],
    onSelect: () => createNewChat(),
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Find messages',
    icon: <Search className="w-4 h-4" />,
    category: 'Actions',
    shortcut: ['⌘', 'F'],
    onSelect: () => openSearch(),
  },

  // Navigation commands
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configure preferences',
    icon: <Settings className="w-4 h-4" />,
    category: 'Navigation',
    shortcut: ['⌘', ','],
    onSelect: () => navigate('/settings'),
  },

  // File operations
  {
    id: 'export',
    label: 'Export Chat',
    description: 'Download as JSON or PDF',
    icon: <Download className="w-4 h-4" />,
    category: 'File',
    onSelect: () => exportChat(),
  },
]`}
            language="typescript"
          />
        </Section>

        {/* Search Functionality */}
        <Section id="search" title="Search Functionality" className="mb-12">
          <p className="text-muted-foreground mb-4">
            The command palette includes built-in fuzzy search that matches
            against command labels, descriptions, and categories:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2">
                Matches Labels
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Type "new" to find "New Chat", "New File", etc.
              </p>
              <code className="text-xs px-2 py-1 rounded bg-muted">
                new → New Chat ✓
              </code>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2">
                Matches Descriptions
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Type "conversation" to find commands with that in description.
              </p>
              <code className="text-xs px-2 py-1 rounded bg-muted">
                conversation → New Chat ✓
              </code>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2">
                Matches Categories
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Type "actions" to see all commands in that category.
              </p>
              <code className="text-xs px-2 py-1 rounded bg-muted">
                actions → Multiple results ✓
              </code>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <h4 className="font-semibold text-foreground mb-2">
                Partial Matching
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Fuzzy matching works with partial words.
              </p>
              <code className="text-xs px-2 py-1 rounded bg-muted">
                msg → Search Messages ✓
              </code>
            </div>
          </div>
        </Section>

        {/* Props API */}
        <Section id="props" title="Props API" className="mb-12">
          <SubSection id="command-palette-props" title="CommandPalette Props">
            <PropsTable props={commandPaletteProps} />
          </SubSection>

          <SubSection id="command-item-props" title="CommandItem Interface">
            <PropsTable props={commandItemProps} />
          </SubSection>
        </Section>

        {/* Keyboard Navigation */}
        <Section id="keyboard-nav" title="Keyboard Navigation" className="mb-12">
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Key
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      ⌘K
                    </kbd>{' '}
                    or{' '}
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      Ctrl+K
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Toggle command palette (with useCommandPalette hook)
                  </td>
                </tr>
                <tr className="border-b border-border/30 bg-muted/10">
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      ↑
                    </kbd>{' '}
                    /{' '}
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      ↓
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Navigate up/down through commands
                  </td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      Enter
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Execute selected command
                  </td>
                </tr>
                <tr className="border-b border-border/30 bg-muted/10">
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      Esc
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Close command palette
                  </td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      Home
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Jump to first command
                  </td>
                </tr>
                <tr className="bg-muted/10">
                  <td className="px-4 py-3">
                    <kbd className="px-2 py-1 text-xs rounded bg-muted border">
                      End
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Jump to last command
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Accessibility */}
        <Section id="accessibility" title="Accessibility" className="mb-12">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              The CommandPalette component is built with accessibility as a
              priority, following WCAG 2.1 AA guidelines:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <Keyboard className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Keyboard Navigation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Full keyboard support with arrow keys, Enter, and Escape.
                    No mouse required.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    ARIA Labels
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Proper ARIA attributes including roles, labels, and
                    activedescendant for screen readers.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Focus Management
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic focus trapping and restoration. Focus returns to
                    trigger on close.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Reduced Motion
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Respects prefers-reduced-motion for users sensitive to
                    animations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Related Components */}
        <Section id="related" title="Related Components" className="mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/reference/components/command-palette-enhanced"
              className="group p-4 rounded-lg border border-border/50 bg-card hover:border-brand-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  CommandPaletteEnhanced
                </h4>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enhanced version with fuzzy search, recent commands, and nested
                navigation
              </p>
            </Link>

            <Link
              href="/reference/components/advanced-message-search"
              className="group p-4 rounded-lg border border-border/50 bg-card hover:border-brand-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  AdvancedMessageSearch
                </h4>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced search with filters and operators for message history
              </p>
            </Link>
          </div>
        </Section>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Link
              href="/reference/components"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Components
            </Link>
            <Link
              href="/reference/components/command-palette-enhanced"
              className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              CommandPaletteEnhanced
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
