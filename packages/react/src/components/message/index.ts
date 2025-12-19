/**
 * Message Components
 *
 * Components for displaying and managing messages including
 * streaming, markdown rendering, and message actions.
 */

// Core Message Components
export { Message } from './message'
export { MessageList } from './message-list'
export { MessageMetadata } from './message-metadata'
export { MessageOptimized } from './message-optimized'
export { MessageThreadView, ThreadList } from './message-thread-view'

// Streaming Components
export { StreamingMessage } from './streaming-message'
export { StreamingTextRenderer } from './streaming-text-renderer'
export { StreamBlock } from './stream-block'
export { StreamCancellation } from './stream-cancellation'

// Message Indicators
export { ThinkingIndicator } from './thinking-indicator'
export {
  TypingIndicator,
  type TypingIndicatorVariant,
} from './typing-indicator'
export { TimeSeparator } from './time-separator'

// Tool & Citation Components
export { CitationCard } from './citation-card'
export { ClarityToolResult } from './clarity-tool-result'
export { ToolInvocationCard } from './tool-invocation-card'

// Message Actions
export { MessageActions } from './message-actions'
export {
  MessageActionsSecure,
  type SecurityInfo,
  type MessageActionsSecureProps,
} from './message-actions-secure'
export { CopyButton } from './copy-button'
export { DeleteButton } from './delete-button'
export { EditableMessageContent } from './editable-message-content'
export { FeedbackDialog } from './feedback-dialog'

// Markdown & Code
export { MarkdownCodeBlock } from './markdown-code-block'
export {
  MessageMarkdownRenderer,
  useMarkdownComponents,
  useMarkdownPlugins,
  type MessageMarkdownRendererProps,
} from './markdown-renderer'

// Animations
export { ConfettiAnimation } from './confetti-animation'
