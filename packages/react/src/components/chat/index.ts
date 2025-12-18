/**
 * Chat Components
 *
 * Core chat experience components including the main chat window,
 * input, and various chat layouts.
 */

export { ClarityChat } from './clarity-chat'
export { ClarityChatPresets } from './clarity-chat-presets'
export { ClarityChatSimple } from './clarity-chat-simple'
export { ChatWindow } from './chat-window'
export { ChatInput } from './chat-input'
export { ChatLayout } from './chat-layout'
export {
  ChatComplete,
  ChatWithMemory,
  ChatWithAnalytics,
  ChatWithPreset,
  type ChatCompleteProps,
  type ChatWithMemoryProps,
  type ChatWithAnalyticsProps,
  type ChatWithPresetProps,
} from './chat-recipes'
export { ChatWithErrorBoundary } from './chat-with-error-boundary'
export {
  MobileOptimizedMessage,
  MobileChatWindow,
  TouchFriendlyButton,
  useMobileOptimization,
} from './mobile-chat-optimized'
export { OfflineChatSync, useOfflineChat } from './offline-chat-sync'
export { default as VirtualizedMessageList } from './virtualized-message-list'
export { default as MessageList } from './virtualized-message-list'
