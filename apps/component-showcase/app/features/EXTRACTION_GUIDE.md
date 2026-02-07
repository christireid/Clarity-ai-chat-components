# Features Page Extraction Guide

This directory contains the component showcase features page, which was originally
a single 6,647-line monolithic file containing 60+ demo components.

## Directory Structure

```
features/
├── page.tsx              # Main page: tabs layout, imports from demos/
├── demos/
│   ├── index.ts          # Barrel re-export of all demo categories
│   ├── code-demos.tsx    # Code & Dev: CodeDiffViewer, TestRunnerPanel, FileTreeComponent, etc.
│   ├── workflow-demos.tsx # Workflows: HumanInTheLoop, TaskOrchestratorDemo, etc.
│   ├── data-demos.tsx    # Data & Forms: CitationChipsDemo, DataTableDemo, etc.
│   ├── ui-demos.tsx      # UI Patterns: SnippetManagerDemo, BeforeAfterDemo, etc.
│   ├── realtime-demos.tsx # Realtime & Status: StepsIndicatorDemo, ProgressIndicatorsDemo, etc.
│   ├── voice-demos.tsx   # Voice & Media: VoiceComponentsDemo, CalendarDemo, etc.
│   ├── auth-demos.tsx    # Auth & Settings: SettingsPanelDemo, LoginFormDemo, etc.
│   ├── social-demos.tsx  # Social & Chat: ReactionsDemo, QuickReplyDemo, etc.
│   ├── devtools-demos.tsx # Dev Tools: DevToolsDashboardDemo, APIInspectorDemo, etc.
│   ├── error-demos.tsx   # Error Handling: ErrorDisplayDemo, CircuitBreakerDemo, etc.
│   ├── token-demos.tsx   # Token Optimization: TokenOptimizationDashboardDemo, etc.
│   ├── streaming-demos.tsx # Streaming: StreamingTextShimmerDemo, TypingIndicatorDemo, etc.
│   └── adapter-demos.tsx # AI Adapters: MultiProviderAdapterDemo, ProviderHealthDemo, etc.
└── EXTRACTION_GUIDE.md   # This file
```

## How to Extract a Demo Component

1. Copy the function and its section comment from `page.tsx`
2. Add necessary imports (useState, primitives, lucide-react icons)
3. Export the function
4. In `page.tsx`, replace the function with an import from the demos file
5. Verify the tab still renders correctly

### Example (already extracted):

```tsx
// demos/code-demos.tsx
'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, ... } from '@clarity-chat/primitives'
import { Code, Play, ... } from 'lucide-react'

export function CodeDiffViewer() { ... }
export function TestRunnerPanel() { ... }
export function FileTreeComponent() { ... }
export function CommitLog() { ... }
export function CodeSandboxPreview() { ... }
export function WebPreviewPanel() { ... }
```

```tsx
// page.tsx (after extraction)
import { CodeDiffViewer, TestRunnerPanel, ... } from './demos/code-demos'
```

## Category → Component Mapping

| Category | Tab Value | Components | Line Range |
|----------|-----------|------------|------------|
| Code & Dev | code | CodeDiffViewer, TestRunnerPanel, FileTreeComponent, CommitLog, CodeSandboxPreview, WebPreviewPanel | 160-632 |
| Workflows | workflow | HumanInTheLoop, ConfirmationDialogDemo, ComponentCardsDemo, TaskOrchestratorDemo, ArtifactPanel, BookmarksPanel, ChainOfThoughtDemo | 635-1092 |
| Data & Forms | data | CitationChipsDemo, CostTrackerDemo, DataTableDemo, DynamicFormDemo, EnvironmentVariablesDemo, EmptyStateDemo | 1095-1390 |
| UI Patterns | ui | SnippetManagerDemo, SchemaDisplayDemo, StatsDisplayDemo, BeforeAfterDemo, LinkPreviewDemo, ContextMenuDemo, ModelSelectorDemo, KeyboardShortcutsDemo, SuggestionChipsDemo | 1392-1839 |
| Realtime & Status | realtime | StepsIndicatorDemo, ThreadsViewDemo, ProgressIndicatorsDemo, RealtimeIndicatorDemo, SafetyComponentsDemo | 1842-2131 |
| Voice & Media | voice | CalendarDemo, MessageActionsDemo, VoiceComponentsDemo, QueueDisplayDemo, PresetsSelectorDemo, RAGSourcesDemo, RichEmbedDemo, ReadReceiptDemo | 2133-2484 |
| Auth & Settings | auth | RetryLogicDemo, SettingsPanelDemo, MCPManagerDemo, LoginFormDemo, PasswordInputDemo | 2487-2764 |
| Social & Chat | social | PinnedMessagesDemo, ReactionsDemo, QuickReplyDemo, SocialPostsDemo, SortableListDemo, TableOfContentsDemo, TraceViewDemo, WebSearchDemo, WorkflowNodesDemo, BranchPickerDemo, ChatSidebarDemo, CopyButtonDemo, ConversationManagerDemo | 2767-3425 |
| Dev Tools | devtools | DevToolsDashboardDemo, APIInspectorDemo, ProfilerPanelDemo, TimeTravelDemo, ModelComparisonDemo | 3428-3720 |
| Error Handling | errors | ErrorDisplayDemo, ErrorBoundaryDemo, RetryCountdownDemo, CircuitBreakerDemo, ErrorToastDemo | 3723-4073 |
| Token Optimization | tokens | TokenOptimizationDashboardDemo, TokenOptimizationPanelDemo, TokenCostPreviewDemo, TokenUsageMeterDemo, TokenCounterDemo, TokenBudgetBarDemo, TokenOptimizationBadgeDemo, TokenROICalculatorDemo | 4076-4786 |
| Streaming | streaming | StreamingTextShimmerDemo, TextShimmerDemo, StreamProgressDemo, StreamingCursorDemo, TypingIndicatorDemo, StreamingMessageDemo | 4789-5240 |
| AI Adapters | adapters | MultiProviderAdapterDemo, AdapterModelSelectorDemo, ProviderHealthDemo, RetryCircuitBreakerDemo, RequestInspectorDemo, AdapterConfigDemo | 5243-5882 |

## Migration Priority

Extract in this order (most independent → most interconnected):
1. Token Optimization (self-contained, no shared state)
2. Streaming (self-contained)
3. Error Handling (self-contained)
4. Code & Dev (self-contained)
5. Data & Forms (self-contained)
6. Everything else
