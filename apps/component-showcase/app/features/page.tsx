'use client'

import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import { Sparkles } from 'lucide-react'

// All demo components imported from per-category extracted files
import {
  // Code & Dev
  CodeDiffViewer,
  TestRunnerPanel,
  FileTreeComponent,
  CommitLog,
  CodeSandboxPreview,
  WebPreviewPanel,
  // Workflows
  HumanInTheLoop,
  TaskOrchestratorDemo,
  ArtifactPanel,
  ChainOfThoughtDemo,
  BookmarksPanel,
  ConfirmationDialogDemo,
  ComponentCardsDemo,
  // Data & Forms
  DataTableDemo,
  DynamicFormDemo,
  CostTrackerDemo,
  EnvironmentVariablesDemo,
  CitationChipsDemo,
  EmptyStateDemo,
  // UI Patterns
  SnippetManagerDemo,
  SchemaDisplayDemo,
  StatsDisplayDemo,
  BeforeAfterDemo,
  LinkPreviewDemo,
  ContextMenuDemo,
  ModelSelectorDemo,
  KeyboardShortcutsDemo,
  SuggestionChipsDemo,
  // Realtime & Status
  ProgressIndicatorsDemo,
  StepsIndicatorDemo,
  RealtimeIndicatorDemo,
  ThreadsViewDemo,
  SafetyComponentsDemo,
  // Voice & Media
  VoiceComponentsDemo,
  RichEmbedDemo,
  MessageActionsDemo,
  ReadReceiptDemo,
  RAGSourcesDemo,
  CalendarDemo,
  QueueDisplayDemo,
  PresetsSelectorDemo,
  // Auth & Settings
  LoginFormDemo,
  SettingsPanelDemo,
  MCPManagerDemo,
  PasswordInputDemo,
  RetryLogicDemo,
  // Social & Chat
  ReactionsDemo,
  QuickReplyDemo,
  PinnedMessagesDemo,
  SocialPostsDemo,
  ChatSidebarDemo,
  CopyButtonDemo,
  ConversationManagerDemo,
  // Tools & Search
  WebSearchDemo,
  TraceViewDemo,
  WorkflowNodesDemo,
  BranchPickerDemo,
  TableOfContentsDemo,
  SortableListDemo,
  // Dev Tools
  DevToolsDashboardDemo,
  APIInspectorDemo,
  ProfilerPanelDemo,
  TimeTravelDemo,
  ModelComparisonDemo,
  // Error Handling
  ErrorDisplayDemo,
  ErrorBoundaryDemo,
  RetryCountdownDemo,
  CircuitBreakerDemo,
  ErrorToastDemo,
  // Token Optimization
  TokenOptimizationDashboardDemo,
  TokenOptimizationPanelDemo,
  TokenCostPreviewDemo,
  TokenUsageMeterDemo,
  TokenCounterDemo,
  TokenBudgetBarDemo,
  TokenOptimizationBadgeDemo,
  TokenROICalculatorDemo,
  // Streaming
  StreamingTextShimmerDemo,
  TextShimmerDemo,
  StreamProgressDemo,
  StreamingCursorDemo,
  TypingIndicatorDemo,
  StreamingMessageDemo,
  // AI Adapters
  MultiProviderAdapterDemo,
  AdapterModelSelectorDemo,
  ProviderHealthDemo,
  RetryCircuitBreakerDemo,
  RequestInspectorDemo,
  AdapterConfigDemo,
} from './demos'

export default function FeaturesPage() {
  return (
    <div className="space-y-12 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -left-40 opacity-20" />
        <div className="orb-primary bottom-40 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Feature Components"
        description="Advanced components for development, code editing, and AI workflows"
        icon={Sparkles}
        badge="60+ Components"
      />

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="code" className="rounded-lg">
            Code & Dev
          </TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-lg">
            Workflows
          </TabsTrigger>
          <TabsTrigger value="data" className="rounded-lg">
            Data & Forms
          </TabsTrigger>
          <TabsTrigger value="ui" className="rounded-lg">
            UI Patterns
          </TabsTrigger>
          <TabsTrigger value="realtime" className="rounded-lg">
            Realtime & Status
          </TabsTrigger>
          <TabsTrigger value="voice" className="rounded-lg">
            Voice & Media
          </TabsTrigger>
          <TabsTrigger value="auth" className="rounded-lg">
            Auth & Settings
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg">
            Social & Chat
          </TabsTrigger>
          <TabsTrigger value="tools" className="rounded-lg">
            Tools & Search
          </TabsTrigger>
          <TabsTrigger value="devtools" className="rounded-lg">
            Dev Tools
          </TabsTrigger>
          <TabsTrigger value="errors" className="rounded-lg">
            Error Handling
          </TabsTrigger>
          <TabsTrigger value="tokens" className="rounded-lg">
            Token Optimization
          </TabsTrigger>
          <TabsTrigger value="streaming" className="rounded-lg">
            Streaming
          </TabsTrigger>
          <TabsTrigger value="adapters" className="rounded-lg">
            AI Adapters
          </TabsTrigger>
        </TabsList>

        {/* ================================================================
            Code & Dev Tab
            ================================================================ */}
        <TabsContent value="code" className="space-y-8">
          <ComponentSection
            title="Code Diff Viewer"
            description="Visualize code changes with syntax highlighting"
          >
            <CodeDiffViewer />
          </ComponentSection>

          <ComponentSection
            title="Test Runner"
            description="Execute and monitor test results"
          >
            <TestRunnerPanel />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="File Explorer"
              description="Navigate project structure"
            >
              <FileTreeComponent />
            </ComponentSection>

            <ComponentSection
              title="Commit History"
              description="View version control commits"
            >
              <CommitLog />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Code Sandbox"
            description="Live code editor with preview"
          >
            <CodeSandboxPreview />
          </ComponentSection>

          <ComponentSection
            title="Web Preview"
            description="Browser-style preview panel"
          >
            <WebPreviewPanel />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Workflows Tab
            ================================================================ */}
        <TabsContent value="workflow" className="space-y-8">
          <ComponentSection
            title="Human in the Loop"
            description="Require human approval for sensitive actions"
          >
            <HumanInTheLoop />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Task Orchestrator"
              description="Visualize multi-step task execution"
            >
              <TaskOrchestratorDemo />
            </ComponentSection>

            <ComponentSection
              title="Artifacts"
              description="Generated outputs and content"
            >
              <ArtifactPanel />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Chain of Thought"
            description="Visualize AI reasoning process"
          >
            <ChainOfThoughtDemo />
          </ComponentSection>

          <ComponentSection
            title="Bookmarks"
            description="Save and organize important content"
          >
            <BookmarksPanel />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Data & Forms Tab
            ================================================================ */}
        <TabsContent value="data" className="space-y-8">
          <ComponentSection
            title="Data Table"
            description="Display structured data"
          >
            <DataTableDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Dynamic Form"
              description="AI-generated form fields"
            >
              <DynamicFormDemo />
            </ComponentSection>

            <ComponentSection
              title="Cost Tracker"
              description="Monitor API usage costs"
            >
              <CostTrackerDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Environment Variables"
            description="Manage configuration secrets"
          >
            <EnvironmentVariablesDemo />
          </ComponentSection>

          <ComponentSection
            title="Citation Chips"
            description="Inline source references"
          >
            <CitationChipsDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            UI Patterns Tab
            ================================================================ */}
        <TabsContent value="ui" className="space-y-8">
          <ComponentSection
            title="Confirmation Dialogs"
            description="User confirmation patterns"
          >
            <ConfirmationDialogDemo />
          </ComponentSection>

          <ComponentSection
            title="Component Cards"
            description="Display component information"
          >
            <ComponentCardsDemo />
          </ComponentSection>

          <ComponentSection
            title="Empty States"
            description="Handle empty content gracefully"
          >
            <EmptyStateDemo />
          </ComponentSection>

          <ComponentSection
            title="Suggestion Chips"
            description="Quick action buttons"
          >
            <SuggestionChipsDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Snippet Manager"
              description="Save and reuse code snippets"
            >
              <SnippetManagerDemo />
            </ComponentSection>

            <ComponentSection
              title="Schema Display"
              description="Visualize data structures"
            >
              <SchemaDisplayDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Stats Display"
            description="Key metrics at a glance"
          >
            <StatsDisplayDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Before/After Comparison"
              description="Image or content comparison slider"
            >
              <BeforeAfterDemo />
            </ComponentSection>

            <ComponentSection
              title="Link Preview"
              description="URL preview cards"
            >
              <LinkPreviewDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Context Menu"
              description="Right-click context menus"
            >
              <ContextMenuDemo />
            </ComponentSection>

            <ComponentSection
              title="Model Selector"
              description="AI model selection interface"
            >
              <ModelSelectorDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Keyboard Shortcuts"
            description="Accessible keyboard navigation"
          >
            <KeyboardShortcutsDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Realtime & Status Tab
            ================================================================ */}
        <TabsContent value="realtime" className="space-y-8">
          <ComponentSection
            title="Progress Indicators"
            description="Show loading and completion states"
          >
            <ProgressIndicatorsDemo />
          </ComponentSection>

          <ComponentSection
            title="Steps Indicator"
            description="Multi-step workflow progress"
          >
            <StepsIndicatorDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Realtime Status"
              description="Live event streaming"
            >
              <RealtimeIndicatorDemo />
            </ComponentSection>

            <ComponentSection
              title="Task Queue"
              description="Queued job management"
            >
              <QueueDisplayDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Conversation Threads"
            description="Threaded discussions"
          >
            <ThreadsViewDemo />
          </ComponentSection>

          <ComponentSection
            title="Safety Components"
            description="Warnings and content moderation"
          >
            <SafetyComponentsDemo />
          </ComponentSection>

          <ComponentSection
            title="Retry Logic"
            description="Handle failures gracefully"
          >
            <RetryLogicDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Voice & Media Tab
            ================================================================ */}
        <TabsContent value="voice" className="space-y-8">
          <ComponentSection
            title="Voice Components"
            description="Audio input and playback"
          >
            <VoiceComponentsDemo />
          </ComponentSection>

          <ComponentSection
            title="Rich Embed"
            description="Media preview cards"
          >
            <RichEmbedDemo />
          </ComponentSection>

          <ComponentSection
            title="Message Actions"
            description="Quick action buttons for messages"
          >
            <MessageActionsDemo />
          </ComponentSection>

          <ComponentSection
            title="Read Receipts"
            description="Message delivery status"
          >
            <ReadReceiptDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="RAG Sources"
              description="Retrieved document references"
            >
              <RAGSourcesDemo />
            </ComponentSection>

            <ComponentSection
              title="Calendar"
              description="Date picker component"
            >
              <CalendarDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        {/* ================================================================
            Auth & Settings Tab
            ================================================================ */}
        <TabsContent value="auth" className="space-y-8">
          <ComponentSection title="Login Form" description="Authentication UI">
            <LoginFormDemo />
          </ComponentSection>

          <ComponentSection
            title="Settings Panel"
            description="Configuration toggles"
          >
            <SettingsPanelDemo />
          </ComponentSection>

          <ComponentSection
            title="Model Presets"
            description="Quick configuration selection"
          >
            <PresetsSelectorDemo />
          </ComponentSection>

          <ComponentSection
            title="MCP Manager"
            description="Model Context Protocol server management"
          >
            <MCPManagerDemo />
          </ComponentSection>

          <ComponentSection
            title="Environment Variables"
            description="Secure configuration management"
          >
            <EnvironmentVariablesDemo />
          </ComponentSection>

          <ComponentSection
            title="Password Input"
            description="Secure password entry with strength indicator"
          >
            <PasswordInputDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Social & Chat Tab
            ================================================================ */}
        <TabsContent value="social" className="space-y-8">
          <ComponentSection
            title="Reactions"
            description="Emoji reactions for messages"
          >
            <ReactionsDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Quick Replies"
              description="Pre-defined response options"
            >
              <QuickReplyDemo />
            </ComponentSection>

            <ComponentSection
              title="Pinned Messages"
              description="Highlight important content"
            >
              <PinnedMessagesDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Social Posts"
            description="Social media style content"
          >
            <SocialPostsDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Chat Sidebar"
              description="Conversation list navigation"
            >
              <ChatSidebarDemo />
            </ComponentSection>

            <ComponentSection
              title="Copy Button"
              description="One-click content copying"
            >
              <CopyButtonDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Conversation Manager"
            description="Manage and export conversations"
          >
            <ConversationManagerDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Tools & Search Tab
            ================================================================ */}
        <TabsContent value="tools" className="space-y-8">
          <ComponentSection
            title="Web Search"
            description="Search the web interface"
          >
            <WebSearchDemo />
          </ComponentSection>

          <ComponentSection
            title="Trace View"
            description="Request execution timeline"
          >
            <TraceViewDemo />
          </ComponentSection>

          <ComponentSection
            title="Workflow Nodes"
            description="Visual workflow builder"
          >
            <WorkflowNodesDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Branch Picker"
              description="Git branch selection"
            >
              <BranchPickerDemo />
            </ComponentSection>

            <ComponentSection
              title="Table of Contents"
              description="Document navigation"
            >
              <TableOfContentsDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Sortable List"
            description="Drag and drop reordering"
          >
            <SortableListDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            Dev Tools Tab
            ================================================================ */}
        <TabsContent value="devtools" className="space-y-8">
          <ComponentSection
            title="Developer Tools Dashboard"
            description="Comprehensive debugging and profiling tools"
          >
            <DevToolsDashboardDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="API Inspector"
              description="Monitor API calls in real-time"
            >
              <APIInspectorDemo />
            </ComponentSection>

            <ComponentSection
              title="Performance Profiler"
              description="Track component performance metrics"
            >
              <ProfilerPanelDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="State Time Travel"
              description="Debug state changes with history"
            >
              <TimeTravelDemo />
            </ComponentSection>

            <ComponentSection
              title="Model Comparison"
              description="Compare AI model responses"
            >
              <ModelComparisonDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        {/* ================================================================
            Error Handling Tab
            ================================================================ */}
        <TabsContent value="errors" className="space-y-8">
          <ComponentSection
            title="Error Display"
            description="Beautiful error presentation with severity levels"
          >
            <ErrorDisplayDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Error Boundary"
              description="React error boundary with recovery"
            >
              <ErrorBoundaryDemo />
            </ComponentSection>

            <ComponentSection
              title="Retry Countdown"
              description="Automatic retry with countdown timer"
            >
              <RetryCountdownDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Circuit Breaker"
              description="Resilience pattern for API calls"
            >
              <CircuitBreakerDemo />
            </ComponentSection>

            <ComponentSection
              title="Error Toast"
              description="Toast notifications for errors"
            >
              <ErrorToastDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        {/* ================================================================
            Token Optimization Tab
            ================================================================ */}
        <TabsContent value="tokens" className="space-y-8">
          <ComponentSection
            title="Token Optimization Dashboard"
            description="Comprehensive token savings and efficiency metrics"
          >
            <TokenOptimizationDashboardDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Token Optimization Panel"
              description="Compact optimization statistics display"
            >
              <TokenOptimizationPanelDemo />
            </ComponentSection>

            <ComponentSection
              title="Token Cost Preview"
              description="Real-time cost estimation as you type"
            >
              <TokenCostPreviewDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Token Usage Meter"
              description="Live token consumption display for streaming"
            >
              <TokenUsageMeterDemo />
            </ComponentSection>

            <ComponentSection
              title="Token Counter"
              description="Track token usage with warnings"
            >
              <TokenCounterDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Token Budget Bar"
            description="Visual progress bar for token budget utilization"
          >
            <TokenBudgetBarDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Token Optimization Badge"
              description="Compact badge showing token savings"
            >
              <TokenOptimizationBadgeDemo />
            </ComponentSection>

            <ComponentSection
              title="Token ROI Calculator"
              description="Calculate ROI for token optimization strategies"
            >
              <TokenROICalculatorDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        {/* ================================================================
            Streaming Tab
            ================================================================ */}
        <TabsContent value="streaming" className="space-y-8">
          <ComponentSection
            title="Streaming Text Shimmer"
            description="Shimmer effect for streaming text content"
          >
            <StreamingTextShimmerDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Text Shimmer Placeholders"
              description="Animated loading placeholders for text"
            >
              <TextShimmerDemo />
            </ComponentSection>

            <ComponentSection
              title="Streaming Progress"
              description="Progress indicator with token count and throughput"
            >
              <StreamProgressDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Streaming Cursor"
              description="Animated cursor for active streaming"
            >
              <StreamingCursorDemo />
            </ComponentSection>

            <ComponentSection
              title="Typing Indicator"
              description="AI typing indicator with variants"
            >
              <TypingIndicatorDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Streaming Message"
            description="Full streaming message with tool calls and thinking"
          >
            <StreamingMessageDemo />
          </ComponentSection>
        </TabsContent>

        {/* ================================================================
            AI Adapters Tab
            ================================================================ */}
        <TabsContent value="adapters" className="space-y-8">
          <ComponentSection
            title="Multi-Provider Adapter"
            description="Switch between AI providers at runtime"
          >
            <MultiProviderAdapterDemo />
          </ComponentSection>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Model Selector"
              description="Select from available models with capabilities"
            >
              <AdapterModelSelectorDemo />
            </ComponentSection>

            <ComponentSection
              title="Provider Health Monitor"
              description="Track provider status and latency"
            >
              <ProviderHealthDemo />
            </ComponentSection>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <ComponentSection
              title="Retry & Circuit Breaker"
              description="Resilience patterns for API calls"
            >
              <RetryCircuitBreakerDemo />
            </ComponentSection>

            <ComponentSection
              title="Request Inspector"
              description="Debug and inspect API requests"
            >
              <RequestInspectorDemo />
            </ComponentSection>
          </div>

          <ComponentSection
            title="Adapter Configuration"
            description="Configure provider-specific settings"
          >
            <AdapterConfigDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
