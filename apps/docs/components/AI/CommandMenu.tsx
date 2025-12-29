'use client'

/**
 * CommandMenu - Inline command palette for the docs assistant
 *
 * Shows a menu when the user types:
 * - `/` for slash commands (actions)
 * - `@` for mentions (component/hook lookups)
 *
 * Features:
 * - Keyboard navigation (up/down arrows, enter, escape)
 * - Filtering as user types
 * - Grouped commands by category
 * - Accessible with ARIA attributes
 */

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  Trash2,
  Download,
  GitBranch,
  Code,
  BarChart3,
  Box,
  Zap,
  Layers,
  MessageSquare,
  BookOpen,
  Settings,
  Search,
  Terminal,
} from 'lucide-react'
import { useReducedMotion } from '@clarity-chat/react/internal'
import { cn } from '@/lib/utils'
import { fadeIn, fadeInUp } from '@/lib/animations'

// ============================================================================
// Types
// ============================================================================

export interface Command {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  category: 'Actions' | 'Components' | 'Hooks' | 'Guides'
  action: string // The text to insert or action to perform
  type: 'slash' | 'mention'
}

export interface CommandMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (command: Command) => void
  filter: string
  triggerType: '/' | '@' | null
  position?: { top: number; left: number }
  inputRef?: React.RefObject<HTMLTextAreaElement>
}

// ============================================================================
// Command Definitions
// ============================================================================

// Slash commands - actions
const SLASH_COMMANDS: Command[] = [
  {
    id: 'help',
    label: 'help',
    description: 'Show what I can help you with',
    icon: <HelpCircle className="w-4 h-4" />,
    category: 'Actions',
    action:
      'What can you help me with? Show me what features and capabilities you have.',
    type: 'slash',
  },
  {
    id: 'clear',
    label: 'clear',
    description: 'Clear conversation history',
    icon: <Trash2 className="w-4 h-4" />,
    category: 'Actions',
    action: '__CLEAR__',
    type: 'slash',
  },
  {
    id: 'export',
    label: 'export',
    description: 'Export this conversation',
    icon: <Download className="w-4 h-4" />,
    category: 'Actions',
    action: '__EXPORT__',
    type: 'slash',
  },
  {
    id: 'diagram',
    label: 'diagram',
    description: 'Request a visual diagram explanation',
    icon: <GitBranch className="w-4 h-4" />,
    category: 'Actions',
    action: 'Please create a diagram to explain ',
    type: 'slash',
  },
  {
    id: 'example',
    label: 'example',
    description: 'Request a code example',
    icon: <Code className="w-4 h-4" />,
    category: 'Actions',
    action: 'Please show me a code example for ',
    type: 'slash',
  },
  {
    id: 'compare',
    label: 'compare',
    description: 'Compare components or approaches',
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'Actions',
    action: 'Please compare ',
    type: 'slash',
  },
  {
    id: 'bundle',
    label: 'bundle',
    description: 'Check bundle size impact',
    icon: <Layers className="w-4 h-4" />,
    category: 'Actions',
    action: 'What is the bundle size impact of using ',
    type: 'slash',
  },
  {
    id: 'quickstart',
    label: 'quickstart',
    description: 'Get started quickly with Clarity Chat',
    icon: <Zap className="w-4 h-4" />,
    category: 'Actions',
    action:
      'How do I get started with Clarity Chat? Give me a quickstart guide.',
    type: 'slash',
  },
]

// @ mention commands - component/hook lookups
const MENTION_COMMANDS: Command[] = [
  // Core Components
  {
    id: 'ChatWindow',
    label: 'ChatWindow',
    description: 'Main chat window container',
    icon: <MessageSquare className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the ChatWindow component. What are its props and how do I use it?',
    type: 'mention',
  },
  {
    id: 'ChatInput',
    label: 'ChatInput',
    description: 'Chat text input component',
    icon: <Terminal className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the ChatInput component. What are its props and how do I use it?',
    type: 'mention',
  },
  {
    id: 'MessageList',
    label: 'MessageList',
    description: 'Scrollable message list',
    icon: <Layers className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the MessageList component. What are its props and how do I use it?',
    type: 'mention',
  },
  {
    id: 'MessageBubble',
    label: 'MessageBubble',
    description: 'Individual message display',
    icon: <Box className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the MessageBubble component. What are its props and how do I use it?',
    type: 'mention',
  },
  {
    id: 'TypingIndicator',
    label: 'TypingIndicator',
    description: 'AI is typing animation',
    icon: <Settings className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the TypingIndicator component. What are its props and how do I use it?',
    type: 'mention',
  },
  {
    id: 'EmptyState',
    label: 'EmptyState',
    description: 'Empty chat placeholder',
    icon: <Box className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the EmptyState component. What are its props and how do I use it?',
    type: 'mention',
  },
  {
    id: 'CommandPalette',
    label: 'CommandPalette',
    description: 'Keyboard command interface',
    icon: <Search className="w-4 h-4" />,
    category: 'Components',
    action:
      'Tell me about the CommandPalette component. What are its props and how do I use it?',
    type: 'mention',
  },
  // Hooks
  {
    id: 'useChat',
    label: 'useChat',
    description: 'Main chat state management',
    icon: <Zap className="w-4 h-4" />,
    category: 'Hooks',
    action:
      'Tell me about the useChat hook. What are its parameters, return values, and how do I use it?',
    type: 'mention',
  },
  {
    id: 'useStreaming',
    label: 'useStreaming',
    description: 'Handle streaming responses',
    icon: <Zap className="w-4 h-4" />,
    category: 'Hooks',
    action:
      'Tell me about the useStreaming hook. What are its parameters and return values?',
    type: 'mention',
  },
  {
    id: 'useMessageList',
    label: 'useMessageList',
    description: 'Message list state and scrolling',
    icon: <Zap className="w-4 h-4" />,
    category: 'Hooks',
    action:
      'Tell me about the useMessageList hook. What does it do and how do I use it?',
    type: 'mention',
  },
  {
    id: 'useTokenTracker',
    label: 'useTokenTracker',
    description: 'Track token usage and costs',
    icon: <BarChart3 className="w-4 h-4" />,
    category: 'Hooks',
    action:
      'Tell me about the useTokenTracker hook. How do I track token usage?',
    type: 'mention',
  },
  {
    id: 'useClipboard',
    label: 'useClipboard',
    description: 'Copy to clipboard utility',
    icon: <Zap className="w-4 h-4" />,
    category: 'Hooks',
    action:
      'Tell me about the useClipboard hook. How do I copy text to clipboard?',
    type: 'mention',
  },
  {
    id: 'useKeyboardShortcuts',
    label: 'useKeyboardShortcuts',
    description: 'Keyboard shortcut handling',
    icon: <Zap className="w-4 h-4" />,
    category: 'Hooks',
    action:
      'Tell me about the useKeyboardShortcuts hook. How do I add keyboard shortcuts?',
    type: 'mention',
  },
  // Guides
  {
    id: 'getting-started',
    label: 'Getting Started',
    description: 'Installation and setup guide',
    icon: <BookOpen className="w-4 h-4" />,
    category: 'Guides',
    action:
      'How do I get started with Clarity Chat? Show me the installation and basic setup.',
    type: 'mention',
  },
  {
    id: 'streaming',
    label: 'Streaming Guide',
    description: 'Implement streaming responses',
    icon: <BookOpen className="w-4 h-4" />,
    category: 'Guides',
    action:
      'How do I implement streaming responses in my chat? Show me the streaming guide.',
    type: 'mention',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    description: 'Accessibility best practices',
    icon: <BookOpen className="w-4 h-4" />,
    category: 'Guides',
    action:
      'What accessibility features does Clarity Chat have? Show me the accessibility guide.',
    type: 'mention',
  },
]

// ============================================================================
// Animation Variants
// ============================================================================

// Use fadeInUp for menu animation (slides up), fadeIn for reduced motion
const menuVariants = fadeInUp
const menuVariantsReduced = fadeIn

// ============================================================================
// CommandMenu Component
// ============================================================================

export const CommandMenu = memo(function CommandMenu({
  isOpen,
  onClose,
  onSelect,
  filter,
  triggerType,
  position,
}: CommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const selectedItemRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Get the appropriate commands based on trigger type
  const allCommands = useMemo(() => {
    if (triggerType === '/') return SLASH_COMMANDS
    if (triggerType === '@') return MENTION_COMMANDS
    return []
  }, [triggerType])

  // Filter commands based on user input
  const filteredCommands = useMemo(() => {
    if (!filter) return allCommands

    const query = filter.toLowerCase()
    return allCommands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query)
    )
  }, [allCommands, filter])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [filter])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          e.stopPropagation()
          setSelectedIndex((prev) =>
            filteredCommands.length > 0
              ? (prev + 1) % filteredCommands.length
              : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          e.stopPropagation()
          setSelectedIndex((prev) =>
            filteredCommands.length > 0
              ? (prev - 1 + filteredCommands.length) % filteredCommands.length
              : 0
          )
          break
        case 'Enter':
          e.preventDefault()
          e.stopPropagation()
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          e.stopPropagation()
          onClose()
          break
        case 'Tab':
          e.preventDefault()
          e.stopPropagation()
          if (e.shiftKey) {
            setSelectedIndex((prev) =>
              filteredCommands.length > 0
                ? (prev - 1 + filteredCommands.length) % filteredCommands.length
                : 0
            )
          } else {
            setSelectedIndex((prev) =>
              filteredCommands.length > 0
                ? (prev + 1) % filteredCommands.length
                : 0
            )
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, filteredCommands, selectedIndex, onSelect, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const variants = prefersReducedMotion ? menuVariantsReduced : menuVariants

  if (!isOpen || filteredCommands.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        role="listbox"
        aria-label={
          triggerType === '/' ? 'Slash commands' : 'Mention suggestions'
        }
        className={cn(
          'absolute z-50 w-72 max-h-64 overflow-y-auto',
          'bg-popover border border-border rounded-lg shadow-lg',
          'backdrop-blur-sm'
        )}
        style={{
          bottom: position?.top !== undefined ? `calc(100% + 8px)` : 'auto',
          left: position?.left ?? 0,
        }}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b border-border/50 bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground">
            {triggerType === '/'
              ? 'Commands'
              : 'Mention a component, hook, or guide'}
          </p>
        </div>

        {/* Commands list */}
        <div className="p-1">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} role="group" aria-label={category}>
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </div>
              {commands.map((cmd) => {
                const globalIndex = filteredCommands.indexOf(cmd)
                const isSelected = globalIndex === selectedIndex

                return (
                  <button
                    key={cmd.id}
                    ref={isSelected ? selectedItemRef : null}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left',
                      'transition-colors duration-75',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                  >
                    <span
                      className={cn(
                        'flex-shrink-0',
                        isSelected
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {cmd.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm truncate">
                          {triggerType}
                          {cmd.label}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'text-xs truncate',
                          isSelected
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {cmd.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-3 py-1.5 border-t border-border/50 bg-muted/30">
          <p className="text-[10px] text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 text-[9px] font-mono bg-background border border-border rounded">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 text-[9px] font-mono bg-background border border-border rounded">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 text-[9px] font-mono bg-background border border-border rounded">
                esc
              </kbd>
              close
            </span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

// ============================================================================
// Hook: useSlashCommands
// ============================================================================

export interface UseSlashCommandsOptions {
  onClear?: () => void
  onExport?: () => void
}

export interface UseSlashCommandsReturn {
  isMenuOpen: boolean
  triggerType: '/' | '@' | null
  filter: string
  menuPosition: { top: number; left: number }
  handleInputChange: (value: string, cursorPosition?: number) => void
  handleCommandSelect: (command: Command) => string | null
  closeMenu: () => void
}

export function useSlashCommands(
  options: UseSlashCommandsOptions = {}
): UseSlashCommandsReturn {
  const { onClear, onExport } = options

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [triggerType, setTriggerType] = useState<'/' | '@' | null>(null)
  const [filter, setFilter] = useState('')
  const [menuPosition] = useState({ top: 0, left: 0 })

  const handleInputChange = useCallback(
    (value: string, cursorPosition?: number) => {
      const cursor = cursorPosition ?? value.length

      // Find if we're in a command context
      // Look backwards from cursor for / or @ at start of line or after whitespace
      let foundTrigger: '/' | '@' | null = null
      let commandFilter = ''

      for (let i = cursor - 1; i >= 0; i--) {
        const char = value[i]

        // Check if we've hit whitespace or start
        if (char === ' ' || char === '\n') {
          break
        }

        // Check for trigger at start of word
        if (char === '/' || char === '@') {
          // Verify it's at start of input or after whitespace
          if (i === 0 || value[i - 1] === ' ' || value[i - 1] === '\n') {
            foundTrigger = char as '/' | '@'
            commandFilter = value.slice(i + 1, cursor)
            break
          }
        }
      }

      if (foundTrigger) {
        setIsMenuOpen(true)
        setTriggerType(foundTrigger)
        setFilter(commandFilter)
      } else {
        setIsMenuOpen(false)
        setTriggerType(null)
        setFilter('')
      }
    },
    []
  )

  const handleCommandSelect = useCallback(
    (command: Command): string | null => {
      setIsMenuOpen(false)
      setTriggerType(null)
      setFilter('')

      // Handle special actions
      if (command.action === '__CLEAR__') {
        onClear?.()
        return null // Return null to indicate no text to insert
      }

      if (command.action === '__EXPORT__') {
        onExport?.()
        return null
      }

      // Return the action text to be inserted
      return command.action
    },
    [onClear, onExport]
  )

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setTriggerType(null)
    setFilter('')
  }, [])

  return {
    isMenuOpen,
    triggerType,
    filter,
    menuPosition,
    handleInputChange,
    handleCommandSelect,
    closeMenu,
  }
}

// Export command data for external use
export { SLASH_COMMANDS, MENTION_COMMANDS }
