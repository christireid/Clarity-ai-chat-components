# AI Component Inventory

**Last Updated**: 2025-01-20  
**Audit Phase**: Phase 1 - Component Discovery

## Overview

This document catalogs all AI-related components in the Clarity Chat library, their purposes, dependencies, and integration points.

## Component Categories

### 1. Core Chat Components

#### ChatWindow
- **Location**: `packages/react/src/components/chat/chat-window.tsx`
- **Purpose**: Main chat interface component that displays messages and handles user input
- **Key Features**:
  - Message list rendering with animations
  - Chat input integration
  - Loading states and thinking indicators
  - Message actions (copy, feedback, retry, edit, delete)
  - Error banner display
  - Stop generation functionality
  - Starter prompts and follow-up suggestions
- **Dependencies**:
  - `MessageList` - Message rendering
  - `ChatInput` - User input
  - `ThinkingIndicator` - AI processing status
  - `PromptSuggestions` - Prompt suggestions
  - `useUIEnhancements` - UI enhancement hooks
  - `usePerformanceMonitoring` - Performance tracking
- **AI Integration**: Displays AI responses, handles streaming, manages conversation state
- **Props**: `messages`, `isLoading`, `aiStatus`, `onSendMessage`, `onStopGeneration`, `error`, `onRetry`
- **Accessibility**: ARIA live regions, skip links, keyboard navigation

#### ChatInput
- **Location**: `packages/react/src/components/chat/chat-input.tsx`
- **Purpose**: Input component for chat messages with character counting and validation
- **Key Features**:
  - Character counter with warning thresholds
  - Auto-resizing textarea
  - Smooth animations
  - Keyboard shortcuts (Enter to submit, Shift+Enter for newline)
  - Request deduplication
- **Dependencies**:
  - `useRequestDeduplication` - Prevents double-submit
  - `Textarea` primitive
- **AI Integration**: Captures user prompts, validates input before sending to AI
- **Props**: `value`, `onChange`, `onSubmit`, `maxLength`, `disabled`
- **Accessibility**: ARIA labels, error announcements, keyboard navigation

#### ClarityChat
- **Location**: `packages/react/src/components/chat/clarity-chat.tsx`
- **Purpose**: Drop-in chat component with full AI integration
- **Key Features**:
  - Complete chat interface
  - Built-in streaming support
  - Memory integration
  - Error handling
- **Dependencies**:
  - `useClarityChat` - Main chat hook
  - `ChatWindow` - UI component
- **AI Integration**: Full AI chat functionality

### 2. AI-Specific Components

#### ChainOfThought
- **Location**: `packages/react/src/components/ai/chain-of-thought.tsx`
- **Purpose**: Visualizes step-by-step AI reasoning
- **Key Features**:
  - Collapsible sections
  - Progress indicators
  - Status badges
  - Streaming support
- **Dependencies**: `useChainOfThought` hook
- **AI Integration**: Displays AI reasoning steps

#### Citation / SourceCitation
- **Location**: `packages/react/src/components/ai/citation.tsx`, `source-citation.tsx`
- **Purpose**: Displays citations and sources for AI responses
- **Key Features**:
  - Multiple citation variants
  - Source navigation
  - Confidence scores
- **AI Integration**: Shows RAG sources and citations

#### ThinkingBar / ThinkingIndicator
- **Location**: `packages/react/src/components/ai/thinking-bar.tsx`, `packages/react/src/components/message/thinking-indicator.tsx`
- **Purpose**: Visual indicator for AI processing status
- **Key Features**:
  - Animated progress indicators
  - Status messages
  - Streaming progress
- **AI Integration**: Shows AI is processing

#### StreamingProgress
- **Location**: `packages/react/src/components/ai/streaming-progress.tsx`
- **Purpose**: Comprehensive streaming progress visualization
- **Key Features**:
  - Token count display
  - Progress bars
  - Time estimates
- **AI Integration**: Shows streaming status and metrics

#### TextShimmer
- **Location**: `packages/react/src/components/ai/text-shimmer.tsx`
- **Purpose**: Animated text placeholder for loading states
- **Key Features**:
  - Multiple variants (paragraph, heading, code)
  - Smooth animations
  - Accessibility support
- **AI Integration**: Loading indicator for AI responses

#### ToolExecutionCard
- **Location**: `packages/react/src/components/ai/tool-execution-card.tsx`
- **Purpose**: Displays tool call execution status
- **Key Features**:
  - Tool call visualization
  - Execution status
  - Results display
- **AI Integration**: Shows tool calling in AI responses

#### AgentRunFeed
- **Location**: `packages/react/src/components/ai/agent-run-feed.tsx`
- **Purpose**: Displays agent execution feed
- **Key Features**:
  - Agent step visualization
  - Tool execution tracking
  - Status updates
- **AI Integration**: Multi-agent workflows

#### ModelSelector
- **Location**: `packages/react/src/components/ai/model-selector.tsx`
- **Purpose**: UI for selecting AI models
- **Key Features**:
  - Model comparison
  - Feature display
  - Cost information
- **AI Integration**: Model selection for AI requests

#### PersonaPanel
- **Location**: `packages/react/src/components/ai/persona-panel.tsx`
- **Purpose**: Displays AI persona information
- **Key Features**:
  - Persona selection
  - Role display
  - Expertise areas
- **AI Integration**: Persona management

#### SessionSummaryCard
- **Location**: `packages/react/src/components/ai/session-summary-card.tsx`
- **Purpose**: Displays conversation summary
- **Key Features**:
  - Summary generation
  - Key points extraction
  - Export functionality
- **AI Integration**: Conversation summarization

#### SafetyStatusCard
- **Location**: `packages/react/src/components/ai/safety-status-card.tsx`
- **Purpose**: Displays AI safety status
- **Key Features**:
  - Safety scores
  - Content filtering status
  - Warnings
- **AI Integration**: Safety monitoring

#### KnowledgeBaseViewer
- **Location**: `packages/react/src/components/ai/knowledge-base-viewer.tsx`
- **Purpose**: Displays knowledge base content
- **Key Features**:
  - Document browsing
  - Search functionality
  - Citation display
- **AI Integration**: RAG knowledge base

#### EnhancedMarkdownRenderer / MarkdownRendererEnhanced
- **Location**: `packages/react/src/components/ai/enhanced-markdown-renderer.tsx`, `markdown-renderer-enhanced.tsx`
- **Purpose**: Enhanced markdown rendering for AI responses
- **Key Features**:
  - Syntax highlighting
  - Code block handling
  - Streaming support
  - XSS protection
- **AI Integration**: Renders AI-generated markdown

#### EnhancedCodeBlock
- **Location**: `packages/react/src/components/ai/enhanced-code-block.tsx`
- **Purpose**: Enhanced code block display
- **Key Features**:
  - Syntax highlighting
  - Copy buttons
  - Line numbers
  - Streaming support
- **AI Integration**: Displays AI-generated code

### 3. Token Management Components

#### TokenCounter
- **Location**: `packages/react/src/components/token/token-counter.tsx`
- **Purpose**: Displays token usage with warnings
- **Key Features**:
  - Real-time token counting
  - Cost estimation
  - Progress bars
  - Warning thresholds
- **Dependencies**: `useTokenCounter` hook
- **AI Integration**: Token usage tracking

#### TokenOptimizationDashboard
- **Location**: `packages/react/src/components/token/token-optimization-dashboard.tsx`
- **Purpose**: Comprehensive token optimization metrics
- **Key Features**:
  - Optimization breakdown
  - Cost savings display
  - Real-time updates
- **Dependencies**: Token optimization hooks
- **AI Integration**: Token optimization tracking

#### TokenOptimizationPanel
- **Location**: `packages/react/src/components/token/token-optimization-panel.tsx`
- **Purpose**: Token optimization controls and settings
- **Key Features**:
  - Optimization toggles
  - Strategy selection
  - Settings management
- **AI Integration**: Token optimization configuration

#### TokenBudgetBar
- **Location**: `packages/react/src/components/token/token-budget-bar.tsx`
- **Purpose**: Visual budget tracking bar
- **Key Features**:
  - Budget visualization
  - Usage tracking
  - Warnings
- **AI Integration**: Budget management

#### TokenOptimizationBadge
- **Location**: `packages/react/src/components/token/token-optimization-badge.tsx`
- **Purpose**: Compact token optimization indicator
- **Key Features**:
  - Savings display
  - Compact UI
  - Status indicator
- **AI Integration**: Quick optimization status

### 4. Message Components

#### Message / StreamingMessage
- **Location**: `packages/react/src/components/message/message.tsx`, `streaming-message.tsx`
- **Purpose**: Individual message display with streaming support
- **Key Features**:
  - Streaming text rendering
  - Markdown support
  - Message actions
  - Citation display
- **AI Integration**: Displays AI responses

#### MessageList
- **Location**: `packages/react/src/components/message/message-list.tsx`
- **Purpose**: List of messages with virtualization
- **Key Features**:
  - Virtual scrolling
  - Streaming support
  - ARIA live regions
- **AI Integration**: Message list for conversations

#### StreamBlock
- **Location**: `packages/react/src/components/message/stream-block.tsx`
- **Purpose**: Block-level streaming content
- **Key Features**:
  - Streaming support
  - Markdown rendering
  - Code block handling
- **AI Integration**: Streaming content blocks

#### CitationCard
- **Location**: `packages/react/src/components/message/citation-card.tsx`
- **Purpose**: Citation display in messages
- **Key Features**:
  - Source display
  - Navigation
  - Confidence scores
- **AI Integration**: RAG citations

### 5. Prompt Components

#### PromptSuggestions
- **Location**: `packages/react/src/components/prompt/prompt-suggestions.tsx`
- **Purpose**: Displays suggested prompts
- **Key Features**:
  - Starter prompts
  - Follow-up suggestions
  - Click to use
- **AI Integration**: Prompt assistance

#### FollowUpSuggestions
- **Location**: `packages/react/src/components/prompt/follow-up-suggestions.tsx`
- **Purpose**: Follow-up prompt suggestions
- **Key Features**:
  - Context-aware suggestions
  - Quick actions
- **AI Integration**: Conversation flow assistance

### 6. Context Management Components

#### ContextManager
- **Location**: `packages/react/src/components/context/context-manager.tsx`
- **Purpose**: Manages conversation context
- **Key Features**:
  - Context editing
  - Token tracking
  - Pruning suggestions
- **AI Integration**: Context window management

#### ContextVisualizer
- **Location**: `packages/react/src/components/context/context-visualizer.tsx`
- **Purpose**: Visualizes context window usage
- **Key Features**:
  - Token visualization
  - Message highlighting
  - Pruning controls
- **AI Integration**: Context visualization

#### MemoryInspector
- **Location**: `packages/react/src/components/context/memory-inspector.tsx`
- **Purpose**: Inspects memory/context state
- **Key Features**:
  - Memory display
  - Context inspection
  - Debugging tools
- **AI Integration**: Memory management

### 7. Conversation Components

#### ConversationList
- **Location**: `packages/react/src/components/conversation/conversation-list.tsx`
- **Purpose**: List of conversations
- **Key Features**:
  - Conversation browsing
  - Search functionality
  - Metadata display
- **AI Integration**: Conversation management

#### ConversationTimeline
- **Location**: `packages/react/src/components/conversation/conversation-timeline.tsx`
- **Purpose**: Timeline view of conversations
- **Key Features**:
  - Timeline visualization
  - Event tracking
  - Navigation
- **AI Integration**: Conversation history

#### ConversationBranchVisualizer
- **Location**: `packages/react/src/components/conversation/conversation-branch-visualizer.tsx`
- **Purpose**: Visualizes conversation branches
- **Key Features**:
  - Branch visualization
  - Navigation
  - Comparison
- **AI Integration**: Conversation branching

### 8. Input Components

#### AdvancedChatInput
- **Location**: `packages/react/src/components/input/advanced-chat-input.tsx`
- **Purpose**: Advanced input with multiple features
- **Key Features**:
  - File upload
  - Voice input
  - Mention support
  - Token counting
- **AI Integration**: Multi-modal input

#### VoiceInput
- **Location**: `packages/react/src/components/input/voice-input.tsx`
- **Purpose**: Voice input for chat
- **Key Features**:
  - Speech recognition
  - Transcription
  - Visual feedback
- **AI Integration**: Voice-to-text input

### 9. Search Components

#### MessageSearch / SemanticMessageSearch
- **Location**: `packages/react/src/components/search/message-search.tsx`, `advanced-message-search-semantic.tsx`
- **Purpose**: Search through conversation history
- **Key Features**:
  - Text search
  - Semantic search
  - Filtering
- **AI Integration**: AI-powered semantic search

## Component Dependencies Graph

```
ChatWindow
├── MessageList
│   ├── Message
│   │   ├── MarkdownRendererEnhanced
│   │   ├── CitationCard
│   │   └── StreamBlock
│   └── StreamingMessage
├── ChatInput
│   └── useRequestDeduplication
├── ThinkingIndicator
├── PromptSuggestions
└── useClarityChat (hook)
    ├── useStreamingSSE
    ├── useTokenCounter
    └── useMemory

TokenCounter
└── useTokenCounter
    └── AccurateTokenCounter

TokenOptimizationDashboard
└── useTokenOptimization
    ├── useTokenCounter
    ├── useSemanticCache
    └── usePromptCompressor
```

## Indirect AI Integration Components

These components don't directly call AI services but support AI functionality:

- **ErrorBoundary** - Error handling for AI failures
- **NetworkStatus** - Connection status for AI requests
- **ExportDialog** - Export AI conversations
- **CommandPalette** - Quick actions for AI features
- **EmptyState** - Empty states for AI chats

## Notes

- All components support TypeScript with full type safety
- Components follow accessibility best practices (WCAG 2.1 AA)
- Components are themeable and customizable
- Performance optimizations include virtualization and memoization
- Components support both streaming and non-streaming modes
