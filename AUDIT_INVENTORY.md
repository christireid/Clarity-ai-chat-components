# Clarity Chat Components - Comprehensive Audit Inventory

**Date:** January 2026 **Scope:** Complete audit of @clarity-chat/react library **Status:** Phase 7
Complete - Audit Remediation Finished

## Audit Summary

This audit identified and resolved the following critical issues:

### Fixed Issues

1. **TypeScript Build Errors** - Resolved duplicate exports in hooks.ts
2. **Missing Module Declarations** - Added prismjs.d.ts and gpt-tokenizer.d.ts
3. **Missing Dependencies** - Built @clarity-chat/token-optimization package
4. **Documentation Drift** - Deleted 81 orphaned hook documentation files
5. **Incomplete Docs** - Rewrote useClarityChat documentation with full API reference

### Key Metrics

- 81 orphaned documentation files removed
- 4 critical TypeScript errors fixed
- 138 Storybook stories verified
- 155+ components inventoried
- 95+ hooks catalogued

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Component Inventory](#component-inventory)
3. [Hook Inventory](#hook-inventory)
4. [Public API Surface](#public-api-surface)
5. [Documentation Coverage](#documentation-coverage)
6. [Storybook Coverage](#storybook-coverage)
7. [Test Coverage](#test-coverage)
8. [Dependency Map](#dependency-map)
9. [Issues Register](#issues-register)
10. [Prioritization Matrix](#prioritization-matrix)

---

## Executive Summary

### Library Statistics

| Metric               | Count |
| -------------------- | ----- |
| Total Components     | 155+  |
| Total Hooks          | 95+   |
| Component Categories | 23    |
| Hook Domains         | 15    |
| Public API Exports   | 150+  |
| Documentation Pages  | 100+  |
| Storybook Stories    | 100+  |
| Example Applications | 16    |

### Package Structure

```
@clarity-chat/react
├── Core Components (chat, message, input)
├── AI Components (citation, markdown, chain-of-thought)
├── UI Components (skeleton, toast, progress)
├── Enterprise Components (auth, SSO, audit)
├── Layout Components (resizable, floating widget)
└── 95+ Hooks across 15 domains
```

---

## Component Inventory

### 1. Chat Components (`/components/chat/`)

| Component              | File                         | Priority | Public API | Tested  | Storybook | Docs    |
| ---------------------- | ---------------------------- | -------- | ---------- | ------- | --------- | ------- |
| ClarityChat            | clarity-chat.tsx             | HIGH     | Yes        | Yes     | Yes       | Yes     |
| ClarityChatSimple      | clarity-chat-simple.tsx      | HIGH     | Yes        | Partial | Partial   | Partial |
| ChatWindow             | chat-window.tsx              | HIGH     | Yes        | Yes     | Yes       | Yes     |
| ChatInput              | chat-input.tsx               | HIGH     | Yes        | Yes     | Yes       | Yes     |
| ChatLayout             | chat-layout.tsx              | HIGH     | Yes        | Yes     | Partial   | Partial |
| ChatRecipes            | chat-recipes.tsx             | MEDIUM   | Yes        | Partial | No        | Partial |
| ClarityChatPresets     | clarity-chat-presets.tsx     | MEDIUM   | Yes        | Partial | No        | Partial |
| FloatingChatWidget     | floating-chat-widget.tsx     | MEDIUM   | Yes        | Yes     | Yes       | Partial |
| ResizableChatLayout    | resizable-chat-layout.tsx    | MEDIUM   | Yes        | Yes     | Yes       | Partial |
| VirtualizedMessageList | virtualized-message-list.tsx | HIGH     | Yes        | Yes     | Yes       | Partial |
| TanStackMessageList    | tanstack-message-list.tsx    | HIGH     | Yes        | Yes     | Yes       | Partial |
| MobileChatOptimized    | mobile-chat-optimized.tsx    | LOW      | Internal   | No      | No        | No      |
| OfflineChatSync        | offline-chat-sync.tsx        | LOW      | Internal   | No      | No        | No      |
| ChatWithErrorBoundary  | chat-with-error-boundary.tsx | LOW      | Internal   | No      | No        | No      |

### 2. Message Components (`/components/message/`)

| Component              | File                         | Priority | Public API | Tested  | Storybook | Docs    |
| ---------------------- | ---------------------------- | -------- | ---------- | ------- | --------- | ------- |
| StreamingMessage       | streaming-message.tsx        | HIGH     | Yes        | Partial | Yes       | Partial |
| ThinkingIndicator      | thinking-indicator.tsx       | HIGH     | Yes        | Yes     | Yes       | Partial |
| TypingIndicator        | typing-indicator.tsx         | HIGH     | Yes        | Yes     | Yes       | Partial |
| CitationCard           | citation-card.tsx            | MEDIUM   | Yes        | Partial | Yes       | Partial |
| CopyButton             | copy-button.tsx              | LOW      | Internal   | Partial | No        | No      |
| DeleteButton           | delete-button.tsx            | LOW      | Internal   | Partial | No        | No      |
| EditableMessageContent | editable-message-content.tsx | LOW      | Internal   | No      | No        | No      |
| FeedbackDialog         | feedback-dialog.tsx          | MEDIUM   | Internal   | No      | No        | No      |
| MessageActions         | message-actions.tsx          | MEDIUM   | Internal   | Partial | Partial   | No      |
| MessageActionsSecure   | message-actions-secure.tsx   | LOW      | Internal   | No      | No        | No      |
| MarkdownRenderer       | markdown-renderer.tsx        | HIGH     | Yes        | Yes     | Yes       | Yes     |
| MarkdownCodeBlock      | markdown-code-block.tsx      | MEDIUM   | Internal   | Partial | No        | No      |
| StreamingTextRenderer  | streaming-text-renderer.tsx  | MEDIUM   | Internal   | Partial | Yes       | No      |
| FlowTokenAdapter       | flowtoken-adapter.tsx        | LOW      | Yes        | No      | Yes       | Partial |
| ToolInvocationCard     | tool-invocation-card.tsx     | MEDIUM   | Internal   | Partial | Yes       | No      |
| MessageMetadata        | message-metadata.tsx         | LOW      | Internal   | Partial | Yes       | No      |
| ConfettiAnimation      | confetti-animation.tsx       | LOW      | Internal   | No      | No        | No      |

### 3. AI Components (`/components/ai/`)

| Component                | File                           | Priority | Public API | Tested  | Storybook | Docs    |
| ------------------------ | ------------------------------ | -------- | ---------- | ------- | --------- | ------- |
| Citation                 | citation.tsx                   | HIGH     | Yes        | Partial | Partial   | Partial |
| SourceCitation           | source-citation.tsx            | HIGH     | Yes        | Partial | Partial   | Partial |
| ChainOfThought           | chain-of-thought.tsx           | HIGH     | Yes        | Yes     | Yes       | Partial |
| ThinkingBar              | thinking-bar.tsx               | HIGH     | Yes        | Partial | Yes       | Partial |
| StreamingProgress        | streaming-progress.tsx         | HIGH     | Yes        | Partial | Yes       | Partial |
| TextShimmer              | text-shimmer.tsx               | MEDIUM   | Yes        | Partial | Partial   | Partial |
| ToolExecutionCard        | tool-execution-card.tsx        | MEDIUM   | Yes        | Partial | Partial   | Partial |
| MarkdownRendererEnhanced | markdown-renderer-enhanced.tsx | HIGH     | Yes        | Yes     | Yes       | Partial |
| EnhancedMarkdownRenderer | enhanced-markdown-renderer.tsx | HIGH     | Yes        | Partial | Yes       | No      |
| EnhancedCodeBlock        | enhanced-code-block.tsx        | MEDIUM   | Yes        | Yes     | Yes       | Partial |
| ModelSelector            | model-selector.tsx             | MEDIUM   | Internal   | Yes     | Yes       | No      |
| AgentRunFeed             | agent-run-feed.tsx             | LOW      | Internal   | Partial | Yes       | No      |
| AuditLogViewer           | audit-log-viewer.tsx           | LOW      | Internal   | No      | Yes       | No      |
| CollaborativeEditing     | collaborative-editing.tsx      | LOW      | Internal   | No      | No        | No      |
| KnowledgeBaseViewer      | knowledge-base-viewer.tsx      | LOW      | Internal   | Partial | Yes       | No      |
| PersonaPanel             | persona-panel.tsx              | LOW      | Internal   | Partial | Yes       | No      |
| SafetyStatusCard         | safety-status-card.tsx         | LOW      | Internal   | Partial | Yes       | No      |
| SessionSummaryCard       | session-summary-card.tsx       | LOW      | Internal   | Partial | Yes       | No      |
| WorkflowSuggestionList   | workflow-suggestion-list.tsx   | LOW      | Internal   | Partial | Yes       | No      |

### 4. Code Components (`/components/code/`)

| Component           | File                    | Priority | Public API | Tested  | Storybook | Docs    |
| ------------------- | ----------------------- | -------- | ---------- | ------- | --------- | ------- |
| CodeBlock           | CodeBlock.tsx           | HIGH     | Yes        | Yes     | Yes       | Yes     |
| StreamingCodeBlock  | StreamingCodeBlock.tsx  | HIGH     | Yes        | Partial | Yes       | Partial |
| CodeBlockCopyButton | CodeBlockCopyButton.tsx | MEDIUM   | Internal   | Yes     | Partial   | No      |
| CodeWindowHeader    | CodeWindowHeader.tsx    | LOW      | Internal   | Partial | Partial   | No      |
| InlineCode          | InlineCode.tsx          | MEDIUM   | Internal   | Yes     | Yes       | No      |
| LineNumbers         | LineNumbers.tsx         | LOW      | Internal   | Yes     | No        | No      |

### 5. Input Components (`/components/input/`)

| Component                | File                           | Priority | Public API | Tested  | Storybook | Docs    |
| ------------------------ | ------------------------------ | -------- | ---------- | ------- | --------- | ------- |
| AdvancedChatInput        | advanced-chat-input.tsx        | MEDIUM   | Internal   | Partial | Yes       | No      |
| FileUpload               | file-upload.tsx                | MEDIUM   | Internal   | Partial | Yes       | Partial |
| VoiceInput               | voice-input.tsx                | MEDIUM   | Yes        | Yes     | Yes       | Partial |
| MentionSystem            | mention-system.tsx             | LOW      | Internal   | No      | No        | No      |
| StructuredInputBuilder   | structured-input-builder.tsx   | LOW      | Internal   | Yes     | No        | No      |
| OutputPreferenceSelector | output-preference-selector.tsx | LOW      | Internal   | Yes     | No        | No      |

### 6. Prompt Components (`/components/prompt/`)

| Component             | File                        | Priority | Public API | Tested  | Storybook | Docs    |
| --------------------- | --------------------------- | -------- | ---------- | ------- | --------- | ------- |
| PromptSuggestions     | prompt-suggestions.tsx      | HIGH     | Yes        | Partial | Yes       | Partial |
| FollowUpSuggestions   | follow-up-suggestions.tsx   | HIGH     | Yes        | Partial | Yes       | Partial |
| PromptContainer       | prompt-container.tsx        | MEDIUM   | Yes        | Partial | Partial   | Partial |
| SuggestionCards       | suggestion-cards.tsx        | MEDIUM   | Yes        | Partial | Partial   | Partial |
| PromptPlayground      | prompt-playground.tsx       | LOW      | Internal   | No      | Yes       | No      |
| PromptVariablesEditor | prompt-variables-editor.tsx | LOW      | Internal   | No      | No        | No      |
| PromptVersionHistory  | prompt-version-history.tsx  | LOW      | Internal   | No      | No        | No      |

### 7. UI Components (`/components/ui/`)

| Component          | File                    | Priority | Public API | Tested  | Storybook | Docs    |
| ------------------ | ----------------------- | -------- | ---------- | ------- | --------- | ------- |
| Toast              | toast.tsx               | HIGH     | Yes        | Partial | Yes       | Partial |
| SonnerToast        | sonner-toast.tsx        | HIGH     | Yes        | Partial | Yes       | Partial |
| Skeleton           | skeleton.tsx            | MEDIUM   | Yes        | Partial | Yes       | Yes     |
| SkeletonEnhanced   | skeleton-enhanced.tsx   | MEDIUM   | Internal   | Partial | Yes       | Yes     |
| SkeletonAdvanced   | skeleton-advanced.tsx   | LOW      | Internal   | Partial | Partial   | Partial |
| EmptyState         | empty-state.tsx         | MEDIUM   | Yes        | Partial | Yes       | Partial |
| AnimatedDots       | animated-dots.tsx       | LOW      | Internal   | Partial | Partial   | No      |
| Progress           | progress.tsx            | MEDIUM   | Internal   | Partial | Yes       | Yes     |
| BatteryIndicator   | battery-indicator.tsx   | LOW      | Internal   | No      | No        | No      |
| Tabs               | tabs.tsx                | MEDIUM   | Internal   | Partial | Partial   | No      |
| Draggable          | draggable.tsx           | LOW      | Internal   | Partial | Yes       | No      |
| CollapsibleSection | collapsible-section.tsx | LOW      | Internal   | No      | No        | No      |
| LinkPreview        | link-preview.tsx        | LOW      | Internal   | Yes     | No        | No      |
| Ripple             | ripple.tsx              | LOW      | Internal   | Partial | Yes       | No      |

### 8. Feedback Components (`/components/feedback/`)

| Component             | File                        | Priority | Public API | Tested  | Storybook | Docs    |
| --------------------- | --------------------------- | -------- | ---------- | ------- | --------- | ------- |
| ErrorBoundary         | error-boundary.tsx          | HIGH     | Yes        | Yes     | Yes       | Partial |
| ErrorBoundaryEnhanced | error-boundary-enhanced.tsx | MEDIUM   | Internal   | Partial | Partial   | No      |
| ErrorMessage          | error-message.tsx           | MEDIUM   | Internal   | Partial | Partial   | No      |
| NetworkStatus         | network-status.tsx          | HIGH     | Yes        | Partial | Yes       | Partial |
| NetworkStatusBanner   | network-status-banner.tsx   | LOW      | Internal   | Partial | Partial   | No      |
| RetryButton           | retry-button.tsx            | LOW      | Internal   | No      | No        | No      |
| ConsoleAlertHandler   | console-alert-handler.tsx   | LOW      | Internal   | No      | No        | No      |

### 9. Navigation Components (`/components/navigation/`)

| Component              | File                         | Priority | Public API | Tested  | Storybook | Docs    |
| ---------------------- | ---------------------------- | -------- | ---------- | ------- | --------- | ------- |
| CommandPalette         | command-palette.tsx          | MEDIUM   | Yes        | Yes     | Yes       | Partial |
| CommandPaletteEnhanced | command-palette-enhanced.tsx | LOW      | Internal   | Partial | Partial   | No      |
| KeyboardShortcutsModal | keyboard-shortcuts-modal.tsx | LOW      | Internal   | Partial | No        | No      |
| SkipLinks              | skip-links.tsx               | MEDIUM   | Internal   | Partial | No        | Partial |
| KeyboardNavigationDemo | keyboard-navigation-demo.tsx | LOW      | Internal   | No      | No        | No      |
| ContextMenu            | context-menu.tsx             | MEDIUM   | Internal   | Yes     | Yes       | No      |

### 10. Search Components (`/components/search/`)

| Component                     | File                                 | Priority | Public API | Tested  | Storybook | Docs    |
| ----------------------------- | ------------------------------------ | -------- | ---------- | ------- | --------- | ------- |
| MessageSearch                 | message-search.tsx                   | MEDIUM   | Yes        | Partial | Yes       | Partial |
| AdvancedMessageSearch         | advanced-message-search.tsx          | LOW      | Internal   | Partial | Partial   | No      |
| AdvancedMessageSearchSemantic | advanced-message-search-semantic.tsx | LOW      | Internal   | No      | No        | No      |

### 11. Token Components (`/components/token/`)

| Component                  | File                             | Priority | Public API | Tested  | Storybook | Docs    |
| -------------------------- | -------------------------------- | -------- | ---------- | ------- | --------- | ------- |
| TokenCounter               | token-counter.tsx                | HIGH     | Yes        | Partial | Yes       | Partial |
| TokenBudgetBar             | token-budget-bar.tsx             | MEDIUM   | Internal   | Yes     | Yes       | Partial |
| TokenOptimizationDashboard | token-optimization-dashboard.tsx | LOW      | Internal   | Partial | Yes       | No      |
| TokenOptimizationBadge     | token-optimization-badge.tsx     | LOW      | Internal   | Partial | Yes       | No      |

### 12. Theme Components (`/components/theme/`)

| Component            | File                       | Priority | Public API | Tested  | Storybook | Docs |
| -------------------- | -------------------------- | -------- | ---------- | ------- | --------- | ---- |
| ThemeCustomizer      | ThemeCustomizer.tsx        | MEDIUM   | Internal   | Partial | Partial   | No   |
| ThemeSwitcher        | theme-switcher.tsx         | MEDIUM   | Internal   | Partial | Partial   | No   |
| ThemeSelector        | theme-selector.tsx         | LOW      | Internal   | Partial | Partial   | No   |
| ThemePreview         | theme-preview.tsx          | LOW      | Internal   | Partial | Partial   | No   |
| ThemeContrastChecker | theme-contrast-checker.tsx | LOW      | Internal   | Yes     | Partial   | No   |

### 13. Context/Memory Components (`/components/context/`)

| Component         | File                   | Priority | Public API | Tested  | Storybook | Docs |
| ----------------- | ---------------------- | -------- | ---------- | ------- | --------- | ---- |
| ContextManager    | context-manager.tsx    | MEDIUM   | Internal   | Partial | Yes       | No   |
| ContextCard       | context-card.tsx       | MEDIUM   | Internal   | Partial | Yes       | No   |
| ContextVisualizer | context-visualizer.tsx | LOW      | Internal   | Partial | Yes       | No   |
| MemoryInspector   | memory-inspector.tsx   | LOW      | Internal   | Partial | Yes       | No   |
| HistoryManager    | history-manager.tsx    | LOW      | Internal   | Yes     | Partial   | No   |
| ProjectSidebar    | project-sidebar.tsx    | LOW      | Internal   | Partial | Yes       | No   |
| SettingsPanel     | settings-panel.tsx     | LOW      | Internal   | Partial | Yes       | No   |

### 14. Conversation Components (`/components/conversation/`)

| Component                    | File                               | Priority | Public API | Tested  | Storybook | Docs |
| ---------------------------- | ---------------------------------- | -------- | ---------- | ------- | --------- | ---- |
| ConversationList             | conversation-list.tsx              | MEDIUM   | Internal   | Partial | Yes       | No   |
| ConversationTimeline         | conversation-timeline.tsx          | LOW      | Internal   | Partial | Yes       | No   |
| ConversationBranchVisualizer | conversation-branch-visualizer.tsx | LOW      | Internal   | Partial | Yes       | No   |
| ConversationSharing          | conversation-sharing.tsx           | LOW      | Internal   | No      | No        | No   |
| ConversationSummarizer       | conversation-summarizer.tsx        | LOW      | Internal   | No      | No        | No   |

### 15. Dashboard Components (`/components/dashboard/`)

| Component            | File                      | Priority | Public API | Tested  | Storybook | Docs |
| -------------------- | ------------------------- | -------- | ---------- | ------- | --------- | ---- |
| AnalyticsDashboard   | analytics-dashboard.tsx   | LOW      | Internal   | Partial | Yes       | No   |
| PerformanceDashboard | performance-dashboard.tsx | LOW      | Internal   | Partial | Yes       | No   |
| ABTestingDashboard   | ab-testing-dashboard.tsx  | LOW      | Internal   | Partial | Yes       | No   |
| UsageDashboard       | usage-dashboard.tsx       | LOW      | Internal   | Partial | Yes       | No   |

### 16. Enterprise Components (`/components/enterprise/`)

| Component           | File                    | Priority | Public API | Tested  | Storybook | Docs |
| ------------------- | ----------------------- | -------- | ---------- | ------- | --------- | ---- |
| ApiTokenManager     | ApiTokenManager.tsx     | LOW      | Internal   | Partial | No        | Yes  |
| AuthTenantDashboard | AuthTenantDashboard.tsx | LOW      | Internal   | Partial | No        | Yes  |
| SSOConfigWizard     | SSOConfigWizard.tsx     | LOW      | Internal   | Partial | No        | Yes  |
| SeatInviteDialog    | SeatInviteDialog.tsx    | LOW      | Internal   | Partial | No        | Yes  |

### 17. A/B Testing Components (`/components/ab-testing/`)

| Component      | File                | Priority | Public API | Tested  | Storybook | Docs |
| -------------- | ------------------- | -------- | ---------- | ------- | --------- | ---- |
| ExperimentCard | experiment-card.tsx | LOW      | Internal   | Partial | Partial   | No   |
| ExperimentList | experiment-list.tsx | LOW      | Internal   | Partial | Partial   | No   |
| VariantCard    | variant-card.tsx    | LOW      | Internal   | Partial | Partial   | No   |
| WinnerBanner   | winner-banner.tsx   | LOW      | Internal   | No      | Partial   | No   |

### 18. AI-Ops Components (`/components/ai-ops/`)

| Component           | File                    | Priority | Public API | Tested  | Storybook | Docs |
| ------------------- | ----------------------- | -------- | ---------- | ------- | --------- | ---- |
| EvaluationDashboard | EvaluationDashboard.tsx | LOW      | Internal   | Partial | Yes       | Yes  |
| PromptTestHarness   | PromptTestHarness.tsx   | LOW      | Internal   | Partial | No        | Yes  |
| SafetyReviewConsole | SafetyReviewConsole.tsx | LOW      | Internal   | Partial | Yes       | Yes  |

### 19. Media/Export Components (`/components/media/`)

| Component           | File                     | Priority | Public API | Tested  | Storybook | Docs    |
| ------------------- | ------------------------ | -------- | ---------- | ------- | --------- | ------- |
| ExportDialog        | export-dialog.tsx        | MEDIUM   | Yes        | Partial | Yes       | Partial |
| BatchExportDialog   | batch-export-dialog.tsx  | LOW      | Internal   | Partial | Yes       | No      |
| CalendarIntegration | calendar-integration.tsx | LOW      | Internal   | No      | No        | No      |
| EmailIntegration    | email-integration.tsx    | LOW      | Internal   | No      | No        | No      |
| DocumentIntegration | document-integration.tsx | LOW      | Internal   | No      | No        | No      |

---

## Hook Inventory

### 1. Chat Hooks (`/hooks/chat/`)

| Hook                    | File                           | Priority | Public API               | Tested  | Docs    |
| ----------------------- | ------------------------------ | -------- | ------------------------ | ------- | ------- |
| useClarityChat          | use-clarity-chat.ts            | HIGH     | Yes                      | Partial | Yes     |
| useChat                 | use-chat.ts                    | HIGH     | Yes (as useHeadlessChat) | Yes     | Yes     |
| useChatEnhanced         | use-chat-enhanced.ts           | HIGH     | Yes                      | Partial | Yes     |
| useChatUnified          | use-chat-unified.ts            | MEDIUM   | Internal                 | Partial | Partial |
| useChatSimple           | use-chat-simple.ts             | MEDIUM   | Internal                 | Partial | Partial |
| useChatComposable       | use-chat-composable.ts         | LOW      | Internal                 | Partial | No      |
| useChatHandlers         | use-chat-handlers.ts           | MEDIUM   | Internal                 | Partial | Yes     |
| useChatHistory          | use-chat-history.ts            | MEDIUM   | Internal                 | Partial | Partial |
| useClarityChatWithTools | use-clarity-chat-with-tools.ts | HIGH     | Yes                      | Partial | Yes     |
| useClarityObject        | use-clarity-object.ts          | HIGH     | Yes                      | Partial | Yes     |
| useAgent                | use-agent.ts                   | LOW      | Internal                 | Partial | Partial |
| useAssistant            | use-assistant.ts               | LOW      | Internal                 | Partial | Yes     |
| useCompletion           | use-completion.ts              | MEDIUM   | Internal                 | Partial | Yes     |
| useRagPipeline          | use-rag-pipeline.ts            | LOW      | Internal                 | Partial | No      |

### 2. Streaming Hooks (`/hooks/streaming/`)

| Hook            | File                 | Priority | Public API | Tested  | Docs    |
| --------------- | -------------------- | -------- | ---------- | ------- | ------- |
| useStreaming    | use-streaming.ts     | HIGH     | Yes        | Yes     | Partial |
| useSmoothedText | use-smoothed-text.ts | HIGH     | Yes        | Partial | Partial |
| useStreamStatus | use-stream-status.ts | HIGH     | Yes        | Partial | Partial |
| useStreamableUI | use-streamable-ui.ts | MEDIUM   | Internal   | Yes     | No      |

### 3. Clarity Tokens Hooks (`/hooks/clarity-tokens/`)

| Hook                | File                     | Priority | Public API | Tested  | Docs    |
| ------------------- | ------------------------ | -------- | ---------- | ------- | ------- |
| useTokenCounter     | use-token-counter.ts     | HIGH     | Internal   | Yes     | Partial |
| useTokenBudget      | use-token-budget.ts      | HIGH     | Internal   | Partial | Partial |
| useTokenLimitGuard  | use-token-limit-guard.ts | MEDIUM   | Internal   | Partial | No      |
| useCostTracker      | use-cost-tracker.ts      | MEDIUM   | Internal   | Partial | No      |
| useCostEstimator    | use-cost-estimator.ts    | MEDIUM   | Internal   | Yes     | No      |
| usePromptCompressor | use-prompt-compressor.ts | LOW      | Internal   | Partial | No      |
| useSemanticCache    | use-semantic-cache.ts    | LOW      | Internal   | Partial | No      |
| useExactCache       | use-exact-cache.ts       | LOW      | Internal   | Partial | No      |
| useResponseCache    | use-response-cache.ts    | LOW      | Internal   | Partial | No      |
| useEmbeddingCache   | use-embedding-cache.ts   | LOW      | Internal   | Partial | No      |
| useStreamOptimizer  | use-stream-optimizer.ts  | LOW      | Internal   | Partial | No      |
| useContextWindow    | use-context-window.ts    | LOW      | Internal   | Partial | No      |
| useContextInjector  | use-context-injector.ts  | LOW      | Internal   | Partial | No      |
| useAdaptiveModel    | use-adaptive-model.ts    | LOW      | Internal   | Partial | No      |
| useVectorSearch     | use-vector-search.ts     | LOW      | Internal   | Partial | No      |
| useTokenThrottle    | use-token-throttle.ts    | LOW      | Internal   | Partial | No      |

### 4. UI Hooks (`/hooks/ui/`)

| Hook             | File                  | Priority | Public API | Tested | Docs    |
| ---------------- | --------------------- | -------- | ---------- | ------ | ------- |
| useClipboard     | use-clipboard.ts      | HIGH     | Yes        | Yes    | Yes     |
| useAutoScroll    | use-auto-scroll.ts    | HIGH     | Yes        | Yes    | Yes     |
| useThrottle      | use-throttle.ts       | HIGH     | Yes        | Yes    | Partial |
| useDebounce      | use-debounce.ts       | MEDIUM   | Internal   | Yes    | Yes     |
| useReducedMotion | use-reduced-motion.ts | MEDIUM   | Yes        | Yes    | Partial |
| useEventListener | use-event-listener.ts | MEDIUM   | Internal   | Yes    | Yes     |
| useMergedRef     | use-merged-ref.ts     | MEDIUM   | Internal   | Yes    | Partial |
| useMediaQuery    | use-media-query.ts    | MEDIUM   | Internal   | Yes    | Partial |
| useWindowSize    | use-window-size.ts    | LOW      | Internal   | Yes    | Partial |
| useMounted       | use-mounted.ts        | LOW      | Internal   | Yes    | Partial |
| usePrevious      | use-previous.ts       | LOW      | Internal   | Yes    | Partial |
| useToggle        | use-toggle.ts         | LOW      | Internal   | Yes    | Partial |

### 5. Keyboard Hooks (`/hooks/keyboard/`)

| Hook                        | File                              | Priority | Public API | Tested  | Docs    |
| --------------------------- | --------------------------------- | -------- | ---------- | ------- | ------- |
| useKeyboardShortcuts        | use-keyboard-shortcuts.ts         | HIGH     | Yes        | Partial | Yes     |
| useCommandPalette           | use-command-palette.ts            | MEDIUM   | Yes        | Yes     | Yes     |
| useCommandPaletteCommands   | use-command-palette-commands.ts   | LOW      | Internal   | Partial | Yes     |
| useKeyboardNavigation       | use-keyboard-navigation.ts        | MEDIUM   | Internal   | Partial | Partial |
| useFocusedKeyboardShortcuts | use-focused-keyboard-shortcuts.ts | LOW      | Internal   | Partial | Yes     |

### 6. Storage Hooks (`/hooks/storage/`)

| Hook            | File                 | Priority | Public API | Tested  | Docs |
| --------------- | -------------------- | -------- | ---------- | ------- | ---- |
| useLocalStorage | use-local-storage.ts | HIGH     | Yes        | Yes     | Yes  |
| useIndexedDB    | use-indexed-db.ts    | MEDIUM   | Internal   | Partial | Yes  |
| useMemoryStore  | use-memory-store.ts  | LOW      | Internal   | Partial | No   |

### 7. Resilience Hooks (`/hooks/resilience/`)

| Hook                    | File                         | Priority | Public API | Tested | Docs    |
| ----------------------- | ---------------------------- | -------- | ---------- | ------ | ------- |
| useRetryWithBackoff     | use-retry-with-backoff.ts    | HIGH     | Yes        | Yes    | Partial |
| useCircuitBreaker       | use-circuit-breaker.ts       | MEDIUM   | Internal   | Yes    | No      |
| useRequestDeduplication | use-request-deduplication.ts | MEDIUM   | Internal   | Yes    | No      |

### 8. Token Hooks (`/hooks/token/`)

| Hook                  | File                        | Priority | Public API | Tested  | Docs    |
| --------------------- | --------------------------- | -------- | ---------- | ------- | ------- |
| useTokenTracker       | use-token-tracker.ts        | HIGH     | Yes        | Yes     | Partial |
| useTokenBudgetMonitor | use-token-budget-monitor.ts | MEDIUM   | Internal   | Yes     | Partial |
| useTokenRateLimiter   | use-token-rate-limiter.ts   | LOW      | Internal   | Partial | No      |

### 9. Message Hooks (`/hooks/message/`)

| Hook                 | File                      | Priority | Public API | Tested | Docs    |
| -------------------- | ------------------------- | -------- | ---------- | ------ | ------- |
| useMessageOperations | use-message-operations.ts | MEDIUM   | Internal   | Yes    | Partial |
| useOptimisticMessage | use-optimistic-message.ts | MEDIUM   | Internal   | Yes    | Partial |

### 10. Dashboard Hooks (`/hooks/dashboard/`)

| Hook                    | File                          | Priority | Public API | Tested  | Docs |
| ----------------------- | ----------------------------- | -------- | ---------- | ------- | ---- |
| useDashboardData        | use-dashboard-data.ts         | LOW      | Internal   | Yes     | Yes  |
| useDashboardComposer    | use-dashboard-composer.ts     | LOW      | Internal   | Yes     | Yes  |
| useDashboardPerformance | use-dashboard-performance.tsx | LOW      | Internal   | Partial | Yes  |

### 11. Input Hooks (`/hooks/input/`)

| Hook                 | File                       | Priority | Public API | Tested  | Docs    |
| -------------------- | -------------------------- | -------- | ---------- | ------- | ------- |
| useVoiceInput        | use-voice-input.ts         | MEDIUM   | Yes        | Partial | Partial |
| useCharacterCounter  | use-character-counter.ts   | LOW      | Internal   | Partial | Yes     |
| useRealisticTyping   | use-realistic-typing.ts    | LOW      | Internal   | Partial | No      |
| useSubmitButtonState | use-submit-button-state.ts | LOW      | Internal   | Partial | No      |
| useMobileKeyboard    | use-mobile-keyboard.ts     | LOW      | Internal   | Partial | No      |

### 12. Security Hooks (`/hooks/security/`)

| Hook        | File            | Priority | Public API | Tested  | Docs    |
| ----------- | --------------- | -------- | ---------- | ------- | ------- |
| useSecurity | use-security.ts | MEDIUM   | Internal   | Partial | Partial |

### 13. Model Hooks (`/hooks/model/`)

| Hook                   | File                         | Priority | Public API | Tested  | Docs |
| ---------------------- | ---------------------------- | -------- | ---------- | ------- | ---- |
| useDynamicModelRouting | use-dynamic-model-routing.ts | LOW      | Internal   | Partial | Yes  |

### 14. Theme Hooks (`/hooks/theme/`)

| Hook              | File                   | Priority | Public API | Tested  | Docs    |
| ----------------- | ---------------------- | -------- | ---------- | ------- | ------- |
| useThemeColors    | use-theme-colors.ts    | MEDIUM   | Internal   | Partial | Partial |
| useThemeAnalytics | use-theme-analytics.ts | LOW      | Internal   | Partial | No      |

### 15. Context Hooks (`/hooks/context/`)

| Hook              | File                    | Priority | Public API | Tested | Docs |
| ----------------- | ----------------------- | -------- | ---------- | ------ | ---- |
| useContextMonitor | use-context-monitor.tsx | LOW      | Internal   | Yes    | Yes  |

### 16. Performance Hooks (`/hooks/performance/`)

| Hook                         | File        | Priority | Public API | Tested  | Docs |
| ---------------------------- | ----------- | -------- | ---------- | ------- | ---- |
| Performance hooks (enhanced) | enhanced.ts | LOW      | Internal   | Partial | No   |

---

## Public API Surface

### Exported from `@clarity-chat/react`

#### Core Components (Highest Priority)

- `ClarityChat` - Main drop-in chat component
- `ClarityChatPresets` - Preset configurations
- `ChatComplete`, `ChatWithMemory`, `ChatWithAnalytics`, `ChatWithPreset` - Recipe components

#### Core Hooks (Highest Priority)

- `useClarityChat` - Main chat hook
- `useHeadlessChat` (alias for useChat) - Headless hook
- `useClarityObject` - Structured output hook
- `useClarityChatWithTools` - Tool integration hook

#### AI Components

- `Citation`, `SourceCitation` - Citation display
- `MarkdownRendererEnhanced`, `EnhancedMarkdownRenderer` - Markdown rendering
- `ChainOfThought` - AI reasoning visualization
- `ThinkingBar` - AI processing indicator
- `StreamStatusProgress` - Streaming progress
- `TextShimmer` family - Loading indicators
- `ToolExecutionCard` - Tool execution display
- `CodeBlock`, `StreamingCodeBlock`, `EnhancedCodeBlock` - Code display

#### UI Components

- `ChatWindow`, `ChatInput`, `ChatLayout` - Chat building blocks
- `FloatingChatWidget`, `ResizableChatLayout` - Layout variants
- `MessageList`, `TanStackMessageList` - Message lists
- `StreamingMessage`, `ThinkingIndicator`, `TypingIndicator` - Message states
- `FlowTokenStreamingText`, `FlowTokenMarkdown` - FlowToken integration

#### Theme & Context

- `ThemeProvider`, `useTheme` - Theming
- `MemoryProvider`, `useMemoryContext` - Memory system
- `TokenBudgetProvider`, `useTokenBudget` - Token management

#### License (re-exported from @clarity-chat/license)

- `LicenseInfo`, `verifyLicense`, `isLicenseValid`
- `useLicenseStatus`, `useIsLicensed`, `useHasPlan`, `useLicenseInfo`
- `LicenseProvider`, `LicenseGate`, `Watermark`
- `withLicense`

#### Utilities

- `cn` - CSS class utility
- `createUserMessage`, `createAssistantMessage`, `createSystemMessage`
- Type guards: `isUserMessage`, `isAssistantMessage`, `hasTextContent`, `extractTextContent`
- Animation utilities

#### Additional Hooks (Public)

- `useToast`, `ToastProvider` - Toast notifications
- `useKeyboardShortcuts` - Keyboard shortcuts
- `useCommandPalette` - Command palette
- `useClipboard` - Clipboard operations
- `useLocalStorage` - Local storage
- `useRetryWithBackoff` - Retry logic
- `useVoiceInput` - Voice input
- `useThrottledCallback` - Throttling
- `useTokenTracker` - Token tracking
- `useStreaming` - Streaming
- `useSmoothedText` - Text smoothing
- `useStreamStatus` - Stream status
- `useReducedMotion` - Motion preferences
- `useFocusTrap`, `useFocusRestoration` - Focus management
- `useAutoScroll` - Auto-scrolling

#### Primitives

- `ChatPrimitive`, `ChatRoot`, `ChatMessages`, `ChatMessage`
- `ChatMessageContent`, `ChatMessageActions`
- `ChatInputPrimitive`, `ChatCopyButton`, `ChatRegenerateButton`
- `ChatDeleteButton`, `ChatEmptyState`, `ChatLoadingIndicator`

---

## Documentation Coverage

### Docs Site Structure (`apps/docs/content/`)

#### API Reference

- `/api/memory/` - Memory package docs
- `/api/react/` - React package docs
- `/api/types/` - Types package docs

#### Component Docs

- Animation components: animated-grid, animated-list, bounce-in, fade-presence, etc.
- Enterprise: api-token-manager, auth-tenant-dashboard, sso-config-wizard, seat-invite-dialog
- AI-Ops: evaluation-dashboard, prompt-test-harness, safety-review-console
- Skeleton: skeleton, skeleton-avatar, skeleton-button, skeleton-card, etc.
- Feedback: progress, streaming-progress
- Effects: confetti-effect, glow-effect, ripple-effect

#### Hook Docs (100+ documented)

- Core: use-clarity-chat, use-chat, use-chat-enhanced, use-clarity-object
- Streaming: use-streaming, use-smoothed-text
- UI: use-clipboard, use-auto-scroll, use-debounce, use-throttle
- Storage: use-local-storage, use-indexed-db
- Dashboard: use-dashboard-data, use-dashboard-composer, use-dashboard-performance
- And many more...

### Documentation Gaps Identified

1. Some PUBLIC API components missing dedicated docs
2. Hook return types not always fully documented
3. Some examples use outdated patterns
4. Migration guides incomplete

---

## Storybook Coverage

### Structure (`apps/storybook/stories/`)

#### Advanced

- AI: AIOperations, AgentRunFeed, ClarityToolResult, FollowUpSuggestions, PromptLibrary,
  ToolInvocationCard
- Analytics: ABTesting, Analytics, Performance, TokenOptimization, Usage dashboards
- Enterprise: AuditLogViewer, BatchExportDialog, EvaluationDashboard, ExportDialog, SafetyReview
- Memory: ContextManager, ContextVisualizer, DocumentViewer, KnowledgeBase, MemoryInspector
- Streaming: FlowToken, StreamBlock, StreamCancellation, StreamingExamples, StreamingTextRenderer

#### Components

- ChatInput: Essentials
- ChatWindow: Enterprise, Essentials
- DataDisplay: AnimatedList, Avatar, Badge, Card, Citation, Context, Message, Skeleton, etc.
- Feedback: EmptyState, ErrorBoundary, Network, Response, Safety, Session, Toast, Thinking
- Inputs: AdvancedChatInput, Button, ChatInput, Checkbox, FileUpload, Input, Textarea, VoiceInput
- Layout: ChatWindow, ConversationList, Dialog, Drawer, ProjectSidebar, Resizable, Settings
- MessageList: Essentials
- Navigation: CommandPalette, ContextMenu, Draggable, DropdownMenu, Popover
- TokenCounter: Essentials

#### Examples

- AdvancedInteractions
- CompositeExamples
- DocumentationPatterns
- HooksShowcase
- IndustrySolutions

#### Foundation

- AnimationPlayground

### Storybook Gaps Identified

1. Many internal components missing stories
2. Some stories lack comprehensive controls
3. A11y addon stories incomplete
4. Visual regression testing not fully set up

---

## Test Coverage

### Test Files Found

#### Component Tests (`/components/__tests__/`)

- TokenCostPreview.test.tsx
- chain-of-thought.test.tsx
- chat-input.test.tsx
- chat-layout.test.tsx
- chat-window.test.tsx (+ enhanced)
- clarity-chat.test.tsx
- clarity-tool-result.test.tsx
- command-palette.test.tsx
- context-menu.test.tsx
- enhanced-code-block.test.tsx
- error-boundary.test.tsx
- history-manager.test.tsx
- link-preview.test.tsx
- markdown-renderer-enhanced.test.tsx
- message-list.test.tsx
- message.test.tsx
- model-selector.test.tsx
- output-preference-selector.test.tsx
- react-19-ref-integration.test.tsx
- stream-block.test.tsx
- structured-input-builder.test.tsx
- theme-contrast-checker.test.tsx
- thinking-indicator.test.tsx
- token-budget-bar.test.tsx
- typing-indicator.test.tsx
- virtualized-message-list.test.tsx
- voice-input.test.tsx

#### Hook Tests (`/hooks/__tests__/`)

- use-auto-scroll.test.ts
- use-chat.test.ts
- use-circuit-breaker.test.ts
- use-clipboard.test.ts
- use-command-palette.test.ts
- use-context-monitor.test.ts
- use-dashboard-composer.test.ts
- use-dashboard-data.test.ts
- use-debounce.test.ts
- use-error-recovery.test.ts
- use-event-listener.test.ts
- use-local-storage.test.ts
- use-media-query.test.ts
- use-merged-ref.test.ts
- use-message-operations.test.ts
- use-mounted.test.ts
- use-optimistic-message.test.ts
- use-previous.test.ts
- use-reduced-motion.test.ts
- use-request-deduplication.test.ts
- use-retry-with-backoff.test.ts
- use-streamable-ui.test.ts
- use-streaming-sse.test.ts
- use-streaming-websocket.test.ts
- use-streaming.test.ts
- use-throttle.test.ts
- use-toggle.test.ts
- use-token-budget-monitor.test.ts
- use-token-tracker.test.ts
- use-window-size.test.ts

#### Specialized Tests

- `/hooks/clarity-tokens/__tests__/` - Cost estimator, token counter tests
- `/components/chat/__tests__/` - Floating widget, resizable layout, tanstack list tests
- `/components/code/__tests__/` - CodeBlock, CodeBlockHeader, InlineCode, LineNumbers tests

### Test Coverage Gaps

1. Many components have no tests
2. Integration tests limited
3. E2E tests need expansion
4. Accessibility tests incomplete
5. Visual regression tests not found

---

## Dependency Map

### Component Dependencies on Hooks

```
ClarityChat
├── useClarityChat
├── useAutoScroll
├── useKeyboardShortcuts
└── useTheme

ChatWindow
├── useAutoScroll
├── useKeyboardNavigation
└── useFocusTrap

TanStackMessageList
├── @tanstack/react-virtual
├── useAutoScroll
└── useJumpToBottom

StreamingMessage
├── useStreaming
├── useSmoothedText
└── useStreamStatus

CodeBlock
├── prismjs / highlight.js / shiki
└── useClipboard

ChainOfThought
├── useChainOfThought
└── Animation utilities

ThinkingBar
├── useThinkingBar
└── Animation utilities
```

### Hook Dependencies

```
useClarityChat
├── useChat (internal enhanced version)
├── useStreaming
├── useRetryWithBackoff
└── useCircuitBreaker

useChat
├── useStreaming
├── useMessageOperations
└── useOptimisticMessage

useTokenTracker
├── js-tiktoken
└── useThrottledCallback

useCommandPalette
├── useKeyboardShortcuts
└── useFocusTrap
```

---

## Issues Register

### Critical Issues (P0)

_To be populated during Phase 3_

### High Priority Issues (P1)

_To be populated during Phase 3_

### Medium Priority Issues (P2)

_To be populated during Phase 3_

### Low Priority Issues (P3)

_To be populated during Phase 3_

---

## Prioritization Matrix

### Tier 1: Critical Path (HIGH Priority)

Core components and hooks that are essential for basic chat functionality.

**Components:**

1. ClarityChat
2. ChatWindow
3. ChatInput
4. MessageList / VirtualizedMessageList / TanStackMessageList
5. StreamingMessage
6. ThinkingIndicator
7. TypingIndicator
8. ErrorBoundary
9. NetworkStatus
10. CodeBlock
11. MarkdownRendererEnhanced

**Hooks:**

1. useClarityChat
2. useChat / useHeadlessChat
3. useClarityChatWithTools
4. useClarityObject
5. useStreaming
6. useSmoothedText
7. useStreamStatus
8. useAutoScroll
9. useClipboard
10. useKeyboardShortcuts

### Tier 2: Important Features (MEDIUM Priority)

Features that enhance the core experience.

**Components:**

- FloatingChatWidget
- ResizableChatLayout
- ChatLayout
- ChainOfThought
- ThinkingBar
- StreamingProgress
- Citation / SourceCitation
- Toast / SonnerToast
- CommandPalette
- PromptSuggestions / FollowUpSuggestions
- TokenCounter
- VoiceInput
- ExportDialog

**Hooks:**

- useCommandPalette
- useLocalStorage
- useRetryWithBackoff
- useCircuitBreaker
- useTokenTracker
- useVoiceInput
- useTheme
- useMemoryContext

### Tier 3: Extended Features (LOW Priority)

Advanced features and internal utilities.

**Components:**

- Dashboard components
- Enterprise components
- A/B Testing components
- AI-Ops components
- Internal utilities

**Hooks:**

- Clarity Tokens advanced hooks
- Dashboard hooks
- Performance hooks
- Model routing hooks

---

## Next Steps

1. **Phase 2**: Create detailed prioritization matrix with acceptance criteria
2. **Phase 3**: Begin deep review of Tier 1 components/hooks
3. **Phase 4**: Document and fix identified issues
4. **Phase 5**: Comprehensive testing
5. **Phase 6**: Storybook enhancement
6. **Phase 7**: Documentation alignment

---

_Last Updated: January 2026_ _Audit Status: Phase 1 Complete_
