/**
 * Message Components
 *
 * Components for displaying and managing messages including
 * streaming, markdown rendering, and message actions.
 */

// Core Message Components
export { Message } from './message'
export { MessageList } from './MessageList'
export { MessageMetadata } from './MessageMetadata'
export { MessageOptimized } from './MessageOptimized'
export { MessageThreadView, ThreadList } from './MessageThreadView'

// Streaming Components
export { StreamingMessage } from './StreamingMessage'
export { StreamingTextRenderer } from './StreamingTextRenderer'
export { StreamBlock } from './StreamBlock'
export { StreamCancellation } from './StreamCancellation'

// Message Indicators
export { ThinkingIndicator } from './ThinkingIndicator'
export { TypingIndicator, type TypingIndicatorVariant } from './TypingIndicator'
export { TimeSeparator } from './TimeSeparator'

// Tool & Citation Components
export { CitationCard } from './CitationCard'
export { ClarityToolResult } from './ClarityToolResult'
export { ToolInvocationCard } from './ToolInvocationCard'

// Message Actions
export { MessageActions } from './MessageActions'
export {
  MessageActionsSecure,
  type SecurityInfo,
  type MessageActionsSecureProps,
} from './MessageActionsSecure'
export { CopyButton } from './CopyButton'
export { DeleteButton } from './DeleteButton'
export { EditableMessageContent } from './EditableMessageContent'
export { FeedbackDialog } from './FeedbackDialog'

// Markdown & Code
export { MarkdownCodeBlock } from './MarkdownCodeBlock'

// Animations
export { ConfettiAnimation } from './ConfettiAnimation'

// FlowToken Integration (optional - requires 'flowtoken' package)
export {
  FlowTokenStreamingText,
  FlowTokenMarkdown,
  useFlowToken,
  type FlowTokenAnimation,
  type FlowTokenStreamingTextProps,
  type FlowTokenMarkdownProps,
  type UseFlowTokenReturn,
} from './FlowtokenAdapter'
