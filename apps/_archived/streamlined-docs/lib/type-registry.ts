/**
 * Type Registry for Props Linking
 *
 * Provides type definitions that can be linked from props tables
 * and expanded inline for better developer experience.
 */

export interface TypeDefinition {
  /** URL path to the type reference page */
  href: string
  /** TypeScript type definition as a string */
  definition: string
  /** Brief description of the type */
  description?: string
  /** Related types that are commonly used together */
  relatedTypes?: string[]
}

/**
 * Registry of all documented types
 */
export const typeRegistry: Record<string, TypeDefinition> = {
  // Core Message Types
  Message: {
    href: '/reference/api/types#message',
    description: 'The primary message type used throughout Clarity Chat',
    definition: `interface Message {
  /** Unique identifier for the message */
  id: string
  /** The role of the message sender */
  role: 'user' | 'assistant' | 'system'
  /** Message content - can be string or structured content */
  content: string | ContentPart[]
  /** When the message was created */
  createdAt?: Date
  /** Optional attachments (files, images) */
  attachments?: MessageAttachment[]
  /** Custom metadata */
  metadata?: Record<string, unknown>
  /** For streaming messages */
  isStreaming?: boolean
}`,
    relatedTypes: ['CoreMessage', 'ContentPart', 'MessageAttachment'],
  },

  CoreMessage: {
    href: '/reference/api/types#coremessage',
    description: 'Simplified message format compatible with Vercel AI SDK',
    definition: `type CoreMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}`,
    relatedTypes: ['Message'],
  },

  ContentPart: {
    href: '/reference/api/types#contentpart',
    description: 'Structured content part for multi-modal messages',
    definition: `type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; image: string | URL }
  | { type: 'tool-call'; toolCallId: string; toolName: string; args: unknown }
  | { type: 'tool-result'; toolCallId: string; result: unknown }`,
    relatedTypes: ['Message', 'ToolCall'],
  },

  MessageAttachment: {
    href: '/reference/api/types#messageattachment',
    description: 'File or image attachment for messages',
    definition: `interface MessageAttachment {
  /** Unique identifier */
  id: string
  /** Original filename */
  name: string
  /** MIME type */
  type: string
  /** File size in bytes */
  size: number
  /** URL to access the file */
  url: string
  /** Optional thumbnail for images */
  thumbnail?: string
}`,
    relatedTypes: ['Message'],
  },

  // AI Status Types
  AIStatus: {
    href: '/reference/api/types#aistatus',
    description: 'Current status of AI processing',
    definition: `type AIStatus =
  | 'idle'
  | 'thinking'
  | 'researching'
  | 'generating'
  | 'streaming'
  | 'error'`,
    relatedTypes: ['ThinkingIndicatorProps'],
  },

  // Tool Types
  ToolCall: {
    href: '/reference/api/types#toolcall',
    description: 'A function/tool call made by the AI',
    definition: `interface ToolCall {
  /** Unique identifier for this tool call */
  id: string
  /** Name of the tool being called */
  name: string
  /** Arguments passed to the tool */
  args: Record<string, unknown>
  /** Current status */
  status: 'pending' | 'running' | 'completed' | 'failed'
  /** Result if completed */
  result?: unknown
  /** Error message if failed */
  error?: string
}`,
    relatedTypes: ['ToolResult', 'Tool'],
  },

  ToolResult: {
    href: '/reference/api/types#toolresult',
    description: 'Result returned from a tool execution',
    definition: `interface ToolResult {
  /** ID of the tool call this result is for */
  toolCallId: string
  /** The tool name */
  toolName: string
  /** The result data */
  result: unknown
  /** Whether the tool execution was successful */
  success: boolean
  /** Error message if failed */
  error?: string
}`,
    relatedTypes: ['ToolCall'],
  },

  Tool: {
    href: '/reference/api/types#tool',
    description: 'Tool definition for AI agents',
    definition: `interface Tool {
  /** Unique tool name */
  name: string
  /** Human-readable description */
  description: string
  /** JSON Schema for parameters */
  parameters: Record<string, unknown>
  /** Function to execute the tool */
  execute: (args: Record<string, unknown>) => Promise<unknown>
}`,
    relatedTypes: ['ToolCall', 'ToolResult'],
  },

  // Hook Return Types
  UseClarityChatReturn: {
    href: '/reference/hooks/use-clarity-chat#return-type',
    description: 'Return type of the useClarityChat hook',
    definition: `interface UseClarityChatReturn {
  /** Current messages in the conversation */
  messages: Message[]
  /** Append a new message */
  append: (message: Message | CoreMessage) => Promise<void>
  /** Reload the last assistant message */
  reload: () => Promise<void>
  /** Stop the current generation */
  stop: () => void
  /** Whether currently generating */
  isLoading: boolean
  /** Current error if any */
  error?: Error
  /** Current input value */
  input: string
  /** Set the input value */
  setInput: (input: string) => void
  /** Handle form submission */
  handleSubmit: (e?: React.FormEvent) => void
  /** Memory info if memory is enabled */
  memoryInfo?: MemoryInfo
  /** Token statistics */
  tokenStats?: TokenStats
}`,
    relatedTypes: ['Message', 'MemoryInfo', 'TokenStats'],
  },

  // Theme Types
  Theme: {
    href: '/reference/api/types#theme',
    description: 'Theme configuration object',
    definition: `type Theme = 'light' | 'dark' | 'system'`,
    relatedTypes: ['ThemeConfig'],
  },

  ThemeConfig: {
    href: '/reference/api/types#themeconfig',
    description: 'Full theme configuration',
    definition: `interface ThemeConfig {
  /** Base theme */
  mode: 'light' | 'dark' | 'system'
  /** Primary brand color */
  primaryColor?: string
  /** Border radius scale */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** Font family */
  fontFamily?: string
  /** Custom CSS variables */
  cssVariables?: Record<string, string>
}`,
    relatedTypes: ['Theme'],
  },

  // Memory Types
  MemoryInfo: {
    href: '/reference/api/types#memoryinfo',
    description: 'Information about the memory system state',
    definition: `interface MemoryInfo {
  /** Whether memory is enabled */
  enabled: boolean
  /** Current memory strategy */
  strategy: 'buffer' | 'summary' | 'vector'
  /** Number of items in memory */
  itemCount: number
  /** Total tokens used by memory */
  tokenCount: number
  /** Maximum allowed tokens */
  maxTokens: number
}`,
    relatedTypes: ['ClarityMemoryOptions'],
  },

  ClarityMemoryOptions: {
    href: '/reference/api/types#claritymemoryoptions',
    description: 'Configuration options for memory',
    definition: `interface ClarityMemoryOptions {
  /** Enable memory */
  enabled: boolean
  /** Memory strategy */
  strategy?: 'buffer' | 'summary' | 'vector'
  /** Maximum tokens for memory */
  maxTokens?: number
  /** Custom memory store */
  store?: MemoryStore
}`,
    relatedTypes: ['MemoryInfo'],
  },

  // Token Types
  TokenStats: {
    href: '/reference/api/types#tokenstats',
    description: 'Token usage statistics',
    definition: `interface TokenStats {
  /** Total tokens used */
  totalTokens: number
  /** Input/prompt tokens */
  inputTokens: number
  /** Output/completion tokens */
  outputTokens: number
  /** Estimated cost in USD */
  estimatedCost?: number
  /** Context window utilization (0-1) */
  utilization: number
}`,
    relatedTypes: ['TokenTrackerOptions'],
  },

  // Common React Types
  ReactNode: {
    href: 'https://react.dev/reference/react/ReactNode',
    description: 'Any valid React child',
    definition: `type ReactNode =
  | React.ReactElement
  | string
  | number
  | boolean
  | null
  | undefined
  | Iterable<ReactNode>`,
  },

  CSSProperties: {
    href: 'https://react.dev/reference/react-dom/components/common#applying-css-styles',
    description: 'CSS style object for inline styles',
    definition: `type CSSProperties = {
  [key: string]: string | number | undefined
}`,
  },

  // Common Callback Types
  'onSend': {
    href: '/reference/api/types#onsend',
    description: 'Callback when a message is sent',
    definition: `type OnSend = (message: string) => void | Promise<void>`,
    relatedTypes: ['Message'],
  },

  'onError': {
    href: '/reference/api/types#onerror',
    description: 'Callback when an error occurs',
    definition: `type OnError = (error: Error) => void`,
  },
}

/**
 * Gets the documentation link for a type
 * Handles array types (e.g., "Message[]") and generic types
 */
export function getTypeLink(typeName: string): string | undefined {
  // Handle array types
  const baseType = typeName.replace(/\[\]$/, '').trim()

  // Handle generic types like Promise<T>
  const genericMatch = baseType.match(/^(\w+)</)
  if (genericMatch) {
    const genericBase = genericMatch[1]
    return typeRegistry[genericBase]?.href
  }

  // Handle union types - just link to the first type
  if (baseType.includes(' | ')) {
    const firstType = baseType.split(' | ')[0].trim()
    return typeRegistry[firstType]?.href
  }

  return typeRegistry[baseType]?.href
}

/**
 * Gets the type definition for inline expansion
 */
export function getTypeDefinition(typeName: string): string | undefined {
  const baseType = typeName.replace(/\[\]$/, '').trim()
  return typeRegistry[baseType]?.definition
}

/**
 * Gets the type description
 */
export function getTypeDescription(typeName: string): string | undefined {
  const baseType = typeName.replace(/\[\]$/, '').trim()
  return typeRegistry[baseType]?.description
}

/**
 * Gets related types for a given type
 */
export function getRelatedTypes(typeName: string): string[] {
  const baseType = typeName.replace(/\[\]$/, '').trim()
  return typeRegistry[baseType]?.relatedTypes || []
}

/**
 * Checks if a type is documented in the registry
 */
export function isTypeDocumented(typeName: string): boolean {
  const baseType = typeName.replace(/\[\]$/, '').trim()
  return baseType in typeRegistry
}

/**
 * Gets all documented types (for generating type reference pages)
 */
export function getAllDocumentedTypes(): string[] {
  return Object.keys(typeRegistry)
}
