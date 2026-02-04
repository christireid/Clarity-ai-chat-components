// @ts-nocheck
/**
 * Enhanced TypeScript Types for Clarity Chat React Package
 *
 * This module provides advanced type utilities and helpers to improve type safety
 * and developer experience when working with clarity-chat components and adapters.
 *
 * Features:
 * - Stricter discriminated union types for events
 * - Generic message types with custom metadata support
 * - Plugin type helpers and utilities
 * - Runtime type guards for adapters
 * - Component prop inference helpers
 * - Conditional types for feature-dependent props
 *
 * @example
 * ```tsx
 * import type {
 *   StrictChatEvent,
 *   GenericMessage,
 *   CreatePluginOptions,
 *   InferComponentProps,
 * } from '@clarity-chat/react/types'
 *
 * // Define custom message metadata
 * interface CustomMetadata {
 *   sentiment: 'positive' | 'negative' | 'neutral'
 *   userId: string
 *   source: 'api' | 'web' | 'mobile'
 * }
 *
 * type MyMessage = GenericMessage<CustomMetadata>
 *
 * // Create a plugin with full type safety
 * const myPlugin = createPlugin({
 *   name: 'my-plugin',
 *   version: '1.0.0',
 *   hooks: {
 *     onMessageSend(msg) {
 *       // msg is fully typed with metadata
 *     }
 *   }
 * })
 * ```
 *
 * @packageDocumentation
 */

import type {
  ChatMessage,
  MessageRole,
  MessageStatus,
  MessageToolCall,
  MessageAttachment,
  ThinkingStep,
  StreamStatus,
  ClarityChatAdapter,
  ClarityChatAdapterCapabilities,
  AdapterResponse,
  FormalizedModelAdapter,
  AdapterCapabilities,
} from '../adapters/types'
import type { CoreMessage } from '../hooks/chat/use-chat-enhanced'

// =============================================================================
// 1. STRICTER EVENT TYPES - Discriminated Union for Type Safety
// =============================================================================

/**
 * Message sent event
 * Fired when a user sends a message to the chat
 */
export interface MessageSentEvent {
  readonly type: 'message:sent'
  readonly timestamp: Date
  readonly messageId: string
  readonly content: string
  readonly role: 'user' | 'system'
  readonly metadata?: Record<string, unknown>
}

/**
 * Message received event
 * Fired when the assistant responds with a message
 */
export interface MessageReceivedEvent {
  readonly type: 'message:received'
  readonly timestamp: Date
  readonly messageId: string
  readonly content: string
  readonly role: 'assistant'
  readonly finishReason: 'stop' | 'length' | 'tool-calls' | 'content-filter'
  readonly toolCalls?: MessageToolCall[]
}

/**
 * Stream started event
 * Fired when a streaming response begins
 */
export interface StreamStartedEvent {
  readonly type: 'stream:started'
  readonly timestamp: Date
  readonly messageId: string
  readonly model?: string
}

/**
 * Stream chunk received event
 * Fired for each chunk of streaming data
 */
export interface StreamChunkReceivedEvent {
  readonly type: 'stream:chunk'
  readonly timestamp: Date
  readonly messageId: string
  readonly chunkType: 'text' | 'tool-call' | 'thinking'
  readonly content: string
  readonly usage?: {
    readonly promptTokens: number
    readonly completionTokens: number
  }
}

/**
 * Stream completed event
 * Fired when streaming is finished
 */
export interface StreamCompletedEvent {
  readonly type: 'stream:completed'
  readonly timestamp: Date
  readonly messageId: string
  readonly totalTokens: number
  readonly latencyMs: number
  readonly finishReason: 'stop' | 'length' | 'tool-calls'
}

/**
 * Tool started event
 * Fired when a tool/function call begins execution
 */
export interface ToolStartedEvent {
  readonly type: 'tool:started'
  readonly timestamp: Date
  readonly messageId: string
  readonly toolId: string
  readonly toolName: string
  readonly input: Record<string, unknown>
}

/**
 * Tool completed event
 * Fired when a tool/function call finishes successfully
 */
export interface ToolCompletedEvent {
  readonly type: 'tool:completed'
  readonly timestamp: Date
  readonly messageId: string
  readonly toolId: string
  readonly toolName: string
  readonly output: unknown
  readonly executionTimeMs: number
}

/**
 * Tool error event
 * Fired when a tool/function call fails
 */
export interface ToolErrorEvent {
  readonly type: 'tool:error'
  readonly timestamp: Date
  readonly messageId: string
  readonly toolId: string
  readonly toolName: string
  readonly error: Error
  readonly executionTimeMs: number
}

/**
 * Thinking started event
 * Fired when extended thinking begins
 */
export interface ThinkingStartedEvent {
  readonly type: 'thinking:started'
  readonly timestamp: Date
  readonly messageId: string
  readonly thinkingStepId: string
}

/**
 * Thinking step completed event
 * Fired when a thinking step completes
 */
export interface ThinkingStepEvent {
  readonly type: 'thinking:step'
  readonly timestamp: Date
  readonly messageId: string
  readonly thinkingStepId: string
  readonly content: string
}

/**
 * Error occurred event
 * Fired when any error occurs in the chat flow
 */
export interface ChatErrorEvent {
  readonly type: 'error:occurred'
  readonly timestamp: Date
  readonly messageId?: string
  readonly error: Error
  readonly context: 'message' | 'stream' | 'tool' | 'thinking' | 'adapter'
  readonly recoverable: boolean
}

/**
 * Adapter changed event
 * Fired when the chat adapter is switched
 */
export interface AdapterChangedEvent {
  readonly type: 'adapter:changed'
  readonly timestamp: Date
  readonly oldAdapter: string
  readonly newAdapter: string
  readonly capabilities: ClarityChatAdapterCapabilities
}

/**
 * State updated event
 * Fired when overall chat state changes
 */
export interface StateUpdatedEvent {
  readonly type: 'state:updated'
  readonly timestamp: Date
  readonly previousState: ChatState
  readonly currentState: ChatState
  readonly changes: (keyof ChatState)[]
}

/**
 * Union of all possible chat events
 * Use this for type-safe event handling with discriminated unions
 */
export type StrictChatEvent =
  | MessageSentEvent
  | MessageReceivedEvent
  | StreamStartedEvent
  | StreamChunkReceivedEvent
  | StreamCompletedEvent
  | ToolStartedEvent
  | ToolCompletedEvent
  | ToolErrorEvent
  | ThinkingStartedEvent
  | ThinkingStepEvent
  | ChatErrorEvent
  | AdapterChangedEvent
  | StateUpdatedEvent

/**
 * Extract event type from union
 */
export type EventType = StrictChatEvent['type']

/**
 * Get payload type for a specific event type
 *
 * @example
 * ```tsx
 * type MessageSentPayload = EventPayload<'message:sent'> // MessageSentEvent
 * ```
 */
export type EventPayload<T extends EventType> = Extract<StrictChatEvent, { type: T }>

/**
 * Type-safe event listener
 */
export type StrictEventListener<T extends EventType = EventType> = (
  event: EventPayload<T>
) => void | Promise<void>

/**
 * Type-safe event emitter
 */
export interface StrictEventEmitter {
  on<T extends EventType>(type: T, listener: StrictEventListener<T>): () => void
  once<T extends EventType>(type: T, listener: StrictEventListener<T>): () => void
  off<T extends EventType>(type: T, listener: StrictEventListener<T>): void
  emit<T extends EventType>(type: T, payload: EventPayload<T>): void
}

// =============================================================================
// 2. GENERIC MESSAGE TYPES - Custom Message Metadata Support
// =============================================================================

/**
 * Generic message type that allows custom metadata
 *
 * @template TMetadata - Custom metadata type to extend message with
 *
 * @example
 * ```tsx
 * interface UserMetadata {
 *   userId: string
 *   userName: string
 *   email: string
 * }
 *
 * type UserMessage = GenericMessage<UserMetadata>
 * ```
 */
export interface GenericMessage<TMetadata extends Record<string, unknown> = {}> extends ChatMessage {
  /** Custom metadata extending the message */
  metadata?: TMetadata & Record<string, unknown>
  /** Custom properties */
  [key: string]: unknown
}

/**
 * Generic message with full typing
 */
export interface TypedMessage<
  TRole extends MessageRole = MessageRole,
  TMetadata extends Record<string, unknown> = {}
> extends GenericMessage<TMetadata> {
  role: TRole
}

/**
 * User message with custom metadata
 */
export type UserMessage<TMetadata extends Record<string, unknown> = {}> = TypedMessage<'user', TMetadata>

/**
 * Assistant message with custom metadata
 */
export type AssistantMessage<TMetadata extends Record<string, unknown> = {}> = TypedMessage<
  'assistant',
  TMetadata
>

/**
 * System message with custom metadata
 */
export type SystemMessage<TMetadata extends Record<string, unknown> = {}> = TypedMessage<'system', TMetadata>

/**
 * Tool message with custom metadata
 */
export type ToolMessage<TMetadata extends Record<string, unknown> = {}> = TypedMessage<'tool', TMetadata>

/**
 * Create a typed message factory
 *
 * @example
 * ```tsx
 * interface CustomMetadata {
 *   source: string
 *   priority: number
 * }
 *
 * const createCustomUserMessage = createMessageFactory<CustomMetadata>('user')
 * const msg = createCustomUserMessage('Hello', { source: 'web', priority: 1 })
 * ```
 */
export function createMessageFactory<TMetadata extends Record<string, unknown> = {}>(
  role: MessageRole
): (content: string, metadata?: TMetadata, id?: string) => TypedMessage<MessageRole, TMetadata> {
  return (content, metadata, id) => ({
    id: id || `${role}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    role,
    content,
    createdAt: new Date(),
    status: 'complete',
    metadata,
  })
}

/**
 * Type predicate to check if message is of specific role
 *
 * @example
 * ```tsx
 * const messages = [...] // GenericMessage[]
 * const userMessages = messages.filter(isMessageRole('user'))
 * ```
 */
export function isMessageRole<TRole extends MessageRole>(role: TRole) {
  return <TMetadata extends Record<string, unknown> = {}>(
    message: GenericMessage<TMetadata>
  ): message is TypedMessage<TRole, TMetadata> => message.role === role
}

/**
 * Extract all metadata keys from message
 */
export type MessageMetadataKeys<T extends GenericMessage> = T extends GenericMessage<infer M>
  ? keyof M
  : never

// =============================================================================
// 3. PLUGIN TYPE HELPERS - Utility Types for Plugin Creation
// =============================================================================

/**
 * Plugin hook lifecycle events
 */
export interface PluginHooks<TMetadata extends Record<string, unknown> = {}> {
  /**
   * Called before a message is sent
   */
  onMessageSend?: (message: GenericMessage<TMetadata>) => void | Promise<void>

  /**
   * Called after a message is received
   */
  onMessageReceived?: (message: GenericMessage<TMetadata>) => void | Promise<void>

  /**
   * Called before streaming starts
   */
  onStreamStart?: (messageId: string) => void | Promise<void>

  /**
   * Called for each stream chunk
   */
  onStreamChunk?: (chunk: StreamChunkReceivedEvent) => void | Promise<void>

  /**
   * Called when streaming completes
   */
  onStreamComplete?: (event: StreamCompletedEvent) => void | Promise<void>

  /**
   * Called when a tool execution starts
   */
  onToolStart?: (event: ToolStartedEvent) => void | Promise<void>

  /**
   * Called when a tool execution completes
   */
  onToolComplete?: (event: ToolCompletedEvent) => void | Promise<void>

  /**
   * Called when a tool execution fails
   */
  onToolError?: (event: ToolErrorEvent) => void | Promise<void>

  /**
   * Called when an error occurs
   */
  onError?: (event: ChatErrorEvent) => void | Promise<void>
}

/**
 * Plugin configuration
 */
export interface PluginConfig<TMetadata extends Record<string, unknown> = {}> {
  /** Plugin name - must be unique */
  name: string

  /** Plugin version following semantic versioning */
  version: string

  /** Plugin description */
  description?: string

  /** Author information */
  author?: string

  /** License type */
  license?: string

  /** List of other plugins this plugin depends on */
  dependencies?: string[]

  /** Plugin-specific configuration options */
  config?: Record<string, unknown>

  /** Plugin lifecycle hooks */
  hooks?: PluginHooks<TMetadata>

  /** Called when plugin is initialized */
  onInit?: () => void | Promise<void>

  /** Called when plugin is destroyed */
  onDestroy?: () => void | Promise<void>
}

/**
 * Plugin instance
 */
export interface Plugin<TMetadata extends Record<string, unknown> = {}> extends PluginConfig<TMetadata> {
  /** Unique plugin ID */
  id: string

  /** Whether plugin is active */
  isActive: boolean

  /** Activate the plugin */
  activate(): Promise<void>

  /** Deactivate the plugin */
  deactivate(): Promise<void>

  /** Update plugin configuration */
  configure(config: Partial<Record<string, unknown>>): Promise<void>
}

/**
 * Plugin manager for registering and managing plugins
 */
export interface PluginManager<TMetadata extends Record<string, unknown> = {}> {
  /** Register a new plugin */
  register<T extends PluginConfig<TMetadata>>(config: T): Plugin<TMetadata>

  /** Get a plugin by name */
  get(name: string): Plugin<TMetadata> | undefined

  /** Get all registered plugins */
  getAll(): Plugin<TMetadata>[]

  /** Remove a plugin */
  remove(name: string): boolean

  /** Enable a plugin */
  enable(name: string): Promise<void>

  /** Disable a plugin */
  disable(name: string): Promise<void>

  /** Check if a plugin is enabled */
  isEnabled(name: string): boolean

  /** Execute hook on all plugins */
  executeHook<K extends keyof PluginHooks<TMetadata>>(
    hook: K,
    ...args: Parameters<Exclude<PluginHooks<TMetadata>[K], undefined>>
  ): Promise<void>
}

/**
 * Options for creating a plugin
 */
export type CreatePluginOptions<TMetadata extends Record<string, unknown> = {}> = PluginConfig<TMetadata>

/**
 * Create a plugin with type safety
 *
 * @example
 * ```tsx
 * const myPlugin = createPlugin({
 *   name: 'analytics',
 *   version: '1.0.0',
 *   description: 'Track user interactions',
 *   hooks: {
 *     async onMessageSent(msg) {
 *       await trackEvent('message.sent', { id: msg.id })
 *     }
 *   }
 * })
 * ```
 */
export function createPlugin<TMetadata extends Record<string, unknown> = {}>(
  options: CreatePluginOptions<TMetadata>
): Plugin<TMetadata> {
  const id = `${options.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  return {
    ...options,
    id,
    isActive: false,
    activate: async () => {
      // Implementation in actual plugin system
    },
    deactivate: async () => {
      // Implementation in actual plugin system
    },
    configure: async () => {
      // Implementation in actual plugin system
    },
  }
}

// =============================================================================
// 4. ADAPTER TYPE GUARDS - Runtime Checking for Adapters
// =============================================================================

/**
 * Check if value is a valid FinishReason
 */
export function isFinishReason(value: unknown): value is 'stop' | 'length' | 'tool-calls' | 'content-filter' {
  return (
    value === 'stop' ||
    value === 'length' ||
    value === 'tool-calls' ||
    value === 'content-filter' ||
    value === 'error' ||
    value === 'unknown'
  )
}

/**
 * Check if object is a valid AdapterResponse
 */
export function isAdapterResponse(value: unknown): value is AdapterResponse {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.text === 'string' &&
    Array.isArray(obj.toolCalls) &&
    typeof obj.finishReason === 'string' &&
    typeof obj.model === 'string' &&
    typeof obj.latencyMs === 'number' &&
    isFinishReason(obj.finishReason)
  )
}

/**
 * Check if object is a valid AdapterCapabilities
 */
export function isAdapterCapabilities(value: unknown): value is AdapterCapabilities {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.supportsStreaming === 'boolean' &&
    typeof obj.supportsTools === 'boolean' &&
    typeof obj.supportsImages === 'boolean' &&
    typeof obj.supportsFiles === 'boolean' &&
    typeof obj.supportsSystemMessage === 'boolean' &&
    typeof obj.supportsMultipleSystemMessages === 'boolean'
  )
}

/**
 * Check if object is a FormalizedModelAdapter
 */
export function isFormalizedModelAdapter(value: unknown): value is FormalizedModelAdapter {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.provider === 'string' &&
    isAdapterCapabilities(obj.capabilities) &&
    typeof obj.generate === 'function'
  )
}

/**
 * Check if adapter supports a specific capability
 *
 * @example
 * ```tsx
 * if (supportsCapability(adapter, 'supportsStreaming')) {
 *   // Use streaming
 * }
 * ```
 */
export function supportsCapability<K extends keyof AdapterCapabilities>(
  adapter: { capabilities: AdapterCapabilities },
  capability: K
): adapter.capabilities[K] extends boolean ? boolean : boolean {
  return Boolean(adapter.capabilities[capability])
}

/**
 * Validate adapter before use
 *
 * @throws Error if adapter is invalid
 */
export function validateAdapter(adapter: unknown): asserts adapter is FormalizedModelAdapter {
  if (!isFormalizedModelAdapter(adapter)) {
    throw new Error('Invalid adapter: must have provider, capabilities, and generate method')
  }
}

/**
 * Safely cast unknown value to adapter if valid
 */
export function asAdapter(value: unknown): FormalizedModelAdapter | null {
  return isFormalizedModelAdapter(value) ? value : null
}

// =============================================================================
// 5. COMPONENT PROP INFERENCE - InferProps Helper Types
// =============================================================================

/**
 * Extract props from a React component
 *
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 * type ChatProps = InferComponentProps<typeof ClarityChat>
 * ```
 */
export type InferComponentProps<T> = T extends React.ComponentType<infer P> ? P : never

/**
 * Require specific prop keys
 *
 * @example
 * ```tsx
 * type RequiredChatProps = RequirePropKeys<ChatProps, 'adapter' | 'config'>
 * ```
 */
export type RequirePropKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Make specific prop keys optional
 */
export type OptionalPropKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Pick only props that match a specific type
 *
 * @example
 * ```tsx
 * type StringProps = PropsOfType<ChatProps, string>
 * ```
 */
export type PropsOfType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}

/**
 * Props that are callbacks/functions
 */
export type CallbackProps<T> = PropsOfType<T, (...args: any[]) => any>

/**
 * Props that are NOT callbacks/functions
 */
export type DataProps<T> = Omit<T, keyof CallbackProps<T>>

/**
 * Extract prop type by key
 */
export type PropType<T, K extends keyof T> = T[K]

/**
 * Create a props builder with type safety
 *
 * @example
 * ```tsx
 * const builder = createPropsBuilder<ChatProps>()
 * const props = builder
 *   .set('adapter', myAdapter)
 *   .set('onError', handleError)
 *   .build()
 * ```
 */
export function createPropsBuilder<T extends Record<string, unknown>>() {
  const props: Partial<T> = {}

  return {
    set<K extends keyof T>(key: K, value: T[K]): ReturnType<typeof createPropsBuilder<T>> {
      props[key] = value
      return createPropsBuilder<T>()
    },
    build(): Partial<T> {
      return props
    },
    toRequired(): T {
      const required = props as T
      for (const key in required) {
        if (!(key in props)) {
          throw new Error(`Missing required prop: ${key}`)
        }
      }
      return required
    },
  }
}

// =============================================================================
// 6. CONDITIONAL TYPES - Feature-Dependent Props
// =============================================================================

/**
 * Chat state snapshot
 */
export interface ChatState {
  messages: GenericMessage[]
  input: string
  isLoading: boolean
  isStreaming: boolean
  error: Error | null
  currentAdapter: string | null
  capabilities: Partial<ClarityChatAdapterCapabilities>
}

/**
 * Require streaming-related props if streaming is enabled
 *
 * @example
 * ```tsx
 * interface Props extends ConditionalStreamingProps<{ streaming: true }> {
 *   // If streaming is true, onChunk is required
 * }
 * ```
 */
export type ConditionalStreamingProps<T extends { streaming?: boolean }> = T['streaming'] extends true
  ? {
      onChunk: (chunk: StreamChunkReceivedEvent) => void
      onStreamComplete: (event: StreamCompletedEvent) => void
    }
  : {
      onChunk?: (chunk: StreamChunkReceivedEvent) => void
      onStreamComplete?: (event: StreamCompletedEvent) => void
    }

/**
 * Require tool-related props if tools are enabled
 */
export type ConditionalToolProps<T extends { tools?: boolean }> = T['tools'] extends true
  ? {
      onToolStart: (event: ToolStartedEvent) => void
      onToolComplete: (event: ToolCompletedEvent) => void
    }
  : {
      onToolStart?: (event: ToolStartedEvent) => void
      onToolComplete?: (event: ToolCompletedEvent) => void
    }

/**
 * Require thinking-related props if thinking is enabled
 */
export type ConditionalThinkingProps<T extends { thinking?: boolean }> = T['thinking'] extends true
  ? {
      onThinkingStep: (event: ThinkingStepEvent) => void
    }
  : {
      onThinkingStep?: (event: ThinkingStepEvent) => void
    }

/**
 * Combine conditional prop types
 *
 * @example
 * ```tsx
 * interface ChatProps extends
 *   ConditionalStreamingProps<{ streaming: true }>,
 *   ConditionalToolProps<{ tools: true }>,
 *   ConditionalThinkingProps<{ thinking: true }> {
 *   adapter: ClarityChatAdapter
 * }
 * ```
 */
export type ConditionalProps<T extends Record<string, unknown>> = ConditionalStreamingProps<T> &
  ConditionalToolProps<T> &
  ConditionalThinkingProps<T>

/**
 * Make props required if condition is true
 */
export type RequireIf<T, Condition extends boolean, K extends keyof T> = Condition extends true
  ? RequirePropKeys<T, K>
  : T

/**
 * Build component props with conditional requirements
 *
 * @example
 * ```tsx
 * interface ChatProps {
 *   adapter: ClarityChatAdapter
 *   streaming?: boolean
 *   onChunk?: (chunk: StreamChunkReceivedEvent) => void
 *   onStreamComplete?: (event: StreamCompletedEvent) => void
 * }
 *
 * const isStreamingEnabled = true
 * type RequiredChatProps = RequireIf<ChatProps, typeof isStreamingEnabled, 'onChunk' | 'onStreamComplete'>
 * ```
 */

/**
 * Helper to validate props against conditional requirements
 */
export function validateConditionalProps<T extends Record<string, unknown>>(
  props: T,
  requirements: {
    if: (props: T) => boolean
    require: (keyof T)[]
  }[]
): { valid: boolean; missing: (keyof T)[] } {
  const missing: (keyof T)[] = []

  for (const req of requirements) {
    if (req.if(props)) {
      for (const key of req.require) {
        if (!(key in props) || props[key] === undefined) {
          missing.push(key)
        }
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

// =============================================================================
// UTILITY HELPERS
// =============================================================================

/**
 * Check if event is of specific type with type guard
 *
 * @example
 * ```tsx
 * if (isEventType(event, 'message:sent')) {
 *   // event is now typed as MessageSentEvent
 * }
 * ```
 */
export function isEventType<T extends EventType>(
  event: StrictChatEvent,
  type: T
): event is EventPayload<T> {
  return event.type === type
}

/**
 * Create a type-safe event handler dispatcher
 *
 * @example
 * ```tsx
 * const dispatch = createEventDispatcher({
 *   'message:sent': (e) => console.log('Sent:', e.content),
 *   'message:received': (e) => console.log('Received:', e.content),
 * })
 *
 * dispatch(event)
 * ```
 */
export function createEventDispatcher<T extends Partial<Record<EventType, (event: any) => void>>>(
  handlers: T
): (event: StrictChatEvent) => void {
  return (event) => {
    const handler = handlers[event.type]
    if (handler) {
      handler(event)
    }
  }
}

/**
 * Deep freeze object for type safety
 */
export function deepFreeze<T extends Record<string, unknown>>(obj: T): Readonly<T> {
  Object.freeze(obj)
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (obj[prop] !== null && (typeof obj[prop] === 'object' || typeof obj[prop] === 'function')) {
      deepFreeze(obj[prop])
    }
  })
  return obj
}

/**
 * Type-safe event emitter implementation
 */
export function createStrictEventEmitter(): StrictEventEmitter {
  const listeners = new Map<EventType, Set<StrictEventListener>>()

  return {
    on: (type, listener) => {
      if (!listeners.has(type)) {
        listeners.set(type, new Set())
      }
      listeners.get(type)!.add(listener)

      return () => {
        listeners.get(type)?.delete(listener)
      }
    },
    once: (type, listener) => {
      const wrappedListener = ((event: any) => {
        listener(event)
        listeners.get(type)?.delete(wrappedListener)
      }) as StrictEventListener

      return this.on(type, wrappedListener)
    },
    off: (type, listener) => {
      listeners.get(type)?.delete(listener)
    },
    emit: (type, payload) => {
      const eventListeners = listeners.get(type)
      if (eventListeners) {
        eventListeners.forEach((listener) => {
          try {
            listener(payload as any)
          } catch (error) {
            console.error(`Error in event listener for ${type}:`, error)
          }
        })
      }
    },
  }
}

/**
 * Export all enhanced types for convenient importing
 *
 * @example
 * ```tsx
 * import type * as Enhanced from '@clarity-chat/react/types/enhanced'
 * ```
 */
export type {
  ChatState,
  PluginHooks,
  PluginConfig,
  Plugin,
  PluginManager,
}
