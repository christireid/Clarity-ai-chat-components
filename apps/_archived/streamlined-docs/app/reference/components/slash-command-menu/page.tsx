'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap, Search, Package, Code, Settings, FileText, Hash } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ISR caching - revalidate every hour
export const revalidate = 3600

// Demo SlashCommandMenu component
interface SlashCommand {
  name: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  category?: string
  available?: boolean
}

interface DemoSlashCommandMenuProps {
  commands: SlashCommand[]
  isOpen: boolean
  onSelect: (command: SlashCommand) => void
  onClose: () => void
  query?: string
  position?: 'above' | 'below'
  showIcons: boolean
}

function DemoSlashCommandMenu({
  commands,
  isOpen,
  onSelect,
  query = '',
  position = 'above',
  showIcons,
}: DemoSlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands

    const lowerQuery = query.toLowerCase()
    return commands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(lowerQuery) ||
        cmd.description.toLowerCase().includes(lowerQuery)
    )
  }, [commands, query])

  // Reset selection when filtered commands change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCommands])

  // Scroll selected item into view
  React.useEffect(() => {
    if (!menuRef.current) return

    const selectedElement = menuRef.current.querySelector(
      `[data-command-index="${selectedIndex}"]`
    )
    selectedElement?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [selectedIndex])

  // Group commands by category
  const commandsByCategory = React.useMemo(() => {
    const grouped: Record<string, SlashCommand[]> = {}

    filteredCommands.forEach((cmd) => {
      const category = cmd.category || 'General'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(cmd)
    })

    return grouped
  }, [filteredCommands])

  if (filteredCommands.length === 0) {
    return null
  }

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: position === 'above' ? 10 : -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: position === 'above' ? 10 : -10, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      }}
      className={cn(
        'absolute left-0 right-0 z-50',
        'bg-card border border-border rounded-lg shadow-lg',
        'max-h-[280px] overflow-y-auto scrollbar-hide',
        'backdrop-blur-sm bg-opacity-95',
        position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
      )}
      role="listbox"
      aria-label="Available slash commands"
    >
      {/* Header */}
      <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-3 py-2 flex items-center gap-2">
        <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">
          Quick Commands
        </span>
        {query && (
          <span className="text-xs text-muted-foreground ml-auto">
            Filter: "/{query}"
          </span>
        )}
      </div>

      {/* Commands grouped by category */}
      <div className="p-1">
        {Object.entries(commandsByCategory).map(
          ([category, categoryCommands]) => (
            <div key={category}>
              {Object.keys(commandsByCategory).length > 1 && (
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {category}
                </div>
              )}
              {categoryCommands.map((cmd) => {
                const globalIndex = filteredCommands.indexOf(cmd)
                const isSelected = globalIndex === selectedIndex
                const isAvailable = cmd.available !== false

                return (
                  <button
                    key={cmd.name}
                    data-command-index={globalIndex}
                    onClick={() => isAvailable && onSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    disabled={!isAvailable}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                      'text-left transition-colors',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      isSelected
                        ? 'bg-brand-500/10 text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      !isAvailable && 'opacity-50 cursor-not-allowed'
                    )}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={!isAvailable}
                  >
                    {/* Icon */}
                    {showIcons && (
                      <cmd.icon
                        size={16}
                        className={cn(
                          isSelected
                            ? 'text-brand-600 dark:text-brand-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    )}

                    {/* Command name and description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={cn(
                            'font-mono text-sm font-medium',
                            isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-foreground'
                          )}
                        >
                          {cmd.name}
                        </span>
                        {!isAvailable && (
                          <span className="text-xs text-muted-foreground">
                            (unavailable)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {cmd.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="selection-indicator"
                        className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )
        )}
      </div>

      {/* Footer hint */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono text-xs">
            ↑↓
          </kbd>{' '}
          navigate •{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono text-xs">
            Enter
          </kbd>{' '}
          select •{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono text-xs">
            Esc
          </kbd>{' '}
          close
        </p>
      </div>
    </motion.div>
  )
}

export default function SlashCommandMenuPage() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [position, setPosition] = React.useState<'above' | 'below'>('above')
  const [showIcons, setShowIcons] = React.useState(true)
  const [selectedCommand, setSelectedCommand] = React.useState<string | null>(null)
  const [inputValue, setInputValue] = React.useState('')

  // Sample commands
  const commands: SlashCommand[] = [
    {
      name: '/search',
      description: 'Search through documentation and conversations',
      icon: Search,
      category: 'Navigation',
      available: true,
    },
    {
      name: '/code',
      description: 'Generate a code example with syntax highlighting',
      icon: Code,
      category: 'Generation',
      available: true,
    },
    {
      name: '/bundle',
      description: 'Calculate and analyze bundle size metrics',
      icon: Package,
      category: 'Analysis',
      available: true,
    },
    {
      name: '/settings',
      description: 'Open settings and configuration panel',
      icon: Settings,
      category: 'Navigation',
      available: true,
    },
    {
      name: '/docs',
      description: 'Access documentation and guides',
      icon: FileText,
      category: 'Navigation',
      available: true,
    },
    {
      name: '/version',
      description: 'Show version information and changelog',
      icon: Hash,
      category: 'Info',
      available: true,
    },
    {
      name: '/help',
      description: 'Display help and keyboard shortcuts',
      icon: Zap,
      category: 'Info',
      available: true,
    },
  ]

  const handleCommandSelect = (command: SlashCommand) => {
    setSelectedCommand(command.name)
    setInputValue(command.name + ' ')
    setIsOpen(false)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (value.startsWith('/')) {
      setIsOpen(true)
      setQuery(value.slice(1))
    } else {
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">SlashCommandMenu</h1>
              <p className="text-sm text-muted-foreground mt-1">Input Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Command discovery interface for slash commands. Appears when users type "/" in chat input, providing searchable, keyboard-navigable quick actions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Type "/" to open command menu
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={() => inputValue.startsWith('/') && setIsOpen(true)}
                      placeholder="Type / to see commands..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                      aria-label="Chat input"
                      aria-autocomplete="list"
                      aria-controls="slash-command-menu"
                      aria-expanded={isOpen}
                    />
                    {isOpen && (
                      <DemoSlashCommandMenu
                        commands={commands}
                        isOpen={isOpen}
                        onSelect={handleCommandSelect}
                        onClose={() => setIsOpen(false)}
                        query={query}
                        position={position}
                        showIcons={showIcons}
                      />
                    )}
                  </div>
                </div>

                {selectedCommand && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-brand-500/10 border border-brand-500/20"
                  >
                    <p className="text-sm text-foreground">
                      Selected command: <span className="font-mono font-medium text-brand-600 dark:text-brand-400">{selectedCommand}</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Position</label>
                <div className="flex flex-wrap gap-2">
                  {(['above', 'below'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPosition(pos)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        position === pos
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIcons}
                    onChange={(e) => setShowIcons(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Icons</span>
                </label>

                <button
                  onClick={() => {
                    setInputValue('/')
                    setQuery('')
                    setIsOpen(true)
                    setSelectedCommand(null)
                  }}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
                >
                  Reset Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Command Menu</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { SlashCommandMenu } from '@clarity-chat/react'
import { Search, Code, Package } from 'lucide-react'

const commands = [
  { name: '/search', description: 'Search documentation', icon: Search },
  { name: '/code', description: 'Generate code example', icon: Code },
  { name: '/bundle', description: 'Calculate bundle size', icon: Package },
]

function ChatInput() {
  const [input, setInput] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  const handleInputChange = (value: string) => {
    setInput(value)
    setShowMenu(value.startsWith('/'))
  }

  const handleCommandSelect = (command) => {
    setInput(command.name + ' ')
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <input
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <SlashCommandMenu
        commands={commands}
        isOpen={showMenu}
        onSelect={handleCommandSelect}
        onClose={() => setShowMenu(false)}
        query={input.slice(1)}
      />
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Categories</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`const commands = [
  {
    name: '/search',
    description: 'Search documentation',
    icon: Search,
    category: 'Navigation'
  },
  {
    name: '/settings',
    description: 'Open settings',
    icon: Settings,
    category: 'Navigation'
  },
  {
    name: '/code',
    description: 'Generate code',
    icon: Code,
    category: 'Generation'
  },
  {
    name: '/bundle',
    description: 'Analyze bundle',
    icon: Package,
    category: 'Analysis'
  },
]

<SlashCommandMenu
  commands={commands}
  isOpen={isOpen}
  onSelect={handleSelect}
  onClose={handleClose}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Command Registration System</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// commands.ts
export const commandRegistry = {
  search: {
    name: '/search',
    description: 'Search through all conversations',
    icon: Search,
    category: 'Navigation',
    handler: (args: string[]) => {
      // Execute search
      return performSearch(args.join(' '))
    },
  },
  code: {
    name: '/code',
    description: 'Generate code snippet',
    icon: Code,
    category: 'Generation',
    handler: (args: string[]) => {
      // Generate code
      return generateCode(args[0] || 'javascript')
    },
  },
}

// Component usage
function ChatWithCommands() {
  const commands = Object.values(commandRegistry)

  const handleCommandSelect = (command) => {
    const [_, ...args] = input.split(' ')
    const handler = commandRegistry[command.name.slice(1)]?.handler

    if (handler) {
      const result = handler(args)
      // Handle result
    }
  }

  return (
    <SlashCommandMenu
      commands={commands}
      onSelect={handleCommandSelect}
      isOpen={showMenu}
      onClose={() => setShowMenu(false)}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Dynamic Availability</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function DynamicCommands() {
  const { hasActiveConversation } = useChatContext()
  const { canGenerateCode } = usePermissions()

  const commands = [
    {
      name: '/search',
      description: 'Search conversations',
      icon: Search,
      available: hasActiveConversation,
    },
    {
      name: '/code',
      description: 'Generate code',
      icon: Code,
      available: canGenerateCode,
    },
    {
      name: '/help',
      description: 'Show help',
      icon: Zap,
      available: true, // Always available
    },
  ]

  return (
    <SlashCommandMenu
      commands={commands}
      isOpen={isOpen}
      onSelect={handleSelect}
      onClose={handleClose}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>commands</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">SlashCommand[]</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Array of available slash commands</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>isOpen</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Whether the menu is visible</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onSelect</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">(command: SlashCommand) =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when a command is selected</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onClose</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">() =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback to close the menu</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>query</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">''</td>
                  <td className="py-3 px-4 text-muted-foreground">Current search query (text after "/")</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>position</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'above' | 'below'</td>
                  <td className="py-3 px-4 text-muted-foreground">'above'</td>
                  <td className="py-3 px-4 text-muted-foreground">Position relative to input field</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Optional CSS class for custom styling</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">SlashCommand Interface</h3>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>{`interface SlashCommand {
  /** Command name (e.g., "/search") */
  name: string

  /** Human-readable description */
  description: string

  /** Icon component (lucide-react or custom) */
  icon: React.ComponentType<{ size?: number; className?: string }>

  /** Optional category for grouping */
  category?: string

  /** Whether command is currently available */
  available?: boolean
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="font-semibold">Keyboard Navigation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full keyboard support with arrow keys, Enter to select, Esc to close, and Tab navigation
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Fuzzy Filtering</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time filtering as you type, matching both command names and descriptions
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Categorization</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Organize commands into categories for better discoverability and organization
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with ARIA labels, focus management, and reduced motion support
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Dynamic Availability</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Commands can be dynamically enabled/disabled based on context or permissions
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="font-semibold">Smooth Animations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Spring-based animations with automatic reduced motion support for accessibility
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/chat-input"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ChatInput</h3>
              <p className="text-sm text-muted-foreground">Main input component for chat messages</p>
            </Link>

            <Link
              href="/reference/components/command-palette"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">CommandPalette</h3>
              <p className="text-sm text-muted-foreground">Global command palette (Cmd+K)</p>
            </Link>

            <Link
              href="/reference/components/mention-system"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">MentionSystem</h3>
              <p className="text-sm text-muted-foreground">@-mention autocomplete system</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
