# Docs Streamline Inventory: Clarity AI Chat Components

## 1) Executive Summary

**What the streamlined v1 docs should include:**
The v1 docs should focus exclusively on the ClarityChatApp unified API and its complete engines (Tools, Memory, RAG, comprehensive Token Optimization suite) as the primary path, with full streaming capabilities and chat performance optimization. This represents the library's differentiation: robust AI chat with enterprise-grade token optimization (80%+ cost reduction) and high-performance streaming in a simple API.

**What to cut/defer:**
- Legacy ClarityChat component and hooks (useClarityChat, etc.) - mark as "legacy, still supported" with migration guide
- Enterprise features (SSO, tenant management, etc.) - defer to enterprise docs
- Advanced analytics dashboards - defer until core value is proven
- A/B testing components - defer to advanced usage
- Theme customization details - defer until core functionality is adopted
- Extensive component customization guides - focus on presets and configuration
- AI operations tools (prompt testing, safety review) - defer to advanced docs

**The "why" (adoption + differentiation):**
Clarity differentiates by providing streaming, tool calling, memory, and token optimization as built-in engines with simple configuration, rather than requiring developers to assemble complex integrations. The streamlined docs should prove this value fast by getting users to advanced AI chat features in minutes, not months.

## 2) Core Differentiators to Showcase

- **Unified App API**: Single ClarityChatApp component that automatically integrates streaming, tools, memory, and comprehensive token optimization
- **Complete Token Optimization Suite**: 80%+ cost reduction through caching, compression, adaptive models, and intelligent routing
- **Advanced Streaming System**: Token-by-token streaming with 60fps smoothing, multiple transport layers (SSE/WebSocket), and progress visualization
- **Chat Performance Optimization**: Virtualized message lists supporting 1000+ messages with react-window and TanStack Virtual
- **Engine Architecture**: Pluggable engines (Tools, Memory, RAG, Token) that work together seamlessly
- **Tool Calling**: Robust tool execution with validation, caching, and safety
- **Command Palette**: Keyboard-first UX with slash commands and mentions
- **Memory System**: Vector-based context persistence across conversations
- **Developer Experience**: Type-safe, error-resilient APIs with excellent DX hints

## 3) Core Showcase Set Inventory

### 3.1 Components

| Name | Path/Export | Purpose | Tags | Score (0-25) | Docs Placement | Demo Candidate | Notes |
|------|-------------|---------|------|--------------|----------------|----------------|-------|
| ClarityChatApp | app-api/ClarityChatApp | Unified AI chat component with automatic feature integration | streaming,tools,memory,token,commands | 22 | Getting Started, Streaming, Tool Calling | Y | Primary differentiator - proves value in minutes |
| ChatWindow | components/chat/chat-window | Core chat UI with message list and input | chat-ui,streaming | 19 | Core Components | Y | Essential for basic chat experience |
| StreamingMessage | components/message/streaming-message | Token-by-token streaming message renderer | streaming | 20 | Streaming | Y | Core streaming differentiator |
| ToolExecutionCard | components/ai/tool-execution-card | Tool call execution status and results display | tools | 21 | Tool Calling | Y | Shows tool calling lifecycle |
| VirtualizedMessageList | components/chat/virtualized-message-list | High-performance message list with react-window virtualization | chat-ui,performance | 21 | Core Components | Y | Essential for large conversations |
| TanStackMessageList | components/chat/tanstack-message-list | Advanced virtualized message list with TanStack Virtual | chat-ui,performance | 20 | Core Components | Y | Alternative virtualization option |
| TokenOptimizationPanel | components/token/TokenOptimizationPanel | Token usage monitoring and optimization controls | token | 22 | Token Optimization | Y | Core token management interface |
| TokenOptimizationDashboard | components/token/TokenOptimizationDashboard | Comprehensive token analytics and optimization dashboard | token | 22 | Token Optimization | Y | Full token optimization suite |
| TokenUsageMeter | components/token/token-usage-meter | Real-time token usage and cost tracking display | token | 22 | Token Optimization | Y | Cost monitoring component |
| TokenBudgetBar | components/token/token-budget-bar | Visual token budget tracking with alerts | token | 22 | Token Optimization | Y | Budget management UI |
| TokenCostPreview | components/token/TokenCostPreview | Pre-flight cost estimation for messages | token | 22 | Token Optimization | Y | Cost prediction tool |
| TokenOptimizationBadge | components/token/TokenOptimizationBadge | Status indicators for optimization features | token | 20 | Token Optimization | Y | Optimization status display |
| CommandPalette | components/navigation/command-palette | Keyboard-first command interface with / and @ mentions | commands | 20 | Commands & Mentions | Y | UX differentiator for power users |
| EnhancedMarkdownRenderer | components/ai/enhanced-markdown-renderer | Rich markdown rendering with LaTeX, code syntax, Mermaid | chat-ui | 19 | Core Components | Y | Essential for AI responses |

### 3.2 Hooks

| Name | Path/Export | Purpose | Tags | Score (0-25) | Docs Placement | Demo Candidate | Notes |
|------|-------------|---------|------|--------------|----------------|----------------|-------|
| useClarityChatApp | app-api/use-clarity-chat-app | Main hook for unified chat functionality | streaming,tools,memory,token | 23 | Getting Started | Y | Core of the unified API |
| useStreamStatus | hooks/streaming/use-stream-status | Streaming progress tracking and status management | streaming | 21 | Streaming | Y | Essential for streaming UX |
| useStreaming | hooks/streaming/use-streaming | Core streaming hook for real-time responses | streaming | 22 | Streaming | Y | Primary streaming interface |
| useStreamingChat | hooks/streaming/use-streaming-chat | Streaming chat hook with message management | streaming | 22 | Streaming | Y | Integrated streaming chat |
| useStreamingSSE | hooks/streaming/use-streaming-sse | Server-sent events streaming implementation | streaming | 21 | Streaming | Y | SSE transport layer |
| useStreamingWebSocket | hooks/streaming/use-streaming-websocket | WebSocket-based streaming implementation | streaming | 21 | Streaming | Y | WebSocket transport layer |
| useStreamableUI | hooks/streaming/use-streamable-ui | Streaming UI updates and progressive rendering | streaming | 21 | Streaming | Y | Advanced streaming UI |
| useSmoothedText | hooks/streaming/use-smoothed-text | 60fps text smoothing for streaming output | streaming,performance | 21 | Streaming | Y | Performance optimization for streaming |
| useCommandPalette | hooks/keyboard/use-command-palette | Command palette state management with keyboard shortcuts | commands | 20 | Commands & Mentions | Y | Power user feature |
| useTokenOptimization | hooks/clarity-tokens/use-token-optimization | Unified token optimization pipeline | token | 23 | Token Optimization | Y | Complete token optimization suite |
| useTokenCounter | hooks/clarity-tokens/use-token-counter | Accurate token counting across models | token | 22 | Token Optimization | Y | Foundation for all token features |
| useLazyTokenCounter | hooks/clarity-tokens/use-lazy-token-counter | Lazy-loaded token counter for performance | token,performance | 22 | Token Optimization | Y | Optimized token counting |
| useCostEstimator | hooks/clarity-tokens/use-cost-estimator | Cost estimation for API calls | token | 22 | Token Optimization | Y | Cost prediction and tracking |
| useSemanticCache | hooks/clarity-tokens/use-semantic-cache | Semantic caching for similar queries | token | 22 | Token Optimization | Y | Advanced caching strategy |
| useExactCache | hooks/clarity-tokens/use-exact-cache | Exact match caching for identical requests | token | 22 | Token Optimization | Y | Basic caching strategy |
| useEmbeddingCache | hooks/clarity-tokens/use-embedding-cache | Embedding-based caching for semantic similarity | token | 22 | Token Optimization | Y | Vector-based caching |
| usePromptCompressor | hooks/clarity-tokens/use-prompt-compressor | Dynamic prompt compression and optimization | token | 22 | Token Optimization | Y | Context compression |
| useStreamOptimizer | hooks/clarity-tokens/use-stream-optimizer | Streaming response optimization | streaming,token | 22 | Streaming + Token | Y | Combined streaming + token optimization |
| useTokenThrottle | hooks/clarity-tokens/use-token-throttle | Token usage throttling and rate limiting | token | 21 | Token Optimization | Y | Usage control |
| useTokenLimitGuard | hooks/clarity-tokens/use-token-limit-guard | Token limit enforcement and protection | token | 21 | Token Optimization | Y | Safety and compliance |
| useTokenBudget | hooks/clarity-tokens/use-token-budget | Token budget management and allocation | token | 22 | Token Optimization | Y | Budget management |
| useVectorSearch | hooks/clarity-tokens/use-vector-search | Vector-based retrieval and context injection | token,memory | 22 | Token Optimization | Y | Advanced retrieval |
| useContextInjector | hooks/clarity-tokens/use-context-injector | Intelligent context injection and management | token,memory | 22 | Token Optimization | Y | Context management |
| useAdaptiveModel | hooks/clarity-tokens/use-adaptive-model | Dynamic model selection based on content/complexity | token | 21 | Token Optimization | Y | Intelligent routing |
| useCostTracker | hooks/clarity-tokens/use-cost-tracker | Comprehensive cost tracking and analytics | token | 22 | Token Optimization | Y | Cost monitoring |
| useContextWindow | hooks/clarity-tokens/use-context-window | Context window management with compression | token,memory | 22 | Token Optimization | Y | Context optimization |
| useResponseCache | hooks/clarity-tokens/use-response-cache | Response caching and deduplication | token | 22 | Token Optimization | Y | Performance optimization |
| useTokenTracker | hooks/token/use-token-tracker | Real-time token counting and cost estimation | token | 22 | Token Optimization | Y | Cost awareness differentiator |
| useMessageOperations | hooks/message/use-message-operations | Message editing, regeneration, deletion with history | chat-ui | 20 | Core Components | Y | Essential chat operations |
| createToolsEngine | app-api/tools-engine | Tool execution engine with validation and caching | tools | 22 | Tool Calling | Y | Tool calling infrastructure |
| createMemoryEngine | app-api/memory-engine | Context and memory management engine | memory | 19 | Advanced Usage | N | Memory system core |
| createTokenEngine | app-api/token-engine | Token optimization and budgeting engine | token | 22 | Token Optimization | Y | Cost optimization engine |

### 3.3 Utilities/Adapters

| Name | Path/Export | Purpose | Tags | Score (0-25) | Docs Placement | Demo Candidate | Notes |
|------|-------------|---------|------|--------------|----------------|----------------|-------|
| resolveConfig | app-api/resolve-config | Configuration resolution with feature detection | config | 18 | Customization | N | Configuration management |
| createRAGEngine | app-api/rag-engine | RAG engine for document-based context | memory,rag | 17 | Advanced Usage | N | RAG integration |
| estimateTokens | app-api/token-engine | Accurate token estimation across models | token | 22 | Token Optimization | Y | Cost calculation utility |
| createPipeline | hooks/clarity-tokens/pipeline | Token optimization pipeline with middleware | token | 22 | Token Optimization | Y | Advanced token processing |
| createOpenAIAdapter | hooks/clarity-tokens/adapters | OpenAI provider adapter for token optimization | token | 22 | Token Optimization | Y | Provider integration |
| createAnthropicAdapter | hooks/clarity-tokens/adapters | Anthropic provider adapter for token optimization | token | 22 | Token Optimization | Y | Provider integration |
| formatErrorForDisplay | app-api/dx-hints | User-friendly error formatting with suggestions | dx | 16 | Troubleshooting | N | Developer experience |

### 3.4 Interactive Elements (Command Palettes, Menus, Mentions)

| Name | Path/Export | Purpose | Tags | Score (0-25) | Docs Placement | Demo Candidate | Notes |
|------|-------------|---------|------|--------------|----------------|----------------|-------|
| useCommandPalette | hooks/keyboard/use-command-palette | Command palette with /commands and @mentions | commands | 20 | Commands & Mentions | Y | Keyboard-first UX |
| CommandPalette | components/navigation/command-palette | Visual command palette component | commands | 19 | Commands & Mentions | Y | Slash commands interface |
| useKeyboardShortcuts | hooks/keyboard/use-keyboard-shortcuts | Global keyboard shortcut management | ux | 18 | Advanced Usage | N | Keyboard navigation system |

## 4) Streamlined Docs Sitemap (v1)

**Navigation Structure:**
- **Getting Started** (Golden Path)
  - Quick Start (3 APIs: one-line, preset, builder)
  - Basic Chat Setup
  - Adding Streaming
  - Adding Tool Calling
  - Adding Memory

- **Core Components**
  - ClarityChatApp API Reference
  - ChatWindow Component
  - Message Components
  - Input Components

- **Streaming**
  - Token-by-token Streaming
  - 60fps Text Smoothing
  - Multiple Transport Layers (SSE/WebSocket)
  - Streaming Progress Indicators
  - Abort/Cancel Operations
  - Stream Optimization
  - Error Handling

- **Tool Calling**
  - Tool Definition Format
  - Tool Execution Lifecycle
  - Tool Result Rendering
  - Safety and Validation

- **Commands & Mentions**
  - Command Palette Setup
  - Slash Commands (/)
  - @Mentions
  - Keyboard Shortcuts

- **Token Optimization**
  - Complete Token Optimization Suite
  - Caching Strategies (Semantic, Exact, Embedding)
  - Context Compression & Management
  - Adaptive Model Selection
  - Cost Tracking & Budgeting
  - Performance Optimization

- **Customization & Theming**
  - Built-in Presets
  - Theme Configuration
  - Component Styling

- **Reference**
  - API Reference (auto-generated)
  - Type Definitions
  - Migration Guide (legacy API)

**Rationale:** This sitemap focuses on adoption by providing a clear learning path from basic to advanced features, with each section proving incremental value. No sections exist unless they directly support understanding core differentiators or enable successful implementation.

## 5) Golden Path (Shortest Path to Advanced AI Chat)

**Step-by-step sequence:**

1. **Install & Basic Chat (2 min)**: `npm install @clarity-chat/react` + `ClarityChatApp` with API endpoint
2. **Add Streaming (1 min)**: Enable streaming prop - automatic token-by-token display
3. **Add Tool Calling (3 min)**: Register tools via config - automatic execution UI
4. **Add Memory (1 min)**: Enable memory prop - automatic context persistence
5. **Add Token Optimization (2 min)**: Configure budget - automatic compression and cost tracking

**Minimal code concepts required:**
- Component props/configuration objects
- Basic async functions (tool definitions)
- Simple state management (messages array)

**Showcase items used:**
- ClarityChatApp (steps 1-5)
- useClarityChatApp (steps 1-5)
- StreamingMessage (step 2)
- useStreaming/useStreamStatus (step 2)
- VirtualizedMessageList/TanStackMessageList (step 2)
- ToolExecutionCard (step 3)
- createToolsEngine (step 3)
- createMemoryEngine (step 4)
- createTokenEngine + useTokenOptimization suite (step 5)
- TokenOptimizationPanel + TokenUsageMeter + TokenBudgetBar (step 5)

## 6) Minimal Demos/Examples Required for v1

### Basic Chat Demo
**Purpose:** Prove the unified API works in 3 minutes
**What it proves:** Fast time-to-value, clean API surface
**Core components/hooks:** ClarityChatApp, ChatWindow, VirtualizedMessageList
**Expected UX:** Send/receive messages, basic error handling, smooth scrolling
**Docs embedding:** Inline in Getting Started, live playground

### Streaming Chat Demo
**Purpose:** Demonstrate streaming differentiation
**What it proves:** Token-by-token streaming with abort/cancel, performance optimization
**Core components/hooks:** ClarityChatApp + streaming config, StreamingMessage, useStreamStatus, useStreaming, useSmoothedText
**Expected UX:** Real-time token streaming, cancel button, progress indicators, 60fps text rendering
**Docs embedding:** Inline streaming section, before/after comparison

### Tool Calling Demo
**Purpose:** Show tool execution lifecycle
**What it proves:** Automatic tool calling, result rendering, error handling
**Core components/hooks:** ClarityChatApp + tools config, ToolExecutionCard, createToolsEngine
**Expected UX:** AI calls tools, shows execution status, displays results, handles errors
**Docs embedding:** Interactive demo with sample tools (calculator, time, UUID)

### Commands & Mentions Demo
**Purpose:** Demonstrate keyboard-first UX
**What it proves:** Slash commands, @mentions, command palette
**Core components/hooks:** CommandPalette, useCommandPalette, keyboard shortcuts
**Expected UX:** Cmd+K opens palette, /commands work, @mentions highlight
**Docs embedding:** Embedded interactive demo in Commands section

### Token Optimization Demo
**Purpose:** Show complete token optimization suite
**What it proves:** Automatic budgeting, compression, caching, cost tracking, adaptive models
**Core components/hooks:** TokenOptimizationPanel, TokenOptimizationDashboard, TokenUsageMeter, TokenBudgetBar, useTokenOptimization, useTokenCounter, useSemanticCache, usePromptCompressor, useAdaptiveModel
**Expected UX:** Budget warnings, cost estimates, compression indicators, cache hits, model adaptation
**Docs embedding:** Comprehensive dashboard showing all optimization features in action

## 7) Gaps / Risks / Dependencies

**Gaps:**
- No live demo environment for testing integrations
- Limited example API endpoints for testing
- No interactive playground for configuration testing

**Risks:**
- Tool calling examples may require external APIs (weather, etc.)
- Streaming demos need reliable API endpoints
- Token optimization demos need cost calculation APIs

**Dependencies:**
- All dependencies are MIT/Apache-2.0/BSD compatible
- No GPL/LGPL dependencies found
- No commercial/restrictive licenses

## 8) Raw Inventory Appendix

### Deferred Components (Score <18 or not core to AI chat)
- Enterprise features: ApiTokenManager, SSOConfigWizard, AuthTenantDashboard (enterprise-only)
- Analytics dashboards: AnalyticsDashboard, PerformanceDashboard, UsageDashboard (advanced usage)
- A/B testing: experiment-card, variant-card, winner-banner (advanced optimization)
- Theme components: ThemeContrastChecker, ThemePreview (customization)
- AI operations: PromptTestHarness, EvaluationDashboard (development tools)

### Deferred Hooks (Score <18 or advanced usage)
- Advanced streaming: useStreamingSSE, useStreamingWebSocket (protocol-specific)
- Resilience: useRetryWithBackoff, useCircuitBreaker (infrastructure)
- Performance: useSmartCache, useIndexedDB (optimization)
- Dashboard: useDashboardComposer, useDashboardData (analytics)

### Deferred Utilities
- Migration helpers: VercelAdapter, OpenAIAdapter (legacy support)
- Testing utilities: mockChatAPI, renderChatWithDefaults (development)
- Security utilities: sanitizeHTML, auditComponentSecurity (compliance)
- Visual regression: VisualRegressionTester (QA)

**Deferral reasons:** These features, while valuable, don't contribute to the core AI chat differentiation or initial adoption success. They can be added in v1.1+ once the core value is proven.

**Updated Scope:** The core showcase set now includes the complete token optimization package (all clarity-tokens hooks and components) and full streaming capabilities (all streaming hooks and optimizations) as requested. Chat virtualization and performance optimization components are also fully included.

---

*Scoring Rubric Applied:*
1) Differentiation Value (0-5): How unique/competitive is this feature?
2) Adoption Impact (0-5): How quickly does this help users succeed?
3) AI Chat Core Relevance (0-5): How central to streaming/tools/memory/commands/token?
4) Explainability (0-5): How easy is this to understand and implement? (lower complexity = higher score)
5) Demo Readiness (0-5): How easily can this be shown interactively?

**Core Showcase Set:** Includes the complete token optimization package, full streaming capabilities, and chat performance optimizations as required. All items scoring ≥18/25 plus comprehensive token optimization, streaming, and virtualization features are included to fully showcase the library's differentiation.