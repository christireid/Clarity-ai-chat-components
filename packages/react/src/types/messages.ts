/**
 * Message Type System for Clarity Chat
 *
 * Implements the UIMessage/ModelMessage separation pattern from Vercel AI SDK 5.
 * This separation provides:
 * - Cleaner streaming state management
 * - Simplified persistence (save UIMessage)
 * - Better separation of UI and model concerns
 *
 * @see https://ai-sdk.dev for the pattern this is based on
 */

// =============================================================================
// UI MESSAGE PARTS (Rich content for UI rendering)
// =============================================================================

/** Text content part for UI rendering */
export interface UITextPart {
  type: 'text'
  text: string
}

/** Image content part for UI rendering */
export interface UIImagePart {
  type: 'image'
  url: string
  alt?: string
}

/** Tool invocation part with UI state */
export interface UIToolCallPart {
  type: `tool-${string}`
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  state: 'partial-call' | 'call' | 'result'
  result?: unknown
}

/** Code block part for UI rendering */
export interface UICodePart {
  type: 'code'
  code: string
  language?: string
}

/** Thinking/reasoning indicator part */
export interface UIThinkingPart {
  type: 'thinking'
  content: string
}

/** Citation/source reference part */
export interface UICitationPart {
  type: 'citation'
  sourceId: string
  title: string
  url?: string
}

/** Union of all UI message part types */
export type UIMessagePart =
  | UITextPart
  | UIImagePart
  | UIToolCallPart
  | UICodePart
  | UIThinkingPart
  | UICitationPart

// =============================================================================
// UI MESSAGE (For UI rendering and persistence)
// =============================================================================

/** Metadata associated with a UI message */
export interface UIMessageMetadata {
  /** Token count for this message */
  tokenCount?: number
  /** Time taken to generate (ms) */
  latency?: number
  /** Model used to generate this message */
  model?: string
  /** Provider used (openai, anthropic, etc.) */
  provider?: string
  /** Cost estimate for this message */
  estimatedCost?: number
  /** Custom metadata */
  [key: string]: unknown
}

/**
 * UIMessage - For UI rendering and persistence
 *
 * Contains all data needed to render a message in the UI,
 * including streaming state, branching info, and rich metadata.
 */
export interface UIMessage {
  /** Unique identifier for this message */
  id: string
  /** Message role */
  role: 'user' | 'assistant' | 'system'
  /** Rich content parts for UI rendering */
  parts: UIMessagePart[]
  /** When the message was created */
  createdAt: Date
  /** Optional metadata */
  metadata?: UIMessageMetadata

  // UI-specific fields (not sent to models)

  /** Whether this message is currently streaming */
  isStreaming?: boolean
  /** IDs of branch messages (for conversation branching) */
  branches?: string[]
  /** Parent message ID (null for first message in thread) */
  parentId?: string | null
  /** Whether this message has been edited */
  isEdited?: boolean
  /** Original content before editing */
  originalParts?: UIMessagePart[]
}

// =============================================================================
// MODEL MESSAGE (For sending to LLMs)
// =============================================================================

/** Text content for model consumption */
export interface ModelTextContent {
  type: 'text'
  text: string
}

/** Image content for model consumption */
export interface ModelImageContent {
  type: 'image'
  url: string
}

/** Tool result content for model consumption */
export interface ModelToolResultContent {
  type: 'tool_result'
  tool_use_id: string
  content: string | Array<{ type: 'text'; text: string }>
}

/** Union of model content types */
export type ModelContentPart =
  | ModelTextContent
  | ModelImageContent
  | ModelToolResultContent

/**
 * ModelMessage - For sending to LLMs
 *
 * Streamlined format optimized for LLM consumption.
 * Does not include UI state, metadata, or branching info.
 */
export interface ModelMessage {
  /** Message role */
  role: 'user' | 'assistant' | 'system'
  /** Content - string for simple messages, array for multimodal */
  content: string | ModelContentPart[]
}

// =============================================================================
// TRANSIENT DATA (Streaming metadata that doesn't persist)
// =============================================================================

/**
 * TransientData - Metadata that streams to UI but doesn't persist
 *
 * Use this for progress indicators, token counts, latency metrics,
 * and other ephemeral data that shouldn't pollute message history.
 */
export interface TransientData {
  /** Current token count being generated */
  tokenCount?: number
  /** Latency metrics */
  latency?: {
    timeToFirstToken?: number
    totalTime?: number
  }
  /** Progress indicator (0-100) */
  progress?: number
  /** Current phase of generation */
  phase?: 'thinking' | 'generating' | 'tool-calling' | 'complete'
  /** Custom transient data */
  [key: string]: unknown
}

// =============================================================================
// CONVERSION UTILITIES
// =============================================================================

/**
 * Convert UIMessages to ModelMessages for LLM consumption
 *
 * Strips UI-specific data and converts rich parts to model format.
 */
export function toModelMessages(uiMessages: UIMessage[]): ModelMessage[] {
  return uiMessages.map((msg) => ({
    role: msg.role,
    content: convertPartsToModelContent(msg.parts),
  }))
}

/**
 * Convert UI message parts to model content format
 */
function convertPartsToModelContent(
  parts: UIMessagePart[]
): string | ModelContentPart[] {
  // If only text parts, return as string
  const textParts = parts.filter((p): p is UITextPart => p.type === 'text')
  const nonTextParts = parts.filter((p) => p.type !== 'text')

  if (nonTextParts.length === 0) {
    return textParts.map((p) => p.text).join('\n')
  }

  // Otherwise return array of content parts
  return parts
    .filter(
      (p) =>
        p.type === 'text' ||
        p.type === 'image' ||
        (p.type.startsWith('tool-') && (p as UIToolCallPart).state === 'result')
    )
    .map((p) => {
      if (p.type === 'text') {
        return { type: 'text' as const, text: p.text }
      }
      if (p.type === 'image') {
        return { type: 'image' as const, url: (p as UIImagePart).url }
      }
      // Tool results
      const toolPart = p as UIToolCallPart
      return {
        type: 'tool_result' as const,
        tool_use_id: toolPart.toolCallId,
        content: JSON.stringify(toolPart.result),
      }
    })
}

/**
 * Create a new UIMessage from user input
 */
export function createUserMessage(
  content: string,
  options?: {
    id?: string
    parentId?: string | null
    metadata?: UIMessageMetadata
  }
): UIMessage {
  return {
    id: options?.id ?? generateId(),
    role: 'user',
    parts: [{ type: 'text', text: content }],
    createdAt: new Date(),
    parentId: options?.parentId ?? null,
    metadata: options?.metadata,
  }
}

/**
 * Create a new assistant UIMessage (typically for streaming)
 */
export function createAssistantMessage(options?: {
  id?: string
  parentId?: string | null
  metadata?: UIMessageMetadata
}): UIMessage {
  return {
    id: options?.id ?? generateId(),
    role: 'assistant',
    parts: [],
    createdAt: new Date(),
    isStreaming: true,
    parentId: options?.parentId ?? null,
    metadata: options?.metadata,
  }
}

/**
 * Append text to an existing message's parts
 */
export function appendTextToMessage(
  message: UIMessage,
  text: string
): UIMessage {
  const lastPart = message.parts[message.parts.length - 1]

  if (lastPart && lastPart.type === 'text') {
    // Append to existing text part
    return {
      ...message,
      parts: [
        ...message.parts.slice(0, -1),
        { type: 'text', text: lastPart.text + text },
      ],
    }
  }

  // Add new text part
  return {
    ...message,
    parts: [...message.parts, { type: 'text', text }],
  }
}

/**
 * Mark a message as done streaming
 */
export function finalizeMessage(
  message: UIMessage,
  metadata?: Partial<UIMessageMetadata>
): UIMessage {
  return {
    ...message,
    isStreaming: false,
    metadata: {
      ...message.metadata,
      ...metadata,
    },
  }
}

/**
 * Get the text content of a message
 */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is UITextPart => p.type === 'text')
    .map((p) => p.text)
    .join('\n')
}

/**
 * Check if a message has tool calls
 */
export function hasToolCalls(message: UIMessage): boolean {
  return message.parts.some((p) => p.type.startsWith('tool-'))
}

/**
 * Get all tool calls from a message
 */
export function getToolCalls(message: UIMessage): UIToolCallPart[] {
  return message.parts.filter((p): p is UIToolCallPart =>
    p.type.startsWith('tool-')
  )
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isUITextPart(part: UIMessagePart): part is UITextPart {
  return part.type === 'text'
}

export function isUIImagePart(part: UIMessagePart): part is UIImagePart {
  return part.type === 'image'
}

export function isUIToolCallPart(part: UIMessagePart): part is UIToolCallPart {
  return part.type.startsWith('tool-')
}

export function isUICodePart(part: UIMessagePart): part is UICodePart {
  return part.type === 'code'
}

export function isUIThinkingPart(part: UIMessagePart): part is UIThinkingPart {
  return part.type === 'thinking'
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate a unique message ID
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
