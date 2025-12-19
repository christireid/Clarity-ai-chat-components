/**
 * Demo Hooks for Headless Mode
 *
 * These are copy-paste-ready hooks you can use in your own projects.
 * They demonstrate common patterns for building chat UIs without
 * depending on any UI library.
 *
 * For production use, consider:
 * - Using a proper tokenizer (tiktoken) instead of character estimation
 * - Adding retry logic for network failures
 * - Implementing proper error boundaries
 * - Adding persistence (localStorage, IndexedDB)
 */

export { useAutoScroll } from './useAutoScroll'
export {
  useTokenTracker,
  estimateTokens,
  type ModelKey,
} from './useTokenTracker'
export {
  useStreamingChat,
  type Message,
  type StreamingChatOptions,
} from './useStreamingChat'
