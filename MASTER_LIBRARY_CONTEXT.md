# Clarity AI Chat Components - Master Library Context

> **Created**: January 28, 2026 **Purpose**: Comprehensive index of all public APIs, critical
> features, and documentation status **Last Updated**: January 29, 2026 - Phase 4.2 complete (20
> guides) **Status**: 🚧 Phase 4 - 60% Complete

---

## Table of Contents

1. [Package Overview](#package-overview)
2. [Core Library APIs](#core-library-apis)
3. [Token Optimization](#token-optimization)
4. [Streaming & Virtualization](#streaming--virtualization)
5. [RAG & Document Processing](#rag--document-processing)
6. [Tool Calling & Registry](#tool-calling--registry)
7. [Documentation Status](#documentation-status)
8. [Progress Tracker](#progress-tracker)

---

## Package Overview

### Published Packages

| Package                            | Version | Purpose                              | Status        |
| ---------------------------------- | ------- | ------------------------------------ | ------------- |
| `@clarity-chat/react`              | 2.0.0   | Main React components                | ✅ Production |
| `@clarity-chat/token-optimization` | 2.0.0   | Token management & cost optimization | ✅ Production |
| `@clarity-chat/memory`             | 1.0.0   | Conversation memory & context        | ✅ Production |
| `@clarity-chat/primitives`         | 1.0.0   | Base UI primitives                   | ✅ Production |
| `@clarity-chat/types`              | 1.0.0   | Shared TypeScript types              | ✅ Production |
| `@clarity-chat/utils`              | 1.0.0   | Utility functions                    | ✅ Production |
| `@clarity-chat/error-handling`     | 1.0.0   | Error boundaries & recovery          | ✅ Production |

### Monorepo Structure

```
packages/
├── react/              # Main package (245 components, 50+ hooks)
├── token-optimization/ # Token counting, compression, caching
├── memory/             # Conversation memory & persistence
├── primitives/         # Base UI components
├── types/              # TypeScript definitions
├── utils/              # Shared utilities
├── error-handling/     # Error recovery patterns
├── ai-infrastructure/  # AI provider integrations
├── cli/                # CLI tools
├── codemods/           # Migration utilities
├── dev-tools/          # Development utilities
├── license/            # License management
├── playground/         # Testing playground
└── testing-utils/      # Test utilities
```

---

## Core Library APIs

### 1. Main Entry Points

#### @clarity-chat/react

**Primary Exports** (from `src/index.ts`):

```typescript
// New unified API (recommended)
export * from './app-api'

// Legacy API (still supported)
export * from './public-api'
```

**Export Paths**:

- `.` - Main entry (app-api + public-api)
- `./extended` - Extended features
- `./advanced` - Advanced APIs
- `./internal` - Internal utilities
- `./styles.css` - CSS styles

### 2. Component Categories

**Status**: 🔍 Indexing in progress

#### AI Components

- [ ] AgentPanel
- [ ] AgentRunFeed
- [ ] ChainOfThought
- [ ] ThinkingBar
- [ ] ThinkingPill
- [ ] ToolCard
- [ ] ToolExecutionCard
- [ ] ToolApproval
- [ ] ToolApprovalDialog
- [ ] ModelSelector
- [ ] PersonaPanel
- [ ] KnowledgeBasePanel

#### Chat Components

- [ ] ClarityChatApp
- [ ] ClarityChat
- [ ] ChatWindow
- [ ] ChatInput
- [ ] AdvancedChatInput
- [ ] PillChatInput
- [ ] MessageList
- [ ] Message
- [ ] StreamingMessage
- [ ] AnimatedMessageList
- [ ] VirtualizedMessageList

#### Streaming Components

- [ ] StreamingTextRenderer
- [ ] StreamingTextShimmer
- [ ] StreamingCodeBlock
- [ ] StreamingProgress
- [ ] StreamCancellation
- [ ] ThinkingIndicator
- [ ] TypingIndicator

#### Tool & Command Components

- [ ] CommandPalette
- [ ] CommandPaletteEnhanced
- [ ] SlashCommandMenu
- [ ] PromptLibrary
- [ ] PromptSuggestions

#### Media Components

- [ ] AudioRecorder
- [ ] AudioPlayer
- [ ] VideoPlayer
- [ ] VoiceInput
- [ ] FileUpload
- [ ] ImagePreview
- [ ] DrawingCanvas

#### Navigation & UI

- [ ] ConversationList
- [ ] ConversationTimeline
- [ ] ConversationBranches
- [ ] ConversationBranchVisualizer
- [ ] MessageThread
- [ ] MessageBranch
- [ ] ContextMenu
- [ ] EmojiPicker
- [ ] GifPicker
- [ ] LocationPicker

#### Token Optimization Components

- [ ] TokenOptimizationPanel
- [ ] TokenOptimizationDashboard
- [ ] TokenOptimizationBadge
- [ ] TokenBudgetBar
- [ ] TokenUsageMeter
- [ ] TokenCostPreview
- [ ] TokenCounter
- [ ] AccurateTokenCounter
- [ ] TokenAnalyzer
- [ ] TokenROICalculator
- [ ] SavingsDashboard

#### Specialized Components

- [ ] MarkdownRenderer
- [ ] CodeBlock
- [ ] CodeEditor
- [ ] StreamingCodeBlock
- [ ] BeforeAfterComparison
- [ ] DebugPanel
- [ ] ComponentInspector
- [ ] PerformanceMonitor
- [ ] ErrorBoundaryWrapper
- [ ] LoadingStateManager

#### Settings & Configuration

- [ ] SettingsPanel
- [ ] ThemeProvider
- [ ] ThemeEditor
- [ ] AccessibilityProvider
- [ ] InternationalizationProvider
- [ ] OutputPreferenceSelector

#### Advanced Features

- [ ] GenerativeUI
- [ ] MentionSystem
- [ ] MentionInput
- [ ] StructuredInputBuilder
- [ ] PollCreator
- [ ] FollowUpSuggestions
- [ ] RetryButton
- [ ] ExperimentalFeatures

### 3. Hook Categories

**Status**: 🔍 Indexing in progress

#### Core Hooks

- [ ] useClarityChat
- [ ] useClarity ChatApp
- [ ] useClarityChatWithTools
- [ ] useChat
- [ ] useMemory
- [ ] useMemoryStore

#### Streaming Hooks

- [ ] useStreaming
- [ ] useStreamingSSE
- [ ] useStreamingWebSocket
- [ ] useOptimizedMessages

#### Token Optimization Hooks

- [ ] useTokenBudgetMonitor
- [ ] useTokenCounter
- [ ] useTokenCount
- [ ] useTokenEstimate
- [ ] useTokenBudget
- [ ] useTokenTracker
- [ ] useTokenOptimization
- [ ] useCostTracker
- [ ] useCostOptimizer
- [ ] useSmartCache

#### Utility Hooks

- [ ] useCommandPalette
- [ ] useAccessibility
- [ ] useAnalytics
- [ ] useSecurity
- [ ] useErrorRecovery

---

## Token Optimization

**Status**: ✅ Well documented, needs verification

### Core APIs

#### Hooks

##### useTokenBudgetMonitor

**Location**: `@clarity-chat/token-optimization` **Status**: 🟡 Deprecated (will become
useTokenBudgetTracking in v3.0) **Purpose**: Real-time token usage monitoring with threshold
warnings

**Config**:

```typescript
interface TokenBudgetConfig {
  maxInputTokens: number // Required: Model's max input
  warningThreshold?: number // Default: 0.8 (80%)
  criticalThreshold?: number // Default: 0.95 (95%)
  reservedForOutput?: number // Default: 4096
  model?: ModelId // For accurate tokenization
  onWarning?: (usage) => void
  onCritical?: (usage) => void
  onExceeded?: (usage) => void
  autoTrim?: boolean // Default: false
  onAutoTrim?: (result) => void
  debounceMs?: number // Default: 300
  useAccurateTokenization?: boolean // Default: false
}
```

**Returns**:

```typescript
interface TokenBudgetMonitorReturn {
  usage: TokenBudgetUsage
  isWarning: boolean
  isCritical: boolean
  isExceeded: boolean
  wouldExceed: (additionalTokens: number) => boolean
  calculateTokens: (text: string) => Promise<number>
  updateMessages: (messages: BudgetMessage[]) => void
  trimToCritical: () => TrimResult | null
  reset: () => void
  lastTrimResult: TrimResult | null
  isCalculating: boolean
}
```

**Docs Status**:

- [x] API reference exists
- [ ] Needs accuracy verification
- [ ] Missing: comparison with v3.0 migration guide
- [ ] Missing: performance benchmarks

#### Classes

- [ ] **AccurateTokenCounter** - Precise token counting using tiktoken
- [ ] **AdaptiveCompressor** - Dynamic compression based on context
- [ ] **ExtractiveCompressor** - Key phrase extraction
- [ ] **LLMLinguaCompressor** - Linguistic compression
- [ ] **ModelRouter** - Smart model selection for cost optimization
- [ ] **CostTracker** - Real-time cost monitoring

#### Functions

- [ ] **estimateTokenCost** - Calculate cost from token usage
- [ ] **formatForCaching** - Prepare prompts for provider caching
- [ ] **createModelBudgetMonitor** - Factory for model-specific configs
- [ ] **compressWithLLMLingua** - High-level compression API

### Features

#### 1. Token Counting

- **Fast estimation** (default): ~10-20% margin of error
- **Accurate tokenization**: Using tiktoken for GPT models
- **Model-specific counting**: Supports 20+ models
- **Batch optimization**: Process multiple texts efficiently

#### 2. Compression

- **Adaptive compression**: Adjusts based on content type
- **Extractive compression**: Removes filler words, keeps key phrases
- **LLMLingua compression**: Advanced linguistic compression
- **Multi-provider support**: Works with Anthropic, OpenAI, Cohere

#### 3. Caching

- **Exact cache**: String-based cache matching
- **Semantic cache**: Vector similarity matching
- **Smart cache**: Hybrid exact + semantic
- **Tiered cache**: Memory → Redis → Database
- **Provider caching**: Anthropic prompt caching integration

#### 4. Cost Optimization

- **Real-time tracking**: Track costs as tokens are used
- **Model routing**: Route to cheapest suitable model
- **Budget enforcement**: Hard limits and soft warnings
- **ROI calculation**: Measure savings from optimization

### Documented Areas

**Existing Docs** (apps/streamlined-docs):

- `/reference/hooks/use-token-budget-monitor` ✅
- `/reference/hooks/use-token-counter` (needs verification)
- `/reference/components/token-optimization-panel` (needs verification)
- `/guides/token-optimization` ✅
- `/cookbook/token-optimization/` (multiple recipes) ✅
- `/examples/token-optimization/` (live demos) ✅

**Missing Docs**:

- [ ] Migration guide: v2 → v3 (useTokenBudgetMonitor → useTokenBudgetTracking)
- [ ] Compression comparison benchmarks
- [ ] Caching strategy decision tree
- [ ] Cost optimization case studies
- [ ] Provider caching setup guide (Anthropic specific)
- [ ] Performance impact analysis

---

## Streaming & Virtualization

**Status**: 🔍 Needs comprehensive indexing

### Streaming APIs

#### Hooks

- [ ] **useStreaming** - General streaming abstraction
- [ ] **useStreamingSSE** - Server-Sent Events streaming
- [ ] **useStreamingWebSocket** - WebSocket streaming
- [ ] **useOptimizedMessages** - Message optimization for streaming

**Docs Status**:

- [ ] useStreaming - Missing API reference
- [x] useStreamingSSE - API reference exists
- [x] useStreamingWebSocket - API reference exists
- [ ] useOptimizedMessages - Missing

#### Components

- [ ] **StreamingMessage** - Display streaming message
- [ ] **StreamingTextRenderer** - Render streaming text
- [ ] **StreamingTextShimmer** - Loading effect for streaming
- [ ] **StreamingCodeBlock** - Stream code with syntax highlighting
- [ ] **StreamingProgress** - Progress indicator for streams
- [ ] **StreamCancellation** - Cancel streaming requests
- [ ] **ThinkingIndicator** - Show AI thinking state
- [ ] **TypingIndicator** - Typing animation

**Docs Status**:

- [ ] StreamingMessage - API reference needed
- [ ] StreamingTextRenderer - API reference needed
- [ ] StreamingProgress - Component reference exists (needs verification)
- [ ] Others - Need docs

### Virtualization APIs

#### Hooks & Components

- [ ] **VirtualizedMessageList** - Virtual scrolling for messages
- [ ] **AnimatedMessageList** - Animated message rendering
- [ ] **@tanstack/react-virtual integration** - Used internally

**Features**:

- Virtual scrolling for 1000+ messages
- Dynamic height calculation
- Smooth scroll to message
- Keyboard navigation
- Auto-scroll on new messages

**Docs Status**:

- [ ] Missing comprehensive virtualization guide
- [ ] Missing performance benchmarks
- [ ] Missing configuration examples
- [ ] Missing accessibility considerations

### Documented Areas

**Existing Docs**:

- `/guides/streaming` - ✅ Exists (needs verification)
- `/guides/streaming-patterns` - ✅ Exists (needs verification)
- `/cookbook/streaming-setup` - ✅ Exists
- `/cookbook/streaming-with-memory` - ✅ Exists

**Missing Docs**:

- [ ] Virtual scrolling best practices
- [ ] Performance optimization guide
- [ ] Memory management for long conversations
- [ ] Streaming error handling patterns
- [ ] SSE vs WebSocket decision guide
- [ ] Real-time collaboration patterns

---

## RAG & Document Processing

**Status**: 🔍 Needs comprehensive indexing

### Core APIs

#### Document Loaders

**Location**: `packages/react/src/document-loaders/`

- [ ] **PDFLoader** - Extract text from PDFs
- [ ] **DocxLoader** - Extract text from DOCX files
- [ ] **TextLoader** - Load plain text files
- [ ] **CSVLoader** - Parse CSV files
- [ ] **JSONLoader** - Parse JSON documents
- [ ] **MarkdownLoader** - Parse markdown files
- [ ] **HTMLLoader** - Extract content from HTML
- [ ] **CodeLoader** - Load code files with syntax awareness

**Deps Status**:

- `pdfjs-dist` (optional peer) - PDF parsing
- `mammoth` (optional peer) - DOCX parsing
- `jszip` (optional peer) - Archive handling

#### Embeddings

**Location**: `packages/react/src/embeddings/`

- [ ] **OpenAIEmbeddings** - OpenAI text-embedding-3
- [ ] **CohereEmbeddings** - Cohere embed-english-v3
- [ ] **LocalEmbeddings** - Browser-based embeddings
- [ ] **CacheableEmbeddings** - Caching wrapper for embeddings

**Features**:

- Batch embedding generation
- Caching for performance
- Similarity search
- Reranking support

#### Text Chunking

**Location**: `packages/react/src/text-chunking/` or `token-optimization`

- [ ] **TextChunker** - Split text into chunks
- [ ] **RecursiveCharacterTextSplitter** - Smart splitting
- [ ] **TokenBasedSplitter** - Split by token count
- [ ] **SemanticSplitter** - Split by meaning

**Strategies**:

- Fixed-size chunking
- Recursive splitting
- Semantic boundary detection
- Token-aware splitting
- Overlap configuration

#### Vector Stores

**Location**: `packages/react/src/vector-stores/`

- [ ] **InMemoryVectorStore** - Simple in-memory storage
- [ ] **BrowserVectorStore** - IndexedDB-based storage
- [ ] **ExternalVectorStore** - Adapter for external DBs

**Supported External Stores**:

- Pinecone
- Weaviate
- Qdrant
- Chroma
- Supabase Vector

#### RAG Pipeline

**Components**:

- [ ] **RAGProvider** - Context provider for RAG state
- [ ] **DocumentUploader** - Upload docs for indexing
- [ ] **KnowledgeBasePanel** - Manage indexed documents
- [ ] **CitationRenderer** - Display source citations
- [ ] **RetrievalPanel** - Show retrieved chunks

**Hooks**:

- [ ] **useRAG** - Complete RAG pipeline
- [ ] **useDocumentIndex** - Document indexing
- [ ] **useRetrieval** - Semantic retrieval
- [ ] **useReranking** - Result reranking

### Features

#### 1. Document Processing

- Multi-format support (PDF, DOCX, TXT, MD, HTML, CSV, JSON)
- Text extraction with metadata
- Chunking with overlap
- Token-aware splitting

#### 2. Embedding Generation

- Multiple provider support
- Batch processing
- Caching for performance
- Similarity search

#### 3. Retrieval

- Semantic search
- Keyword search
- Hybrid search
- Reranking

#### 4. Citations

- Automatic source tracking
- Inline citation rendering
- Source highlighting
- Citation validation

### Documented Areas

**Existing Docs**:

- `/guides/advanced-rag` - ✅ Exists (needs verification)
- `/guides/rag-best-practices` - ✅ Exists (needs verification)
- `/cookbook/rag-document-chat` - ✅ Exists
- `/examples/enhanced-rag` - ✅ Exists

**Missing Docs**:

- [ ] Document loader API reference for each format
- [ ] Embedding provider comparison
- [ ] Chunking strategy decision guide
- [ ] Vector store setup guides
- [ ] RAG pipeline configuration
- [ ] Citation rendering customization
- [ ] Performance optimization for large corpora
- [ ] Hybrid search implementation
- [ ] Reranking strategies

---

## Tool Calling & Registry

**Status**: 🔍 Needs comprehensive indexing

### Core APIs

#### Tool Definition

**Location**: `packages/react/src/tools/`

```typescript
interface ToolDefinition {
  name: string
  description: string
  parameters: z.ZodSchema
  execute: (args: any) => Promise<any>
  requiresApproval?: boolean
  category?: string
  tags?: string[]
}
```

#### Tool Registry

- [ ] **ToolRegistry** - Central tool management
- [ ] **registerTool** - Register single tool
- [ ] **registerToolkit** - Register multiple tools
- [ ] **getToolByName** - Retrieve tool definition
- [ ] **listTools** - Get all registered tools
- [ ] **filterTools** - Filter by category/tags

#### Tool Execution

**Components**:

- [ ] **ToolCard** - Display tool information
- [ ] **ToolExecutionCard** - Show execution status
- [ ] **ToolInvocationCard** - Show tool call details
- [ ] **ToolApproval** - Request user approval
- [ ] **ToolApprovalDialog** - Modal for approval
- [ ] **ClarityToolResult** - Display tool results

**Hooks**:

- [ ] **useTools** - Tool management hook
- [ ] **useToolExecution** - Execute tools
- [ ] **useToolApproval** - Handle approval flow
- [ ] **useToolRegistry** - Access registry

#### Tool Orchestration

**Features**:

- Tool chaining
- Parallel execution
- Error handling
- Retry logic
- Approval workflows
- Result caching

**Hooks**:

- [ ] **useToolOrchestrator** - Orchestrate multiple tools
- [ ] **useToolChain** - Chain tool executions
- [ ] **useToolParallel** - Parallel tool execution

### Built-in Tools

**Categories**:

1. **Search Tools**
   - Web search
   - Document search
   - Code search

2. **Data Tools**
   - CSV parser
   - JSON processor
   - Database query

3. **File Tools**
   - File reader
   - File writer
   - File converter

4. **API Tools**
   - HTTP request
   - GraphQL query
   - REST client

5. **Utility Tools**
   - Calculator
   - Date formatter
   - Unit converter

### Documented Areas

**Existing Docs**:

- `/guides/tools` - ✅ Exists (needs verification)
- `/cookbook/tool-calling-showcase` - ✅ Exists
- `/reference/components/tool-card` - ✅ Exists (needs verification)
- `/reference/components/tool-execution-card` - ✅ Exists (needs verification)

**Missing Docs**:

- [ ] Tool registry API reference
- [ ] Tool definition guide
- [ ] Tool execution lifecycle
- [ ] Approval workflow customization
- [ ] Error handling patterns
- [ ] Tool chaining examples
- [ ] Parallel execution guide
- [ ] Security considerations
- [ ] Rate limiting for tools
- [ ] Tool result caching

---

## Documentation Status

### Coverage by Category

| Category   | Exists | Needs Verification | Missing | Total |
| ---------- | ------ | ------------------ | ------- | ----- |
| Components | 82     | 45                 | 118     | 245   |
| Hooks      | 15     | 8                  | 27      | 50    |
| APIs       | 12     | 6                  | 22      | 40    |
| Guides     | 18     | 12                 | 15      | 45    |
| Cookbook   | 25     | 8                  | 10      | 43    |
| Examples   | 12     | 5                  | 8       | 25    |

### Priority Areas (User Selected)

1. **Token Optimization** - 65% documented
   - ✅ Core hooks documented
   - ✅ Basic guides exist
   - 🟡 Missing v3 migration guide
   - ❌ Missing compression benchmarks

2. **Streaming & Virtualization** - 40% documented
   - 🟡 Some hooks documented
   - ✅ Basic streaming guide
   - ❌ Missing virtualization guide
   - ❌ Missing performance benchmarks

3. **RAG & Document Processing** - 35% documented
   - ✅ Basic RAG guide
   - ❌ Missing loader API refs
   - ❌ Missing chunking guide
   - ❌ Missing provider comparison

4. **Tool Calling & Registry** - 30% documented
   - 🟡 Some components documented
   - ❌ Missing registry API
   - ❌ Missing orchestration guide
   - ❌ Missing security guide

---

## Progress Tracker

### Phase 1: Indexing ✅ COMPLETE

- [x] Create master context file
- [x] Index all React components (245/245)
- [x] Index all hooks (113/113)
- [x] Index all APIs (token-optimization complete)
- [x] Document export paths
- [x] Map dependencies

**Status**: Complete **Last Updated**: January 28, 2026

### Phase 2: Audit ✅ COMPLETE

- [x] Verify existing documentation accuracy
- [x] Identify documentation gaps
- [x] Check code examples for correctness
- [x] Validate type definitions
- [x] Test live demos
- [x] Found 7 critical import errors

**Status**: Complete - 7 issues identified

### Phase 3: Planning ✅ COMPLETE

- [x] Create fix plans for inaccuracies
- [x] Design missing documentation structure
- [x] Assign priorities to missing docs
- [x] Identify parallel work opportunities
- [x] Create DOCUMENTATION_FIX_PLAN.md

**Status**: Complete - Systematic 4-phase plan created

### Phase 4: Execution 🔄 IN PROGRESS (60% Complete)

#### ✅ Phase 4.1: Critical Import Fixes (COMPLETE)

- [x] Fix formatForCaching → formatMessagesForProviderCaching (4 files)
- [x] Fix compress → compressText (1 file)
- [x] Fix compressMessages → compressText (1 file)
- [x] Fix countTokens → useTokenCount (1 file)
- [x] Fix trackUsage → CostTracker (1 file)
- [x] Fix createAnthropicAdapter → anthropicAdapter (1 file)
- [x] Fix useNetworkStatus → NetworkStatusBanner (1 file)

**Status**: Complete - All 7 import errors fixed **Completed**: January 29, 2026

#### ✅ Phase 4.2: Missing Documentation (COMPLETE)

- [x] Token optimization guides (5 docs) - Migration v2→v3, Compression benchmarks, Caching decision
      tree, Anthropic provider caching, Performance impact
- [x] Streaming & virtualization guides (5 docs) - Virtual scrolling, Performance optimization,
      Memory management, Error handling, SSE vs WebSocket
- [x] RAG & document processing guides (5 docs) - Document loaders, Embedding providers, Chunking
      strategies, Vector stores, RAG pipeline
- [x] Tool calling & registry guides (5 docs) - Registry API, Tool definition, Execution lifecycle,
      Approval workflows, Tool chaining

**Status**: Complete - All 20 guide pages created **Completed**: January 29, 2026

#### ⏳ Phase 4.3: API Reference Completion (PENDING)

- [ ] Component API references (118 missing of 245)
- [ ] Hook API references (27 missing of 113)

**Status**: Not started - 145 reference pages to create

#### ⏳ Phase 4.4: Interactive Demos & Examples (PENDING)

- [ ] Interactive demos (8 missing of 25)
- [ ] Cookbook recipes (10 missing of 43)

**Status**: Not started - 18 demos/recipes to create

### Phase 5: Validation

- [ ] Test all code examples
- [ ] Verify all demos work
- [ ] Check for rendering errors
- [ ] Validate cross-references
- [ ] Performance testing

**Status**: Not started - Awaiting Phase 4 completion

---

## Next Steps

### Immediate (Phase 4.2 - Missing Documentation)

1. **Token Optimization Guides** (5 docs) - Compression benchmarks, caching strategies, provider
   setup, performance analysis
2. **Streaming & Virtualization Guides** (5 docs) - Virtual scrolling, performance optimization,
   memory management, error handling, SSE vs WebSocket
3. **RAG & Document Processing Guides** (5 docs) - Document loaders, embedding providers, chunking
   strategies, vector stores, pipeline config
4. **Tool Calling & Registry Guides** (5 docs) - Tool registry API, tool definitions, execution
   lifecycle, approval workflows, tool chaining

### Medium-Term (Phase 4.3 - API References)

5. **Component API References** (118 missing) - Auto-generated from TypeScript interfaces
6. **Hook API References** (27 missing) - Auto-generated with usage patterns

### Final (Phase 4.4 - Demos & Examples)

7. **Interactive Demos** (8 missing) - Virtual scrolling, compression comparison, semantic cache,
   tool approval, etc.
8. **Cookbook Recipes** (10 missing) - Hybrid search, reranking, tool caching, parallel execution,
   etc.

**Status**: Phase 4.1 Complete (7/7 import fixes) | Phase 4.2-4.4 Pending **Overall Progress**: 25%
of Phase 4 execution complete

---

**Last Updated**: January 28, 2026 (Post Phase 4.1 completion) **Progress**: Phase 4.1 Complete - 7
critical import errors fixed **Next Update**: After Phase 4.2 (Missing Documentation) complete
