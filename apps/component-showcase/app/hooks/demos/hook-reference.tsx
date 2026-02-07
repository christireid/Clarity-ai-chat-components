'use client'

import { Badge } from '@clarity-chat/primitives'

export interface HookInfo {
  name: string
  description: string
  pkg: string
}

export function HookReferenceGrid({ hooks }: { hooks: HookInfo[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {hooks.map((hook) => (
        <div key={hook.name} className="glass-panel p-3 rounded-lg space-y-1">
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono font-semibold text-primary">
              {hook.name}
            </code>
            <Badge variant="outline" className="text-[10px] shrink-0">
              {hook.pkg}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {hook.description}
          </p>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// UI & STATE HOOKS (reference grid - interactive demos shown separately)
// =============================================================================
export const uiStateRefHooks: HookInfo[] = [
  {
    name: 'useDebouncedCallback',
    description: 'Debounce a callback function with configurable delay',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThrottledCallback',
    description: 'Throttle a callback to fire at most once per interval',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePrevious',
    description: 'Track the previous value of any state or prop',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useIsMounted',
    description:
      'Check if component is currently mounted to prevent state updates after unmount',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSafeTimeout',
    description: 'setTimeout with automatic cleanup on unmount',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSafeAnimationFrame',
    description: 'requestAnimationFrame with automatic cleanup on unmount',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useEventListener',
    description:
      'Attach event listeners to window, document, or elements with cleanup',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useBreakpoint',
    description: 'Get the current responsive breakpoint (sm, md, lg, xl)',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useWindowSize',
    description: 'Track window dimensions with throttled updates',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useIntersectionObserver',
    description: 'Observe element visibility with IntersectionObserver API',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMergedRef',
    description: 'Merge multiple refs into a single callback ref',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMergedRefWithCleanup',
    description: 'Merged refs with automatic cleanup handling',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAnimatedValue',
    description: 'Animate numeric values smoothly between changes',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useValueChange',
    description: 'Detect and respond to value changes with callbacks',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSlashCommands',
    description: 'Handle slash command inputs with autocomplete support',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useFocusTrap',
    description: 'Trap keyboard focus within a container element',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useFocusRestoration',
    description: 'Restore focus to previous element after dialog/modal close',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThemeColor',
    description: 'Get a specific theme color value from CSS custom properties',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useOklchThemeColors',
    description:
      'Get theme colors in OKLCH color space for perceptual uniformity',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useBodyScrollLock',
    description: 'Lock body scroll during modals and overlays',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useControllableState',
    description: 'Support both controlled and uncontrolled component patterns',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useControllableBoolean',
    description: 'Controlled/uncontrolled boolean toggle pattern',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useComposedRefs',
    description: 'Compose multiple refs from forwardRef and internal refs',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useForwardedRef',
    description: 'Convert a forwarded ref into a stable local ref',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useRippleEffect',
    description: 'Material Design-style ripple effect on click',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useMagnetic',
    description: 'Magnetic cursor attraction effect for interactive elements',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useFormattedShortcut',
    description: 'Format keyboard shortcuts for platform-aware display',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useA11y',
    description: 'Access accessibility context (reduced motion, high contrast)',
    pkg: '@clarity-chat/primitives',
  },
  {
    name: 'useReducedMotionContext',
    description: 'Read reduced motion preference from context',
    pkg: '@clarity-chat/primitives',
  },
]

// =============================================================================
// CHAT & AI HOOKS
// =============================================================================
export const chatAiRefHooks: HookInfo[] = [
  {
    name: 'useClarityChat',
    description:
      'Full-featured chat with memory, streaming, token tracking, and tool calling',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useClarityChatWithTools',
    description: 'Chat with integrated tool/function calling support',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useClarityObject',
    description: 'Generate structured output from AI with schema validation',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useChat',
    description: 'Lower-level chat state management and message handling',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAssistant',
    description: 'OpenAI Assistant API integration with thread management',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAgent',
    description:
      'AI agent orchestration with multi-step reasoning and tool use',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useCompletion',
    description: 'Simple text completion with streaming support',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRAGPipeline',
    description:
      'Retrieval-Augmented Generation with vector search and context injection',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useChatHandlers',
    description: 'Message handling utilities for send, edit, delete, and retry',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useChatHistory',
    description: 'Manage conversation history with pagination and search',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useChatEditor',
    description: 'Rich text editing functionality for chat input',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMessageNormalization',
    description: 'Normalize message formats across different AI providers',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useChatSync',
    description: 'Sync chat state across tabs and sessions in real-time',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRateLimitedChat',
    description: 'Chat with built-in rate limiting and request queuing',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// STREAMING HOOKS
// =============================================================================
export const streamingRefHooks: HookInfo[] = [
  {
    name: 'useStreaming',
    description:
      'Base streaming hook for consuming async iterables and ReadableStreams',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamingChat',
    description:
      'Chat-specific streaming with message accumulation and status tracking',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamingSSE',
    description:
      'Server-Sent Events streaming with reconnection and event parsing',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamingWebSocket',
    description: 'WebSocket-based streaming with heartbeat and reconnection',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamableUI',
    description: 'Stream React components progressively from server to client',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSmoothedText',
    description: 'Smooth text rendering at 60fps for streaming content',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamStatus',
    description: 'Track streaming progress, status, and error state',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSimpleStreamStatus',
    description: 'Simplified stream status tracking with basic states',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// MESSAGES & STATE MANAGEMENT HOOKS
// =============================================================================
export const messageStateRefHooks: HookInfo[] = [
  {
    name: 'useMessageHistory',
    description: 'Manage message history with add, edit, delete, and search',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMessageOperations',
    description: 'Message operations including edit, delete, pin, and archive',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useOptimisticMessage',
    description: 'Optimistic UI updates for messages with rollback on failure',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useOptimisticState',
    description: 'Generic optimistic state management pattern',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRegenerateMessage',
    description: 'Retry or regenerate AI responses with different parameters',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAiState',
    description: 'Generative UI state management for AI-driven components',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAiStateContext',
    description: 'Access AI state from context in child components',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAllAiStates',
    description: 'Get all registered AI states for debugging and monitoring',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTool',
    description: 'Tool/function calling state for individual tool executions',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useToolContext',
    description: 'Access tool state from ClarityChatProvider context',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTools',
    description: 'Get all available tools and their registration status',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useToolHistory',
    description: 'Track tool call history across conversation turns',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePendingTools',
    description: 'Get currently pending/running tool executions',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThread',
    description: 'Thread/conversation management with create, switch, delete',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThreadContext',
    description: 'Access thread state from ClarityChatProvider context',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThreadInput',
    description: 'Manage thread-specific input state and draft messages',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useIsStreaming',
    description: 'Check if any stream is currently active',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMultiStreamStatus',
    description: 'Track multiple concurrent streams with individual status',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useProgressiveContent',
    description: 'Progressive content rendering with skeleton fallbacks',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAdditionalContext',
    description: 'Add dynamic context to AI requests at runtime',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAdditionalContextProvider',
    description: 'Provide additional context to all child components',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAgentConfig',
    description: 'Configure agent behavior, tools, and system prompts',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAgentConfigProvider',
    description: 'Provide agent configuration to all child components',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// TOKEN & COST HOOKS
// =============================================================================
export const tokenCostRefHooks: HookInfo[] = [
  {
    name: 'useLazyTokenCounter',
    description:
      'Lazy-loaded token counter with preloading for faster first count',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenBudget',
    description: 'Track token budget usage with warnings and limits',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenBudgetBar',
    description:
      'Component-specific token budget tracking with visual indicators',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenBudgetMonitor',
    description: 'Monitor token budget with alerts and threshold notifications',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenTracker',
    description: 'Track cumulative token usage across requests and sessions',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useCostEstimator',
    description:
      'Estimate API costs in real-time based on token usage and model pricing',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useCostTracker',
    description: 'Track and aggregate costs across multiple API calls',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useContextWindow',
    description: 'Monitor context window usage and remaining capacity',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useResponseCache',
    description: 'Cache API responses to reduce redundant calls',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSemanticCache',
    description: 'Semantic similarity-based caching for near-duplicate queries',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useEmbeddingCache',
    description: 'Cache embeddings to avoid re-computation',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useExactCache',
    description: 'Exact match caching for identical queries',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamOptimizer',
    description: 'Optimize streaming responses with buffering and batching',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenThrottle',
    description: 'Throttle token usage to stay within rate limits',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenLimitGuard',
    description:
      'Guard against context window overflow with automatic truncation',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useVectorSearch',
    description: 'Vector similarity search for embeddings-based retrieval',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useContextInjector',
    description: 'Inject relevant context into prompts based on conversation',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAdaptiveModel',
    description:
      'Adaptive model selection based on query complexity and budget',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePromptCompressor',
    description: 'Compress and optimize prompts to reduce token usage',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useTokenOptimization',
    description: 'Full token optimization pipeline with multiple strategies',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useTokenCount',
    description: 'Simple token counting with model-aware encoding',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useModelRouter',
    description: 'Route queries to optimal models based on complexity and cost',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useTieredCache',
    description: 'Multi-tier caching (memory, localStorage, IndexedDB)',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useOptimizationPipeline',
    description: 'Composable optimization pipeline for token reduction',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useTokenDisplayState',
    description: 'Token display state with accessibility support',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useTokenAnnouncer',
    description: 'Screen reader announcements for token count changes',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useTokenKeyboardShortcuts',
    description: 'Keyboard shortcuts for token management UI',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'useTokenEstimate',
    description: 'Estimate token costs before sending requests',
    pkg: '@clarity-chat/token-optimization',
  },
]

// =============================================================================
// KEYBOARD & INPUT HOOKS
// =============================================================================
export const keyboardInputRefHooks: HookInfo[] = [
  {
    name: 'useKeyboardNavigation',
    description: 'Arrow key navigation for lists and grids',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useKeyboardShortcut',
    description: 'Register a single keyboard shortcut handler',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useShortcutDisplay',
    description: 'Format shortcut labels for platform (Cmd vs Ctrl)',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useScopedKeyboardShortcuts',
    description: 'Priority-based keyboard shortcuts with scope handling',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useFocusedKeyboardShortcuts',
    description: 'Shortcuts that only fire when container is focused',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useVimNavigation',
    description: 'Vim-style j/k navigation for lists and messages',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useFocusScope',
    description: 'Manage focus scope for keyboard navigation boundaries',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useKeyboardHintsOnModifier',
    description: 'Show keyboard hints when modifier keys are pressed',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useIsMac',
    description: 'Detect Mac platform for modifier key display',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useChatKeyboardNavigation',
    description: 'Chat-specific keyboard navigation (messages, threads)',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useFocusInputShortcut',
    description: 'Focus the chat input with a keyboard shortcut',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useEscapeToClose',
    description: 'Close dialogs and panels with Escape key',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useQuickActions',
    description: 'Quick action shortcuts for common operations',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useCommandPalette',
    description: 'Command palette with fuzzy search and categories',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useCommandPaletteCommands',
    description: 'Register and manage command palette entries',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useVoiceInput',
    description: 'Voice input with speech-to-text transcription',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSimpleVoiceInput',
    description: 'Simplified voice input with start/stop controls',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSubmitButtonState',
    description: 'Manage submit button loading, disabled, and error states',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMobileKeyboard',
    description: 'Handle mobile virtual keyboard show/hide events',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMobileViewportHeight',
    description: 'Get actual viewport height accounting for mobile keyboard',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMobileKeyboardScrollLock',
    description: 'Lock scroll position when mobile keyboard opens',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRealisticTyping',
    description: 'Simulate realistic human typing with variable speed',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useQuantumVoice',
    description:
      'Advanced voice I/O with streaming transcription and synthesis',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// RESILIENCE & SECURITY HOOKS
// =============================================================================
export const resilienceSecurityRefHooks: HookInfo[] = [
  {
    name: 'useErrorRecovery',
    description: 'Error recovery with automatic fallback strategies',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRequestDeduplication',
    description: 'Deduplicate identical concurrent requests',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSecurity',
    description:
      'General security utilities for input sanitization and validation',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSecurityMonitor',
    description: 'Monitor and log security events in real-time',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSecureInput',
    description: 'Secure input handling with XSS and injection prevention',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSecureChat',
    description: 'End-to-end secure chat with content validation',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSecurityEvents',
    description: 'Track and respond to security events',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSecurityStats',
    description: 'Aggregate security statistics and risk scores',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRateLimitStatus',
    description: 'Monitor API rate limit headers and remaining quota',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useErrorBoundary',
    description: 'Programmatic error boundary with reset and fallback',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useStreamingError',
    description: 'Handle errors during streaming responses gracefully',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useAsyncError',
    description: 'Catch and handle errors from async operations',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useErrorHandler',
    description: 'General-purpose error handler with logging',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useEnhancedErrorHandler',
    description: 'Enhanced error handling with categorization and recovery',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useErrorToast',
    description: 'Display errors as toast notifications',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useErrorRecovery',
    description: 'Automated error recovery with configurable strategies',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'usePersistentCircuitBreaker',
    description: 'Circuit breaker with state persisted across sessions',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useResetStrategies',
    description:
      'Multiple error reset strategies (timer, route change, manual)',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useNetworkStatus',
    description: 'Monitor online/offline network status',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useErrorAnalytics',
    description: 'Track and analyze error patterns and frequencies',
    pkg: '@clarity-chat/error-handling',
  },
  {
    name: 'useDashboardErrorHandler',
    description: 'Specialized error handling for dashboard components',
    pkg: '@clarity-chat/error-handling',
  },
]

// =============================================================================
// PERFORMANCE HOOKS
// =============================================================================
export const performanceRefHooks: HookInfo[] = [
  {
    name: 'usePerformanceTracking',
    description: 'Track component render times and interaction metrics',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePerformanceMonitoring',
    description: 'Monitor overall app performance with thresholds',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRenderOptimization',
    description: 'Optimize renders with automatic memoization hints',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'use60FPSAnimation',
    description: '60 FPS animation support with frame-rate monitoring',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useRenderPerformance',
    description: 'Measure and report render performance metrics',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useWhyDidYouUpdate',
    description: 'Debug unnecessary re-renders by logging prop changes',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMountTime',
    description: 'Track component mount time for performance auditing',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSlowRenderDetection',
    description: 'Detect and warn about slow renders exceeding threshold',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useLazyLoad',
    description: 'Lazy load components with intersection observer trigger',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMemoryLeakDetector',
    description: 'Detect potential memory leaks from growing state',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSmartCache',
    description: 'Intelligent caching with LRU eviction and TTL',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSmartThrottle',
    description: 'Adaptive throttling based on system load',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useStreamThrottle',
    description: 'Throttle streaming updates for consistent frame rates',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDeferredSearch',
    description: 'Deferred search with low-priority state updates',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useBatteryAware',
    description: 'Adjust performance settings based on battery level',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMemoizedCallback',
    description: 'Deep-compare memoized callbacks to prevent re-renders',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useBatchedState',
    description: 'Batch multiple state updates into a single render',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useUpdateEffect',
    description: 'Effect that only runs on updates, not initial mount',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThrottledEffect',
    description: 'Throttle effect execution to reduce frequency',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDebouncedEffect',
    description: 'Debounce effect execution for expensive side effects',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMemoizedSelector',
    description: 'Memoized state selector with shallow equality',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDeepMemo',
    description: 'Deep comparison memoization for complex objects',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useVirtualList',
    description: 'Virtual scrolling for large lists with fixed row heights',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDynamicVirtualList',
    description: 'Virtual scrolling with dynamic/variable row heights',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useEventDelegation',
    description:
      'Event delegation for efficient event handling on many elements',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useContextSelector',
    description:
      'Select specific context values to prevent unnecessary re-renders',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMultipleContexts',
    description: 'Consume multiple contexts efficiently with a single hook',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// CONNECTED COMPONENT HOOKS
// =============================================================================
export const connectedRefHooks: HookInfo[] = [
  {
    name: 'useConnectedThinkingBar',
    description: 'Auto-wired ThinkingBar props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedThinkingPill',
    description: 'Auto-wired ThinkingPill props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedStreamProgress',
    description: 'Auto-wired StreamProgress props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedConversations',
    description: 'Auto-wired Conversations list from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedSender',
    description: 'Auto-wired ChatInput/Sender props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedToolCard',
    description: 'Auto-wired ToolCard props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedChainOfThought',
    description: 'Auto-wired ChainOfThought props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedResponseActions',
    description: 'Auto-wired ResponseActions props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedWelcome',
    description: 'Auto-wired Welcome component props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedPrompts',
    description: 'Auto-wired Prompts component props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedSuggestion',
    description: 'Auto-wired Suggestion props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedAttachments',
    description: 'Auto-wired Attachments props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedApprovalCard',
    description: 'Auto-wired ApprovalCard props from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConnectedProps',
    description:
      'Universal auto-wiring by component name from ClarityChatProvider',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// SDK BRIDGES
// =============================================================================
export const sdkBridgesRefHooks: HookInfo[] = [
  {
    name: 'useVercelAIBridge',
    description:
      'Bridge Vercel AI SDK (useChat/useCompletion) to Clarity Chat components',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useLangChainBridge',
    description:
      'Bridge LangChain.js chains and agents to Clarity Chat components',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useAnthropicBridge',
    description: 'Bridge Anthropic SDK to Clarity Chat with streaming support',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useGenericBridge',
    description: 'Generic bridge factory for custom AI SDK integrations',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// DASHBOARD, PROMPT & MEMORY HOOKS
// =============================================================================
export const dashboardPromptMemoryRefHooks: HookInfo[] = [
  {
    name: 'useDashboardData',
    description:
      'Fetch and manage dashboard data with loading and error states',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useSimpleDashboardData',
    description: 'Simplified dashboard data fetching with defaults',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDashboardComposer',
    description: 'Compose dashboard layouts from widget configurations',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDashboardPerformance',
    description: 'Monitor dashboard render performance and optimization',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePromptComposer',
    description:
      'Progressive prompt composition with token-aware context management',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePromptCommands',
    description: 'Prompt command palette with slash commands and templates',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMemoryFeedback',
    description:
      'User feedback for AI memory (remember/forget) with persistence',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useContextMonitor',
    description:
      'Monitor context window usage and provide optimization recommendations',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useModelRouter',
    description:
      'Route to different models based on query complexity and rules',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMemory',
    description: 'Manage AI memory with store, retrieve, and forget operations',
    pkg: '@clarity-chat/memory',
  },
]

// =============================================================================
// THEME, STORAGE & DESIGN HOOKS
// =============================================================================
export const themeStorageDesignRefHooks: HookInfo[] = [
  {
    name: 'useThemeColors',
    description: 'Get the full theme color palette from CSS custom properties',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThemeShortcuts',
    description: 'Keyboard shortcuts for theme switching (light/dark/system)',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useThemeAnalytics',
    description: 'Track theme preference analytics and usage patterns',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useDesignTokens',
    description: 'Access design token values (spacing, radius, shadows)',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useInteractiveClasses',
    description:
      'Generate interactive component classes (hover, focus, active)',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useCardClasses',
    description: 'Generate card variant classes with consistent styling',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useLocalStorage',
    description: 'Persist state in localStorage with cross-tab sync',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useIndexedDB',
    description: 'Persist large data in IndexedDB with async operations',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useConversationStorage',
    description: 'Conversation-specific storage with automatic namespacing',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useMemoryStore',
    description: 'In-memory key-value store with optional TTL',
    pkg: '@clarity-chat/react',
  },
]

// =============================================================================
// LICENSE HOOKS
// =============================================================================
export const licenseRefHooks: HookInfo[] = [
  {
    name: 'useLicenseStatus',
    description: 'Get current license status (active, expired, trial)',
    pkg: '@clarity-chat/license',
  },
  {
    name: 'useIsLicensed',
    description: 'Check if the current user has a valid license',
    pkg: '@clarity-chat/license',
  },
  {
    name: 'useHasPlan',
    description:
      'Check if user has a specific plan level (free, pro, enterprise)',
    pkg: '@clarity-chat/license',
  },
  {
    name: 'useLicenseInfo',
    description: 'Get full license details (plan, expiry, features)',
    pkg: '@clarity-chat/license',
  },
  {
    name: 'useRequireLicense',
    description: 'Gate component rendering behind license requirement',
    pkg: '@clarity-chat/license',
  },
  {
    name: 'useLicenseWarning',
    description:
      'Show license expiration warnings with configurable thresholds',
    pkg: '@clarity-chat/license',
  },
  {
    name: 'useIsHydrated',
    description: 'Check if client-side hydration is complete for SSR safety',
    pkg: '@clarity-chat/license',
  },
]

// =============================================================================
// DEV TOOLS HOOKS
// =============================================================================
export const devToolsRefHooks: HookInfo[] = [
  {
    name: 'useProfiler',
    description: 'Performance profiling with flame graph data collection',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useStateDiff',
    description: 'Track and visualize state changes between renders',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useTimeTravel',
    description: 'Time travel debugging with state snapshots and replay',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useTokenTracker',
    description: 'Track token usage per request with cost breakdown',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useComponentMonitor',
    description: 'Monitor component lifecycle and render frequency',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useModelComparison',
    description: 'Compare responses from different AI models side-by-side',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useAPIInspector',
    description: 'Inspect API requests and responses in development',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useErrorTracker',
    description: 'Track and aggregate errors with stack traces',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useDevNotifications',
    description: 'Development-only notifications for warnings and tips',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useEnvValidation',
    description: 'Validate environment variables and configuration',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useAPIKeyValidation',
    description: 'Validate API keys format and accessibility',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useChatConfigValidation',
    description: 'Validate chat configuration completeness',
    pkg: '@clarity-chat/dev-tools',
  },
  {
    name: 'useMessageValidation',
    description: 'Validate message format and content rules',
    pkg: '@clarity-chat/dev-tools',
  },
]

// =============================================================================
// ACCESSIBILITY HOOKS
// =============================================================================
export const accessibilityRefHooks: HookInfo[] = [
  {
    name: 'useScreenReader',
    description: 'Screen reader detection and live region announcements',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useScreenReaderDetection',
    description: 'Detect if a screen reader is active',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useEmbeddings',
    description: 'Generate and manage text embeddings for semantic search',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'useVectorStore',
    description: 'Client-side vector store for embedding-based retrieval',
    pkg: '@clarity-chat/react',
  },
  {
    name: 'usePrefersReducedMotion',
    description: 'Detect reduced motion preference (token UI context)',
    pkg: '@clarity-chat/token-optimization',
  },
  {
    name: 'usePrefersHighContrast',
    description: 'Detect high contrast mode preference',
    pkg: '@clarity-chat/token-optimization',
  },
]

// =============================================================================
// PLAYGROUND HOOKS
// =============================================================================
export const playgroundRefHooks: HookInfo[] = [
  {
    name: 'usePlayground',
    description: 'Full playground context with state and actions',
    pkg: '@clarity-chat/playground',
  },
  {
    name: 'usePlaygroundState',
    description: 'Read-only playground state (code, output, errors)',
    pkg: '@clarity-chat/playground',
  },
  {
    name: 'usePlaygroundActions',
    description: 'Playground actions (run, reset, save, share)',
    pkg: '@clarity-chat/playground',
  },
  {
    name: 'usePlaygroundCode',
    description: 'Manage playground code editor state',
    pkg: '@clarity-chat/playground',
  },
  {
    name: 'usePlaygroundTheme',
    description: 'Playground theme configuration',
    pkg: '@clarity-chat/playground',
  },
  {
    name: 'usePlaygroundSettings',
    description: 'Playground settings (model, temperature, etc.)',
    pkg: '@clarity-chat/playground',
  },
  {
    name: 'usePlaygroundConsole',
    description: 'Playground console output and logging',
    pkg: '@clarity-chat/playground',
  },
]
