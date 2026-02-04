/**
 * CommandPalette Type Definitions
 *
 * @packageDocumentation
 * @module @clarity-chat/react/components/navigation
 * @version 1.0.0
 *
 * Comprehensive type definitions for the CommandPalette component.
 * Includes all props, interfaces, event handlers, and utility types.
 */

import * as React from 'react'

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Represents a single command item in the command palette.
 *
 * @example
 * ```tsx
 * const commandItem: CommandItem = {
 *   id: 'new-chat',
 *   label: 'New Chat',
 *   description: 'Start a new conversation',
 *   icon: <PlusIcon className="w-5 h-5" />,
 *   shortcut: ['⌘', 'N'],
 *   category: 'Chat',
 *   onSelect: () => createNewChat(),
 * }
 * ```
 */
export interface CommandItem {
  /**
   * Unique identifier for the command.
   * Must be unique across all commands in the palette.
   *
   * @example 'new-chat', 'open-settings', 'export-conversation'
   */
  id: string

  /**
   * Display label for the command.
   * Shown as the primary text for the command item.
   *
   * @example 'New Chat', 'Open Settings', 'Export Conversation'
   */
  label: string

  /**
   * Optional description shown below the label.
   * Provides additional context about what the command does.
   *
   * @example 'Start a new conversation', 'Configure application settings'
   */
  description?: string

  /**
   * Optional icon element displayed before the label.
   * Can be any React node, typically an SVG icon component.
   *
   * @example <PlusIcon className="w-5 h-5" />
   * @example <img src="/icons/chat.svg" alt="" />
   */
  icon?: React.ReactNode

  /**
   * Optional keyboard shortcut keys.
   * Displayed as keyboard buttons on the right side of the command.
   * Note: The shortcut handler must be implemented separately.
   *
   * @example ['⌘', 'K'] for Cmd+K
   * @example ['Ctrl', 'Shift', 'P'] for Ctrl+Shift+P
   */
  shortcut?: string[]

  /**
   * Optional category for grouping commands.
   * Commands with the same category are grouped together in the palette.
   *
   * @default 'Commands'
   * @example 'Chat', 'Settings', 'Navigation', 'AI'
   */
  category?: string

  /**
   * Callback executed when the command is selected.
   * Called when user clicks the command or presses Enter while it's highlighted.
   * The palette automatically closes after this callback completes.
   *
   * @example
   * ```tsx
   * onSelect: () => {
   *   createNewChat()
   *   // Palette closes automatically
   * }
   * ```
   *
   * @example
   * ```tsx
   * onSelect: async () => {
   *   try {
   *     await saveChanges()
   *     toast.success('Changes saved')
   *   } catch (error) {
   *     toast.error('Failed to save')
   *   }
   * }
   * ```
   */
  onSelect: () => void | Promise<void>
}

/**
 * Token usage statistics for AI operations.
 * Used within AIContext to display token consumption.
 */
export interface TokenUsage {
  /**
   * Number of input tokens consumed.
   * Represents tokens from user messages and system prompts.
   */
  input?: number

  /**
   * Number of output tokens generated.
   * Represents tokens in AI responses.
   */
  output?: number

  /**
   * Total tokens used (input + output).
   * Useful for quick reference and billing calculations.
   */
  total?: number
}

/**
 * AI-specific context information displayed in the command palette footer.
 * Provides visibility into the current AI conversation state.
 *
 * @example
 * ```tsx
 * const aiContext: AIContext = {
 *   modelName: 'Claude 3.5 Sonnet',
 *   conversationId: 'conv-abc123',
 *   tokenUsage: {
 *     input: 1250,
 *     output: 850,
 *     total: 2100,
 *   },
 *   metadata: {
 *     temperature: 0.7,
 *     maxTokens: 4096,
 *   },
 * }
 * ```
 */
export interface AIContext {
  /**
   * Current AI model name.
   * Displayed with a computer icon in the footer.
   *
   * @example 'Claude 3.5 Sonnet', 'GPT-4', 'Llama 2'
   */
  modelName?: string

  /**
   * Active conversation ID.
   * Displayed with a chat icon in the footer.
   * Truncated to 120px max width.
   *
   * @example 'conv-abc123', 'session-xyz789'
   */
  conversationId?: string

  /**
   * Token usage statistics.
   * When provided, displays total token count with a tag icon.
   *
   * @see TokenUsage
   */
  tokenUsage?: TokenUsage

  /**
   * Additional metadata key-value pairs.
   * Can include any relevant information about the AI session.
   *
   * @example
   * ```tsx
   * metadata: {
   *   temperature: 0.7,
   *   maxTokens: 4096,
   *   topP: 0.9,
   * }
   * ```
   */
  metadata?: Record<string, string | number>
}

/**
 * Props for the CommandPalette component.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   items={commands}
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   placeholder="Type a command..."
 *   loading={isLoading}
 *   aria-label="Command palette"
 *   aiContext={aiContext}
 * />
 * ```
 */
export interface CommandPaletteProps {
  /**
   * Array of command items to display in the palette.
   * Commands are filtered based on search input and grouped by category.
   *
   * @remarks
   * - Maximum recommended: 100 items for optimal performance
   * - For more items, consider implementing virtual scrolling
   * - Items can be dynamically generated based on application state
   *
   * @example
   * ```tsx
   * const items: CommandItem[] = [
   *   {
   *     id: 'new-chat',
   *     label: 'New Chat',
   *     category: 'Chat',
   *     onSelect: () => createChat(),
   *   },
   *   {
   *     id: 'settings',
   *     label: 'Settings',
   *     category: 'System',
   *     onSelect: () => openSettings(),
   *   },
   * ]
   * ```
   */
  items: CommandItem[]

  /**
   * Whether the command palette is open/visible.
   * Controls the visibility and mounting of the palette.
   *
   * @remarks
   * - When true, palette is rendered and visible
   * - When false, palette is unmounted
   * - Changes trigger open/close animations
   * - Body scroll is locked when open
   *
   * @example
   * ```tsx
   * const [open, setOpen] = useState(false)
   *
   * // Open with keyboard shortcut
   * useEffect(() => {
   *   const handleKeyDown = (e: KeyboardEvent) => {
   *     if (e.metaKey && e.key === 'k') {
   *       e.preventDefault()
   *       setOpen(true)
   *     }
   *   }
   *   window.addEventListener('keydown', handleKeyDown)
   *   return () => window.removeEventListener('keydown', handleKeyDown)
   * }, [])
   * ```
   */
  open: boolean

  /**
   * Callback invoked when the palette should close.
   * Called when user presses Escape, clicks backdrop, or selects a command.
   *
   * @remarks
   * - Always called after command's onSelect completes
   * - Should set the open prop to false
   * - Can perform additional cleanup
   *
   * @example
   * ```tsx
   * onClose={() => {
   *   setOpen(false)
   *   // Optional: Clear search query or reset state
   *   setSearchQuery('')
   * }}
   * ```
   */
  onClose: () => void

  /**
   * Placeholder text for the search input.
   * Shown when input is empty.
   *
   * @default 'Type a command...'
   *
   * @example 'Search commands...', 'What would you like to do?'
   */
  placeholder?: string

  /**
   * Additional CSS classes applied to the dialog container.
   * Useful for customizing positioning, sizing, or appearance.
   *
   * @remarks
   * - Uses `cn()` utility for class merging
   * - Can override default styles
   * - Tailwind classes are supported
   *
   * @example
   * ```tsx
   * className="max-w-3xl top-[10%] bg-gray-900"
   * ```
   */
  className?: string

  /**
   * Show loading spinner during async operations.
   * When true, displays a spinning loader icon instead of the search icon.
   * Also sets aria-busy="true" for screen readers.
   *
   * @default false
   *
   * @example
   * ```tsx
   * const { data: commands, isLoading } = useQuery({
   *   queryKey: ['commands'],
   *   queryFn: fetchCommands,
   * })
   *
   * <CommandPalette
   *   items={commands ?? []}
   *   loading={isLoading}
   *   open={open}
   *   onClose={() => setOpen(false)}
   * />
   * ```
   */
  loading?: boolean

  /**
   * Accessible label for the command palette dialog.
   * Used by screen readers to announce the dialog purpose.
   *
   * @default 'Command palette'
   *
   * @example 'Quick actions menu', 'AI command palette', 'Navigation menu'
   */
  'aria-label'?: string

  /**
   * AI context information to display in the footer.
   * Shows model name, conversation ID, token usage, and metadata.
   *
   * @see AIContext
   *
   * @example
   * ```tsx
   * aiContext={{
   *   modelName: 'Claude 3.5 Sonnet',
   *   conversationId: 'conv-abc123',
   *   tokenUsage: { total: 2100 },
   * }}
   * ```
   */
  aiContext?: AIContext

  /**
   * Ref forwarded to the dialog element.
   * Useful for imperatively controlling the dialog or measuring its size.
   *
   * @example
   * ```tsx
   * const dialogRef = useRef<HTMLDivElement>(null)
   *
   * <CommandPalette
   *   ref={dialogRef}
   *   items={commands}
   *   open={open}
   *   onClose={() => setOpen(false)}
   * />
   * ```
   */
  ref?: React.Ref<HTMLDivElement>
}

// ============================================================================
// Component Export
// ============================================================================

/**
 * CommandPalette component.
 *
 * A fully accessible command palette with keyboard navigation, search filtering,
 * and AI context display. Implements WCAG 2.1 AA standards with combobox and
 * listbox ARIA patterns.
 *
 * @remarks
 * ### Features
 * - Full keyboard navigation (Arrow keys, Home, End, Enter, Escape)
 * - Search filtering across labels, descriptions, and categories
 * - Category grouping with staggered animations
 * - AI context display in footer
 * - Focus trap and restoration
 * - Body scroll lock when open
 * - Reduced motion support
 * - Portal rendering for proper z-index layering
 *
 * ### Accessibility
 * - Implements combobox ARIA pattern for search input
 * - Implements listbox ARIA pattern for results
 * - Full keyboard navigation support
 * - Screen reader announcements for result count
 * - Focus indicators on all interactive elements
 * - Respects prefers-reduced-motion
 *
 * ### Performance
 * - Debounced search (150ms)
 * - Memoized filtering and grouping
 * - Portal rendering
 * - Recommended max: 100 items
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { CommandPalette } from '@clarity-chat/react'
 *
 * function App() {
 *   const [open, setOpen] = useState(false)
 *
 *   const commands = [
 *     {
 *       id: 'new-chat',
 *       label: 'New Chat',
 *       description: 'Start a new conversation',
 *       category: 'Chat',
 *       onSelect: () => createNewChat(),
 *     },
 *   ]
 *
 *   return (
 *     <CommandPalette
 *       items={commands}
 *       open={open}
 *       onClose={() => setOpen(false)}
 *     />
 *   )
 * }
 * ```
 *
 * @param props - Component props
 * @returns JSX.Element
 *
 * @see {@link CommandPaletteProps}
 * @see {@link CommandItem}
 * @see {@link AIContext}
 *
 * @public
 */
export declare const CommandPalette: React.FC<CommandPaletteProps>

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract the ID type from CommandItem.
 * Useful for type-safe command ID references.
 *
 * @example
 * ```tsx
 * const commandId: CommandId = 'new-chat'
 * const command = commands.find(c => c.id === commandId)
 * ```
 */
export type CommandId = CommandItem['id']

/**
 * Extract the category type from CommandItem.
 * Useful for type-safe category references.
 *
 * @example
 * ```tsx
 * const category: CommandCategory = 'Chat'
 * const chatCommands = commands.filter(c => c.category === category)
 * ```
 */
export type CommandCategory = CommandItem['category']

/**
 * Type guard to check if a value is a valid CommandItem.
 *
 * @param value - Value to check
 * @returns True if value is a CommandItem
 *
 * @example
 * ```tsx
 * if (isCommandItem(value)) {
 *   console.log(value.label)
 * }
 * ```
 */
export function isCommandItem(value: unknown): value is CommandItem

/**
 * Type for command selection handler.
 * Useful for defining command handler functions.
 *
 * @example
 * ```tsx
 * const handleNewChat: CommandHandler = () => {
 *   createNewChat()
 *   analytics.track('new_chat_created')
 * }
 *
 * const command: CommandItem = {
 *   id: 'new-chat',
 *   label: 'New Chat',
 *   onSelect: handleNewChat,
 * }
 * ```
 */
export type CommandHandler = () => void | Promise<void>

/**
 * Type for async command selection handler.
 * Explicitly types async command handlers.
 *
 * @example
 * ```tsx
 * const handleSave: AsyncCommandHandler = async () => {
 *   await saveChanges()
 *   toast.success('Saved')
 * }
 * ```
 */
export type AsyncCommandHandler = () => Promise<void>

/**
 * Grouped commands by category.
 * Internal type used for rendering grouped commands.
 *
 * @example
 * ```tsx
 * const grouped: GroupedCommands = {
 *   Chat: [chatCommand1, chatCommand2],
 *   System: [settingsCommand],
 * }
 * ```
 */
export type GroupedCommands = Record<string, CommandItem[]>

/**
 * Keyboard event keys supported by the command palette.
 *
 * @example
 * ```tsx
 * const key: CommandPaletteKey = 'Escape'
 * ```
 */
export type CommandPaletteKey =
  | 'Escape'
  | 'ArrowDown'
  | 'ArrowUp'
  | 'Home'
  | 'End'
  | 'Enter'
  | 'Tab'

/**
 * Command palette state.
 * Useful for managing palette state externally.
 *
 * @example
 * ```tsx
 * const [state, setState] = useState<CommandPaletteState>({
 *   open: false,
 *   search: '',
 *   selectedIndex: 0,
 * })
 * ```
 */
export interface CommandPaletteState {
  open: boolean
  search: string
  selectedIndex: number
}

/**
 * Hook return type for command palette state management.
 *
 * @example
 * ```tsx
 * function useCommandPalette(): UseCommandPaletteReturn {
 *   const [open, setOpen] = useState(false)
 *   const toggle = () => setOpen(prev => !prev)
 *   return { open, setOpen, toggle }
 * }
 * ```
 */
export interface UseCommandPaletteReturn {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default placeholder text.
 */
export declare const DEFAULT_PLACEHOLDER: 'Type a command...'

/**
 * Default aria-label.
 */
export declare const DEFAULT_ARIA_LABEL: 'Command palette'

/**
 * Default debounce delay for search input (milliseconds).
 */
export declare const SEARCH_DEBOUNCE_MS: 150

/**
 * Default category name for uncategorized commands.
 */
export declare const DEFAULT_CATEGORY: 'Commands'

// ============================================================================
// Display Name
// ============================================================================

/**
 * Display name for React DevTools.
 */
export declare const DISPLAY_NAME: 'CommandPalette'
