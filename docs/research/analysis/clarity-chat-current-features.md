# Clarity Chat Current Features

> **Comprehensive inventory of all features, components, hooks, and utilities**
>
> Last Updated: January 27, 2026 Package Version: 1.0+

---

## Table of Contents

1. [Components](#components)
2. [Hooks](#hooks)
3. [Utilities](#utilities)
4. [SDK Features](#sdk-features)
5. [Support Features](#support-features)

---

## Components

**Total Component Files: 438**

### Chat Components

#### Core Chat

- **ClarityChatApp** - Full-featured chat application with preset support (NEW - Recommended)
  - Features: Streaming, memory, token optimization, RAG, tools, safety
  - Presets: simple, pro, memory, rag, tools, enterprise
  - One-line setup with automatic feature integration
- **ClarityChat** - Legacy drop-in chat component (still supported)
- **ChatWindow** - UI-only chat window container
  - Features: Responsive design, scrollable message area, header/footer slots
- **ChatInput** - Feature-rich message input
  - Features: Multi-line support, file upload, mentions, shortcuts
- **AdvancedChatInput** - Enhanced input with structured data
  - Features: Rich text editing, formatting toolbar, templates
- **PillChatInput** - Modern pill-shaped chat input
  - Features: Compact design, inline actions, modern aesthetics
- **VirtualizedMessageList** - Optimized message list for large conversations
  - Features: Virtual scrolling, performance optimization, 1000+ messages support
- **FollowUpSuggestions** - AI-generated follow-up question suggestions
- **EmptyChatState** - Empty state placeholder for new chats

#### Chat Primitives

- **ChatPrimitive.Root** - Headless chat container
- **ChatPrimitive.Messages** - Message list primitive
- **ChatPrimitive.Message** - Individual message primitive
- **ChatPrimitive.MessageContent** - Message content renderer
- **ChatPrimitive.MessageActions** - Message action buttons
- **ChatPrimitive.CopyButton** - Copy message button
- **ChatPrimitive.RegenerateButton** - Regenerate response button
- **ChatPrimitive.Input** - Input primitive

#### Layout Components

- **ChatLayout** - Basic chat layout structure
- **ResizableChatLayout** - Resizable panel layout
- **FloatingChatWidget** - Floating chat button/widget

### Message Components

#### Core Message Display

- **Message** - Base message component
  - Features: Role-based styling, metadata display, actions
- **MessageList** - Standard message list
- **MessageOptimized** - Performance-optimized message rendering
- **MessageMetadata** - Message timestamp, status, tokens
- **MessageThreadView** - Threaded conversation view
- **ThreadList** - List of conversation threads

#### Message Bubbles

- **MessageBubble** - Modern message bubble with role-based styling
- **UserMessage** - Styled user message bubble
- **AssistantMessage** - Styled AI assistant message bubble
- **SystemMessage** - Styled system message bubble
- **MessageGroup** - Grouped messages by timestamp/sender

#### Streaming Components

- **StreamingMessage** - Real-time streaming message display
  - Features: Character-by-character rendering, smooth animations
- **StreamingTextRenderer** - Optimized text streaming renderer
- **StreamBlock** - Block-level streaming component
- **StreamCancellation** - Cancel streaming controls
- **StreamingTextShimmer** - Shimmer effect for streaming text
- **StreamingCursor** - Animated cursor for streaming indicator

#### Message Indicators

- **ThinkingIndicator** - AI processing indicator
- **TypingIndicator** - Typing animation (dot animation, wave, pulse variants)
- **TimeSeparator** - Time-based message separators
- **ThinkingBar** - AI processing status bar with progress
- **ThinkingPill** - Lightweight pill-shaped thinking indicator

#### Tool & Citation Components

- **CitationCard** - Source citation display
- **ClarityToolResult** - Tool execution result display
- **ToolInvocationCard** - Tool call status card
- **ToolExecutionCard** - Detailed tool execution status
- **ToolCard** - Lightweight color-coded tool indicator
- **ToolCardList** - List of tool cards

#### Message Actions

- **MessageActions** - Standard message action buttons
  - Features: Copy, edit, delete, regenerate, feedback
- **MessageActionsSecure** - Security-enhanced message actions
- **CopyButton** - Copy message to clipboard
- **DeleteButton** - Delete message
- **EditableMessageContent** - Inline message editing
- **FeedbackDialog** - Message feedback/rating dialog

#### Markdown & Code

- **MarkdownCodeBlock** - Syntax-highlighted code blocks
- **EnhancedMarkdownRenderer** - Full markdown rendering with GFM support
  - Features: Tables, task lists, footnotes, emoji, math
- **CodeBlock** - Standalone code block with syntax highlighting
  - Features: Line numbers, copy button, language detection, Shiki integration
- **EnhancedCodeBlock** - Advanced code block with themes

#### FlowToken Integration (Optional)

- **FlowTokenStreamingText** - Token-based streaming animation
- **FlowTokenMarkdown** - Markdown with token animations

### Input Components

#### Chat Input

- **ChatInput** - Standard chat input (exported in core)
- **AdvancedChatInput** - Enhanced input with rich features
- **PillChatInput** - Modern pill-shaped input

#### Specialized Input

- **FileUpload** - File upload with drag-and-drop
  - Features: Multiple files, preview, progress, validation
- **VoiceInput** - Speech-to-text input
  - Features: Web Speech API, real-time transcription, language support
- **InlineVoiceInput** - Compact voice input button
- **MentionInput** - @ mention system
- **MentionList** - Mention suggestions dropdown
- **OutputPreferenceSelector** - Output format selector
  - Features: JSON, YAML, text, structured formats
- **StructuredInputBuilder** - Form-based structured input
  - Features: Dynamic fields, validation, token estimation

### AI Components

#### AI Processing & Display

- **AgentRunFeed** - Real-time agent execution feed
- **ChainOfThought** - Step-by-step reasoning visualization
  - Features: Expandable steps, status indicators, tree view
- **Think** - Collapsible reasoning/thinking display panel
- **ThinkingBar** - AI processing status bar (see Message Components)
- **ThinkingPill** - Lightweight thinking indicator (see Message Components)
- **Plan** - Task planning and tracking component
- **ProgressTracker** - Multi-step progress visualization
- **Steps** - Workflow/progress steps component
- **Terminal** - Interactive terminal with themes (Night Owl default)
  - Features: Command history, syntax highlighting, ANSI colors

#### AI Configuration

- **ModelSelector** - AI model selection dropdown
  - Features: Model comparison, pricing info, capability badges
- **SafetyStatusCard** - Safety check status display
- **AuditLogViewer** - AI interaction audit log

#### AI Collaboration

- **CollaborativeEditor** - Real-time collaborative editing
- **CollaborativeMessageList** - Shared message list
- **PresenceIndicator** - User presence indicators

#### AI Visualization

- **Citation** - Source citation component
- **Source** - Citation/reference display
- **SourceList** - List of sources
- **SessionSummaryCard** - Conversation summary card
- **WorkflowSuggestionList** - AI workflow suggestions
- **LinkPreview** - Rich link preview component
- **StatsDisplay** - Statistics and metrics display
- **ItemCarousel** - Carousel for items/members/products

### Token Management Components

- **TokenUsageMeter** - Real-time token usage display
  - Features: Visual meter, cost calculation, model pricing
- **TokenBudgetBar** - Token budget progress bar
- **TokenCounter** - Simple token count display
- **TokenCostPreview** - Cost estimation preview
- **TokenOptimizationPanel** - Token optimization controls
- **TokenOptimizationBadge** - Optimization status badge
- **TokenOptimizationDashboard** - Comprehensive token analytics
  - Features: Usage graphs, cost breakdown, optimization suggestions
- **TokenROICalculator** - ROI calculator for token optimization
  - Features: Cost scenarios, savings projection, comparison charts

### Search Components

- **MessageSearch** - Full-text message search
  - Features: Fuzzy search, highlighting, filters
- **SearchFiltersPanel** - Advanced search filters
- **SemanticSearch** - Vector-based semantic search
  - Features: Similarity search, context-aware results

### Dashboard Components

- **AnalyticsDashboard** - Analytics overview dashboard
- **UsageDashboard** - Usage statistics dashboard
- **TokenOptimizationDashboard** - Token analytics (see Token Components)
- **PerformanceDashboard** - Performance metrics dashboard

### Navigation Components

- **CommandPalette** - Quick actions/command palette
  - Features: Keyboard shortcuts, search, recent commands
- **CommandPaletteEnhanced** - Advanced command palette
- **ConversationList** - List of conversations
- **ConversationTimeline** - Chronological conversation timeline

### Conversation Components

- **ConversationList** - Conversation history list
- **ConversationTimeline** - Timeline view of conversations
- **ConversationBranches** - Branching conversation visualization

### Feedback Components

- **NetworkStatus** - Network connection status
- **ErrorState** - Error state display
- **SuccessState** - Success state confirmation
- **FeedbackAnimation** - Visual feedback animations
- **ConfettiAnimation** - Celebration animation

### Media Components

- **ExportDialog** - Export conversation dialog
  - Features: Multiple formats (JSON, Markdown, PDF, ZIP), filtering
- **ProgressiveImage** - Progressive image loading
- **ImagePreview** - Image preview with zoom

### Memory Components

- **MemoryActivityIndicator** - Memory system status indicator
- **MemoryPanel** - Memory management panel
- **MemoryViewer** - View stored memories

### Prompt Components

- **PromptLibrary** - Saved prompts library
- **TemplateMarketplace** - Prompt template marketplace
- **PromptSuggestions** - AI-suggested prompts
  - Features: Context-aware, categorized, customizable

### Context Components

- **ContextPanel** - Context window visualization
- **ContextMonitor** - Context usage monitoring

### Enterprise Components

- **AuditLogViewer** - Enterprise audit logging (see AI Components)
- **ComplianceDashboard** - Compliance monitoring
- **RoleBasedAccess** - RBAC controls

### UI Primitives

#### Animation & Feedback

- **AnimatedDots** - Loading dots animation
- **AnimatedList** - Animated list transitions
- **FeedbackAnimation** - Success/error animations
- **Ripple** - Material ripple effect
- **TextShimmer** - Shimmer/skeleton loading effect
  - Variants: ParagraphShimmer, HeadingShimmer, CodeShimmer, InlineShimmer

#### Layout & Structure

- **CollapsibleSection** - Expandable/collapsible sections
- **Draggable** - Drag-and-drop support
- **DropZone** - Drop target zone
- **InteractiveCard** - Interactive card component
- **Tabs** - Tab navigation

#### Status & Progress

- **Progress** - Progress bar
- **UploadProgress** - Upload progress indicator
- **SkeletonProgress** - Skeleton loading state
- **CircularProgress** - Circular progress indicator
- **BatteryIndicator** - Battery-style level indicator

#### Empty States

- **EmptyState** - Generic empty state
- **EmptyChatState** - Empty chat placeholder
- **NoSearchResultsState** - No search results
- **NoConversationsState** - No conversations
- **ErrorState** - Error state (also in Feedback)
- **SuccessState** - Success state (also in Feedback)

#### Toasts & Notifications

- **ToastItem** - Individual toast notification
- **ToastContainer** - Toast notification container
- **ToastProvider** - Toast context provider
- **SonnerToast** - Sonner-based toast system

#### Skeletons

- **AnalyticsDashboardSkeleton** - Analytics loading skeleton
- **UsageDashboardSkeleton** - Usage dashboard skeleton
- **TokenOptimizationDashboardSkeleton** - Token dashboard skeleton
- **PerformanceDashboardSkeleton** - Performance dashboard skeleton
- **DashboardEmptyState** - Dashboard empty state
- **MetricCardSkeleton** - Metric card skeleton
- **ProgressWidgetSkeleton** - Progress widget skeleton
- **ListItemSkeleton** - List item skeleton
- **ChartSkeleton** - Chart loading skeleton
- **SkeletonEnhanced** - Enhanced skeleton with predictions

#### Link Previews

- **LinkPreview** - Rich link preview
- **LinkPreviewSkeleton** - Loading skeleton
- **LinkPreviewError** - Error state
- **LinkPreviewCompact** - Compact preview
- **InlineLink** - Inline link with preview
- **SmartLinkPreview** - Auto-detecting link preview
- **RichEmbed** - Rich embed content

#### Utility UI

- **Label** - Form label
- **Icons** - Icon library (via lucide-react)
- **ErrorBoundary** - React error boundary
- **DashboardErrorBoundary** - Dashboard-specific error boundary

### Theme Components

- **ThemeModeSelector** - Light/dark mode selector
- **ThemeToggle** - Theme toggle button
- **ThemeCustomizer** - Theme customization UI
- **ThemeProvider** - Theme context provider

### Code Components

- **CodeBlock** - Syntax-highlighted code (see Message Components)
- **EnhancedCodeBlock** - Advanced code block (see AI Components)
- **MarkdownCodeBlock** - Markdown code blocks (see Message Components)

### AI-Ops Components

- **RequestQueueStatus** - API request queue status
- **PerformanceMonitor** - Performance monitoring

### Pro Components

- Advanced enterprise components (specific exports vary)

---

## Hooks

**Total Hook Files: 204**

### Chat Hooks

#### Primary Chat Hooks (Recommended)

- **useClarityChat** - Main chat hook with memory, streaming, tools
  - Signature: `(options: UseClarityChatOptions) => UseClarityChatReturn`
  - Features: Messages, streaming, memory, retry, error handling
  - Returns: messages, input, handleSubmit, isLoading, error, meta, etc.
- **useClarityChatApp** - Unified app hook (NEW - Recommended)
  - Signature: `(options: UseClarityChatAppOptions) => UseClarityChatAppReturn`
  - Features: All features with preset support
- **useClarityChatWithTools** - Chat with function calling
  - Features: Tool registration, approval flow, execution tracking
- **useClarityObject<T>** - Structured output generation
  - Features: Schema validation, streaming objects, type safety

#### Utility Chat Hooks

- **useChatHandlers** - Message handling utilities
- **useChatHistory** - Chat history management
- **useCompletion** - Text completion (non-chat)
- **useAssistant** - OpenAI Assistant API integration
- **useAgent** - AI agent orchestration
- **useRAGPipeline** - Retrieval-Augmented Generation
- **useChatEditor** - Chat message editing
- **useChatSync** - Real-time chat synchronization
- **useMessageNormalization** - Message format normalization

#### Internal Chat Hooks

- **useChatEnhanced** - Enhanced chat (internal, used by useClarityChat)

### Streaming Hooks

- **useStreaming** - Generic streaming handler
  - Features: Abort control, progress tracking, error recovery
- **useStreamingShimmer** - Streaming shimmer effects

### Message Hooks

- **useMessageActions** - Message action handlers
- **useMessageEditor** - Message editing logic
- **useMessageVirtualization** - Virtual scrolling for messages

### UI Hooks

#### Common UI Utilities

- **useAutoScroll** - Automatic scroll to bottom
  - Features: Smooth scrolling, user scroll detection, threshold
- **useClipboard** - Clipboard operations
  - Features: Copy, paste, success feedback
- **useDebounce** - Debounce values/callbacks
- **useThrottle** - Throttle callbacks
- **useThrottledCallback** - Throttled callback wrapper
- **useToggle** - Boolean toggle state
- **usePrevious** - Previous value tracking
- **useIsMounted** - Component mount status

#### Refs & DOM

- **useMergedRef** - Merge multiple refs
- **useMergedRefWithCleanup** - Merged refs with cleanup
- **useIntersectionObserver** - Intersection observer
- **useEventListener** - Event listener management

#### Responsive & Layout

- **useWindowSize** - Window dimensions
- **useMediaQuery** - Media query matching
  - Features: Breakpoint detection, SSR-safe
- **useReducedMotion** - Prefers-reduced-motion detection

#### Animation

- **useAnimatedValue** - Animated numeric values
  - Components: AnimatedNumber, FlashingValue
- **useValueChange** - Value change detection

#### Accessibility

- **useFocusTrap** - Focus trap for modals/dialogs
- **useFocusRestoration** - Focus restoration on unmount

#### Other UI

- **useSafeTimeout** - Memory-safe timeouts
- **useToast** - Toast notifications
- **useThemeColor** - Theme color values

### Token Hooks

- **useTokenBudget** - Token budget tracking
- **useTokenTracker** - Token usage tracking
- **useTokenBudgetMonitor** - Token budget monitoring
- **useTokenEstimate** - Token cost estimation
- **useTokenValidator** - Token validation
- **useAutoTokenValidator** - Automatic token validation
- **useTokenPerformance** - Token performance metrics
- **useAutoTokenPerformance** - Automatic performance tracking

### Theme Hooks

- **useTheme** - Theme context and switching
- **useThemeColor** - Theme color access (also in UI)

### Keyboard Hooks

- **useKeyboardShortcuts** - Keyboard shortcut registration
  - Features: Global shortcuts, scoped shortcuts, help dialog
- **useSlashCommands** - Slash command handling (e.g., /help, /search)

### Navigation Hooks

- **useKeyboardNavigation** - Keyboard-based navigation
- **useCommandPalette** - Command palette state

### Storage Hooks

- **useLocalStorage** - Local storage with sync
  - Features: Type-safe, SSR-safe, event sync
- **useSessionStorage** - Session storage

### Context Hooks

- **useContextMonitor** - Context window monitoring
  - Features: Token tracking, overflow detection

### Memory Hooks

- **useMemoryFeedback** - Memory system feedback
- **useMemory** - Memory management

### Dashboard Hooks

- **useDashboard** - Dashboard data management
- **useDashboardErrorHandler** - Dashboard error handling

### Input Hooks

- **useMentions** - Mention system logic
- **useOutputPreference** - Output format preference
- **useStructuredInput** - Structured input management
- **usePillChatInput** - Pill input state

### Model Hooks

- **useModelSelection** - Model selection logic

### Security Hooks

- **useContentFilter** - Content filtering
- **usePIIDetection** - PII detection

### Resilience Hooks

- **useRetry** - Automatic retry logic
- **useCircuitBreaker** - Circuit breaker pattern

### Performance Hooks

- **usePerformanceMonitor** - Performance monitoring
- **useRenderTracking** - Render count tracking

### AI Hooks

- **useThinkingBar** - Thinking bar state
- **useThinkingPill** - Thinking pill state
- **useToolExecution** - Tool execution tracking
- **useTextShimmer** - Text shimmer effects
- **useThink** - Think panel logic
- **useChainOfThought** - Chain of thought state
- **useToolCard** - Tool card state
- **usePlan** - Plan component state
- **useProgressTracker** - Progress tracking
- **useSteps** - Steps state
- **useLinkPreview** - Link preview fetching
- **useStatsDisplay** - Stats display logic
- **useItemCarousel** - Carousel state
- **useTerminal** - Terminal state
- **useCollaborativeSession** - Collaborative editing session

### Agents Hooks

- **useAgent** - Agent orchestration (also in Chat)

### Vector Store Hooks

- **useVectorStore** - Vector database operations

### Embeddings Hooks

- **useEmbeddings** - Generate embeddings

### Accessibility Hooks

- **useFocusTrap** - Focus trapping (also in UI)
- **useFocusRestoration** - Focus restoration (also in UI)
- **useAriaAnnounce** - Screen reader announcements

---

## Utilities

**Organized by domain**

### Core Utilities

- **cn()** - Classname merging utility (from primitives)
  - Tailwind CSS class merging with conflict resolution

### Streaming Utilities

- **parseStreamResponse** - Parse SSE stream responses
- **handleStreamError** - Stream error handling
- **createStreamReader** - ReadableStream reader
- **streamToString** - Convert stream to string
- **streamToAsyncIterable** - Stream to async iterator

### Message Utilities

- **convertToUIMessages** - Convert API messages to UI format
- **convertFromUIMessages** - Convert UI messages to API format
- **normalizeMessage** - Normalize message format
- **extractToolCalls** - Extract tool calls from messages
- **groupMessagesByDate** - Group messages chronologically

### API Utilities

- **createChatAPI** - Chat API client factory
- **rateLimiter** - Rate limiting utility
- **retryWithBackoff** - Exponential backoff retry
- **apiErrorHandler** - API error handling
- **getModelCapabilities** - Model capability lookup
- **calculateTokenCost** - Token cost calculation

### Resilience Utilities

- **CircuitBreaker** - Circuit breaker implementation
- **RetryManager** - Retry logic manager
- **ExponentialBackoff** - Backoff calculator
- **TimeoutManager** - Timeout handling

### Tool Utilities

- **extractToolResults** - Extract tool execution results
- **formatToolCall** - Format tool calls
- **validateToolDefinition** - Validate tool schemas

### Configuration Utilities

- **loadMarkdownDependencies** - Load markdown parsers
- **getMarkdownDependencies** - Get markdown deps status
- **detectPeerCapabilities** - Detect optional dependencies
  - Features: Shiki, Mermaid, PDF loaders, etc.
- **getPeerModule** - Load peer dependency
- **isPeerAvailable** - Check peer availability
- **getInstallationInstructions** - Generate install commands

### Security Utilities

- **sanitizeInput** - Input sanitization
- **detectPII** - PII detection
- **detectPromptInjection** - Prompt injection detection
- **preventJailbreak** - Jailbreak prevention
- **contentFilter** - Content filtering
- **sanitizeUrl** - URL sanitization
- **isValidUrl** - URL validation

### Search Utilities

- **fuzzySearch** - Fuzzy text search
- **highlightMatches** - Search result highlighting
- **semanticSearch** - Vector-based search

### Tokenization Utilities

#### Core Token Counting

- **countTokens** - Count tokens in text
- **estimateMessagesTokens** - Estimate message array tokens
- **countConversationTokens** - Count full conversation tokens
- **truncateToTokenBudget** - Truncate to fit budget

#### Token Budget & Validation

- **validateTokenBudget** - Validate token budgets
- **createTokenBudget** - Create budget config
- **tokenBudgetValidator** - Budget validator

#### Token Analytics

- **recordTokenUsage** - Record usage event
- **getTokenAnalytics** - Get analytics data
- **getTokenMetrics** - Get metrics
- **tokenAnalyticsMonitor** - Analytics monitor

#### Token Migration

- **analyzeTokenMigration** - Analyze migration needs
- **generateMigrationReport** - Generate report
- **autoFixTokenMigration** - Auto-fix issues
- **manualMigrateTokens** - Manual migration
- **tokenMigrationAssistant** - Migration helper

#### Adaptive Optimization

- **AdaptiveTokenOptimizer** - Adaptive optimizer class
- **adaptiveOptimizer** - Optimizer instance
- **optimizeTokensAdaptively** - Adaptive optimization
- **updateConversationState** - Update state
- **getAdaptiveAnalytics** - Get analytics

#### Smart Truncation

- **SmartTruncator** - Smart truncator class
- **SmartSummarizer** - Summarizer class
- **truncateText** - Truncate text smartly
- **summarizeText** - Summarize text
- **truncateConversation** - Truncate conversation

#### Dynamic Optimization

- **DynamicOptimizer** - Dynamic optimizer
- **optimizeForModel** - Model-specific optimization
- **optimizeForBudget** - Budget-based optimization
- **optimizeForCost** - Cost-based optimization

#### Token Middleware

- **TokenOptimizationMiddleware** - Middleware class
- **TokenOptimizationInterceptor** - Interceptor
- **TokenOptimizedAPI** - Optimized API client
- **tokenMiddleware** - Middleware instance
- **tokenInterceptor** - Interceptor instance
- **tokenOptimizedAPI** - API instance
- **getOptimizationMetrics** - Get metrics
- **getOptimizationHistory** - Get history
- **configureMiddleware** - Configure middleware

#### Response Optimization

- **ResponseLengthPredictor** - Response predictor
- **ResponseOptimizer** - Response optimizer
- **responseLengthPredictor** - Predictor instance
- **responseOptimizer** - Optimizer instance
- **predictResponseLength** - Predict length
- **controlResponseBudget** - Control budget
- **getResponsePredictionAccuracy** - Get accuracy

#### Token Dashboard

- **TokenOptimizationMonitor** - Monitor class
- **TokenOptimizationAnalytics** - Analytics class
- **createTokenMonitor** - Create monitor
- **createTokenAnalytics** - Create analytics

#### Token Validation

- **InputValidator** - Input validator
- **errorHandler** - Error handler

### Prompt Caching Utilities

- **PromptCacheManager** - Prompt cache manager
- **createAnthropicCachedMessages** - Anthropic cache format
- **estimateCacheSavings** - Calculate cache savings

### TOON (Token-Oriented Object Notation)

- **jsonToToon** - Convert JSON to TOON format
- **toonToJson** - Convert TOON to JSON
- **autoOptimize** - Auto-optimize format
- **formatForLLM** - Format for LLM consumption
- **parseFlexible** - Flexible parsing
- **estimateToonSavings** - Estimate token savings
- **isSuitableForToon** - Check TOON suitability

### Color Utilities

- **hexToRgb** - Hex to RGB conversion
- **rgbToHex** - RGB to hex conversion
- **calculateContrast** - WCAG contrast calculation
- **generateColorPalette** - Color palette generation
- **adjustColorBrightness** - Brightness adjustment

### Markdown Utilities

- **loadMarkdownDependencies** - Load markdown parsers (see Config)
- **PlainTextMarkdown** - Fallback plain text renderer
- **useMarkdownAvailability** - Check markdown availability

### Export Utilities

- **exportToJSON** - Export conversation to JSON
- **exportToMarkdown** - Export to Markdown
- **exportToPDF** - Export to PDF
- **exportToZIP** - Export batch to ZIP

### Mobile Utilities

- **isMobileDevice** - Detect mobile device
- **isTouchDevice** - Detect touch support
- **getViewportSize** - Get viewport dimensions

### Math Utilities

- **clamp** - Clamp number to range
- **lerp** - Linear interpolation
- **normalize** - Normalize to 0-1 range
- **roundTo** - Round to decimals

### Profiling Utilities

- **measurePerformance** - Performance measurement
- **profileRender** - Component render profiling

---

## SDK Features

### Core SDK APIs

#### Primary API (Recommended)

- **ClarityChatApp Component** - One-line setup with all features
- **useClarityChatApp Hook** - Headless mode with all features

#### Legacy SDK (Still Supported)

- **useClarityChat Hook** - Core chat hook
- **useClarityObject Hook** - Structured output
- **useClarityChatWithTools Hook** - Function calling

### Feature Flags System

```typescript
interface ClarityFeatureFlags {
  memory?: boolean // Context persistence
  tokenOptimization?: boolean // Cost reduction
  tools?: boolean // Function calling
  rag?: boolean // Document retrieval
  safety?: boolean // Content moderation
  observability?: boolean // Analytics
  streaming?: boolean // Real-time responses (default: true)
  errorRecovery?: boolean // Auto-retry (default: true)
}
```

### Preset Configurations

| Preset       | Features Included                                    |
| ------------ | ---------------------------------------------------- |
| `simple`     | Streaming + error recovery + accessible UI           |
| `pro`        | + Token stats, basic safety                          |
| `memory`     | + Memory with sliding-window                         |
| `rag`        | + Document sources, chunking, retrieval              |
| `tools`      | + Tool calling with registry pattern                 |
| `enterprise` | All features: Memory, tokens, safety, RAG, analytics |

### Configuration System

- **resolveConfig** - Resolve preset + overrides to final config
- **isFeatureEnabled** - Check feature flag
- **describeActiveFeatures** - List active features
- **createPresetConfig** - Create preset configuration
- **mergeConfigs** - Merge multiple configs

### Memory System

#### Memory Strategies

- **Fixed Window** - Keep last N messages
- **Sliding Window** - Smart context window management
- **Importance-Based** - Prioritize important messages
- **Summarization** - Compress old messages

#### Memory Features

- Automatic context management
- Token budget awareness
- Message importance scoring
- Conversation summarization
- Memory persistence
- Memory retrieval

### Token Optimization System

#### Optimization Strategies

- **Adaptive** - Learns from usage patterns
- **Budget-Based** - Optimize for token budget
- **Cost-Based** - Optimize for cost
- **Model-Specific** - Per-model optimization

#### Optimization Features

- Token counting (multiple models)
- Cost estimation
- Budget tracking
- Usage analytics
- Optimization suggestions
- Prompt caching integration
- TOON format optimization
- Response length prediction

### RAG (Retrieval-Augmented Generation)

#### Document Processing

- **PDF Processing** - Extract text from PDFs (optional: pdfjs-dist)
- **DOCX Processing** - Parse Word documents (optional: mammoth)
- **Text Chunking** - Smart text segmentation
- **Metadata Extraction** - Extract document metadata

#### Vector Search

- **Embedding Generation** - Generate text embeddings
- **Vector Storage** - Store document vectors
- **Similarity Search** - Find relevant chunks
- **Hybrid Search** - Combine semantic + keyword search
- **Reranking** - Improve search results (optional: cohere-ai)

#### RAG Features

- Source attribution
- Citation tracking
- Context retrieval
- Document filtering
- Relevance scoring

### Tool Calling System

#### Tool Features

- Tool registration
- Schema validation
- Approval workflow
- Execution tracking
- Error handling
- Result formatting
- Audit logging

#### Built-in Tools Support

- Function calling
- Structured output
- Tool result parsing
- Tool execution visualization

### Safety & Security

#### Content Safety

- **PII Detection** - Detect personal information
- **Content Filtering** - Filter inappropriate content
- **Prompt Injection Detection** - Detect injection attempts
- **Jailbreak Prevention** - Prevent jailbreak attempts

#### Security Features

- Input sanitization
- Output validation
- Rate limiting
- Error sanitization
- Secure defaults

### Observability

#### Analytics

- Usage tracking
- Performance monitoring
- Error tracking
- Cost analytics
- User behavior analytics

#### Monitoring

- Token usage
- API latency
- Error rates
- Cache hit rates
- Model performance

### Error Recovery

- Automatic retry with exponential backoff
- Circuit breaker pattern
- Fallback responses
- Error context preservation
- User-friendly error messages

### Streaming

- Server-Sent Events (SSE)
- Real-time token streaming
- Stream cancellation
- Progress tracking
- Error handling during streaming

### Export System

- **JSON Export** - Export to JSON
- **Markdown Export** - Export to Markdown
- **PDF Export** - Export to PDF (optional: jspdf)
- **ZIP Export** - Batch export (optional: jszip)

### Webhooks

- Webhook registration
- Event publishing
- Retry logic
- Signature verification

### Multi-Tenancy

- Tenant isolation
- Per-tenant configuration
- Usage quotas
- Resource limits

### RBAC (Role-Based Access Control)

- Role management
- Permission checking
- Access control
- Audit logging

---

## Support Features

### TypeScript Support

#### Type Safety

- **Strict Mode** - Full strict TypeScript
- **Generic Types** - Type-safe generics throughout
- **Discriminated Unions** - Type-safe message types
- **Inference** - Automatic type inference
- **Type Guards** - Runtime type checking

#### Type Coverage

- 100% TypeScript codebase
- Comprehensive type definitions
- Re-exported types from @clarity-chat/types
- Type-safe configuration
- Type-safe hooks
- Type-safe components

#### Key Type Exports

```typescript
// Message types
Message, MessageRole, MessageMetadata, StreamMessage

// Configuration types
ClarityFeatureFlags, ClarityAppConfig, ClarityResolvedConfig

// Hook types
UseClarityChatOptions, UseClarityChatReturn
UseClarityChatAppOptions, UseClarityChatAppReturn

// Component types
All component prop types exported alongside components
```

### Testing Utilities

#### Test Helpers

- **renderWithProviders** - Render with all providers
- **renderWithTheme** - Render with specific theme
- **createMockMessage** - Create mock message data
- **createMockMessages** - Create message array
- **createMockStreamResponse** - Mock streaming
- **createMockReadableStream** - Mock stream

#### Mock Utilities

- **mockFetch** - Mock fetch API
- **mockIntersectionObserver** - Mock IntersectionObserver
- **mockResizeObserver** - Mock ResizeObserver
- **mockLocalStorage** - Mock localStorage
- **mockSpeechRecognition** - Mock Web Speech API

#### Test Infrastructure

- Vitest integration
- React Testing Library integration
- Mock providers (Analytics, Error Reporter, Theme)
- AI test helpers
- Custom matchers
- Test environment fixes

### Accessibility Features

#### WCAG Compliance

- **WCAG 2.1 AAA** - Highest compliance level
- **WCAG Validation** - Automated compliance checking
- **Accessibility Automation** - Auto-fix common issues

#### Keyboard Navigation

- Full keyboard navigation support
- Custom keyboard shortcuts
- Focus management
- Focus trap for modals
- Focus restoration
- Roving tabindex
- Skip links

#### Screen Reader Support

- ARIA labels on all interactive elements
- ARIA live regions for dynamic content
- ARIA announcements
- Semantic HTML
- Descriptive labels
- Status announcements

#### Visual Accessibility

- **Color Contrast** - WCAG AA/AAA contrast ratios
- **Focus Indicators** - Visible focus states
- **Text Sizing** - Responsive text sizes
- **High Contrast Mode** - Support for high contrast

#### Motion Accessibility

- **Reduced Motion** - Respect prefers-reduced-motion
- **Motion-safe utilities** - Conditional animations
- **Zero-motion fallbacks** - Static alternatives

#### Accessibility Utilities

- **ariaLabel** - ARIA label helpers
- **announceToScreenReader** - Screen reader announcements
- **calculateContrast** - Contrast calculation
- **wcagValidator** - WCAG validation
- **accessibilityAutomation** - Auto-fix framework

### Animation Features

#### Animation System

- **Framer Motion** integration
- Consistent animation tokens
- Duration constants
- Easing presets
- Spring physics
- Motion-safe variants

#### Animation Presets

- **ANIMATION_PRESETS** - Common animations (fade, slide, scale, etc.)
- **INTERACTION_VARIANTS** - Hover, tap, focus states
- **SPRING_PRESETS** - Spring physics presets
- **THEME_ANIMATIONS** - Theme transition animations
- **MICROANIMATIONS** - Subtle UI animations

#### Animation Utilities

- **getPreset** - Get animation preset
- **getTransition** - Get transition config
- **getMotionSafeVariants** - Motion-safe animations
- **useReducedMotion** - Reduced motion detection

#### Animation Features

- Smooth transitions
- Physics-based springs
- Gesture animations
- Exit animations
- Stagger animations
- Layout animations

### Responsive Design

#### Mobile-First Approach

- Mobile-first breakpoints
- Responsive components
- Touch-friendly interactions
- Viewport-aware sizing

#### Breakpoint System

```typescript
// Tailwind breakpoints
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
2xl: 1536px // 2X large devices
```

#### Responsive Utilities

- **useWindowSize** - Window dimensions
- **useMediaQuery** - Breakpoint matching
- **isMobileDevice** - Mobile detection
- **isTouchDevice** - Touch detection

#### Responsive Patterns

- Adaptive layouts
- Responsive typography
- Responsive spacing
- Responsive images
- Responsive tables
- Responsive grids

#### Self-Contained Styles

- No external CSS required
- Component-level styles
- Tailwind CSS integration
- Hidden scrollbars (scrollbar-hide utility)
- Overflow prevention

### Dark Mode Support

#### Theme System

- **ThemeProvider** - Theme context
- **useTheme** - Theme hook
- **ThemeToggle** - Mode switcher
- **ThemeModeSelector** - Mode selector

#### Dark Mode Features

- System preference detection
- Manual theme switching
- Per-user preferences
- Persistent theme selection
- Smooth theme transitions

#### Theme Variants

- Light mode
- Dark mode
- System (auto)
- High contrast (light/dark)

#### Theme Tokens

- Semantic color tokens
- Role-based colors
- Contrast-aware colors
- Theme-aware components

#### Modern Themes

17 built-in themes including:

- Default (light/dark)
- Ocean, Sunset, Forest
- Neon, Cyberpunk
- Minimal, Professional
- Warm, Cool
- High Contrast
- Custom theme builder

### Internationalization

#### Current Status

- **No built-in i18n** - Currently English-only
- **i18n-ready structure** - Components support localization
- **Accessible labels** - All UI text in props/config

#### i18n Preparation

- Extractable strings
- Date/time formatting support
- Number formatting support
- RTL layout support (CSS logical properties)

#### Future i18n Support

- React Intl integration planned
- Translation key system planned
- Language detection planned
- Locale switching planned

### Performance Optimizations

#### Component Optimization

- React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable functions
- Lazy loading for heavy components
- Code splitting

#### List Optimization

- **Virtual scrolling** - For large message lists
- **Windowing** - Render only visible items
- **Pagination** - Load on demand
- **Infinite scroll** - Progressive loading

#### Bundle Optimization

- **Tree-shaking** - Remove unused code
- **Code splitting** - Split into chunks
- **Lazy loading** - Dynamic imports
- **Peer dependencies** - Externalize dependencies
- **Core-minimal bundle** - ~30KB minimal build

#### Network Optimization

- Request deduplication
- Response caching
- Prompt caching
- Compression
- Stream processing

#### Rendering Optimization

- Debouncing
- Throttling
- Request animation frame
- Intersection observer
- Resize observer

### Developer Experience

#### Error Handling

- **DX Hints** - Helpful error messages
- **createClarityError** - Structured errors
- **detectCommonMistakes** - Auto-detect issues
- **formatErrorForDisplay** - User-friendly errors

#### Documentation

- Comprehensive JSDoc comments
- TypeScript IntelliSense
- README examples
- Migration guides
- API reference

#### Debugging

- Development mode warnings
- Console hints
- React DevTools support
- Performance profiling
- Debug logging

### Browser Support

#### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Required APIs

- ES2020 features
- Fetch API
- ReadableStream
- IntersectionObserver
- ResizeObserver
- LocalStorage

#### Optional APIs

- Web Speech API (for voice input)
- Clipboard API (for copy/paste)
- Web Workers (for heavy computation)

### Framework Support

#### React Versions

- React 18.x (recommended)
- React 19.x (fully supported)

#### Framework Integration

- Next.js 13+ (App Router, Pages Router)
- Vite
- Create React App
- Remix
- Astro (with React integration)

#### SSR Support

- Server-side rendering compatible
- Hydration safe
- No window/document access in render
- Dynamic imports for client-only features

---

## Bundle Sizes

### Import Paths

| Import Path                        | Size      | Use Case            |
| ---------------------------------- | --------- | ------------------- |
| `@clarity-chat/react`              | ~600KB    | Full library        |
| `@clarity-chat/react/core`         | ~300KB    | Core + hooks        |
| `@clarity-chat/react/core-minimal` | **~30KB** | Just ClarityChatApp |
| `@clarity-chat/react/slim`         | ~276KB    | Optimized bundle    |

### Peer Dependencies

#### Required (505KB total)

- react, react-dom (260KB)
- lucide-react (20KB)
- framer-motion (90KB)
- zod (50KB)
- react-markdown, remark-gfm, rehype-highlight (85KB)

#### Optional Features

- shiki (150KB) - Syntax highlighting
- pdfjs-dist (800KB) - PDF processing
- mammoth (100KB) - DOCX processing
- jszip (110KB) - ZIP export
- mermaid (400KB) - Diagrams
- flowtoken (50KB) - Token animation
- cohere-ai (80KB) - Reranking

### Bundle Optimization

- Tree-shaking enabled
- Dynamic imports for heavy features
- External peer dependencies
- Code splitting
- Minification

---

## Recent Improvements

### Wave 3.4 Completion (January 26, 2026)

- Security hardening
- Performance optimizations
- Comprehensive testing
- Documentation updates
- Type safety improvements

### Latest Features

- **ClarityChatApp** - Unified API
- **Preset System** - Quick configuration
- **Token Optimization** - Advanced cost reduction
- **Memory System** - Multiple strategies
- **RAG Integration** - Document retrieval
- **Safety Features** - Content moderation
- **Responsive Design** - Mobile-first

---

## Summary Statistics

- **Total Component Files**: 438
- **Total Hook Files**: 204
- **Total Directories**: ~150
- **TypeScript Coverage**: 100%
- **WCAG Compliance**: AAA
- **React Versions**: 18.x, 19.x
- **Bundle Size (min)**: 30KB
- **Bundle Size (full)**: 600KB
- **Test Coverage**: 85%+
- **Built-in Themes**: 17

---

**Last Updated**: January 27, 2026 **Package Version**: @clarity-chat/react@1.0+
