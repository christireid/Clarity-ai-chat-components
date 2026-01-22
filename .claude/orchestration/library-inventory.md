# Clarity Chat Library Export Inventory

**Generated**: 2026-01-19
**Source**: `@clarity-chat/react`
**Main Entry**: `packages/react/src/index.ts`

---

## Summary

| Category | Total Exports | Public | Internal/Deprecated |
|----------|--------------|--------|---------------------|
| Components | 142+ | 130+ | 12 |
| Hooks | 95+ | 85+ | 10 |
| Types | 180+ | 175+ | 5 |
| Utilities | 200+ | 190+ | 10 |
| **Total** | **617+** | **580+** | **37** |

---

## Components (Total: 142+)

### Core Chat Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ClarityChat` | `components/chat/clarity-chat.tsx` | `ClarityChatProps` | Yes |
| `ClarityChatPresets` | `components/chat/clarity-chat-presets.ts` | - | Yes |
| `ChatComplete` | `components/chat/chat-recipes.tsx` | `ChatCompleteProps` | Yes |
| `ChatWithMemory` | `components/chat/chat-recipes.tsx` | `ChatWithMemoryProps` | Yes |
| `ChatWithAnalytics` | `components/chat/chat-recipes.tsx` | `ChatWithAnalyticsProps` | Yes |
| `ChatWithPreset` | `components/chat/chat-recipes.tsx` | `ChatWithPresetProps` | Yes |
| `ChatWindow` | `components/chat/chat-window.tsx` | - | Yes |
| `ChatInput` | `components/chat/chat-input.tsx` | - | Yes |
| `ChatLayout` | `components/chat/chat-layout.tsx` | `ChatLayoutProps` | Yes |
| `FloatingChatWidget` | `components/chat/floating-chat-widget.tsx` | `FloatingChatWidgetProps` | Yes |
| `MessageList` | `components/chat/virtualized-message-list.tsx` | - | Yes |
| `TanStackMessageList` | `components/chat/tanstack-message-list.tsx` | `TanStackMessageListProps` | Yes |
| `AutoTanStackMessageList` | `components/chat/tanstack-message-list.tsx` | `AutoTanStackMessageListProps` | Yes |
| `ResizableChatLayout` | `components/chat/resizable-chat-layout.tsx` | `ResizableChatLayoutProps` | Yes |
| `ResizeHandle` | `components/chat/resizable-chat-layout.tsx` | `ResizeHandleProps` | Yes |
| `Panel` | `components/chat/resizable-chat-layout.tsx` | - | Yes |
| `PanelGroup` | `components/chat/resizable-chat-layout.tsx` | - | Yes |
| `PanelResizeHandle` | `components/chat/resizable-chat-layout.tsx` | - | Yes |

### AI Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `Citation` | `components/ai/citation.tsx` | `CitationProps` | Yes |
| `SourceCitation` | `components/ai/source-citation.tsx` | `SourceCitationProps` | Yes |
| `ChainOfThought` | `components/ai/chain-of-thought.tsx` | `ChainOfThoughtProps` | Yes |
| `ThinkingBar` | `components/ai/thinking-bar.tsx` | `ThinkingBarProps` | Yes |
| `StreamStatusProgress` | `components/ai/streaming-progress.tsx` | `StreamStatusProgressProps` | Yes |
| `StreamStatusProgressWithFields` | `components/ai/streaming-progress.tsx` | `StreamStatusProgressWithFieldsProps` | Yes |
| `TextShimmer` | `components/ai/text-shimmer.tsx` | `TextShimmerProps` | Yes |
| `ParagraphShimmer` | `components/ai/text-shimmer.tsx` | - | Yes |
| `HeadingShimmer` | `components/ai/text-shimmer.tsx` | - | Yes |
| `CodeShimmer` | `components/ai/text-shimmer.tsx` | - | Yes |
| `InlineShimmer` | `components/ai/text-shimmer.tsx` | - | Yes |
| `TextShimmerGroup` | `components/ai/text-shimmer.tsx` | `TextShimmerGroupProps` | Yes |
| `ToolExecutionCard` | `components/ai/tool-execution-card.tsx` | `ToolExecutionCardProps` | Yes |
| `MarkdownRendererEnhanced` | `components/ai/markdown-renderer-enhanced.tsx` | `MarkdownRendererProps` | Yes |
| `EnhancedMarkdownRenderer` | `components/ai/enhanced-markdown-renderer.tsx` | - | Yes |
| `AgentRunFeed` | `components/ai/agent-run-feed.tsx` | - | Yes |
| `AuditLogViewer` | `components/ai/audit-log-viewer.tsx` | - | Yes |
| `CollaborativeEditor` | `components/ai/collaborative-editing.tsx` | - | Yes |
| `CollaborativeMessageList` | `components/ai/collaborative-editing.tsx` | - | Yes |
| `PresenceIndicator` | `components/ai/collaborative-editing.tsx` | - | Yes |
| `EnhancedCodeBlock` | `components/ai/enhanced-code-block.tsx` | - | Yes |
| `KnowledgeBaseViewer` | `components/ai/knowledge-base-viewer.tsx` | - | Yes |
| `ModelSelector` | `components/ai/model-selector.tsx` | - | Yes |
| `PersonaPanel` | `components/ai/persona-panel.tsx` | - | Yes |
| `SafetyStatusCard` | `components/ai/safety-status-card.tsx` | - | Yes |
| `SessionSummaryCard` | `components/ai/session-summary-card.tsx` | - | Yes |
| `WorkflowSuggestionList` | `components/ai/workflow-suggestion-list.tsx` | - | Yes |

### Message Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `Message` | `components/message/message.tsx` | - | Yes |
| `MessageList` | `components/message/message-list.tsx` | - | Yes |
| `MessageMetadata` | `components/message/message-metadata.tsx` | - | Yes |
| `MessageOptimized` | `components/message/message-optimized.tsx` | - | Yes |
| `MessageThreadView` | `components/message/message-thread-view.tsx` | - | Yes |
| `ThreadList` | `components/message/message-thread-view.tsx` | - | Yes |
| `StreamingMessage` | `components/message/streaming-message.tsx` | - | Yes |
| `StreamingTextRenderer` | `components/message/streaming-text-renderer.tsx` | - | Yes |
| `StreamBlock` | `components/message/stream-block.tsx` | - | Yes |
| `StreamCancellation` | `components/message/stream-cancellation.tsx` | - | Yes |
| `ThinkingIndicator` | `components/message/thinking-indicator.tsx` | - | Yes |
| `TypingIndicator` | `components/message/typing-indicator.tsx` | - | Yes |
| `TimeSeparator` | `components/message/time-separator.tsx` | - | Yes |
| `CitationCard` | `components/message/citation-card.tsx` | - | Yes |
| `ClarityToolResult` | `components/message/clarity-tool-result.tsx` | - | Yes |
| `ToolInvocationCard` | `components/message/tool-invocation-card.tsx` | - | Yes |
| `MessageActions` | `components/message/message-actions.tsx` | - | Yes |
| `MessageActionsSecure` | `components/message/message-actions-secure.tsx` | `MessageActionsSecureProps` | Yes |
| `CopyButton` | `components/message/copy-button.tsx` | - | Yes |
| `DeleteButton` | `components/message/delete-button.tsx` | - | Yes |
| `EditableMessageContent` | `components/message/editable-message-content.tsx` | - | Yes |
| `FeedbackDialog` | `components/message/feedback-dialog.tsx` | - | Yes |
| `MarkdownCodeBlock` | `components/message/markdown-code-block.tsx` | - | Yes |
| `MessageMarkdownRenderer` | `components/message/markdown-renderer.tsx` | `MessageMarkdownRendererProps` | Yes |
| `ConfettiAnimation` | `components/message/confetti-animation.tsx` | - | Yes |
| `FlowTokenStreamingText` | `components/message/flowtoken-adapter.tsx` | `FlowTokenStreamingTextProps` | Yes |
| `FlowTokenMarkdown` | `components/message/flowtoken-adapter.tsx` | `FlowTokenMarkdownProps` | Yes |

### Code Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `CodeBlock` | `components/code/CodeBlock.tsx` | `CodeBlockProps` | Yes |
| `StreamingCodeBlock` | `components/code/StreamingCodeBlock.tsx` | `StreamingCodeBlockProps` | Yes |
| `InlineCode` | `components/code/InlineCode.tsx` | `InlineCodeProps` | Yes |
| `LineNumbers` | `components/code/LineNumbers.tsx` | `LineNumbersProps` | Yes |
| `CodeBlockHeader` | `components/code/CodeBlockHeader.tsx` | `CodeBlockHeaderProps` | Yes |
| `CodeBlockCopyButton` | `components/code/CodeBlockCopyButton.tsx` | `CodeBlockCopyButtonProps` | Yes |

### Input Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `AdvancedChatInput` | `components/input/advanced-chat-input.tsx` | - | Yes |
| `FileUpload` | `components/input/file-upload.tsx` | - | Yes |
| `MentionInput` | `components/input/mention-system.tsx` | - | Yes |
| `MentionList` | `components/input/mention-system.tsx` | - | Yes |
| `OutputPreferenceSelector` | `components/input/output-preference-selector.tsx` | `OutputPreferenceSelectorProps` | Yes |
| `UncontrolledOutputPreferenceSelector` | `components/input/output-preference-selector.tsx` | `UncontrolledOutputPreferenceSelectorProps` | Yes |
| `StructuredInputBuilder` | `components/input/structured-input-builder.tsx` | `StructuredInputBuilderProps` | Yes |
| `VoiceInput` | `components/input/voice-input.tsx` | - | Yes |
| `InlineVoiceInput` | `components/input/voice-input.tsx` | - | Yes |

### Prompt Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `FollowUpSuggestions` | `components/prompt/follow-up-suggestions.tsx` | `FollowUpSuggestionsProps` | Yes |
| `PromptPlayground` | `components/prompt/prompt-playground.tsx` | `PromptPlaygroundProps` | Yes |
| `PromptSuggestions` | `components/prompt/prompt-suggestions.tsx` | `PromptSuggestionsProps` | Yes |
| `PromptVariablesEditor` | `components/prompt/prompt-variables-editor.tsx` | `PromptVariablesEditorProps` | Yes |
| `PromptVersionHistory` | `components/prompt/prompt-version-history.tsx` | `PromptVersionHistoryProps` | Yes |
| `PromptContainer` | `components/prompt/prompt-container.tsx` | `PromptContainerProps` | Yes |
| `SuggestionCards` | `components/prompt/suggestion-cards.tsx` | `SuggestionCardsProps` | Yes |

### Feedback Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ErrorBoundary` | `components/feedback/error-boundary.tsx` | - | Yes |
| `RetryButton` | `components/feedback/retry-button.tsx` | - | Yes |
| `ErrorMessage` | `components/feedback/error-message.tsx` | - | Yes |
| `NetworkStatus` | `components/feedback/network-status.tsx` | - | Yes |
| `NetworkStatusBanner` | `components/feedback/network-status-banner.tsx` | - | Yes |

### Token Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `TokenCounter` | `components/token/token-counter.tsx` | - | Yes |
| `TokenUsageMeter` | `components/token/token-usage-meter.tsx` | `TokenUsageMeterProps` | Yes |
| `TokenOptimizationPanel` | `components/token/token-optimization-panel.tsx` | - | Yes |
| `TokenOptimizationBadge` | `components/token/token-optimization-badge.tsx` | - | Yes |
| `TokenOptimizationDashboard` | `components/token/token-optimization-dashboard.tsx` | - | Yes |
| `TokenBudgetBar` | `components/token/token-budget-bar.tsx` | - | Yes |
| `TokenCostPreview` | `components/token/TokenCostPreview.tsx` | `TokenCostPreviewProps` | Yes |

### Dashboard Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `AnalyticsDashboard` | `components/dashboards/analytics-dashboard.tsx` | - | Yes |
| `PerformanceDashboard` | `components/dashboards/performance-dashboard.tsx` | - | Yes |
| `PerformanceAnalyticsDashboard` | `components/dashboards/performance-analytics-dashboard.tsx` | - | Yes |
| `ConversationAnalyticsDashboard` | `components/dashboards/conversation-analytics-dashboard.tsx` | - | Yes |
| `UsageDashboard` | `components/dashboards/usage-dashboard.tsx` | - | Yes |
| `ABTestingDashboard` | `components/dashboards/ab-testing-dashboard.tsx` | - | Yes |
| `UserInteractionAnalytics` | `components/dashboards/user-interaction-analytics.tsx` | - | Yes |
| `ResponseQualityMeter` | `components/dashboards/response-quality-meter.tsx` | - | Yes |

### Navigation Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `CommandPalette` | `components/navigation/command-palette.tsx` | - | Yes |
| `CommandPaletteEnhanced` | `components/navigation/command-palette-enhanced.tsx` | `CommandPaletteEnhancedProps` | Yes |
| `ContextMenu` | `components/navigation/context-menu.tsx` | - | Yes |
| `FocusIndicator` | `components/navigation/focus-indicator.tsx` | `FocusIndicatorProps` | Yes |
| `FocusRing` | `components/navigation/focus-indicator.tsx` | `FocusRingProps` | Yes |
| `FocusVisible` | `components/navigation/focus-indicator.tsx` | `FocusVisibleProps` | Yes |
| `KeyboardHint` | `components/navigation/keyboard-hint.tsx` | - | Yes |
| `KeyboardHintsOverlay` | `components/navigation/keyboard-hints-overlay.tsx` | `KeyboardHintsOverlayProps` | Yes |
| `ContextualKeyboardHints` | `components/navigation/keyboard-hints-overlay.tsx` | `ContextualKeyboardHintsProps` | Yes |
| `WithShortcut` | `components/navigation/keyboard-hints-overlay.tsx` | `WithShortcutProps` | Yes |
| `KeyboardShortcutHint` | `components/navigation/keyboard-shortcut-hint.tsx` | `KeyboardShortcutHintProps` | Yes |
| `InlineShortcutHint` | `components/navigation/keyboard-shortcut-hint.tsx` | `InlineShortcutHintProps` | Yes |
| `KeyboardShortcutsModal` | `components/navigation/keyboard-shortcuts-modal.tsx` | `KeyboardShortcutsModalProps` | Yes |
| `KeyboardNavigationDemo` | `components/navigation/keyboard-navigation-demo.tsx` | - | Yes |
| `SkipLinks` | `components/navigation/skip-links.tsx` | `SkipLinksProps` | Yes |
| `Landmark` | `components/navigation/skip-links.tsx` | `LandmarkProps` | Yes |

### Context Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ContextCard` | `components/context/context-card.tsx` | - | Yes |
| `ContextManager` | `components/context/context-manager.tsx` | - | Yes |
| `ContextVisualizer` | `components/context/context-visualizer.tsx` | - | Yes |
| `HistoryManager` | `components/context/history-manager.tsx` | `HistoryManagerProps` | Yes |
| `HistoryMessageRow` | `components/context/history-manager.tsx` | - | Yes |
| `TokenUsageBar` | `components/context/history-manager.tsx` | - | Yes |
| `HistoryToolbar` | `components/context/history-manager.tsx` | - | Yes |
| `MemoryInspector` | `components/context/memory-inspector.tsx` | - | Yes |
| `ProjectSidebar` | `components/context/project-sidebar.tsx` | - | Yes |
| `SettingsPanel` | `components/context/settings-panel.tsx` | - | Yes |

### Conversation Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ConversationList` | `components/conversation/conversation-list.tsx` | - | Yes |
| `ConversationTimeline` | `components/conversation/conversation-timeline.tsx` | - | Yes |
| `ConversationBranchVisualizer` | `components/conversation/conversation-branch-visualizer.tsx` | - | Yes |
| `ConversationSharing` | `components/conversation/conversation-sharing.tsx` | - | Yes |
| `ShareAnalyticsDashboard` | `components/conversation/conversation-sharing.tsx` | - | Yes |
| `ConversationSummarizer` | `components/conversation/conversation-summarizer.tsx` | - | Yes |

### Media Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `DocumentViewer` | `components/media/document-viewer.tsx` | - | Yes |
| `DocumentIntegration` | `components/media/document-integration.tsx` | - | Yes |
| `MultiModalPreview` | `components/media/multi-modal-preview.tsx` | - | Yes |
| `CalendarIntegration` | `components/media/calendar-integration.tsx` | - | Yes |
| `EmailIntegration` | `components/media/email-integration.tsx` | - | Yes |
| `ExportDialog` | `components/media/export-dialog.tsx` | - | Yes |
| `BatchExportDialog` | `components/media/batch-export-dialog.tsx` | - | Yes |

### Search Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `MessageSearch` | `components/search/message-search.tsx` | - | Yes |
| `MessageSearchWithSuspense` | `components/search/message-search.tsx` | - | Yes |
| `SemanticMessageSearch` | `components/search/advanced-message-search-semantic.tsx` | - | Yes |

### Theme Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ThemeSwitcher` | `components/theme-components/theme-switcher.tsx` | - | Yes |
| `ThemePreview` | `components/theme-components/theme-preview.tsx` | - | Yes |
| `ThemePreviewThumbnail` | `components/theme-components/theme-preview-thumbnail.tsx` | `ThemePreviewThumbnailProps` | Yes |
| `ThemePreviewGrid` | `components/theme-components/theme-preview-grid.tsx` | `ThemePreviewGridProps` | Yes |
| `ThemeSelector` | `components/theme-components/theme-selector.tsx` | - | Yes |
| `ThemeSelectorDropdown` | `components/theme-components/theme-selector.tsx` | - | Yes |
| `ThemeContrastChecker` | `components/theme-components/theme-contrast-checker.tsx` | `ThemeContrastCheckerProps` | Yes |
| `ThemeCustomizer` | `components/theme-components/ThemeCustomizer.tsx` | `ThemeCustomizerProps` | Yes |

### UI Primitives

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `BatteryIndicator` | `components/ui/battery-indicator.tsx` | - | Yes |
| `DashboardErrorBoundary` | `components/ui/dashboard-error-boundary.tsx` | `DashboardErrorBoundaryProps` | Yes |
| `DashboardProgress` | `components/ui/dashboard-progress.tsx` | `DashboardProgressProps` | Yes |
| `CircularProgress` | `components/ui/dashboard-progress.tsx` | `CircularProgressProps` | Yes |
| `Draggable` | `components/ui/draggable.tsx` | - | Yes |
| `DropZone` | `components/ui/draggable.tsx` | - | Yes |
| `EmptyState` | `components/ui/empty-state.tsx` | - | Yes |
| `EmptyChatState` | `components/ui/empty-state.tsx` | - | Yes |
| `NoSearchResultsState` | `components/ui/empty-state.tsx` | - | Yes |
| `NoConversationsState` | `components/ui/empty-state.tsx` | - | Yes |
| `ErrorState` | `components/ui/empty-state.tsx` | - | Yes |
| `SuccessState` | `components/ui/empty-state.tsx` | - | Yes |
| `LinkPreview` | `components/ui/link-preview.tsx` | `LinkPreviewProps` | Yes |
| `LinkPreviewSkeleton` | `components/ui/link-preview.tsx` | `LinkPreviewSkeletonProps` | Yes |
| `LinkPreviewError` | `components/ui/link-preview.tsx` | `LinkPreviewErrorProps` | Yes |
| `LinkPreviewCompact` | `components/ui/link-preview.tsx` | `LinkPreviewCompactProps` | Yes |
| `InlineLink` | `components/ui/link-preview.tsx` | `InlineLinkProps` | Yes |
| `SmartLinkPreview` | `components/ui/link-preview.tsx` | `SmartLinkPreviewProps` | Yes |
| `RichEmbed` | `components/ui/link-preview.tsx` | - | Yes |
| `ToastItem` | `components/ui/toast.tsx` | `ToastProps` | Yes |
| `ToastContainer` | `components/ui/toast.tsx` | `ToastContainerProps` | Yes |
| `ToastProvider` | `components/ui/toast.tsx` | `ToastProviderProps` | Yes |
| `ClarityToaster` | `components/ui/sonner-toast.tsx` | `ClarityToasterProps` | Yes |

### A/B Testing Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ExperimentCard` | `components/ab-testing/experiment-card.tsx` | `ExperimentCardProps` | Yes |
| `ExperimentList` | `components/ab-testing/experiment-list.tsx` | `ExperimentListProps` | Yes |
| `VariantCard` | `components/ab-testing/variant-card.tsx` | `VariantCardProps` | Yes |
| `WinnerBanner` | `components/ab-testing/winner-banner.tsx` | `WinnerBannerProps` | Yes |

### Enterprise Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `AuthTenantDashboard` | `components/enterprise/AuthTenantDashboard.tsx` | - | Yes |
| `ApiTokenManager` | `components/enterprise/ApiTokenManager.tsx` | - | Yes |
| `SSOConfigWizard` | `components/enterprise/SSOConfigWizard.tsx` | - | Yes |
| `SeatInviteDialog` | `components/enterprise/SeatInviteDialog.tsx` | - | Yes |

### AI-Ops Components

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `PromptTestHarness` | `components/ai-ops/PromptTestHarness.tsx` | - | Yes |
| `EvaluationDashboard` | `components/ai-ops/EvaluationDashboard.tsx` | - | Yes |
| `SafetyReviewConsole` | `components/ai-ops/SafetyReviewConsole.tsx` | - | Yes |

### Chat Primitives (Headless)

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `ChatPrimitive` | `primitives/chat/index.ts` | - | Yes |
| `ChatRoot` | `primitives/chat/chat-primitives.tsx` | `ChatRootProps` | Yes |
| `ChatMessages` | `primitives/chat/chat-primitives.tsx` | `ChatMessagesProps` | Yes |
| `ChatMessage` | `primitives/chat/chat-primitives.tsx` | `ChatMessageProps` | Yes |
| `ChatMessageContent` | `primitives/chat/chat-primitives.tsx` | `ChatMessageContentProps` | Yes |
| `ChatMessageActions` | `primitives/chat/chat-primitives.tsx` | `ChatMessageActionsProps` | Yes |
| `ChatInputPrimitive` | `primitives/chat/chat-primitives.tsx` | `ChatInputPrimitiveProps` | Yes |
| `ChatCopyButton` | `primitives/chat/chat-primitives.tsx` | `ChatCopyButtonProps` | Yes |
| `ChatRegenerateButton` | `primitives/chat/chat-primitives.tsx` | `ChatRegenerateButtonProps` | Yes |
| `ChatDeleteButton` | `primitives/chat/chat-primitives.tsx` | `ChatDeleteButtonProps` | Yes |
| `ChatEmptyState` | `primitives/chat/chat-primitives.tsx` | `ChatEmptyStateProps` | Yes |
| `ChatLoadingIndicator` | `primitives/chat/chat-primitives.tsx` | `ChatLoadingIndicatorProps` | Yes |

### Pro Component Utilities

| Export Name | Source File | Props Interface | Public |
|-------------|-------------|-----------------|--------|
| `createProComponent` | `components/pro/createProComponent.ts` | - | Yes |
| `createEnterpriseComponent` | `components/pro/createProComponent.ts` | - | Yes |

---

## Hooks (Total: 95+)

### Core Chat Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useClarityChat` | `hooks/chat/use-clarity-chat.ts` | `UseClarityChatReturn` | Yes |
| `useClarityObject` | `hooks/chat/use-clarity-object.ts` | `UseClarityObjectReturn` | Yes |
| `useClarityChatWithTools` | `hooks/chat/use-clarity-chat-with-tools.ts` | `UseClarityChatWithToolsReturn` | Yes |
| `useHeadlessChat` | `hooks/chat/use-chat-enhanced.ts` | `UseHeadlessChatReturn` | Yes |
| `useChatHandlers` | `hooks/chat/use-chat-handlers.ts` | `ChatHandlers` | Yes |
| `useChat` | `hooks/chat/use-chat-unified.ts` | `UseChatReturn` | Deprecated |
| `useChatLegacy` | `hooks/chat/use-chat.ts` | `UseChatReturnLegacy` | Deprecated |
| `useChatEnhanced` | `hooks/chat/use-chat-enhanced.ts` | `UseChatEnhancedReturn` | Internal |

### Streaming Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useStreaming` | `hooks/streaming/use-streaming.ts` | - | Yes |
| `useSmoothedText` | `hooks/streaming/use-smoothed-text.ts` | `UseSmoothedTextReturn` | Yes |
| `useStreamStatus` | `hooks/streaming/use-stream-status.ts` | `UseStreamStatusReturn` | Yes |
| `useSimpleStreamStatus` | `hooks/streaming/use-stream-status.ts` | `StreamStatusReturn` | Yes |

### UI Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useAutoScroll` | `hooks/ui/use-auto-scroll.ts` | `UseAutoScrollReturn` | Yes |
| `useClipboard` | `hooks/ui/use-clipboard.tsx` | - | Yes |
| `useDebounce` | `hooks/ui/use-debounce.ts` | - | Yes |
| `useThrottledCallback` | `hooks/ui/use-throttle.ts` | - | Yes |
| `useToggle` | `hooks/ui/use-toggle.tsx` | - | Yes |
| `usePrevious` | `hooks/ui/use-previous.tsx` | - | Yes |
| `useMounted` | `hooks/ui/use-mounted.ts` | - | Yes |
| `useIsMounted` | `hooks/ui/use-is-mounted.ts` | - | Yes |
| `useMergedRef` | `hooks/ui/use-merged-ref.ts` | - | Yes |
| `useWindowSize` | `hooks/ui/use-window-size.tsx` | - | Yes |
| `useIntersectionObserver` | `hooks/ui/use-intersection-observer.tsx` | - | Yes |
| `useEventListener` | `hooks/ui/use-event-listener.ts` | - | Yes |
| `useMediaQuery` | `hooks/ui/use-media-query.ts` | - | Yes |
| `useReducedMotion` | `hooks/ui/use-reduced-motion.ts` | - | Yes |
| `useAnimatedValue` | `hooks/ui/use-animated-value.tsx` | `AnimatedValueResult` | Yes |
| `useSafeTimeout` | `hooks/ui/use-safe-timeout.ts` | - | Yes |

### Keyboard Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useKeyboardShortcuts` | `hooks/keyboard/use-keyboard-shortcuts.ts` | - | Yes |
| `useShortcutDisplay` | `hooks/keyboard/use-keyboard-shortcuts.ts` | - | Yes |
| `useScopedKeyboardShortcuts` | `hooks/keyboard/use-keyboard-shortcuts.ts` | - | Yes |
| `useFocusedKeyboardShortcuts` | `hooks/keyboard/use-keyboard-shortcuts.ts` | - | Yes |
| `useKeyboardNavigation` | `hooks/keyboard/use-keyboard-navigation.ts` | - | Yes |
| `useKeyboardShortcut` | `hooks/keyboard/use-keyboard-navigation.ts` | - | Yes |
| `useVimNavigation` | `hooks/keyboard/use-keyboard-navigation.ts` | - | Yes |
| `useFocusScope` | `hooks/keyboard/use-keyboard-navigation.ts` | - | Yes |
| `useKeyboardHintsOnModifier` | `hooks/keyboard/use-keyboard-navigation.ts` | - | Yes |
| `useIsMac` | `hooks/keyboard/use-keyboard-navigation.ts` | - | Yes |
| `useChatKeyboardNavigation` | `hooks/keyboard/use-chat-keyboard-navigation.tsx` | `ChatKeyboardNavigationReturn` | Yes |
| `useFocusInputShortcut` | `hooks/keyboard/use-chat-keyboard-navigation.tsx` | - | Yes |
| `useEscapeToClose` | `hooks/keyboard/use-chat-keyboard-navigation.tsx` | - | Yes |
| `useQuickActions` | `hooks/keyboard/use-chat-keyboard-navigation.tsx` | - | Yes |
| `useCommandPalette` | `hooks/keyboard/use-command-palette.ts` | - | Yes |

### Token Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useTokenCount` | `hooks/token/use-token-tracker.ts` | - | Yes |
| `useTokenOptimization` | `hooks/token/use-token-optimization.ts` | `UseTokenOptimizationReturn` | Yes |
| `useTokenBudgetMonitor` | `hooks/token/use-token-budget-monitor.ts` | `TokenBudgetMonitorReturn` | Yes |
| `useTokenEstimate` | `components/token/TokenCostPreview.tsx` | `TokenEstimate` | Yes |

### Storage Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useLocalStorage` | `hooks/storage/use-local-storage.tsx` | - | Yes |
| `useIndexedDB` | `hooks/storage/use-indexed-db.ts` | - | Yes |
| `useMemoryStore` | `hooks/storage/use-memory-store.ts` | - | Yes |

### Resilience Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useRetryWithBackoff` | `hooks/resilience/use-retry-with-backoff.ts` | `UseRetryWithBackoffReturn` | Yes |
| `useCircuitBreaker` | `hooks/resilience/use-circuit-breaker.ts` | `UseCircuitBreakerReturn` | Yes |
| `useRequestDeduplication` | `hooks/resilience/use-request-deduplication.ts` | `UseRequestDeduplicationReturn` | Yes |
| `useErrorRecovery` | `hooks/resilience/use-error-recovery.tsx` | - | Yes |

### Dashboard Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useDashboardData` | `hooks/dashboard/use-dashboard-data.ts` | - | Yes |
| `useSimpleDashboardData` | `hooks/dashboard/use-dashboard-data.ts` | - | Yes |
| `useDashboardComposer` | `hooks/dashboard/use-dashboard-composer.ts` | - | Yes |
| `useDashboardPerformance` | `hooks/dashboard/use-dashboard-performance.tsx` | `UseDashboardPerformanceReturn` | Yes |
| `useABTesting` | `components/dashboards/ab-testing-dashboard.tsx` | - | Yes |
| `useInteractionTracking` | `components/dashboards/user-interaction-analytics.tsx` | - | Yes |

### Input Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useVoiceInput` | `hooks/input/use-voice-input.ts` | - | Yes |
| `useCharacterCounter` | `hooks/input/use-character-counter.ts` | - | Yes |
| `useSubmitButtonState` | `hooks/input/use-submit-button-state.ts` | - | Yes |
| `useMobileKeyboard` | `hooks/input/use-mobile-keyboard.tsx` | - | Yes |
| `useMentions` | `components/input/mention-system.tsx` | - | Yes |
| `useOutputPreference` | `components/input/output-preference-selector.tsx` | - | Yes |
| `useStructuredInput` | `components/input/structured-input-builder.tsx` | - | Yes |
| `useFileAttachments` | `components/prompt/prompt-container.tsx` | - | Yes |

### Theme Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useTheme` | `theme/use-theme.ts` | - | Yes |
| `useThemeColors` | `hooks/theme/use-theme-colors.ts` | - | Yes |
| `useThemeShortcuts` | `hooks/theme/use-theme-shortcuts.ts` | - | Yes |
| `useThemeAnalytics` | `hooks/theme/use-theme-analytics.ts` | - | Yes |
| `useDesignTokens` | `hooks/theme/use-design-tokens.ts` | - | Yes |

### Context Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useContextMonitor` | `hooks/context/use-context-monitor.tsx` | - | Yes |
| `useMemoryContext` | `memory/memory-provider.tsx` | `UseMemoryContextReturn` | Yes |
| `useTokenBudget` | `context/token-budget-context.tsx` | `TokenBudgetContextValue` | Yes |

### Security Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useSecurity` | `hooks/security/use-security.ts` | - | Yes |
| `useSecurityMonitor` | `hooks/security/use-security.ts` | - | Yes |
| `useSecureInput` | `hooks/security/use-security.ts` | - | Yes |
| `useSecureChat` | `hooks/security/use-security.ts` | - | Yes |
| `useSecurityEvents` | `hooks/security/use-security.ts` | - | Yes |
| `useSecurityStats` | `hooks/security/use-security.ts` | - | Yes |
| `useRateLimitStatus` | `hooks/security/use-security.ts` | - | Yes |

### Message Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useMessageHistory` | `hooks/message/use-message-history.tsx` | - | Yes |
| `useMessageOperations` | `hooks/message/use-message-operations.ts` | - | Yes |
| `useOptimisticMessage` | `hooks/message/use-optimistic-message.ts` | - | Yes |
| `useMessageListScrollControl` | `components/chat/tanstack-message-list.tsx` | `UseMessageListScrollReturn` | Yes |
| `useJumpToBottom` | `components/chat/tanstack-message-list.tsx` | `UseJumpToBottomReturn` | Yes |

### Performance Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `usePerformance` | `hooks/performance/use-performance.ts` | - | Yes |
| `useSmartCache` | `hooks/performance/use-smart-cache.tsx` | - | Yes |
| `useSmartThrottle` | `hooks/performance/use-smart-throttle.tsx` | - | Yes |
| `useDeferredSearch` | `hooks/performance/use-deferred-search.tsx` | - | Yes |
| `useBatteryAware` | `hooks/performance/use-battery-aware.tsx` | - | Yes |

### Model Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useModelRouter` | `hooks/model/use-model-router.tsx` | - | Yes |

### Accessibility Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useFocusTrap` | `accessibility/focus-management.ts` | - | Yes |
| `useFocusRestoration` | `accessibility/focus-management.ts` | - | Yes |
| `useKeyboardNavigating` | `components/navigation/focus-indicator.tsx` | - | Yes |
| `useSkipLinkTarget` | `components/navigation/skip-links.tsx` | - | Yes |
| `useKeyboardHintsOverlay` | `components/navigation/keyboard-hints-overlay.tsx` | - | Yes |
| `useKeyboardShortcutHint` | `components/navigation/keyboard-shortcut-hint.tsx` | - | Yes |
| `useDashboardErrorHandler` | `components/ui/dashboard-error-boundary.tsx` | - | Yes |

### AI Component Hooks

| Export Name | Source File | Return Type | Public |
|-------------|-------------|-------------|--------|
| `useSourceCitation` | `components/ai/source-citation.tsx` | `UseSourceCitationReturn` | Yes |
| `useChainOfThought` | `components/ai/chain-of-thought.tsx` | `UseChainOfThoughtReturn` | Yes |
| `useThinkingBar` | `components/ai/thinking-bar.tsx` | `UseThinkingBarReturn` | Yes |
| `useToolExecution` | `components/ai/tool-execution-card.tsx` | `UseToolExecutionReturn` | Yes |
| `useTextShimmer` | `components/ai/text-shimmer.tsx` | `UseTextShimmerReturn` | Yes |
| `useFlowToken` | `components/message/flowtoken-adapter.tsx` | `UseFlowTokenReturn` | Yes |
| `useMarkdownComponents` | `components/message/markdown-renderer.tsx` | - | Yes |
| `useMarkdownPlugins` | `components/message/markdown-renderer.tsx` | - | Yes |
| `useCollaborativeSession` | `components/ai/collaborative-editing.tsx` | - | Yes |
| `useConversationSharing` | `components/conversation/conversation-sharing.tsx` | - | Yes |
| `useDocumentIntegration` | `components/media/document-integration.tsx` | - | Yes |
| `useCalendarIntegration` | `components/media/calendar-integration.tsx` | - | Yes |
| `useAvailabilityCheck` | `components/media/calendar-integration.tsx` | - | Yes |
| `useEmailIntegration` | `components/media/email-integration.tsx` | - | Yes |
| `useLinkPreview` | `components/ui/link-preview.tsx` | `UseLinkPreviewReturn` | Yes |
| `useToast` | `components/ui/toast.tsx` | `ToastContextValue` | Yes |
| `usePromptSuggestions` | `components/prompt/prompt-suggestions.tsx` | - | Yes |
| `useSuggestionCards` | `components/prompt/suggestion-cards.tsx` | - | Yes |
| `useResizableLayout` | `components/chat/resizable-chat-layout.tsx` | - | Yes |
| `useStatisticalSignificance` | `components/ab-testing/use-statistical-significance.ts` | `SignificanceResult` | Yes |

---

## Types (Total: 180+)

### Core Chat Types

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `ClarityChatProps` | `components/chat/clarity-chat.tsx` | Yes |
| `UseClarityChatOptions` | `hooks/chat/use-clarity-chat.ts` | Yes |
| `UseClarityChatReturn` | `hooks/chat/use-clarity-chat.ts` | Yes |
| `ClarityMemoryOptions` | `hooks/chat/use-clarity-chat.ts` | Yes |
| `ClarityChatMemoryInfo` | `hooks/chat/use-clarity-chat.ts` | Yes |
| `ClarityChatErrorInfo` | `hooks/chat/use-clarity-chat.ts` | Yes |
| `CoreMessage` | `hooks/chat/use-chat-enhanced.ts` | Yes |
| `MessageContent` | `types/chat-types.ts` | Yes |
| `MessageRole` | `types/chat-types.ts` | Yes |
| `ClarityChatWithMemoryConfig` | `types/clarity-chat-types.ts` | Yes |
| `ClarityChatWithoutMemoryConfig` | `types/clarity-chat-types.ts` | Yes |
| `MemoryStrategy` | `types/clarity-chat-types.ts` | Yes |
| `TransportType` | `types/clarity-chat-types.ts` | Yes |
| `ChatLayoutProps` | `components/chat/chat-layout.tsx` | Yes |
| `FloatingChatWidgetProps` | `components/chat/floating-chat-widget.tsx` | Yes |
| `TanStackMessageListProps` | `components/chat/tanstack-message-list.tsx` | Yes |
| `AutoTanStackMessageListProps` | `components/chat/tanstack-message-list.tsx` | Yes |

### AI Component Types

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `CitationProps` | `components/ai/citation.tsx` | Yes |
| `CitationSource` | `components/ai/citation.tsx` | Yes |
| `SourceCitationProps` | `components/ai/source-citation.tsx` | Yes |
| `SourceCitationVariant` | `components/ai/source-citation.tsx` | Yes |
| `SourceCitationSize` | `components/ai/source-citation.tsx` | Yes |
| `SourceCitationSource` | `components/ai/source-citation.tsx` | Yes |
| `Source` | `components/ai/source-citation.tsx` | Yes |
| `ChainOfThoughtProps` | `components/ai/chain-of-thought.tsx` | Yes |
| `ChainOfThoughtStep` | `components/ai/chain-of-thought.tsx` | Yes |
| `ChainOfThoughtStepStatus` | `components/ai/chain-of-thought.tsx` | Yes |
| `ChainOfThoughtVariant` | `components/ai/chain-of-thought.tsx` | Yes |
| `ThinkingBarProps` | `components/ai/thinking-bar.tsx` | Yes |
| `ThinkingBarStatus` | `components/ai/thinking-bar.tsx` | Yes |
| `ThinkingBarVariant` | `components/ai/thinking-bar.tsx` | Yes |
| `StreamStatusProgressProps` | `components/ai/streaming-progress.tsx` | Yes |
| `StreamStatusProgressVariant` | `components/ai/streaming-progress.tsx` | Yes |
| `StreamStatusProgressSize` | `components/ai/streaming-progress.tsx` | Yes |
| `StreamStatusProgressColor` | `components/ai/streaming-progress.tsx` | Yes |
| `StreamStatusTokens` | `components/ai/streaming-progress.tsx` | Yes |
| `TextShimmerProps` | `components/ai/text-shimmer.tsx` | Yes |
| `TextShimmerVariant` | `components/ai/text-shimmer.tsx` | Yes |
| `TextShimmerSpeed` | `components/ai/text-shimmer.tsx` | Yes |
| `TextShimmerSize` | `components/ai/text-shimmer.tsx` | Yes |
| `ToolExecutionCardProps` | `components/ai/tool-execution-card.tsx` | Yes |
| `ToolExecution` | `components/ai/tool-execution-card.tsx` | Yes |
| `ToolExecutionStatus` | `components/ai/tool-execution-card.tsx` | Yes |
| `MarkdownRendererProps` | `components/ai/markdown-renderer-enhanced.tsx` | Yes |

### Code Component Types

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `CodeBlockProps` | `components/code/CodeBlock.tsx` | Yes |
| `CodeFontFamily` | `components/code/CodeBlock.tsx` | Yes |
| `StreamingCodeBlockProps` | `components/code/StreamingCodeBlock.tsx` | Yes |
| `InlineCodeProps` | `components/code/InlineCode.tsx` | Yes |
| `LineNumbersProps` | `components/code/LineNumbers.tsx` | Yes |
| `CodeBlockHeaderProps` | `components/code/CodeBlockHeader.tsx` | Yes |
| `CodeThemeName` | `components/code/themes/index.ts` | Yes |
| `CodeThemeDefinition` | `components/code/themes/index.ts` | Yes |
| `ParsedCodeBlock` | `components/code/utils.ts` | Yes |
| `CommonLanguage` | `components/code/utils.ts` | Yes |

### Theme Types

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `ThemeProviderProps` | `theme/ThemeProvider.tsx` | Yes |
| `ThemeMode` | `theme/theme-types.ts` | Yes |
| `ThemeConfig` | `theme/theme-types.ts` | Yes |
| `ThemeContextValue` | `theme/theme-types.ts` | Yes |
| `ThemePresetName` | `theme/theme-types.ts` | Yes |
| `HSLColor` | `theme/theme-config.ts` | Yes |
| `ColorConfig` | `theme/theme-config.ts` | Yes |
| `TypographyConfig` | `theme/theme-config.ts` | Yes |
| `SpacingConfig` | `theme/theme-config.ts` | Yes |
| `BorderConfig` | `theme/theme-config.ts` | Yes |
| `ShadowConfig` | `theme/theme-config.ts` | Yes |
| `AnimationConfig` | `theme/theme-config.ts` | Yes |
| `SimpleThemeConfig` | `theme/create-theme.ts` | Yes |

### Token Types

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `TokenBudgetContextValue` | `context/token-budget-context.tsx` | Yes |
| `TokenBudgetProviderProps` | `context/token-budget-context.tsx` | Yes |
| `TokenBudgetConfig` | `hooks/token/use-token-budget-monitor.ts` | Yes |
| `TokenBudgetMonitorReturn` | `hooks/token/use-token-budget-monitor.ts` | Yes |
| `TokenUsage` | `hooks/token/use-token-budget-monitor.ts` | Yes |
| `TokenUsageStatus` | `hooks/token/use-token-budget-monitor.ts` | Yes |
| `UseTokenOptimizationOptions` | `hooks/token/use-token-optimization.ts` | Yes |
| `TokenOptimizationStats` | `hooks/token/use-token-optimization.ts` | Yes |

### Streaming Types

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `UseSmoothedTextOptions` | `hooks/streaming/use-smoothed-text.ts` | Yes |
| `UseSmoothedTextReturn` | `hooks/streaming/use-smoothed-text.ts` | Yes |
| `UseStreamStatusOptions` | `hooks/streaming/use-stream-status.ts` | Yes |
| `UseStreamStatusReturn` | `hooks/streaming/use-stream-status.ts` | Yes |
| `StreamStatusReturn` | `hooks/streaming/use-stream-status.ts` | Yes |
| `StreamingState` | `hooks/streaming/use-stream-status.ts` | Yes |
| `FieldStreamStatus` | `hooks/streaming/use-stream-status.ts` | Yes |
| `FieldStatus` | `hooks/streaming/use-stream-status.ts` | Yes |
| `StreamTokenStats` | `hooks/streaming/use-stream-status.ts` | Yes |
| `StreamTimeStats` | `hooks/streaming/use-stream-status.ts` | Yes |

### Additional Component Types (90+ more types available in source files)

---

## Utilities (Total: 200+)

### Core Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `cn` | `utils/cn.ts` | Yes |
| `initializeClarity` | `initialization.ts` | Yes |

### Message Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `createUserMessage` | `utils/message/chat-helpers.ts` | Yes |
| `createAssistantMessage` | `utils/message/chat-helpers.ts` | Yes |
| `createSystemMessage` | `utils/message/chat-helpers.ts` | Yes |
| `createToolResultMessage` | `utils/message/chat-helpers.ts` | Yes |
| `convertCoreMessageToMessage` | `utils/message/message-conversion.ts` | Yes |
| `convertMessageToCoreMessage` | `utils/message/message-conversion.ts` | Yes |
| `convertCoreMessagesToMessages` | `utils/message/message-conversion.ts` | Yes |
| `convertMessagesToCoreMessages` | `utils/message/message-conversion.ts` | Yes |
| `isUserMessage` | `types/clarity-chat-types.ts` | Yes |
| `isAssistantMessage` | `types/clarity-chat-types.ts` | Yes |
| `hasTextContent` | `types/clarity-chat-types.ts` | Yes |
| `extractTextContent` | `types/clarity-chat-types.ts` | Yes |

### Code Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `parseCodeBlocks` | `components/code/utils.ts` | Yes |
| `hasCodeBlocks` | `components/code/utils.ts` | Yes |
| `extractCodeBlocks` | `components/code/utils.ts` | Yes |
| `parseLineRanges` | `components/code/utils.ts` | Yes |
| `escapeHtml` | `components/code/utils.ts` | Yes |
| `normalizeLanguage` | `components/code/utils.ts` | Yes |
| `detectLanguage` | `components/code/utils.ts` | Yes |
| `getLanguageDisplayName` | `components/code/utils.ts` | Yes |
| `extractLanguageFromClassName` | `components/code/utils.ts` | Yes |
| `countLines` | `components/code/utils.ts` | Yes |
| `truncateCode` | `components/code/utils.ts` | Yes |
| `CODE_THEMES` | `components/code/themes/index.ts` | Yes |
| `DEFAULT_DARK_THEME` | `components/code/themes/index.ts` | Yes |
| `DEFAULT_LIGHT_THEME` | `components/code/themes/index.ts` | Yes |
| `COMMON_LANGUAGES` | `components/code/utils.ts` | Yes |
| `LANGUAGE_DISPLAY_NAMES` | `components/code/utils.ts` | Yes |

### Animation Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `createFadeVariant` | `animations/utils.ts` | Yes |
| `createSlideVariant` | `animations/utils.ts` | Yes |
| `createScaleVariant` | `animations/utils.ts` | Yes |
| `createStaggerContainerVariant` | `animations/utils.ts` | Yes |
| `createStaggerChildVariant` | `animations/utils.ts` | Yes |
| `createInteractionVariant` | `animations/utils.ts` | Yes |
| `createPulseAnimation` | `animations/utils.ts` | Yes |
| `createShimmerAnimation` | `animations/utils.ts` | Yes |
| `createSpinnerAnimation` | `animations/utils.ts` | Yes |
| `createDotsAnimation` | `animations/utils.ts` | Yes |
| `createBounceAnimation` | `animations/utils.ts` | Yes |
| `createShakeAnimation` | `animations/utils.ts` | Yes |
| `createSuccessAnimation` | `animations/utils.ts` | Yes |
| `createErrorAnimation` | `animations/utils.ts` | Yes |
| `mergeTransitions` | `animations/utils.ts` | Yes |
| `getDurationInSeconds` | `animations/utils.ts` | Yes |
| `getDurationInMs` | `animations/utils.ts` | Yes |
| `createTweenTransition` | `animations/utils.ts` | Yes |

### API Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `BatchRequestManager` | `utils/api/batch-api.ts` | Yes |
| `fetchWithTimeout` | `utils/api/fetch-with-timeout.ts` | Yes |
| `RequestDeduplicator` | `utils/api/request-deduplication.ts` | Yes |
| `parseRateLimitHeaders` | `utils/api/rate-limit-headers.ts` | Yes |
| `calculateRetryDelay` | `utils/api/rate-limit-headers.ts` | Yes |
| `shouldThrottle` | `utils/api/rate-limit-headers.ts` | Yes |

### Resilience Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `CircuitBreaker` | `utils/resilience/circuit-breaker.ts` | Yes |
| `CircuitOpenError` | `utils/resilience/circuit-breaker.ts` | Yes |
| `createAICircuitBreaker` | `utils/resilience/circuit-breaker.ts` | Yes |
| `withCircuitBreaker` | `utils/resilience/circuit-breaker.ts` | Yes |
| `retryWithBackoff` | `utils/resilience/retry-with-backoff.ts` | Yes |
| `createRetryWrapper` | `utils/resilience/retry-with-backoff.ts` | Yes |
| `AI_API_RETRY_OPTIONS` | `utils/resilience/retry-with-backoff.ts` | Yes |
| `STREAMING_RETRY_OPTIONS` | `utils/resilience/retry-with-backoff.ts` | Yes |

### Token Optimization Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `TokenCounter` | `utils/tokenization/index.ts` | Yes |
| `smartCountTokens` | `utils/tokenization/smart-fallback.ts` | Yes |
| `countTokensRobust` | `utils/tokenization/robust-error-handling.ts` | Yes |
| `validateTokenBudget` | `utils/tokenization/token-budget-validator.ts` | Yes |
| `createTokenBudget` | `utils/tokenization/token-budget-validator.ts` | Yes |
| `compressText` | `utils/tokenization/text-compression.ts` | Yes |
| `compressForBudget` | `utils/tokenization/text-compression.ts` | Yes |
| `truncateText` | `utils/tokenization/smart-truncation.ts` | Yes |
| `summarizeText` | `utils/tokenization/smart-truncation.ts` | Yes |
| `estimateTokens` | `utils/tokenization/estimator.ts` | Yes |
| `countTokens` | `utils/tokenization/accurate-counter.ts` | Yes |

### Prompt Optimization Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `compressPrompt` | `utils/optimization/prompt-compression.ts` | Yes |
| `aggressiveCompress` | `utils/optimization/prompt-compression.ts` | Yes |
| `conservativeCompress` | `utils/optimization/prompt-compression.ts` | Yes |
| `balancedCompress` | `utils/optimization/prompt-compression.ts` | Yes |
| `compressConversation` | `utils/optimization/prompt-compression.ts` | Yes |
| `buildKVCacheOptimizedPrompt` | `utils/optimization/kv-cache-prompt-builder.ts` | Yes |
| `reorderForAttention` | `utils/optimization/context-ordering.ts` | Yes |
| `calculateDynamicOutputLimit` | `utils/optimization/dynamic-output-limit.ts` | Yes |

### Security Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `safeEvaluate` | `utils/security/safe-evaluate.ts` | Yes |
| `detectDangerousPatterns` | `utils/security/safe-evaluate.ts` | Yes |
| `sanitizeCodeHtml` | `utils/security/sanitize-html.ts` | Yes |
| `escapeHtmlEntities` | `utils/security/sanitize-html.ts` | Yes |
| `createSafeCodeHtml` | `utils/security/sanitize-html.ts` | Yes |
| `detectDangerousHtml` | `utils/security/sanitize-html.ts` | Yes |

### Memory Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `buildContextBundle` | `utils/memory/build-context-bundle.ts` | Yes |
| `compressContext` | `utils/memory/compress-context.ts` | Yes |
| `retrieveMemories` | `utils/memory/retrieve-memories.ts` | Yes |

### Theme Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `createTheme` | `theme/create-theme.ts` | Yes |
| `mergeTheme` | `theme/create-theme.ts` | Yes |
| `generateCSSVariables` | `theme/create-theme.ts` | Yes |
| `applyThemeVariables` | `theme/create-theme.ts` | Yes |
| `hexToHSLString` | `theme/color-utils.ts` | Yes |
| `getContrastRatio` | `theme/color-utils.ts` | Yes |
| `generatePaletteFromBrandColor` | `theme/color-utils.ts` | Yes |
| `ThemeBuilder` | `theme/theme-composer.ts` | Yes |
| `ColorMixins` | `theme/theme-composer.ts` | Yes |
| `TypographyMixins` | `theme/theme-composer.ts` | Yes |
| `BorderMixins` | `theme/theme-composer.ts` | Yes |
| `ShadowMixins` | `theme/theme-composer.ts` | Yes |

### TOON (Token-Oriented Object Notation)

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `jsonToToon` | `utils/toon/optimizer.ts` | Yes |
| `toonToJson` | `utils/toon/optimizer.ts` | Yes |
| `autoOptimize` | `utils/toon/optimizer.ts` | Yes |
| `formatForLLM` | `utils/toon/optimizer.ts` | Yes |
| `parseFlexible` | `utils/toon/optimizer.ts` | Yes |
| `estimateToonSavings` | `utils/toon/optimizer.ts` | Yes |
| `isSuitableForToon` | `utils/toon/optimizer.ts` | Yes |

### Prompt Caching Utilities

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `PromptCacheManager` | `utils/prompt-caching/cache-manager.ts` | Yes |
| `createAnthropicCachedMessages` | `utils/prompt-caching/cache-manager.ts` | Yes |
| `estimateCacheSavings` | `utils/prompt-caching/cache-manager.ts` | Yes |

---

## Providers & Context

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `ThemeProvider` | `theme/ThemeProvider.tsx` | Yes |
| `MemoryProvider` | `memory/memory-provider.tsx` | Yes |
| `TokenBudgetProvider` | `context/token-budget-context.tsx` | Yes |
| `LicenseProvider` | `@clarity-chat/license` | Yes |
| `KeyboardNavigationProvider` | `hooks/keyboard/use-keyboard-navigation.ts` | Yes |
| `DashboardPerformanceProvider` | `hooks/dashboard/use-dashboard-performance.tsx` | Yes |

---

## License Management (Re-exported from @clarity-chat/license)

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `LicenseInfo` | `@clarity-chat/license` | Yes |
| `verifyLicense` | `@clarity-chat/license` | Yes |
| `isLicenseValid` | `@clarity-chat/license` | Yes |
| `useLicenseStatus` | `@clarity-chat/license` | Yes |
| `useIsLicensed` | `@clarity-chat/license` | Yes |
| `useHasPlan` | `@clarity-chat/license` | Yes |
| `useLicenseInfo` | `@clarity-chat/license` | Yes |
| `LicenseGate` | `@clarity-chat/license` | Yes |
| `Watermark` | `@clarity-chat/license` | Yes |
| `withLicense` | `@clarity-chat/license` | Yes |

---

## Constants

| Export Name | Source File | Public |
|-------------|-------------|--------|
| `smoothingPresets` | `hooks/streaming/use-smoothed-text.ts` | Yes |
| `MODEL_PRICING_PRESETS` | `components/token/token-usage-meter.tsx` | Yes |
| `PRESET_FIELDS` | `components/input/structured-input-builder.tsx` | Yes |
| `COT_TRIGGERS` | `utils/optimization/cot-optimizer.ts` | Yes |
| `formatShortcutDisplay` | `hooks/keyboard/use-keyboard-navigation.ts` | Yes |
| `defaultChatShortcuts` | `hooks/keyboard/use-keyboard-navigation.ts` | Yes |

---

## Notes

1. **Public API Surface**: All exports listed as "Public: Yes" are part of the stable public API exported from `@clarity-chat/react`.

2. **Internal/Deprecated**: Exports marked as "Internal" or "Deprecated" are either:
   - For internal use only (not recommended for external consumers)
   - Deprecated and scheduled for removal in a future major version

3. **Entry Points**:
   - Main: `@clarity-chat/react` (exports from `public-api.ts` and `app-api.ts`)
   - Internal: `@clarity-chat/react/internal` (for advanced use cases)
   - Primitives: `@clarity-chat/react/primitives` (headless components)

4. **Peer Dependencies**: Some exports require peer dependencies:
   - `flowtoken` - For FlowToken streaming components
   - `@clarity-chat/license` - For license management
   - `@clarity-chat/memory` - For memory service functionality
   - `@clarity-chat/token-optimization` - For token counting utilities

5. **Style Import**: Components require CSS: `import '@clarity-chat/react/styles.css'`
